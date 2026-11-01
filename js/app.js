import { LINES, DEMO_TRIPS } from "./data.js";

import {
  KEYS,
  readJSON,
  writeJSON,
  removeKey,
  escapeHTML,
  onlyDigits,
} from "./storage.js";

import {
  allStations,
  lineForStation,
  shortestPath,
  isTransfer,
  transferCount,
} from "./metro.js";

import { initI18n, t, lineName } from "./i18n.js";

import { initTheme } from "./theme.js";

import {
  initCityMap,
  initRouteMap,
  centerCityMap,
  focusStationOnMap,
  drawRouteOnMap,
  setupMapControls,
} from "./map.js";

import { initArrivals } from "./arrivals.js";

import { initReviews } from "./reviews.js";

const $ = (selector, root = document) => root.querySelector(selector);

const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let activeLine = "all";

let stationSearch = "";

let toastTimer = null;

// ======================================
// TOAST
// ======================================

function toast(message) {
  const element = $("#toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2500);
}

// ======================================
// NAVIGATION
// ======================================

function showPage(name) {
  $$(".page").forEach((page) => {
    page.classList.toggle("active", page.id === `page-${name}`);
  });

  $$("[data-page-link]").forEach((button) => {
    button.classList.toggle("active", button.dataset.pageLink === name);
  });

  $("#mobileMenu").hidden = true;

  $("#notificationPanel").hidden = true;

  $("#themePanel").hidden = true;

  if (name === "profile") {
    renderProfile();
  }

  if (name === "map") {
    initCityMap().then((count) => {
      if (!count) {
        toast(t("osmUnavailable"));
      }
    });
  }

  if (name === "route") {
    initRouteMap();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  observeReveals(document.getElementById(`page-${name}`));
}

function setupNavigation() {
  $$("[data-page-link]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.pageLink);
    });
  });

  $$("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.go);
    });
  });

  $("#mobileMenuButton")?.addEventListener("click", () => {
    $("#mobileMenu").hidden = !$("#mobileMenu").hidden;
  });

  $("#authButton")?.addEventListener("click", () => {
    if (getUser()) {
      showPage("profile");
    } else {
      $("#authModal").hidden = false;
    }
  });

  $("#profileLogin")?.addEventListener("click", () => {
    $("#authModal").hidden = false;
  });
}

// ======================================
// MODALS
// ======================================

function setupModals() {
  document.addEventListener("click", (event) => {
    const close = event.target.closest("[data-close]");

    if (close) {
      const modal = document.getElementById(close.dataset.close);

      if (modal) {
        modal.hidden = true;
      }
    }

    const open = event.target.closest("[data-open-modal]");

    if (open) {
      const modal = document.getElementById(open.dataset.openModal);

      if (modal) {
        modal.hidden = false;
      }
    }
  });

  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.hidden = true;
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      $$(".modal").forEach((modal) => {
        modal.hidden = true;
      });
    }
  });
}

// ======================================
// CLOCK
// ======================================

function setupClock() {
  const update = () => {
    const now = new Date();

    $("#liveClock").textContent = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tashkent",
    }).format(now);

    $("#liveDate").textContent = new Intl.DateTimeFormat(
      document.documentElement.lang || "ru",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Tashkent",
      },
    ).format(now);
  };

  update();

  setInterval(update, 30000);

  document.addEventListener("languagechange", update);
}

// ======================================
// NOTIFICATIONS
// ======================================

function setupNotifications() {
  const read = readJSON(KEYS.notificationsRead, false);

  $("#notificationDot").classList.toggle("read", read);

  renderNotifications();

  $("#notificationButton")?.addEventListener("click", () => {
    $("#notificationPanel").hidden = !$("#notificationPanel").hidden;

    if (!$("#notificationPanel").hidden) {
      writeJSON(KEYS.notificationsRead, true);

      $("#notificationDot").classList.add("read");
    }
  });

  $("#readNotifications")?.addEventListener("click", () => {
    writeJSON(KEYS.notificationsRead, true);

    $("#notificationDot").classList.add("read");

    toast(t("markRead"));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#notificationPanel, #notificationButton")) {
      $("#notificationPanel").hidden = true;
    }
  });
}

function renderNotifications() {
  const translated = {
    ru: [
      [
        "Добро пожаловать!",
        "Здесь можно строить маршруты, выбирать темы и оставлять отзывы.",
      ],

      ["Интерактивная карта", "Приближай и перемещай карту Ташкента."],

      ["Демо-режим", "Время прибытия поездов и баланс карт не выдумываются."],
    ],

    en: [
      ["Welcome!", "Plan routes, choose themes and leave reviews here."],

      ["Interactive map", "Zoom and move around the map of Tashkent."],

      ["Demo mode", "Train arrivals and card balances are not fabricated."],
    ],

    uz: [
      [
        "Xush kelibsiz!",
        "Yo‘nalish tuzing, mavzuni tanlang va fikr qoldiring.",
      ],

      ["Interaktiv xarita", "Toshkent xaritasini kattalashtiring va suring."],

      ["Demo rejim", "Poyezd vaqti va karta balansi to‘qib chiqarilmaydi."],
    ],
  };

  const lang = document.documentElement.lang || "ru";

  const items = translated[lang] || translated.ru;

  $("#notificationList").innerHTML = items
    .map(
      (item, index) => `

      <article class="notification-item">

        <span class="notification-icon">
          ${["✦", "⌖", "ⓘ"][index]}
        </span>

        <div>

          <b>${escapeHTML(item[0])}</b>

          <p>${escapeHTML(item[1])}</p>

        </div>

      </article>

    `,
    )
    .join("");
}

// ======================================
// MAP DIRECTORY
// ======================================

function renderLineFilters() {
  const filters = $("#lineFilters");

  filters.innerHTML =
    `

    <button
      class="filter ${activeLine === "all" ? "active" : ""}"
      data-line="all"
    >
      ${escapeHTML(t("allLines"))}
    </button>

  ` +
    LINES.map(
      (line) => `

    <button
      class="filter ${activeLine === line.id ? "active" : ""}"
      data-line="${escapeHTML(line.id)}"
    >
      ${escapeHTML(lineName(line.id))}
    </button>

  `,
    ).join("");

  // Делегирование обработчика, чтобы он не дублировался.

  filters.onclick = (event) => {
    const button = event.target.closest("[data-line]");

    if (!button) return;

    activeLine = button.dataset.line;

    $$("[data-line]", filters).forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderStationGroups();
  };
}

// Отображение списка станций.

function renderStationGroups() {
  const target = $("#stationGroups");

  const query = stationSearch.trim().toLocaleLowerCase("ru");

  const favorites = readJSON(KEYS.favorites, []);

  target.innerHTML = "";

  for (const line of LINES) {
    if (activeLine !== "all" && line.id !== activeLine) {
      continue;
    }

    const stations = line.stations.filter((station) =>
      station.toLocaleLowerCase("ru").includes(query),
    );

    if (!stations.length) continue;

    const block = document.createElement("article");

    block.className = "line-block";

    block.innerHTML = `

      <div class="line-title">

        <span
          class="line-dot"
          style="--line-color:${line.color}"
        ></span>

        ${escapeHTML(lineName(line.id))}

        <span class="muted-count">
          · ${stations.length}
        </span>

      </div>


      <div class="station-pills">

        ${stations
          .map(
            (station) => `

          <button
            class="station-pill"
            data-station="${escapeHTML(station)}"
          >

            ${escapeHTML(station)}

            ${favorites.includes(station) ? " ★" : ""}

          </button>

        `,
          )
          .join("")}

      </div>

    `;

    target.append(block);
  }

  if (!target.children.length) {
    target.innerHTML = `

      <div class="empty-state">
        ${escapeHTML(t("noStationsFound"))}
      </div>

    `;
  }

  $$("[data-station]", target).forEach((button) => {
    button.addEventListener("click", () => {
      selectStation(button.dataset.station);
    });
  });
}

// Открываем подробности станции.

function selectStation(station) {
  const line = lineForStation(station);

  const favorites = readJSON(KEYS.favorites, []);

  const isFavorite = favorites.includes(station);

  const detail = $("#stationDetail");

  detail.hidden = false;

  detail.innerHTML = `

    <b>${escapeHTML(station)}</b>

    <p>
      ${escapeHTML(t("stationInfo"))}:
      ${escapeHTML(line ? lineName(line.id) : "—")}
    </p>

    <div class="detail-actions">

      <button class="text-button" id="toggleFavorite">
        ${escapeHTML(isFavorite ? t("removeFavorite") : t("favorite"))}
      </button>

      <button class="text-button" id="useAsStart">
        ${escapeHTML(t("from"))}
      </button>

      <button class="text-button" id="useAsEnd">
        ${escapeHTML(t("to"))}
      </button>

    </div>

  `;

  // Избранное.

  $("#toggleFavorite").addEventListener("click", () => {
    const current = readJSON(KEYS.favorites, []);

    const next = current.includes(station)
      ? current.filter((item) => item !== station)
      : [...current, station];

    writeJSON(KEYS.favorites, next);

    renderStationGroups();

    selectStation(station);

    toast(t(next.includes(station) ? "addedFavorite" : "removedFavorite"));
  });

  // Использовать станцию как начало маршрута.

  $("#useAsStart").addEventListener("click", () => {
    $("#routeFrom").value = station;

    showPage("route");
  });

  // Использовать станцию как конец маршрута.

  $("#useAsEnd").addEventListener("click", () => {
    $("#routeTo").value = station;

    showPage("route");
  });

  // Центрируем карту на станции, если есть координаты.

  focusStationOnMap(station);
}

function setupMapDirectory() {
  renderLineFilters();

  renderStationGroups();

  $("#stationSearch").addEventListener("input", (event) => {
    stationSearch = event.target.value;

    renderStationGroups();
  });

  setupMapControls();
}

// ======================================
// ROUTE PLANNER
// ======================================

function fillRouteSelects() {
  const stations = allStations();

  const options =
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

  $("#routeFrom").innerHTML = options;

  $("#routeTo").innerHTML = options;

  initArrivals(stations);
}

// Рассчитываем маршрут и показываем его на карте.

async function calculateRoute() {
  const start = $("#routeFrom").value;

  const end = $("#routeTo").value;

  if (!start || !end) {
    return toast(t("selectStation"));
  }

  if (start === end) {
    return toast(t("sameStation"));
  }

  const path = shortestPath(start, end);

  const result = $("#routeResult");

  result.hidden = false;

  if (!path) {
    result.innerHTML = `

      <div class="empty-state">
        ${escapeHTML(t("routeNotFound"))}
      </div>

    `;

    return;
  }

  const transfers = transferCount(path);

  const steps = path
    .map((station, index) => {
      let label = t("nextStation");

      if (index === 0) {
        label = t("startStation");
      } else if (index === path.length - 1) {
        label = t("destinationStation");
      } else if (isTransfer(station)) {
        label = t("transferStation");
      }

      return `

      <div class="route-step">

        <span class="route-step-marker"></span>

        <div>

          <b>${escapeHTML(station)}</b>

          <small>${escapeHTML(label)}</small>

        </div>

      </div>

    `;
    })
    .join("");

  result.innerHTML = `

    <div class="route-summary">

      <span>${escapeHTML(t("routeFound"))}</span>

      <b>
        ${path.length - 1}
        ${escapeHTML(t("segments"))}
      </b>

      <small>
        ${escapeHTML(t("transfers"))}: ${transfers}.
        ${escapeHTML(t("routeSaved"))}
      </small>

    </div>


    <div class="route-steps">
      ${steps}
    </div>


    <button
      class="button button-outline full-button"
      id="copyRoute"
    >
      ${escapeHTML(t("copyRoute"))}
    </button>

  `;

  // Сохраняем последний маршрут.

  writeJSON(KEYS.lastRoute, {
    from: start,
    to: end,
  });

  // Копирование.

  $("#copyRoute").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(path.join(" → "));

      toast(t("copied"));
    } catch {
      toast(path.join(" → "));
    }
  });

  showPage("route");

  const mapStatus = $("#routeMapStatus");

  mapStatus.textContent = t("loading");

  const drawn = await drawRouteOnMap(path);

  mapStatus.textContent = drawn.ok
    ? `${drawn.matched}/${path.length} stations matched`
    : t("mapCoordinatesMissing");
}

function setupRoutePlanner() {
  fillRouteSelects();

  const last = readJSON(KEYS.lastRoute, null);

  if (
    last &&
    allStations().includes(last.from) &&
    allStations().includes(last.to)
  ) {
    $("#routeFrom").value = last.from;

    $("#routeTo").value = last.to;
  }

  // Меняем станции местами.

  $("#swapStations").addEventListener("click", () => {
    const a = $("#routeFrom").value;

    $("#routeFrom").value = $("#routeTo").value;

    $("#routeTo").value = a;
  });

  $("#calculateRoute").addEventListener("click", calculateRoute);
}

// ======================================
// AUTH
// ======================================

function getUser() {
  return readJSON(KEYS.user, null);
}

function syncAuthButton() {
  $("#authButton").textContent = getUser() ? t("profile") : t("signIn");
}

function setupAuth() {
  $("#authForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#authName").value.trim();

    const phone = $("#authPhone").value.trim();

    if (name.length < 2 || !/^\+?[0-9 ()-]{9,20}$/.test(phone)) {
      $("#authError").textContent = t("authNameRequired");

      return;
    }

    // Сохраняем только замаскированный телефон.

    writeJSON(KEYS.user, {
      name: name.slice(0, 40),
      phoneMasked: maskPhone(phone),
      createdAt: new Date().toISOString(),
    });

    $("#authModal").hidden = true;

    $("#authForm").reset();

    syncAuthButton();

    renderProfile();

    showPage("profile");

    toast(t("welcomeBack"));
  });

  // Выход.

  $("#logoutButton").addEventListener("click", () => {
    removeKey(KEYS.user);

    syncAuthButton();

    showPage("home");

    toast(t("profileLoggedOut"));
  });

  syncAuthButton();
}

function maskPhone(value) {
  const digits = onlyDigits(value);

  return digits.length >= 4 ? `••• ••• ${digits.slice(-4)}` : "•••";
}

// ======================================
// TRANSPORT CARDS
// ======================================

function renderCards() {
  const cards = readJSON(KEYS.cards, []);

  $("#cardsList").innerHTML = cards
    .map(
      (card) => `

    <article class="transport-card ${escapeHTML(card.type.toLowerCase())}">

      <div class="transport-card-top">
        <b>${escapeHTML(card.type)}</b>
        <span>DEMO CARD</span>
      </div>

      <div class="transport-card-number">
        •••• •••• •••• ${escapeHTML(card.last4)}
      </div>

      <div class="transport-card-bottom">
        <span>${escapeHTML(card.phoneMasked || "LOCAL PROFILE")}</span>
        <span>DEMO</span>
      </div>

      <button
        class="remove-card"
        data-remove-card="${escapeHTML(card.id)}"
      >
        ×
      </button>

    </article>

  `,
    )
    .join("");

  $("#emptyCards").hidden = cards.length > 0;

  $("#cardCount").textContent = String(cards.length);

  // Удаление карты.

  $$("[data-remove-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = readJSON(KEYS.cards, []).filter(
        (card) => card.id !== button.dataset.removeCard,
      );

      writeJSON(KEYS.cards, next);

      renderCards();

      toast(t("cardRemoved"));
    });
  });
}

// ======================================
// TRIP HISTORY
// ======================================

function renderTrips() {
  const filter = $("#tripFilter").value;

  const trips = DEMO_TRIPS.filter(
    (trip) => filter === "all" || trip.type === filter,
  );

  $("#tripsList").innerHTML =
    trips
      .map(
        (trip) => `

    <article class="trip-row">

      <div>

        <div class="trip-route">

          ${escapeHTML(trip.from)}

          <span style="color:var(--primary)">→</span>

          ${escapeHTML(trip.to)}

        </div>

        <div class="trip-meta">
          ${escapeHTML(trip.date)}
          ·
          ${escapeHTML(trip.vehicle)}
        </div>

      </div>

      <div class="trip-cost">
        ${trip.cost.toLocaleString("ru-RU")} сум
      </div>

    </article>

  `,
      )
      .join("") ||
    `

    <div class="empty-state">—</div>

  `;

  $("#tripCount").textContent = String(DEMO_TRIPS.length);
}

// ======================================
// PROFILE
// ======================================

function renderProfile() {
  const user = getUser();

  $("#profileGuest").hidden = Boolean(user);

  $("#profileContent").hidden = !user;

  if (!user) return;

  $("#profileName").textContent = user.name;

  renderCards();

  renderTrips();
}

function setupProfile() {
  $("#tripFilter").addEventListener("change", renderTrips);

  $("#addCardButton").addEventListener("click", () => {
    $("#cardForm").reset();

    $("#cardError").textContent = "";

    $("#cardModal").hidden = false;
  });

  // Добавление карты.

  $("#cardForm").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!getUser()) {
      $("#cardModal").hidden = true;

      $("#authModal").hidden = false;

      return;
    }

    const type = $("#cardType").value;

    const number = onlyDigits($("#cardNumber").value);

    const minimum = type === "ATTO" ? 8 : 16;

    if (number.length < minimum || number.length > 19) {
      $("#cardError").textContent = t("cardInvalid");

      return;
    }

    const cards = readJSON(KEYS.cards, []);

    const last4 = number.slice(-4);

    if (cards.some((card) => card.type === type && card.last4 === last4)) {
      $("#cardError").textContent = t("cardDuplicate");

      return;
    }

    cards.push({
      id: globalThis.crypto?.randomUUID?.() ?? `card-${Date.now()}`,

      type,

      last4,

      phoneMasked: getUser().phoneMasked || "•••",

      addedAt: new Date().toISOString(),
    });

    writeJSON(KEYS.cards, cards);

    // Полный номер не сохраняем.

    $("#cardNumber").value = "";

    $("#cardModal").hidden = true;

    renderProfile();

    toast(t("cardAdded"));
  });
}

// ======================================
// TABS AND ACCORDION
// ======================================

function setupExtras() {
  $("#extrasTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");

    if (!button) return;

    const tab = button.dataset.tab;

    $$("[data-tab]").forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);

      item.setAttribute("aria-selected", String(active));
    });

    $$("[data-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === tab);
    });
  });

  // Управление вкладками клавиатурой.

  $("#extrasTabs").addEventListener("keydown", (event) => {
    const buttons = $$("[data-tab]", $("#extrasTabs"));

    const index = buttons.indexOf(document.activeElement);

    if (index < 0) return;

    let next = index;

    if (event.key === "ArrowRight") {
      next = (index + 1) % buttons.length;
    }

    if (event.key === "ArrowLeft") {
      next = (index - 1 + buttons.length) % buttons.length;
    }

    if (next !== index) {
      event.preventDefault();

      buttons[next].focus();

      buttons[next].click();
    }
  });

  // Аккордеон: только один открытый вопрос.

  $("#faqAccordion")
    .querySelectorAll("details")
    .forEach((detail) => {
      detail.addEventListener("toggle", () => {
        if (!detail.open) return;

        $("#faqAccordion")
          .querySelectorAll("details")
          .forEach((other) => {
            if (other !== detail) {
              other.open = false;
            }
          });
      });
    });

  // Кнопка "наверх".

  const back = $("#backToTop");

  window.addEventListener(
    "scroll",
    () => {
      back.classList.toggle("visible", window.scrollY > 450);
    },
    { passive: true },
  );

  back.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ======================================
// REVEAL ANIMATIONS
// ======================================

let revealObserver;

function observeReveals(root = document) {
  const items = root?.querySelectorAll?.(".reveal:not(.visible)") || [];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => {
      item.classList.add("visible");
    });

    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => {
      item.classList.add("visible");
    });

    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
  }

  items.forEach((item) => {
    revealObserver.observe(item);
  });
}

// ======================================
// LANGUAGE REFRESH
// ======================================

function setupLanguageRefresh() {
  document.addEventListener("languagechange", () => {
    renderNotifications();

    renderLineFilters();

    renderStationGroups();

    fillRouteSelects();

    syncAuthButton();

    renderProfile();
  });
}

// ======================================
// INIT
// ======================================

function init() {
  initI18n();

  initTheme();

  setupNavigation();

  setupModals();

  setupClock();

  setupNotifications();

  setupMapDirectory();

  setupRoutePlanner();

  setupAuth();

  setupProfile();

  setupExtras();

  initReviews();

  setupLanguageRefresh();

  observeReveals(document);

  renderProfile();

  showPage("home");
}

// Запуск приложения.

init();
