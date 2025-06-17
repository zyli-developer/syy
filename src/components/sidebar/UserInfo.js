"use client"

import { useEffect, useState } from "react"
import { Avatar, Button } from "antd"
import { MoreOutlined } from "@ant-design/icons"

const UserInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true)
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
  }, [])

  if (loading) {
    return (
      <div className="user-info">
        <div>加载中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-info">
        <div>未登录</div>
      </div>
    )
  }

  return (
    <div className="user-info">
      <div className="user-avatar-container">
        <Avatar className="user-avatar" size={36}>
          {user.name.charAt(0)}
        </Avatar>
      </div>
      <div className="user-details">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
      </div>
      <Button type="text" icon={<MoreOutlined />} className="user-more-btn" />
    </div>
  )
}

export default UserInfo
