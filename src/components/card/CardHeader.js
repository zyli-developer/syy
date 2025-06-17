import React from 'react';
import { Breadcrumb, Avatar, Tag, Button } from 'antd';
import { ArrowLeftOutlined, StarOutlined, ShareAltOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

/**
 * 卡片头部样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    taskDetailBreadcrumb: css`
      margin-bottom: 4px;
    `,
    breadcrumbArrow: css`
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: ${token.colorPrimary};
      }
    `,
    breadcrumbParent: css`
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: ${token.colorPrimary};
      }
    `,
    breadcrumbCurrent: css`
      font-size: 12px;
      color: ${token.colorTextDescription};
    `,
    taskDetailTitleSection: css`
      padding: 6px;
      margin-bottom: 4px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
    `,
    taskTitle: css`
      font-size: 18px;
      margin: 0 0 4px 0;
      color: ${token.colorText};
    `,
    taskCreatorSection: css`
      padding: 4px;
      gap: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    `,
    taskCreatorInfo: css`
      gap: 8px;
      display: flex;
      align-items: center;
    `,
    creatorAvatar: css`
      background-color: ${token.colorPrimary};
    `,
    creatorText: css`
      font-size: 12px;
      color: ${token.colorTextSecondary};
    `,
    creatorName: css`
      font-weight: 500;
      color: ${token.colorText};
    `,
    creatorSource: css`
      color: ${token.colorPrimary};
    `,
    taskTags: css`
      gap: 4px;
      display: flex;
      flex-wrap: wrap;
    `,
    taskDimensionTag: css`
      font-size: 10px;
      padding: 0 4px;
      margin: 0;
    `,
    taskActionsTop: css`
      display: flex;
      gap: 8px;
    `,
    followButton: css`
      height: 24px;
      padding: 0 8px;
    `,
    shareButton: css`
      height: 24px;
      padding: 0 8px;
    `,
  };
});

/**
 * 卡片头部组件
 * @param {Object} props - 组件属性
 * @param {Object} props.card - 卡片数据
 * @param {string} props.parentPath - 父级路径
 * @param {string} props.parentLabel - 父级标签
 * @param {Function} props.onGoBack - 返回按钮回调
 * @param {Function} props.onNavigateTo - 导航回调
 * @returns {ReactElement} 卡片头部组件
 */
const CardHeader = ({ 
  card, 
  parentPath, 
  parentLabel, 
  onGoBack,
  onNavigateTo 
}) => {
  const styles = useStyles();
  
  if (!card) return null;
  
  return (
    <>
      <div className={styles.taskDetailBreadcrumb}>
        <Breadcrumb
          items={[
            {
              title: <ArrowLeftOutlined onClick={onGoBack} className={styles.breadcrumbArrow} />,
            },
            {
              title: (
                <span onClick={() => onNavigateTo(parentPath)} className={styles.breadcrumbParent}>
                  {parentLabel}
                </span>
              ),
            },
            {
              title: <span className={styles.breadcrumbCurrent}>父任务</span>,
            },
          ]}
        />
      </div>

      <div className={styles.taskDetailTitleSection}>
        <h1 className={styles.taskTitle}>{card.title}</h1>
        <div className={styles.taskCreatorSection}>
          <div className={styles.taskCreatorInfo}>
            <Avatar size={28} className={styles.creatorAvatar}>
              {card.author?.name?.charAt(0)}
            </Avatar>
            <span className={styles.creatorText}>
              by <span className={styles.creatorName}>{card.author?.name}</span> from{" "}
              <span className={styles.creatorSource}>{card.source}</span>
            </span>
          </div>
          <div className={styles.taskTags}>
            {card.tags?.map((tag, index) => (
              <Tag key={index} className={styles.taskDimensionTag}>
                {tag}
              </Tag>
            ))}
          </div>
          <div className={styles.taskActionsTop}>
            <Button icon={<StarOutlined />} className={styles.followButton} size="small">
              关注
            </Button>
            <Button icon={<ShareAltOutlined />} className={styles.shareButton} size="small">
              分享
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardHeader;