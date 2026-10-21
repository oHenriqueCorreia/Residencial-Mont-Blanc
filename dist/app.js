(function () {
  "use strict";

  const config = window.MONT_BLANC_CONFIG || {};
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage || "")}`;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl;
  });

  document.querySelectorAll("[data-phone-display]").forEach((node) => {
    node.textContent = config.salesPhoneDisplay;
    node.href = `tel:${config.salesPhoneHref}`;
  });

  const progress = Number(config.project?.progress || 0);
  document.querySelectorAll("[data-progress]").forEach((node) => {
    node.textContent = `${progress}%`;
  });
  document.querySelectorAll("[data-progress-bar]").forEach((node) => {
    node.style.setProperty("--progress", `${progress}%`);
    node.setAttribute("aria-valuenow", String(progress));
  });

  function track(event, details) {
    dataLayer.push({ event, ...details });
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (!target) return;
    track("cta_click", {
      cta_name: target.dataset.track,
      cta_location: target.dataset.location || "page"
    });
  });

  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      const digits = input.value.replace(/\D/g, "").slice(0, 11);
      if (digits.length > 10) {
        input.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
      } else if (digits.length > 6) {
        input.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else if (digits.length > 2) {
        input.value = digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      } else {
        input.value = digits;
      }
    });
  });

  async function submitLead(payload) {
    // Integração prevista: informe uma URL HTTPS em config.js quando o CRM estiver pronto.
    if (!config.crmEndpoint) {
      return { demo: true };
    }

    const response = await fetch(config.crmEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Falha ao registrar o contato.");
    return { demo: false };
  }

  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const payload = Object.fromEntries(new FormData(form).entries());
      payload.source = form.dataset.formLocation;
      payload.page = window.location.href;
      payload.createdAt = new Date().toISOString();

      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = "Registrando...";
      status.hidden = true;

      try {
        const result = await submitLead(payload);
        track("lead_submit", {
          form_location: payload.source,
          integration_mode: result.demo ? "demo" : "crm"
        });
        status.className = "form-status success";
        status.textContent = result.demo
          ? "Solicitação registrada nesta demonstração. A integração com o CRM está pronta para ser configurada."
          : "Recebemos seus dados. Um consultor entrará em contato em breve.";
        status.hidden = false;
        form.reset();
      } catch (error) {
        status.className = "form-status error";
        status.textContent = "Não foi possível enviar agora. Fale com a equipe pelo WhatsApp.";
        status.hidden = false;
      } finally {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
})();
