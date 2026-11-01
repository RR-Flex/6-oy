import { LINES, TRANSFERS } from "./data.js";

export function allStations() {
  return [...new Set(LINES.flatMap((line) => line.stations))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
}

export function lineForStation(station) {
  return LINES.find((line) => line.stations.includes(station)) ?? null;
}

export function lineForStationList(station) {
  return LINES.filter((line) => line.stations.includes(station));
}

// Создаём граф связей станций.

function buildGraph() {
  const graph = new Map();

  const connect = (a, b) => {
    if (!graph.has(a)) {
      graph.set(a, []);
    }

    graph.get(a).push(b);
  };

  // Соединяем соседние станции на каждой линии.

  for (const line of LINES) {
    for (let i = 1; i < line.stations.length; i += 1) {
      const current = line.stations[i];

      const previous = line.stations[i - 1];

      connect(current, previous);
      connect(previous, current);
    }
  }

  // Добавляем переходы между линиями.

  for (const [a, b] of TRANSFERS) {
    connect(a, b);
    connect(b, a);
  }

  return graph;
}

const graph = buildGraph();

// Поиск кратчайшего маршрута.

export function shortestPath(start, end) {
  if (!start || !end || !graph.has(start) || !graph.has(end)) {
    return null;
  }

  if (start === end) {
    return [start];
  }

  const queue = [start];

  const previous = new Map([[start, null]]);

  let index = 0;

  while (index < queue.length) {
    const current = queue[index++];

    for (const next of graph.get(current) ?? []) {
      if (previous.has(next)) continue;

      previous.set(next, current);

      if (next === end) {
        const path = [end];

        let step = end;

        while (previous.get(step) !== null) {
          step = previous.get(step);

          path.unshift(step);
        }

        return path;
      }

      queue.push(next);
    }
  }

  return null;
}

export function isTransfer(station) {
  return TRANSFERS.some((pair) => pair.includes(station));
}

export function transferCount(path = []) {
  return path.filter(isTransfer).length;
}
