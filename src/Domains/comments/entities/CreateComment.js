class CreateComment {
  constructor(owner, threadId, payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateComment;
