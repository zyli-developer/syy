import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ConfigProvider } from "antd"
import zhCN from "antd/lib/locale/zh_CN"

// 引入主题设置函数
import applyColorTheme from "./styles/dynamic-theme"
import colorToken from "./styles/utils/colorToken";

// 先引入全局样式和主题变量
import "./styles/globals.css"  // 确保全局CSS变量先加载
import "./index.css"

// 再引入组件样式

import "./components/card/task-card.css" // 导入任务卡片样式
import "./components/card/task-detail.css" // 导入任务详情页样式
import "./components/card/card-detail.css" // 导入卡片详情页样式
import "./components/evaluation/evaluation.css" // 导入评估页面样式
import "./components/sidebar/user-info-styles.css" // 导入用户信息区域样式
import "./components/sidebar-chat/sidebar-chat.css" // 导入聊天区域样式
import "./styles/overrides/antd-components.css" // 导入Ant Design组件样式覆盖

// 启用MSW进行API模拟
import { worker } from "./mocks/browser"

// 应用动态主题色 - 在引入样式之后调用
applyColorTheme();

// if (process.env.NODE_ENV === "development") {
//   worker.start()
// }

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          ...colorToken,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
