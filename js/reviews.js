import { KEYS, readJSON, writeJSON, escapeHTML } from "./storage.js";

import { t } from "./i18n.js";

let rating = 0;

let filter = "all";

function reviews() {
  const saved = readJSON(KEYS.reviews, []);

  return Array.isArray(saved) ? saved : [];
}

// Обновление звёзд рейтинга.

function updateStars() {
  document.querySelectorAll("#ratingPicker [data-rating]").forEach((button) => {
    const value = Number(button.dataset.rating);

    button.textContent = value <= rating ? "★" : "☆";

    button.classList.toggle("selected", value <= rating);

    button.setAttribute("aria-pressed", String(value === rating));
  });

  const label = document.getElementById("ratingLabel");

  if (label) {
    label.textContent = rating ? `${rating}/5` : t("chooseRating");
  }
}

// Показываем отзывы.

function renderReviews() {
  const all = reviews();

  const visible = all

    .filter((item) => filter === "all" || String(item.rating) === filter)

    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const average = all.length
    ? (all.reduce((sum, item) => sum + item.rating, 0) / all.length).toFixed(1)
    : "—";

  const score = document.getElementById("reviewScore");

  if (score) {
    score.querySelector("b").textContent = average;

    score.querySelector("small").textContent = String(all.length);
  }

  const list = document.getElementById("reviewsList");

  if (!list) return;

  if (!visible.length) {
    list.innerHTML = `

      <div class="empty-state">
        ${escapeHTML(t("noReviews"))}
      </div>

    `;

    return;
  }

  list.innerHTML = visible
    .map((item) => {
      const date = new Date(item.createdAt);

      const dateText = Number.isNaN(date.getTime())
        ? ""
        : new Intl.DateTimeFormat(document.documentElement.lang || "ru", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(date);

      return `

      <article class="review-card">

        <div class="review-card-head">

          <span class="review-avatar">
            ${escapeHTML(item.name.slice(0, 1).toUpperCase())}
          </span>

          <div class="review-author">

            <b>
              ${escapeHTML(item.name)}
            </b>

            <small>
              ${escapeHTML(dateText)}
            </small>

          </div>

          <span class="review-stars">
            ${"★".repeat(item.rating)}
            ${"☆".repeat(5 - item.rating)}
          </span>

        </div>

        <p>
          ${escapeHTML(item.message)}
        </p>

      </article>

    `;
    })
    .join("");
}

// Всплывающее сообщение.

function toast(message) {
  const element = document.getElementById("toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  window.clearTimeout(toast.timer);

  toast.timer = window.setTimeout(() => element.classList.remove("show"), 2500);
}

// Запуск отзывов и событий.

export function initReviews() {
  const form = document.getElementById("reviewForm");

  if (!form) return;

  // Выбор рейтинга.

  document.querySelectorAll("#ratingPicker [data-rating]").forEach((button) => {
    button.addEventListener("click", () => {
      rating = Number(button.dataset.rating);

      updateStars();
    });
  });

  // Счётчик символов.

  document.getElementById("reviewText")?.addEventListener("input", (event) => {
    document.getElementById("reviewCounter").textContent = String(
      event.target.value.length,
    );
  });

  // Фильтры отзывов.

  document.getElementById("reviewTabs")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    filter = button.dataset.filter;

    document.querySelectorAll("#reviewTabs [data-filter]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderReviews();
  });

  // Отправка отзыва.

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("reviewName").value.trim();

    const message = document.getElementById("reviewText").value.trim();

    const error = document.getElementById("reviewError");

    if (name.length < 2 || message.length < 10 || rating < 1) {
      error.textContent = t("reviewInvalid");

      return;
    }

    const next = reviews();

    next.push({
      id: globalThis.crypto?.randomUUID?.() ?? `review-${Date.now()}`,

      name: name.slice(0, 35),

      rating,

      message: message.slice(0, 800),

      createdAt: new Date().toISOString(),
    });

    if (!writeJSON(KEYS.reviews, next)) {
      error.textContent = "Storage is unavailable. Please try again.";

      return;
    }

    form.reset();

    rating = 0;

    filter = "all";

    document.querySelectorAll("#reviewTabs [data-filter]").forEach((item) => {
      item.classList.toggle("active", item.dataset.filter === "all");
    });

    document.getElementById("reviewCounter").textContent = "0";

    error.textContent = "";

    updateStars();

    renderReviews();

    toast(t("reviewSaved"));
  });

  // Обновляем текст при смене языка.

  document.addEventListener("languagechange", () => {
    updateStars();

    renderReviews();
  });

  updateStars();

  renderReviews();
}
