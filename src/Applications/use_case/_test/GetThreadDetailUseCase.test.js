const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const threadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const payloadThread = {
      id: 'thread-123',
      title: 'javascript',
      body: 'thread body',
      owner: 'user-123',
      date: '2023-05-23T15:30:15.600Z',
    };

    const payloadComment1 = {
      id: 'comment-111',
      owner: 'user-111',
      thread_id: 'thread-111',
      content: 'comment content',
      is_delete: true,
      date: '2023-05-23T15:30:15.600Z',
      username: 'user 111',
    };

    const payloadComment2 = {
      id: 'comment-222',
      owner: 'user-222',
      thread_id: 'thread-111',
      content: 'comment content',
      is_delete: true,
      date: '2023-05-23T15:30:15.600Z',
      username: 'user 222',
    };

    const payloadReply1 = {
      id: 'reply-111',
      content: 'comment content',
      date: '2023-05-23T15:30:15.600Z',
      username: 'user 222',
    };

    const payloadReply2 = {
      id: 'reply-222',
      content: 'comment content',
      date: '2023-05-23T15:30:15.600Z',
      username: 'user 222',
    };

    const expectedResult = {
      id: payloadThread.id,
      title: payloadThread.title,
      body: payloadThread.body,
      date: payloadThread.date,
      username: payloadThread.username,
      comments: [
        {
          id: payloadComment1.id,
          username: payloadComment1.username,
          date: payloadComment1.date,
          content: payloadComment1.content,
          replies: [
            {
              id: payloadReply1.id,
              username: payloadReply1.username,
              date: payloadReply1.date,
              content: payloadReply1.content,
            },
            {
              id: payloadReply2.id,
              username: payloadReply2.username,
              date: payloadReply2.date,
              content: payloadReply2.content,
            },
          ],
        },
        {
          id: payloadComment2.id,
          username: payloadComment2.username,
          date: payloadComment2.date,
          content: payloadComment2.content,
          replies: [
            {
              id: payloadReply1.id,
              username: payloadReply1.username,
              date: payloadReply1.date,
              content: payloadReply1.content,
            },
            {
              id: payloadReply2.id,
              username: payloadReply2.username,
              date: payloadReply2.date,
              content: payloadReply2.content,
            },
          ],
        },
      ],
    };

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(payloadThread));
    mockCommentRepository.getCommentByThreadId = jest.fn(
      () => Promise.resolve([payloadComment1, payloadComment2]),
    );
    mockReplyRepository.getReplyCommentId = jest.fn(
      () => Promise.resolve([payloadReply1, payloadReply2]),
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getThreadDetailUseCase.execute(threadId);

    expect(result.title).toEqual('javascript');
    expect(result).toStrictEqual(expectedResult);
  });
});
