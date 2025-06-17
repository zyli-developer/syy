"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { message } from "antd"
import userService from "../services/userService"

// 创建上下文
const UserContext = createContext()

// 自定义Hook，用于访问上下文
export const useUserContext = () => useContext(UserContext)

// 上下文Provider组件
export const UserProvider = ({ children }) => {
  // 用户状态
  const [userState, setUserState] = useState({
    username: "",
    email: "",
    avatar: null,
    version: "",
    isDarkMode: false,
    tokenBalance: 0,
    currentWorkspace: {
      id: "",
      name: "",
      icon: null,
      userRole: "",
      isActive: true,
    },
    availableWorkspaces: [],
    loading: true,
    error: null,
  })

  // 获取用户数据
  const fetchUserData = async () => {
    try {
      setUserState((prev) => ({ ...prev, loading: true, error: null }))
      const userData = await userService.getUserDetail()
      setUserState({
        ...userData,
        loading: false,
        error: null,
      })

      // 应用主题到文档
      if (userData.isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } catch (error) {
      console.error("获取用户数据失败:", error)
      setUserState((prev) => ({
        ...prev,
        loading: false,
        error: "获取用户数据失败",
      }))
      message.error("获取用户数据失败，请重试")
    }
  }

  // 切换主题
  const toggleTheme = async (isDark) => {
    try {
      await userService.updateTheme(isDark)
      setUserState((prev) => ({
        ...prev,
        isDarkMode: isDark,
      }))

      // 应用主题到文档
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      message.success(`已切换到${isDark ? "深色" : "浅色"}模式`)
    } catch (error) {
      console.error("切换主题失败:", error)
      message.error("切换主题失败，请重试")
    }
  }

  // 切换工作区
  const switchWorkspace = async (workspace) => {
    try {
      const result = await userService.switchWorkspace(workspace.id)

      if (result.success) {
        setUserState((prev) => ({
          ...prev,
          currentWorkspace: result.workspace,
          availableWorkspaces: result.availableWorkspaces,
        }))
        message.success(`已切换到 ${workspace.name} 工作区`)
      }
    } catch (error) {
      console.error("切换工作区失败:", error)
      message.error("切换工作区失败，请重试")
    }
  }

  // 登出
  const logout = () => {
    message.success("已安全退出登录")
    // 实际应用中这里会清除认证信息并重定向到登录页
  }

  // 初始化获取用户数据
  useEffect(() => {
    fetchUserData()
  }, [])

  // 提供给上下文的值
  const value = {
    user: userState,
    toggleTheme,
    switchWorkspace,
    logout,
    refreshUserData: fetchUserData,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
