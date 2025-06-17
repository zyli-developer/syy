"use client"

import { useState, useEffect } from "react"
import { Avatar, Button, Popover, Switch, Divider, Tag } from "antd"
import {
  CreditCardOutlined,
  UserOutlined,
  GiftOutlined,
  MoonOutlined,
  SettingOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
  RightOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import userService from "../../services/userService"
import workspaceService from "../../services/workspaceService"
import authService from "../../services/authService"
import DiamondIcon from "../icons/DiamondIcon"
import CommandIcon from "../icons/CommandIcon"
import ShiftIcon from "../icons/ShiftIcon"
import VectorIcon from "../icons/VectorIcon"

const UserInfoArea = ({ isCollapsed }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userPopoverVisible, setUserPopoverVisible] = useState(false)
  const [workspacePopoverVisible, setWorkspacePopoverVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [workspaces, setWorkspaces] = useState([])
  const [workspacesLoading, setWorkspacesLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true)
        // 直接从 localStorage 获取
        const userStr = localStorage.getItem('syntrust_user')
        const userData = userStr ? JSON.parse(userStr) : null
        setUser(userData)
      } catch (error) {
        console.error("获取用户信息失败:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCurrentUser()

    // Add keyboard shortcut listener for logout
    const handleKeyDown = (event) => {
      // Check for Cmd+Shift+Q (Mac) or Ctrl+Shift+Q (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === "q") {
        handleLogout()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setWorkspacesLoading(true)
        const workspacesData = await workspaceService.getWorkspaces()
        setWorkspaces(workspacesData)
      } catch (error) {
        console.error("获取工作区列表失败:", error)
      } finally {
        setWorkspacesLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  const handleLogout = () => {
    console.log("Logging out...")
    authService.logout()
  }

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked)
    // Implement dark mode toggle functionality
  }

  const handleWorkspaceChange = async (workspaceId) => {
    try {
      // 本地切换：找到目标workspace对象
      const target = workspaces.find(ws => ws.id === workspaceId)
      if (target) {
        const userStr = localStorage.getItem('syntrust_user')
        if (userStr) {
          const userObj = JSON.parse(userStr)
          userObj.workspace = target
          localStorage.setItem('syntrust_user', JSON.stringify(userObj))
        }
      }
      window.location.reload()
    } catch (error) {
      console.error(`切换工作区失败 (ID: ${workspaceId}):`, error)
    }
    setWorkspacePopoverVisible(false)
  }

  // 获取当前激活的workspaceId
  const getActiveWorkspaceId = () => {
    try {
      const userStr = localStorage.getItem('syntrust_user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        return userObj.workspace?.id;
      }
    } catch {}
    return null;
  };
  const activeWorkspaceId = getActiveWorkspaceId();

  // User profile popover content
  const userPopoverContent = (
    <div className="p-4 w-64">
      {/* User header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Avatar size={48} className="mr-3 bg-yellow-400">
            {user && user.name ? user.name.charAt(0) : "U"}
          </Avatar>
          <div>
            <div className="font-medium">{user ? user.name : "未知用户"}</div>
            <div className="text-xs text-gray-500">{user ? user.email : ""}</div>
          </div>
        </div>
        <div>
          <Avatar size={24} className="bg-gray-100 text-black">
            <DiamondIcon style={{ fontSize: "14px" }} />
          </Avatar>
        </div>
      </div>

      <Divider className="my-3" />

      {/* Menu items */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CreditCardOutlined className="mr-3 text-gray-600" />
            <span>个人版本</span>
          </div>
          <Button size="small" type="primary">
            立即升级
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <UserOutlined className="mr-3 text-gray-600" />
            <span style={{ cursor: 'pointer' }} onClick={() => { window.location.href = '/personal-info'; }}>个人信息</span>
          </div>
          <Tag color="success" className="m-0">
            完善信息得奖励
          </Tag>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <GiftOutlined className="mr-3 text-gray-600" />
            <span>获取免费token</span>
            <Tag color="error" className="ml-2 m-0">
              HOT
            </Tag>
          </div>
          <RightOutlined className="text-gray-400" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MoonOutlined className="mr-3 text-gray-600" />
            <span>深色模式</span>
          </div>
          <Switch size="small" checked={darkMode} onChange={handleDarkModeToggle} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <SettingOutlined className="mr-3 text-gray-600" />
            <span>设置</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileTextOutlined className="mr-3 text-gray-600" />
            <span>帮助文档</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CustomerServiceOutlined className="mr-3 text-gray-600" />
            <span>客服中心</span>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      {/* Logout */}
      <div className="flex justify-between items-center cursor-pointer" onClick={handleLogout}>
        <div className="flex items-center">
          <LogoutOutlined className="mr-3 text-gray-600" />
          <span>退出登录</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <CommandIcon className="mr-0.5" />
          <ShiftIcon className="mr-0.5" />
          <span>Q</span>
        </div>
      </div>
    </div>
  )

  // Workspace popover content
  const workspacePopoverContent = (
    <div className="p-4 w-64">
      <div className="font-medium mb-3">切换工作区</div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {workspacesLoading ? (
          <div className="py-4 text-center">加载中...</div>
        ) : workspaces.length === 0 ? (
          <div className="py-4 text-center">暂无工作区</div>
        ) : (
          workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${
                activeWorkspaceId === workspace.id ? "bg-gray-50" : ""
              }`}
              onClick={() => handleWorkspaceChange(workspace.id)}
            >
              <div className="flex items-center">
                <Avatar size={32} className="mr-3 bg-blue-100">
                  {workspace.icon || (workspace.name ? workspace.name.charAt(0) : "W")}
                </Avatar>
                <div>
                  <div className="font-medium">{workspace.name || "未命名工作区"}</div>
                  <div className="text-xs text-gray-500">{workspace.role || "成员"}</div>
                </div>
              </div>
              {activeWorkspaceId === workspace.id && <CheckOutlined className="text-blue-500" />}
            </div>
          ))
        )}
      </div>
      <div className="mt-3">
        <Button type="dashed" block icon={<span>+</span>}>
          创建新工作区
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 border-t border-gray-200 ${isCollapsed ? "h-16" : "h-16"}`}>
        <div>加载中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`flex items-center justify-center p-4 border-t border-gray-200 ${isCollapsed ? "h-16" : "h-16"}`}>
        <div>未登录</div>
      </div>
    )
  }

  return (
    <div className={`border-t border-gray-200 p-2 ${isCollapsed ? "flex justify-center" : ""}`}>
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <Popover
          content={userPopoverContent}
          trigger="click"
          open={userPopoverVisible}
          onOpenChange={setUserPopoverVisible}
          placement="topRight"
          overlayClassName="user-profile-popover"
          getPopupContainer={() => document.body}
          autoAdjustOverflow={true}
        >
          <div
            className={`flex items-center cursor-pointer ${isCollapsed ? "" : "w-full"}`}
            onClick={() => setUserPopoverVisible(true)}
          >
            <div className="relative">
              <Avatar className="bg-yellow-400 text-white" size={isCollapsed ? 36 : 32}>
                {user && user.name ? user.name.charAt(0) : "U"}
              </Avatar>
            </div>
            {!isCollapsed && (
              <div className="ml-2 overflow-hidden">
                <div className="font-medium text-sm truncate">{user ? user.name : "未知用户"}</div>
                <div className="text-xs text-gray-500 truncate">{user ? user.email : ""}</div>
              </div>
            )}
          </div>
        </Popover>

        {!isCollapsed && (
          <div className="flex items-center">
            {/* 垂直分隔线 */}
            <div className="w-[1px] h-8 bg-gray-300 mx-2"></div>

            {/* 灰色方块图标 */}
            <div className="w-4 h-4 bg-neutral-500 rounded flex items-center justify-center mr-1">
              <div className="w-4 h-4 bg-neutral-500 rounded"></div>
            </div>

            <Popover
              content={workspacePopoverContent}
              trigger="click"
              open={workspacePopoverVisible}
              onOpenChange={setWorkspacePopoverVisible}
              placement="topRight"
              overlayClassName="workspace-popover"
              getPopupContainer={() => document.body}
              autoAdjustOverflow={true}
            >
              <Button
                type="text"
                className="flex items-center justify-center p-0 w-6 h-6 min-w-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setWorkspacePopoverVisible(true)
                }}
              >
                <VectorIcon />
              </Button>
            </Popover>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInfoArea
