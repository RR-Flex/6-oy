import { KEYS, readJSON, writeJSON, escapeHTML } from "./storage.js";

const CENTER = [41.3111, 69.2797];

const BOUNDS = "41.15,69.05,41.46,69.55";

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const CACHE_KEY = "tm_portal_v3_osm_stations";

const mapInstances = {
  city: null,
  route: null,
};

const markerGroups = {
  city: null,
  route: null,
};

let stationRecords = [];
let coordinateIndex = new Map();
let routeLine = null;
let routeEndpoints = null;
let loadingPromise = null;

// Нормализуем названия для поиска совпадений.

function normalizeName(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .replace(/ё/g, "е")
    .replace(/[‘’`']/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

// Создаём карту Leaflet.

function createMap(elementId) {
  const element = document.getElementById(elementId);

  if (!element || !window.L) {
    return null;
  }

  const map = window.L.map(elementId, {
    center: CENTER,
    zoom: 12,
    minZoom: 9,
    maxZoom: 19,
    scrollWheelZoom: true,
    zoomControl: true,
  });

  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
  }).addTo(map);

  window.L.control
    .scale({
      metric: true,
      imperial: false,
    })
    .addTo(map);

  return map;
}

// Получаем координаты объекта OSM.

function elementCoordinates(element) {
  const lat = element.lat ?? element.center?.lat;

  const lon = element.lon ?? element.center?.lon;

  return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
}

// Строим индекс названий и координат.

function buildIndex(elements) {
  stationRecords = [];

  coordinateIndex = new Map();

  for (const element of elements) {
    const coords = elementCoordinates(element);

    if (!coords) continue;

    const tags = element.tags || {};

    const aliases = [
      tags["name:ru"],
      tags["name:uz"],
      tags["name:en"],
      tags.name,
      tags.alt_name,
      tags.official_name,
      tags["name:latin"],
    ].filter(Boolean);

    if (!aliases.length) continue;

    const record = {
      name: tags["name:ru"] || tags["name:uz"] || tags.name || aliases[0],

      aliases: [...new Set(aliases)],

      coords,
    };

    stationRecords.push(record);

    for (const alias of record.aliases) {
      coordinateIndex.set(normalizeName(alias), coords);
    }
  }
}

// Загружаем станции из Overpass API.

async function fetchStationData() {
  const cached = readJSON(CACHE_KEY, null);

  if (
    cached &&
    Date.now() - cached.savedAt < CACHE_TTL &&
    Array.isArray(cached.elements)
  ) {
    buildIndex(cached.elements);

    return stationRecords.length;
  }

  const query = `

    [out:json][timeout:25];

    (
      nwr["station"="subway"](${BOUNDS});
      nwr["railway"="station"]["subway"="yes"](${BOUNDS});
    );

    out center tags;

  `;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",

    "https://overpass.kumi.systems/api/interpreter",
  ];

  let lastError;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },

        body: new URLSearchParams({
          data: query,
        }),
      });

      if (!response.ok) {
        throw new Error(`Overpass HTTP ${response.status}`);
      }

      const data = await response.json();

      const elements = Array.isArray(data.elements) ? data.elements : [];

      buildIndex(elements);

      writeJSON(CACHE_KEY, {
        savedAt: Date.now(),

        elements,
      });

      return stationRecords.length;
    } catch (error) {
      lastError = error;

      console.warn("Station coordinates source failed:", error);
    }
  }

  throw lastError || new Error("Station data unavailable");
}

// Загружаем данные только один раз.

async function ensureStationData() {
  if (stationRecords.length) {
    return stationRecords.length;
  }

  if (!loadingPromise) {
    loadingPromise = fetchStationData().finally(() => {
      loadingPromise = null;
    });
  }

  return loadingPromise;
}

// Добавляем станции на карту.

function renderMarkers(map, key) {
  if (!map || markerGroups[key] || !stationRecords.length) {
    return;
  }

  const group = window.L.layerGroup();

  for (const station of stationRecords) {
    const marker = window.L.circleMarker(station.coords, {
      radius: 5,
      color: "#ffffff",
      weight: 2,
      fillColor: "#536dff",
      fillOpacity: 0.95,
    });

    marker.bindPopup(`

      <strong>${escapeHTML(station.name)}</strong>

      <br>

      <small>OpenStreetMap</small>

    `);

    marker.addTo(group);
  }

  group.addTo(map);

  markerGroups[key] = group;
}

// Инициализация городской карты.

export async function initCityMap() {
  if (!mapInstances.city) {
    mapInstances.city = createMap("cityMap");
  }

  const map = mapInstances.city;

  if (!map) return 0;

  setTimeout(() => map.invalidateSize(), 80);

  try {
    const count = await ensureStationData();

    renderMarkers(map, "city");

    return count;
  } catch (error) {
    console.warn("OSM station points unavailable:", error);

    return 0;
  }
}

// Инициализация карты маршрута.

export async function initRouteMap() {
  if (!mapInstances.route) {
    mapInstances.route = createMap("routeMap");
  }

  const map = mapInstances.route;

  if (!map) return 0;

  setTimeout(() => map.invalidateSize(), 80);

  try {
    const count = await ensureStationData();

    renderMarkers(map, "route");

    return count;
  } catch (error) {
    console.warn("OSM station points unavailable:", error);

    return 0;
  }
}

// Возврат на центр Ташкента.

export function centerCityMap() {
  mapInstances.city?.flyTo(CENTER, 12, { duration: 1.1 });
}

// Переход к выбранной станции.

export function focusStationOnMap(station) {
  const coords = coordinateIndex.get(normalizeName(station));

  if (!coords || !mapInstances.city) {
    return false;
  }

  mapInstances.city.flyTo(coords, 16, { duration: 0.8 });

  return true;
}

// Рисуем маршрут на отдельной карте.

export async function drawRouteOnMap(stations) {
  await initRouteMap();

  const map = mapInstances.route;

  if (!map) {
    return {
      ok: false,
      matched: 0,
    };
  }

  // Удаляем предыдущий маршрут.

  if (routeLine) {
    map.removeLayer(routeLine);
  }

  if (routeEndpoints) {
    map.removeLayer(routeEndpoints);
  }

  routeLine = null;

  routeEndpoints = null;

  const coords = stations.map(
    (name) => coordinateIndex.get(normalizeName(name)) || null,
  );

  const valid = coords.filter(Boolean);

  if (valid.length < 2) {
    return {
      ok: false,
      matched: valid.length,
    };
  }

  routeLine = window.L.polyline(valid, {
    color: "#536dff",
    weight: 6,
    opacity: 0.92,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(map);

  routeEndpoints = window.L.layerGroup([
    window.L.circleMarker(valid[0], {
      radius: 8,
      color: "#fff",
      weight: 3,
      fillColor: "#18aa7b",
      fillOpacity: 1,
    }).bindPopup("Start"),

    window.L.circleMarker(valid.at(-1), {
      radius: 8,
      color: "#fff",
      weight: 3,
      fillColor: "#ef9551",
      fillOpacity: 1,
    }).bindPopup("Destination"),
  ]).addTo(map);

  map.fitBounds(routeLine.getBounds(), {
    padding: [35, 35],
    maxZoom: 16,
  });

  return {
    ok: true,
    matched: valid.length,
  };
}

// Кнопка центрирования.

export function setupMapControls() {
  document
    .getElementById("centerMap")
    ?.addEventListener("click", centerCityMap);
}
