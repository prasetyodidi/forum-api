const CreateThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(owner, useCasePayload) {
    const createThread = new CreateThread(owner, useCasePayload);
    return this._threadRepository.addThread(createThread);
  }
}

module.exports = AddThreadUseCase;
