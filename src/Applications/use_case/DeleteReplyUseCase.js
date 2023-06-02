class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(commentId, replyId, owner) {
    await this._commentRepository.verifyCommentExist(commentId);
    await this._replyRepository.verifyReplyExist(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
