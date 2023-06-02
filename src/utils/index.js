/* eslint-disable camelcase */
const mapDBToCreatedThread = ({
  id,
  title,
  owner,
}) => ({
  id,
  title,
  owner,
});

const mapDBGetThreadById = ({
  id,
  title,
  created_at,
  body,
  owner,
  username,
}) => ({
  id,
  title,
  body,
  owner,
  username,
  date: created_at,
});

const mapDBToGetCommentByThreadId = ({
  id,
  owner,
  thread_id,
  is_delete,
  created_at,
  content,
  username,
}) => ({
  id,
  owner,
  threadId: thread_id,
  isDelete: is_delete,
  date: created_at,
  content,
  username,
});

const mapDBToGetReplyCommentId = ({
  id,
  content,
  is_delete,
  created_at,
  username,
}) => ({
  id,
  content,
  isDelete: is_delete,
  date: created_at,
  username,
});

const mapReplies = (item) => {
  const content = item.isDelete ? '**balasan telah dihapus**' : item.content;

  return {
    id: item.id,
    content,
    date: item.date,
    username: item.username,
  };
};

module.exports = {
  mapDBToCreatedThread,
  mapDBGetThreadById,
  mapDBToGetCommentByThreadId,
  mapDBToGetReplyCommentId,
  mapReplies,
};
