import { calculateActivityLevels } from './about-activity.utils';

describe('calculateActivityLevels', () => {
  it('normalizes each activity category independently and averages levels', () => {
    const days = [
      {
        date: '2026-07-24',
        breakdown: {
          visits: 0,
          published: 0,
          updated: 0,
          comments: 0,
          guestbook: 0,
          projectUpdates: 0,
        },
      },
      {
        date: '2026-07-25',
        breakdown: {
          visits: 10,
          published: 1,
          updated: 2,
          comments: 3,
          guestbook: 4,
          projectUpdates: 5,
        },
      },
      {
        date: '2026-07-26',
        breakdown: {
          visits: 20,
          published: 2,
          updated: 4,
          comments: 6,
          guestbook: 8,
          projectUpdates: 10,
        },
      },
    ];

    const result = calculateActivityLevels(days);

    expect(result).toEqual([
      {
        date: '2026-07-24',
        breakdown: days[0].breakdown,
        levels: {
          visits: 0,
          published: 0,
          updated: 0,
          comments: 0,
          guestbook: 0,
          projectUpdates: 0,
        },
        count: 0,
        level: 0,
      },
      {
        date: '2026-07-25',
        breakdown: days[1].breakdown,
        levels: {
          visits: 2,
          published: 2,
          updated: 2,
          comments: 2,
          guestbook: 2,
          projectUpdates: 2,
        },
        count: 25,
        level: 2,
      },
      {
        date: '2026-07-26',
        breakdown: days[2].breakdown,
        levels: {
          visits: 4,
          published: 4,
          updated: 4,
          comments: 4,
          guestbook: 4,
          projectUpdates: 4,
        },
        count: 50,
        level: 4,
      },
    ]);
  });
});
