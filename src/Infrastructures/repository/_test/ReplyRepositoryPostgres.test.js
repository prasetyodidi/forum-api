const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ReplyRepositoryPostgresTest = require('../ReplyRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgresTest', () => {
  const userId = 'user-reply-test';
  const threadId = 'thread-reply-test';
  const commentId = 'comment-reply-test';
  const idGenerator = () => '123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should should persist create reply and return created reply correctly', async () => {
      const payload = {
        content: 'reply content',
      };
      const createReply = new CreateReply(userId, commentId, payload);
      const replyRepositoryPostgres = new ReplyRepositoryPostgresTest(pool, idGenerator);

      await replyRepositoryPostgres.addReply(createReply);

      const reply = await RepliesTableTestHelper.findRepliesById(`reply-${idGenerator()}`);
      expect(reply).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      const payload = { content: 'Reply content' };
      const createReply = new CreateReply(userId, commentId, payload);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, idGenerator);

      const createdComment = await replyRepositoryPostgres.addReply(createReply);

      expect(createdComment).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: 'Reply content',
        owner: userId,
      }));
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply', async () => {
      const replyId = 'reply-111';
      await RepliesTableTestHelper.addReply({ id: replyId, owner: userId, commentId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteById(replyId);

      const result = await RepliesTableTestHelper.findRepliesById(replyId);
      const { id, is_delete: isDelete } = result[0];
      expect(id).toEqual(replyId);
      expect(isDelete).toBe(true);
    });
  });

  describe('verifyReplyExist function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExist('')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw Not Found Error when reply found', async () => {
      const replyId = 'comment-123';
      await RepliesTableTestHelper.addReply({ id: replyId, owner: userId, commentId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExist(replyId))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when the owner is invalid', async () => {
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, ''))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the owner is valid', async () => {
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('getReplyCommentId function', () => {
    it('should ', async () => {
      const date = new Date().toISOString();
      const replyId1 = 'reply-111';
      const replyId2 = 'reply-222';
      const expectedResult = [
        {
          id: replyId1,
          content: 'abc',
          isDelete: false,
          date,
          username: 'dicoding',
        },
        {
          id: replyId2,
          content: 'abc',
          isDelete: true,
          date,
          username: 'dicoding',
        },
      ];
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      await RepliesTableTestHelper.addReply({
        id: replyId1, owner: userId, commentId, date,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId2, owner: userId, isDelete: true, commentId, date,
      });

      const replies = await replyRepositoryPostgres.getReplyCommentId(commentId);

      expect(replies).toHaveLength(2);
      expect(replies).toStrictEqual(expectedResult);
    });
  });
});
