import { PostStatus } from './post.service';

export class PostModel {
  //问号表示属性是可选的
  id?: number;
  title?: string;
  content?: string;
  userId?: number;
  status?: PostStatus;
}
