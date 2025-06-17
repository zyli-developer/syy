"use client"

import { useState } from "react"
import { CloseOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons"
import { notification } from "antd"
import "./CreateChatModal.css"

const CreateChatModal = ({ onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState("single") // 'single' or 'group'
  const [groupAction, setGroupAction] = useState("create") // 'create' or 'join'

  // Single chat state
  const [userId, setUserId] = useState("")

  // Group chat state
  const [groupName, setGroupName] = useState("")
  
  // Join group state
  const [groupId, setGroupId] = useState("")

  const handleCreateSingleChat = () => {
    if (!userId.trim()) return

    onCreate("C2C", { userID: userId })
    // 创建后显示提示
    notification.success({
      message: "创建成功",
      description: `已成功创建与用户 ${userId} 的会话`
    })
  }

  const handleCreateGroupChat = () => {
    if (!groupName.trim()) return

    onCreate("GROUP", {
      name: groupName,
    })
    
    // 创建成功后显示提示
    notification.success({
      message: "创建成功",
      description: `已成功创建群聊 ${groupName}，默认成员已自动添加`
    })
  }
  
  const handleJoinGroupChat = () => {
    if (!groupId.trim()) return
    
    onCreate("GROUP", {
      groupID: groupId,
      isJoin: true
    })
    
    // 加入后显示提示
    notification.success({
      message: "加入成功",
      description: `已成功加入群聊 ${groupId}`
    })
  }

  const handleCreate = () => {
    if (activeTab === "single") {
      handleCreateSingleChat()
    } else {
      if (groupAction === "create") {
      handleCreateGroupChat()
      } else {
        handleJoinGroupChat()
      }
    }
  }

  return (
    <div className="modal-overlay">
      <div className="create-chat-modal">
        <div className="modal-header">
          <h2>创建新会话</h2>
          <button className="close-button" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === "single" ? "active" : ""}`}
            onClick={() => setActiveTab("single")}
          >
            <span className="tab-icon">👤</span> 单聊
          </button>
          <button
            className={`tab-button ${activeTab === "group" ? "active" : ""}`}
            onClick={() => setActiveTab("group")}
          >
            <span className="tab-icon">👥</span> 群聊
          </button>
        </div>

        <div className="modal-content">
          {activeTab === "single" ? (
            <div className="single-chat-form">
              <div className="form-group">
                <label htmlFor="userId">用户ID</label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="输入对方的用户ID"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="group-action-tabs">
                <button 
                  className={`action-tab ${groupAction === "create" ? "active" : ""}`}
                  onClick={() => setGroupAction("create")}
                >
                  <PlusOutlined /> 创建群聊
                </button>
                <button 
                  className={`action-tab ${groupAction === "join" ? "active" : ""}`}
                  onClick={() => setGroupAction("join")}
                >
                  <UserAddOutlined /> 加入群聊
                </button>
              </div>
              
              {groupAction === "create" ? (
            <div className="group-chat-form">
              <div className="form-group">
                <label htmlFor="groupName">群组名称</label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="输入群组名称"
                />
              </div>
                  <div className="form-tip">
                    创建群聊后将自动添加默认成员，无需手动添加
            </div>
                </div>
              ) : (
                <div className="join-group-form">
                  <div className="form-group">
                    <label htmlFor="groupId">群组ID</label>
                    <input
                      id="groupId"
                      type="text"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      placeholder="输入要加入的群组ID"
                    />
                  </div>
                  <p className="form-tip">加入群聊需要知道群组ID，您可以向群组管理员获取。</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            取消
          </button>
          <button
            className="create-button"
            onClick={handleCreate}
            disabled={
              (activeTab === "single" && !userId.trim()) || 
              (activeTab === "group" && groupAction === "create" && !groupName.trim()) ||
              (activeTab === "group" && groupAction === "join" && !groupId.trim())
            }
          >
            {activeTab === "single" ? "创建" : groupAction === "create" ? "创建" : "加入"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateChatModal
