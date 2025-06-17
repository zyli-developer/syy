/**
 * 卡片数据服务
 * 处理卡片相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { getCurrentUser } from "./authService"
import { processExplorationCard, processExplorationsResponse } from "../utils/dataTransformer"
import { explorationCardsData, taskCardsData } from "../mocks/data"
import { filterCardsByConditions } from "../mocks/filterData"

// 判断是否使用本地模拟数据
const REACT_APP_USE_MOCK_DATA = (process.env.REACT_APP_USE_MOCK_DATA === 'true');

const cardService = {
  /**
   * 获取卡片列表（旧方法，保留向后兼容）
   * @param {Object} params - 查询参数，包括page, limit, scope等
   * @returns {Promise} - 卡片列表数据
   */
  getCards: async (params = {}) => {
    try {
      // 构建请求参数，确保包含scope
      const requestParams = {
        ...params,
        scope: params.scope || "community", // 默认为community
      }

      const data = await api.get(endpoints.cards.list, { params: requestParams })

      // 确保每个卡片都有必要的属性
      const processedData = data.map((card) => ({
        ...card,
        agents: card.agents || {
          overall: false,
          agent1: false,
          agent2: false,
        },
        chartData: card.chartData || {
          radar: [],
          line: [],
        },
        changes: card.changes || [],
      }))

      return processedData
    } catch (error) {
      console.error("获取卡片数据失败:", error)
      throw error
    }
  },

  /**
   * 获取探索列表 (API规范: GET /v1/syntrust/explorations)
   * @param {Object} params - 查询参数，包括tab, pagination, filter, sort
   * @returns {Promise} - 探索列表数据，包含card和pagination
   */
  getExplorations: async (params = {}) => {
    try {
      // 如果使用本地模拟数据
      console.log("REACT_APP_USE_MOCK_DATA", REACT_APP_USE_MOCK_DATA);
      if (REACT_APP_USE_MOCK_DATA) {
        console.log("使用本地模拟数据...");
        // 获取分页参数
        const page = params.pagination?.page || 1;
        const perPage = params.pagination?.per_page || 10;
        
        // 获取筛选和排序条件
        const filterParams = params.filter;
        const sortParams = params.sort;
        
        // 复制一份探索卡片数据，避免修改原始数据
        let data = JSON.parse(JSON.stringify(explorationCardsData));
        
        // 应用筛选条件 - 如果有筛选参数
        if (filterParams) {
          console.log("应用筛选条件:", filterParams);
          
          // 将API筛选格式转换为UI筛选格式
          const filterConfig = {
            conditions: []
          };
          
          // 处理不同格式的筛选条件
          if (Array.isArray(filterParams)) {
            // 处理数组格式的筛选条件 [{exprs:[...]}, {exprs:[...]}]
            filterParams.forEach(filter => {
              if (filter.exprs && Array.isArray(filter.exprs)) {
                filter.exprs.forEach(expr => {
                  filterConfig.conditions.push({
                    field: expr.field,
                    operator: convertApiOperatorToUi(expr.op),
                    values: expr.values
                  });
                });
              }
            });
          } else if (filterParams.exprs && Array.isArray(filterParams.exprs)) {
            // 处理单个对象格式的筛选条件 {exprs:[...]}
            filterParams.exprs.forEach(expr => {
              filterConfig.conditions.push({
                field: expr.field,
                operator: convertApiOperatorToUi(expr.op),
                values: expr.values
              });
            });
          }
          
          console.log("转换后的筛选配置:", filterConfig);
          
          // 使用filter函数筛选数据
          data = filterCardsByConditions(data, filterConfig);
          console.log("筛选后的数据量:", data.length);
        }
        
        // 应用排序条件 - 如果有排序参数
        if (sortParams) {
          console.log("应用排序条件:", sortParams);
          data.sort((a, b) => {
            const fieldA = a[sortParams.field];
            const fieldB = b[sortParams.field];
            
            // 检查字段是否存在且可比较
            if (fieldA !== undefined && fieldB !== undefined) {
              // 数值比较
              if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                return sortParams.desc ? (fieldB - fieldA) : (fieldA - fieldB);
              }
              // 字符串比较
              else {
                const compareResult = String(fieldA).localeCompare(String(fieldB));
                return sortParams.desc ? -compareResult : compareResult;
              }
            }
            return 0;
          });
        }
        
        // 分页处理
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        // 构建响应结构
        return {
          cards: paginatedData,
          pagination: {
            total: data.length,
            page: page,
            per_page: perPage
          }
        };
      }
      
      // 以下是原始的API调用逻辑
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建符合API规范的请求参数
      const requestParams = {
        tab: params.tab || "community", // 默认为community
        user_id: currentUser?.id || "",
        pagination: params.pagination || {
          page: 1,
          per_page: 10
        }
      };

      // 如果有筛选条件，添加到搜索请求中
      if (params.filter || params.sort) {
        // 使用搜索接口
        const searchParams = {
          tab: requestParams.tab,
          filter: params.filter,
          sort: params.sort,
          pagination: requestParams.pagination
        };
        
        // 调用搜索接口
        const response = await api.post(
          endpoints.explorations.search, 
          searchParams,
          'ExplorationSearchRequest',
          'ExplorationSearchResponse'
        );
        // 处理响应数据
        return processExplorationsResponse(response);
      }
      
      // 调用列表接口
      const response = await api.post(
        endpoints.explorations.list, 
        requestParams,
        'GetExplorationsRequest',
        'GetExplorationsPageResponse'
      );
      console.log("response",response);

      // 处理响应数据
      return processExplorationsResponse(response);
    } catch (error) {
      console.error("获取探索列表失败:", error);
      // 返回一个空的响应结构，避免前端报错
      return {
        cards: [],
        pagination: {
          total: 0,
          page: 1,
          per_page: 10
        }
      };
    }
  },

  /**
   * 获取探索详情 (API规范: GET /v1/syntrust/exploration/{exploration_id})
   * @param {string} id - 探索ID
   * @returns {Promise} - 探索详情数据
   */
  getExplorationDetail: async (id) => {
    try {
      // 如果使用本地模拟数据
      if (REACT_APP_USE_MOCK_DATA) {
        console.log(`使用本地模拟数据获取探索详情, ID: ${id}`);
        
        // 从explorationCardsData中获取对应ID的卡片数据
        const exploration = explorationCardsData.find(card => card.id === id);
        
        if (!exploration) {
          throw new Error(`找不到ID为 ${id} 的探索数据`);
        }
        
        // 处理探索卡片数据
        const processedExploration = processExplorationCard(exploration);
        
        // 使用processedExploration.modelEvaluations作为模型评估数据
        const evaluationData = processedExploration.modelEvaluations || {};
        
        // 返回符合API格式的响应数据，包含卡片数据和模型评估数据
        return {
          exploration: processedExploration,
          evaluationData: evaluationData
        };
      }
      
      // 以下是原始的API调用逻辑
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      const response = await api.get(
        endpoints.explorations.detail(id),
        { params: requestParams },
        'GetExplorationTaskResponse'
      );
      
      // 如果有exploration字段，处理数据
      if (response.exploration) {
        const processedExploration = processExplorationCard(response.exploration);
        response.exploration = processedExploration;
        response.evaluationData = processedExploration.modelEvaluations || {};
      }
      
      return response;
    } catch (error) {
      console.error(`获取探索详情失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取卡片详情（旧方法，保留向后兼容）
   * @param {string} id - 卡片ID
   * @returns {Promise} - 卡片详情数据
   */
  getCardDetail: async (id) => {
    try {
      const data = await api.get(endpoints.cards.detail(id))
      return data
    } catch (error) {
      console.error("获取卡片详情失败:", error)
      throw error
    }
  },

  /**
   * 创建卡片（旧方法，保留向后兼容）
   * @param {Object} cardData - 卡片数据
   * @returns {Promise} - 创建结果
   */
  createCard: async (cardData) => {
    try {
      const data = await api.post(endpoints.cards.create, cardData)
      return data
    } catch (error) {
      console.error("创建卡片失败:", error)
      throw error
    }
  },

  /**
   * 更新卡片（旧方法，保留向后兼容）
   * @param {string} id - 卡片ID
   * @param {Object} cardData - 更新数据
   * @returns {Promise} - 更新结果
   */
  updateCard: async (id, cardData) => {
    try {
      const data = await api.put(endpoints.cards.update(id), cardData)
      return data
    } catch (error) {
      console.error("更新卡片失败:", error)
      throw error
    }
  },

  /**
   * 删除卡片（旧方法，保留向后兼容）
   * @param {string} id - 卡片ID
   * @returns {Promise} - 删除结果
   */
  deleteCard: async (id) => {
    try {
      const data = await api.delete(endpoints.cards.delete(id))
      return data
    } catch (error) {
      console.error("删除卡片失败:", error)
      throw error
    }
  },

  /**
   * 获取任务列表
   * @param {Object} params - 查询参数，包括tab, pagination, filter, sort
   * @returns {Promise} - 任务列表数据，包含card和pagination
   */
  getTasks: async (params = {}) => {
    try {
      // 如果使用本地模拟数据
      if (REACT_APP_USE_MOCK_DATA) {
        console.log("使用本地模拟数据...");
        // 获取分页参数
        const page = params.pagination?.page || 1;
        const perPage = params.pagination?.per_page || 10;
        
        // 获取筛选和排序条件
        const filterParams = params.filter;
        const sortParams = params.sort;
        
        // 复制一份任务卡片数据，避免修改原始数据
        let data = JSON.parse(JSON.stringify(taskCardsData));
        
        // 应用筛选条件 - 如果有筛选参数
        if (filterParams) {
          console.log("应用筛选条件:", filterParams);
          
          // 将API筛选格式转换为UI筛选格式
          const filterConfig = {
            conditions: []
          };
          
          // 处理不同格式的筛选条件
          if (Array.isArray(filterParams)) {
            // 处理数组格式的筛选条件 [{exprs:[...]}, {exprs:[...]}]
            filterParams.forEach(filter => {
              if (filter.exprs && Array.isArray(filter.exprs)) {
                filter.exprs.forEach(expr => {
                  filterConfig.conditions.push({
                    field: expr.field,
                    operator: convertApiOperatorToUi(expr.op),
                    values: expr.values
                  });
                });
              }
            });
          } else if (filterParams.exprs && Array.isArray(filterParams.exprs)) {
            // 处理单个对象格式的筛选条件 {exprs:[...]}
            filterParams.exprs.forEach(expr => {
              filterConfig.conditions.push({
                field: expr.field,
                operator: convertApiOperatorToUi(expr.op),
                values: expr.values
              });
            });
          }
          
          console.log("转换后的筛选配置:", filterConfig);
          
          // 使用filter函数筛选数据
          data = filterCardsByConditions(data, filterConfig);
          console.log("筛选后的数据量:", data.length);
        }
        
        // 应用排序条件 - 如果有排序参数
        if (sortParams) {
          console.log("应用排序条件:", sortParams);
          data.sort((a, b) => {
            const fieldA = a[sortParams.field];
            const fieldB = b[sortParams.field];
            
            // 检查字段是否存在且可比较
            if (fieldA !== undefined && fieldB !== undefined) {
              // 数值比较
              if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                return sortParams.desc ? (fieldB - fieldA) : (fieldA - fieldB);
              }
              // 字符串比较
              else {
                const compareResult = String(fieldA).localeCompare(String(fieldB));
                return sortParams.desc ? -compareResult : compareResult;
              }
            }
            return 0;
          });
        }
        
        // 分页处理
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        // 构建响应结构
        return {
          cards: paginatedData,
          pagination: {
            total: data.length,
            page: page,
            per_page: perPage
          }
        };
      }
      
      // 以下是原始的API调用逻辑
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建符合API规范的请求参数
      const requestParams = {
        tab: params.tab || "all", // 默认为all
        user_id: currentUser?.id || "",
        pagination: params.pagination || {
          page: 1,
          per_page: 10
        }
      };

      // 如果有筛选条件，添加到搜索请求中
      if (params.filter || params.sort) {
        // 使用搜索接口
        const searchParams = {
          tab: requestParams.tab,
          filter: params.filter,
          sort: params.sort,
          pagination: requestParams.pagination
        };
        
        // 调用搜索接口
        const response = await api.post(
          endpoints.tasks.search, 
          searchParams,
          'TaskSearchRequest',
          'TaskSearchResponse'
        );
        
        return response;
      }
      
      // 调用列表接口
      const response = await api.get(
        endpoints.tasks.list, 
        { params: requestParams },
        'GetTasksResponse'
      );
      
      return response;
    } catch (error) {
      console.error("获取任务列表失败:", error);
      // 返回一个空的响应结构，避免前端报错
      return {
        cards: [],
        pagination: {
          total: 0,
          page: 1,
          per_page: 10
        }
      };
    }
  },
}

// 辅助函数：将API操作符转换为UI操作符
function convertApiOperatorToUi(apiOp) {
  switch(apiOp) {
    case "EQ": return "等于";
    case "NEQ": return "不等于";
    case "GT": return "大于";
    case "GTE": return "大于等于";
    case "LT": return "小于";
    case "LTE": return "小于等于";
    case "LIKE": return "包含";
    case "NOT_IN": return "不包含";
    case "RANGE": return "在范围内";
    default: return "等于";
  }
}

export default cardService
