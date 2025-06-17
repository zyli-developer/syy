import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

const topicOptions = [
  { label: '场景A', value: 'A' },
  { label: '场景B', value: 'B' },
  { label: '场景C', value: 'C' },
];
const visibleOptions = [
  { label: '全部可见', value: 'all' },
  { label: '我的粉丝可见', value: 'fans' },
  { label: '互相关注可见', value: 'mutual' },
  { label: '仅自己可见', value: 'self' },
];

const CreateTemplateModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit && onSubmit({ ...values });
      form.resetFields();
    } catch (e) {
      message.error('请完善所有必填项');
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: () => false, // 阻止自动上传
    showUploadList: true,
  };

  return (
    <Modal
      title="新建模板"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>,
        <Button key="ok" type="primary" onClick={handleOk}>确定</Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="多媒体" name="media">
          <Dragger {...uploadProps} style={{ minHeight: 80, maxHeight: 120, minWidth: 120, maxWidth: 300 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text text-xs">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint text-xs">支持图片、视频、文档等多种格式</p>
          </Dragger>
        </Form.Item>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}> 
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文' }]}> 
          <textarea rows={4} placeholder="请输入正文" style={{ width: '100%', resize: 'vertical', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9', fontSize: 14 }} />
        </Form.Item>
        <Form.Item label="话题" name="topic" rules={[{ required: true, message: '请选择话题' }]}> 
          <Select placeholder="请选择话题">
            {topicOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="可见范围" name="visible" rules={[{ required: true, message: '请选择可见范围' }]}> 
          <Select placeholder="请选择可见范围">
            {visibleOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTemplateModal; 