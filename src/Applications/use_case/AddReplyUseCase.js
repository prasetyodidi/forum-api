const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(owner, commentId, threadId, useCasePayload) {
    const createReply = new CreateReply(owner, commentId, useCasePayload);
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
