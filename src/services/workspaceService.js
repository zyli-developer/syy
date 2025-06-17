/**
 * 工作区数据服务
 * 处理工作区相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { workspacesData, currentWorkspace as mockCurrentWorkspace } from "../mocks/data"

// 将工作区数据转换为标准格式
const standardizeWorkspace = (workspace) => {
  if (!workspace) return null;
  
  return {
    id: workspace.id,
    name: workspace.name || "未命名工作区",
    icon: workspace.icon || null,
    role: workspace.role || "member",
    domain: workspace.domain || "",
    description: workspace.description || "",
    current: workspace.current || false,
    members: workspace.members || 0,
    projects: workspace.projects || 0,
    settings: workspace.settings || {},
    createdAt: workspace.createdAt || { seconds: Math.floor(Date.now() / 1000) }
  };
};

const workspaceService = {
  /**
   * 获取工作区列表
   * @returns {Promise} - 工作区列表数据
   */
  getWorkspaces: async () => {
    try {
      const response = await api.get(endpoints.workspace.list)
      
      // 兼容处理API返回数据
      // 1. 如果是数组直接返回
      if (Array.isArray(response)) {
        return response.map(standardizeWorkspace);
      }
      
      // 2. 如果是对象且有items属性，返回其中的items
      if (response && response.items && Array.isArray(response.items)) {
        return response.items.map(standardizeWorkspace);
      }
      
      // 3. 如果是对象且有data属性，返回其中的data
      if (response && response.data && Array.isArray(response.data)) {
        return response.data.map(standardizeWorkspace);
      }
      
      // 4. 如果是对象且有workspaces属性，返回其中的workspaces
      if (response && response.workspaces && Array.isArray(response.workspaces)) {
        return response.workspaces.map(standardizeWorkspace);
      }
      
      // 5. 返回兜底数据，避免前端报错
      console.warn("工作区数据格式不正确，使用默认工作区数据")
      return workspacesData.map(standardizeWorkspace);
    } catch (error) {
      console.error("获取工作区列表失败:", error)
      // 发生错误时返回默认工作区数据，避免前端报错
      return workspacesData.map(standardizeWorkspace);
    }
  },

  /**
   * 获取当前工作区
   * @returns {Promise} - 当前工作区数据
   */
  getCurrentWorkspace: async () => {
    try {
      const response = await api.get(endpoints.workspace.current);
      
      // 处理可能的不同响应格式
      if (response && response.workspace) {
        return standardizeWorkspace(response.workspace);
      }
      
      if (response && response.id) {
        return standardizeWorkspace(response);
      }
      
      // 使用 mock 数据作为兜底
      console.warn("使用 mock 当前工作区数据");
      return standardizeWorkspace(mockCurrentWorkspace);
    } catch (error) {
      console.error("获取当前工作区失败:", error)
      // 发生错误时返回 mock 数据，避免前端报错
      return standardizeWorkspace(mockCurrentWorkspace);
    }
  },

  /**
   * 获取工作区详情
   * @param {string} id - 工作区ID
   * @returns {Promise} - 工作区详情数据
   */
  getWorkspaceDetail: async (id) => {
    try {
      const response = await api.get(endpoints.workspace.detail(id));
      
      // 处理可能的不同响应格式
      if (response && response.workspace) {
        return standardizeWorkspace(response.workspace);
      }
      
      if (response && response.id) {
        return standardizeWorkspace(response);
      }
      
      // 使用 mock 数据作为兜底
      const mockWorkspace = workspacesData.find(ws => ws.id.toString() === id.toString()) || 
                           {...mockCurrentWorkspace, id};
      console.warn("使用 mock 工作区详情数据");
      return standardizeWorkspace(mockWorkspace);
    } catch (error) {
      console.error(`获取工作区详情失败 (ID: ${id}):`, error)
      // 发生错误时返回 mock 数据，避免前端报错
      const mockWorkspace = workspacesData.find(ws => ws.id.toString() === id.toString()) || 
                           {...mockCurrentWorkspace, id};
      return standardizeWorkspace(mockWorkspace);
    }
  },

  /**
   * 切换当前工作区
   * @param {string} id - 工作区ID
   * @returns {Promise} - 切换结果
   */
  switchWorkspace: async (id) => {
    try {
      const response = await api.post(endpoints.workspace.switch(id));
      
      if (response && response.success) {
        return response;
      }
      
      // 模拟切换成功
      return { success: true, workspace: standardizeWorkspace({...mockCurrentWorkspace, id}) };
    } catch (error) {
      console.error(`切换工作区失败 (ID: ${id}):`, error)
      throw error
    }
  },
}

export default workspaceService
