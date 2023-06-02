const CreatedComment = require('../CreatedComment');

describe('CreatedCommentTest entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: {},
      owner: [],
      content: 111,
    };

    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object correctly', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: 'abc',
    };

    const result = new CreatedComment(payload);

    expect(result.id).toEqual(payload.id);
    expect(result.owner).toEqual(payload.owner);
    expect(result.content).toEqual(payload.content);
  });
});
