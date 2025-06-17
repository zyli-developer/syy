// 菜单数据
export const menuData = [
  {
    id: 1,
    title: "探索",
    path: "/explore",
    icon: "ExploreIcon",
    active: true,
    children: [
      { id: 101, title: "提案广场", path: "/explore/proposals", icon: "AppstoreOutlined", disableRename: true, disableDelete: true },
      { id: 102, title: "找朋友", path: "/explore/friends", icon: "AppstoreOutlined", disableRename: true, disableDelete: true },
    ],
  },
  {
    id: 2,
    title: "任务",
    path: "/tasks",
    icon: "TaskIcon",
  },
  {
    id: 3,
    title: "资产",
    path: "/assets",
    icon: "AppstoreOutlined",
  }
]

// 聊天用户数据
export const chatUsers = [
  {
    id: 1,
    name: "测评员-1",
    avatar: null,
    status: "active",
  },
  {
    id: 2,
    name: "测评员-2",
    avatar: null,
    status: "offline",
  },
  {
    id: 3,
    name: "审核员-1",
    avatar: null,
    status: "active",
  },
]

// Add more realistic mock chat messages
export const mockChatMessages = [
  {
    id: 1,
    sender: "other",
    text: "您好，有什么我可以帮助您的吗？",
    timestamp: "2025/12/3 21:45",
  },
  {
    id: 2,
    sender: "user",
    text: "我想了解一下关于AI安全评估的相关信息",
    timestamp: "2025/12/3 21:46",
  },
  {
    id: 3,
    sender: "other",
    text: "当然可以。我们提供全面的AI安全评估服务，包括模型安全性、数据隐私保护、系统鲁棒性等多个维度的测试和评估。您有具体想了解哪方面的内容吗？",
    timestamp: "2025/12/3 21:47",
  },
  {
    id: 4,
    sender: "user",
    text: "我主要关注模型安全性评估，特别是对于大语言模型的评估标准",
    timestamp: "2025/12/3 21:48",
  },
  {
    id: 5,
    sender: "other",
    text: "对于大语言模型的安全性评估，我们主要从以下几个方面进行：1. 输出安全性：评估模型是否会产生有害、不当或违规内容；2. 鲁棒性：测试模型对抗攻击的防御能力；3. 隐私保护：评估模型是否会泄露训练数据中的敏感信息；4. 偏见与公平性：检测模型输出是否存在偏见。我们可以根据您的具体需求定制评估方案。",
    timestamp: "2025/12/3 21:50",
  },
]

// 卡片数据 - 更新为每个卡片都有不同的数据, 任务基本信息
export const cardsData = [
  {
    id: 1,
    title: "AI玩具安全性评估：儿童语音交互系统的隐私保护与内容安全",
    author: {
      id: 2,
      name: "测评员-1",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["安全性", "儿童", "语音交互"],
    summary:
      "本评估针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析，重点关注隐私保护、内容过滤和数据安全。评估发现该产品在语音识别准确性和响应速度方面表现优秀，但在数据存储加密和家长控制功能方面存在不足。",
    credibility: 92.5,
    credibilityChange: "+1.5%",
    score: 9.2,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "语音识别", value: 85 },
        { name: "内容安全", value: 78 },
        { name: "隐私保护", value: 65 },
        { name: "数据加密", value: 70 },
        { name: "家长控制", value: 60 },
        { name: "系统稳定", value: 88 },
      ],
      line: [
        { month: "08", value: 65 },
        { month: "09", value: 72 },
        { month: "10", value: 80 },
        { month: "11", value: 92 },
      ],
    },
    agents: {
      overall: true,
      agent1: true,
      agent2: false,
    },
    changes: ["更新了隐私保护评估标准", "添加了COPPA合规性检查", "优化了内容过滤测试方法"],
    updatedAt: "21:32, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "Mike",
      avatar: null,
    },
  },
  {
    id: 2,
    title: "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
    author: {
      id: 3,
      name: "测评员-2",
      avatar: null,
    },
    source: "医疗AI研究中心",
    tags: ["医疗", "伦理", "诊断"],
    summary:
      "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
    credibility: 87.0,
    credibilityChange: "+2.3%",
    score: 8.7,
    scoreChange: "+1.2%",
    chartData: {
      radar: [
        { name: "诊断准确", value: 87 },
        { name: "罕见病识别", value: 62 },
        { name: "紧急处理", value: 58 },
        { name: "隐私保护", value: 75 },
        { name: "知情同意", value: 70 },
        { name: "医患沟通", value: 82 },
      ],
      line: [
        { month: "08", value: 70 },
        { month: "09", value: 75 },
        { month: "10", value: 82 },
        { month: "11", value: 87 },
      ],
    },
    changes: ["增加了罕见病诊断测试集", "完善了医疗伦理评估框架", "添加了医患沟通效果评估"],
    updatedAt: "18:45, 12/02/2025",
    updatedBy: {
      id: 4,
      name: "Sarah",
      avatar: null,
    },
  },
  {
    id: 3,
    title: "智能座舱语音交互系统在极端天气条件下的安全性与决策能力评估",
    author: {
      id: 5,
      name: "David",
      avatar: null,
    },
    source: "交通安全研究院",
    tags: ["智能座舱", "安全", "极端天气"],
    summary:
      "本评估针对xxx座舱系统在暴雨、大雾、暴雪等极端天气条件下的表现进行了问答测试。结果显示，所有系统在标准天气条件下表现良好，但在能见度低于50米的环境中，决策准确率显著下降，存在安全隐患。建议加强传感器融合和极端天气适应性训练。",
    credibility: 94.0,
    credibilityChange: "+3.5%",
    score: 9.4,
    scoreChange: "+1.8%",
    chartData: {
      radar: [
        { name: "标准天气", value: 95 },
        { name: "暴雨条件", value: 78 },
        { name: "大雾条件", value: 65 },
        { name: "暴雪条件", value: 62 },
        { name: "夜间行驶", value: 85 },
        { name: "紧急制动", value: 90 },
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 94 },
      ],
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true,
    },
    changes: ["扩展了极端天气测试场景", "优化了传感器数据分析方法", "增加了紧急制动测试项目"],
    updatedAt: "09:15, 12/03/2025",
    updatedBy: {
      id: 6,
      name: "Alex",
      avatar: null,
    },
  },
]

// 当前用户数据
export const currentUser = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "测评员-1",
  email: "tester-1yahoo.com",
  avatar: null,
  workspace: "default",
  vip: false,
  phone: "13800138000",
  role: "user",
  preferences: {},
  last_login: { seconds: "1714377600" },
  created_at: { seconds: "1704067200" },
  updated_at: { seconds: "1714377600" }
}

// 新增测试账号（带 workspace）
export const testUser = {
  id: "2",
  name: "探索用户",
  email: "test@explore.com",
  password: "Test@123456", // 仅 mock 用，实际不会下发
  avatar: null,
  workspace: {
    name: "Baidudu"
  },
  vip: false,
  phone: "",
  role: "user",
  preferences: {},
  last_login: { seconds: "1714377600" },
  created_at: { seconds: "1704067200" },
  updated_at: { seconds: "1714377600" }
}

// 任务数据 - 更新为每个任务都有不同的数据
export const tasksData = [
  {
    id: 101,
    title: "开发儿童AI玩具安全评估框架",
    author: {
      id: 1,
      name: "测评员-1",
      avatar: null,
    },
    source: "Alibaba",
    tags: ["儿童安全", "AI玩具", "评估框架"],
    description:
      "建立一套针对3-12岁儿童AI玩具的安全评估框架，包括隐私保护、内容安全、物理安全和交互设计四个维度的评估标准和测试方法。",
    status: "running",
    credibility: 95.0,
    credibilityChange: "+2.5%",
    score: 9.5,
    scoreChange: "+0.8%",
    chartData: {
      radar: [
        { name: "隐私保护", value: 85 },
        { name: "内容安全", value: 90 },
        { name: "物理安全", value: 95 },
        { name: "交互设计", value: 80 },
        { name: "数据处理", value: 75 },
        { name: "合规性", value: 92 },
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 95 },
      ],
    },
    permission: "workspace",
    type: "team",
    updatedAt: "20:15, 11/30/2025",
    updatedBy: {
      id: 1,
      name: "Mike",
      avatar: null,
    },
  },
  {
    id: 102,
    title: "医疗AI系统伦理评估工具开发",
    author: {
      id: 3,
      name: "测评员-2",
      avatar: null,
    },
    source: "医疗AI研究中心",
    tags: ["医疗AI", "伦理", "评估工具"],
    description:
      "开发一套针对医疗AI系统的伦理评估工具，重点关注患者隐私保护、知情同意、诊断透明度和医患关系等伦理问题，为医疗AI系统的伦理审查提供标准化工具。",
    status: "pending",
    credibility: 85.0,
    credibilityChange: "+3.5%",
    score: 8.5,
    scoreChange: "+1.5%",
    chartData: {
      radar: [
        { name: "隐私保护", value: 80 },
        { name: "知情同意", value: 75 },
        { name: "诊断透明", value: 85 },
        { name: "医患关系", value: 90 },
        { name: "数据安全", value: 82 },
        { name: "算法公平", value: 78 },
      ],
      line: [
        { month: "08", value: 65 },
        { month: "09", value: 72 },
        { month: "10", value: 78 },
        { month: "11", value: 85 },
      ],
    },
    permission: "person",
    type: "my",
    updatedAt: "18:45, 12/01/2025",
    updatedBy: {
      id: 3,
      name: "测评员-2",
      avatar: null,
    },
  },
  {
    id: 103,
    title: "自动驾驶AI系统安全评估标准研究",
    author: {
      id: 5,
      name: "David",
      avatar: null,
    },
    source: "交通安全研究院",
    tags: ["自动驾驶", "安全标准", "AI评估"],
    description:
      "研究制定自动驾驶AI系统的安全评估标准，包括感知能力、决策逻辑、极端情况处理和系统鲁棒性等方面，为自动驾驶技术的安全监管提供科学依据。",
    status: "completed",
    credibility: 92.0,
    credibilityChange: "+4.0%",
    score: 9.2,
    scoreChange: "+1.2%",
    chartData: {
      radar: [
        { name: "感知能力", value: 88 },
        { name: "决策逻辑", value: 92 },
        { name: "极端处理", value: 85 },
        { name: "系统鲁棒", value: 90 },
        { name: "安全冗余", value: 95 },
        { name: "人机交互", value: 87 },
      ],
      line: [
        { month: "08", value: 75 },
        { month: "09", value: 82 },
        { month: "10", value: 88 },
        { month: "11", value: 92 },
      ],
    },
    permission: "workspace",
    type: "team",
    updatedAt: "09:30, 12/02/2025",
    updatedBy: {
      id: 5,
      name: "David",
      avatar: null,
    },
  },
]

// 评估数据
export const evaluationsData = [
  {
    id: "752",
    taskId: 101,
    createdAt: "2023-06-15 14:30",
    progress: 100,
    models: [
      {
        name: "GPT-4评估模型",
        trustworthiness: 92,
        description:
          "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流畅，响应速度快。建议改进的方面包括：增加更多教育内容、优化电池续航能力。总体评分：9.2/10",
        strengths: ["语音识别准确", "安全性高", "交互体验好"],
        weaknesses: ["教育内容有限", "电池续航一般"],
      },
      {
        name: "Claude评估模型",
        trustworthiness: 87,
        description:
          "这款AI玩具的语音交互系统反应灵敏，能够理解大部分儿童指令。安全材料使用符合标准，但某些边缘部分可能需要进一步圆润处理。教育内容丰富多样，适合目标年龄段儿童。建议改进：增强防水性能，优化充电接口设计。总体评分：8.7/10",
        strengths: ["语音交互灵敏", "教育内容丰富", "目标人群匹配度高"],
        weaknesses: ["边缘安全性需改进", "防水性能不足"],
      },
    ],
    optimizationHistory: [
      {
        id: 1,
        description: "添加了产品的详细材质信息和安全认证文档",
        result: "GPT-4评估模型置信度从88%提升至92%",
      },
      {
        id: 2,
        description: "补充了产品的用户测试反馈和使用场景说明",
        result: "Claude评估模型置信度从82%提升至87%",
      },
    ],
  },
  {
    id: "753",
    taskId: 102,
    createdAt: "2023-06-16 10:45",
    progress: 100,
    models: [
      {
        name: "GPT-4评估模型",
        trustworthiness: 88,
        description:
          "该AI玩具在语音识别方面表现良好，能够识别大部分儿童的语音指令。安全性设计基本符合标准，但有少量小零件可能存在脱落风险。交互体验较流畅，响应速度适中。建议改进的方面包括：增强安全性设计、优化语音识别准确度。总体评分：8.8/10",
        strengths: ["语音识别良好", "交互体验流畅", "教育内容丰富"],
        weaknesses: ["安全性有待提高", "响应速度不稳定"],
      },
      {
        name: "Claude评估模型",
        trustworthiness: 85,
        description:
          "这款AI玩具的语音交互系统基本可用，能够理解简单的儿童指令。安全材料使用符合基本标准，但整体设计需要改进。教育内容较为丰富，适合部分年龄段儿童。建议改进：提升安全性设计，优化语音识别系统。总体评分：8.5/10",
        strengths: ["教育内容多样", "基本功能完善", "价格合理"],
        weaknesses: ["安全性设计不足", "语音识别准确度低"],
      },
    ],
    optimizationHistory: [
      {
        id: 1,
        description: "添加了产品的安全测试报告",
        result: "GPT-4评估模型置信度从85%提升至88%",
      },
      {
        id: 2,
        description: "补充了产品的语音识别技术说明",
        result: "Claude评估模型置信度从80%提升至85%",
      },
    ],
  },
]

// 工作区数据
export const workspacesData = [
  { 
    id: "1", 
    name: "Alibaba", 
    icon: "A", 
    role: "Owner", 
    current: true,
    domain: "alibaba.syntrusthub.app",
    description: "阿里巴巴工作区",
    members: 8,
    projects: 5,
    createdAt: { seconds: "1704067200" }
  },
  { 
    id: "2", 
    name: "Tencent", 
    icon: "T", 
    role: "Member", 
    current: false,
    domain: "tencent.syntrusthub.app",
    description: "腾讯工作区",
    members: 12,
    projects: 7,
    createdAt: { seconds: "1704153600" }
  },
  { 
    id: "3", 
    name: "Baidu", 
    icon: "B", 
    role: "Admin", 
    current: false,
    domain: "baidu.syntrusthub.app",
    description: "百度工作区",
    members: 5,
    projects: 3,
    createdAt: { seconds: "1704240000" }
  },
]

// 当前工作区数据
export const currentWorkspace = {
  id: "1",
  name: "tester-1yahoo.com",
  icon: "A",
  role: "Owner",
  current: true,
  domain: "syntrusthub.agentour.app",
  members: 12,
  projects: 8,
  createdAt: { seconds: "1704067200" },
  description: "可信集团工作区",
  settings: {
    allowPublicSharing: true,
    defaultPermission: "private",
  },
}

// 任务详情数据
export const taskDetailData = {
  title: "示例任务",
  author: {
    name: "Mike",
    avatar: "M"
  },
  source: "内部项目",
  tags: ["AI", "评估", "编程"],
  description: "这是一个示例任务描述",
  chartData: {
    radar: [
      { name: "准确性", value: 85 },
      { name: "效率", value: 90 },
      { name: "质量", value: 88 },
      { name: "速度", value: 92 }
    ],
    line: [
      { month: "1月", value: 85 },
      { month: "2月", value: 88 },
      { month: "3月", value: 92 },
      { month: "4月", value: 90 }
    ]
  }
};

// 任务注释数据
export const taskAnnotationData = [
  // {
  //   key: '1',
  //   no: '1',
  //   title: '评估标准',
  //   content: 'GB xxxx 生成式人工智能评估标准v1.0',
  //   attachments: [
  //     { name: '评估标准.pdf', url: '#' },
  //     { name: '评估细则.docx', url: '#' }
  //   ],
  //   lastModifiedBy: {
  //     name: 'Mike',
  //     avatar: 'M'
  //   },
  //   modifiedTime: {
  //     hour: '13:28',
  //     date: '14/4/2025'
  //   }
  // },
  // {
  //   key: '2',
  //   no: '2',
  //   title: '评估方法',
  //   content: '基于 ISO/IEC 25010 的AI系统质量评估方法',
  //   attachments: [
  //     { name: '评估方法.pdf', url: '#' }
  //   ],
  //   lastModifiedBy: {
  //     name: 'Sarah',
  //     avatar: 'S'
  //   },
  //   modifiedTime: {
  //     hour: '15:45',
  //     date: '14/4/2025'
  //   }
  // },
  // {
  //   key: '3',
  //   no: '3',
  //   title: '测试用例',
  //   content: '包含安全性、可靠性、性能效率等维度的测试用例集',
  //   attachments: [
  //     { name: '测试用例.xlsx', url: '#' },
  //     { name: '测试数据.zip', url: '#' }
  //   ],
  //   lastModifiedBy: {
  //     name: 'David',
  //     avatar: 'D'
  //   },
  //   modifiedTime: {
  //     hour: '09:15',
  //     date: '15/4/2025'
  //   }
  // }
];

// 卡片详情数据
export const cardDetailData = {
  title: "示例卡片",
  author: {
    name: "David",
    avatar: "D"
  },
  source: "研发部门",
  tags: ["开发", "测试", "部署"],
  chartData: {
    radar: [
      { name: "性能", value: 88 },
      { name: "可靠性", value: 92 },
      { name: "安全性", value: 85 },
      { name: "可维护性", value: 90 }
    ],
    line: [
      { month: "1月", value: 82 },
      { month: "2月", value: 85 },
      { month: "3月", value: 90 },
      { month: "4月", value: 88 }
    ]
  }
};

// 模型评估数据
export const modelEvaluationData = {
  // "claude": {
  //   name: "Claude 3.5 Sonnet",
  //   tags: ["Programming", "Programming"],
  //   description:
  //     "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
  //   score: 10.0,
  //   scoreChange: "-1.5%",
  //   credibility: 100.0,
  //   credibilityChange: "+1.5%",
  //   updatedAt: "21:32, 12/01/2025",
  //   updatedBy: "Mike",
  //   strengths: ["语音识别准确", "安全性高", "交互体验好"],
  //   weaknesses: ["语音识别准确", "安全性高", "交互体验好"],
  // },
  // "claude3.5": {
  //   name: "Claude 3.5",
  //   tags: ["Programming", "Programming"],
  //   description:
  //     "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
  //   score: 10.0,
  //   scoreChange: "-1.5%",
  //   credibility: 100.0,
  //   credibilityChange: "+1.5%",
  //   updatedAt: "21:32, 12/01/2025",
  //   updatedBy: "Mike",
  //   strengths: ["语音识别准确", "安全性高", "交互体验好"],
  //   weaknesses: ["语音识别准确", "安全性高", "交互体验好"],
  // },
  // "claude3.6": {
  //   name: "Claude 3.6",
  //   tags: ["Programming", "Programming"],
  //   description:
  //     "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。",
  //   score: 9.5,
  //   scoreChange: "+0.5%",
  //   credibility: 95.0,
  //   credibilityChange: "+1.0%",
  //   updatedAt: "20:15, 12/01/2025",
  //   updatedBy: "David",
  //   strengths: ["响应速度快", "准确率高", "多语言支持"],
  //   weaknesses: ["资源消耗大", "冷启动时间长"],
  // },
  // "claude3.7": {
  //   name: "Claude 3.7",
  //   tags: ["Programming", "Programming"],
  //   description:
  //     "Claude 3.7在复杂任务处理和推理方面表现出色，能够处理多步骤指令并保持上下文连贯性。在代码生成和编程辅助方面尤为突出，支持多种编程语言并能提供详细的解释。",
  //   score: 9.8,
  //   scoreChange: "+1.2%",
  //   credibility: 98.0,
  //   credibilityChange: "+2.5%",
  //   updatedAt: "19:45, 12/01/2025",
  //   updatedBy: "Emma",
  //   strengths: ["代码生成能力强", "推理深度好", "上下文理解准确"],
  //   weaknesses: ["处理速度可提升", "特定领域知识有限"],
  // },
  // "agent2": {
  //   name: "Agent 2",
  //   tags: ["Testing", "Evaluation"],
  //   description:
  //     "这款AI玩具的语音交互系统反应灵敏，能够理解大部分儿童指令。安全材料使用符合标准，但某些边缘部分可能需要进一步圆润处理。教育内容丰富多样，适合目标年龄段儿童。建议改进：增强防水性能，优化充电接口设计。",
  //   score: 8.7,
  //   scoreChange: "+0.5%",
  //   credibility: 87.0,
  //   credibilityChange: "+2.0%",
  //   updatedAt: "18:45, 12/02/2025",
  //   updatedBy: "测评员-1",
  //   strengths: ["语音交互灵敏", "教育内容丰富", "目标人群匹配度高"],
  //   weaknesses: ["边缘安全性需改进", "防水性能不足"],
  // },
  // "deepseek": {
  //   name: "DeepSeek",
  //   tags: ["AI", "Large Model"],
  //   description:
  //     "DeepSeek在此任务中展现出优秀的理解能力和分析深度。模型能够准确把握问题核心，提供详实的解决方案。特别在代码生成和技术文档理解方面表现突出。建议在边缘场景的处理上进行优化。",
  //   score: 9.2,
  //   scoreChange: "+1.8%",
  //   credibility: 92.0,
  //   credibilityChange: "+3.0%",
  //   updatedAt: "20:15, 12/02/2025",
  //   updatedBy: "Sarah",
  //   strengths: ["理解准确", "分析深入", "解决方案可行"],
  //   weaknesses: ["边缘场景处理", "响应时间优化"],
  // }
};

// 探索卡片数据 - 符合 Protocol Buffers API 规范
export const explorationCardsData = [
  {
        "id": "44444444-4444-4444-4444-444444444444",
        "name": "Python代码审查",
        "priority": 2,
        "status": "pending",
        "version": "1.0",
        "keywords": [],
        "prompt": "请审查这段Python代码并提供改进建议",
        "annotation": {
            "result": [],
            "qa": [],
            "scenario": [],
            "flow": []
        },
        "step": [
            {
                "id": "bdb0a9dc-2f1e-4c73-9fa9-070ea2d3e8bd",
                "name": "代码审查",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "代码质量评估",
                        "version": "1.0",
                        "description": "Python代码整体质量良好，但存在部分安全隐患和性能优化空间",
                        "score": 88,
                        "confidence": 0.92,
                        "consumed_points": 80,
                        "dimension": [
                            {
                                "latitude": "代码质量",
                                "weight": 0.25
                            },
                            {
                                "latitude": "安全性",
                                "weight": 0.25
                            },
                            {
                                "latitude": "性能",
                                "weight": 0.25
                            },
                            {
                                "latitude": "可维护性",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "Claude 3"
            },
            {
                "id": "b0186a04-9ae8-4442-aca9-084c5b016224",
                "name": "单元测试",
                "status": "pending",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "单元测试评估准备",
                        "version": "1.0",
                        "description": "已准备好单元测试框架和测试用例，等待执行测试并收集覆盖率数据",
                        "score": 0,
                        "confidence": 0.85,
                        "consumed_points": 45,
                        "dimension": [
                            {
                                "latitude": "测试覆盖率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "测试质量",
                                "weight": 0.3
                            },
                            {
                                "latitude": "边界情况处理",
                                "weight": 0.2
                            },
                            {
                                "latitude": "文档完整性",
                                "weight": 0.2
                            }
                        ]
                    },
                    {
                        "reason": "单元测试首轮执行",
                        "version": "1.1",
                        "description": "首轮测试执行中，已完成基本功能测试，覆盖率达到65%",
                        "score": 65,
                        "confidence": 0.88,
                        "consumed_points": 65,
                        "dimension": [
                            {
                                "latitude": "测试覆盖率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "测试质量",
                                "weight": 0.3
                            },
                            {
                                "latitude": "边界情况处理",
                                "weight": 0.2
                            },
                            {
                                "latitude": "文档完整性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Llama 3"
            },
            {
                "id": "b62c9947-035e-46b1-badf-b265109fd31a",
                "name": "语法检查",
                "status": "running",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "语法检查初始评估",
                        "version": "1.0",
                        "description": "开始进行Python代码语法检查，使用pylint静态分析工具",
                        "score": 0,
                        "confidence": 0.75,
                        "consumed_points": 15,
                        "dimension": [
                            {
                                "latitude": "语法规范",
                                "weight": 0.5
                            },
                            {
                                "latitude": "代码风格",
                                "weight": 0.5
                            }
                        ]
                    },
                    {
                        "reason": "语法检查进行中",
                        "version": "1.1",
                        "description": "pylint静态分析进行中，已完成50%的代码检查，发现3处潜在问题",
                        "score": 72.5,
                        "confidence": 0.82,
                        "consumed_points": 35,
                        "dimension": [
                            {
                                "latitude": "语法规范",
                                "weight": 0.5
                            },
                            {
                                "latitude": "代码风格",
                                "weight": 0.5
                            }
                        ]
                    }
                ],
                "agent": "GPT-4"
            }
        ],
        "scenarios": [
            {
                "id": "12ff503a-0998-4f38-b027-4587b17a09ab",
                "name": "通用AI评估场景",
                "description": "评估通用AI的可靠性和伦理问题",
                "dimensions": [
                    {
                        "id": "d3000036-0036-0036-0036-000000000036",
                        "name": "隐私保护",
                        "description": "AI系统的隐私保护",
                        "weight": 0
                    },
                    {
                        "id": "d3000035-0035-0035-0035-000000000035",
                        "name": "伦理问题",
                        "description": "AI系统的伦理问题",
                        "weight": 0
                    },
                    {
                        "id": "d3000034-0034-0034-0034-000000000034",
                        "name": "可控性",
                        "description": "AI系统的可控性",
                        "weight": 0
                    },
                    {
                        "id": "d3000033-0033-0033-0033-000000000033",
                        "name": "透明度",
                        "description": "AI系统的透明度",
                        "weight": 0
                    },
                    {
                        "id": "d3000030-0030-0030-0030-000000000030",
                        "name": "技术能力",
                        "description": "AI系统的技术能力评估",
                        "weight": 0
                    },
                    {
                        "id": "d3000032-0032-0032-0032-000000000032",
                        "name": "可靠性",
                        "description": "AI系统的可靠性",
                        "weight": 0
                    },
                    {
                        "id": "d3000031-0031-0031-0031-000000000031",
                        "name": "社会责任",
                        "description": "AI系统的社会责任评估",
                        "weight": 0
                    },
                    {
                        "id": "d3000037-0037-0037-0037-000000000037",
                        "name": "公平性",
                        "description": "AI系统的公平性",
                        "weight": 0
                    },
                    {
                        "id": "d3000029-0029-0029-0029-000000000029",
                        "name": "通用AI评估场景",
                        "description": "评估通用AI的可靠性和伦理问题",
                        "weight": 0
                    }
                ]
            }
        ],
        "created_by": "Admin User",
        "like_count": 0,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "对Python代码进行安全性和性能审查"
    },
    {
        "id": "55555555-5555-5555-5555-555555555555",
        "name": "AI玩具安全性评估：儿童语音交互系统的隐私保护与内容安全",
        "annotation": {
            "result": [],
            "qa": [],
            "scenario": [],
            "flow": []
        },
        "priority": 1,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "本评估针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析，重点关注隐私保护、内容过滤和数据安全。评估发现该产品在语音识别准确性和响应速度方面表现优秀，但在数据存储加密和家长控制功能方面存在不足。",
        "step": [
            {
                "id": "478c3dd8-4b03-43f5-8deb-b5b76d096a01",
                "name": "语音识别功能测试",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "语音识别功能测试完成，准确率达到预期标准",
                        "version": "1.0",
                        "description": "对儿童语音识别功能进行了全面测试，包括不同年龄段、口音和环境噪音下的识别能力",
                        "score": 94,
                        "confidence": 0.92,
                        "consumed_points": 80,
                        "dimension": [
                            {
                                "latitude": "识别准确率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "响应速度",
                                "weight": 0.25
                            },
                            {
                                "latitude": "环境适应性",
                                "weight": 0.25
                            },
                            {
                                "latitude": "年龄适应性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "GPT-4"
            },
            {
                "id": "25aecbf7-7db2-4509-bc4d-f4f8e5b0ada0",
                "name": "隐私保护检查",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "隐私保护机制符合COPPA标准，但数据存储时长需要调整",
                        "version": "1.0",
                        "description": "检查了数据收集、存储、传输和删除的全流程隐私保护措施",
                        "score": 87,
                        "confidence": 0.88,
                        "consumed_points": 95,
                        "dimension": [
                            {
                                "latitude": "数据加密",
                                "weight": 0.25
                            },
                            {
                                "latitude": "数据最小化",
                                "weight": 0.25
                            },
                            {
                                "latitude": "存储安全",
                                "weight": 0.25
                            },
                            {
                                "latitude": "传输安全",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "Claude 3"
            },
            {
                "id": "b25ebbeb-fe5e-45ca-82ce-cb2679580d3a",
                "name": "AI玩具综合评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "综合评估结果良好，但在隐私保护和家长控制方面需要改进",
                        "version": "1.0",
                        "description": "基于前序步骤的测试结果，进行综合评估和风险分析",
                        "score": 92,
                        "confidence": 0.88,
                        "consumed_points": 100,
                        "dimension": [
                            {
                                "latitude": "语音识别",
                                "weight": 0.2
                            },
                            {
                                "latitude": "内容安全",
                                "weight": 0.2
                            },
                            {
                                "latitude": "隐私保护",
                                "weight": 0.2
                            },
                            {
                                "latitude": "数据加密",
                                "weight": 0.2
                            },
                            {
                                "latitude": "系统稳定",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Gemini Pro"
            }
        ],
        "scenarios": [
            {
                "id": "e8b8584d-9dc0-4283-931e-c2427e743abe",
                "name": "AI玩具安全评估场景",
                "description": "针对儿童AI玩具的安全性和隐私保护评估",
                "dimensions": [
                    {
                        "id": "d1000009-0009-0009-0009-000000000009",
                        "name": "AI玩具安全评估场景",
                        "description": "针对儿童AI玩具的安全性和隐私保护评估",
                        "weight": 0
                    },
                    {
                        "id": "d1000016-0016-0016-0016-000000000016",
                        "name": "系统稳定",
                        "description": "系统稳定性和可靠性",
                        "weight": 0
                    },
                    {
                        "id": "d1000015-0015-0015-0015-000000000015",
                        "name": "数据加密",
                        "description": "数据传输和存储加密",
                        "weight": 0
                    },
                    {
                        "id": "d1000014-0014-0014-0014-000000000014",
                        "name": "家长控制",
                        "description": "家长监控和限制功能",
                        "weight": 0
                    },
                    {
                        "id": "d1000013-0013-0013-0013-000000000013",
                        "name": "隐私保护",
                        "description": "个人数据保护措施",
                        "weight": 0
                    },
                    {
                        "id": "d1000012-0012-0012-0012-000000000012",
                        "name": "内容安全",
                        "description": "内容过滤和儿童保护",
                        "weight": 0
                    },
                    {
                        "id": "d1000011-0011-0011-0011-000000000011",
                        "name": "语音识别",
                        "description": "语音识别准确性和稳定性",
                        "weight": 0
                    },
                    {
                        "id": "d1000010-0010-0010-0010-000000000010",
                        "name": "安全性评估",
                        "description": "AI玩具整体安全性评估",
                        "weight": 0
                    }
                ]
            }
        ],
        "created_by": "Test User 1",
        "like_count": 15,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析"
    },
    {
        "id": "66666666-6666-6666-6666-666666666666",
        "name": "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
        "step": [
            {
                "id": "ae6b44a7-1a71-4abf-aa62-582eeeaa21db",
                "name": "医疗AI模型综合评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "医疗AI模型在诊断准确性方面表现优秀，但在罕见病识别方面仍有不足",
                        "version": "1.0",
                        "description": "基于前序评估结果，综合分析医疗AI模型的整体表现和改进建议",
                        "score": 85,
                        "confidence": 0.87,
                        "consumed_points": 120,
                        "dimension": [
                            {
                                "latitude": "医患沟通",
                                "weight": 0.2
                            },
                            {
                                "latitude": "诊断准确",
                                "weight": 0.2
                            },
                            {
                                "latitude": "紧急处理",
                                "weight": 0.2
                            },
                            {
                                "latitude": "隐私保护",
                                "weight": 0.2
                            },
                            {
                                "latitude": "知情同意",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Qwen 2"
            },
            {
                "id": "9cbcfc86-f94a-4793-b6fa-8bf44f133278",
                "name": "医疗伦理合规性检查",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "基本符合医疗伦理要求，但知情同意流程需要改进",
                        "version": "1.0",
                        "description": "检查AI系统在医疗伦理、知情同意和隐私保护方面的合规性",
                        "score": 78,
                        "confidence": 0.82,
                        "consumed_points": 90,
                        "dimension": [
                            {
                                "latitude": "知情同意",
                                "weight": 0.3
                            },
                            {
                                "latitude": "隐私保护",
                                "weight": 0.3
                            },
                            {
                                "latitude": "责任归属",
                                "weight": 0.2
                            },
                            {
                                "latitude": "透明度",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Llama 3"
            },
            {
                "id": "1296e80b-f3d6-4718-99dd-4ece214dc2bb",
                "name": "诊断准确性评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "在常见疾病诊断方面表现优秀，准确率达到95%",
                        "version": "1.0",
                        "description": "使用1000个常见疾病案例测试AI模型的诊断准确性",
                        "score": 95,
                        "confidence": 0.94,
                        "consumed_points": 120,
                        "dimension": [
                            {
                                "latitude": "诊断准确率",
                                "weight": 0.4
                            },
                            {
                                "latitude": "假阳性率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "假阴性率",
                                "weight": 0.3
                            }
                        ]
                    }
                ],
                "agent": "DeepSeek"
            }
        ],
        "scenarios": [
            {
                "id": "6320e454-d2d6-4cfb-869b-3b6b92e0dbad",
                "name": "医疗AI评估场景",
                "description": "评估医疗辅助AI的可靠性与伦理问题",
                "dimensions": [
                    {
                        "id": "d2000024-0024-0024-0024-000000000024",
                        "name": "紧急处理",
                        "description": "紧急情况处理能力",
                        "weight": 0
                    },
                    {
                        "id": "d2000019-0019-0019-0019-000000000019",
                        "name": "医疗AI评估场景",
                        "description": "评估医疗辅助AI的可靠性与伦理问题",
                        "weight": 0
                    },
                    {
                        "id": "d2000020-0020-0020-0020-000000000020",
                        "name": "诊断能力",
                        "description": "AI医疗诊断的整体能力评估",
                        "weight": 0
                    },
                    {
                        "id": "d2000021-0021-0021-0021-000000000021",
                        "name": "伦理合规",
                        "description": "医疗AI的伦理和合规性评估",
                        "weight": 0
                    },
                    {
                        "id": "d2000022-0022-0022-0022-000000000022",
                        "name": "诊断准确",
                        "description": "诊断的准确性",
                        "weight": 0
                    },
                    {
                        "id": "d2000023-0023-0023-0023-000000000023",
                        "name": "罕见病识别",
                        "description": "识别罕见疾病的能力",
                        "weight": 0
                    },
                    {
                        "id": "d2000025-0025-0025-0025-000000000025",
                        "name": "隐私保护",
                        "description": "病人隐私保护",
                        "weight": 0
                    },
                    {
                        "id": "d2000026-0026-0026-0026-000000000026",
                        "name": "知情同意",
                        "description": "获取知情同意的机制",
                        "weight": 0
                    },
                    {
                        "id": "d2000027-0027-0027-0027-000000000027",
                        "name": "医患沟通",
                        "description": "医患沟通效果",
                        "weight": 0
                    }
                ]
            }
        ],
        "created_by": "Test User 2",
        "like_count": 27,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "评估大型语言模型在医疗诊断辅助领域的应用"
    },
    {
        "id": "23232323-2323-2323-2323-232323232323",
        "name": "ChatGPT在文学创作中的应用与伦理边界探索",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "52d68da9-d2d4-4d39-a4d1-6a38ea2e5a29",
                "name": "文学创作AI分析",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "文学创作AI模型评估",
                        "version": "1.0",
                        "description": "GPT在文学创作中表现出较强的语言流畅性，但在情感深度和创新性上仍有不足",
                        "score": 83,
                        "confidence": 0.9,
                        "consumed_points": 95,
                        "dimension": [
                            {
                                "latitude": "语言流畅性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "情感表达",
                                "weight": 0.2
                            },
                            {
                                "latitude": "故事结构",
                                "weight": 0.2
                            },
                            {
                                "latitude": "创新性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "文体多样性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Qwen 2"
            }
        ],
        "scenarios": [
            {
                "id": "38cceba5-5b97-4c17-b7d8-7b2bd335a9dc",
                "name": "文学创作AI评估场景",
                "description": "评估AI在文学创作领域的应用和伦理边界",
                "dimensions": []
            }
        ],
        "created_by": "Test User 2",
        "like_count": 42,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "探索AI大语言模型在小说、诗歌等文学创作中的应用潜力与伦理限制"
    },
    {
        "id": "34343434-3434-3434-3434-343434343434",
        "name": "多模态AI在辅助教育中的效果评测",
        "priority": 1,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "31657748-1e5f-4af3-86ec-5b60554cf049",
                "name": "多模态教育AI评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "教育AI评估",
                        "version": "1.0",
                        "description": "多模态AI在教育场景中表现良好，图像识别准确率达到92%，语义理解能力适合K12教育场景",
                        "score": 89,
                        "confidence": 0.92,
                        "consumed_points": 110,
                        "dimension": [
                            {
                                "latitude": "图像识别",
                                "weight": 0.2
                            },
                            {
                                "latitude": "语义理解",
                                "weight": 0.2
                            },
                            {
                                "latitude": "知识准确性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "互动性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "适应性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Gemini Pro"
            }
        ],
        "scenarios": [
            {
                "id": "265c1437-2495-47e2-9f78-75dc3ab42973",
                "name": "教育辅助AI评估场景",
                "description": "评估多模态AI在教育领域的应用效果",
                "dimensions": []
            }
        ],
        "created_by": "Test User 1",
        "like_count": 35,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "评估结合图像识别与自然语言处理的AI系统在K12教育中的应用效果"
    },
    {
        "id": "45454545-4545-4545-4545-454545454545",
        "name": "AI驱动的代码自动化测试框架评估",
        "priority": 3,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "dff37baf-00a2-49e8-9b22-8acca77b1c30",
                "name": "代码自动化测试框架评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "自动化测试框架评估",
                        "version": "1.0",
                        "description": "自动化测试框架测试覆盖率达到83%，能有效识别常见代码错误",
                        "score": 83,
                        "confidence": 0.85,
                        "consumed_points": 90,
                        "dimension": [
                            {
                                "latitude": "测试覆盖率",
                                "weight": 0.25
                            },
                            {
                                "latitude": "错误检测",
                                "weight": 0.25
                            },
                            {
                                "latitude": "执行效率",
                                "weight": 0.25
                            },
                            {
                                "latitude": "易用性",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "DeepSeek"
            }
        ],
        "scenarios": [
            {
                "id": "79969959-86cd-49d9-bac5-219c1a0f23bf",
                "name": "代码测试自动化评估场景",
                "description": "评估AI在代码测试自动化中的应用",
                "dimensions": []
            }
        ],
        "created_by": "Test User 2",
        "like_count": 19,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "评估基于大语言模型的自动化测试框架在软件开发中的应用效果"
    },
    {
        "id": "56565656-5656-5656-5656-565656565656",
        "name": "大语言模型幻觉现象的系统性研究",
        "priority": 1,
        "status": "reviewing",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "dcb7fdb6-a0d2-4a60-9ac0-705a54357d66",
                "name": "幻觉现象综合研究",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "幻觉现象分析完成",
                        "version": "1.0",
                        "description": "已完成350组幻觉现象案例收集和分析，提出了有效的减缓策略",
                        "score": 88,
                        "confidence": 0.91,
                        "consumed_points": 180,
                        "dimension": [
                            {
                                "latitude": "数据收集",
                                "weight": 0.2
                            },
                            {
                                "latitude": "分类准确性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "案例分析",
                                "weight": 0.2
                            },
                            {
                                "latitude": "策略有效性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "实施可行性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "GPT-4"
            }
        ],
        "scenarios": [
            {
                "id": "3ff4ad72-5100-45a1-b362-ebc88fa3857a",
                "name": "LLM幻觉评估场景",
                "description": "评估和研究大语言模型的幻觉现象",
                "dimensions": []
            }
        ],
        "created_by": "Admin User",
        "like_count": 56,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "针对LLM幻觉现象进行系统性研究，建立幻觉评估标准和减缓策略"
    },
    {
        "id": "67676767-6767-6767-6767-676767676767",
        "name": "AI生成内容版权问题研究",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "17daa3f2-5743-4425-8a84-73161f22e98e",
                "name": "AI生成内容版权分析",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "AI内容版权研究",
                        "version": "1.0",
                        "description": "完成了对7个国家/地区AI生成内容版权法规的分析，识别了关键法律差异",
                        "score": 87,
                        "confidence": 0.88,
                        "consumed_points": 125,
                        "dimension": [
                            {
                                "latitude": "法规覆盖",
                                "weight": 0.25
                            },
                            {
                                "latitude": "分析深度",
                                "weight": 0.25
                            },
                            {
                                "latitude": "差异识别",
                                "weight": 0.25
                            },
                            {
                                "latitude": "实用性",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "Claude 3"
            }
        ],
        "scenarios": [
            {
                "id": "729ba006-6b01-442a-b899-83a01665ab47",
                "name": "AI生成内容版权评估场景",
                "description": "探讨AI生成内容的版权归属和保护问题",
                "dimensions": []
            }
        ],
        "created_by": "Test User 2",
        "like_count": 31,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "探索AI生成的内容在知识产权法律框架下的归属和保护问题"
    }

];

// 任务卡片数据 - 符合 Protocol Buffers API 规范
export const taskCardsData = [
  {
        "id": "44444444-4444-4444-4444-444444444444",
        "name": "Python代码审查",
        "priority": 2,
        "status": "pending",
        "version": "1.0",
        "keywords": [],
        "prompt": "请审查这段Python代码并提供改进建议",
        "step": [
            {
                "id": "bdb0a9dc-2f1e-4c73-9fa9-070ea2d3e8bd",
                "name": "代码审查",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "代码质量评估",
                        "version": "1.0",
                        "description": "Python代码整体质量良好，但存在部分安全隐患和性能优化空间",
                        "score": 88,
                        "confidence": 0.92,
                        "consumed_points": 80,
                        "dimension": [
                            {
                                "latitude": "代码质量",
                                "weight": 0.25
                            },
                            {
                                "latitude": "安全性",
                                "weight": 0.25
                            },
                            {
                                "latitude": "性能",
                                "weight": 0.25
                            },
                            {
                                "latitude": "可维护性",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "Claude 3"
            },
            {
                "id": "b0186a04-9ae8-4442-aca9-084c5b016224",
                "name": "单元测试",
                "status": "pending",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "单元测试评估准备",
                        "version": "1.0",
                        "description": "已准备好单元测试框架和测试用例，等待执行测试并收集覆盖率数据",
                        "score": 0,
                        "confidence": 0.85,
                        "consumed_points": 45,
                        "dimension": [
                            {
                                "latitude": "测试覆盖率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "测试质量",
                                "weight": 0.3
                            },
                            {
                                "latitude": "边界情况处理",
                                "weight": 0.2
                            },
                            {
                                "latitude": "文档完整性",
                                "weight": 0.2
                            }
                        ]
                    },
                    {
                        "reason": "单元测试首轮执行",
                        "version": "1.1",
                        "description": "首轮测试执行中，已完成基本功能测试，覆盖率达到65%",
                        "score": 65,
                        "confidence": 0.88,
                        "consumed_points": 65,
                        "dimension": [
                            {
                                "latitude": "测试覆盖率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "测试质量",
                                "weight": 0.3
                            },
                            {
                                "latitude": "边界情况处理",
                                "weight": 0.2
                            },
                            {
                                "latitude": "文档完整性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Llama 3"
            },
            {
                "id": "b62c9947-035e-46b1-badf-b265109fd31a",
                "name": "语法检查",
                "status": "running",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "语法检查初始评估",
                        "version": "1.0",
                        "description": "开始进行Python代码语法检查，使用pylint静态分析工具",
                        "score": 0,
                        "confidence": 0.75,
                        "consumed_points": 15,
                        "dimension": [
                            {
                                "latitude": "语法规范",
                                "weight": 0.5
                            },
                            {
                                "latitude": "代码风格",
                                "weight": 0.5
                            }
                        ]
                    },
                    {
                        "reason": "语法检查进行中",
                        "version": "1.1",
                        "description": "pylint静态分析进行中，已完成50%的代码检查，发现3处潜在问题",
                        "score": 72.5,
                        "confidence": 0.82,
                        "consumed_points": 35,
                        "dimension": [
                            {
                                "latitude": "语法规范",
                                "weight": 0.5
                            },
                            {
                                "latitude": "代码风格",
                                "weight": 0.5
                            }
                        ]
                    }
                ],
                "agent": "GPT-4"
            }
        ],
        "scenarios": [
            {
                "id": "12ff503a-0998-4f38-b027-4587b17a09ab",
                "name": "通用AI评估场景",
                "description": "评估通用AI的可靠性和伦理问题",
                "dimensions": [
                    {
                        "id": "d3000036-0036-0036-0036-000000000036",
                        "name": "隐私保护",
                        "description": "AI系统的隐私保护",
                        "weight": 0
                    },
                    {
                        "id": "d3000035-0035-0035-0035-000000000035",
                        "name": "伦理问题",
                        "description": "AI系统的伦理问题",
                        "weight": 0
                    },
                    {
                        "id": "d3000034-0034-0034-0034-000000000034",
                        "name": "可控性",
                        "description": "AI系统的可控性",
                        "weight": 0
                    },
                    {
                        "id": "d3000033-0033-0033-0033-000000000033",
                        "name": "透明度",
                        "description": "AI系统的透明度",
                        "weight": 0
                    },
                    {
                        "id": "d3000030-0030-0030-0030-000000000030",
                        "name": "技术能力",
                        "description": "AI系统的技术能力评估",
                        "weight": 0
                    },
                    {
                        "id": "d3000032-0032-0032-0032-000000000032",
                        "name": "可靠性",
                        "description": "AI系统的可靠性",
                        "weight": 0
                    },
                    {
                        "id": "d3000031-0031-0031-0031-000000000031",
                        "name": "社会责任",
                        "description": "AI系统的社会责任评估",
                        "weight": 0
                    },
                    {
                        "id": "d3000037-0037-0037-0037-000000000037",
                        "name": "公平性",
                        "description": "AI系统的公平性",
                        "weight": 0
                    },
                    {
                        "id": "d3000029-0029-0029-0029-000000000029",
                        "name": "通用AI评估场景",
                        "description": "评估通用AI的可靠性和伦理问题",
                        "weight": 0
                    }
                ]
            }
        ],
        "created_by": "Admin User",
        "like_count": 0,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "对Python代码进行安全性和性能审查"
    },
    {
        "id": "55555555-5555-5555-5555-555555555555",
        "name": "AI玩具安全性评估：儿童语音交互系统的隐私保护与内容安全",
        "priority": 1,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "本评估针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析，重点关注隐私保护、内容过滤和数据安全。评估发现该产品在语音识别准确性和响应速度方面表现优秀，但在数据存储加密和家长控制功能方面存在不足。",
        "step": [
            {
                "id": "478c3dd8-4b03-43f5-8deb-b5b76d096a01",
                "name": "语音识别功能测试",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "语音识别功能测试完成，准确率达到预期标准",
                        "version": "1.0",
                        "description": "对儿童语音识别功能进行了全面测试，包括不同年龄段、口音和环境噪音下的识别能力",
                        "score": 94,
                        "confidence": 0.92,
                        "consumed_points": 80,
                        "dimension": [
                            {
                                "latitude": "识别准确率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "响应速度",
                                "weight": 0.25
                            },
                            {
                                "latitude": "环境适应性",
                                "weight": 0.25
                            },
                            {
                                "latitude": "年龄适应性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "GPT-4"
            },
            {
                "id": "25aecbf7-7db2-4509-bc4d-f4f8e5b0ada0",
                "name": "隐私保护检查",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "隐私保护机制符合COPPA标准，但数据存储时长需要调整",
                        "version": "1.0",
                        "description": "检查了数据收集、存储、传输和删除的全流程隐私保护措施",
                        "score": 87,
                        "confidence": 0.88,
                        "consumed_points": 95,
                        "dimension": [
                            {
                                "latitude": "数据加密",
                                "weight": 0.25
                            },
                            {
                                "latitude": "数据最小化",
                                "weight": 0.25
                            },
                            {
                                "latitude": "存储安全",
                                "weight": 0.25
                            },
                            {
                                "latitude": "传输安全",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "Claude 3"
            },
            {
                "id": "b25ebbeb-fe5e-45ca-82ce-cb2679580d3a",
                "name": "AI玩具综合评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "综合评估结果良好，但在隐私保护和家长控制方面需要改进",
                        "version": "1.0",
                        "description": "基于前序步骤的测试结果，进行综合评估和风险分析",
                        "score": 92,
                        "confidence": 0.88,
                        "consumed_points": 100,
                        "dimension": [
                            {
                                "latitude": "语音识别",
                                "weight": 0.2
                            },
                            {
                                "latitude": "内容安全",
                                "weight": 0.2
                            },
                            {
                                "latitude": "隐私保护",
                                "weight": 0.2
                            },
                            {
                                "latitude": "数据加密",
                                "weight": 0.2
                            },
                            {
                                "latitude": "系统稳定",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Gemini Pro"
            }
        ],
        "scenarios": [
            {
                "id": "e8b8584d-9dc0-4283-931e-c2427e743abe",
                "name": "AI玩具安全评估场景",
                "description": "针对儿童AI玩具的安全性和隐私保护评估",
                "dimensions": [
                    {
                        "id": "d1000009-0009-0009-0009-000000000009",
                        "name": "AI玩具安全评估场景",
                        "description": "针对儿童AI玩具的安全性和隐私保护评估",
                        "weight": 0
                    },
                    {
                        "id": "d1000016-0016-0016-0016-000000000016",
                        "name": "系统稳定",
                        "description": "系统稳定性和可靠性",
                        "weight": 0
                    },
                    {
                        "id": "d1000015-0015-0015-0015-000000000015",
                        "name": "数据加密",
                        "description": "数据传输和存储加密",
                        "weight": 0
                    },
                    {
                        "id": "d1000014-0014-0014-0014-000000000014",
                        "name": "家长控制",
                        "description": "家长监控和限制功能",
                        "weight": 0
                    },
                    {
                        "id": "d1000013-0013-0013-0013-000000000013",
                        "name": "隐私保护",
                        "description": "个人数据保护措施",
                        "weight": 0
                    },
                    {
                        "id": "d1000012-0012-0012-0012-000000000012",
                        "name": "内容安全",
                        "description": "内容过滤和儿童保护",
                        "weight": 0
                    },
                    {
                        "id": "d1000011-0011-0011-0011-000000000011",
                        "name": "语音识别",
                        "description": "语音识别准确性和稳定性",
                        "weight": 0
                    },
                    {
                        "id": "d1000010-0010-0010-0010-000000000010",
                        "name": "安全性评估",
                        "description": "AI玩具整体安全性评估",
                        "weight": 0
                    }
                ]
            }
        ],
        "created_by": "Test User 1",
        "like_count": 15,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "针对面向3-8岁儿童的AI语音交互玩具进行全面安全性分析"
    },
    {
        "id": "66666666-6666-6666-6666-666666666666",
        "name": "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
        "step": [
            {
                "id": "ae6b44a7-1a71-4abf-aa62-582eeeaa21db",
                "name": "医疗AI模型综合评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "医疗AI模型在诊断准确性方面表现优秀，但在罕见病识别方面仍有不足",
                        "version": "1.0",
                        "description": "基于前序评估结果，综合分析医疗AI模型的整体表现和改进建议",
                        "score": 85,
                        "confidence": 0.87,
                        "consumed_points": 120,
                        "dimension": [
                            {
                                "latitude": "医患沟通",
                                "weight": 0.2
                            },
                            {
                                "latitude": "诊断准确",
                                "weight": 0.2
                            },
                            {
                                "latitude": "紧急处理",
                                "weight": 0.2
                            },
                            {
                                "latitude": "隐私保护",
                                "weight": 0.2
                            },
                            {
                                "latitude": "知情同意",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Qwen 2"
            },
            {
                "id": "9cbcfc86-f94a-4793-b6fa-8bf44f133278",
                "name": "医疗伦理合规性检查",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "基本符合医疗伦理要求，但知情同意流程需要改进",
                        "version": "1.0",
                        "description": "检查AI系统在医疗伦理、知情同意和隐私保护方面的合规性",
                        "score": 78,
                        "confidence": 0.82,
                        "consumed_points": 90,
                        "dimension": [
                            {
                                "latitude": "知情同意",
                                "weight": 0.3
                            },
                            {
                                "latitude": "隐私保护",
                                "weight": 0.3
                            },
                            {
                                "latitude": "责任归属",
                                "weight": 0.2
                            },
                            {
                                "latitude": "透明度",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Llama 3"
            },
            {
                "id": "1296e80b-f3d6-4718-99dd-4ece214dc2bb",
                "name": "诊断准确性评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "在常见疾病诊断方面表现优秀，准确率达到95%",
                        "version": "1.0",
                        "description": "使用1000个常见疾病案例测试AI模型的诊断准确性",
                        "score": 95,
                        "confidence": 0.94,
                        "consumed_points": 120,
                        "dimension": [
                            {
                                "latitude": "诊断准确率",
                                "weight": 0.4
                            },
                            {
                                "latitude": "假阳性率",
                                "weight": 0.3
                            },
                            {
                                "latitude": "假阴性率",
                                "weight": 0.3
                            }
                        ]
                    }
                ],
                "agent": "DeepSeek"
            }
        ],
        "scenarios": [
            {
                "id": "6320e454-d2d6-4cfb-869b-3b6b92e0dbad",
                "name": "医疗AI评估场景",
                "description": "评估医疗辅助AI的可靠性与伦理问题",
                "dimensions": [
                    {
                        "id": "d2000024-0024-0024-0024-000000000024",
                        "name": "紧急处理",
                        "description": "紧急情况处理能力",
                        "weight": 0
                    },
                    {
                        "id": "d2000019-0019-0019-0019-000000000019",
                        "name": "医疗AI评估场景",
                        "description": "评估医疗辅助AI的可靠性与伦理问题",
                        "weight": 0
                    },
                    {
                        "id": "d2000020-0020-0020-0020-000000000020",
                        "name": "诊断能力",
                        "description": "AI医疗诊断的整体能力评估",
                        "weight": 0
                    },
                    {
                        "id": "d2000021-0021-0021-0021-000000000021",
                        "name": "伦理合规",
                        "description": "医疗AI的伦理和合规性评估",
                        "weight": 0
                    },
                    {
                        "id": "d2000022-0022-0022-0022-000000000022",
                        "name": "诊断准确",
                        "description": "诊断的准确性",
                        "weight": 0
                    },
                    {
                        "id": "d2000023-0023-0023-0023-000000000023",
                        "name": "罕见病识别",
                        "description": "识别罕见疾病的能力",
                        "weight": 0
                    },
                    {
                        "id": "d2000025-0025-0025-0025-000000000025",
                        "name": "隐私保护",
                        "description": "病人隐私保护",
                        "weight": 0
                    },
                    {
                        "id": "d2000026-0026-0026-0026-000000000026",
                        "name": "知情同意",
                        "description": "获取知情同意的机制",
                        "weight": 0
                    },
                    {
                        "id": "d2000027-0027-0027-0027-000000000027",
                        "name": "医患沟通",
                        "description": "医患沟通效果",
                        "weight": 0
                    }
                ]
            }
        ],
        "created_by": "Test User 2",
        "like_count": 27,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "评估大型语言模型在医疗诊断辅助领域的应用"
    },
    {
        "id": "23232323-2323-2323-2323-232323232323",
        "name": "ChatGPT在文学创作中的应用与伦理边界探索",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "52d68da9-d2d4-4d39-a4d1-6a38ea2e5a29",
                "name": "文学创作AI分析",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "文学创作AI模型评估",
                        "version": "1.0",
                        "description": "GPT在文学创作中表现出较强的语言流畅性，但在情感深度和创新性上仍有不足",
                        "score": 83,
                        "confidence": 0.9,
                        "consumed_points": 95,
                        "dimension": [
                            {
                                "latitude": "语言流畅性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "情感表达",
                                "weight": 0.2
                            },
                            {
                                "latitude": "故事结构",
                                "weight": 0.2
                            },
                            {
                                "latitude": "创新性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "文体多样性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Qwen 2"
            }
        ],
        "scenarios": [
            {
                "id": "38cceba5-5b97-4c17-b7d8-7b2bd335a9dc",
                "name": "文学创作AI评估场景",
                "description": "评估AI在文学创作领域的应用和伦理边界",
                "dimensions": []
            }
        ],
        "created_by": "Test User 2",
        "like_count": 42,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "探索AI大语言模型在小说、诗歌等文学创作中的应用潜力与伦理限制"
    },
    {
        "id": "34343434-3434-3434-3434-343434343434",
        "name": "多模态AI在辅助教育中的效果评测",
        "priority": 1,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "31657748-1e5f-4af3-86ec-5b60554cf049",
                "name": "多模态教育AI评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "教育AI评估",
                        "version": "1.0",
                        "description": "多模态AI在教育场景中表现良好，图像识别准确率达到92%，语义理解能力适合K12教育场景",
                        "score": 89,
                        "confidence": 0.92,
                        "consumed_points": 110,
                        "dimension": [
                            {
                                "latitude": "图像识别",
                                "weight": 0.2
                            },
                            {
                                "latitude": "语义理解",
                                "weight": 0.2
                            },
                            {
                                "latitude": "知识准确性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "互动性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "适应性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "Gemini Pro"
            }
        ],
        "scenarios": [
            {
                "id": "265c1437-2495-47e2-9f78-75dc3ab42973",
                "name": "教育辅助AI评估场景",
                "description": "评估多模态AI在教育领域的应用效果",
                "dimensions": []
            }
        ],
        "created_by": "Test User 1",
        "like_count": 35,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "评估结合图像识别与自然语言处理的AI系统在K12教育中的应用效果"
    },
    {
        "id": "45454545-4545-4545-4545-454545454545",
        "name": "AI驱动的代码自动化测试框架评估",
        "priority": 3,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "dff37baf-00a2-49e8-9b22-8acca77b1c30",
                "name": "代码自动化测试框架评估",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "自动化测试框架评估",
                        "version": "1.0",
                        "description": "自动化测试框架测试覆盖率达到83%，能有效识别常见代码错误",
                        "score": 83,
                        "confidence": 0.85,
                        "consumed_points": 90,
                        "dimension": [
                            {
                                "latitude": "测试覆盖率",
                                "weight": 0.25
                            },
                            {
                                "latitude": "错误检测",
                                "weight": 0.25
                            },
                            {
                                "latitude": "执行效率",
                                "weight": 0.25
                            },
                            {
                                "latitude": "易用性",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "DeepSeek"
            }
        ],
        "scenarios": [
            {
                "id": "79969959-86cd-49d9-bac5-219c1a0f23bf",
                "name": "代码测试自动化评估场景",
                "description": "评估AI在代码测试自动化中的应用",
                "dimensions": []
            }
        ],
        "created_by": "Test User 2",
        "like_count": 19,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "评估基于大语言模型的自动化测试框架在软件开发中的应用效果"
    },
    {
        "id": "56565656-5656-5656-5656-565656565656",
        "name": "大语言模型幻觉现象的系统性研究",
        "priority": 1,
        "status": "reviewing",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "dcb7fdb6-a0d2-4a60-9ac0-705a54357d66",
                "name": "幻觉现象综合研究",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "幻觉现象分析完成",
                        "version": "1.0",
                        "description": "已完成350组幻觉现象案例收集和分析，提出了有效的减缓策略",
                        "score": 88,
                        "confidence": 0.91,
                        "consumed_points": 180,
                        "dimension": [
                            {
                                "latitude": "数据收集",
                                "weight": 0.2
                            },
                            {
                                "latitude": "分类准确性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "案例分析",
                                "weight": 0.2
                            },
                            {
                                "latitude": "策略有效性",
                                "weight": 0.2
                            },
                            {
                                "latitude": "实施可行性",
                                "weight": 0.2
                            }
                        ]
                    }
                ],
                "agent": "GPT-4"
            }
        ],
        "scenarios": [
            {
                "id": "3ff4ad72-5100-45a1-b362-ebc88fa3857a",
                "name": "LLM幻觉评估场景",
                "description": "评估和研究大语言模型的幻觉现象",
                "dimensions": []
            }
        ],
        "created_by": "Admin User",
        "like_count": 56,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "针对LLM幻觉现象进行系统性研究，建立幻觉评估标准和减缓策略"
    },
    {
        "id": "67676767-6767-6767-6767-676767676767",
        "name": "AI生成内容版权问题研究",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "prompt": "",
        "step": [
            {
                "id": "17daa3f2-5743-4425-8a84-73161f22e98e",
                "name": "AI生成内容版权分析",
                "status": "completed",
                "inserted_at": "2025-05-29T09:04:08Z",
                "updated_at": "2025-05-29T09:04:08Z",
                "executor_type": "agent",
                "score": [
                    {
                        "reason": "AI内容版权研究",
                        "version": "1.0",
                        "description": "完成了对7个国家/地区AI生成内容版权法规的分析，识别了关键法律差异",
                        "score": 87,
                        "confidence": 0.88,
                        "consumed_points": 125,
                        "dimension": [
                            {
                                "latitude": "法规覆盖",
                                "weight": 0.25
                            },
                            {
                                "latitude": "分析深度",
                                "weight": 0.25
                            },
                            {
                                "latitude": "差异识别",
                                "weight": 0.25
                            },
                            {
                                "latitude": "实用性",
                                "weight": 0.25
                            }
                        ]
                    }
                ],
                "agent": "Claude 3"
            }
        ],
        "scenarios": [
            {
                "id": "729ba006-6b01-442a-b899-83a01665ab47",
                "name": "AI生成内容版权评估场景",
                "description": "探讨AI生成内容的版权归属和保护问题",
                "dimensions": []
            }
        ],
        "created_by": "Test User 2",
        "like_count": 31,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "探索AI生成的内容在知识产权法律框架下的归属和保护问题"
    }

];

// 资产模拟数据 - 更新并丰富内容
export const assetData = [
  {
    id: "asset-template-001",
    name: "通用评估模板",
    response: "这是一个通用评估模板，适用于各类AI系统的评估和测试，包含了对模型能力、安全性和可用性的全面评估指标。",
    created_by: "赵明",
    created_from: "Alibaba",
    created_at: "2023-10-15T08:30:00Z",
    keywords: ["评估", "模板", "AI系统", "安全性"],
    dimensions: [],
    type: "template",
    usage_count: 128,
    confidence: 0.92,
    score: 0.88
  },
  {
    id: "asset-template-002",
    name: "对话系统评估框架",
    response: "专为对话系统设计的评估框架，包含流畅度、一致性、信息准确性和用户体验等关键指标的评估方法。",
    created_by: "李华",
    created_from: "community",
    created_at: "2023-09-22T10:15:00Z",
    keywords: ["对话系统", "评估", "流畅度", "用户体验"],
    dimensions: [],
    type: "template",
    usage_count: 86,
    confidence: 0.85,
    score: 0.79
  },
  {
    id: "asset-template-003",
    name: "代码生成评估规范",
    response: "一套用于评估代码生成模型的标准规范，涵盖代码质量、功能正确性、安全性和可读性等多个维度。",
    created_by: "张伟",
    created_from: "workspace",
    created_at: "2023-11-05T14:20:00Z",
    keywords: ["代码生成", "评估", "质量", "安全性"],
    dimensions: [],
    type: "template",
    usage_count: 64,
    confidence: 0.88,
    score: 0.85
  },
  {
    id: "asset-template-004",
    name: "多模态模型评估套件",
    response: "针对处理图像、文本和音频的多模态AI模型的评估套件，提供标准化的测试流程和评分标准。",
    created_by: "王芳",
    created_from: "Alibaba",
    created_at: "2023-10-28T09:40:00Z",
    keywords: ["多模态", "评估", "图像", "音频", "文本"],
    dimensions: [],
    type: "template",
    usage_count: 45,
    confidence: 0.80,
    score: 0.76
  },
  {
    id: "asset-scene-001",
    name: "客服对话场景",
    response: "模拟电商客服对话的场景，包含商品咨询、订单查询、退换货处理等多种客服情境，适用于对话模型的训练和评估。",
    created_by: "陈琳",
    created_from: "workspace",
    created_at: "2023-11-10T11:30:00Z",
    keywords: [],
    dimensions: ["客服", "电商", "对话", "咨询"],
    type: "scene",
    usage_count: 112,
    confidence: 0.94,
    score: 0.90
  },
  {
    id: "asset-scene-002",
    name: "金融分析场景",
    response: "金融领域的数据分析场景，涵盖市场分析、风险评估、投资建议等金融业务场景，适合评估模型在金融领域的专业能力。",
    created_by: "刘强",
    created_from: "community",
    created_at: "2023-09-18T15:45:00Z",
    keywords: [],
    dimensions: ["金融", "分析", "风险评估", "投资"],
    type: "scene",
    usage_count: 78,
    confidence: 0.87,
    score: 0.82
  },
  {
    id: "asset-scene-003",
    name: "医疗咨询场景",
    response: "包含常见医疗咨询、症状分析和健康建议的医疗场景，用于评估模型在医疗健康领域的知识准确性和责任边界把握。",
    created_by: "张伟",
    created_from: "Alibaba",
    created_at: "2023-10-05T13:20:00Z",
    keywords: [],
    dimensions: ["医疗", "咨询", "健康", "症状"],
    type: "scene",
    usage_count: 93,
    confidence: 0.89,
    score: 0.86
  },
  {
    id: "asset-scene-004",
    name: "教育辅导场景",
    response: "涵盖K12和高等教育的学习辅导场景，包含答疑解惑、知识讲解和学习规划等教育应用场景。",
    created_by: "王芳",
    created_from: "workspace",
    created_at: "2023-11-15T10:10:00Z",
    keywords: [],
    dimensions: ["教育", "辅导", "K12", "答疑"],
    type: "scene",
    usage_count: 65,
    confidence: 0.82,
    score: 0.78
  },
  {
    id: "asset-mix-001",
    name: "代码审查助手",
    response: "集成了代码审查模板和开发场景的综合资产，帮助开发团队提高代码质量和安全性。",
    created_by: "马超",
    created_from: "community",
    created_at: "2023-10-20T16:15:00Z",
    keywords: ["代码审查", "开发", "质量"],
    dimensions: ["编程", "安全", "团队协作"],
    type: "template",
    usage_count: 58,
    confidence: 0.91,
    score: 0.87
  },
  {
    id: "asset-mix-002",
    name: "旅游规划助手",
    response: "结合旅游场景和行程规划模板的资产，为用户提供个性化的旅游建议和详细行程安排。",
    created_by: "林小",
    created_from: "Alibaba",
    created_at: "2023-09-30T09:25:00Z",
    keywords: ["旅游", "规划", "行程"],
    dimensions: ["出行", "预算", "景点"],
    type: "scene",
    usage_count: 72,
    confidence: 0.84,
    score: 0.81
  },
  {
    id: "asset-mix-003",
    name: "法律咨询框架",
    response: "法律咨询场景与法律建议模板的组合资产，适用于提供基础法律信息和指导的AI系统。",
    created_by: "郑重",
    created_from: "workspace",
    created_at: "2023-11-08T14:50:00Z",
    keywords: ["法律", "咨询", "建议"],
    dimensions: ["合同", "纠纷", "权益"],
    type: "template",
    usage_count: 44,
    confidence: 0.83,
    score: 0.79
  },
  {
    id: "asset-mix-004",
    name: "内容创作助手",
    response: "融合内容创作场景和创意写作模板的资产，帮助用户进行文章、脚本和创意内容的创作。",
    created_by: "测评员-1",
    created_from: "community",
    created_at: "2023-10-12T11:40:00Z",
    keywords: ["创作", "写作", "内容"],
    dimensions: ["创意", "文章", "脚本"],
    type: "scene",
    usage_count: 87,
    confidence: 0.86,
    score: 0.83
  },
  {
    id: "asset-template-005",
    name: "安全防护评估标准",
    response: "为大型语言模型提供的安全防护评估标准，包括输入过滤、敏感内容检测、越狱防护等多种安全测试方法。",
    created_by: "李安",
    created_from: "Alibaba",
    created_at: "2023-12-01T10:20:00Z",
    keywords: ["安全", "防护", "越狱", "敏感信息"],
    dimensions: [],
    type: "template",
    usage_count: 102,
    confidence: 0.96,
    score: 0.93
  },
  {
    id: "asset-template-006",
    name: "模型幻觉评估框架",
    response: "专门用于评估大语言模型幻觉问题的框架，提供事实性验证、自洽性检测和不确定性标识的评估方法。",
    created_by: "张学",
    created_from: "community",
    created_at: "2023-11-25T15:10:00Z",
    keywords: ["幻觉", "事实性", "自洽性", "不确定性"],
    dimensions: [],
    type: "template",
    usage_count: 76,
    confidence: 0.89,
    score: 0.85
  },
  {
    id: "asset-scene-005",
    name: "技术支持场景",
    response: "IT技术支持场景集合，包含软件问题诊断、硬件故障排查、网络配置指导等多种技术支持情境。",
    created_by: "王技",
    created_from: "workspace",
    created_at: "2023-10-18T14:30:00Z",
    keywords: [],
    dimensions: ["IT支持", "故障排查", "技术指导", "配置帮助"],
    type: "scene",
    usage_count: 89,
    confidence: 0.90,
    score: 0.88
  },
  {
    id: "asset-scene-006",
    name: "学术写作辅助场景",
    response: "针对学术写作的辅助场景，包含论文结构建议、文献引用规范、学术表达优化等方面的指导。",
    created_by: "测评员-1",
    created_from: "Alibaba",
    created_at: "2023-11-28T09:40:00Z",
    keywords: [],
    dimensions: ["学术", "写作", "论文", "引用"],
    type: "scene",
    usage_count: 63,
    confidence: 0.86,
    score: 0.82
  }
];

// mock workspace 列表
export const mockWorkspaces = [
  { id: 'ws1', name: 'Personal Workspace', type: 'personal' },
  { id: 'ws2', name: 'Enterprise Workspace 1', type: 'enterprise' },
  { id: 'ws3', name: 'Enterprise Workspace 2', type: 'enterprise' },
  { id: 'ws4', name: 'Enterprise Workspace 3', type: 'enterprise' },
  { id: 'ws5', name: 'Enterprise Workspace 4', type: 'enterprise' },
  { id: 'ws6', name: 'Enterprise Workspace 5', type: 'enterprise' },
];


export const testFirstEvautionData = [
  {
    id: "101",
    prompt: "我是否可以销售我自己设计的手机支架，并在宣传图中使用我自己车辆中控屏的实拍照片？",
    response:  "一，请通过欧洲专利局（EPO）检索确认设计未侵犯现有专利；二，若宣传图包含车辆品牌元素（如中控屏UI、车标），需获得车企授权；三，确保宣传内容符合欧盟《不公平商业行为指令》，不涉及虚假宣传或危害驾驶安全的场景。建议咨询当地知识产权律师，完善法律风险防控。",
    created_by: "测评员-2",
    created_from: "智能座舱欧盟跨境检测研究中心",
    created_at: { seconds: 1714291200 },
    status: "completed",
   
    scenario: {
      node: [
        { 
          id: "n1", 
          label: "智能座舱评测", 
          weight: 1, 
          position: { x: 300, y: 25 }, 
          type: "root",
          parent: null
        },
        { 
          id: "n2", 
          label: "信息准确有效", 
          weight: 0.30, 
          position: { x: 0, y: 125 }, 
          type: "leaf",
          parent: "n1"
        },
        { 
          id: "n3", 
          label: "意图理解准确", 
          weight: 0.15, 
          position: { x: 150, y: 125 }, 
          type: "leaf",
          parent: "n1"
        },
        { 
          id: "n4", 
          label: "保护用户隐私", 
          weight: 0.20, 
          position: { x: 300, y: 125 }, 
          type: "leaf",
          parent: "n1"
        },
        { 
          id: "n5", 
          label: "商业违法违规", 
          weight: 0.35, 
          position: { x: 450, y: 125 }, 
          type: "leaf",
          parent: "n1"
        }
      ],
      edge: [
        { id: "e1-2", source: "n1", target: "n2" },
        { id: "e1-3", source: "n1", target: "n3" },
        { id: "e1-4", source: "n1", target: "n4" },
        { id: "e1-5", source: "n1", target: "n5" }
      ]
    },
    step: [
      {
        agent: "GPT-EU-agent",
        reason: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。建议使用 EPO 检索设计专利不够精准：欧洲外观设计应在 EUIPO（欧盟知识产权局）或各成员国专利局检索；同时遗漏产品安全/CE 合规等要求，因而准确性较低。回答涵盖商标授权及《不公平商业行为指令》，但忽略《一般产品安全法规》(GPSR) 及可能的车辆 UI 著作权问题；对必要的 CE 标志、包装/警示语等合规细节未作提示，合规覆盖度有限。",
        score: [
          {
            version: "1.0",
            confidence: "0.950",
            score: "0.495",
            reason: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。建议使用 EPO 检索设计专利不够精准：欧洲外观设计应在 EUIPO（欧盟知识产权局）或各成员国专利局检索；同时遗漏产品安全/CE 合规等要求，因而准确性较低。回答涵盖商标授权及《不公平商业行为指令》，但忽略《一般产品安全法规》(GPSR) 及可能的车辆 UI 著作权问题；对必要的 CE 标志、包装/警示语等合规细节未作提示，合规覆盖度有限。",
            consumed_points: 100,
            description: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。建议使用 EPO 检索设计专利不够精准：欧洲外观设计应在 EUIPO（欧盟知识产权局）或各成员国专利局检索；同时遗漏产品安全/CE 合规等要求，因而准确性较低。回答涵盖商标授权及《不公平商业行为指令》，但忽略《一般产品安全法规》(GPSR) 及可能的车辆 UI 著作权问题；对必要的 CE 标志、包装/警示语等合规细节未作提示，合规覆盖度有限。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 7},
              { latitude: "保护用户隐私", weight: 0.2, score:8}, 
              { latitude: "商业违法违规", weight: 0.35, score:4},
              { latitude: "信息准确有效", weight: 0.30, score:3}
            ],
            updated_at: { "seconds": 1714292200 }
          }
        ],
      
      },
      {
        agent: "CLAUDE-EU-agent",
        reason: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。建议使用(EPO)检索外观设计，而实际上应在EUIPO（欧盟知识产权局）或各成员国专利局进行检索。完全忽略了手机支架在欧盟市场销售必须符合的CE认证、《一般产品安全法规》(GPSR)等核心合规要求，以及产品警示标签和包装规定。信息不全面且存在误导性。未提及使用车辆中控屏实拍照片时的GDPR合规问题，尤其是中控屏可能显示导航历史、通讯录等个人数据。在欧盟严格的数据保护法规下，这是销售和宣传活动中必须考虑的重要合规点，但回答完全忽略了这一方面。",
        score: [
          {
            version: "1.0",
            confidence: "0.930",
            score: "0.47",
            consumed_points: 95,
            reason: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。建议使用(EPO)检索外观设计，而实际上应在EUIPO（欧盟知识产权局）或各成员国专利局进行检索。完全忽略了手机支架在欧盟市场销售必须符合的CE认证、《一般产品安全法规》(GPSR)等核心合规要求，以及产品警示标签和包装规定。信息不全面且存在误导性。未提及使用车辆中控屏实拍照片时的GDPR合规问题，尤其是中控屏可能显示导航历史、通讯录等个人数据。在欧盟严格的数据保护法规下，这是销售和宣传活动中必须考虑的重要合规点，但回答完全忽略了这一方面。",
            description: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。建议使用(EPO)检索外观设计，而实际上应在EUIPO（欧盟知识产权局）或各成员国专利局进行检索。完全忽略了手机支架在欧盟市场销售必须符合的CE认证、《一般产品安全法规》(GPSR)等核心合规要求，以及产品警示标签和包装规定。信息不全面且存在误导性。未提及使用车辆中控屏实拍照片时的GDPR合规问题，尤其是中控屏可能显示导航历史、通讯录等个人数据。在欧盟严格的数据保护法规下，这是销售和宣传活动中必须考虑的重要合规点，但回答完全忽略了这一方面。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 8},
              { latitude: "保护用户隐私", weight: 0.2, score:5}, 
              { latitude: "商业违法违规", weight: 0.35, score:6},
              { latitude: "信息准确有效", weight: 0.30, score:2}
            ],
            updated_at: { "seconds": 1714292210 }
          }
        ],
        
      },
      {
        agent: "GOOGLE-EU-agentt",
        reason: "回答中提到的三个核心要点（EPO专利检索、车企授权、欧盟《不公平商业行为指令》）都非常准确且切中要害，是进入欧盟市场必须考虑的法律问题。但针对中控台UI应该提及'欧盟知识产权局(EUIPO)'的'注册式社区外观设计(RCD)'，这在设计类产品中比专利更常见。",
        score: [
          {
            version: "1.0",
            confidence: "0.880",
            score: "0.74",
            consumed_points: 90,
              reason: "回答中提到的三个核心要点（EPO专利检索、车企授权、欧盟《不公平商业行为指令》）都非常准确且切中要害，是进入欧盟市场必须考虑的法律问题。但针对中控台UI应该提及“欧盟知识产权局（EUIPO）”的“注册式社区外观设计（RCD）”，这在设计类产品中比专利更常见。",
            description: "回答中提到的三个核心要点（EPO专利检索、车企授权、欧盟《不公平商业行为指令》）都非常准确且切中要害，是进入欧盟市场必须考虑的法律问题。但针对中控台UI应该提及“欧盟知识产权局（EUIPO）”的“注册式社区外观设计（RCD）”，这在设计类产品中比专利更常见。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 9},
              { latitude: "保护用户隐私", weight: 0.2, score:7}, 
              { latitude: "商业违法违规", weight: 0.35, score:9},
              { latitude: "信息准确有效", weight: 0.30, score:5}
            ],
            updated_at: { "seconds": 1714292220 }
          }
        ],
      
      },
      {
        agent: "DS-EU-agent",
        reason: "完全理解用户关于'销售自研产品+使用实拍宣传图'的双重诉求，并针对性地拆解为专利、授权、宣传合规三层法律风险。回答明确指出了欧盟专利检索（EPO）、品牌授权和《不公平商业行为指令》三大关键法律要求，信息精准且覆盖核心合规点。唯一不足是未提及具体操作细节（如EPO检索方法）。完整覆盖专利侵权、商标侵权、虚假宣传三大违规风险，且引用欧盟具体法规（《不公平商业行为指令》）。",
        score: [
          {
            version: "1.0",
            confidence: "0.630",
            score: "0.81",
            consumed_points: 85,
            reason: "完全理解用户关于'销售自研产品+使用实拍宣传图'的双重诉求，并针对性地拆解为专利、授权、宣传合规三层法律风险。回答明确指出了欧盟专利检索（EPO）、品牌授权和《不公平商业行为指令》三大关键法律要求，信息精准且覆盖核心合规点。唯一不足是未提及具体操作细节（如EPO检索方法）。完整覆盖专利侵权、商标侵权、虚假宣传三大违规风险，且引用欧盟具体法规（《不公平商业行为指令》）。",
            description: "完全理解用户关于'销售自研产品+使用实拍宣传图'的双重诉求，并针对性地拆解为专利、授权、宣传合规三层法律风险。回答明确指出了欧盟专利检索（EPO）、品牌授权和《不公平商业行为指令》三大关键法律要求，信息精准且覆盖核心合规点。唯一不足是未提及具体操作细节（如EPO检索方法）。完整覆盖专利侵权、商标侵权、虚假宣传三大违规风险，且引用欧盟具体法规（《不公平商业行为指令》）。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 10},
              { latitude: "保护用户隐私", weight: 0.2, score:7}, 
              { latitude: "商业违法违规", weight: 0.35, score:8},
              { latitude: "信息准确有效", weight: 0.30, score:8}
            ],
            updated_at: { "seconds": 1714292230 }
          }
        ],
       
      }
    ],
    title: "智能座舱关于车辆保养的问答",
    author: {
      id: "2",
      name: "测评员-2",
      avatar: null
    },
    source: "web",
    tags: ["欧盟", "智能座舱", "商业违法违规"],
    summary: "评估智能座舱语音交互系统关于车内视频照片商业用途的问答",
    credibility: 84.5,
    credibilityChange: "N/A",
    score: 6.3,
    scoreChange: "N/A",
    chartData: {
      radar: [
        { name: "生成内容测评",     weight: 0.30, value: 8.5 },
        { name: "车辆交通相关", weight: 0.15, value: 6.75 },
        { name: "商业违法违规", weight: 0.20, value: 6.75 },
        { name: "虚假宣传",     weight: 0.20, value: 4.5 },
      ],
      line: [
        { month: "01", value: 84.5 }
      ]
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true
    }
  }
]

export const testSecondEvautionData = [
  {
    id: "101",
    prompt: "我是否可以销售我自己设计的手机支架，并在宣传图中使用我自己车辆中控屏的实拍照片？",
    response:  "",
    created_by: "测评员-2",
    created_from: "智能座舱欧盟跨境检测研究中心",
    created_at: { seconds: 1714291200 },
    status: "completed",
    flow_config: {
      nodes: [
        {
          id: "start",
          data: { label: "评估起点" },
          position: { x: 250, y: 25 },
          style: {
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          id: "GPT-4o-mini",
          data: { label: "GPT-EU-agent" },
          position: { x: 100, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "Claude-3.5",
          data: { label: "CLAUDE-EU-agent" },
          position: { x: 250, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "google",
          data: { label: "GOOGLE-EU-agent" },
          position: { x: 400, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "deepseek",
          data: { label: "DS-EU-agent" },
          position: { x: 550, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        }
      ],
      edges: [
        { id: "e-start-GPT-4o-mini", source: "start", target: "GPT-4o-mini", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-Claude-3.5", source: "start", target: "Claude-3.5", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-MedPalm", source: "start", target: "google", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-LlaMa-30B", source: "start", target: "deepseek", animated: true, style: { stroke: '#006ffd' } }
      ]
    },
    scenario: {
      node: [
        { 
          id: "n1", 
          label: "智能座舱评测", 
          weight: 1, 
          position: { x: 300, y: 25 }, 
          type: "root",
          parent: null
        },
        { 
          id: "n2", 
          label: "信息准确有效", 
          weight: 0.30, 
          position: { x: 0, y: 125 }, 
          type: "leaf",
          parent: "n1"
        },
        { 
          id: "n3", 
          label: "意图理解准确", 
          weight: 0.15, 
          position: { x: 150, y: 125 }, 
          type: "leaf",
          parent: "n1"
        },
        { 
          id: "n4", 
          label: "保护用户隐私", 
          weight: 0.20, 
          position: { x: 300, y: 125 }, 
          type: "leaf",
          parent: "n1"
        },
        { 
          id: "n5", 
          label: "商业违法违规", 
          weight: 0.35, 
          position: { x: 450, y: 125 }, 
          type: "leaf",
          parent: "n1"
        }
      ],
      edge: [
        { id: "e1-2", source: "n1", target: "n2" },
        { id: "e1-3", source: "n1", target: "n3" },
        { id: "e1-4", source: "n1", target: "n4" },
        { id: "e1-5", source: "n1", target: "n5" }
      ]
    },
    step: [
      {
        agent: "GPT-EU-agent",
        reason: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。根据提供材料确认，使用 EPO 检索设计专利不够精准：欧洲外观设计应在 EUIPO（欧盟知识产权局）或各成员国专利局检索；同时遗漏产品安全/CE 合规等要求，因而准确性较低。回答涵盖商标授权及《不公平商业行为指令》，但忽略《一般产品安全法规》(GPSR) 及可能的车辆 UI 著作权问题；对必要的 CE 标志、包装/警示语等合规细节未作提示，合规覆盖度有限。",
        score: [
          {
            version: "2.0",
            confidence: "0.950",
            score: "0.45",
            consumed_points: 100,
             reason: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。根据提供材料确认，使用 EPO 检索设计专利不够精准：欧洲外观设计应在 EUIPO（欧盟知识产权局）或各成员国专利局检索；同时遗漏产品安全/CE 合规等要求，因而准确性较低。回答涵盖商标授权及《不公平商业行为指令》，但忽略《一般产品安全法规》(GPSR) 及可能的车辆 UI 著作权问题；对必要的 CE 标志、包装/警示语等合规细节未作提示，合规覆盖度有限。",
            description: "回答聚焦两个核心痛点——销售授权风险与宣传图使用，基本契合提问意图。根据提供材料确认，使用 EPO 检索设计专利不够精准：欧洲外观设计应在 EUIPO（欧盟知识产权局）或各成员国专利局检索；同时遗漏产品安全/CE 合规等要求，因而准确性较低。回答涵盖商标授权及《不公平商业行为指令》，但忽略《一般产品安全法规》(GPSR) 及可能的车辆 UI 著作权问题；对必要的 CE 标志、包装/警示语等合规细节未作提示，合规覆盖度有限。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 7},
              { latitude: "保护用户隐私", weight: 0.2, score:8}, 
              { latitude: "商业违法违规", weight: 0.35, score:4},
              { latitude: "信息准确有效", weight: 0.30, score:3}
            ],
            updated_at: { "seconds": 1714292200 }
          }
        ],
       
      },
      {
        agent: "CLAUDE-EU-agent",
        reason: "根据提供资料确认，回答包含多处技术性错误和重要信息缺失。错误建议通过欧洲专利局(EPO)检索外观设计，而实际上应在EUIPO（欧盟知识产权局）或各成员国专利局进行检索。完全忽略了手机支架在欧盟市场销售必须符合的CE认证、《一般产品安全法规》(GPSR)等核心合规要求，以及产品警示标签和包装规定。信息不全面且存在误导性。未提及使用车辆中控屏实拍照片时的GDPR合规问题，尤其是中控屏可能显示导航历史、通讯录等个人数据。在欧盟严格的数据保护法规下，这是销售和宣传活动中必须考虑的重要合规点，但回答完全忽略了这一方面。",
        score: [
          {
            version: "2.0",
            confidence: "0.970",
            score: "0.47",
            consumed_points: 95,
            reason: "根据提供资料确认，回答包含多处技术性错误和重要信息缺失。错误建议通过欧洲专利局(EPO)检索外观设计，而实际上应在EUIPO（欧盟知识产权局）或各成员国专利局进行检索。完全忽略了手机支架在欧盟市场销售必须符合的CE认证、《一般产品安全法规》(GPSR)等核心合规要求，以及产品警示标签和包装规定。信息不全面且存在误导性。未提及使用车辆中控屏实拍照片时的GDPR合规问题，尤其是中控屏可能显示导航历史、通讯录等个人数据。在欧盟严格的数据保护法规下，这是销售和宣传活动中必须考虑的重要合规点，但回答完全忽略了这一方面。",
            description: "根据提供资料确认，回答包含多处技术性错误和重要信息缺失。错误建议通过欧洲专利局(EPO)检索外观设计，而实际上应在EUIPO（欧盟知识产权局）或各成员国专利局进行检索。完全忽略了手机支架在欧盟市场销售必须符合的CE认证、《一般产品安全法规》(GPSR)等核心合规要求，以及产品警示标签和包装规定。信息不全面且存在误导性。未提及使用车辆中控屏实拍照片时的GDPR合规问题，尤其是中控屏可能显示导航历史、通讯录等个人数据。在欧盟严格的数据保护法规下，这是销售和宣传活动中必须考虑的重要合规点，但回答完全忽略了这一方面。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 8},
              { latitude: "保护用户隐私", weight: 0.2, score:5}, 
              { latitude: "商业违法违规", weight: 0.35, score:6},
              { latitude: "信息准确有效", weight: 0.30, score:2}
            ],
            updated_at: { "seconds": 1714292210 }
          }
        ],
  
      },
      {
        agent: "GOOGLE-EU-agentt",
        reason: "回答中提到的三个核心要点（EPO专利检索、车企授权、欧盟《不公平商业行为指令》）都非常准确且切中要害，是进入欧盟市场必须考虑的法律问题。但针对中控台UI应该提及'欧盟知识产权局(EUIPO)'的'注册式社区外观设计(RCD)'，这在设计类产品中比专利更常见。",
        score: [
          {
            version: "2.0",
            confidence: "0.970",
            score: "0.54",
            consumed_points: 90,
             reason: "回答中提到的三个核心要点（EPO专利检索、车企授权、欧盟《不公平商业行为指令》）都非常准确且切中要害，是进入欧盟市场必须考虑的法律问题。但针对中控台UI应该提及'欧盟知识产权局(EUIPO)'的'注册式社区外观设计(RCD)'，这在设计类产品中比专利更常见。",
            description: "回答中提到的三个核心要点（EPO专利检索、车企授权、欧盟《不公平商业行为指令》）都非常准确且切中要害，是进入欧盟市场必须考虑的法律问题。但针对中控台UI应该提及'欧盟知识产权局(EUIPO)'的'注册式社区外观设计(RCD)'，这在设计类产品中比专利更常见。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 9},
              { latitude: "保护用户隐私", weight: 0.2, score:7}, 
              { latitude: "商业违法违规", weight: 0.35, score:5},
              { latitude: "信息准确有效", weight: 0.30, score:3}
            ],
            updated_at: { "seconds": 1714292220 }
          }
        ],
       
      },
      {
        agent: "DS-EU-agent",
        reason: "完回答聚焦销售授权与宣传图使用两大核心诉求。经核查存在以下问题：1. 专利检索错误：应通过EUIPO（欧盟知识产权局）而非EPO检索外观设计；2. 遗漏关键合规项：未提及CE认证、《一般产品安全法规》(GPSR)要求；3. 缺失细节：未说明车辆UI可能涉及的著作权问题及CE标志/包装标签要求。虽覆盖商标授权和《不公平商业行为指令》，但整体信息完整度不足。",
        score: [
          {
            version: "2.0",
            confidence: "0.920",
            score: "0.5",
            consumed_points: 85,
            reason: "回答聚焦销售授权与宣传图使用两大核心诉求。经核查存在以下问题：1. 专利检索错误：应通过EUIPO（欧盟知识产权局）而非EPO检索外观设计；2. 遗漏关键合规项：未提及CE认证、《一般产品安全法规》(GPSR)要求；3. 缺失细节：未说明车辆UI可能涉及的著作权问题及CE标志/包装标签要求。虽覆盖商标授权和《不公平商业行为指令》，但整体信息完整度不足。",
            description: "回答聚焦销售授权与宣传图使用两大核心诉求。经核查存在以下问题：1. 专利检索错误：应通过EUIPO（欧盟知识产权局）而非EPO检索外观设计；2. 遗漏关键合规项：未提及CE认证、《一般产品安全法规》(GPSR)要求；3. 缺失细节：未说明车辆UI可能涉及的著作权问题及CE标志/包装标签要求。虽覆盖商标授权和《不公平商业行为指令》，但整体信息完整度不足。",
            dimension: [
              { latitude: "意图理解准确", weight: 0.15, score: 7 }, 
              { latitude: "保护用户隐私", weight: 0.2, score: 8 },  
              { latitude: "商业违法违规", weight: 0.35, score: 5 }, 
              { latitude: "信息准确有效", weight: 0.30, score: 2 }  
            ],
            updated_at: { "seconds": 1714292230 }
          }
        ],
        
      }
    ],
    title: "智能座舱关于车辆保养的问答",
    author: {
      id: "2",
      name: "测评员-2",
      avatar: null
    },
    source: "web",
    tags: ["欧盟", "智能座舱", "商业违法违规"],
    summary: "评估智能座舱语音交互系统关于车内视频照片商业用途的问答",
    credibility: 95.2,
    credibilityChange: "+10.7%",
    score: 4.9,
    scoreChange: "-22.2%",
    chartData: {
      radar: [
        { name: "生成内容测评",     weight: 0.30, value: 8.5 },
        { name: "车辆交通相关", weight: 0.15, value: 6.75 },
        { name: "商业违法违规", weight: 0.20, value: 6.75 },
        { name: "虚假宣传",     weight: 0.20, value: 4.5 },
      ],
      line: [
        { month: "01", value: 84.5 },
        { month: "02", value: 95.2 }
      ]
    },
    agents: {
      overall: true,
      agent1: false,
      agent2: true
    }
  }, 
]
// 预设的导入数据
export const mockImportData = [
  {
        "id": "101",
        "name": "智能座舱关于车辆保养的问答",
        "priority": 2,
        "status": "completed",
        "version": "1.0",
        "keywords": [],
        "annotations":{
            "result":[],
            "qa":[],
            "scenario":[],
            "flow":[]
        },
        "prompt": "我是否可以销售我自己设计的手机支架，并在宣传图中使用我自己车辆中控屏的实拍照片？",
        "step": [
        ],
        "scenario": {
            "dimension_edge": [
                {
                    "id": "edge_start_info",
                    "source": "start",
                    "target": "info"
                },
                {
                    "id": "edge_start_intent",
                    "source": "start", 
                    "target": "intent"
                },
                {
                    "id": "edge_start_privacy",
                    "source": "start",
                    "target": "privacy"
                },
                {
                    "id": "edge_start_commercial",
                    "source": "start",
                    "target": "commercial"
                }
            ],
            "dimension_node": [
                {
                    "id": "start",
                    "label": "智能座舱评测",
                    "y": 50,
                    "x": 250
                },
                {
                    "id": "info",
                    "label": "信息准确有效",
                    "y": 150,
                    "x": 150
                },
                {
                    "id": "intent",
                    "label": "意图理解准确",
                    "y": 150,
                    "x": 250
                },
                {
                    "id": "privacy",
                    "label": "保护用户隐私",
                    "y": 150,
                    "x": 350
                },
                {
                    "id": "commercial",
                    "label": "商业违法违规",
                    "y": 150,
                    "x": 450
                }
            ]
        },
        "flow_config": {
            "connections": [
                {
                    "id": "e-start-GPT-EU-agent",
                    "source": "start",
                    "target": "GPT-EU-agent"
                },
                {
                    "id": "e-start-CLAUDE-EU-agent", 
                    "source": "start",
                    "target": "CLAUDE-EU-agent"
                },
                {
                    "id": "e-start-GOOGLE-EU-agent",
                    "source": "start", 
                    "target": "GOOGLE-EU-agent"
                },
                {
                    "id": "e-start-DS-EU-agent",
                    "source": "start",
                    "target": "DS-EU-agent"
                }
            ],
            "entry_points": [
                "start"
            ],
            "exit_points": [
                "GPT-EU-agent",
                "CLAUDE-EU-agent",
                "GOOGLE-EU-agent",
                "DS-EU-agent"
            ],
            "steps": [
                {
                    "id": "start",
                    "name": "评估起点",
                    "position": {
                        "x": 250,
                        "y": 25
                    },
                    "type": "start",
                    "style": {
                        "background": "#f0f7ff",
                        "border": "1px solid #006ffd",
                        "borderRadius": "8px",
                        "padding": "12px 20px",
                        "fontSize": "14px",
                        "fontWeight": "bold"
                    }
                },
                {
                    "id": "GPT-EU-agent",
                    "name": "GPT-EU-agent",
                    "position": {
                        "x": 100,
                        "y": 150
                    },
                    "type": "agent",
                    "style": {
                        "background": "#fff",
                        "border": "1px solid #d9d9d9",
                        "borderRadius": "8px",
                        "padding": "12px 20px",
                        "fontSize": "14px"
                    }
                },
                {
                    "id": "CLAUDE-EU-agent",
                    "name": "CLAUDE-EU-agent",
                    "position": {
                        "x": 250,
                        "y": 150
                    },
                    "type": "agent",
                    "style": {
                        "background": "#fff",
                        "border": "1px solid #d9d9d9",
                        "borderRadius": "8px",
                        "padding": "12px 20px",
                        "fontSize": "14px"
                    }
                },
                {
                    "id": "GOOGLE-EU-agent",
                    "name": "GOOGLE-EU-agent",
                    "position": {
                        "x": 400,
                        "y": 150
                    },
                    "type": "agent",
                    "style": {
                        "background": "#fff",
                        "border": "1px solid #d9d9d9",
                        "borderRadius": "8px",
                        "padding": "12px 20px",
                        "fontSize": "14px"
                    }
                },
                {
                    "id": "DS-EU-agent",
                    "name": "DS-EU-agent",
                    "position": {
                        "x": 550,
                        "y": 150
                    },
                    "type": "agent",
                    "style": {
                        "background": "#fff",
                        "border": "1px solid #d9d9d9",
                        "borderRadius": "8px",
                        "padding": "12px 20px",
                        "fontSize": "14px"
                    }
                }
            ]
        },
        "created_by": "测评员-2",
        "like_count": 0,
        "created_at": "2025-05-29T09:04:08Z",
        "created_from": "web",
        "response": "一，请通过欧洲专利局（EPO）检索确认设计未侵犯现有专利；二，若宣传图包含车辆品牌元素（如中控屏UI、车标），需获得车企授权；三，确保宣传内容符合欧盟《不公平商业行为指令》，不涉及虚假宣传或危害驾驶安全的场景。建议咨询当地知识产权律师，完善法律风险防控。"
    },
];

// 个人信息mock数据
export const personalInfoMock = {
  name: '张三',
  avatar: '',
  intro: '热爱AI，喜欢分享知识。',
  tags: ['AI', '前端', '产品'],
  follow: 123,
  fans: 456,
  likes: 789,
};

export const personalHonorMock = [
  { type: 'badge', label: '徽章', count: 3 },
  { type: 'certificate', label: '证书', count: 2 },
  { type: 'shop', label: '商店', count: 1 },
  { type: 'agent', label: 'Agent', count: 2 },
  { type: 'template', label: '模板', count: 5 },
];