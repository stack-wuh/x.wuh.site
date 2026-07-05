import { WereadService } from './weread.service';

const createQuery = (result: unknown) => {
  const query = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  };
  return query;
};

describe('WereadService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('persists the WeRead shelf index when syncing books', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({
        books: [
          { bookId: 'a', title: 'First', author: 'A', readUpdateTime: 100, finishReading: 0 },
          { bookId: 'b', title: 'Second', author: 'B', readUpdateTime: 200, finishReading: 1 },
        ],
      }),
    } as Response);

    const updateOne = jest.fn().mockResolvedValue({});
    const service = new WereadService(
      { get: jest.fn().mockReturnValue('wrk-test') } as any,
      { updateOne } as any,
    );

    await service.syncBooks();

    expect(updateOne).toHaveBeenNthCalledWith(
      1,
      { bookId: 'a' },
      {
        $set: expect.objectContaining({
          bookId: 'a',
          shelfIndex: 0,
        }),
      },
      { upsert: true },
    );
    expect(updateOne).toHaveBeenNthCalledWith(
      2,
      { bookId: 'b' },
      {
        $set: expect.objectContaining({
          bookId: 'b',
          shelfIndex: 1,
        }),
      },
      { upsert: true },
    );
  });

  it('returns paginated books in shelf order by default', async () => {
    const query = createQuery([{ bookId: 'a', shelfIndex: 0 }]);
    const service = new WereadService(
      { get: jest.fn().mockReturnValue('') } as any,
      {
        find: jest.fn().mockReturnValue(query),
        countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
      } as any,
    );

    await service.getBooks(1, 10);

    expect(query.sort).toHaveBeenCalledWith({ shelfIndex: 1, readUpdateTime: -1 });
  });

  it('filters by reading status before paginating', async () => {
    const query = createQuery([{ bookId: 'a', finishReading: 0 }]);
    const find = jest.fn().mockReturnValue(query);
    const countDocuments = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });
    const service = new WereadService(
      { get: jest.fn().mockReturnValue('') } as any,
      { find, countDocuments } as any,
    );

    await service.getBooks(1, 6, 0);

    expect(find).toHaveBeenCalledWith({ finishReading: 0 });
    expect(countDocuments).toHaveBeenCalledWith({ finishReading: 0 });
  });
});
