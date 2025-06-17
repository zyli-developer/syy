/**
 * 筛选服务
 * 处理筛选相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const filterService = {
  /**
   * 保存视图配置
   * @param {Object} viewConfig - 视图配置，包含筛选、分组和排序
   * @returns {Promise} - 保存结果
   */
  saveView: async (viewConfig) => {
    try {
      return await api.post(endpoints.filter.saveView, viewConfig)
    } catch (error) {
      console.error("保存视图配置失败:", error)
      throw error
    }
  },

  /**
   * 获取保存的视图列表
   * @returns {Promise} - 视图列表
   */
  getSavedViews: async () => {
    try {
      return await api.get(endpoints.filter.savedViews)
    } catch (error) {
      console.error("获取保存的视图列表失败:", error)
      throw error
    }
  },

  /**
   * 获取视图详情
   * @param {string} viewId - 视图ID
   * @returns {Promise} - 视图详情
   */
  getViewDetail: async (viewId) => {
    try {
      return await api.get(endpoints.filter.viewDetail(viewId))
    } catch (error) {
      console.error(`获取视图详情失败 (ID: ${viewId}):`, error)
      throw error
    }
  },

  /**
   * 删除视图
   * @param {string} viewId - 视图ID
   * @returns {Promise} - 删除结果
   */
  deleteView: async (viewId) => {
    try {
      return await api.delete(endpoints.filter.deleteView(viewId))
    } catch (error) {
      console.error(`删除视图失败 (ID: ${viewId}):`, error)
      throw error
    }
  },
}

export default filterService
