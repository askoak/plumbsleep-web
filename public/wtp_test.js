/* WTP concept test — price-anchored variant assignment (research/26).
   DORMANT BY DEFAULT: nothing renders and no fields are set unless
   WTP_TEST_ENABLED is true. Flipping the flag = starting the test =
   Mike-gated (research/26 "running it is Layer-3"). Behavioral revealed-
   preference only: no survey question, no charge, no deposit. */
(function () {
  var WTP_TEST_ENABLED = false; // ← Mike's trigger flips this to true

  var VARIANTS = { A: 49, B: 69, C: 89 };
  if (!WTP_TEST_ENABLED) return;

  var v;
  try { v = localStorage.getItem('plumb_wtp_variant'); } catch (e) { v = null; }
  if (!v || !VARIANTS[v]) {
    var keys = Object.keys(VARIANTS);
    v = keys[Math.floor(Math.random() * keys.length)];
    try { localStorage.setItem('plumb_wtp_variant', v); } catch (e) {}
  }
  var price = VARIANTS[v];

  // price line above the waitlist form
  var slot = document.getElementById('wtp-price');
  if (slot) {
    slot.textContent = 'Planned price: $' + price +
      ' — reserve your spot and we’ll notify you at launch.';
    slot.hidden = false;
  }
  // tag the signup record
  var pv = document.getElementById('wl-price-variant');
  var dp = document.getElementById('wl-displayed-price');
  if (pv) pv.value = v;
  if (dp) dp.value = String(price);
})();
