import express from 'express';
import * as searchController from './search.controller';
//access-log
import { accessLog } from '../access-log/access-log.middleware';
const router = express.Router();

/**
 * 搜索标签
 */
router.get(
  '/search/tags',
  accessLog({
    action: 'searchTags',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.tags,
);

/**
 * 搜索用户名
 */
router.get('/search/users', searchController.users);

/**
 * 搜索相机
 */
router.get('/search/cameras', searchController.cameras);

/**
 * 搜索镜头
 */
router.get('/search/lens', searchController.lens);

/**
 * 默认导出
 */
export default router;
