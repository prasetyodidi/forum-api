const CreateThread = require('../CreateThread');

describe('CreateThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const ownerId = 'user-123';
    const payload = {
      title: 'abc',
    };

    expect(() => new CreateThread(ownerId, payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const ownerId = 'user-123';
    const payload = {
      title: [],
      body: {},
    };

    expect(() => new CreateThread(ownerId, payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 255 characters', () => {
    const ownerId = 'user-123';
    const payload = {
      title: 'abc'.repeat(100),
      body: 'abc',
    };

    expect(() => new CreateThread(ownerId, payload)).toThrowError('CREATE_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create object correctly', () => {
    const ownerId = 'user-123';
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    const result = new CreateThread(ownerId, payload);

    expect(result.title).toEqual(payload.title);
    expect(result.body).toEqual(payload.body);
    expect(result.owner).toEqual(ownerId);
  });
});
