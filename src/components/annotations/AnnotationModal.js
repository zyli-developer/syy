import React, { useState, useEffect } from 'react';
import { Modal, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import taskService from '../../services/taskService';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;

const AnnotationModal = ({ visible, onClose, onSave, selectedText, initialContent = '', step = '', nodeId = null }) => {

  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);

  
  // visible变为true时(即Modal打开时)，使用initialContent更新content
  useEffect(() => {
    if (visible) {
      // 确保每次打开模态框时都使用最新的initialContent
      setContent(initialContent || '');
  
    }
  }, [visible, initialContent]);
  
  // 当Modal关闭时重置表单
  useEffect(() => {
    if (!visible) {
      // 仅当Modal关闭时重置表单，不在open时重置
      return;
    }
  }, [visible]);

  const handleSave = () => {
    if (!content.trim()) {
      message.error('请输入观点内容');
      return;
    }

    // 创建注释数据对象
    const annotationData = {
      id: `comment-${uuidv4().substring(0, 8)}`, // 使用更可靠的唯一ID
      author: '当前用户',
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      text: content, // 使用text字段以兼容CommentsList组件
      summary: summary || (content.length > 20 ? content.substring(0, 20) + '...' : content),
      attachments: fileList.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      })),
      selectedText,
      nodeId, // 保存节点ID，如果有的话
      step: step === 'scenario' ? 'scenario' : step === 'flow' ? 'flow' : step,
    };

    // 将注释保存到当前task中
    try {
      // 直接调用onSave回调函数，将数据传递给父组件
      // 使用注释中的step字段或传入的step参数指定保存位置
      console.log('annotationData', annotationData);
      onSave(annotationData, annotationData.step || step);
    } catch (error) {
      console.error('保存观点失败:', error);
      message.error('保存观点失败');
    }
    
    // 不在这里重置表单，以避免关闭Modal时再次触发重置
    // 在onCancel或visible变为false时再重置
  };

  const handleCancel = () => {
    // 关闭Modal时重置表单
    setSummary('');
    setContent('');
    setFileList([]);
    // 调用onClose
    onClose();
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="添加观点"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSave}
      okText="保存"
      cancelText="取消"
      width={520}
      destroyOnClose={true}
      afterClose={() => {
        // Modal完全关闭后执行的回调，确保表单重置
        setSummary('');
        setContent('');
        setFileList([]);
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#666' }}>摘要：</div>
        <Input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="请输入摘要..."
        />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#666' }}>当前步骤：
          {step === 'qa' ? 'QA' : 
           step === 'scenario' ? '场景' : 
           step === 'flow' ? '模板' : 
           step === 'result' ? '结果' : 
           step || '未指定'}
        </div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#666' }}>选中文本：</div>
        <div style={{ 
          padding: 8,
          background: '#fff',
          borderRadius: 4,
          fontSize: 14,
          maxHeight: '150px',
          minHeight: '60px',
          lineHeight: '1.5em',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          border: '1px solid #e8e8e8'
        }}>{selectedText}</div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>观点内容：</div>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入您的观点..."
          rows={4}
        />
      </div>

      <div>
        <div style={{ marginBottom: 8 }}>上传附件：</div>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default AnnotationModal; 