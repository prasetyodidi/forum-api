const CreatedThread = require('../CreatedThread');

describe('CreatedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const ownerId = 'user-123';
    const payload = {
      id: 'user-123',
      title: 'abc',
    };

    expect(() => new CreatedThread(ownerId, payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: [],
      owner: {},
    };

    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'abc',
      owner: 'user-123',
    };

    const result = new CreatedThread(payload);

    expect(result.id).toEqual(payload.id);
    expect(result.title).toEqual(payload.title);
    expect(result.owner).toEqual(payload.owner);
  });
});
