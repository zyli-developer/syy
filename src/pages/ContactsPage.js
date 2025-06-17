"use client"

import { Typography, Card, Space, Tabs } from "antd"
import { TeamOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"

const { Title, Text } = Typography
const { TabPane } = Tabs

const ContactsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleTabChange = (key) => {
    navigate(key)
  }

  return (
    <div>
      <Title level={2}>
        <Space>
          <TeamOutlined />
          联系人
        </Space>
      </Title>
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="/contacts"
          activeKey={location.pathname === "/contacts" ? "/contacts" : location.pathname}
          onChange={handleTabChange}
        >
          <TabPane tab="所有联系人" key="/contacts">
            <Text>所有联系人页面内容</Text>
          </TabPane>
          <TabPane tab="Jackson" key="/contacts/jackson">
            <Text>Jackson联系人页面内容</Text>
          </TabPane>
          <TabPane tab="财务部" key="/contacts/finance">
            <Text>财务部联系人页面内容</Text>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default ContactsPage
