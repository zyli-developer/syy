/**
 * 数据转换工具
 * 处理API返回的数据格式，转换为前端需要的格式
 */

import { timestampToDate } from './protobufHelper';

/**
 * 处理探索卡片数据
 * @param {Object} card - API返回的探索卡片数据
 * @returns {Object} - 处理后的卡片数据
 */
export const processExplorationCard = (card) => {
  if (!card) return null;
  
  console.log("处理探索卡片数据:", card.id);
  
  // 处理雷达图数据 - 优先使用现有的chartData.radar
  let radarData = [];
  if (card.chartData && Array.isArray(card.chartData.radar)) {
    // 直接使用已有的雷达图数据
    radarData = card.chartData.radar;
  } else if (card.step && card.step.length > 0) {
    // 从step.score.dimension构建雷达图数据
    const lastStep = card.step[card.step.length - 1];
    if (lastStep.score && lastStep.score.length > 0) {
      const scoreWithDimension = lastStep.score.find(s => s.dimension && s.dimension.length > 0);
      if (scoreWithDimension) {
        radarData = scoreWithDimension.dimension.map(d => ({
          name: d.latitude,
          value: Math.round(d.weight * 100), // 转换为百分比值并四舍五入
          weight: d.weight // 保留原始权重值
        }));
      }
    }
  }
  
  // 处理折线图数据 - 根据step[x].score.version (x轴) 和 step[x].score.confidence (y轴) 生成
  let lineData = [];
  if (card.chartData && Array.isArray(card.chartData.line)) {
    // 直接使用已有的折线图数据
    lineData = card.chartData.line;
  } else if (card.step && Array.isArray(card.step)) {
    // 从step构建折线图数据，使用score.version作为x轴，confidence作为y轴
    lineData = card.step.map((s, index) => {
      // 确保score存在且有元素
      if (s.score && s.score.length > 0) {
        return {
          month: s.score[0].version || `版本${index + 1}`, // 使用version作为x轴，如果不存在则使用索引
          value: s.score[0].confidence ? Math.round(parseFloat(s.score[0].confidence) * 100) : 0 // 使用confidence作为y轴值，转换为百分比
        };
      }
      return { month: `步骤${index + 1}`, value: 0 };
    });
  }
  
  // 处理时间戳
  const createdAt = card.created_at ? timestampToDate(card.created_at) : new Date();
  
  // 根据step数据生成模型评估数据
  const modelEvaluations = {};
  if (card.step && Array.isArray(card.step)) {
    // 遍历step数组，为每个步骤(即每个模型)生成评估数据
    card.step.forEach((step, index) => {
      // 使用agent作为模型键名，转换为小写并去除空格
      const modelKey = step.agent ? step.agent.toLowerCase().replace(/\s+/g, '') : `model${index + 1}`;
      
      // 获取score数据
      const scoreData = step.score && step.score.length > 0 ? step.score[0] : null;
      
      // 创建评估数据对象
      modelEvaluations[modelKey] = {
        name: step.agent || `模型${index + 1}`,
        tags: ["AI模型", "评估"],
        description: step.reason || (scoreData ? scoreData.description : "无评估描述"),
        score: scoreData ? parseFloat(scoreData.score) * 10 : 0, // 转换为0-10分制
        scoreChange: "+0.0%",
        credibility: scoreData ? Math.round(parseFloat(scoreData.confidence) * 100) : 0, // 转换为百分比
        credibilityChange: "+0.0%",
        updatedAt: scoreData && scoreData.updated_at ? 
          new Date(scoreData.updated_at.seconds * 1000).toLocaleString() : 
          new Date().toLocaleString(),
        updatedBy: "评估系统",
        strengths: [],
        weaknesses: []
      };
    });
  }
  
  // 确保有默认的评估数据
  if (Object.keys(modelEvaluations).length === 0) {
    modelEvaluations.defaultmodel = {
      name: "默认模型",
      tags: ["AI模型"],
      description: "无评估数据",
      score: 0,
      scoreChange: "+0.0%",
      credibility: 0,
      credibilityChange: "+0.0%",
      updatedAt: new Date().toLocaleString(),
      updatedBy: "系统",
      strengths: [],
      weaknesses: []
    };
  }
  
  // 构建处理后的卡片数据
  let processedCard = {
    ...card,
    created_at: createdAt,
    agents: card.agents || {
      overall: false,
      agent1: false,
      agent2: false,
    },
    chartData: {
      radar: radarData,
      line: lineData
    },
    changes: card.changes || [],
    credibilityChange: card.credibilityChange || "+0.0%",
    scoreChange: card.scoreChange || "+0.0%",
    // 添加模型评估数据
    modelEvaluations: modelEvaluations
  };
  
  // 确保必要的字段都存在
  if (!processedCard.title && processedCard.prompt) {
    // 如果没有标题，使用prompt的前20个字符作为标题
    processedCard.title = processedCard.prompt.substring(0, 20) + "...";
  }
  
  if (!processedCard.summary && processedCard.response_summary) {
    // 如果没有summary，使用response_summary
    processedCard.summary = processedCard.response_summary;
  }
  
  if (!processedCard.author && processedCard.created_by) {
    // 如果没有author对象，根据created_by创建
    processedCard.author = {
      name: processedCard.created_by,
      avatar: null
    };
  }
  
  if (!processedCard.tags || !Array.isArray(processedCard.tags) || processedCard.tags.length === 0) {
    // 确保tags是一个非空数组
    processedCard.tags = ["未分类"];
  }
  
  // 如果没有templateData字段但有step数据，可以尝试从中创建templateData
  if (!processedCard.templateData && processedCard.step) {
    if (Array.isArray(processedCard.step)) {
      // step是数组，正常情况
    } else if (typeof processedCard.step === 'object') {
      // 如果step是一个对象而不是数组，尝试查找其中的templateData
      if (processedCard.step.templateData) {
        processedCard.templateData = processedCard.step.templateData;
      }
    }
  }
  
  console.log("处理后的卡片数据:", processedCard.id);
  return processedCard;
};

/**
 * 处理任务卡片数据
 * @param {Object} task - API返回的任务卡片数据
 * @returns {Object} - 处理后的任务数据
 */
export const processTaskCard = (task) => {
  // 处理雷达图数据
  const radarData = task.step && task.step.length > 0 && task.step[task.step.length - 1].score 
    ? task.step[task.step.length - 1].score
        .filter(s => s.dimension && s.dimension.length > 0)
        .flatMap(s => s.dimension.map(d => ({
          name: d.latitude,
          value: d.weight * 100 // 转换为百分比值
        }))) 
    : [];
  
  // 处理折线图数据
  const lineData = task.step 
    ? task.step.map((s, index) => ({
        name: `步骤${index + 1}`,
        value: s.score && s.score.length > 0 
          ? parseFloat(s.score[0].score) * 100 
          : 0 // 使用第一个评分，转换为百分比值
      })) 
    : [];
  
  // 处理时间戳
  const createdAt = task.created_at ? timestampToDate(task.created_at) : new Date();
  
  // 确保templateData正确设置
  let processedTask = {
    ...task,
    created_at: createdAt,
    agents: task.agents || {
      overall: false,
      agent1: false,
      agent2: false,
    },
    chartData: {
      radar: radarData,
      line: lineData
    },
    changes: [],
    credibilityChange: "+0.0%",
    scoreChange: "+0.0%",
  };
  
  // 如果没有templateData字段但有step数据，可以尝试从中创建templateData
  if (!processedTask.templateData && processedTask.step) {
    if (Array.isArray(processedTask.step)) {
      // 保持原有的step数组结构，不做修改
    } else if (typeof processedTask.step === 'object') {
      // 如果step是一个对象而不是数组，尝试查找其中的templateData
      if (processedTask.step.templateData) {
        processedTask.templateData = processedTask.step.templateData;
      }
    }
  }
  
  return processedTask;
};

/**
 * 处理探索列表响应
 * @param {Object} response - API返回的探索列表响应
 * @returns {Object} - 处理后的响应数据
 */
export const processExplorationsResponse = (response) => {
  // 如果响应为空或无效，返回默认结构
  if (!response || !response.cards) {
    return {
      cards: [],
      pagination: {
        total: 0,
        page: 1,
        per_page: 10
      }
    };
  }
  
  // 处理卡片数据
  const processedCards = Array.isArray(response.cards) 
    ? response.cards.map(processExplorationCard)
    : [];
  
  return {
    cards: processedCards,
    pagination: response.pagination || {
      total: 0,
      page: 1,
      per_page: 10
    },
    filter_echo: response.filter_echo || null,
    sort_echo: response.sort_echo || null
  };
};

/**
 * 处理任务列表响应
 * @param {Object} response - API返回的任务列表响应
 * @returns {Object} - 处理后的响应数据
 */
export const processTasksResponse = (response) => {
  // 如果响应为空或无效，返回默认结构
  if (!response || !response.cards) {
    return {
      cards: [],
      pagination: {
        total: 0,
        page: 1,
        per_page: 10
      }
    };
  }
  
  // 处理卡片数据
  const processedCards = Array.isArray(response.cards) 
    ? response.cards.map(processTaskCard)
    : [];
  
  return {
    cards: processedCards,
    pagination: response.pagination || {
      total: 0,
      page: 1,
      per_page: 10
    },
    filter_echo: response.filter_echo || null,
    sort_echo: response.sort_echo || null
  };
}; 