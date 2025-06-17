/**
 * 任务数据服务
 * 处理任务相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { getCurrentUser } from "./authService"
import { processTaskCard, processTasksResponse } from "../utils/dataTransformer"
import { taskCardsData, modelEvaluationData } from "../mocks/data"
import { filterCardsByConditions } from "../mocks/filterData"

// 判断是否使用本地模拟数据
const REACT_APP_USE_MOCK_DATA = (process.env.REACT_APP_USE_MOCK_DATA === 'true');
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

const taskService = {
  /**
   * 获取任务列表 (API规范: GET /v1/syntrust/tasks)
   * @param {Object} params - 查询参数，包括tab, pagination, filter, sort
   * @returns {Promise} - 任务列表数据，包含card和pagination
   */
  getTasks: async (params = {}) => {
    try {
      console.log("获取任务列表，参数:", params);
      
      // 如果使用本地模拟数据
      console.log("REACT_APP_USE_MOCK_DATA", process.env.REACT_APP_USE_MOCK_DATA,REACT_APP_USE_MOCK_DATA);

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
        
        // 从localStorage中获取导入的任务
        // try {
        //   const importedTasksJson = localStorage.getItem('imported_tasks');
        //   if (importedTasksJson) {
        //     const importedTasks = JSON.parse(importedTasksJson);
        //     if (Array.isArray(importedTasks) && importedTasks.length > 0) {
        //       console.log(`从localStorage中获取到${importedTasks.length}条导入任务数据`);
        //       // 将导入的任务添加到数据前面
        //       data = [...importedTasks, ...data];
        //     }
        //   }
        // } catch (error) {
        //   console.error('从localStorage获取导入任务失败:', error);
        // }
        
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
          card: paginatedData,
          pagination: {
            total: data.length,
            page: page,
            per_page: perPage
          }
        };
      }
      
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
        
        console.log("使用搜索接口获取数据:", searchParams);
        
        // 调用搜索接口
        const response = await api.post(
          endpoints.tasks.search, 
          searchParams,
          'TaskSearchRequest',
          'TaskSearchResponse'
        );
        
        // 处理响应数据
        const processedResponse = processTasksResponse(response);
        console.log("搜索接口返回数据，处理后:", processedResponse);
        return processedResponse;
      }
      
      console.log("使用列表接口获取数据:", requestParams);
      
      // 调用列表接口
      const response = await api.post(
        endpoints.tasks.search, 
       requestParams ,
        'GetTasksPageResponse'
      );
      
      // 处理响应数据
      const processedResponse = processTasksResponse(response);
      console.log("列表接口返回数据，处理后:", processedResponse);
      return processedResponse;
    } catch (error) {
      console.error("获取任务列表失败:", error);
      // 从mock数据中获取任务列表
      console.log("尝试从mock数据中获取任务列表");
      const { taskCardsData } = require("../mocks/data");
      
      // 模拟分页
      const page = params.pagination?.page || 1;
      const perPage = params.pagination?.per_page || 10;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      
      // 返回处理后的模拟数据
      const mockResponse = {
        card: taskCardsData.slice(startIndex, endIndex),
        pagination: {
          total: taskCardsData.length,
          page: page,
          per_page: perPage
        }
      };
      
      console.log("返回mock数据:", mockResponse);
      return mockResponse;
    }
  },

  /**
   * 获取任务详情 (API规范: GET /v1/syntrust/task/{task_id})
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务详情数据
   */
  getTaskDetail: async (id) => {
    try {
      // 如果使用本地模拟数据
      if (REACT_APP_USE_MOCK_DATA) {
        console.log(`使用本地模拟数据获取任务详情, ID: ${id}`);
        
        // 从taskCardsData中查找对应ID的任务，同时支持字符串和数字格式的ID比较
        const { taskCardsData } = require("../mocks/data");
        const mockTask = taskCardsData.find(task => 
          task.id === id || task.id === id.toString() || task.id.toString() === id
        );
        
        if (mockTask) {
          console.log("找到匹配的mock任务:", mockTask);
          // 确保返回的是对象而不是字符串
          return { task: mockTask && typeof mockTask === 'object' ? mockTask : {} };
        }
        
        // 如果没有找到对应ID的任务，返回一个基本的任务结构
        console.log(`未找到ID为 ${id} 的任务，返回默认结构`);
        return {
          task: {
            id: id,
            title: `任务 ${id}`,
            author: {
              name: "系统",
              avatar: null
            },
            source: "本地测试",
            tags: ["测试", "示例"],
            description: "这是一个示例任务，用于在API调用失败时显示",
            chartData: {
              radar: [
                { name: "维度1", value: 80 },
                { name: "维度2", value: 75 },
                { name: "维度3", value: 85 }
              ],
              line: [
                { month: "08", value: 70 },
                { month: "09", value: 75 },
                { month: "10", value: 80 }
              ]
            }
          }
        };
      }
      
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      const response = await api.get(
        endpoints.tasks.detail(id),
        requestParams,
        'GetTaskResponse'
      );
      
      // 确保response是对象
      if (typeof response === 'string') {
        try {
          const parsedResponse = JSON.parse(response);
          // 如果有task字段，处理数据
          if (parsedResponse.task) {
            parsedResponse.task = processTaskCard(parsedResponse.task);
          }
          return parsedResponse;
        } catch (error) {
          console.error("无法解析任务详情响应:", error);
          // 返回一个基本对象结构
          return { task: {} };
        }
      }
      
      // 如果有task字段，处理数据
      if (response && response.task) {
        response.task = processTaskCard(response.task);
      }
      
      return response;
    } catch (error) {
      console.error(`获取任务详情失败 (ID: ${id}):`, error);
      
      // 返回mock数据，防止前端崩溃
      // 从taskCardsData中查找对应ID的任务，同时支持字符串和数字格式的ID比较
      const { taskCardsData } = require("../mocks/data");
      const mockTask = taskCardsData.find(task => 
        task.id === id || task.id === id.toString() || task.id.toString() === id
      );
      
      if (mockTask) {
        console.log("使用mock数据:", mockTask);
        return { task: mockTask && typeof mockTask === 'object' ? mockTask : {} };
      }
      
      // 如果没有找到对应ID的任务，返回一个基本的任务结构
      return {
        task: {
          id: id,
          title: `任务 ${id}`,
          author: {
            name: "系统",
            avatar: null
          },
          source: "本地测试",
          tags: ["测试", "示例"],
          description: "这是一个示例任务，用于在API调用失败时显示",
          chartData: {
            radar: [
              { name: "维度1", value: 80 },
              { name: "维度2", value: 75 },
              { name: "维度3", value: 85 }
            ],
            line: [
              { month: "08", value: 70 },
              { month: "09", value: 75 },
              { month: "10", value: 80 }
            ]
          }
        }
      };
    }
  },

  /**
   * 获取任务QnA数据 (API规范: GET /v1/syntrust/task/{task_id}/qna)
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务QnA数据
   */
  getTaskQna: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.get(
        endpoints.tasks.qna(id),
        { params: requestParams },
        'GetTaskQnaResponse'
      );
    } catch (error) {
      console.error(`获取任务QnA数据失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取任务场景数据 (API规范: GET /v1/syntrust/task/{task_id}/scenario)
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务场景数据
   */
  getTaskScenario: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.get(
        endpoints.tasks.scenario(id),
        { params: requestParams },
        'GetTaskScenarioResponse'
      );
    } catch (error) {
      console.error(`获取任务场景数据失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取任务流程数据 (API规范: GET /v1/syntrust/task/{task_id}/flow)
   * @param {string} id - 任务ID
   * @returns {Promise} - 任务流程数据
   */
  getTaskFlow: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestParams = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.get(
        endpoints.tasks.flow(id),
        { params: requestParams },
        'GetTaskFlowResponse'
      );
    } catch (error) {
      console.error(`获取任务流程数据失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 创建任务 (API规范: POST /v1/syntrust/task)
   * @param {Object} taskData - 任务数据
   * @returns {Promise} - 创建结果
   */
  createTask: async (taskData) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 添加用户信息
      const requestData = {
        ...taskData,
        user_id: currentUser?.id || ""
      };
      
      // ---- 使用mock数据，不调用真实API ----
      console.log("创建任务(模拟):", requestData);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 返回模拟的成功响应
      return {
        task_id: `task_${Date.now()}`,
        status: "success",
        message: "任务创建成功(模拟)"
      };
      
      /* 实际API调用代码（暂时注释掉）
      return await api.post(
        endpoints.tasks.create,
        requestData,
        'CreateTaskRequest',
        'CreateTaskResponse'
      );
      */
    } catch (error) {
      console.error("创建任务失败:", error);
      throw error;
    }
  },

  /**
   * 更新任务 (API规范: PUT /v1/syntrust/task/{task_id})
   * @param {string} id - 任务ID
   * @param {Object} taskData - 更新数据
   * @returns {Promise} - 更新结果
   */
  updateTask: async (id, taskData) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 添加用户信息
      const requestData = {
        ...taskData,
        user_id: currentUser?.id || ""
      };
      
      // ---- 使用mock数据，不调用真实API ----
      console.log(`更新任务(模拟), ID: ${id}:`, requestData);
      
      // 更新taskCardsData中的任务
      try {
        const { taskCardsData } = require("../mocks/data");
        const taskIndex = taskCardsData.findIndex(task => 
          task.id === id || task.id === id.toString() || task.id.toString() === id
        );
        
        if (taskIndex !== -1) {
          // 更新status字段
          if (requestData.status) {
            taskCardsData[taskIndex].status = requestData.status;
          }
          
          // 更新evaluations字段
          if (requestData.evaluations) {
            taskCardsData[taskIndex].evaluations = requestData.evaluations;
          }
          
          console.log("任务已更新:", taskCardsData[taskIndex]);
        }
      } catch (error) {
        console.error("更新mock数据失败:", error);
      }
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 返回模拟的成功响应
      return {
        status: "success",
        message: "任务更新成功(模拟)"
      };
      
      /* 实际API调用代码（暂时注释掉）
      return await api.put(
        endpoints.tasks.update(id),
        requestData,
        'UpdateTaskRequest',
        'UpdateTaskResponse'
      );
      */
    } catch (error) {
      console.error(`更新任务失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 删除任务 (API规范: DELETE /v1/syntrust/task/{task_id})
   * @param {string} id - 任务ID
   * @returns {Promise} - 删除结果
   */
  deleteTask: async (id) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 构建请求参数
      const requestData = {
        user_id: currentUser?.id || ""
      };
      
      // 调用API
      return await api.delete(
        endpoints.tasks.delete(id),
        requestData,
        'DeleteTaskRequest',
        'DeleteTaskResponse'
      );
    } catch (error) {
      console.error(`删除任务失败 (ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 提交优化结果，创建新任务 (API规范: POST /v1/syntrust/task/optimization)
   * @param {Object} optimizationData - 优化结果数据
   * @returns {Promise} - 创建结果
   */
  submitOptimizationResult: async (optimizationData) => {
    try {
      // 获取当前用户
      const currentUser = getCurrentUser();
      
      // 生成新任务ID（确保是纯数字格式）
      const timestamp = Date.now();
      const newTaskId = Math.floor(Math.random() * 900) + 100; // 生成100-999之间的随机ID
      
      // 创建新任务对象
      const newTask = {
        ...optimizationData,
        id: newTaskId.toString(), // 确保ID是字符串格式
        user_id: currentUser?.id || "",
        created_at: { seconds: Math.floor(timestamp / 1000) },
        status: "completed",
        type: "optimization",
        // 添加创建时间
        updatedAt: new Date().toLocaleString(),
        updatedBy: { name: currentUser?.name || "当前用户", avatar: null }
      };
      
      console.log("提交优化结果(模拟):", newTask);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 返回模拟的成功响应，包含完整的新任务数据
      return {
        task_id: newTaskId.toString(),
        task: newTask, // 返回完整的新任务数据
        status: "success",
        message: "优化结果提交成功，已创建新任务"
      };
      
      /* 实际API调用代码（暂时注释掉）
      return await api.post(
        endpoints.tasks.submitOptimization,
        newTask,
        'OptimizationSubmitRequest',
        'OptimizationSubmitResponse'
      );
      */
    } catch (error) {
      console.error("提交优化结果失败:", error);
      throw error;
    }
  },



}

export default taskService
