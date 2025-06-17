/**
 * API端点配置
 * 集中管理所有API端点
 */

const endpoints = {
  // 卡片相关（旧API，保留向后兼容）
  cards: {
    list: "/cards",
    detail: (id) => `/explorations/${id}`,
    create: "/cards",
    update: (id) => `/cards/${id}`,
    delete: (id) => `/cards/${id}`,
  },

  // 探索相关 (API规范: /v1/syntrust/explorations)
  explorations: {
    list: "/explorations/search",
    detail: (id) => `/explorations/${id}`,
    search: "/explorations/search",
  },

  // 任务相关 (API规范: /v1/syntrust/tasks)
  tasks: {
    list: "/tasks",
    detail: (id) => `/tasks/${id}`,
    search: "/tasks/search",
    create: "/task",
    update: (id) => `/task/${id}`,
    delete: (id) => `/task/${id}`,
    qna: (id) => `/task/${id}/qna`,
    scenario: (id) => `/task/${id}/scenario`,
    flow: (id) => `/task/${id}/flow`,
    submitOptimization: "/task/optimization",
  },

  // 资产相关 (API规范: /v1/syntrust/assets)
  assets: {
    list: "/assets",
    detail: (id) => `/asset/${id}`,
    search: "/assets/search",
  },

  // 用户相关
  users: {
    current: "/users/current",
    list: "/users",
    detail: (id) => `/users/${id}`,
  },

  // 认证相关
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },

  // 聊天相关
  chat: {
    messages: (userId) => `/chat/messages/${userId}`,
    send: "/chat/messages",
    users: "/chat/users",
  },

  // 菜单相关
  menu: {
    list: "/menu",
  },

  // 工作区相关
  workspace: {
    list: "/workspaces",
    current: "/workspaces/current",
    detail: (id) => `/workspaces/${id}`,
    switch: (id) => `/workspaces/${id}/switch`,
  },

  // 仪表盘相关
  dashboard: {
    overview: "/dashboard/overview",
    stats: "/dashboard/stats",
  },

  // 设置相关
  settings: {
    get: "/settings",
    update: "/settings",
  },

  // 评估相关
  evaluations: {
    byTask: (taskId) => `/evaluations/task/${taskId}`,
    detail: (id) => `/evaluations/${id}`,
    reevaluate: "/evaluations/reevaluate",
  },

  // 筛选相关
  filter: {
    saveView: "/filter/views",
    savedViews: "/filter/views",
    viewDetail: (id) => `/filter/views/${id}`,
    deleteView: (id) => `/filter/views/${id}`,
  },

  // 文件上传相关 (API规范: /v1/syntrust/attachments)
  attachments: {
    upload: "/attachments",
  },

  // 机器人对话相关 (API规范: /v1/rbt/chats)
  robotChat: {
    messages: (chatId) => `/rbt/chats/${chatId}/messages`,
  },

  // 模型相关 (API规范: /v1/syntrust/models)
  models: {
    list: "/models",
    detail: (id) => `/model/${id}`,
    evaluations: "/models/evaluations",
    compare: "/models/compare",
  },
}

export default endpoints
