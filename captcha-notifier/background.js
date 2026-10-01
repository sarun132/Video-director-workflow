// Shows a desktop notification when a tab reports a CAPTCHA, and jumps to that tab on click.

const COOLDOWN_MS = 15000; // per tab + CAPTCHA type, avoid repeat alerts

const lastAlert = new Map(); // "tabId:kind" -> timestamp

const MESSAGES = {
  challenge: "มี reCAPTCHA ให้เลือกรูป / แก้โจทย์",
  checkbox: "มี reCAPTCHA รอกด \"I'm not a robot\"",
  test: "ทดสอบการแจ้งเตือน",
};

function notify(tab, kind) {
  const now = Date.now();
  const key = tab && `${tab.id}:${kind}`;
  if (tab && now - (lastAlert.get(key) || 0) < COOLDOWN_MS) return;
  if (tab) lastAlert.set(key, now);

  const id = tab ? `tab-${tab.id}-${now}` : `test-${now}`;
  let site = "";
  try {
    site = tab ? new URL(tab.url).hostname : "";
  } catch {}

  chrome.notifications.create(id, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "ต้องแก้ CAPTCHA",
    message: MESSAGES[kind] || MESSAGES.challenge,
    contextMessage: site || (tab && tab.title) || "",
    priority: 2,
    requireInteraction: true, // stays on screen until clicked/dismissed
  });

  if (tab) {
    chrome.action.setBadgeText({ tabId: tab.id, text: "!" });
    chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#ea580c" });
  }
}

function clearTab(tabId) {
  chrome.action.setBadgeText({ tabId, text: "" });
  chrome.notifications.getAll((all) => {
    for (const id of Object.keys(all)) {
      if (id.startsWith(`tab-${tabId}-`)) chrome.notifications.clear(id);
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "captcha" && sender.tab) {
    notify(sender.tab, msg.kind);
  } else if (msg.type === "captcha-cleared" && sender.tab) {
    clearTab(sender.tab.id);
  } else if (msg.type === "test") {
    notify(null, "test");
  }
});

chrome.notifications.onClicked.addListener(async (id) => {
  chrome.notifications.clear(id);
  const m = id.match(/^tab-(\d+)-/);
  if (!m) return;
  try {
    const tab = await chrome.tabs.update(Number(m[1]), { active: true });
    await chrome.windows.update(tab.windowId, { focused: true, drawAttention: true });
  } catch {
    // tab was closed
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  for (const key of lastAlert.keys()) if (key.startsWith(`${tabId}:`)) lastAlert.delete(key);
});
