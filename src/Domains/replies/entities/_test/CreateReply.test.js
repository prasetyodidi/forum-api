const CreateReply = require('../CreateReply');

describe('CreateReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const owner = 'user-123';
    const commentId = 'comment-123';
    const payload = {
      content: undefined,
    };

    expect(() => new CreateReply(owner, commentId, payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const owner = 'user-123';
    const commentId = 'comment-123';
    const payload = {
      content: 123,
    };

    expect(() => new CreateReply(owner, commentId, payload))
      .toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object correctly', () => {
    const owner = 'user-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'abc',
    };

    const result = new CreateReply(owner, commentId, payload);

    expect(result.owner).toEqual(owner);
    expect(result.commentId).toEqual(commentId);
    expect(result.content).toEqual(payload.content);
  });
});
