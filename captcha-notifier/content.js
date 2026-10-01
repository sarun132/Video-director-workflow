// Watches the page for a visible CAPTCHA and tells the background worker.
// Runs in every frame, but skips the CAPTCHA provider's own iframes.
(() => {
  const host = location.hostname;
  if (/(^|\.)(google\.com|recaptcha\.net|hcaptcha\.com)$/.test(host) && /recaptcha|hcaptcha/.test(location.href)) {
    return;
  }

  // Challenge popups (image grid etc.) — the thing a human must solve.
  const CHALLENGE = [
    'iframe[src*="/recaptcha/api2/bframe"]',
    'iframe[src*="/recaptcha/enterprise/bframe"]',
    'iframe[src*="hcaptcha.com"][src*="frame=challenge"]',
  ].join(",");

  // Checkbox widgets ("I'm not a robot").
  const CHECKBOX = [
    'iframe[src*="/recaptcha/api2/anchor"]',
    'iframe[src*="/recaptcha/enterprise/anchor"]',
    'iframe[src*="hcaptcha.com"][src*="frame=checkbox"]',
  ].join(",");

  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return false;
    if (r.bottom < 0 || r.right < 0 || r.top > innerHeight + 2000) return false;
    const s = getComputedStyle(el);
    return s.visibility === "visible" && s.display !== "none" && Number(s.opacity) > 0.05;
  };

  // A checkbox only needs attention while its response token is still empty.
  const isUnsolved = (iframe) => {
    const box = iframe.closest(".g-recaptcha, .h-captcha, [data-sitekey]") || document;
    const resp = box.querySelector('textarea[name="g-recaptcha-response"], textarea[name="h-captcha-response"]');
    return !resp || !resp.value;
  };

  let settings = { enabled: true, notifyCheckbox: true };
  chrome.storage.local.get(settings, (s) => (settings = s));
  chrome.storage.onChanged.addListener((changes) => {
    for (const [k, v] of Object.entries(changes)) settings[k] = v.newValue;
  });

  let lastState = "none";

  function check() {
    if (!settings.enabled) return;
    let state = "none";
    if ([...document.querySelectorAll(CHALLENGE)].some(isVisible)) {
      state = "challenge";
    } else if (
      settings.notifyCheckbox &&
      [...document.querySelectorAll(CHECKBOX)].some((f) => isVisible(f) && isUnsolved(f))
    ) {
      state = "checkbox";
    }

    // Notify only on transitions into a "needs attention" state.
    if (state !== lastState) {
      lastState = state;
      chrome.runtime.sendMessage({ type: state === "none" ? "captcha-cleared" : "captcha", kind: state }).catch(() => {});
    }
  }

  setInterval(check, 1000);
  new MutationObserver(() => queueMicrotask(check)).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  check();
})();
