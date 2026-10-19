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

  /* ---------------------------------------------------- Starfield canvas --- */
  /* Fixed, full-viewport constellation field that sits behind the whole page,
     so the motif carries past the hero like the reference design. */

  const initStarfield = () => {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion should silence the movement, not delete the design — so
    // those visitors get one static frame instead of a continuously animated one.
    const staticFrame = prefersReducedMotion;

    const LINK_DISTANCE = 120;
    const POINTER_RADIUS = 150;
    const ZOOM = 0.97;

    let width = 0;
    let height = 0;
    let stars = [];
    let rafId = 0;
    let scrolling = false;
    let scrollIdle = 0;

    const pointer = { x: -1000, y: -1000 };
    const scroll = { y: window.scrollY, velocity: 0 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(Math.max((width * height) / 17000, 40), 120));
      stars = Array.from({ length: count }, () => {
        const big = Math.random() > 0.82;
        const radius = big ? Math.random() * 1.2 + 1.7 : Math.random() * 1.4 + 0.5;
        const hue = Math.random() > 0.7 ? "34, 211, 238" : "139, 92, 246";
        const speed = (0.06 + Math.random() * 0.16) * (big ? 0.6 : 1);
        const angle = Math.random() * Math.PI * 2;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          hue,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.5 + Math.random() * 1.6,
          depth: big ? 1 : 0.55 + Math.random() * 0.45,
          alpha: big ? 0.78 : 0.38 + Math.random() * 0.4,
        };
      });
    };

    const draw = (time) => {
      // Scroll parallax: stars crease with the page then settle back.
      scroll.velocity *= 0.92;
      const parallax = staticFrame ? 0 : scroll.velocity;

      // Scale down around the centre to create the "formed constellation" framing.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width / 2, height / 2);
      ctx.scale(ZOOM, ZOOM);
      ctx.translate(-width / 2, -height / 2);

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];

        const dxp = pointer.x - star.x;
        const dyp = pointer.y - star.y;
        const pointerDistance = Math.hypot(dxp, dyp);

        // Gentle repulsion, mirroring the reference's pointer interaction.
        if (!staticFrame && pointerDistance < POINTER_RADIUS && pointerDistance > 0) {
          star.x -= (dxp / pointerDistance) * 0.16;
          star.y -= (dyp / pointerDistance) * 0.16;
        }

        if (!staticFrame) {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < -30) star.x = width + 30;
          if (star.x > width + 30) star.x = -30;
          if (star.y < -30) star.y = height + 30;
          if (star.y > height + 30) star.y = -30;
        }

        const twinkle = staticFrame
          ? 0.9
          : 0.72 + Math.sin(time * 0.0012 * star.pulse + star.phase) * 0.28;
        const drawY = star.y + parallax * star.depth;
        const near = staticFrame ? 0 : Math.max(0, 1 - pointerDistance / (POINTER_RADIUS * 1.6));

        // Halo on the brighter stars so the field reads as depth, not noise.
        if (star.depth === 1) {
          ctx.beginPath();
          ctx.arc(star.x, drawY, star.r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.hue}, ${(0.05 * twinkle).toFixed(3)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(star.x, drawY, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.hue}, ${(star.alpha * twinkle + near * 0.32).toFixed(3)})`;
        ctx.fill();

        for (let j = i + 1; j < stars.length; j += 1) {
          const other = stars[j];
          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;

          const falloff = 1 - distance / LINK_DISTANCE;
          ctx.beginPath();
          ctx.moveTo(star.x, drawY);
          ctx.lineTo(other.x, other.y + parallax * other.depth);
          ctx.strokeStyle = `rgba(139, 92, 246, ${(0.2 * falloff).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (!staticFrame) rafId = window.requestAnimationFrame(draw);
    };

    build();
    if (staticFrame) {
      // One rendered frame is all a reduced-motion visitor needs.
      draw(0);
      rafId = 0;
    } else {
      rafId = window.requestAnimationFrame(draw);
    }

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        window.cancelAnimationFrame(rafId);
        build();
        rafId = staticFrame ? 0 : window.requestAnimationFrame(draw);
        if (staticFrame) draw(0);
      }, 180);
    });

    if (!staticFrame) {
      window.addEventListener(
        "pointermove",
        (event) => {
          pointer.x = event.clientX;
          pointer.y = event.clientY;
        },
        { passive: true }
      );

      window.addEventListener("pointerleave", () => {
        pointer.x = -1000;
        pointer.y = -1000;
      });
    }

    window.addEventListener(
      "scroll",
      () => {
        scroll.velocity = Math.max(-14, Math.min(14, (window.scrollY - scroll.y) * 0.22));
        scroll.y = window.scrollY;
        scrolling = true;
        window.clearTimeout(scrollIdle);
        scrollIdle = window.setTimeout(() => {
          scrolling = false;
        }, 120);
      },
      { passive: true }
    );

    // Stop animating when the tab is hidden to save battery.
    document.addEventListener("visibilitychange", () => {
      if (staticFrame) return;
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId && !scrolling) {
        rafId = window.requestAnimationFrame(draw);
      }
    });
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
        window.location.href = `mailto:goku.labs.ltd@gmail.com?subject=${subject}&body=${body}`;
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
    initStarfield();
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
