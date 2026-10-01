const defaults = { enabled: true, notifyCheckbox: true };

chrome.storage.local.get(defaults, (s) => {
  for (const key of Object.keys(defaults)) {
    const el = document.getElementById(key);
    el.checked = s[key];
    el.addEventListener("change", () => chrome.storage.local.set({ [key]: el.checked }));
  }
});

document.getElementById("test").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "test" });
});
