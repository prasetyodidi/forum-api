class CreateReply {
  constructor(owner, commentId, payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.owner = owner;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateReply;
