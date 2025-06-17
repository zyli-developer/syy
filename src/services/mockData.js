export const mockQAData = {
  title: "问答详情",
  content: `问：如何评估大语言模型的性能？

答：评估大语言模型的性能需要从多个维度进行综合考量：

1. 准确性：模型输出的内容是否准确、可靠，是否存在事实性错误。

2. 流畅性：生成的文本是否自然流畅，符合语言习惯。

3. 相关性：回答是否切中要点，与问题高度相关。

4. 一致性：模型的输出是否前后一致，逻辑是否连贯。

5. 鲁棒性：面对各种输入时的表现是否稳定。

6. 安全性：是否会产生有害、偏见或不当的内容。

7. 效率：响应速度和资源消耗情况。

8. 创新性：是否能提供独特的见解和创新性的解决方案。

通过构建综合的评估体系，结合自动化指标和人工评估，可以全面了解模型的性能表现。`
};

export const mockSceneData = {
  title: "场景详情",
  nodes: [
    {
      id: '1',
      type: 'input',
      data: { label: '生成内容测评' },
      position: { x: 250, y: 25 },
      style: {
        background: '#f0f7ff',
        border: '1px solid #006ffd',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '2',
      data: { label: '车辆交通相关' },
      position: { x: 250, y: 125 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '3',
      data: { label: '包含歧视性内容' },
      position: { x: 250, y: 225 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '4',
      data: { label: '对老年驾驶员提供的建议是否含有年龄歧视' },
      position: { x: 100, y: 325 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        width: '280px'
      }
    },
    {
      id: '5',
      data: { label: '针对驾驶员背景（如种族）的偏见歧视' },
      position: { x: 400, y: 325 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        width: '280px'
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#006ffd' }
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animated: true,
      style: { stroke: '#006ffd' }
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      animated: true,
      style: { stroke: '#006ffd' }
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
      animated: true,
      style: { stroke: '#006ffd' }
    }
  ],
  annotations: [
    {
      id: 1,
      nodeId: '1',
      content: '评估生成内容的质量和合规性',
      author: {
        name: 'Alice',
        avatar: 'A'
      },
      time: '10:30'
    },
    {
      id: 2,
      nodeId: '3',
      content: '检查内容中是否存在任何形式的歧视',
      author: {
        name: 'Bob',
        avatar: 'B'
      },
      time: '11:45'
    }
  ]
};

export const mockTemplateData = {
  nodes: [
    {
      id: '1',
      type: 'default',
      data: { label: '开始评估' },
      position: { x: 250, y: 0 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '2',
      type: 'default',
      data: { label: '检查输入合规性' },
      position: { x: 250, y: 100 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '3',
      type: 'default',
      data: { label: '执行评估流程' },
      position: { x: 250, y: 200 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '4',
      type: 'default',
      data: { label: '生成评估报告' },
      position: { x: 100, y: 300 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    },
    {
      id: '5',
      type: 'default',
      data: { label: '提供优化建议' },
      position: { x: 400, y: 300 },
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
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#006ffd' }
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animated: true,
      style: { stroke: '#006ffd' }
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      animated: true,
      style: { stroke: '#006ffd' }
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
      animated: true,
      style: { stroke: '#006ffd' }
    }
  ]
}; 