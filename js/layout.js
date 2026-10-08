/**
 * LAYOUT — injects shared header/nav and footer markup into every page,
 * so nav/footer stay consistent from one edit point. Pages include a
 * <div id="site-header"></div> and <div id="site-footer"></div> placeholder.
 */
(function () {
  const NAV_ITEMS = [
    { href: "index.html", label: "Home" },
    { href: "pages/about.html", label: "About" },
    { href: "pages/rules.html", label: "Rules" },
    { href: "pages/schedule.html", label: "Schedule" },
    { href: "pages/prizes.html", label: "Prizes" },
    { href: "pages/faq.html", label: "FAQ" },
    { href: "pages/contact.html", label: "Contact" },
    { href: "pages/results.html", label: "Results" }
  ];

  function currentFile() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1) || "index.html";
  }

  function pathPrefix() {
    // pages/*.html need "../" to reach root assets; index.html needs none.
    return window.location.pathname.includes("/pages/") ? "../" : "";
  }

  function buildHeader() {
    const prefix = pathPrefix();
    const here = currentFile();
    const links = NAV_ITEMS.map((item) => {
      const href = prefix + item.href;
      const fileOfHref = item.href.split("/").pop();
      const isCurrent = fileOfHref === here;
      return `<li><a href="${href}"${isCurrent ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
    }).join("");

    return `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <nav class="nav-wrap container" aria-label="Primary">
        <a class="brand" href="${prefix}index.html">
          <span class="brand-mark" aria-hidden="true">A</span>
          <span>Agartala AI Hackathon</span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle navigation menu">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <ul class="nav-links" id="navLinks">
          ${links}
          <li class="nav-links-cta-item"><a class="btn btn--primary btn--sm btn--block" href="${prefix}pages/register.html">Register Now</a></li>
        </ul>
        <div class="nav-cta" id="navCta">
          <a class="btn btn--primary btn--sm" href="${prefix}pages/register.html">Register Now</a>
        </div>
      </nav>
    </header>`;
  }

  function buildFooter() {
    const prefix = pathPrefix();
    const cfg = window.HACKATHON_CONFIG || {};
    const year = new Date().getFullYear();
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">Agartala AI Website Hackathon</div>
            <p style="color:#B8B3A6; font-size: var(--fs-sm); max-width: 32ch;">
              An independent, community-run coding hackathon for students, developers and
              freelancers in Agartala, Tripura — build a complete website with AI assistance
              in two hours.
            </p>
          </div>
          <div>
            <h4>Event</h4>
            <ul>
              <li><a href="${prefix}index.html">Home</a></li>
              <li><a href="${prefix}pages/about.html">About</a></li>
              <li><a href="${prefix}pages/rules.html">Rules</a></li>
              <li><a href="${prefix}pages/schedule.html">Schedule</a></li>
              <li><a href="${prefix}pages/prizes.html">Prizes</a></li>
              <li><a href="${prefix}pages/results.html">Results</a></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="${prefix}pages/faq.html">FAQ</a></li>
              <li><a href="${prefix}pages/contact.html">Contact Us</a></li>
              <li><a href="${prefix}pages/register.html">Register</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="${prefix}pages/privacy.html">Privacy Policy</a></li>
              <li><a href="${prefix}pages/terms.html">Terms &amp; Conditions</a></li>
              <li><a href="${prefix}pages/refund.html">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} Agartala AI Website Hackathon. Independent community event — not an official Anthropic or GitHub partnership.</span>
          <span>Made in Agartala, Tripura 🇮🇳</span>
        </div>
      </div>
    </footer>
    <button class="back-to-top" id="backToTop" aria-label="Back to top">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
    </button>`;
  }

  function mountLayout() {
    const headerMount = document.getElementById("site-header");
    const footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.outerHTML = buildHeader();
    if (footerMount) footerMount.outerHTML = buildFooter();

    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }

    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
      window.addEventListener("scroll", () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 500);
      }, { passive: true });
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountLayout);
  } else {
    mountLayout();
  }
})();
