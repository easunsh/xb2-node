//引入所需要的类型
import { Request, Response, NextFunction } from 'express';
import { allowAccessCounts } from './dashboard.provider';

/**
 * 访问次数过滤器
 */
export const accessCountsFilter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据 默认 1-day
  const { dateTimeRange = '1-day' } = request.query;

  const filter = {
    name: 'dateTimeRange',
    sql: null,
    param: null,
  };

  switch (dateTimeRange) {
    case '1-day':
      filter.sql = 'access_log.created > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
    case '7-day':
      filter.sql = 'access_log.created > now() - INTERVAL 7 DAY';
      filter.param = '%Y%m%d';
      break;
    case '1-month':
      filter.sql = 'access_log.created > now() - INTERVAL 1 MONTH';
      filter.param = '%Y%m%d';
      break;
    case '3-month':
      filter.sql = 'access_log.created > now() - INTERVAL 3 MONTH';
      filter.param = '%Y%m';
      break;
    default:
      filter.sql = 'access_log.created > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
  }

  request.filter = filter;

  //下一步
  next();
};

/**
 * 访问次数守卫
 */
export const accessCountsGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    params: { action },
  } = request;

  const allowAccessCountsActions = allowAccessCounts.map(
    accessCount => accessCount.action,
  );

  const isAllowAction = allowAccessCountsActions.includes(action);

  if (!isAllowAction) {
    next(new Error('BAD_REQUEST'));
  }

  next();
};
