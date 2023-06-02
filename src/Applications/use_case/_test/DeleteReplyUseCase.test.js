const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const userId = 'user-123';

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteById = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteReplyUseCase.execute(commentId, replyId, userId);

    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.verifyReplyExist).toHaveBeenCalledWith(replyId);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(replyId, userId);
    expect(mockReplyRepository.deleteById).toHaveBeenCalledWith(replyId);
  });
});
