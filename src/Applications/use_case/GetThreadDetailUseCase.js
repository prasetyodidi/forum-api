const { mapReplies } = require('../../utils');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const resultComments = await this._commentRepository.getCommentByThreadId(threadId);

    const comments = await Promise.all(resultComments.map(async (item) => {
      const commentContent = item.isDelete ? '**komentar telah dihapus**' : item.content;
      const resultReplies = await this._replyRepository.getReplyCommentId(item.id);
      const replies = resultReplies.map(mapReplies);

      return {
        id: item.id,
        username: item.username,
        date: item.date,
        content: commentContent,
        replies,
      };
    }));

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments,
    };
  }
}

module.exports = GetThreadDetailUseCase;
