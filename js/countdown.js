/**
 * COUNTDOWN — counts down to HACKATHON_CONFIG.eventDateISO and handles
 * the expired state gracefully (no negative numbers, clear messaging).
 */
(function () {
  function initCountdown() {
    const root = document.querySelector("[data-countdown]");
    if (!root) return;
    const cfg = window.HACKATHON_CONFIG;
    const target = new Date(cfg.eventDateISO).getTime();

    const els = {
      days: root.querySelector("[data-cd-days]"),
      hours: root.querySelector("[data-cd-hours]"),
      mins: root.querySelector("[data-cd-mins]"),
      secs: root.querySelector("[data-cd-secs]"),
    };
    const expiredMsg = root.querySelector("[data-cd-expired]");
    const liveWrap = root.querySelector("[data-cd-live]");

    function render() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        if (liveWrap) liveWrap.classList.add("hidden");
        if (expiredMsg) expiredMsg.classList.remove("hidden");
        clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      if (els.days) els.days.textContent = String(d).padStart(2, "0");
      if (els.hours) els.hours.textContent = String(h).padStart(2, "0");
      if (els.mins) els.mins.textContent = String(m).padStart(2, "0");
      if (els.secs) els.secs.textContent = String(s).padStart(2, "0");
    }

    render();
    const timer = setInterval(render, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCountdown);
  } else {
    initCountdown();
  }
})();
