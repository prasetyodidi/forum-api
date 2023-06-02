const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'abc',
      date: '2023-5-1',
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      id: [],
      content: 111,
      date: {},
      username: 111,
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'abc',
      date: '2023-5-1',
      username: 'developer',
    };

    const result = new Reply(payload);

    expect(result.id).toEqual(payload.id);
    expect(result.content).toEqual(payload.content);
    expect(result.date).toEqual(payload.date);
    expect(result.username).toEqual(payload.username);
  });
});
