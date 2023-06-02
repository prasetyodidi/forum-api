const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const { mapDBGetThreadById } = require('../../utils');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread) {
    const { owner, title, body } = createThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new CreatedThread(result.rows[0]);
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.owner, t.created_at, u.username
              FROM threads t
              JOIN users u on u.id = t.owner
              WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread not found');
    }

    return mapDBGetThreadById(result.rows[0]);
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread not found');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
