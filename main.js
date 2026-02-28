document.addEventListener("DOMContentLoaded", () => {
      // Generalized popup hover logic for all nav buttons
      const navPopupMap = {
        problem: {
          link: '.nav__list a[href="#problem"]',
          backdrop: '#problemPopupBackdrop',
          popup: '.problem-popup-below-nav'
        },
        solution: {
          link: '.nav__list a[href="#solution"]',
          backdrop: '#howItWorksPopupBackdrop',
          popup: '.howitworks-popup-below-nav'
        },
        services: {
          link: '.nav__list a[href="#services"]',
          backdrop: '#servicesPopupBackdrop',
          popup: '.services-popup-below-nav'
        },
        testimonials: {
          link: '.nav__list a[href="#testimonials"]',
          backdrop: '#resultsPopupBackdrop',
          popup: '.results-popup-below-nav'
        },
        faq: {
          link: '.nav__list a[href="#faq"]',
          backdrop: '#faqPopupBackdrop',
          popup: '.faq-popup-below-nav'
        }
      };

      Object.values(navPopupMap).forEach(({ link, backdrop, popup }) => {
        const navLinks = document.querySelectorAll(link);
        const popupBackdrop = document.querySelector(backdrop);
        let popupHover = false;
        let linkHover = false;

        function alignPopupToNav(linkEl) {
          const popupEl = document.querySelector(popup);
          if (popupEl && linkEl) {
            const wasHidden = !popupEl.offsetParent;
            if (wasHidden) {
              popupEl.style.visibility = 'hidden';
              popupEl.style.display = 'block';
            }
            const rect = linkEl.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const popupWidth = popupEl.offsetWidth;
            popupEl.style.left = (rect.left + scrollLeft + rect.width / 2 - popupWidth / 2) + 'px';
            // Use nav bar bottom instead of link bottom for consistent gap
            const navBar = document.querySelector('.site-header');
            const navBottom = navBar ? navBar.getBoundingClientRect().bottom : rect.bottom;
            popupEl.style.top = (navBottom + scrollTop + 8) + 'px';
            if (wasHidden) {
              popupEl.style.visibility = '';
              popupEl.style.display = '';
            }
          }
        }
        function showPopup() {
          if (popupBackdrop) {
            popupBackdrop.classList.add('visible');
            popupBackdrop.setAttribute('aria-hidden', 'false');
          }
        }
        function hidePopup() {
          if (popupBackdrop) {
            popupBackdrop.classList.remove('visible');
            popupBackdrop.setAttribute('aria-hidden', 'true');
          }
        }
        navLinks.forEach((navLink) => {
          navLink.addEventListener('mouseenter', () => {
            linkHover = true;
            alignPopupToNav(navLink);
            showPopup();
          });
          navLink.addEventListener('mouseleave', () => {
            linkHover = false;
            setTimeout(() => {
              if (!popupHover && !linkHover) hidePopup();
            }, 80);
          });
        });
        if (popupBackdrop) {
          popupBackdrop.addEventListener('mouseenter', () => {
            popupHover = true;
            showPopup();
          });
          popupBackdrop.addEventListener('mouseleave', () => {
            popupHover = false;
            setTimeout(() => {
              if (!popupHover && !linkHover) hidePopup();
            }, 80);
          });
        }
      });
  const body = document.body;
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* Navigation toggle (mobile) */
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("nav__list--open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a").forEach((navLink) => {
      navLink.addEventListener("click", () => {
        navList.classList.remove("nav__list--open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Modal logic */
  const modalBackdrop = document.querySelector("[data-modal-backdrop]");
  const openModalButtons = document.querySelectorAll("[data-open-modal]");
  const closeModalButton = document.querySelector("[data-close-modal]");
  const leadForm = document.getElementById("lead-form");
  const successEl = document.getElementById("lead-success");
  const firstField = document.getElementById("full-name");

 const openModal = () => {
  if (!modalBackdrop) return;

  // 🔥 RESET SUCCESS STATE EVERY TIME MODAL OPENS
  if (successEl) {
    successEl.textContent = "";
    successEl.classList.remove("form__success--visible");
  }

  // Optional: clear previous errors
  document.querySelectorAll(".form__error").forEach((el) => {
    el.textContent = "";
  });

  modalBackdrop.classList.add("modal-backdrop--visible");
  modalBackdrop.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");

  setTimeout(() => {
    firstField?.focus();
  }, 120);
};

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("modal-backdrop--visible");
    modalBackdrop.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  };

  openModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal();
    });
  });

  closeModalButton?.addEventListener("click", () => {
    closeModal();
  });

  modalBackdrop?.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  /* Lead form validation & submission */
  if (leadForm && successEl) {
    const setError = (id, message) => {
      const el = document.querySelector(
        `.form__error[data-error-for="${id}"]`
      );
      if (el) el.textContent = message || "";
    };

    const validateEmail = (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value.trim());
    };

    const validatePhone = (value) => {
      const phonePattern = /^[0-9+\-\s()]{7,}$/;
      return phonePattern.test(value.trim());
    };

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("full-name");
      const phone = document.getElementById("phone");
      const email = document.getElementById("email");

      let isValid = true;
      setError("full-name", "");
      setError("phone", "");
      setError("email", "");

      if (!name || !phone || !email) return;

      if (!name.value.trim()) {
        setError("full-name", "Please enter your full name.");
        isValid = false;
      }

      if (!phone.value.trim()) {
        setError("phone", "Please enter your phone number.");
        isValid = false;
      } else if (!validatePhone(phone.value)) {
        setError("phone", "Please enter a valid phone number.");
        isValid = false;
      }

      if (!email.value.trim()) {
        setError("email", "Please enter your email address.");
        isValid = false;
      } else if (!validateEmail(email.value)) {
        setError("email", "Please enter a valid email address.");
        isValid = false;
      }

      if (!isValid) {
        successEl.classList.remove("form__success--visible");
        successEl.textContent = "";
        return;
      }

      // Simulated async submission
      successEl.textContent = "";
      successEl.classList.remove("form__success--visible");

    setTimeout(() => {
        successEl.textContent =
          "✨ Your request has been received. Your personalized future report will be prepared and shared with you shortly.";
        successEl.classList.add("form__success--visible");
        leadForm.reset();

        // Ensure hidden "why" field keeps its value after reset
        const whyField = leadForm.querySelector('input[name="why"]');
        if (whyField) {
          whyField.value = "Requested Free Horoscope Report";
        }

        // Auto-scroll to success message on mobile
        successEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Close modal and return to page after 2 seconds
        setTimeout(() => {
          closeModal();
        }, 500);

      }, 500);
    });
  }

  /* Testimonials slider (mobile-focused) */
  const track = document.querySelector("[data-testimonial-track]");
  const dotsContainer = document.querySelector("[data-testimonial-dots]");
  const prevBtn = document.querySelector("[data-testimonial-prev]");
  const nextBtn = document.querySelector("[data-testimonial-next]");

  if (track && dotsContainer) {
    const cards = Array.from(track.children);
    let activeIndex = 0;

    const renderDots = () => {
      dotsContainer.innerHTML = "";
      cards.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.className =
          "testimonials__dot" +
          (index === activeIndex ? " testimonials__dot--active" : "");
        dot.dataset.index = String(index);
        dotsContainer.appendChild(dot);
      });
    };

    const updateSlider = () => {
      const offset = -activeIndex * 100;
      track.style.transform = `translateX(${offset}%)`;
      renderDots();
    };

    const goTo = (index) => {
      const max = cards.length - 1;
      if (index < 0) activeIndex = max;
      else if (index > max) activeIndex = 0;
      else activeIndex = index;
      updateSlider();
    };

    prevBtn?.addEventListener("click", () => {
      goTo(activeIndex - 1);
    });

    nextBtn?.addEventListener("click", () => {
      goTo(activeIndex + 1);
    });

    dotsContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.dataset.index) {
        goTo(Number(target.dataset.index));
      }
    });

    // Initialize
    updateSlider();
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-item__question");
    const answer = item.querySelector(".faq-item__answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";

      // Close all
      document.querySelectorAll(".faq-item__question").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
      });
      document.querySelectorAll(".faq-item__answer").forEach((panel) => {
        panel.classList.remove("faq-item__answer--open");
        panel.setAttribute("aria-hidden", "true");
        panel.style.maxHeight = "0px";
      });

      if (!isOpen) {
        question.setAttribute("aria-expanded", "true");
        answer.classList.add("faq-item__answer--open");
        answer.setAttribute("aria-hidden", "false");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
});