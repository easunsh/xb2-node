import express from 'express';
import { accessControl, authCuard } from '../auth/auth.middleware';
import * as commentController from './comment.controller';
import { filter } from './comment.middleware';

//分页数据配置文件
import { paginate } from '../post/post.middleware';
import { COMMENTS_PER_PAGE } from '../app/app.config';

//access-log
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 发表评论
 */
router.post(
  '/comments',
  authCuard,
  accessLog({
    action: 'createComment',
    resourceType: 'comment',
    payloadParam: 'body.content',
  }),
  commentController.store,
);

/**
 * 回复评论
 * 例子 {{ _.xb2_api }}/comments/3/reply   ** 3为要去回复的评论的id
 * reply 是自己取得名字，
 *
 */

router.post(
  '/comments/:commentId/reply',
  authCuard,
  accessLog({
    action: 'replyComment',
    resourceType: 'comment',
    resourceParamName: 'commentId',
    payloadParam: 'body.content',
  }),
  commentController.reply,
);

/**
 * 修改评论
 */
router.patch(
  '/comments/:commentId',
  authCuard,
  accessControl({ possession: true }),
  accessLog({
    action: 'updateComment',
    resourceType: 'comment',
    resourceParamName: 'commentId',
    payloadParam: 'body.content',
  }),
  commentController.update,
);

/**
 * 删除评论
 */
router.delete(
  '/comments/:commentId',
  authCuard,
  accessControl({ possession: true }),
  accessLog({
    action: 'deleteComment',
    resourceType: 'comment',
    resourceParamName: 'commentId',
  }),
  commentController.destory,
);

/**
 * 获取评论列表
 */
router.get(
  '/comments',
  filter,
  paginate(COMMENTS_PER_PAGE),
  commentController.index,
);

/**
 * 回复列表
 */

router.get('/comments/:commentId/replies', commentController.indexReplies);

/**
 * 导出
 */
export default router;
