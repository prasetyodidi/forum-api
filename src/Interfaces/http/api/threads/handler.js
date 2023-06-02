const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const { id: owner } = request.auth.credentials;

    const payload = {
      title: request.payload.title,
      body: request.payload.body,
    };
    const addedThread = await addThreadUseCase.execute(owner, payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;

    const thread = await getThreadDetailUseCase.execute(threadId);

    return {
      status: 'success',
      message: 'Detail Thread',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
