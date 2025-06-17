import React from 'react';
import { List, Avatar, Tag, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import useStyles from '../../styles/components/qa/QAList';

const { Title } = Typography;

const QAList = ({ data = [] }) => {
  const { styles } = useStyles();
  
  return (
    <div className={styles.container}>
      <Title level={4} className={styles.title}>问答列表</Title>
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={item => (
          <List.Item
            className={styles.listItem}
            actions={[
              <Button type="link" icon={<RightOutlined />}>查看详情</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.author.avatar}>{item.author.name[0]}</Avatar>}
              title={
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <Tag color={item.status === 'resolved' ? 'success' : 'processing'}>
                    {item.status === 'resolved' ? '已解决' : '进行中'}
                  </Tag>
                </div>
              }
              description={
                <div className={styles.itemDescription}>
                  <span>{item.author.name} · {item.author.department}</span>
                  <span>{item.createTime}</span>
                </div>
              }
            />
            <div className={styles.itemContent}>
              {item.content}
            </div>
            <div className={styles.tagContainer}>
              {item.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default QAList; 