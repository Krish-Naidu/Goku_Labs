/* ==========================================================================
   GokuLabs — micro-interactions
   Vanilla JS only. Everything degrades gracefully without JavaScript.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- Nav --- */

  const initNav = () => {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    const progress = document.getElementById("scroll-progress");
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);

      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progress.style.width = `${(ratio * 100).toFixed(2)}%`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const closeMenu = () => {
      links?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    };

    toggle?.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links?.classList.toggle("is-open", !open);
    });

    links?.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) closeMenu();
    });
  };

  /* ------------------------------------------------- Active nav section --- */

  const initScrollSpy = () => {
    const links = [...document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  };

  /* -------------------------------------------------------- Scroll reveal - */

  const initReveal = () => {
    const targets = [...document.querySelectorAll("[data-reveal]")];
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.revealDelay || 0);
          window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
  };

  /* ---------------------------------------------------- Hero mouse glow --- */

  const initHeroGlow = () => {
    const hero = document.getElementById("hero");
    const glow = document.getElementById("hero-glow");
    if (!hero || !glow || prefersReducedMotion) return;

    let frame = 0;
    let point = { x: 0.78, y: 0.26 };

    const paint = () => {
      frame = 0;
      glow.style.setProperty("--mx", `${(point.x * 100).toFixed(2)}%`);
      glow.style.setProperty("--my", `${(point.y * 100).toFixed(2)}%`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect = hero.getBoundingClientRect();
        point = {
          x: Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1),
          y: Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1),
        };
        schedule();
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => {
      point = { x: 0.78, y: 0.26 };
      schedule();
    });
  };

  /* ------------------------------------------------- Hero particle field --- */

  const initHeroCanvas = () => {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = document.getElementById("hero");
    let width = 0;
    let height = 0;
    let dots = [];
    let rafId = 0;
    const pointer = { x: 0.5, y: 0.5 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(Math.max(width / 16, 40), 110));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.5,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        hue: Math.random() > 0.68 ? "34, 211, 238" : "139, 92, 246",
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < -20) dot.x = width + 20;
        if (dot.x > width + 20) dot.x = -20;
        if (dot.y < -20) dot.y = height + 20;
        if (dot.y > height + 20) dot.y = -20;

        const drift = Math.hypot(dot.x / width - pointer.x, dot.y / height - pointer.y);
        const alpha = Math.max(0.08, 0.42 - drift * 0.4);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot.hue}, ${alpha})`;
        ctx.fill();

        for (let j = i + 1; j < dots.length; j += 1) {
          const other = dots[j];
          const dx = dot.x - other.x;
          const dy = dot.y - other.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 118) continue;

          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${(0.14 * (1 - dist / 118)).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      rafId = window.requestAnimationFrame(draw);
    };

    build();
    draw();

    const onResize = () => {
      window.cancelAnimationFrame(rafId);
      build();
      draw();
    };

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(onResize, 180);
    });

    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    }, { passive: true });

    // Pause the animation loop when the hero scrolls out of view.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!rafId) draw();
        } else {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      }, { threshold: 0 }).observe(hero);
    }
  };

  /* --------------------------------------------------- Count-up counters --- */

  const initCounters = () => {
    const counters = [...document.querySelectorAll("[data-count]")];
    if (!counters.length || !("IntersectionObserver" in window)) return;

    const run = (el) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target)) return;

      if (prefersReducedMotion) {
        el.textContent = String(target);
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  };

  /* --------------------------------------------------- Card 3D tilt glow --- */

  const initTilt = () => {
    if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let raf = 0;
      let next = null;

      const paint = () => {
        raf = 0;
        if (!next) return;
        const { rx, ry, mx, my } = next;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        card.style.setProperty("--mx", `${mx}%`);
        card.style.setProperty("--my", `${my}%`);
      };

      card.addEventListener(
        "pointermove",
        (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          next = {
            rx: (0.5 - py) * 7,
            ry: (px - 0.5) * 9,
            mx: px * 100,
            my: py * 100,
          };
          if (!raf) raf = window.requestAnimationFrame(paint);
        },
        { passive: true }
      );

      card.addEventListener("pointerleave", () => {
        window.cancelAnimationFrame(raf);
        raf = 0;
        card.style.transform = "";
      });
    });
  };

  /* ----------------------------------------------------- Contact form ----- */

  const initContactForm = () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const status = document.getElementById("form-status");
    const button = document.getElementById("submit-btn");
    const fields = ["name", "email", "message"];
    const hasBackend = form.dataset.backend !== "false";

    const setFieldError = (name, message) => {
      const input = form.elements[name];
      const error = form.querySelector(`[data-error-for="${name}"]`);
      const wrap = input?.closest(".field");
      if (error) error.textContent = message || "";
      wrap?.classList.toggle("has-error", Boolean(message));
    };

    const clearErrors = () => fields.forEach((name) => setFieldError(name, ""));

    const setStatus = (message, kind) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-success", kind === "success");
      status.classList.toggle("is-error", kind === "error");
    };

    // Light-touch client validation for instant feedback.
    const validateClientSide = () => {
      const data = new FormData(form);
      const errors = {};
      const email = String(data.get("email") || "").trim();

      if (!String(data.get("name") || "").trim()) errors.name = "Please tell us your name.";
      if (!email) errors.email = "An email address is required so we can reply.";
      else if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(email)) errors.email = "That email address doesn't look right.";
      if (!String(data.get("message") || "").trim()) errors.message = "Please add a short description of your project.";

      return errors;
    };

    fields.forEach((name) => {
      form.elements[name]?.addEventListener("input", () => setFieldError(name, ""));
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors();
      setStatus("");

      const clientErrors = validateClientSide();
      if (Object.keys(clientErrors).length) {
        Object.entries(clientErrors).forEach(([name, message]) => setFieldError(name, message));
        setStatus("Please check the highlighted fields.", "error");
        form.querySelector(".has-error input, .has-error textarea")?.focus();
        return;
      }

      // Static hosting (GitHub Pages) has no backend — hand off to the mail client.
      if (!hasBackend) {
        const data = new FormData(form);
        const subject = encodeURIComponent(`New project enquiry from ${data.get("name")}`);
        const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
        window.location.href = `mailto:hello@gokolabs.io?subject=${subject}&body=${body}`;
        setStatus("Opening your email app — your message is ready to send.", "success");
        return;
      }

      button?.classList.add("is-loading");
      if (button) button.disabled = true;

      try {
        const endpoint = form.getAttribute("action") || "/api/contact";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (payload.errors) {
            Object.entries(payload.errors).forEach(([name, message]) => setFieldError(name, message));
          }
          setStatus(payload.message || "Something went wrong. Please try again.", "error");
          return;
        }

        form.reset();
        setStatus(payload.message || "Thanks — your message is on its way.", "success");
      } catch {
        setStatus("We couldn't reach the server. Please try again in a moment.", "error");
      } finally {
        button?.classList.remove("is-loading");
        if (button) button.disabled = false;
      }
    });
  };

  /* -------------------------------------------------------------- Misc ---- */

  const initMisc = () => {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", id);
      });
    });
  };

  const boot = () => {
    initNav();
    initScrollSpy();
    initReveal();
    initHeroGlow();
    initHeroCanvas();
    initCounters();
    initTilt();
    initContactForm();
    initMisc();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
