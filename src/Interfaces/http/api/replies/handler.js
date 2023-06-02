const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyByCommentIdHandler = this.postReplyByCommentIdHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyByCommentIdHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { commentId, threadId } = request.params;
    const payload = {
      content: request.payload.content,
    };

    const addedReply = await addReplyUseCase.execute(owner, commentId, threadId, payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { commentId, replyId } = request.params;

    await deleteReplyUseCase.execute(commentId, replyId, owner);

    return {
      status: 'success',
      message: 'Berhasil menghapus balsan',
    };
  }
}

module.exports = RepliesHandler;
