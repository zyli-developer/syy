"use client"

import { useState, useEffect } from "react"
import { Layout, Button, Dropdown, Modal, Input, message } from "antd"
import {
  SearchOutlined,
  FileOutlined,
  AppstoreOutlined,
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import menuService from "../../services/menuService"
import ExploreIcon from "../icons/ExploreIcon"
import TaskIcon from "../icons/TaskIcon"
import SearchIcon from "../icons/SearchIcon"
import UserInfoArea from "./UserInfoArea"
import workspaceService from "../../services/workspaceService"
import {
  getMenuData,
  getSavedViewData,
  saveMenuData,
  registerMenuChangeListener,
  unregisterMenuChangeListener,
} from "../../utils/menuManager"

const { Sider } = Layout

const AppSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    try {
      const userStr = localStorage.getItem('syntrust_user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        return userObj.workspace || null;
      }
    } catch {}
    return null;
  })
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  // 添加折叠状态
  const [isCollapsed, setIsCollapsed] = useState(false)
  // 添加手动展开/折叠状态
  const [expandedItems, setExpandedItems] = useState({})
  // 当前激活的菜单项ID
  const [activeItemId, setActiveItemId] = useState(null)
  // 当前激活的子菜单项ID
  const [activeSubItemId, setActiveSubItemId] = useState(null)
  // 重命名相关状态
  const [renameModalVisible, setRenameModalVisible] = useState(false)
  const [currentRenameItem, setCurrentRenameItem] = useState(null)
  const [newMenuName, setNewMenuName] = useState("")

  // 删除相关状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // 搜索相关状态
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 最近打开相关状态
  const [recentlyOpenedItems, setRecentlyOpenedItems] = useState([
    { id: "recent1", title: "AI 玩具测试", path: "/ai-toy-test", icon: "AppstoreOutlined" },
    { id: "recent2", title: "AI 玩具测试", path: "/ai-toy-test-2", icon: "AppstoreOutlined" },
  ])
  const [recentlyOpenedExpanded, setRecentlyOpenedExpanded] = useState(true)

  // 加载菜单数据的函数
  const loadMenuData = async () => {
    try {
      setLoading(true)
      console.log('loadMenuData')
      // 先从本地存储加载自定义菜单
      const customMenuData = getMenuData()
      console.log('customMenuData', customMenuData)
      if (customMenuData) {
        setMenuItems(customMenuData)

        // 初始化展开状态 - 有子菜单的项默认不展开
        const initialExpandState = {}
        customMenuData.forEach((item) => {
          if (item.children && item.children.length > 0) {
            initialExpandState[item.id] = false
          }
        })
        setExpandedItems(initialExpandState)

        // 根据当前路径设置初始激活状态
        initializeActiveState(customMenuData)
      } else {
        // 如果没有自定义菜单，则从API加载默认菜单
        const data = await menuService.getMenuItems()
        setMenuItems(data)

        // 根据当前路径设置初始激活状态
        initializeActiveState(data)
      }
    } catch (error) {
      console.error("获取菜单数据失败:", error)

      // 出错时尝试从API加载默认菜单
      try {
        const data = await menuService.getMenuItems()
        setMenuItems(data)

        // 根据当前路径设置初始激活状态
        initializeActiveState(data)
      } catch (err) {
        console.error("无法加载默认菜单:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  // 加载最近打开的项目
  const loadRecentlyOpenedItems = () => {
    // TODO: 实现从本地存储或API加载最近打开的项目
    // 这里只是UI展示，实际逻辑待实现
    console.log("加载最近打开的项目")
  }

  // 初始加载时获取菜单数据
  useEffect(() => {
    // 强制清空localStorage缓存，保证每次刷新都用最新mock合并
    loadMenuData();
    loadRecentlyOpenedItems();
  }, []);

  // 单独处理localStorage中的激活任务菜单标记
  useEffect(() => {
    // 检查是否需要激活任务菜单（从localStorage中）
    const shouldActivateTasksMenu = localStorage.getItem("activate_tasks_menu")
    if (shouldActivateTasksMenu === "true" && menuItems.length > 0) {
      // 查找任务菜单项
      menuItems.forEach((item) => {
        if (item.path === "/tasks") {
          // 设置激活状态
          setActiveItemId(item.id)
          setActiveSubItemId(null) // 清除子菜单激活状态
        }
      })

      // 使用后删除此标记
      localStorage.removeItem("activate_tasks_menu")
    }
  }, [menuItems])

  // 添加菜单变更监听器
  useEffect(() => {
    // 监听菜单变化的处理函数
    const handleMenuChange = () => {
      console.log("检测到菜单变化，重新加载菜单数据")
      loadMenuData()
    }

    // 注册菜单变化监听器
    registerMenuChangeListener(handleMenuChange)

    // 组件卸载时移除监听器
    return () => {
      unregisterMenuChangeListener(handleMenuChange)
    }
  }, [])

  // 根据当前路径初始化激活状态
  const initializeActiveState = (items) => {
    if (!items || items.length === 0) return

    // 查找匹配当前路径的菜单项
    let foundActiveItem = false

    // 首先检查子菜单项
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          // 如果location.state中有viewId，检查是否匹配
          if (location.state?.viewId && child.viewId === location.state.viewId) {
            setActiveItemId(item.id)
            setActiveSubItemId(child.id)
            setExpandedItems((prev) => ({ ...prev, [item.id]: true }))
            foundActiveItem = true
            break
          }
          // 否则检查路径是否匹配
          else if (location.pathname === child.path) {
            setActiveItemId(item.id)
            setActiveSubItemId(child.id)
            setExpandedItems((prev) => ({ ...prev, [item.id]: true }))
            foundActiveItem = true
            break
          }
        }
        if (foundActiveItem) break
      }
    }

    // 如果没有找到匹配的子菜单项，检查一级菜单项
    if (!foundActiveItem) {
      for (const item of items) {
        // 对于/explore路径，特殊处理
        if ((item.path === "/explore" && location.pathname === "/") || location.pathname === item.path) {
          setActiveItemId(item.id)
          setActiveSubItemId(null)
          foundActiveItem = true
          break
        }
      }
    }

    // 如果仍未找到匹配项，使用默认逻辑
    if (!foundActiveItem) {
      // 默认激活第一个菜单项
      if (items.length > 0) {
        setActiveItemId(items[0].id)
      }
    }
  }

  useEffect(() => {
    const fetchCurrentWorkspace = async () => {
      try {
        setWorkspaceLoading(true)
        const data = await workspaceService.getCurrentWorkspace()
        setCurrentWorkspace(data)
      } catch (error) {
        console.error("获取当前工作区失败:", error)
      } finally {
        setWorkspaceLoading(false)
      }
    }

    fetchCurrentWorkspace()
  }, [])

  // 检测是否在详情页，自动折叠侧边栏
  useEffect(() => {
    const isDetailPage = location.pathname.includes("/detail")
    setIsCollapsed(isDetailPage)

    // 如果在tasks路径且需要激活任务菜单
    if (location.pathname === "/tasks" && location.state?.activateTasksMenu) {
      // 查找任务菜单项
      menuItems.forEach((item) => {
        if (item.path === "/tasks") {
          // 设置激活状态
          setActiveItemId(item.id)
          setActiveSubItemId(null) // 清除子菜单激活状态
        }
      })
    }
    // 如果在一级路径上且带有视图ID，自动展开对应的菜单项
    else if ((location.pathname === "/explore" || location.pathname === "/tasks") && location.state?.viewId) {
      // 查找拥有该视图ID子项的父菜单
      menuItems.forEach((item) => {
        if (item.children && item.children.some((child) => child.viewId === location.state.viewId)) {
          setExpandedItems((prev) => ({ ...prev, [item.id]: true }))

          // 设置激活状态
          setActiveItemId(item.id)

          // 设置激活的子菜单项
          const activeChild = item.children.find((child) => child.viewId === location.state.viewId)
          if (activeChild) {
            setActiveSubItemId(activeChild.id)
          }
        }
      })
    }
    // 当页面路径变化时，可能需要更新最近打开的项目
    // TODO: 实现更新最近打开的项目的逻辑
  }, [location.pathname, location.state, menuItems])

    // 监听来自首页的搜索激活请求
  useEffect(() => {
    // 检查是否需要激活搜索模式（从location.state中）
    if (location.state?.activateSearch && !isCollapsed) {
      setIsSearchMode(true)
      // 清除状态，避免重复激活
      window.history.replaceState({}, document.title)
    }
  }, [location.state, isCollapsed])

  useEffect(() => {
    const handleStorage = () => {
      try {
        const userStr = localStorage.getItem('syntrust_user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          setCurrentWorkspace(userObj.workspace || null);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    // 兼容同页面内变更
    const interval = setInterval(handleStorage, 500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "SearchOutlined":
        return <SearchOutlined />
      case "FileOutlined":
        return <FileOutlined />
      case "AppstoreOutlined":
        return <AppstoreOutlined />
      case "ExploreIcon":
        return <ExploreIcon />
      case "TaskIcon":
        return <TaskIcon />
      case "ClockCircleOutlined":
        return <ClockCircleOutlined />
      default:
        return null
    }
  }

  // 切换菜单项的展开/折叠状态
  const toggleExpand = (e, itemId) => {
    e.stopPropagation() // 阻止事件冒泡，不触发菜单项点击
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  // 切换最近打开的展开/折叠状态
  const toggleRecentlyOpenedExpanded = (e) => {
    e.stopPropagation() // 阻止事件冒泡
    setRecentlyOpenedExpanded(!recentlyOpenedExpanded)
  }

  // 处理搜索点击事件
  const handleSearchClick = () => {
    if (isCollapsed) {
      // 在折叠状态下，导航到首页并激活搜索框
      navigate("/", {
        state: {
          activateSearch: true,
          clearFilters: true,
        },
      })

      // 激活首页对应的菜单项
      const exploreItem = menuItems.find((item) => item.path === "/explore" || item.path === "/")
      if (exploreItem) {
        setActiveItemId(exploreItem.id)
        setActiveSubItemId(null)
      }
    } else {
      // 在展开状态下，直接激活搜索模式
      setIsSearchMode(true)
    }
  }

  // 处理菜单项点击事件
  const handleMenuItemClick = (e, item) => {
    e.preventDefault()

    // 如果点击的是子菜单项（视图），只设置子菜单项为激活状态
    if (item.viewId) {
      setActiveSubItemId(item.id)
      // 不设置一级菜单为激活状态
    } else {
      // 如果点击的是主菜单项，设置主菜单项为激活状态并清除子菜单激活状态
      setActiveItemId(item.id)
      setActiveSubItemId(null)
    }

    // 处理视图菜单项
    if (item.isView && item.viewId) {
      // 获取视图数据
      const viewData = getSavedViewData(item.viewId)

      if (viewData) {
        // 深拷贝视图数据以确保不会有引用问题
        const viewDataCopy = JSON.parse(JSON.stringify(viewData))

        console.log("应用视图数据:", viewDataCopy)

        // 验证视图数据中的筛选条件
        if (!viewDataCopy.filterParams) {
          viewDataCopy.filterParams = null
        } else if (Array.isArray(viewDataCopy.filterParams)) {
          // 确保所有的筛选条件都有正确格式
          const validFilters = viewDataCopy.filterParams.filter(
            (filter) => filter && filter.exprs && Array.isArray(filter.exprs) && filter.exprs.length > 0,
          )

          viewDataCopy.filterParams = validFilters.length > 0 ? validFilters : null
        } else if (viewDataCopy.filterParams.exprs) {
          // 确保单个筛选条件有正确的exprs数组
          if (!Array.isArray(viewDataCopy.filterParams.exprs) || viewDataCopy.filterParams.exprs.length === 0) {
            viewDataCopy.filterParams = null
          }
        } else {
          // 无效的筛选条件格式
          viewDataCopy.filterParams = null
        }

        // 验证视图数据中的排序条件
        if (!viewDataCopy.sortParams || typeof viewDataCopy.sortParams !== "object" || !viewDataCopy.sortParams.field) {
          viewDataCopy.sortParams = null
        }

        console.log("处理后的视图数据:", viewDataCopy)

        // 设置视图数据到localStorage，以便页面组件加载时使用
        localStorage.setItem("current_view_data", JSON.stringify(viewDataCopy))

        // 跳转到主路径
        navigate(item.path, {
          state: {
            viewId: item.viewId,
            applyViewFilters: true,
            filterParams: viewDataCopy.filterParams,
            sortParams: viewDataCopy.sortParams,
          },
        })

        return
      }
    }

    // 对于普通菜单项（一级菜单），清空筛选条件
    navigate(item.path, {
      state: {
        clearFilters: true, // 添加标志，指示页面组件清空筛选条件
      },
    })
    // TODO: 如果需要，将点击的项目添加到最近打开的列表中
  }

  // 处理最近打开的项目点击
  const handleRecentItemClick = (e, item) => {
    e.preventDefault()

    // 导航到对应的路径
    navigate(item.path)

    // TODO: 更新最近打开的项目的访问时间或其他相关信息
  }

  // 从最近打开列表中移除项目
  const removeRecentItem = (e, itemId) => {
    e.stopPropagation() // 阻止事件冒泡，不触发项目点击

    // 更新最近打开的项目列表，移除指定的项目
    setRecentlyOpenedItems(recentlyOpenedItems.filter((item) => item.id !== itemId))

    // TODO: 从存储中移除该项目
  }

  // 处理菜单项重命名
  const handleRenameClick = (e, item, parentId) => {
    // 在Ant Design的Dropdown菜单项点击事件中，e是{key, keyPath, domEvent}
    // 如果e有domEvent属性，则使用它，否则直接使用e
    if (e && e.domEvent && e.domEvent.stopPropagation) {
      e.domEvent.stopPropagation()
    } else if (e && e.stopPropagation) {
      e.stopPropagation() // 原始事件对象直接使用
    }

    setCurrentRenameItem({ ...item, parentId })
    setNewMenuName(item.title)
    setRenameModalVisible(true)
  }

  // 处理重命名确认
  const handleRenameConfirm = () => {
    if (!newMenuName.trim()) {
      message.error("菜单名称不能为空")
      return
    }

    // 更新菜单数据
    const updatedMenuItems = menuItems.map((item) => {
      if (item.id === currentRenameItem.parentId) {
        return {
          ...item,
          children: item.children.map((child) =>
            child.id === currentRenameItem.id ? { ...child, title: newMenuName } : child,
          ),
        }
      }
      return item
    })

    setMenuItems(updatedMenuItems)

    // 保存更新后的菜单数据
    saveMenuData(updatedMenuItems)

    message.success("重命名成功")
    setRenameModalVisible(false)
  }

  // 处理重命名取消
  const handleRenameCancel = () => {
    setRenameModalVisible(false)
  }

  // 处理菜单项删除点击
  const handleDeleteClick = (e, item, parentId) => {
    // 在Ant Design的Dropdown菜单项点击事件中，e是{key, keyPath, domEvent}
    // 如果e有domEvent属性，则使用它，否则直接使用e
    if (e && e.domEvent && e.domEvent.stopPropagation) {
      e.domEvent.stopPropagation()
    } else if (e && e.stopPropagation) {
      e.stopPropagation() // 原始事件对象直接使用
    }

    setItemToDelete({ ...item, parentId })
    setDeleteModalVisible(true)
  }

  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return

    // 更新菜单数据，过滤掉要删除的子菜单项
    const updatedMenuItems = menuItems.map((item) => {
      if (item.id === itemToDelete.parentId) {
        return {
          ...item,
          children: item.children.filter((child) => child.id !== itemToDelete.id),
        }
      }
      return item
    })

    setMenuItems(updatedMenuItems)

    // 保存更新后的菜单数据
    saveMenuData(updatedMenuItems)

    message.success("删除成功")
    setDeleteModalVisible(false)

    // 如果删除的是当前激活的子菜单项，清除激活状态
    if (activeSubItemId === itemToDelete.id) {
      setActiveSubItemId(null)
    }
  }

  // 处理删除取消
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false)
  }

  // 渲染子菜单项
  const renderSubMenuItems = (children, parentId) => {
    if (!children || children.length === 0) return null

    return (
      <div className="pl-7 pr-2 mt-1">
        {children.map((child) => (
          <div
            key={child.id}
            className={`flex items-center justify-between px-3 py-2 rounded-full cursor-pointer mb-0.5 h-8 w-[180px] transition-all ${
              activeSubItemId === child.id ? "bg-white border border-black" : "hover:bg-[#f0f7ff]"
            }`}
          >
            <div className="flex items-center flex-1" onClick={(e) => handleMenuItemClick(e, child)}>
              <span className="flex items-center justify-center text-sm text-[#595959] mr-2">
                {child.icon && getIconComponent(child.icon)}
              </span>
              <span className="text-xs text-black">{child.title}</span>
            </div>

            <Dropdown
              menu={{
                items: [
                  ...(!child.disableRename ? [{
                    key: "rename",
                    icon: <EditOutlined />,
                    label: "重命名",
                    onClick: (info) => handleRenameClick(info, child, parentId),
                  }] : []),
                  ...(!child.disableDelete ? [{
                    key: "delete",
                    icon: <DeleteOutlined />,
                    label: "删除",
                    onClick: (info) => handleDeleteClick(info, child, parentId),
                    danger: true,
                  }] : []),
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                className="bg-transparent border-none cursor-pointer p-0.5 rounded text-[#8c8c8c] text-sm flex items-center justify-center opacity-0 transition-opacity hover:bg-[#f0f0f0] hover:text-[#1890ff] group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisOutlined />
              </button>
            </Dropdown>
          </div>
        ))}
      </div>
    )
  }

  const renderMenuItem = (item) => {
    // 检查是否有子菜单
    const hasChildren = item.children && item.children.length > 0

    // 检查是否激活 - 一级菜单只有在点击自身且没有激活的子菜单时才激活
    const isActive = activeItemId === item.id && !activeSubItemId

    // 检查是否应该展开子菜单 - 通过手动展开状态或者有激活的子菜单
    const isExpanded =
      expandedItems[item.id] || (hasChildren && item.children.some((child) => activeSubItemId === child.id))

    return (
      <div key={item.id} className="mb-0.5 group">
        <div
          className={`flex items-center justify-between cursor-pointer transition-colors relative rounded-full ${
            isActive ? "bg-white border border-black" : "hover:bg-[#f0f7ff] text-black"
          } ${isCollapsed ? "h-10 w-10 mx-auto justify-center" : "h-10 w-[200px] mx-[14px] px-4 py-2"}`}
          onClick={(e) => handleMenuItemClick(e, item)}
        >
          <div className={`flex items-center ${isCollapsed ? "justify-center mx-auto" : "gap-3"}`}>
            <span className="flex items-center justify-center text-base text-black">
              {item.icon && getIconComponent(item.icon)}
            </span>
            {!isCollapsed && <span className="text-sm text-black">{item.title}</span>}
          </div>

          {/* 对有子菜单的项添加展开/折叠图标，仅在非折叠状态下显示 */}
          {!isCollapsed && hasChildren && (
            <span
              className="text-xs text-[#8c8c8c] p-1 rounded transition-all ml-1 hover:bg-[rgba(0,0,0,0.04)] hover:text-[#1890ff]"
              onClick={(e) => toggleExpand(e, item.id)}
            >
              {isExpanded ? <MinusOutlined /> : <PlusOutlined />}
            </span>
          )}
        </div>

        {/* 仅当不折叠且有子菜单且手动展开或有激活的子项时渲染子菜单 */}
        {!isCollapsed && hasChildren && isExpanded && renderSubMenuItems(item.children, item.id)}
      </div>
    )
  }

  // 渲染最近打开的项目
  const renderRecentlyOpenedItems = () => {
    if (isCollapsed) return null

    return (
      <div className="mt-4 fixed top-[448px] bg-white border-t border-gray-200">
        {/* 最近打开标题栏 */}
        <div
          className="flex items-center justify-between px-3 py-2 w-[200px] hover:bg-[#f0f7ff] rounded-full cursor-pointer mx-[14px] text-black"
          onClick={toggleRecentlyOpenedExpanded}
        >
          <div className="flex items-center gap-2">
            <span className="">
              <ClockCircleOutlined />
            </span>
            <span className="font-medium">最近打开</span>
          </div>
          <span>{recentlyOpenedExpanded ? <MinusOutlined /> : <PlusOutlined />}</span>
        </div>

        {/* 分割线 */}
        <div className="mx-4 my-2">
          <div className="w-[196px] h-[0.5px] bg-gray-300"></div>
        </div>

        {/* 最近打开的项目列表 */}
        {recentlyOpenedExpanded && (
          <div className="mx-[14px] max-h-60 overflow-y-auto">
            {recentlyOpenedItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-3 py-2 w-[200px] hover:bg-[#f0f7ff] rounded-full cursor-pointer ${activeItemId === item.id ? "bg-white border border-black" : ""}`}
                onClick={(e) => handleRecentItemClick(e, item)}
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center">{getIconComponent(item.icon)}</span>
                  <span className="text-sm">{item.title}</span>
                </div>
                <button
                  className="opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer"
                  onClick={(e) => removeRecentItem(e, item.id)}
                >
                  <CloseOutlined />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 渲染顶部 Logo 区域
  const renderLogoArea = () => {
    return (
      <div className={`flex items-center text-[#122415] ${isCollapsed ? "justify-center p-2" : "px-4 py-6"}`}>
        <div className="flex items-center justify-center w-8 h-8 bg-[#58bd6d] rounded-md text-white font-bold">S</div>
        {!isCollapsed && (
          <div className="flex flex-col justify-between ml-2">
            <span className="font-medium text-sm">可信</span>
            <span className="font-light text-[10px]">syntrusthub.agentour.app</span>
          </div>
        )}
      </div>
    )
  }

  // 渲染工作区区域
  const renderWorkspaceArea = () => {
    // 在折叠状态下不渲染搜索输入框，避免布局问题
    if (isCollapsed) {
      return null
    }

    if (isSearchMode) {
      return (
        <div className="px-4 pb-1 h-[30px]">
          <Input
            autoFocus
            placeholder="搜索…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => {
              console.log("执行搜索:", searchTerm)
              // TODO: dispatch your search action…
            }}
            className="h-8"
            suffix={
              <CloseOutlined
                onClick={() => {
                  setIsSearchMode(false)
                  setSearchTerm("")
                }}
              />
            }
          />
        </div>
      )
    }

    return (
      <div className="flex items-center px-4 pb-1 h-[30px]">
        <div className="flex items-center justify-center w-4 h-4 bg-[#1a1a1a] rounded-md text-white font-bold text-[10px] mr-3">
          A
        </div>
        <div className="font-semibold text-xs">
          {workspaceLoading ? "加载中..." : currentWorkspace ? currentWorkspace.name : "Alibaba"}
        </div>
        <Button className="ml-auto" type="text" icon={<SearchIcon />} onClick={handleSearchClick} size="small" />
      </div>
    )
  }

  // 渲染搜索按钮（仅在折叠状态下）
  const renderSearchButton = () => {
    if (!isCollapsed) return null

    return (
      <div className="flex justify-center my-4">
        <Button
          type="text"
          icon={<SearchOutlined className="text-gray-500" />}
          onClick={handleSearchClick}
          size="large"
          className="w-10 h-10 flex items-center justify-center"
        />
      </div>
    )
  }

  return (
    <>
      <Sider
        className={`bg-white text-black transition-all duration-300 ${isCollapsed ? "w-16" : "w-[228px]"}`}
        width={isCollapsed ? 64 : 228}
        collapsible
        collapsed={isCollapsed}
        trigger={null}
        collapsedWidth={64}
      >
        {/* 顶部公司标识 */}
        {renderLogoArea()}

        {/* 工作区标志、名称 & 搜索 */}
        {renderWorkspaceArea()}

        {/* 搜索按钮（仅在折叠状态下） */}
        {renderSearchButton()}

        {/* 分割线 */}
        <div className={`mx-4 my-2 ${isCollapsed ? "hidden" : ""}`}>
          <div className="w-[196px] h-[0.5px] bg-gray-300"></div>
        </div>

        {/* 菜单容器 */}
        <div className={`flex-1 overflow-y-auto hide-scrollbar overflow-x-hidden py-2 max-h-80 ${isCollapsed ? "flex flex-col items-center gap-6" : ""}`}>
          {loading ? <div className="p-4 text-center">加载中...</div> : menuItems.map(renderMenuItem)}
        </div>

        {/* 最近打开的项目 */}
        {renderRecentlyOpenedItems()}

        {/* 个人信息区域 - 固定在底部 */}
        <div className={`absolute bottom-0 left-0 w-full ${isCollapsed ? "flex justify-center" : "px-3 pb-3"}`}>
          <UserInfoArea isCollapsed={isCollapsed} />
        </div>
      </Sider>

      {/* 重命名菜单项的Modal */}
      <Modal
        title="重命名菜单"
        open={renameModalVisible}
        onOk={handleRenameConfirm}
        onCancel={handleRenameCancel}
        okText="确认"
        cancelText="取消"
      >
        <Input
          placeholder="请输入新的菜单名称"
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          style={{ marginTop: "16px" }}
        />
      </Modal>

      {/* 删除菜单项的确认Modal */}
      <Modal
        title="删除菜单"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除菜单"{itemToDelete?.title}"吗？此操作不可撤销。</p>
      </Modal>
    </>
  )
}

export default AppSidebar
