/**
 * REGISTER — client-side validation + simulated submission flow.
 *
 * SECURITY / BACKEND NOTE (see README):
 * This is a FRONT-END DEMO ONLY. It does not send data anywhere, does not
 * process real payments, and does not persist data beyond the page session.
 * A production deployment MUST:
 *   - Validate everything again server-side (never trust client validation)
 *   - Read/write seat counts from an authoritative backend/database
 *   - Use a real, PCI-compliant payment gateway (Razorpay/Stripe/etc.) —
 *     never hard-code payment credentials or secrets in client code
 *   - Generate participant IDs server-side to prevent duplication/spoofing
 */
(function () {
  function qs(id) { return document.getElementById(id); }

  function initRegisterForm() {
    const form = qs("registerForm");
    if (!form) return;

    const seatState = window.SeatEngine ? window.SeatEngine.getState() : null;
    const soldOutPanel = qs("regSoldOutPanel");
    const successPanel = qs("regSuccessPanel");

    // ---- Sold-out gate (checked BEFORE rendering the form as usable) ----
    if (seatState && seatState.soldOut) {
      form.classList.add("hidden");
      if (soldOutPanel) soldOutPanel.style.display = "block";
      return;
    }

    // Disable whichever tier is sold out, without faking numbers.
    const tierEarly = qs("tierEarly");
    const tierStandard = qs("tierStandard");
    const earlyBirdOption = qs("earlyBirdOption");
    const standardOption = qs("standardOption");

    if (seatState) {
      if (seatState.earlyBird.soldOut) {
        tierEarly.disabled = true;
        earlyBirdOption.classList.add("is-disabled");
      }
      if (seatState.standard.soldOut) {
        tierStandard.disabled = true;
        standardOption.classList.add("is-disabled");
      }
    }

    [tierEarly, tierStandard].forEach((input) => {
      input.addEventListener("change", () => {
        earlyBirdOption.classList.toggle("is-selected", tierEarly.checked);
        standardOption.classList.toggle("is-selected", tierStandard.checked);
      });
    });

    // simple duplicate-registration guard using sessionStorage (demo-level only)
    function alreadyRegisteredThisSession() {
      try {
        return sessionStorage.getItem("hackathon_registered") === "true";
      } catch (e) {
        return false;
      }
    }
    function markRegisteredThisSession() {
      try { sessionStorage.setItem("hackathon_registered", "true"); } catch (e) {}
    }

    if (alreadyRegisteredThisSession()) {
      form.classList.add("hidden");
      showDuplicateNotice();
    }

    function showDuplicateNotice() {
      const topError = qs("formTopError");
      if (!topError) return;
      topError.textContent = "It looks like you've already registered in this session. If this is a mistake, please contact us.";
      topError.classList.remove("hidden");
      topError.classList.add("alert--warning");
      topError.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // ---- Validators ----
    const validators = {
      fullName: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: (v) => /^[+]?[\d\s-]{10,15}$/.test(v.trim()),
      age: (v) => Number(v) >= 13 && Number(v) <= 100,
      city: (v) => v.trim().length >= 2,
      education: (v) => v.trim().length > 0,
      github: (v) => /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(v.trim()),
      experience: (v) => v.trim().length > 0,
    };

    function fieldEl(name) { return qs(name); }
    function errEl(name) { return qs("err-" + name); }

    function validateField(name) {
      const el = fieldEl(name);
      if (!el) return true;
      const ok = validators[name] ? validators[name](el.value) : true;
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      const err = errEl(name);
      if (err) err.classList.toggle("hidden", ok);
      return ok;
    }

    Object.keys(validators).forEach((name) => {
      const el = fieldEl(name);
      if (el) {
        el.addEventListener("blur", () => validateField(name));
        el.addEventListener("input", () => {
          if (el.getAttribute("aria-invalid") === "true") validateField(name);
        });
      }
    });

    function validateCheckbox(id) {
      const el = qs(id);
      const ok = el.checked;
      const err = qs("err-" + id);
      if (err) err.classList.toggle("hidden", ok);
      return ok;
    }

    function validateTier() {
      const ok = tierEarly.checked || tierStandard.checked;
      qs("err-tier").classList.toggle("hidden", ok);
      return ok;
    }

    function generateParticipantId() {
      const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
      return "AAWH26-" + rand;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const topError = qs("formTopError");
      topError.classList.add("hidden");
      topError.classList.remove("alert--warning");

      let valid = true;
      Object.keys(validators).forEach((name) => {
        if (!validateField(name)) valid = false;
      });
      if (!validateCheckbox("consentData")) valid = false;
      if (!validateCheckbox("acceptTerms")) valid = false;
      if (!validateTier()) valid = false;

      const statusRegion = qs("formStatus");

      if (!valid) {
        topError.textContent = "Please fix the highlighted fields before submitting.";
        topError.classList.remove("hidden");
        if (statusRegion) statusRegion.textContent = "Form has errors. Please review the highlighted fields.";
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // ---- Simulated loading state ----
      const submitBtn = qs("submitBtn");
      const submitBtnText = qs("submitBtnText");
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-disabled", "true");
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = "Processing…";
      if (statusRegion) statusRegion.textContent = "Processing your registration, please wait.";

      // Simulate network latency (replace with a real API call in production)
      setTimeout(function () {
        try {
          const pid = generateParticipantId();
          const name = qs("fullName").value.trim();

          qs("successPid").textContent = pid;
          qs("successName").textContent = name;

          const waBtn = qs("whatsappJoinBtn");
          if (waBtn) {
            waBtn.href = "https://wa.me/910000000000?text=" + encodeURIComponent("Hi, I just registered for Agartala AI Website Hackathon 2026. My participant ID is " + pid);
          }

          form.classList.add("hidden");
          successPanel.style.display = "block";
          successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
          markRegisteredThisSession();

          if (statusRegion) statusRegion.textContent = "Registration successful. Your participant ID is " + pid + ".";
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.setAttribute("aria-disabled", "false");
          submitBtnText.textContent = originalText;
          topError.textContent = "Something went wrong while processing your registration. Please try again, or contact us if the problem continues.";
          topError.classList.remove("hidden");
          if (statusRegion) statusRegion.textContent = "An error occurred during registration.";
        }
      }, 900);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegisterForm);
  } else {
    initRegisterForm();
  }
})();
