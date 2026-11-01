const PREFIX = "tm_portal_v3_";

export const KEYS = {
  user: `${PREFIX}user`,
  cards: `${PREFIX}cards`,
  theme: `${PREFIX}theme`,
  customBackground: `${PREFIX}custom_bg`,
  language: `${PREFIX}language`,
  favorites: `${PREFIX}favorites`,
  lastRoute: `${PREFIX}last_route`,
  notificationsRead: `${PREFIX}notifications_read`,
  reviews: `${PREFIX}reviews`,
};

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn(`Cannot read local storage key ${key}`, error);

    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (error) {
    console.error(`Cannot save local storage key ${key}`, error);

    return false;
  }
}

export function readText(key, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeText(key, value) {
  try {
    localStorage.setItem(key, String(value));

    return true;
  } catch (error) {
    console.error(`Cannot save local storage key ${key}`, error);

    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Cannot remove ${key}`, error);
  }
}

// Защита выводимого текста от HTML-вставок.

export function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

// Оставляем только цифры.

export function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}
