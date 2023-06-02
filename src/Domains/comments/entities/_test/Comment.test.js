const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'developer',
      date: '2023-5-1',
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet daya specification', () => {
    const payload = {
      id: [],
      username: 111,
      content: 111,
      date: [],
      replies: {},
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'developer',
      content: 'abc',
      date: '2023-5-1',
      replies: [],
    };

    const result = new Comment(payload);

    expect(result.id).toEqual(payload.id);
    expect(result.username).toEqual(payload.username);
    expect(result.content).toEqual(payload.content);
    expect(result.date).toEqual(payload.date);
    expect(result.replies).toEqual(payload.replies);
  });
});
