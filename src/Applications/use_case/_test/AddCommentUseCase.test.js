const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const commentId = 'comment-123';
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'some comment message',
    };

    const mockCreatedComment = new CreatedComment({
      id: commentId,
      owner: userId,
      content: useCasePayload.content,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new CreatedComment({
        id: commentId,
        content: useCasePayload.content,
        owner: userId,
      }),
    ));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const createdComment = await addCommentUseCase.execute(userId, threadId, useCasePayload);

    expect(createdComment).toStrictEqual(mockCreatedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new CreateComment(userId, threadId, useCasePayload));
  });
});
