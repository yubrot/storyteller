export interface Datum {
  at: number;
}

export type BinarySearchResult =
  | [tag: 'just', fromInclusive: number, toExclusive: number]
  | 'before-start'
  | 'after-end'
  | [tag: 'before', index: number] // 0 < index < data.length
  | null;

export function binarySearch<T extends Datum>(data: readonly T[], at: number): BinarySearchResult {
  if (data.length == 0) return null;

  function just(p: number): ['just', number, number] {
    let i = p;
    let j = p + 1;
    while (0 < i && data[i - 1].at == at) i--;
    while (j < data.length && data[j].at == at) j++;
    return ['just', i, j];
  }

  let i = 0;
  let j = data.length - 1;
  while (i + 1 < j) {
    const p = Math.floor((i + j) / 2);
    if (data[p].at == at) {
      return just(p);
    } else if (data[p].at < at) {
      i = p + 1;
    } else {
      j = p - 1;
    }
  }
  const p = i == j ? i : data[i].at < at ? j : i;
  if (data[p].at == at) {
    return just(p);
  } else if (data[p].at < at) {
    if (p == data.length - 1) return 'after-end';
    return ['before', p + 1]; // between p .. p+1
  } else {
    if (p == 0) return 'before-start';
    return ['before', p]; // between p-1 .. p
  }
}

export type EndpointType = 'inclusive' | 'exclusive';

export function binarySearchRange<T extends Datum>(
  data: readonly T[],
  startAt: number,
  startType: EndpointType,
  endAt: number,
  endType: EndpointType
): [number, number] | null {
  const s = binarySearch(data, startAt);
  const e = binarySearch(data, endAt);
  if (s === null || e === null) return null;
  const a = binarySearchResultIndex(data, s, `${startType}-start`);
  const b = binarySearchResultIndex(data, e, `${endType}-end`);
  return a < b ? [a, b] : null;
}

type Endpoint = 'start' | 'end';

function binarySearchResultIndex<T>(
  data: readonly T[],
  result: Exclude<BinarySearchResult, null>,
  mode: `${EndpointType}-${Endpoint}`
): number {
  if (result == 'before-start') return 0;
  if (result == 'after-end') return data.length;
  if (result[0] == 'just') {
    return mode == 'inclusive-start' || mode == 'exclusive-end' ? result[1] : result[2];
  }
  return result[1];
}

export function replay<T extends Datum, E extends Datum>(
  events: readonly E[],
  snapshots: T[],
  at: number,
  init: (at: number) => T,
  accumulate: (snapshot: T, events: E[], at: number) => T,
  eventsPerSnapshot: number
): number {
  eventsPerSnapshot = Math.max(eventsPerSnapshot, 1);

  const r = binarySearch(snapshots, at);

  let insertIndex;
  let snapshot: T;
  if (!r || r == 'before-start') {
    insertIndex = 0;
    snapshot = init(-Infinity);
  } else if (r == 'after-end') {
    insertIndex = snapshots.length;
    snapshot = snapshots[snapshots.length - 1];
  } else if (r[0] == 'just') {
    return r[1];
  } else {
    insertIndex = r[1];
    snapshot = snapshots[r[1] - 1];
  }

  let [s, e] = binarySearchRange(events, snapshot.at, 'exclusive', at, 'inclusive') ?? [0, 0];

  while (s + eventsPerSnapshot < e) {
    let p = s + eventsPerSnapshot;
    const lastAt = events[p - 1].at;
    if (lastAt == at) break;
    while (p < e && events[p].at == lastAt) ++p;
    snapshot = accumulate(snapshot, events.slice(s, p), lastAt);
    snapshots.splice(insertIndex, 0, snapshot);
    ++insertIndex;
    s = p;
  }

  snapshot = accumulate(snapshot, events.slice(s, e), at);
  snapshots.splice(insertIndex, 0, snapshot);
  return insertIndex;
}
