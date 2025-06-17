"use client"

import { createContext, useContext, useState } from "react"

// 创建Context
const NavContext = createContext()

// 自定义Hook，用于访问Context
export const useNavContext = () => useContext(NavContext)

// Context Provider组件
export const NavProvider = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState("community")

  const handleNavChange = (navKey) => {
    setSelectedNav(navKey)
  }

  // 提供给Context的值
  const value = {
    selectedNav,
    handleNavChange,
  }

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}
