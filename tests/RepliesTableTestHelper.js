const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    owner = 'user-123',
    commentId = 'comment-123',
    content = 'abc',
    isDelete = false,
    date,
  }) {
    const createdAt = date ?? new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, owner, commentId, content, isDelete, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
