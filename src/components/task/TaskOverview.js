import React, { useState, useMemo } from 'react';
import { Avatar, Tag, Table } from 'antd';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import useStyles from '../../styles/components/task/TaskOverview';

const TaskOverview = ({ task, annotationData, isOptimizationMode }) => {
  const { styles } = useStyles();
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [isAnnotationExpanded, setIsAnnotationExpanded] = useState(true);

  // 合并所有注释数据
  const mergedAnnotationData = useMemo(() => {
    // 确保返回值始终是数组
    if (!task) return Array.isArray(annotationData) ? annotationData : [];
    // 如果task.annotations不存在或为空，使用传入的annotationData
    if (!task.annotations) {
      return Array.isArray(annotationData) ? annotationData : [];
    }
    // 从task.annotations中获取所有类别的注释
    const allAnnotations = [];
    Object.keys(task.annotations).forEach(key => {
      const categoryAnnotations = task.annotations[key];
      if (Array.isArray(categoryAnnotations)) {
        allAnnotations.push(...categoryAnnotations);
      }
    });
    return allAnnotations.length > 0 ? allAnnotations : (Array.isArray(annotationData) ? annotationData : []);
  }, [task, annotationData]);

  // 注释表格列定义
  const annotationColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      render: (text, record, index) => (
        <div className={styles.avatarContainer}>
          <Avatar size={24} className={styles.avatarNumber}>{text || (index + 1)}</Avatar>
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100,
      ellipsis: true,
      render: (text, record) => text || record.summary || '未命名注释',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <div title={text || record.selectedText || record.text}>
          <a href="#" className={styles.attachmentLink}>{text || record.selectedText || record.text || '无内容'}</a>
        </div>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 140,
      ellipsis: true,
      render: (attachments) => (
        <div className={styles.attachmentContainer}>
          {Array.isArray(attachments) && attachments.length > 0 ? 
            attachments.map((file, index) => (
              <Tag key={index} className={styles.attachmentTag}>
                <a href={file.url} className={styles.attachmentLink}>{file.name}</a>
              </Tag>
            )) : 
            <span style={{ color: 'var(--color-text-tertiary)' }}>无附件</span>
          }
        </div>
      ),
    },
    {
      title: '最近修改',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 100,
      render: (modifier, record) => {
        const author = modifier || record.author;
        const name = author ? (typeof author === 'string' ? author : author.name) : '未知';
        
        // 安全处理avatar值
        let avatarValue = '?';
        if (author && typeof author !== 'string') {
          // 检查avatar是否为字符串或null
          if (typeof author.avatar === 'string' || author.avatar === null) {
            avatarValue = author.avatar || name.charAt(0) || '?';
          } else {
            // avatar是对象或其他类型，使用名字首字母
            avatarValue = name.charAt(0) || '?';
          }
        } else {
          // author是字符串或不存在，使用名字首字母
          avatarValue = name.charAt(0) || '?';
        }
        
        return (
          <div className={styles.modifierInfo}>
            <Avatar size={24}>{avatarValue}</Avatar>
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      width: 86,
      align: 'right',
      render: (time, record) => {
        // 如果有modifiedTime对象，使用它
        if (time && time.hour && time.date) {
          return (
            <div className={styles.modifierTime}>
              <div>{time.hour}</div>
              <div>{time.date}</div>
            </div>
          );
        }
        
        // 否则尝试从time或updatedAt字段解析时间
        const timeString = time || record.time || record.updatedAt;
        if (!timeString) return <span style={{ color: 'var(--color-text-tertiary)' }}>未知时间</span>;
        
        try {
          const date = new Date(timeString);
          if (isNaN(date.getTime())) {
            return <span style={{ color: 'var(--color-text-tertiary)' }}>{timeString}</span>;
          }
          
          return (
            <div className={styles.modifierTime}>
              <div>{`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}</div>
              <div>{`${date.getMonth()+1}/${date.getDate()}`}</div>
            </div>
          );
        } catch (e) {
          return <span style={{ color: 'var(--color-text-tertiary)' }}>{timeString}</span>;
        }
      },
    },
  ];

  return (
    <>
      {/* 积分说明区域 */}
      <div className={styles.scoreSection}>
        <div 
          className={styles.scoreHeader}
          onClick={() => setIsScoreExpanded(!isScoreExpanded)}
        >
          <span className={styles.scoreTitle}>积分消耗说明</span>
          {isScoreExpanded ? 
            <CaretDownOutlined className={styles.scoreIcon} /> :
            <CaretRightOutlined className={styles.scoreIcon} />
          }
        </div>
        {isScoreExpanded && (
          <div className={styles.scoreContent}>
            <div>根据此任务的配置，预计每次测试消耗XXX积分*。</div>
            <div className={styles.scoreContentRow}>
              <span>*根据配置参数动态计算，</span>
              <a href="#" className={styles.scoreLink}>了解计算规则&gt;&gt;</a>
            </div>
          </div>
        )}
      </div>

      {/* 任务信息区域 */}
      <div className={styles.taskInfoSection}>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>任务名称</div>
          <div className={styles.infoContent}>{task.name}</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>创建人</div>
          <div className={styles.authorInfo}>
            <Avatar size={24}>{task.created_by ? task.created_by.charAt(0) : '?'}</Avatar>
            <span>{task.created_by || '未知'}</span>
          </div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>描述</div>
          <div className={styles.infoContent}>{task.description}</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>关键词</div>
          <div className={styles.tagContainer}>
            {task.keyword && Array.isArray(task.keyword) ? task.keyword.map((tag, index) => (
              <Tag key={index} className={styles.tag}>{tag}</Tag>
            )) : null}
          </div>
        </div>
      </div>

      {/* 注释表格区域 - 仅在优化模式下显示 */}
      {(isOptimizationMode || mergedAnnotationData.length > 0) && (
        <div className={styles.annotationSection}>
          <div 
            className={styles.annotationHeader}
            onClick={() => setIsAnnotationExpanded(!isAnnotationExpanded)}
          >
            <span className={styles.annotationTitle}>注释</span>
            {isAnnotationExpanded ? 
              <CaretDownOutlined className={styles.annotationIcon} /> :
              <CaretRightOutlined className={styles.annotationIcon} />
            }
          </div>
          
          {isAnnotationExpanded && (
            <Table
              columns={annotationColumns}
              dataSource={mergedAnnotationData}
              pagination={false}
              size="small"
              className={styles.annotationTable}
              locale={{ emptyText: '暂无注释数据' }}
              rowKey={(record, index) => record.id || record.key || `annotation-${index}`}
              rowClassName={() => styles.tableRow}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TaskOverview; 