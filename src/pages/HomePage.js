import { Typography, Card, Row, Col, Button, List, Space } from "antd"
import { HomeOutlined, FileAddOutlined, UserAddOutlined, CheckCircleOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const HomePage = () => {
  const recentActivities = [
    { id: 1, text: "创建了新任务", icon: <FileAddOutlined /> },
    { id: 2, text: "添加了新联系人", icon: <UserAddOutlined /> },
    { id: 3, text: "更新了资产信息", icon: <CheckCircleOutlined /> },
  ]

  return (
    <div>
      <Title level={2}>
        <Space>
          <HomeOutlined />
          主页
        </Space>
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="欢迎使用" bordered={false}>
            <Text>这是可信AI公共服务平台的主页。您可以在这里查看和管理您的任务、联系人和资产。</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="最近活动" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    {item.icon}
                    <Text>{item.text}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="快速操作" bordered={false}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" block icon={<FileAddOutlined />}>
                创建任务
              </Button>
              <Button block icon={<UserAddOutlined />}>
                添加联系人
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HomePage
