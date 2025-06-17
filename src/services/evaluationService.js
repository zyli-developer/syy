/**
 * 评估数据服务
 * 处理评估相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"

const evaluationService = {
  /**
   * 获取任务的评估数据
   * @param {string} taskId - 任务ID
   * @returns {Promise} - 评估数据
   */
  getTaskEvaluation: async (taskId) => {
    try {
      return await api.get(endpoints.evaluations.byTask(taskId))
    } catch (error) {
      console.error(`获取任务评估数据失败 (任务ID: ${taskId}):`, error)
      throw error
    }
  },

  /**
   * 获取评估详情
   * @param {string} id - 评估ID
   * @returns {Promise} - 评估详情数据
   */
  getEvaluationDetail: async (id) => {
    try {
      return await api.get(endpoints.evaluations.detail(id))
    } catch (error) {
      console.error(`获取评估详情失败 (ID: ${id}):`, error)
      throw error
    }
  },

  /**
   * 重新评估
   * @param {string} evaluationId - 评估ID
   * @param {string} optimizationInput - 优化输入
   * @returns {Promise} - 更新后的评估数据
   */
  reevaluate: async (evaluationId, optimizationInput) => {
    try {
      return await api.post(endpoints.evaluations.reevaluate, {
        evaluationId,
        optimizationInput,
      })
    } catch (error) {
      console.error("重新评估失败:", error)
      throw error
    }
  },
}

export default evaluationService
