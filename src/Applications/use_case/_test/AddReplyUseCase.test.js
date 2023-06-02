const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const replyId = 'reply-123';
    const commentId = 'comment-123';
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      content: 'some comment message',
    };

    const mockCreatedReply = new CreatedReply({
      id: replyId,
      owner: userId,
      content: useCasePayload.content,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(
      new CreatedReply({
        id: replyId,
        content: useCasePayload.content,
        owner: userId,
      }),
    ));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const createdReply = await addReplyUseCase.execute(userId, commentId, threadId, useCasePayload);
    expect(createdReply).toStrictEqual(mockCreatedReply);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new CreateReply(userId, commentId, useCasePayload));
  });
});
