const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const { mapDBToGetReplyCommentId } = require('../../utils');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(createReply) {
    const { content, owner, commentId } = createReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, owner, commentId, content, isDelete, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new CreatedReply(result.rows[0]);
  }

  async deleteById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async verifyReplyExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply Tidak Ditemukan');
    }
  }

  async verifyReplyOwner(replyId, ownerId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk menghapus balasan');
    }
  }

  async getReplyCommentId(commentId) {
    const query = {
      text: `SELECT r.id, r.content, r.is_delete, r.created_at, u.username
              FROM replies r
              JOIN users u on u.id = r.owner
              WHERE r.comment_id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToGetReplyCommentId);
  }
}

module.exports = ReplyRepositoryPostgres;
