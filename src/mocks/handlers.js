import { rest } from "msw"
import {
  menuData,
  chatUsers,
  cardsData,
  currentUser,
  tasksData,
  evaluationsData,
  workspacesData,
  currentWorkspace,
  taskDetailData,
  taskAnnotationData,
  cardDetailData,
  modelEvaluationData,
  explorationCardsData,
  taskCardsData,
  assetData,
  mockWorkspaces,
} from "./data"

const mockChatMessages = [
  {
    id: 1,
    sender: "user1",
    text: "Hello!",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    sender: "me",
    text: "Hi there!",
    timestamp: new Date().toISOString(),
  },
]

export const handlers = [
  // 获取菜单数据
  rest.get("/api/menu", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(menuData))
  }),

  // 获取聊天用户列表
  rest.get("/api/chat/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(chatUsers))
  }),

  // 获取聊天消息
  rest.get("/api/chat/messages/:userId", (req, res, ctx) => {
    const { userId } = req.params

    // Return our mock chat messages
    return res(ctx.status(200), ctx.json(mockChatMessages))
  }),

  // 发送消息
  rest.post("/api/chat/messages", (req, res, ctx) => {
    const { text, userId } = req.body

    // 模拟发送消息
    const message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    }

    return res(ctx.status(201), ctx.json(message))
  }),

  // 获取卡片列表 - 修改为支持scope参数
  rest.get("/api/cards", (req, res, ctx) => {
    // 获取scope参数
    const scope = req.url.searchParams.get("scope") || "community"

    // 根据scope过滤数据
    let filteredCards = [...cardsData]

    if (scope === "workspace") {
      // 模拟工作区范围的卡片 - 只返回source为Alibaba的卡片
      filteredCards = cardsData.filter((card) => card.source === "Alibaba")
    } else if (scope === "personal") {
      // 模拟个人范围的卡片 - 只返回author.id为当前用户ID的卡片
      filteredCards = cardsData.filter((card) => card.author.id === currentUser.id)
    }
    // community范围返回所有卡片

    // 模拟分页
    const page = Number.parseInt(req.url.searchParams.get("page") || "1")
    const limit = Number.parseInt(req.url.searchParams.get("limit") || "10")
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // 返回分页后的数据
    return res(ctx.status(200), ctx.json(filteredCards.slice(startIndex, endIndex)))
  }),

  // 获取卡片详情
  rest.get("/api/cards/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        ...cardDetailData,
        id
      })
    )
  }),

  // 获取当前用户
  rest.get("/api/users/current", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(currentUser))
  }),

  // 获取用户列表
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([currentUser, ...chatUsers]))
  }),

  // 修改任务列表API处理程序，确保始终返回数组
  rest.get("/api/tasks", (req, res, ctx) => {
    const scope = req.url.searchParams.get("scope") || "community"

    // Get all tasks
    let filteredTasks = [...tasksData]

    // Filter based on scope
    if (scope === "personal") {
      filteredTasks = tasksData.filter((task) => task.type === "my")
    } else if (scope === "workspace") {
      filteredTasks = tasksData.filter((task) => task.permission === "workspace")
    }
    // For community, return all tasks

    // Ensure returning an array
    return res(ctx.status(200), ctx.json(filteredTasks || []))
  }),

  // 创建任务
  rest.post("/api/tasks", async (req, res, ctx) => {
    const taskData = await req.json()

    // 生成新任务ID
    const newId = tasksData.length > 0 ? Math.max(...tasksData.map((t) => t.id)) + 1 : 1001

    // 创建新任务对象
    const newTask = {
      ...taskData,
      id: newId,
      updatedAt: new Date()
        .toLocaleString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "/"),
      updatedBy: currentUser,
    }

    // 添加到任务数据中
    tasksData.push(newTask)

    return res(ctx.status(201), ctx.json(newTask))
  }),

  // 获取任务详情
  rest.get("/api/tasks/:id", (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        ...taskDetailData,
        id
      })
    )
  }),

  // 获取任务注释
  rest.get("/api/tasks/:id/annotations", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(taskAnnotationData)
    )
  }),

  // 获取评估数据
  rest.get("/api/evaluations/task/:taskId", (req, res, ctx) => {
    const { taskId } = req.params
    const evaluation = evaluationsData.find((item) => item.taskId === Number.parseInt(taskId))

    if (!evaluation) {
      return res(ctx.status(404), ctx.json({ message: "评估数据不存在" }))
    }

    return res(ctx.status(200), ctx.json(evaluation))
  }),

  // 获取评估详情
  rest.get("/api/evaluations/:id", (req, res, ctx) => {
    const { id } = req.params
    const evaluation = evaluationsData.find((item) => item.id === id)

    if (!evaluation) {
      return res(ctx.status(404), ctx.json({ message: "评估数据不存在" }))
    }

    return res(ctx.status(200), ctx.json(evaluation))
  }),

  // 重新评估
  rest.post("/api/evaluations/reevaluate", async (req, res, ctx) => {
    const { evaluationId, optimizationInput } = await req.json()
    const evaluation = evaluationsData.find((item) => item.id === evaluationId)

    if (!evaluation) {
      return res(ctx.status(404), ctx.json({ message: "评估数据不存在" }))
    }

    // 模拟重新评估，返回相同的数据
    return res(ctx.status(200), ctx.json(evaluation))
  }),

  // 在 handlers 数组中添加工作区相关的 API 处理程序

  // 获取工作区列表
  rest.get("/api/workspaces", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ workspaces: mockWorkspaces })
    );
  }),

  // 获取当前工作区
  rest.get("/api/workspaces/current", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(currentWorkspace))
  }),

  // 获取工作区详情
  rest.get("/api/workspaces/:id", (req, res, ctx) => {
    const { id } = req.params
    const workspace = workspacesData.find((ws) => ws.id === Number.parseInt(id))

    if (!workspace) {
      return res(ctx.status(404), ctx.json({ message: "工作区不存在" }))
    }

    // 如果请求的是当前工作区，返回详细信息
    if (workspace.id === currentWorkspace.id) {
      return res(ctx.status(200), ctx.json(currentWorkspace))
    }

    // 否则返回基本信息
    return res(ctx.status(200), ctx.json(workspace))
  }),

  // 切换当前工作区
  rest.post("/api/workspaces/switch/:id", (req, res, ctx) => {
    const { id } = req.params
    const workspace = workspacesData.find((ws) => ws.id === Number.parseInt(id))

    if (!workspace) {
      return res(ctx.status(404), ctx.json({ message: "工作区不存在" }))
    }

    // 更新当前工作区
    workspacesData.forEach((ws) => {
      ws.current = ws.id === Number.parseInt(id)
    })

    return res(ctx.status(200), ctx.json({ success: true, workspace }))
  }),

  // 保存筛选视图
  rest.post("/api/filter/views", async (req, res, ctx) => {
    const viewConfig = await req.json()

    // 模拟保存视图
    const savedView = {
      id: Date.now().toString(),
      name: "自定义视图",
      config: viewConfig,
      createdAt: new Date().toISOString(),
    }

    return res(ctx.status(201), ctx.json(savedView))
  }),

  // 获取保存的视图列表
  rest.get("/api/filter/views", (req, res, ctx) => {
    // 模拟视图列表
    const views = [
      {
        id: "1",
        name: "默认视图",
        createdAt: "2023-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "自定义视图",
        createdAt: "2023-02-01T00:00:00Z",
      },
    ]

    return res(ctx.status(200), ctx.json(views))
  }),

  // 获取视图详情
  rest.get("/api/filter/views/:id", (req, res, ctx) => {
    const { id } = req.params

    // 模拟视图详情
    const view = {
      id,
      name: id === "1" ? "默认视图" : "自定义视图",
      config: {
        filterConfig: {
          conditions: [
            {
              field: "场景",
              operator: "等于",
              values: ["场景1", "场景2"],
              id: "1",
            },
          ],
        },
        groupConfig: {
          fields: [],
        },
        sortConfig: {
          fields: [],
        },
      },
      createdAt: id === "1" ? "2023-01-01T00:00:00Z" : "2023-02-01T00:00:00Z",
    }

    return res(ctx.status(200), ctx.json(view))
  }),

  // 删除视图
  rest.delete("/api/filter/views/:id", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true }))
  }),

  // 获取模型评估数据
  rest.get("/api/evaluations/:modelId", (req, res, ctx) => {
    const { modelId } = req.params
    const evaluationData = modelEvaluationData[modelId] || null

    if (!evaluationData) {
      return res(
        ctx.status(404),
        ctx.json({ message: "模型评估数据不存在" })
      )
    }

    return res(
      ctx.status(200),
      ctx.json(evaluationData)
    )
  }),

  // 获取所有模型评估数据
  rest.get("/api/evaluations", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(modelEvaluationData)
    )
  }),

  // 新增 - 获取探索列表 (API规范: GET /v1/syntrust/explorations)
  rest.get("/v1/syntrust/explorations", (req, res, ctx) => {
    const tab = req.url.searchParams.get("tab") || "community"
    const page = Number.parseInt(req.url.searchParams.get("page") || "1")
    const perPage = Number.parseInt(req.url.searchParams.get("per_page") || "10")
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    
    // 根据tab过滤数据
    let filteredCards = [...explorationCardsData]
    if (tab === "workspace") {
      filteredCards = explorationCardsData.filter(card => card.created_from === "Alibaba")
    } else if (tab === "personal") {
      filteredCards = explorationCardsData.filter(card => card.created_by === currentUser.name)
    }
    
    const paginatedCards = filteredCards.slice(startIndex, endIndex)
    
    return res(
      ctx.status(200),
      ctx.json({
        card: paginatedCards,
        pagination: {
          total: filteredCards.length,
          page: page,
          per_page: perPage
        }
      })
    )
  }),
  
  // 新增 - 获取探索详情 (API规范: GET /v1/syntrust/exploration/{exploration_id})
  rest.get("/v1/syntrust/exploration/:id", (req, res, ctx) => {
    const { id } = req.params
    const exploration = explorationCardsData.find(card => card.id === id)
    
    if (!exploration) {
      return res(ctx.status(404), ctx.json({ message: "探索不存在" }))
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        exploration: exploration
      })
    )
  }),
  
  // 新增 - 探索搜索 (API规范: POST /v1/syntrust/explorations/search)
  rest.post("/v1/syntrust/explorations/search", async (req, res, ctx) => {
    const requestBody = await req.json()
    const tab = requestBody.tab || "community"
    const page = requestBody.pagination?.page || 1
    const perPage = requestBody.pagination?.per_page || 10
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    
    // 根据tab过滤数据
    let filteredCards = [...explorationCardsData]
    if (tab === "workspace") {
      filteredCards = explorationCardsData.filter(card => card.created_from === "Alibaba")
    } else if (tab === "personal") {
      filteredCards = explorationCardsData.filter(card => card.created_by === currentUser.name)
    }
    
    const paginatedCards = filteredCards.slice(startIndex, endIndex)
    
    return res(
      ctx.status(200),
      ctx.json({
        card: paginatedCards,
        pagination: {
          total: filteredCards.length,
          page: page,
          per_page: perPage
        },
        filter_echo: requestBody.filter || null,
        sort_echo: requestBody.sort || null
      })
    )
  }),
  
  // 新增 - 获取任务列表 (API规范: GET /v1/syntrust/tasks)
  rest.get("/v1/syntrust/tasks", (req, res, ctx) => {
    const tab = req.url.searchParams.get("tab") || "community"
    const page = Number.parseInt(req.url.searchParams.get("page") || "1")
    const perPage = Number.parseInt(req.url.searchParams.get("per_page") || "10")
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    
    // 根据tab过滤数据
    let filteredCards = [...taskCardsData]
    if (tab === "workspace") {
      filteredCards = taskCardsData.filter(card => card.created_from === "Alibaba")
    } else if (tab === "personal") {
      filteredCards = taskCardsData.filter(card => card.created_by === currentUser.name)
    }
    
    const paginatedCards = filteredCards.slice(startIndex, endIndex)
    
    return res(
      ctx.status(200),
      ctx.json({
        card: paginatedCards,
        pagination: {
          total: filteredCards.length,
          page: page,
          per_page: perPage
        }
      })
    )
  }),
  
  // 新增 - 获取任务详情 (API规范: GET /v1/syntrust/task/{task_id})
  rest.get("/v1/syntrust/task/:id", (req, res, ctx) => {
    const { id } = req.params
    const task = taskCardsData.find(card => card.id === id)
    
    if (!task) {
      return res(ctx.status(404), ctx.json({ message: "任务不存在" }))
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        task: task
      })
    )
  }),
  
  // 新增 - 任务搜索 (API规范: POST /v1/syntrust/tasks/search)
  rest.post("/v1/syntrust/tasks/search", async (req, res, ctx) => {
    const requestBody = await req.json()
    const tab = requestBody.tab || "community"
    const page = requestBody.pagination?.page || 1
    const perPage = requestBody.pagination?.per_page || 10
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    
    // 根据tab过滤数据
    let filteredCards = [...taskCardsData]
    if (tab === "workspace") {
      filteredCards = taskCardsData.filter(card => card.created_from === "Alibaba")
    } else if (tab === "personal") {
      filteredCards = taskCardsData.filter(card => card.created_by === currentUser.name)
    }
    
    const paginatedCards = filteredCards.slice(startIndex, endIndex)
    
    return res(
      ctx.status(200),
      ctx.json({
        card: paginatedCards,
        pagination: {
          total: filteredCards.length,
          page: page,
          per_page: perPage
        },
        filter_echo: requestBody.filter || null,
        sort_echo: requestBody.sort || null
      })
    )
  }),
  
  // 新增 - 创建任务 (API规范: POST /v1/syntrust/task)
  rest.post("/v1/syntrust/task", async (req, res, ctx) => {
    const taskData = await req.json()
    
    // 生成随机ID (确保唯一性)
    const randomId = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    
    // 创建新的模拟任务
    const newTask = {
      id: randomId,
      prompt: taskData.prompt || taskData.title || `新建任务-${new Date().toLocaleTimeString()}`,
      response_summary: taskData.response_summary || "新创建的任务",
      created_by: taskData.created_by || currentUser.name,
      created_from: taskData.created_from || "Web界面",
      created_at: { seconds: Math.floor(Date.now() / 1000) },
      status: taskData.status || "进行中",
      step: taskData.step || [
        {
          agent: "GPT-4",
          score: [
            {
              version: "1.0",
              confidence: "0.92",
              score: "0.88",
              consumed_points: 50,
              description: "初始化任务评估",
              dimension: [
                { latitude: "完整性", weight: 0.85 },
                { latitude: "准确性", weight: 0.90 }
              ]
            }
          ],
          reason: "初始化任务评估"
        }
      ]
    }
    
    // 将新任务添加到任务数据数组
    taskCardsData.unshift(newTask)
    
    return res(
      ctx.status(201),
      ctx.json({
        task_id: newTask.id,
        status: "success",
        message: "任务创建成功"
      })
    )
  }),

  // 新增 - 获取资产列表 (API规范: GET /v1/syntrust/assets)
  rest.get("/v1/syntrust/assets", (req, res, ctx) => {
    console.log("Mock API called: GET /v1/syntrust/assets");
    
    const tab = req.url.searchParams.get("tab") || "community"
    const page = Number.parseInt(req.url.searchParams.get("page") || "1")
    const perPage = Number.parseInt(req.url.searchParams.get("per_page") || "12")
    const searchQuery = req.url.searchParams.get("keyword") || ""
    
    console.log(`查询参数: tab=${tab}, page=${page}, perPage=${perPage}, keyword=${searchQuery}`);
    
    // 确保assetData可用
    if (!assetData || assetData.length === 0) {
      console.error("Mock数据不可用: assetData为空");
      // 返回空数据而不是错误，以便前端能够正常渲染
      return res(
        ctx.status(200),
        ctx.json({
          data: {
            card: [],
            pagination: {
              total: 0,
              page: page,
              per_page: perPage
            }
          }
        })
      );
    }
    
    // 根据tab过滤数据
    let filteredAssets = [...assetData]
    
    if (tab === "workspace") {
      filteredAssets = assetData.filter(asset => asset.created_from === "Alibaba" || asset.created_from === "workspace")
    } else if (tab === "personal") {
      filteredAssets = assetData.filter(asset => asset.created_by === "Jackson")
    }
    
    // 如果有搜索词，进一步过滤
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(lowerQuery) || 
        asset.response_summary.toLowerCase().includes(lowerQuery) ||
        (asset.keywords && asset.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))) ||
        (asset.dimensions && asset.dimensions.some(dimension => dimension.toLowerCase().includes(lowerQuery)))
      )
    }
    
    console.log(`过滤后数据数量: ${filteredAssets.length}`);
    
    // 计算分页
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedAssets = filteredAssets.slice(startIndex, endIndex)
    
    console.log(`返回数据数量: ${paginatedAssets.length}`);
    
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          card: paginatedAssets,
          pagination: {
            total: filteredAssets.length,
            page: page,
            per_page: perPage
          },
          filter_echo: null,
          sort_echo: { field: "created_at", desc: true }
        }
      })
    )
  }),
  
  // 新增 - 获取资产详情 (API规范: GET /v1/syntrust/asset/{asset_id})
  rest.get("/v1/syntrust/asset/:id", (req, res, ctx) => {
    const { id } = req.params
    const asset = assetData.find(asset => asset.id === id)
    
    if (!asset) {
      return res(ctx.status(404), ctx.json({ message: "资产不存在" }))
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        asset: asset
      })
    )
  }),
  
  // 新增 - 资产搜索接口 (API规范: POST /v1/syntrust/assets/search)
  rest.post("/v1/syntrust/assets/search", async (req, res, ctx) => {
    console.log("Mock API called: POST /v1/syntrust/assets/search");
    
    // 解析请求体
    const requestBody = await req.json();
    const { tab, filter, sort, pagination } = requestBody;
    const page = pagination?.page || 1;
    const perPage = pagination?.per_page || 12;
    
    console.log(`请求参数: tab=${tab}, page=${page}, perPage=${perPage}`);
    console.log(`筛选条件:`, filter);
    console.log(`排序条件:`, sort);
    
    // 确保assetData可用
    if (!assetData || assetData.length === 0) {
      console.error("Mock数据不可用: assetData为空");
      return res(
        ctx.status(200),
        ctx.json({
          card: [],
          pagination: {
            total: 0,
            page: page,
            per_page: perPage
          }
        })
      );
    }
    
    // 根据tab过滤数据
    let filteredAssets = [...assetData]
    
    if (tab === "workspace") {
      filteredAssets = assetData.filter(asset => asset.created_from === "Alibaba" || asset.created_from === "workspace")
    } else if (tab === "personal") {
      filteredAssets = assetData.filter(asset => asset.created_by === "Jackson")
    }
    
    // 处理过滤条件
    if (filter && filter.exprs) {
      filter.exprs.forEach(expr => {
        if (expr.field === "keyword" && expr.op === "LIKE") {
          const searchQuery = expr.values[0].toLowerCase()
          console.log(`关键词搜索: ${searchQuery}`);
          
          filteredAssets = filteredAssets.filter(asset => 
            asset.name.toLowerCase().includes(searchQuery) || 
            asset.response_summary.toLowerCase().includes(searchQuery) ||
            (asset.keywords && asset.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery))) ||
            (asset.dimensions && asset.dimensions.some(dimension => dimension.toLowerCase().includes(searchQuery)))
          )
        }
        
        if (expr.field === "type" && expr.op === "EQ") {
          console.log(`类型过滤: ${expr.values[0]}`);
          filteredAssets = filteredAssets.filter(asset => asset.type === expr.values[0])
        }
        
        if (expr.field === "confidence" && expr.op === "RANGE") {
          const [min, max] = expr.values.map(parseFloat)
          console.log(`置信度范围过滤: ${min}-${max}`);
          filteredAssets = filteredAssets.filter(asset => 
            asset.confidence >= min && asset.confidence <= max
          )
        }
      })
    }
    
    // 处理排序
    if (sort) {
      console.log(`排序字段: ${sort.field}, 降序: ${sort.desc}`);
      filteredAssets.sort((a, b) => {
        let comparison = 0
        if (sort.field === "created_at") {
          comparison = new Date(a.created_at) - new Date(b.created_at)
        } else if (sort.field === "confidence") {
          comparison = a.confidence - b.confidence
        } else if (sort.field === "like_count" || sort.field === "usage_count") {
          comparison = (a.usage_count || 0) - (b.usage_count || 0)
        }
        
        return sort.desc ? -comparison : comparison
      })
    }
    
    console.log(`过滤后数据数量: ${filteredAssets.length}`);
    
    // 计算分页
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedAssets = filteredAssets.slice(startIndex, endIndex)
    
    console.log(`返回数据数量: ${paginatedAssets.length}`);
    
    return res(
      ctx.status(200),
      ctx.json({
        card: paginatedAssets,
        pagination: {
          total: filteredAssets.length,
          page: page,
          per_page: perPage
        },
        filter_echo: filter,
        sort_echo: sort
      })
    )
  }),
]
