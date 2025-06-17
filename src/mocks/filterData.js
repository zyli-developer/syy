// 筛选系统数据

// 场景选项 - 更新为与真实数据匹配的字段
export const fieldOptions = [
  "credibility",    // 可信度
  "score",          // 评分
  "tags",           // 标签
  "created_by",     // 创建者
  "source",         // 来源
  "created_at",     // 创建时间
  "brand",          // 品牌
  "testTarget",     // 测试目标
  "priority",       // 优先级
  "model",          // 模型
  "title",          // 标题
  "summary",        // 摘要
  "keyword"         // 关键词搜索
]

// 操作符选项
export const operatorOptions = [
  "等于",
  "不等于",
  "包含",
  "不包含",
  "为空",
  "不为空"
]

// 值选项 - 基于真实数据
export const valueOptions = {
  // 可信度选项
  credibility: ["80", "85", "90", "95", "高", "中", "低"],
  
  // 评分选项
  score: ["5.0", "6.0", "7.0", "8.0", "9.0", "优", "良", "中", "差"],
  
  // 标签选项
  tags: [
    "安全性", "儿童", "语音交互", "医疗", "伦理", "诊断", "智能座舱", 
    "安全", "极端天气", "隐私", "金融", "教育", "合规性", "AI教育",
    "客观性评估", "高中", "自动驾驶", "数据安全"
  ],
  
  // 创建者选项
  created_by: [
    "测评员-1", "测评员-2", "审核员-1", "David", "Mike", "Sarah", 
    "李老师", "张先生", "王工程师"
  ],
  
  // 来源选项
  source: [
    "AI toy", "医疗AI研究中心", "交通安全研究院", "未来教育实验室", 
    "智能理财研究部", "ATtoy", "无人驾驶实验室", "安全评测中心"
  ],
  
  // 创建时间选项
  created_at: ["今天", "昨天", "本周", "上周", "本月", "上月"],
  
  // 品牌选项
  brand: ["儿童智能", "Medical-AI", "汽车智能", "教育AI", "金融科技"],
  
  // 测试目标选项
  testTarget: ["AI玩具", "大型语言模型", "智能座舱", "自动驾驶系统"],
  
  // 优先级选项
  priority: ["高", "中", "低"],
  
  // 模型选项
  model: ["伴学宝", "MedGPT", "汽车助手", "教育助手", "理财顾问"],
  
  // 标题和摘要使用关键词搜索，不需要预设选项
  title: [],
  summary: [],
  
  // 关键词搜索通用选项
  keyword: [
    "安全", "AI", "语音", "医疗", "自动驾驶", "金融", "教育", 
    "隐私保护", "评估", "风险", "测试"
  ],
  
  // 兼容旧字段映射的选项
  场景: ["聊天场景", "客服咨询", "文档编辑", "内容生成", "教育辅导", "医疗咨询", "金融咨询"],
  标签: ["安全性", "AI", "语音交互", "医疗", "教育", "金融"],
  作者: ["测评员-1", "测评员-2", "David", "李老师", "张先生"],
  来源: ["AI toy", "医疗AI研究中心", "交通安全研究院", "未来教育实验室"]
}

// 字段名称映射 - 更新为与真实数据对应的字段
export const fieldNameMap = {
  // API字段名到UI显示名称
  credibility: "可信度",
  score: "评分",
  tags: "标签",
  created_by: "创建者",
  source: "来源",
  created_at: "创建时间",
  brand: "品牌",
  testTarget: "测试目标",
  priority: "优先级",
  model: "模型",
  title: "标题",
  summary: "摘要",
  keyword: "关键词",
  
  // UI显示名称到API字段名
  "可信度": "credibility",
  "评分": "score",
  "标签": "tags",
  "创建者": "created_by",
  "来源": "source",
  "创建时间": "created_at",
  "品牌": "brand",
  "测试目标": "testTarget",
  "优先级": "priority",
  "模型": "model",
  "标题": "title",
  "摘要": "summary",
  "关键词": "keyword",
  
  // 处理可能的大小写或命名差异
  Credibility: "credibility",
  Score: "score",
  Tags: "tags",
  CreatedBy: "created_by",
  Source: "source",
  CreatedAt: "created_at",
  Brand: "brand",
  TestTarget: "testTarget",
  Priority: "priority",
  Model: "model",
  Title: "title",
  Summary: "summary",
  Keyword: "keyword",
  
  // 旧版兼容
  created_time: "created_at",
  author: "created_by",
  "场景": "scenario",
  "作者": "created_by"
}

// 标准化字段名称
export const normalizeFieldName = (fieldName) => {
  if (!fieldName) return "keyword"; // 默认使用关键词搜索
  
  // 尝试从映射中获取规范化的字段名
  const normalizedName = fieldNameMap[fieldName] || fieldName.toLowerCase();
  
  // 处理特殊字段名转换，确保与API一致
  switch(normalizedName) {
    case "author":
    case "creator":
    case "作者":
      return "created_by";
    case "source":
    case "来源":
      return "source";
    case "time":
    case "date":
    case "created_time":
    case "创建时间":
      return "created_at";
    case "tag":
    case "标签":
      return "tags";
    case "confidence":
    case "可信度":
      return "credibility";
    default:
      // 保留原始字段名，不再默认转为keyword
      return normalizedName;
  }
};

// 分组字段选项
export const groupFieldOptions = ["标签", "创建者", "来源", "优先级", "测试目标", "创建时间"]

// 排序字段选项
export const sortFieldOptions = [
  { value: "credibility", label: "可信度" },
  { value: "score", label: "评分" },
  { value: "created_at", label: "创建时间" },
  { value: "title", label: "标题" },
  { value: "priority", label: "优先级" }
]

// 排序方向选项
export const sortDirectionOptions = [
  { value: "asc", label: "升序" },
  { value: "desc", label: "降序" }
]

// 初始筛选配置
export const initialFilterState = {
  visible: false,
  step: "filter", // 'filter', 'group', 'sort'
  filterConfig: {
    conditions: []
  },
  groupConfig: {
    fields: []
  },
  sortConfig: {
    fields: []
  }
}

// 字段处理函数 - 用于将API数据转换为筛选条件所需的格式
export const processCardFieldValue = (card, field) => {
  if (!card) return null;
  
  switch (field) {
    case "credibility":
      return card.credibility ? card.credibility.toString() : "0";
    case "score":
      return card.score ? card.score.toString() : "0";
    case "tags":
      return Array.isArray(card.tags) ? card.tags : [];
    case "created_by":
      return card.created_by || (card.author && card.author.name) || "";
    case "source":
      return card.source || "";
    case "created_at":
      // 处理不同格式的创建时间
      if (card.created_at) {
        if (card.created_at.seconds) {
          const date = new Date(card.created_at.seconds * 1000);
          return date.toISOString();
        } else if (typeof card.created_at === 'string') {
          return card.created_at;
        }
      }
      return "";
    case "title":
      return card.title || "";
    case "summary":
      return card.summary || card.response_summary || "";
    case "keyword":
      // 关键词搜索会查找多个字段
      return [
        card.title || "", 
        card.summary || card.response_summary || "", 
        ...(Array.isArray(card.tags) ? card.tags : []),
        card.created_by || (card.author && card.author.name) || "",
        card.source || ""
      ].join(" ");
    default:
      return card[field] || "";
  }
};

// 筛选数据函数 - 用于根据筛选条件过滤数据
export const filterCardsByConditions = (cards, filterConfig) => {
  if (!filterConfig || !filterConfig.conditions || filterConfig.conditions.length === 0) {
    return cards;
  }

  return cards.filter(card => {
    // 检查每个筛选条件
    return filterConfig.conditions.every(condition => {
      // 获取卡片中对应字段的值
      const cardValue = processCardFieldValue(card, condition.field);
      
      // 为空和不为空操作符特殊处理，不需要条件值
      if (condition.operator === "为空") {
        if (Array.isArray(cardValue)) {
          return cardValue.length === 0;
        }
        return cardValue === null || cardValue === undefined || cardValue === "";
      }
      
      if (condition.operator === "不为空") {
        if (Array.isArray(cardValue)) {
          return cardValue.length > 0;
        }
        return cardValue !== null && cardValue !== undefined && cardValue !== "";
      }
      
      // 其他操作符需要条件值
      const conditionValue = condition.value || (condition.values && condition.values.length > 0 ? condition.values[0] : null);
      
      // 如果条件值为空或未定义，则返回true（跳过此条件）
      if (conditionValue === null || conditionValue === undefined) {
        return true;
      }
      
      console.log(`比较字段 ${condition.field}: 卡片值=`, cardValue, `条件值=${conditionValue}, 操作符=${condition.operator}`);
      
      // 根据操作符进行比较
      switch (condition.operator) {
        case "等于":
        case "EQ":
          if (Array.isArray(cardValue)) {
            return cardValue.some(val => 
              val.toString().toLowerCase() === conditionValue.toString().toLowerCase()
            );
          }
          return cardValue.toString().toLowerCase() === conditionValue.toString().toLowerCase();
          
        case "不等于":
        case "NEQ":
          if (Array.isArray(cardValue)) {
            return !cardValue.some(val => 
              val.toString().toLowerCase() === conditionValue.toString().toLowerCase()
            );
          }
          return cardValue.toString().toLowerCase() !== conditionValue.toString().toLowerCase();
          
        case "包含":
        case "LIKE":
          if (Array.isArray(cardValue)) {
            return cardValue.some(val => 
              val.toString().toLowerCase().includes(conditionValue.toString().toLowerCase())
            );
          }
          return cardValue.toString().toLowerCase().includes(conditionValue.toString().toLowerCase());
          
        case "不包含":
        case "NOT_IN":
          if (Array.isArray(cardValue)) {
            return !cardValue.some(val => 
              val.toString().toLowerCase().includes(conditionValue.toString().toLowerCase())
            );
          }
          return !cardValue.toString().toLowerCase().includes(conditionValue.toString().toLowerCase());

        case "IS_NULL":
          if (Array.isArray(cardValue)) {
            return cardValue.length === 0;
          }
          return cardValue === null || cardValue === undefined || cardValue === "";

        case "IS_NOT_NULL":
          if (Array.isArray(cardValue)) {
            return cardValue.length > 0;
          }
          return cardValue !== null && cardValue !== undefined && cardValue !== "";
          
        default:
          return true;
      }
    });
  });
};
