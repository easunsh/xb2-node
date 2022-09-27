export interface AccessCountListItem {
  action: string;
  title?: string;
  value?: number;
}

/**
 * 数组每一个项目都是个AccessCountListItem对象
 * 记录每一个接口的使用情况
 * 生成访问的数据
 */
export const allowAccessCounts: Array<AccessCountListItem> = [
  {
    action: 'getPosts',
    title: '内容列表访问',
  },
  {
    action: 'getPostById',
    title: '单个内容访问',
  },
  {
    action: 'createPost',
    title: '新增内容',
  },
  {
    action: 'createComment',
    title: '新增评论',
  },
  {
    action: 'createUser',
    title: '新增用户',
  },
  {
    action: 'createUserLikePost',
    title: '内容点赞',
  },
  {
    action: 'searchTags',
    title: '搜索标签',
  },
  {
    action: 'searchCameras',
    title: '搜索相机',
  },
  {
    action: 'searchLens',
    title: '搜索镜头',
  },
  {
    action: 'searchUsers',
    title: '搜索用户',
  },
];
