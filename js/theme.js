import { KEYS, readText, writeText } from "./storage.js";

const THEMES = ["light", "mint", "sunset", "lavender", "ocean", "dark"];

// Применение готовой цветовой темы.

function applyTheme(theme) {
  if (!THEMES.includes(theme)) {
    theme = "light";
  }

  const root = document.documentElement;

  // Убираем inline-цвета предыдущей пользовательской темы.

  [
    "--bg",
    "--surface",
    "--surface-2",
    "--text",
    "--muted",
    "--border",
    "--header",
  ].forEach((property) => {
    root.style.removeProperty(property);
  });

  root.style.removeProperty("color-scheme");

  root.dataset.theme = theme;

  writeText(KEYS.theme, theme);

  document.getElementById("customBackground").value =
    theme === "dark" ? "#101827" : "#f4f7ff";

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === theme);
  });

  const meta = document.querySelector('meta[name="theme-color"]');

  if (meta) {
    meta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
  }

  document.dispatchEvent(
    new CustomEvent("themechange", {
      detail: { theme },
    }),
  );
}

// Преобразуем HEX в RGB.

function parseHex(hex) {
  const clean = hex.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((x) => x + x)
          .join("")
      : clean;

  const number = Number.parseInt(full, 16);

  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

// Определяем визуальную яркость цвета.

function luminance(hex) {
  const channels = parseHex(hex).map((value) => {
    const v = value / 255;

    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

// Пользовательский цвет фона.
// Текст автоматически становится светлым или тёмным.

function applyCustomBackground(hex) {
  const light = luminance(hex) > 0.48;

  const root = document.documentElement;

  root.dataset.theme = "custom";

  root.style.setProperty("--bg", hex);

  root.style.setProperty("--text", light ? "#18223b" : "#f5f7ff");

  root.style.setProperty("--muted", light ? "#68748e" : "#bdc7dc");

  root.style.setProperty(
    "--surface",
    light
      ? `color-mix(in srgb, ${hex} 22%, #ffffff)`
      : `color-mix(in srgb, ${hex} 72%, #26334c)`,
  );

  root.style.setProperty(
    "--surface-2",
    light
      ? `color-mix(in srgb, ${hex} 36%, #ffffff)`
      : `color-mix(in srgb, ${hex} 58%, #34415b)`,
  );

  root.style.setProperty(
    "--border",
    light ? "rgba(24,34,59,.13)" : "rgba(255,255,255,.16)",
  );

  root.style.setProperty(
    "--header",
    light
      ? `color-mix(in srgb, ${hex} 78%, #ffffff)`
      : `color-mix(in srgb, ${hex} 84%, #26334c)`,
  );

  root.style.setProperty("color-scheme", light ? "light" : "dark");

  writeText(KEYS.theme, "custom");
  writeText(KEYS.customBackground, hex);

  document
    .querySelectorAll("[data-theme-choice]")
    .forEach((button) => button.classList.remove("active"));

  const meta = document.querySelector('meta[name="theme-color"]');

  if (meta) {
    meta.content = hex;
  }

  document.dispatchEvent(
    new CustomEvent("themechange", {
      detail: {
        theme: "custom",
        background: hex,
        contrast: light ? "dark-text" : "light-text",
      },
    }),
  );
}

// Запуск темы и обработчиков.

export function initTheme() {
  const saved = readText(KEYS.theme, "light");

  if (saved === "custom") {
    const custom = readText(KEYS.customBackground, "#f4f7ff");

    document.getElementById("customBackground").value = custom;

    applyCustomBackground(custom);
  } else {
    applyTheme(saved);
  }

  const panel = document.getElementById("themePanel");

  const trigger = document.getElementById("themeButton");

  trigger?.addEventListener("click", () => {
    panel.hidden = !panel.hidden;

    trigger.setAttribute("aria-expanded", String(!panel.hidden));
  });

  panel?.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeChoice);

      panel.hidden = true;

      trigger.setAttribute("aria-expanded", "false");
    });
  });

  document
    .getElementById("customBackground")
    ?.addEventListener("input", (event) => {
      applyCustomBackground(event.target.value);
    });

  document.getElementById("resetTheme")?.addEventListener("click", () => {
    applyTheme("light");

    panel.hidden = true;

    trigger?.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".theme-wrap") && panel && !panel.hidden) {
      panel.hidden = true;

      trigger?.setAttribute("aria-expanded", "false");
    }
  });
}
