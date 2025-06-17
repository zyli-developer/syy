import { Typography, Card } from "antd"
import { AppstoreOutlined } from "@ant-design/icons"

const { Title } = Typography

const ScenesPage = () => {
  return (
    <div className="scenes-page">
      <div className="scenes-page-header">
        <Title level={2} className="scenes-page-title">
          <AppstoreOutlined /> 场景
        </Title>
      </div>

      <Card>
        <div style={{ padding: "40px 0", textAlign: "center" }}>场景页面内容正在开发中</div>
      </Card>
    </div>
  )
}

export default ScenesPage
