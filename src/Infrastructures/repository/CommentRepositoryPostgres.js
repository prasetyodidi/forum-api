const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const { mapDBToGetCommentByThreadId } = require('../../utils');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const { content, threadId, owner } = createComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, owner, threadId, content, isDelete, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new CreatedComment(result.rows[0]);
  }

  async verifyCommentExist(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment Tidak Ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk menghapus komentar');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, c.owner, c.thread_id, c.is_delete, c.created_at, c.content, u.username
              FROM comments c
              JOIN users u ON u.id = c.owner
              WHERE c.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToGetCommentByThreadId);
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
