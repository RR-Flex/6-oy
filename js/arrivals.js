import { t } from "./i18n.js";

import { escapeHTML } from "./storage.js";

// Настраивается только после появления проверенного API.
// Пример:
// window.METRO_ARRIVALS_API =
//   'https://your-domain.example/api/metro/arrivals';

const API_URL = window.METRO_ARRIVALS_API || "";

let selectedStation = "";

let refreshTimer = null;

function setStatus(message, live = false) {
  const element = document.getElementById("arrivalStatus");

  if (!element) return;

  element.textContent = message;

  element.classList.toggle("status-live", live);
}

function empty(message) {
  const element = document.getElementById("arrivalList");

  if (element) {
    element.innerHTML = `

      <div class="empty-state">
        ${escapeHTML(message)}
      </div>

    `;
  }
}

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(document.documentElement.lang || "ru", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(date);
}

// Рендерим данные только после проверки источника и времени.

function render(payload, station) {
  const updatedAt = new Date(payload.updatedAt);

  const age = Date.now() - updatedAt.getTime();

  // Если данные старше двух минут — не называем их актуальными.

  if (!Number.isFinite(updatedAt.getTime()) || age < -30000 || age > 120000) {
    setStatus(t("staleData"));

    empty(t("staleData"));

    return;
  }

  if (payload.station !== station) {
    throw new Error("The API returned a different station.");
  }

  setStatus(
    `${payload.source || "Verified feed"} · ${formatTime(payload.updatedAt)}`,
    true,
  );

  const rows = Array.isArray(payload.arrivals) ? payload.arrivals : [];

  const container = document.getElementById("arrivalList");

  if (!container) return;

  if (!rows.length) {
    empty(t("noArrivals"));

    return;
  }

  const sorted = rows

    .filter(
      (row) =>
        row.predictedAt && Number.isFinite(new Date(row.predictedAt).getTime()),
    )

    .sort((a, b) => new Date(a.predictedAt) - new Date(b.predictedAt));

  container.innerHTML = sorted
    .map((row) => {
      const minutes = Math.ceil(
        (new Date(row.predictedAt).getTime() - Date.now()) / 60000,
      );

      const eta = minutes <= 0 ? "Due / expected now" : `In ${minutes} min`;

      return `

      <article class="arrival-row">

        <div class="arrival-line">

          <i class="arrival-dot"></i>

          <div>

            <b>
              ${escapeHTML(row.destination || "—")}
            </b>

            <small>
              ${escapeHTML(row.line || "—")}
            </small>

          </div>

        </div>


        <div class="arrival-time">

          <b>
            ${escapeHTML(eta)}
          </b>

          <small>
            ${escapeHTML(formatTime(row.predictedAt))}
          </small>

        </div>

      </article>

    `;
    })
    .join("");

  if (!sorted.length) {
    empty(t("noArrivals"));
  }
}

// Запрашиваем API.

export async function refreshArrivals(station = selectedStation) {
  selectedStation = station;

  if (!station) {
    empty(t("selectStation"));

    return;
  }

  if (!API_URL) {
    setStatus(t("noLiveData"));

    empty(t("liveSourceMissing"));

    return;
  }

  setStatus(t("loading"));

  empty(t("loading"));

  try {
    const url = new URL(API_URL, window.location.origin);

    url.searchParams.set("station", station);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Arrivals API HTTP ${response.status}`);
    }

    const payload = await response.json();

    render(payload, station);
  } catch (error) {
    console.error("Arrival feed error:", error);

    setStatus(t("noLiveData"));

    empty(t("liveSourceMissing"));
  }
}

// Создаём список станций в селекторе.

export function initArrivals(stations) {
  const select = document.getElementById("arrivalStation");

  if (!select) return;

  const previous = select.value;

  select.innerHTML =
    `

    <option value="">
      ${escapeHTML(t("chooseStation"))}
    </option>

  ` +
    stations
      .map(
        (station) => `

    <option value="${escapeHTML(station)}">
      ${escapeHTML(station)}
    </option>

  `,
      )
      .join("");

  if (previous && stations.includes(previous)) {
    select.value = previous;
  }

  // Не добавляем одинаковые обработчики при смене языка.

  if (select.dataset.listenerReady !== "true") {
    select.addEventListener("change", () => {
      selectedStation = select.value;

      refreshArrivals(selectedStation);
    });

    select.dataset.listenerReady = "true";
  }

  const refreshButton = document.getElementById("refreshArrivals");

  if (refreshButton && refreshButton.dataset.listenerReady !== "true") {
    refreshButton.addEventListener("click", () => {
      refreshArrivals(selectedStation);
    });

    refreshButton.dataset.listenerReady = "true";
  }

  clearInterval(refreshTimer);

  refreshTimer = setInterval(() => {
    if (selectedStation && API_URL) {
      refreshArrivals(selectedStation);
    }
  }, 30000);
}
