/**
 * 菜单数据服务
 * 处理菜单相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { menuData } from "../mocks/data"

const menuService = {
  /**
   * 获取菜单列表
   * @returns {Promise} - 菜单列表数据
   */
  getMenuItems: async () => {
    try {
      const response = await api.get(endpoints.menu.list)
      
      // 兼容处理API返回数据
      // 1. 如果是数组直接返回
      if (Array.isArray(response)) {
        return response
      }
      
      // 2. 如果是对象且有items属性，返回其中的items
      if (response && response.items && Array.isArray(response.items)) {
        return response.items
      }
      
      // 3. 如果是对象且有data属性，返回其中的data
      if (response && response.data && Array.isArray(response.data)) {
        return response.data
      }
      
      // 4. 返回兜底数据，避免前端报错
      console.warn("菜单数据格式不正确，使用默认菜单数据")
      return menuData
    } catch (error) {
      console.error("获取菜单列表失败:", error)
      // 发生错误时返回默认菜单数据，避免前端报错
      return menuData
    }
  },
}

export default menuService
