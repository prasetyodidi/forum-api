const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-comment-test';
  const threadId = 'thread-comment-test';
  const idGenerator = () => '123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      const payload = {
        content: 'comment content',
      };
      const createComment = new CreateComment(userId, threadId, payload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);

      await commentRepositoryPostgres.addComment(createComment);

      const comment = await CommentsTableTestHelper.findCommentById(`comment-${idGenerator()}`);
      expect(comment).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      const payload = { content: 'Comment content' };
      const createComment = new CreateComment(userId, threadId, payload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);

      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'Comment content',
        owner: userId,
      }));
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExist('')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw Not Found Error when comment found', async () => {
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExist(commentId))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when the owner is invalid', async () => {
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, ''))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the owner is valid', async () => {
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments payload correctly', async () => {
      const commentId1 = 'comment-111';
      const commentId2 = 'comment-222';
      const date = new Date().toISOString();
      const expectedResult = [
        {
          id: commentId1,
          owner: userId,
          threadId,
          isDelete: false,
          date,
          content: 'abc',
          username: 'dicoding',
        },
        {
          id: commentId2,
          owner: userId,
          threadId,
          isDelete: false,
          date,
          content: 'abc',
          username: 'dicoding',
        },
      ];
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({
        id: commentId1, threadId, owner: userId, date,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId2, threadId, owner: userId, date,
      });

      const comments = await commentRepositoryPostgres.getCommentByThreadId(threadId);

      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual(expectedResult);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment', async () => {
      const commentId = 'comment-111';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById(commentId);

      const result = await CommentsTableTestHelper.findCommentById(commentId);
      const { id, is_delete: isDelete } = result[0];
      expect(id).toEqual(commentId);
      expect(isDelete).toBe(true);
    });
  });
});
