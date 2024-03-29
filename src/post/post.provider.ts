/**
 * 查询片段
 * totleComments 评论总数
 */
export const sqlFragment = {
  user: `
  JSON_OBJECT(
      'id',user.id,
      'name',user.name,
      'avatar', IF(COUNT(avatar.id),1,null),
      'subscription', (
        SELECT
          JSON_OBJECT(
            'type',subscription.type,
            'status',IF( now() < subscription.expired, 'valid' , 'expired')
          )
        FROM
            subscription
        WHERE 
            user.id = subscription.userId
            AND subscription.status = 'valid'
            LIMIT 1
      )
  ) as user
  `,

  leftJoinUser: `
    LEFT JOIN user
        ON user.id = post.userID
    LEFT JOIN avatar
        ON user.id = avatar.userId
    `,

  totalComments: `
    (
        SELECT
        COUNT(comment.id)
        FROM 
        comment
        WHERE
        comment.postId = post.id
    ) as totalComments
    `,

  leftJoinOneFile: `
        LEFT JOIN LATERAL (
            SELECT *
            FROM file
            WHERE file.postId = post.id
            ORDER BY file.id DESC
            LIMIT 1
        ) AS file 
        ON post.id = file.postId
    `,
  innerJoinFile: `
        INNER JOIN file
        ON file.postId = post.id
    `,
  leftJoinFile: `
    LEFT JOIN file
    ON file.postId = post.id
`,
  innerJoinOneFile: `
    INNER JOIN LATERAL (
        SELECT *
        FROM file
        WHERE file.postId = post.id
        ORDER BY file.id DESC
        LIMIT 1
    ) AS file 
    ON post.id = file.postId
`,
  leftJoinAuditLog: `
  LEFT JOIN LATERAL (
    SELECT *
    FROM audit_log
    WHERE audit_log.resourceId = post.id
    ORDER BY audit_log.id DESC
    LIMIT 1
) AS auditLog 
  ON auditLog.resourceId = post.id
`,

  file: `
          CAST(
            IF(
                COUNT(file.id),
                GROUP_CONCAT (
                    DISTINCT JSON_OBJECT(
                        'id',file.id,
                        'width' , file.width,
                        'height' , file.height
                    )
                ),
                NULL
            )  AS JSON
          )  AS file
    `,

  fileInfo: `
  CAST(
    IF(
      COUNT(file.id),
      CONCAT(
        '[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'id',file.id,   
                'upName',file.originalname,
                'fileType',file.mimetype
                )
            ),
        ']'
      ),
        NULL
    ) AS JSON
  ) as fileInfo
`,

  auditLog: `
  CAST(
    IF(
      COUNT(auditLog.id),
      CONCAT(
        '[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'id',auditLog.id,   
                'userName',auditLog.userName,
                'resType',auditLog.resourceType,
                'status',auditLog.status
                )
            ),
        ']'
      ),
        NULL
    ) AS JSON
  ) as auditLog
`,

  leftJoinTag: `
           LEFT JOIN
              post_tag ON post_tag.postId = post.id
            LEFT JOIN
              tag ON post_tag.tagId = tag.id 
    `,

  tags: `
        CAST(

            IF(
                COUNT(tag.id),
                CONCAT(
                    '[',
                        GROUP_CONCAT(
                                DISTINCT JSON_OBJECT(
                                    'id',tag.id,
                                    'name',tag.name
                                )
                        ),
                    ']'
                ),
                NULL
            ) AS JSON
        ) AS tags
    `,

  totalLikes: `
        (
            SELECT COUNT(user_like_post.postId)
            FROM user_like_post
            WHERE user_like_post.postId = post.id
        ) AS totalLikes          
    `,

  innerJoinUserLikePost: `
        INNER JOIN user_like_post
         ON user_like_post.postId = post.id
    `,
};
