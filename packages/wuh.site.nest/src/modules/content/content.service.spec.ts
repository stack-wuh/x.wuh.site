import { ContentService } from './content.service';

describe('ContentService getLabelSummaries', () => {
  it('aggregates open labels by count and name', async () => {
    const exec = jest.fn().mockResolvedValue([
      { name: 'frontend', count: 3 },
      { name: 'nextjs', count: 2 },
    ]);
    const aggregate = jest.fn().mockReturnValue({ exec });
    const service = new ContentService({ aggregate } as any, {} as any);

    const result = await service.getLabelSummaries({ state: 'open' });

    expect(result).toEqual([
      { name: 'frontend', count: 3 },
      { name: 'nextjs', count: 2 },
    ]);
    expect(aggregate).toHaveBeenCalledWith([
      { $match: { state: 'open' } },
      { $unwind: '$labels' },
      { $match: { labels: { $type: 'string', $ne: '' } } },
      { $group: { _id: '$labels', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { count: -1, name: 1 } },
    ]);
  });
});
