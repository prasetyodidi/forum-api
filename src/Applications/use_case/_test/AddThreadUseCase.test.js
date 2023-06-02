const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };

    const mockCreatedThread = new CreatedThread({
      id: threadId,
      title: useCasePayload.title,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
      new CreatedThread({
        id: threadId,
        title: useCasePayload.title,
        owner: userId,
      }),
    ));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const createdThread = await addThreadUseCase.execute(userId, useCasePayload);

    expect(createdThread).toStrictEqual(mockCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread(userId, {
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
