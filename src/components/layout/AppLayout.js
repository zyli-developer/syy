"use client"
import { Layout } from "antd"
import { MessageOutlined } from "@ant-design/icons"
import AppSidebar from "../sidebar/AppSidebar"
import ChatArea from "../sidebar-chat/ChatArea"
import { useChatContext } from "../../contexts/ChatContext"
import { useState, useEffect } from "react"
import ContentNav from "./ContentNav"
import { useLocation } from 'react-router-dom'
import SearchBar from "../layout/SearchBar"

const { Content } = Layout

const AppLayout = ({ children }) => {
  const { isChatOpen, toggleChat } = useChatContext()
  // 固定使用large尺寸，不再根据屏幕宽度动态调整
  const [screenSize] = useState("large")
  const location = useLocation()
  
  // 判断是否为详情页面
  const isDetailPage = location.pathname.includes('/detail/')
  const hideHeader = location.pathname === '/personal-info'

  // 不再需要监听窗口大小变化
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth
  //     if (width >= 1440) {
  //       setScreenSize("large") // 1440px及以上使用大屏UI
  //     } else if (width >= 1024) {
  //       setScreenSize("medium") // 1024px-1439px使用中屏UI
  //     } else if (width >= 768) {
  //       setScreenSize("small") // 768px-1023px使用小屏UI
  //     } else {
  //       setScreenSize("small") // 小于768px也使用小屏UI
  //     }
  //   }

  //   // 初始化
  //   handleResize()

  //   // 添加监听
  //   window.addEventListener("resize", handleResize)

  //   // 清理监听
  //   return () => window.removeEventListener("resize", handleResize)
  // }, [])

  return (
    <div className="app-container">
      <Layout className={`app-layout screen-${screenSize}`}>
        {/* 左侧边栏 */}
        <AppSidebar />

        {/* 右侧内容区 */}
        <Layout className="main-content-layout">
          {/* 内容和聊天区域的水平布局 */}
          <div className="content-with-chat-layout">
            {/* 内容区域 */}
            <div
              className={`content-layout ${isChatOpen ? "chat-open" : "chat-closed"}`}
              style={{ width: isChatOpen ? "calc(100% - 380px)" : "100%" }}
            >
              {/* 顶部搜索框 */}
              {!isDetailPage && !hideHeader && <SearchBar className="search-bar" />}

              {/* 顶部导航栏 */}

              {/* 内容导航 */}
              {!isDetailPage && !hideHeader && <ContentNav />}

              {/* 主内容区域 */}
              <Content className="main-content">{children}</Content>
            </div>

            {/* 聊天区域 */}
            {isChatOpen && (
              <div className="chat-area-container">
                <ChatArea />
              </div>
            )}
          </div>
        </Layout>

        {/* 聊天浮动按钮 */}
        {!isChatOpen && (
          <button onClick={toggleChat} className="chat-floating-button">
            {/* <MessageOutlined /> */}
          </button>
        )}
      </Layout>
    </div>
  )
}

export default AppLayout
