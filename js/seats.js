/**
 * SEATS — computes genuine Early Bird / Standard availability from a single
 * mock "registeredCount" value. No fake scarcity: numbers only ever reflect
 * HACKATHON_CONFIG.mockRegisteredCount out of totalSeats.
 *
 * IMPORTANT (see README): in production this MUST be replaced by a live
 * backend read (e.g. a REST endpoint or database count). Never trust a
 * client-side seat count or payment status for real seat allocation or
 * pricing decisions — this file is a front-end demo only.
 */
window.SeatEngine = (function () {
  function getState() {
    const cfg = window.HACKATHON_CONFIG;
    const total = cfg.totalSeats;
    const earlyBirdTotal = cfg.earlyBirdSeats;
    const standardTotal = total - earlyBirdTotal;
    const registered = Math.min(cfg.mockRegisteredCount, total);

    const earlyBirdFilled = Math.min(registered, earlyBirdTotal);
    const standardFilled = Math.max(0, registered - earlyBirdTotal);

    const earlyBirdLeft = Math.max(0, earlyBirdTotal - earlyBirdFilled);
    const standardLeft = Math.max(0, standardTotal - standardFilled);
    const totalLeft = Math.max(0, total - registered);

    return {
      total, registered, totalLeft,
      earlyBird: { total: earlyBirdTotal, filled: earlyBirdFilled, left: earlyBirdLeft, soldOut: earlyBirdLeft === 0 },
      standard: { total: standardTotal, filled: standardFilled, left: standardLeft, soldOut: standardLeft === 0 },
      soldOut: totalLeft === 0
    };
  }

  function renderInto(root) {
    if (!root) return;
    const state = getState();
    const cfg = window.HACKATHON_CONFIG;

    const totalLeftEl = root.querySelector("[data-seats-left]");
    const fillEl = root.querySelector("[data-seats-fill]");
    const ebLeftEl = root.querySelector("[data-eb-left]");
    const stdLeftEl = root.querySelector("[data-std-left]");
    const soldOutEl = root.querySelector("[data-sold-out]");
    const liveWrap = root.querySelector("[data-seats-live]");

    if (totalLeftEl) totalLeftEl.textContent = state.totalLeft;
    if (fillEl) fillEl.style.width = Math.min(100, (state.registered / state.total) * 100) + "%";
    if (ebLeftEl) {
      ebLeftEl.textContent = state.earlyBird.soldOut ? "Sold out" : `${state.earlyBird.left} of ${state.earlyBird.total} left`;
    }
    if (stdLeftEl) {
      stdLeftEl.textContent = state.standard.soldOut ? "Sold out" : `${state.standard.left} of ${state.standard.total} left`;
    }
    if (state.soldOut) {
      if (liveWrap) liveWrap.classList.add("hidden");
      if (soldOutEl) soldOutEl.classList.remove("hidden");
    }
    return state;
  }

  function initAll() {
    document.querySelectorAll("[data-seats]").forEach(renderInto);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  return { getState, renderInto };
})();
