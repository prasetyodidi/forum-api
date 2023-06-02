const pool = require('../../database/postgres/pool');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  const userId = 'user-thread-test';
  const idGenerator = () => '123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      const payload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      const createThread = new CreateThread(userId, payload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);

      await threadRepositoryPostgres.addThread(createThread);

      const thread = await ThreadsTableTestHelper.findThreadById(`thread-${idGenerator()}`);
      expect(thread).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      const payload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      const createThread = new CreateThread(userId, payload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);

      const result = await threadRepositoryPostgres.addThread(createThread);

      expect(result).toStrictEqual(new CreatedThread({
        id: `thread-${idGenerator()}`,
        title: 'Thread title',
        owner: userId,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread payload correctly', async () => {
      const threadId = `thread-${idGenerator()}`;
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId, date });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);
      const expectedResult = {
        id: threadId,
        title: 'abc',
        body: 'abc',
        owner: userId,
        username: 'dicoding',
        date,
      };

      const result = await threadRepositoryPostgres.getThreadById(threadId);

      expect(result).toStrictEqual(expectedResult);
    });

    it('should throw error when thread not found', async () => {
      const threadId = 'thread-111';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);

      await expect(threadRepositoryPostgres.getThreadById(threadId))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw error when thread not found', async () => {
      const threadId = 'thread-111';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);

      await expect(threadRepositoryPostgres.verifyThreadExists(threadId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error when thread found', async () => {
      const threadId = `thread-${idGenerator()}`;
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idGenerator);

      await expect(threadRepositoryPostgres.verifyThreadExists(threadId))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});
