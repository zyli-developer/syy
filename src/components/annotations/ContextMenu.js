import React from 'react';
import { Button } from 'antd';
import { MessageOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ContextMenu = ({ x, y, onAction, showEditDelete = false }) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        padding: '4px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <Button
        type="text"
        icon={<MessageOutlined />}
        onClick={() => onAction('discuss')}
        style={{ textAlign: 'left' }}
      >
        讨论
      </Button>
      <Button
        type="text"
        icon={<PlusCircleOutlined />}
        onClick={() => onAction('addAnnotation')}
        style={{ textAlign: 'left' }}
      >
        添加观点
      </Button>
      {showEditDelete && (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onAction('edit')}
            style={{ textAlign: 'left' }}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onAction('delete')}
            style={{ textAlign: 'left', color: 'var(--color-error)' }}
          >
            删除
          </Button>
        </>
      )}
    </div>
  );
};

export default ContextMenu; 