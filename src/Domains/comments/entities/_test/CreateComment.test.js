const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: undefined,
    };

    expect(() => new CreateComment(owner, threadId, payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 111,
    };

    expect(() => new CreateComment(owner, threadId, payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object correctly', () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 'abc',
    };

    const result = new CreateComment(owner, threadId, payload);

    expect(result.owner).toEqual(owner);
    expect(result.threadId).toEqual(threadId);
    expect(result.content).toEqual(payload.content);
  });
});
