import { menuData as latestMenuData } from '../mocks/data';
/**
 * 菜单管理工具 - 管理保存的视图菜单
 */

const MENU_STORAGE_KEY = 'syntrust_menu_data';
const MENU_CHANGE_EVENT = 'syntrust_menu_changed'; // 菜单变化事件名称

// 创建自定义事件来通知菜单变化
export const notifyMenuChange = () => {
  try {
    // 创建自定义事件
    const event = new CustomEvent(MENU_CHANGE_EVENT, {
      detail: { timestamp: Date.now() }
    });
    
    // 在window上触发事件
    window.dispatchEvent(event);
    
    console.log('触发菜单变化事件');
  } catch (error) {
    console.error('触发菜单变化事件失败:', error);
  }
};

// 注册菜单变化监听器
export const registerMenuChangeListener = (callback) => {
  if (typeof callback === 'function') {
    window.addEventListener(MENU_CHANGE_EVENT, callback);
    return true;
  }
  return false;
};

// 移除菜单变化监听器
export const unregisterMenuChangeListener = (callback) => {
  if (typeof callback === 'function') {
    window.removeEventListener(MENU_CHANGE_EVENT, callback);
    return true;
  }
  return false;
};

// 新增：合并菜单数据（递归合并children）
export const mergeMenuData = (localMenu, latestMenu) => {
  if (!Array.isArray(localMenu) || !Array.isArray(latestMenu)) return latestMenu;
  // 以id+title为主键合并
  const map = new Map();
  latestMenu.forEach(item => map.set(item.id + '|' + item.title, { ...item }));
  localMenu.forEach(item => {
    const key = item.id + '|' + item.title;
    if (map.has(key)) {
      // 合并children
      if (Array.isArray(item.children) && Array.isArray(map.get(key).children)) {
        map.get(key).children = mergeMenuData(item.children, map.get(key).children);
      }
      // 保留本地的expanded等UI状态
      map.set(key, { ...map.get(key), ...item });
    } else {
      // id或title有冲突，直接新增为新项
      map.set(key + '_local', item);
    }
  });
  return Array.from(map.values());
};

// 修改getMenuData，自动合并最新菜单
export const getMenuData = () => {
  try {
    const menuDataJson = localStorage.getItem(MENU_STORAGE_KEY);
    const localMenu = menuDataJson ? JSON.parse(menuDataJson) : null;
    const latestMenu = latestMenuData;
    if (localMenu && latestMenu && latestMenu.length > 0) {
      const merged = mergeMenuData(localMenu, latestMenu);
      // 始终更新localStorage为合并后的最新数据
      saveMenuData(merged);
      return merged;
    }
    // 如果localMenu为空，直接保存并返回最新菜单
    if (latestMenu && latestMenu.length > 0) {
      saveMenuData(latestMenu);
      return latestMenu;
    }
    return localMenu;
  } catch (error) {
    console.error('获取菜单数据失败:', error);
    return null;
  }
};

// 保存菜单数据
export const saveMenuData = (menuData) => {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuData));
    
    // 触发菜单变化事件
    notifyMenuChange();
    
    return true;
  } catch (error) {
    console.error('保存菜单数据失败:', error);
    return false;
  }
};

// 添加保存的视图到菜单
export const addViewToMenu = (viewType, viewData) => {
  try {
    // 获取自增ID，存储在localStorage中
    let nextId = parseInt(localStorage.getItem('syntrust_menu_next_id') || '100');
    
    // 从localStorage获取或使用默认菜单数据
    let menuData = getMenuData() || [
      {
        id: 1,
        title: "探索",
        path: "/explore",
        icon: "ExploreIcon",
        active: true,
        children: []
      },
      {
        id: 2,
        title: "任务",
        path: "/tasks",
        icon: "TaskIcon",
        children: []
      },
      {
        id: 3,
        title: "资产",
        path: "/assets",
        icon: "AppstoreOutlined",
        children: []
      }
    ];
    
    // 生成视图名称（视图1, 视图2, ...）
    const parentMenuItem = viewType === 'exploration' 
      ? menuData.find(item => item.title === "探索") 
      : menuData.find(item => item.title === "任务");
    
    if (!parentMenuItem) {
      throw new Error(`未找到${viewType === 'exploration' ? '探索' : '任务'}菜单项`);
    }
    
    // 确保有children数组
    if (!parentMenuItem.children) {
      parentMenuItem.children = [];
    }
    
    // 生成名称
    const viewNames = parentMenuItem.children.map(item => item.title);
    let newViewName = '视图1';
    let counter = 1;
    
    while (viewNames.includes(newViewName)) {
      counter++;
      newViewName = `视图${counter}`;
    }
    
    // 确保筛选条件的values数组被正确保存
    let processedViewData = { ...viewData };
    
    // 如果有筛选参数，确保每个表达式的values属性是数组
    if (processedViewData.filterParams && processedViewData.filterParams.exprs) {
      processedViewData.filterParams.exprs = processedViewData.filterParams.exprs.map(expr => {
        // 确保values是一个数组
        if (!Array.isArray(expr.values)) {
          return {
            ...expr,
            values: expr.values !== undefined ? [expr.values] : []
          };
        }
        return expr;
      });
    }
    
    // 确保分组数据也被保存
    if (processedViewData.groupConfig && Array.isArray(processedViewData.groupConfig.fields)) {
      // 分组数据格式已正确，不需要额外处理
      console.log('保存分组配置:', processedViewData.groupConfig);
    }
    
    // 创建新的菜单项 - 使用与父级相同的主路径，加上view_id参数
    const viewId = nextId++;
    const newMenuItem = {
      id: viewId,
      title: newViewName,
      // 使用一级菜单的路径，但添加查询参数
      path: viewType === 'exploration' ? '/explore' : '/tasks',
      icon: parentMenuItem.icon, // 继承父菜单的图标
      isView: true, // 标记这是一个视图菜单项
      viewId: viewId.toString(),
      viewData: {
        filterParams: processedViewData.filterParams,
        sortParams: processedViewData.sortParams,
        groupConfig: processedViewData.groupConfig, // 添加分组配置
        viewType: viewType,
        createdAt: new Date().toISOString()
      }
    };
    
    console.log('保存的视图数据:', newMenuItem.viewData);
    
    // 添加到父菜单的children中
    parentMenuItem.children.push(newMenuItem);
    
    // 更新自增ID
    localStorage.setItem('syntrust_menu_next_id', nextId.toString());
    
    // 保存更新后的菜单数据
    saveMenuData(menuData);
    
    return {
      menuItem: newMenuItem,
      menuData: menuData
    };
  } catch (error) {
    console.error('添加视图到菜单失败:', error);
    throw new Error('保存视图到菜单失败: ' + error.message);
  }
};

// 获取保存的视图数据
export const getSavedViewData = (viewId) => {
  try {
    const menuData = getMenuData();
    if (!menuData) return null;
    
    // 查找所有菜单项中的视图数据
    for (const menuItem of menuData) {
      if (menuItem.children) {
        const viewMenuItem = menuItem.children.find(child => child.viewId === viewId);
        if (viewMenuItem && viewMenuItem.viewData) {
          console.log(`获取视图 ${viewId} 的数据:`, viewMenuItem.viewData);
          
          // 处理视图数据中的筛选条件
          const processedViewData = { ...viewMenuItem.viewData };
          
          // 确保筛选条件的格式正确
          if (processedViewData.filterParams) {
            // 如果是数组格式，需要特殊处理
            if (Array.isArray(processedViewData.filterParams)) {
              // 验证数组中的每个筛选条件
              processedViewData.filterParams = processedViewData.filterParams.map(filter => {
                if (filter.exprs) {
                  // 确保每个表达式的values是数组
                  filter.exprs = filter.exprs.map(expr => ({
                    ...expr,
                    values: Array.isArray(expr.values) ? expr.values : [expr.values]
                  }));
                }
                return filter;
              });
            } else if (processedViewData.filterParams.exprs) {
              // 如果是单个筛选条件对象
              processedViewData.filterParams.exprs = processedViewData.filterParams.exprs.map(expr => ({
                ...expr,
                values: Array.isArray(expr.values) ? expr.values : [expr.values]
              }));
            }
          }
          
          console.log(`处理后的视图 ${viewId} 数据:`, processedViewData);
          return processedViewData;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('获取保存的视图数据失败:', error);
    return null;
  }
};

// 删除保存的视图
export const deleteViewFromMenu = (viewId) => {
  try {
    const menuData = getMenuData();
    if (!menuData) return false;
    
    // 查找并删除指定的视图菜单项
    let found = false;
    for (const menuItem of menuData) {
      if (menuItem.children) {
        const initialLength = menuItem.children.length;
        menuItem.children = menuItem.children.filter(child => child.viewId !== viewId);
        
        if (initialLength > menuItem.children.length) {
          found = true;
          break;
        }
      }
    }
    
    if (found) {
      // 保存更新后的菜单数据
      saveMenuData(menuData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('从菜单删除视图失败:', error);
    return false;
  }
};

// 重命名保存的视图
export const renameViewInMenu = (viewId, newName) => {
  try {
    const menuData = getMenuData();
    if (!menuData) return false;
    
    // 查找并更新指定的视图菜单项
    let found = false;
    for (const menuItem of menuData) {
      if (menuItem.children) {
        for (const child of menuItem.children) {
          if (child.viewId === viewId) {
            child.title = newName;
            found = true;
            break;
          }
        }
        
        if (found) break;
      }
    }
    
    if (found) {
      // 保存更新后的菜单数据
      saveMenuData(menuData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('重命名菜单中的视图失败:', error);
    return false;
  }
}; 