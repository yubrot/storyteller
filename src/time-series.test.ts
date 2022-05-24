import { test, expect } from 'vitest';
import { binarySearch, binarySearchRange, replay } from './time-series';

test('binarySearch', () => {
  function data(...nums: number[]): { at: number }[] {
    return nums.map(at => ({ at }));
  }

  expect(binarySearch(data(), 0)).toEqual(null);
  expect(binarySearch(data(0), 0)).toEqual(['just', 0, 1]);
  expect(binarySearch(data(0), 1)).toEqual('after-end');
  expect(binarySearch(data(1), 0)).toEqual('before-start');
  expect(binarySearch(data(1, 3), 0)).toEqual('before-start');
  expect(binarySearch(data(1, 3), 1)).toEqual(['just', 0, 1]);
  expect(binarySearch(data(1, 3), 2)).toEqual(['before', 1]);
  expect(binarySearch(data(1, 3), 3)).toEqual(['just', 1, 2]);
  expect(binarySearch(data(1, 3), 4)).toEqual('after-end');
  expect(binarySearch(data(1, 3, 5), 0)).toEqual('before-start');
  expect(binarySearch(data(1, 3, 5), 1)).toEqual(['just', 0, 1]);
  expect(binarySearch(data(1, 3, 5), 2)).toEqual(['before', 1]);
  expect(binarySearch(data(1, 3, 5), 3)).toEqual(['just', 1, 2]);
  expect(binarySearch(data(1, 3, 5), 4)).toEqual(['before', 2]);
  expect(binarySearch(data(1, 3, 5), 5)).toEqual(['just', 2, 3]);
  expect(binarySearch(data(1, 3, 5), 6)).toEqual('after-end');
  expect(binarySearch(data(1, 3, 5, 7), 0)).toEqual('before-start');
  expect(binarySearch(data(1, 3, 5, 7), 1)).toEqual(['just', 0, 1]);
  expect(binarySearch(data(1, 3, 5, 7), 2)).toEqual(['before', 1]);
  expect(binarySearch(data(1, 3, 5, 7), 3)).toEqual(['just', 1, 2]);
  expect(binarySearch(data(1, 3, 5, 7), 4)).toEqual(['before', 2]);
  expect(binarySearch(data(1, 3, 5, 7), 5)).toEqual(['just', 2, 3]);
  expect(binarySearch(data(1, 3, 5, 7), 6)).toEqual(['before', 3]);
  expect(binarySearch(data(1, 3, 5, 7), 7)).toEqual(['just', 3, 4]);
  expect(binarySearch(data(1, 3, 5, 7), 8)).toEqual('after-end');
  expect(binarySearch(data(1, 3, 5, 7, 9), 0)).toEqual('before-start');
  expect(binarySearch(data(1, 3, 5, 7, 9), 1)).toEqual(['just', 0, 1]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 2)).toEqual(['before', 1]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 3)).toEqual(['just', 1, 2]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 4)).toEqual(['before', 2]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 5)).toEqual(['just', 2, 3]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 6)).toEqual(['before', 3]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 7)).toEqual(['just', 3, 4]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 8)).toEqual(['before', 4]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 9)).toEqual(['just', 4, 5]);
  expect(binarySearch(data(1, 3, 5, 7, 9), 10)).toEqual('after-end');
  expect(binarySearch(data(1, 1, 1, 2, 2, 2, 3, 3, 3), 1)).toEqual(['just', 0, 3]);
  expect(binarySearch(data(1, 1, 1, 2, 2, 2, 3, 3, 3), 2)).toEqual(['just', 3, 6]);
  expect(binarySearch(data(1, 1, 1, 2, 2, 2, 3, 3, 3), 3)).toEqual(['just', 6, 9]);
});

test('binarySearchRange', () => {
  function data(...nums: number[]): { at: number }[] {
    return nums.map(at => ({ at }));
  }

  expect(binarySearchRange(data(), 1, 'inclusive', 1, 'inclusive')).toEqual(null);
  expect(binarySearchRange(data(1), 1, 'exclusive', 1, 'exclusive')).toEqual(null);
  expect(binarySearchRange(data(1), 1, 'inclusive', 1, 'exclusive')).toEqual(null);
  expect(binarySearchRange(data(1), 1, 'exclusive', 1, 'inclusive')).toEqual(null);
  expect(binarySearchRange(data(1), 1, 'inclusive', 1, 'inclusive')).toEqual([0, 1]);
  expect(binarySearchRange(data(1), 0, 'exclusive', 1, 'inclusive')).toEqual([0, 1]);
  expect(binarySearchRange(data(1), 1, 'inclusive', 2, 'exclusive')).toEqual([0, 1]);
  expect(binarySearchRange(data(1, 3), 1, 'inclusive', 3, 'inclusive')).toEqual([0, 2]);
  expect(binarySearchRange(data(1, 3), 1, 'exclusive', 3, 'inclusive')).toEqual([1, 2]);
  expect(binarySearchRange(data(1, 3), 1, 'inclusive', 3, 'exclusive')).toEqual([0, 1]);
  expect(binarySearchRange(data(1, 3), 1, 'exclusive', 3, 'exclusive')).toEqual(null);
  expect(binarySearchRange(data(1, 3), 0, 'exclusive', 2, 'exclusive')).toEqual([0, 1]);
  expect(binarySearchRange(data(1, 3), 0, 'exclusive', 2, 'inclusive')).toEqual([0, 1]);
  expect(binarySearchRange(data(1, 3), 2, 'exclusive', 4, 'exclusive')).toEqual([1, 2]);
  expect(binarySearchRange(data(1, 3), 2, 'inclusive', 4, 'exclusive')).toEqual([1, 2]);
  expect(binarySearchRange(data(1, 2, 2, 2, 3), 2, 'inclusive', 2, 'inclusive')).toEqual([1, 4]);
  expect(binarySearchRange(data(1, 2, 2, 2, 3), 2, 'inclusive', 3, 'exclusive')).toEqual([1, 4]);
  expect(binarySearchRange(data(1, 2, 2, 2, 3), 1, 'exclusive', 2, 'inclusive')).toEqual([1, 4]);
});

test('replay', () => {
  type Event = { at: number; value: string };
  type Snapshot = { at: number; value: string };

  const events: Event[] = [
    { at: 0, value: 'A' },
    { at: 1, value: 'B' },
    { at: 2, value: 'C' },
    { at: 3, value: 'D' },
    { at: 3, value: 'E' },
    { at: 4, value: 'F' },
    { at: 5, value: 'G' },
    { at: 6, value: 'H' },
    { at: 7, value: 'I' },
  ];

  function run({
    at,
    eventsPerSnapshot = Infinity,
    cache = [],
  }: {
    at: number;
    eventsPerSnapshot?: number;
    cache?: Snapshot[];
  }): {
    cache: Snapshot[];
    index: number;
  } {
    const index = replay(
      events,
      cache,
      at,
      at => ({ at, value: '' }),
      ({ value }, es, at) => ({ at, value: value + es.map(e => e.value).join('') }),
      eventsPerSnapshot
    );
    return { cache, index };
  }

  expect(run({ at: -1 })).toEqual({
    index: 0,
    cache: [{ at: -1, value: '' }],
  });

  expect(run({ at: 0 })).toEqual({
    index: 0,
    cache: [{ at: 0, value: 'A' }],
  });

  expect(run({ at: 5 })).toEqual({
    index: 0,
    cache: [{ at: 5, value: 'ABCDEFG' }],
  });

  expect(run({ at: 4, eventsPerSnapshot: 2 })).toEqual({
    index: 2,
    cache: [
      { at: 1, value: 'AB' },
      { at: 3, value: 'ABCDE' },
      { at: 4, value: 'ABCDEF' },
    ],
  });

  expect(run({ at: 3, eventsPerSnapshot: 1 })).toEqual({
    index: 3,
    cache: [
      { at: 0, value: 'A' },
      { at: 1, value: 'AB' },
      { at: 2, value: 'ABC' },
      { at: 3, value: 'ABCDE' },
    ],
  });

  expect(run({ at: 10 })).toEqual({
    index: 0,
    cache: [{ at: 10, value: 'ABCDEFGHI' }],
  });

  {
    const { cache } = run({ at: 0 });
    expect(run({ at: 2, cache })).toEqual({
      index: 1,
      cache: [
        { at: 0, value: 'A' },
        { at: 2, value: 'ABC' },
      ],
    });
  }

  {
    const { cache } = run({ at: 10 });
    expect(run({ at: 12, cache })).toEqual({
      index: 1,
      cache: [
        { at: 10, value: 'ABCDEFGHI' },
        { at: 12, value: 'ABCDEFGHI' },
      ],
    });
  }

  {
    const { cache } = run({ at: 2 });
    expect(run({ at: 2, cache })).toEqual({
      index: 0,
      cache: [{ at: 2, value: 'ABC' }],
    });
  }

  {
    const { cache } = run({ at: 10, eventsPerSnapshot: 4 });
    expect(run({ at: 5, cache })).toEqual({
      index: 1,
      cache: [
        { at: 3, value: 'ABCDE' },
        { at: 5, value: 'ABCDEFG' },
        { at: 10, value: 'ABCDEFGHI' },
      ],
    });
  }
});
