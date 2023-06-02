const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      comments: [],
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    const payload = {
      id: 123,
      title: 'Thread title',
      body: 'Thread body',
      date: '2020-01-01',
      username: 'developer',
      comments: [],
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create thread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2020-01-01',
      username: 'developer',
      comments: [],
    };

    const {
      id,
      title,
      body,
      date,
      username,
      comments,
    } = new Thread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
