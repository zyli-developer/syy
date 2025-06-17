// viewManager.js - 管理保存的筛选视图

// 视图类型枚举
export const VIEW_TYPES = {
  EXPLORATION: 'exploration',
  TASK: 'task'
};

// 从localStorage获取保存的视图
export const getSavedViews = (viewType) => {
  try {
    const savedViewsJson = localStorage.getItem(`syntrust_${viewType}_views`);
    return savedViewsJson ? JSON.parse(savedViewsJson) : [];
  } catch (error) {
    console.error('获取保存的视图失败:', error);
    return [];
  }
};

// 保存视图到localStorage
export const saveView = (viewType, viewData) => {
  try {
    const savedViews = getSavedViews(viewType);
    
    // 生成视图名称（视图1, 视图2, ...）
    const viewNames = savedViews.map(view => view.name);
    let newViewName = '视图1';
    let counter = 1;
    
    while (viewNames.includes(newViewName)) {
      counter++;
      newViewName = `视图${counter}`;
    }
    
    // 创建新视图
    const newView = {
      id: Date.now().toString(),
      name: newViewName,
      filterParams: viewData.filterParams,
      sortParams: viewData.sortParams,
      createdAt: new Date().toISOString()
    };
    
    // 添加到现有视图列表
    savedViews.push(newView);
    
    // 保存到localStorage
    localStorage.setItem(`syntrust_${viewType}_views`, JSON.stringify(savedViews));
    
    return newView;
  } catch (error) {
    console.error('保存视图失败:', error);
    throw new Error('保存视图配置失败: ' + error.message);
  }
};

// 删除保存的视图
export const deleteView = (viewType, viewId) => {
  try {
    const savedViews = getSavedViews(viewType);
    const updatedViews = savedViews.filter(view => view.id !== viewId);
    localStorage.setItem(`syntrust_${viewType}_views`, JSON.stringify(updatedViews));
    return true;
  } catch (error) {
    console.error('删除视图失败:', error);
    return false;
  }
};

// 重命名保存的视图
export const renameView = (viewType, viewId, newName) => {
  try {
    const savedViews = getSavedViews(viewType);
    const updatedViews = savedViews.map(view => {
      if (view.id === viewId) {
        return { ...view, name: newName };
      }
      return view;
    });
    
    localStorage.setItem(`syntrust_${viewType}_views`, JSON.stringify(updatedViews));
    return true;
  } catch (error) {
    console.error('重命名视图失败:', error);
    return false;
  }
}; 