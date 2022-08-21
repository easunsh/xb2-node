//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
import { parse } from 'path';
import { socketIoServer } from '../app/app.server';
import {
  createComment,
  isReplyComment,
  updateComment,
  deleteComment,
  getComments,
  getCommentsTotalCount,
  getCommentsReplies,
  getCommentById,
} from './comment.service';

/**
 * 发表评论
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  //当前登录中的用户,先使用authCuard 后面request能得到user
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const socketId = request.header('X-Socket-Id');

  //简化写法
  const comment = {
    content,
    postId,
    userId,
  };

  try {
    //保存数据
    const data = await createComment(comment);

    //调取新创建的评论
    const createdComment = await getCommentById(data.insertId);

    //触发事件
    socketIoServer.emit('commentCreated', {
      comment: createdComment,
      socketId,
    });

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论功能
 * 目前就是一级评论，不允许多次回复，数据库 parentId 有值，就无法再回复
 */
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据 commentId的值，就是要去回复的那条评论的id
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = {
    content,
    postId,
    userId,
    parentId,
  };

  try {
    //检查评论是否为回复评论
    const reply = await isReplyComment(parentId);

    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    return next(error);
  }

  try {
    //回复评论
    const data = await createComment(comment);

    //回复数据
    const reply = await getCommentById(data.insertId, {
      resourceType: 'reply',
    });

    //触发事件
    socketIoServer.emit('commentReplyCreated', {
      reply,
      socketId,
    });

    //做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { commentId } = request.params;
  const { content } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  try {
    //修改评论
    const data = await updateComment(comment);

    //准备资源
    const isReply = await isReplyComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), {
      resourceType,
    });

    //触发事件
    const eventName = isReply ? 'commentReplyUpdated' : 'commentUpdated';

    socketIoServer.emit(eventName, {
      [resourceType]: resource,
      socketId,
    });
    //响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destory = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const socketId = request.header('X-Socket-Id');

  try {
    //准备资源
    const isReply = await isReplyComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), {
      resourceType,
    });

    //删除评论
    const data = await deleteComment(parseInt(commentId, 10));

    //触发事件
    const eventName = isReply ? 'commentReplyDeleted' : 'commentDeleted';

    socketIoServer.emit(eventName, {
      [resourceType]: resource,
      socketId,
    });

    //做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取评论列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //统计评论数量
  try {
    const totalCount = await getCommentsTotalCount({ filter: request.filter });

    //设置头部数据给客户端
    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const comments = await getComments({
      filter: request.filter,
      pagination: request.pagination,
    });

    //做出响应
    response.send(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复列表接口
 */
export const indexReplies = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { commentId } = request.params;

  //获取评论回复列表
  try {
    const replies = await getCommentsReplies({
      commentId: parseInt(commentId, 10),
    });

    //响应
    response.send(replies);
  } catch (error) {
    next(error);
  }
};
