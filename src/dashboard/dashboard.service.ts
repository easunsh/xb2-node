import { connection } from '../app/database/mysql'; //数据库连接
import { AccessCountListItem, allowAccessCounts } from './dashboard.provider';

/**
 * 访问次数列表
 */
interface GetAccessCountsOptions {
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
}

export const getAccessCounts = async (options: GetAccessCountsOptions) => {
  //解构选项
  const {
    //把sql从filter中解构出来重命名为whereDateTimeRange
    filter: { sql: whereDateTimeRange },
  } = options;

  /**
   * 允许的动作来自 src\dashboard\dashboard.provider.ts
   * map()：创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
   * 新数组是原数组的一个映射，不会改变原数组的结构
   * allowedActions输出为 getPosts,createPost,等等
   * accessCounta为新元素,是return => 函数处理后的值
   * join方法用于把数组中的所有元素放入一个字符串，元素是通过指定的分隔符进行分隔的。默认逗号
   */
  const allowedActions = allowAccessCounts
    .map(accessCounta => accessCounta.action)
    .map(action => `'${action}'`)
    .join();

  //console.log(typeof allowedActions);

  //允许的动作条件
  const andWhereActionIn = `AND action IN (${allowedActions})`;

  //准备查询
  const statement = `
  SELECT
    access_log.action,
    COUNT(access_log.id) AS value
FROM
    access_log
WHERE
    ${whereDateTimeRange} ${andWhereActionIn}
GROUP BY
  access_log.action
   `;
  //执行
  const [data] = await connection.promise().query(statement);

  //提供数据
  const results = data as Array<AccessCountListItem>;
  //提供结果
  /**
   * find方法特性： 会返回数组中符合条件的第一个值，在数组中找到的话则不会往下执行。
   * 如果数组中没有符合条件的值则返回undefined
   *在find方法执行之后，给数组新增值是访问不到的。
   *在callback还未访问到某个值是如果改变某一个值那么当callback访问到他时，将是新的值。
   *如果在find方法执行后删除某个值还是会访问到他。
   *以下在循环执行数组中每一个元素的比对过程。
   *重新组织一个返回的对象
   */
  return allowAccessCounts.map(accessCount => {
    const result = results.find(result => result.action === accessCount.action);
    accessCount.value = result && result.value ? result.value : 0;
    return accessCount;
  });
};

/**
 * 按动作分时段访问次数
 */
//数组类型
interface GetAccessCountByActionResult {
  action: string;
  datetime: string;
  value: number;
}
//最后返回的
interface AccessCount {
  title: string;
  action: string;
  dataset: [Array<string>, Array<number>];
}

//dateTimeRange 的sql条件
interface GetAccessCountByActionOptions {
  action: string;
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
}

export const getAccessCountByAction = async (
  options: GetAccessCountByActionOptions,
) => {
  //解构选项
  const {
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    action,
  } = options;

  //查询条件
  const andWhereAction = 'AND action = ?';

  //sql 参数
  const params = [action];

  //准备查询
  const statement = `
    SELECT
      access_log.action,
      DATE_FORMAT(access_log.created,'${dateTimeFormat}') AS datetime,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereAction}
    GROUP BY
      access_log.action,
      DATE_FORMAT(access_log.created,'${dateTimeFormat}')
    ORDER BY
    DATE_FORMAT(access_log.created,'${dateTimeFormat}')

   `;
  //执行
  const [data] = await connection.promise().query(statement, params);
  console.log(data);
  //数组项目是GetAccessCountByActionResult
  const results = data as Array<GetAccessCountByActionResult>;
  console.log(results);

  /**
   * 重新组织一个数据集合
   * reduce() 方法
   * accumulator 为计算结束后的返回值或初始值，必须
   * result 当前元素，必须
   *[[], []] 传递给函数的初始值accumulator
   *新数组是原数组的一个映射，不会改变原数组的结构
   */

  const dataset = results.reduce(
    (accumulator, result) => {
      const [datetimeArray, valueArray] = accumulator;
      datetimeArray.push(result.datetime);
      valueArray.push(result.value);
      return accumulator;
    },
    [[], []],
  );

  //标题动作
  const title = allowAccessCounts.find(
    accessCount => accessCount.action === action,
  ).title;

  //提供结果
  return {
    title,
    action,
    dataset,
  } as AccessCount;
};
