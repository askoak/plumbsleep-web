// Tally webhook → HMAC verify → idempotency check → Tremendous POST /orders → ledger row
// Replaces the disabled Zapier integration (2026-06-15).
//
// Env vars (set in Netlify, never committed):
//   TALLY_WEBHOOK_SECRET   — Tally signing secret (set via API, T5)
//   TREMENDOUS_PROD_TOKEN  — Bearer token for Tremendous prod API
//   TREMENDOUS_CAMPAIGN_ID — "Plumb Survey Reward $5" campaign ID
//   NETLIFY_SITE_ID        — Site ID for explicit Blobs context
//   NETLIFY_BLOBS_TOKEN    — Netlify API token for Blobs auth

import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const TREMENDOUS_API = 'https://api.tremendous.com/api/v2/orders';
const LEDGER_STORE   = 'plumb-reward-ledger';

// Returns first 8 hex chars of SHA-256 for PII-safe correlation logging.
function hashPrefix(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 8);
}

// Constant-time HMAC-SHA256 base64 comparison (Tally's signing format).
function verifyTallySignature(rawBody, sigHeader, secret) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(sigHeader), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }

  // Netlify may base64-encode binary bodies; decode to raw UTF-8 string for HMAC.
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
    : (event.body ?? '');

  const sigHeader = event.headers['tally-signature'];
  const secret    = process.env.TALLY_WEBHOOK_SECRET;

  if (!sigHeader || !secret) {
    console.log(JSON.stringify({ event: 'relay_failed', error_code: 'missing_signature', timestamp: new Date().toISOString() }));
    return { statusCode: 401, body: JSON.stringify({ error: 'invalid_signature' }) };
  }

  if (!verifyTallySignature(rawBody, sigHeader, secret)) {
    console.log(JSON.stringify({ event: 'relay_failed', error_code: 'invalid_signature', timestamp: new Date().toISOString() }));
    return { statusCode: 401, body: JSON.stringify({ error: 'invalid_signature' }) };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  const { data } = payload;
  if (!data?.responseId || !Array.isArray(data?.fields)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_payload' }) };
  }

  const { responseId } = data;
  const ts = new Date().toISOString();

  console.log(JSON.stringify({ event: 'relay_received', responseId, timestamp: ts }));

  // The form has exactly one INPUT_EMAIL block (uuid 8447d6c7, "Where should we send your $5…").
  const emailField = data.fields.find(f => f.type === 'INPUT_EMAIL');
  const email = emailField?.value?.trim() ?? '';

  if (!email) {
    // Abandoned survey or non-side-sleeper early-exit — no reward owed.
    console.log(JSON.stringify({ event: 'relay_skipped', responseId, reason: 'no_email', timestamp: ts }));
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'no_email', reason: 'survey abandoned before email field' }),
    };
  }

  // Name field: "How should we address you?" INPUT_TEXT (uuid aad6e7cc).
  const nameField = data.fields.find(
    f => f.type === 'INPUT_TEXT' && /address you/i.test(f.label ?? '')
  );
  const recipientName = nameField?.value?.trim() || 'Plumb respondent';

  // Idempotency: one reward per responseId.
  // Pass siteID + token explicitly — Lambda v1 runtime doesn't auto-inject NETLIFY_BLOBS_CONTEXT.
  const store = getStore({ name: LEDGER_STORE, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
  const existing = await store.get(responseId, { type: 'json' });

  if (existing?.status === 'succeeded') {
    console.log(JSON.stringify({
      event: 'relay_skipped', responseId, reason: 'already_paid',
      tremendous_order_id: existing.tremendous_order_id, timestamp: ts,
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'already_paid', tremendous_order_id: existing.tremendous_order_id }),
    };
  }
  // status === 'failed' → fall through and retry.

  // Dry-run override: ?test_amount=1 accepted only when responseId starts with TEST-DRYRUN-.
  const params       = event.queryStringParameters ?? {};
  const isDryRun     = responseId.startsWith('TEST-DRYRUN-') && params.test_amount;
  const denomination = isDryRun ? parseFloat(params.test_amount) : 5.00;

  const orderBody = {
    external_id: responseId,
    payment: { funding_source_id: 'BALANCE' },
    rewards: [{
      campaign_id: process.env.TREMENDOUS_CAMPAIGN_ID,
      recipient: { name: recipientName, email },
      delivery: { method: 'EMAIL' },
      value: { denomination, currency_code: 'USD' },
    }],
  };

  let tres;
  try {
    tres = await fetch(TREMENDOUS_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TREMENDOUS_PROD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderBody),
    });
  } catch (err) {
    // Network / DNS failure — signal Tally to retry.
    await store.set(responseId, JSON.stringify({
      responseId, email_hash: hashPrefix(email), status: 'failed',
      retry: true, error_code: 'network_error', timestamp: ts, amount: denomination,
    }));
    console.log(JSON.stringify({ event: 'relay_failed', responseId, error_code: 'network_error', timestamp: ts }));
    return { statusCode: 500, body: JSON.stringify({ error: 'tremendous_unavailable' }) };
  }

  let tresData = {};
  try { tresData = await tres.json(); } catch { /* ignore non-JSON bodies */ }

  if (tres.ok) {
    const orderId = tresData.order?.id ?? tresData.order?.rewards?.[0]?.id ?? 'unknown';
    await store.set(responseId, JSON.stringify({
      responseId, email_hash: hashPrefix(email), tremendous_order_id: orderId,
      status: 'succeeded', timestamp: ts, amount: denomination,
    }));
    console.log(JSON.stringify({ event: 'relay_succeeded', responseId, tremendous_order_id: orderId, timestamp: ts }));
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'succeeded', tremendous_order_id: orderId, responseId }),
    };
  }

  if (tres.status >= 400 && tres.status < 500) {
    // Bad payload or auth — don't retry; Tally will not fix itself.
    const errorCode    = tresData.errors?.[0]?.code    ?? `http_${tres.status}`;
    const errorMessage = tresData.errors?.[0]?.message ?? tres.statusText;
    await store.set(responseId, JSON.stringify({
      responseId, email_hash: hashPrefix(email), status: 'failed',
      error_code: errorCode, error_message: errorMessage, timestamp: ts, amount: denomination,
    }));
    console.log(JSON.stringify({ event: 'relay_failed', responseId, error_code: errorCode, timestamp: ts }));
    return { statusCode: 200, body: JSON.stringify({ status: 'failed', error_code: errorCode }) };
  }

  // 5xx — Tremendous outage, signal Tally to retry.
  const errCode = `http_${tres.status}`;
  await store.set(responseId, JSON.stringify({
    responseId, email_hash: hashPrefix(email), status: 'failed',
    retry: true, error_code: errCode, timestamp: ts, amount: denomination,
  }));
  console.log(JSON.stringify({ event: 'relay_failed', responseId, error_code: errCode, timestamp: ts }));
  return { statusCode: 500, body: JSON.stringify({ error: 'tremendous_error' }) };
};
