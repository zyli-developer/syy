// Mock data
let mockAnnotations = [
  // {
  //   id: 1,
  //   content: '这里可以补充具体的评估指标',
  //   tag: 'suggestion',
  //   start: 52,
  //   end: 82,
  //   selectedText: '模型输出的内容是否准确、可靠，是否存在事实性错误',
  //   author: {
  //     name: 'Alice',
  //     avatar: 'A'
  //   },
  //   time: '10:30',
  //   attachments: [
  //     { name: '评估指标.pdf', url: '#' }
  //   ]
  // },
  // {
  //   id: 2,
  //   content: '建议添加具体的评估工具和框架',
  //   tag: 'important',
  //   start: 285,
  //   end: 315,
  //   selectedText: '通过构建综合的评估体系，结合自动化指标',
  //   author: {
  //     name: 'Bob',
  //     avatar: 'B'
  //   },
  //   time: '11:45',
  //   attachments: []
  // }
];

export const getAnnotations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockAnnotations]);
    }, 500);
  });
};

export const addAnnotation = (annotation) => {
  return new Promise((resolve) => {
    const newAnnotation = {
      id: mockAnnotations.length + 1,
      ...annotation,
      author: {
        name: 'Current User',
        avatar: 'U'
      },
      time: new Date().toLocaleTimeString(),
      tag: 'important'
    };
    
    mockAnnotations = [...mockAnnotations, newAnnotation];
    setTimeout(() => {
      resolve(newAnnotation);
    }, 500);
  });
};

export const deleteAnnotation = (id) => {
  return new Promise((resolve) => {
    mockAnnotations = mockAnnotations.filter(a => a.id !== id);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// 导出默认服务对象
const annotationService = {
  getAnnotations,
  addAnnotation,
  deleteAnnotation
};

export default annotationService; 