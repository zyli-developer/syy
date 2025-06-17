import React, { useState } from 'react';
import { Form, Input, Button, Upload, Space, Typography, Alert, Card } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useStyles from '../../styles/components/task/ResultSubmission';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ResultSubmission = ({ 
  onSubmit,
  isSubmitting,
  task 
}) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    formData.append('notes', values.notes);
    formData.append('version', values.version);
    
    await onSubmit(formData);
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" size={24} className={styles.formContainer}>
        <Alert
          message="提交结果说明"
          description={
            <ul className={styles.listStyle}>
              <li>请确保上传的文件格式符合要求</li>
              <li>建议添加详细的说明备注，方便后续查看</li>
              <li>提交后将自动进行结果验证</li>
            </ul>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="version"
              label="版本号"
              rules={[{ required: true, message: '请输入版本号' }]}
            >
              <Input placeholder="例如：v1.0.0" />
            </Form.Item>

            <Form.Item
              name="files"
              label="结果文件"
              rules={[{ required: true, message: '请上传结果文件' }]}
            >
              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="notes"
              label="提交说明"
              rules={[{ required: true, message: '请输入提交说明' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入本次提交的相关说明，如改进内容、解决的问题等"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSubmitting}
                block
              >
                提交结果
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Alert
          message="提交后流程"
          description={
            <ol className={styles.listStyle}>
              <li>系统将自动验证提交的结果文件</li>
              <li>验证通过后将更新任务状态</li>
              <li>您可以在历史记录中查看所有提交</li>
            </ol>
          }
          type="warning"
          showIcon
        />
      </Space>
    </div>
  );
};

export default ResultSubmission; 