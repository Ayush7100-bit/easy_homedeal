const EH = {
  wishlistButtons: new WeakSet(),
  motion: {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    observer: null,
    observed: new WeakSet(),
    tiltBound: new WeakSet(),
    magneticBound: new WeakSet(),
    frame: 0,
    init() {
      if (!EH.motion.reduced) document.documentElement.classList.add("motion-enabled");
      EH.motion.enhanceTestimonials();
      if (!EH.motion.reduced) {
        if ("IntersectionObserver" in window) {
          EH.motion.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              EH.motion.observer.unobserve(entry.target);
            });
          }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
        }
        EH.motion.prepare(document);
        if ("MutationObserver" in window && document.body) {
          const observer = new MutationObserver(records => records.forEach(record => {
            if (record.type === "attributes") {
              if (!record.target.hidden) EH.motion.prepare(record.target);
              return;
            }
            record.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) EH.motion.prepare(node);
            });
          }));
          observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
        }
        EH.motion.bindScroll();
      }
      EH.motion.bindModalAccessibility();
    },
    enhanceTestimonials() {
      const grid = document.querySelector(".testimonials .testimonial-grid");
      if (!grid || !grid.children.length) return;
      const viewport = document.createElement("div");
      viewport.className = "testimonial-viewport";
      grid.parentNode.insertBefore(viewport, grid);
      viewport.appendChild(grid);
      grid.classList.add("testimonial-track");
      const controls = document.createElement("div");
      controls.className = "testimonial-controls";
      controls.setAttribute("role", "group");
      controls.setAttribute("aria-label", "Testimonial controls");
      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "testimonial-nav";
      previous.setAttribute("aria-label", "Previous testimonial");
      previous.innerHTML = '<i class="bi bi-arrow-left" aria-hidden="true"></i>';
      const next = document.createElement("button");
      next.type = "button";
      next.className = "testimonial-nav";
      next.setAttribute("aria-label", "Next testimonial");
      next.innerHTML = '<i class="bi bi-arrow-right" aria-hidden="true"></i>';
      const indicators = document.createElement("div");
      indicators.className = "testimonial-indicators";
      indicators.setAttribute("role", "group");
      indicators.setAttribute("aria-label", "Choose a testimonial");
      const slides = [...grid.children];
      let activeIndex = 0;
      const dots = slides.map((slide, index) => {
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "testimonial-dot";
        dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
        dot.addEventListener("click", () => showSlide(index));
        indicators.appendChild(dot);
        return dot;
      });
      function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;
        grid.style.setProperty("--testimonial-index", activeIndex);
        slides.forEach((slide, slideIndex) => slide.setAttribute("aria-hidden", String(slideIndex !== activeIndex)));
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("active", dotIndex === activeIndex);
          if (dotIndex === activeIndex) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      }
      previous.addEventListener("click", () => showSlide(activeIndex - 1));
      next.addEventListener("click", () => showSlide(activeIndex + 1));
      controls.append(previous, indicators, next);
      viewport.after(controls);
      viewport.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showSlide(activeIndex - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          showSlide(activeIndex + 1);
        }
      });
      showSlide(0);
    },
    prepare(root) {
      const selectors = [
        ".page-heading > *", ".section-heading", ".property-card", ".location-card",
        ".location-showcase", ".benefit-grid article", ".steps article",
        ".testimonial-grid article", ".cta-banner", ".about-hero > *",
        ".story-grid article", ".commitment > *", ".contact-cards article",
        ".contact-form", ".faq details", ".gallery-wrap", ".detail-main > *",
        ".owner-card", ".property-features > div", ".property-amenities",
        ".admin-stats article", ".admin-form", ".admin-lists > div", ".admin-gate",
        ".empty-state"
      ];
      const elements = [];
      if (root.matches && selectors.some(selector => root.matches(selector))) elements.push(root);
      if (root.querySelectorAll) elements.push(...root.querySelectorAll(selectors.join(",")));
      const magneticTargets = [];
      if (root.matches && root.matches(".hero-cta, .cta-banner .primary-btn")) magneticTargets.push(root);
      if (root.querySelectorAll) magneticTargets.push(...root.querySelectorAll(".hero-cta, .cta-banner .primary-btn"));
      magneticTargets.forEach(EH.motion.bindMagnetic);
      elements.forEach(element => {
        if (element.closest("[hidden]")) return;
        if (!element.hasAttribute("data-reveal")) element.dataset.reveal = "up";
        const grid = element.closest(".property-grid, .location-grid, .location-cards, .benefit-grid, .steps, .testimonial-grid, .story-grid, .contact-cards, .admin-stats");
        if (grid) {
          const index = Array.prototype.indexOf.call(grid.children, element);
          element.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 70}ms`);
        }
        if (EH.motion.observer && !EH.motion.observed.has(element)) {
          EH.motion.observed.add(element);
          EH.motion.observer.observe(element);
        } else if (!EH.motion.observer) {
          element.classList.add("is-visible");
        }
        EH.motion.bindTilt(element);
        EH.motion.bindMagnetic(element);
      });
    },
    bindTilt(element) {
      if (!EH.motion.finePointer || !element.matches(".property-card") || EH.motion.tiltBound.has(element)) return;
      EH.motion.tiltBound.add(element);
      element.addEventListener("pointermove", event => {
        if (EH.motion.reduced) return;
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        element.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
        element.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
      });
    },
    bindMagnetic(element) {
      if (!EH.motion.finePointer || !element.matches(".hero-cta, .cta-banner .primary-btn") || EH.motion.magneticBound.has(element)) return;
      EH.motion.magneticBound.add(element);
      element.addEventListener("pointermove", event => {
        if (EH.motion.reduced) return;
        const bounds = element.getBoundingClientRect();
        element.style.setProperty("--magnet-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.08}px`);
        element.style.setProperty("--magnet-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--magnet-x", "0px");
        element.style.setProperty("--magnet-y", "0px");
      });
    },
    bindScroll() {
      const header = document.querySelector("header");
      const hero = document.querySelector(".hero");
      const backToTop = document.getElementById("backToTop");
      let queued = false;
      const update = () => {
        queued = false;
        const scrollY = window.scrollY;
        if (header) header.classList.toggle("is-scrolled", scrollY > 24);
        if (backToTop) backToTop.classList.toggle("show", scrollY > 500);
        if (hero && EH.motion.finePointer && !EH.motion.reduced) {
          const bounds = hero.getBoundingClientRect();
          if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
            hero.style.setProperty("--hero-offset", `${Math.round(bounds.top * -0.025)}px`);
          }
        }
      };
      window.addEventListener("scroll", () => {
        if (queued) return;
        queued = true;
        EH.motion.frame = window.requestAnimationFrame(update);
      }, { passive: true });
      update();
    },
    bindModalAccessibility() {
      const modal = document.getElementById("contactModal");
      const openButton = document.getElementById("contactOwner");
      const closeButton = document.getElementById("closeModal");
      if (!modal || !openButton || !closeButton) return;
      openButton.addEventListener("click", () => {
        if (modal.hidden) return;
        window.requestAnimationFrame(() => modal.querySelector("input, textarea, button, a")?.focus());
      });
      closeButton.addEventListener("click", () => {
        openButton.focus();
      });
      modal.addEventListener("keydown", event => {
        if (event.key !== "Tab") return;
        const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])')]
          .filter(element => element.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.hidden) {
          closeButton.click();
          document.body.classList.remove("modal-open");
        }
      });
    }
  },
  properties() {
    const saved = localStorage.getItem("easyHomeProperties");
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    localStorage.setItem("easyHomeProperties", JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES;
  },
  saveProperties(items) { localStorage.setItem("easyHomeProperties", JSON.stringify(items)); },
  wishlist() {
    try { return JSON.parse(localStorage.getItem("easyHomeWishlist") || "[]"); }
    catch (_) { return []; }
  },
  saveWishlist(ids) { localStorage.setItem("easyHomeWishlist", JSON.stringify(ids)); },
  user() {
    try { return JSON.parse(localStorage.getItem("easyHomeUser") || "null"); } catch (_) { return null; }
  },
  isLoggedIn() { return localStorage.getItem("easyHomeLoggedIn") === "true" && !!EH.user(); },
  toast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(EH.toastTimer);
    EH.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  },
  money(value) { return "₹" + Number(value).toLocaleString("en-IN"); },
  card(property) {
    const wished = EH.wishlist().includes(property.id);
    return `<article class="property-card ${property.badge === "Featured" || property.badge === "Premium" ? "property-card-featured" : ""}" data-reveal="up">
      <div class="property-image">
        <span class="property-badge">${property.type || property.badge || "Available"}</span>
        <button class="wish-btn ${wished ? "active" : ""}" data-wish="${property.id}" aria-label="${wished ? "Remove from" : "Add to"} wishlist">♥</button>
        <img src="${property.image}" alt="${property.title}" loading="lazy">
      </div>
      <div class="property-info">
        <p class="property-type">${property.furnishing || "Ready to move"}</p>
        <h3>${property.title}</h3>
        <p class="property-location"><i class="bi bi-geo-alt"></i> ${property.location}, Gurgaon</p>
        <p class="property-availability"><i class="bi bi-calendar-check"></i> ${property.available || "Availability on request"}</p>
        <div class="property-meta"><span><i class="bi bi-door-open"></i> ${property.bedrooms} bed</span><span><i class="bi bi-droplet"></i> ${property.bathrooms} bath</span><span>${property.area} sq ft</span></div>
        <div class="property-bottom"><strong>${EH.money(property.price)}<span> / month</span></strong><a href="property.html?id=${property.id}" class="view-btn">View home <i class="bi bi-arrow-up-right"></i></a></div>
      </div>
    </article>`;
  },
  toggleWishlist(id, button) {
    id = Number(id);
    let ids = EH.wishlist();
    if (ids.includes(id)) {
      ids = ids.filter(item => item !== id);
      EH.saveWishlist(ids);
      if (button) button.classList.remove("active");
      EH.toast("Removed from wishlist");
    } else {
      ids.push(id);
      EH.saveWishlist(ids);
      if (button) button.classList.add("active");
      EH.toast("Added to wishlist");
    }
    if (button) {
      button.setAttribute("aria-label", `${ids.includes(id) ? "Remove from" : "Add to"} wishlist`);
      button.classList.remove("wish-pop");
      void button.offsetWidth;
      button.classList.add("wish-pop");
    }
    document.querySelectorAll("[data-wishlist-count]").forEach(el => {
      el.textContent = ids.length;
      el.classList.remove("count-pop");
      void el.offsetWidth;
      el.classList.add("count-pop");
    });
  },
  initNav() {
    const count = EH.wishlist().length;
    document.querySelectorAll("[data-wishlist-count]").forEach(el => el.textContent = count);
    const menu = document.getElementById("menuToggle");
    const links = document.getElementById("navLinks");
    if (menu && links) {
      const updateMenuState = isOpen => {
        menu.setAttribute("aria-expanded", String(isOpen));
        menu.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} menu`);
        const icon = menu.querySelector("i");
        if (icon) icon.className = `bi ${isOpen ? "bi-x" : "bi-list"}`;
      };
      updateMenuState(false);
      menu.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");
        updateMenuState(isOpen);
      });
      links.addEventListener("click", event => {
        if (event.target.closest("a")) {
          links.classList.remove("open");
          updateMenuState(false);
        }
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && links.classList.contains("open")) {
          links.classList.remove("open");
          updateMenuState(false);
          menu.focus();
        }
      });
    }

    const auth = document.querySelector("[data-auth]");
    if (auth) {
      if (EH.isLoggedIn()) {
        const user = EH.user();
        auth.innerHTML = `<div class="profile-menu"><button class="profile-btn" id="profileBtn">Hi, ${user.name.split(" ")[0]} ▾</button><div class="profile-dropdown" id="profileDropdown"><a href="wishlist.html">My Wishlist</a><a href="admin.html">Admin Demo</a><button id="logoutBtn">Logout</button></div></div>`;
        document.getElementById("profileBtn")?.addEventListener("click", () => document.getElementById("profileDropdown").classList.toggle("open"));
        document.getElementById("logoutBtn")?.addEventListener("click", () => {
          localStorage.removeItem("easyHomeLoggedIn");
          EH.toast("Logged out successfully");
          setTimeout(() => location.reload(), 300);
        });
      } else {
        auth.innerHTML = `<a class="login-link" href="login.html">Login</a><a class="signup-link" href="register.html">Sign Up</a>`;
      }
    }
  },
  initWishlistButtons(root = document) {
    root.querySelectorAll("[data-wish]").forEach(button => {
      if (EH.wishlistButtons.has(button)) return;
      EH.wishlistButtons.add(button);
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        EH.toggleWishlist(button.dataset.wish, button);
      });
    });
  },
  init() {
    EH.initNav();
    EH.initWishlistButtons();
    document.addEventListener("error", event => {
      if (!(event.target instanceof HTMLImageElement)) return;
      const container = event.target.closest(".property-image, .location-showcase, .main-gallery");
      if (container) container.classList.add("image-fallback");
    }, true);
    EH.motion.init();
  }
};

document.addEventListener("DOMContentLoaded", EH.init);
