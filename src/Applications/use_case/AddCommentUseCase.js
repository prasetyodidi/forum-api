const CreateComment = require('../../Domains/comments/entities/CreateComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(owner, threadId, useCasePayload) {
    const createComment = new CreateComment(owner, threadId, useCasePayload);
    await this._threadRepository.verifyThreadExists(threadId);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
