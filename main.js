document.addEventListener("DOMContentLoaded", () => {

  /* ================= NAV POPUPS ================= */
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
      if (!popupEl || !linkEl) return;

      const wasHidden = !popupEl.offsetParent;
      if (wasHidden) {
        popupEl.style.visibility = "hidden";
        popupEl.style.display = "block";
      }

      const rect = linkEl.getBoundingClientRect();
      const scrollLeft = window.pageXOffset;
      const scrollTop = window.pageYOffset;
      const popupWidth = popupEl.offsetWidth;
      popupEl.style.left =
        rect.left + scrollLeft + rect.width / 2 - popupWidth / 2 + "px";

      const navBar = document.querySelector(".site-header");
      const navBottom = navBar
        ? navBar.getBoundingClientRect().bottom
        : rect.bottom;

      popupEl.style.top = navBottom + scrollTop + 8 + "px";

      if (wasHidden) {
        popupEl.style.visibility = "";
        popupEl.style.display = "";
      }
    }

    function showPopup() {
      popupBackdrop?.classList.add("visible");
    }

    function hidePopup() {
      popupBackdrop?.classList.remove("visible");
    }

    navLinks.forEach((navLink) => {
      navLink.addEventListener("mouseenter", () => {
        linkHover = true;
        alignPopupToNav(navLink);
        showPopup();
      });

      navLink.addEventListener("mouseleave", () => {
        linkHover = false;
        setTimeout(() => {
          if (!popupHover && !linkHover) hidePopup();
        }, 80);
      });
    });

    popupBackdrop?.addEventListener("mouseenter", () => {
      popupHover = true;
      showPopup();
    });

    popupBackdrop?.addEventListener("mouseleave", () => {
      popupHover = false;
      setTimeout(() => {
        if (!popupHover && !linkHover) hidePopup();
      }, 80);
    });
  });

  /* ================= YEAR ================= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================= MODAL ================= */
  const body = document.body;
  const modalBackdrop = document.querySelector("[data-modal-backdrop]");
  const openModalButtons = document.querySelectorAll("[data-open-modal]");
  const closeModalButton = document.querySelector("[data-close-modal]");
  const leadForm = document.getElementById("lead-form");
  const successEl = document.getElementById("lead-success");
  const firstField = document.getElementById("full-name");

  const openModal = () => {
    successEl.textContent = "";
    successEl.classList.remove("form__success--visible");
    document.querySelectorAll(".form__error").forEach(e => e.textContent = "");
    modalBackdrop.classList.add("modal-backdrop--visible");
    body.classList.add("modal-open");
    setTimeout(() => firstField?.focus(), 120);
  };

  const closeModal = () => {
    modalBackdrop.classList.remove("modal-backdrop--visible");
    body.classList.remove("modal-open");
  };

  openModalButtons.forEach(btn => btn.addEventListener("click", openModal));
  closeModalButton?.addEventListener("click", closeModal);

  /* ================= FORM SUBMIT ================= */
  if (leadForm && successEl) {

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("full-name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const why =
        leadForm.querySelector('input[name="why"]')?.value ||
        "Requested Free Horoscope Report";

      if (!name || !phone || !email) return;

      try {
        await fetch(
          "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZmMDYzNjA0MzI1MjY4NTUzNjUxM2Ei_pc",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              phone,
              email,
              why,
              page_url: window.location.href,
              submitted_at: new Date().toISOString()
            })
          }
        );

        successEl.textContent =
          "✨ Your request has been received. Your personalized future report will be prepared and shared with you shortly.";
        successEl.classList.add("form__success--visible");

        leadForm.reset();
        setTimeout(closeModal, 800);

      } catch (error) {
        alert("Something went wrong. Please try again.");
      }
    });
  }
});