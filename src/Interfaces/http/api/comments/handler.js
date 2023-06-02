const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentByThreadIdHandler = this.postCommentByThreadIdHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentByThreadIdHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const payload = {
      content: request.payload.content,
    };

    const addedComment = await addCommentUseCase.execute(owner, threadId, payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(threadId, commentId, owner);

    return {
      status: 'success',
      message: 'Berhasil menghapus comment',
    };
  }
}

module.exports = CommentsHandler;
