"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Spin, Empty, Button, message } from "antd"
import { FilterOutlined, GroupOutlined } from "@ant-design/icons"
import { useLocation, useNavigate } from "react-router-dom"
import TaskCard from "../components/card/TaskCard"
import taskService from "../services/taskService"
import FilterSystem from "../components/filter/FilterSystem"
import SortIcon from "../components/icons/SortIcon"
import { useChatContext } from "../contexts/ChatContext"
import { useNavContext } from "../contexts/NavContext"
import ListFooter from "../components/common/ListFooter"


const TaskPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef()
  const { isChatOpen } = useChatContext()
  const { selectedNav, handleNavChange } = useNavContext()
  const [filterParams, setFilterParams] = useState(null)
  const [sortParams, setSortParams] = useState(null)
  const [forceRefresh, setForceRefresh] = useState(0)

  useEffect(() => {
    const activateTasksMenu = localStorage.getItem('activate_tasks_menu');
    if (activateTasksMenu === 'true') {
      const menuType = localStorage.getItem('activate_menu_type') || 'tasks';
      
      handleNavChange(menuType);
      console.log(`根据localStorage标记激活${menuType}菜单`);
      
      localStorage.removeItem('activate_tasks_menu');
      localStorage.removeItem('activate_menu_type');
    }
  }, [handleNavChange]);

  useEffect(() => {
    if (location.state?.refreshList) {
      console.log("任务页收到刷新请求，新任务ID:", location.state?.newTaskId);
      
      if (location.state?.activateTasksMenu) {
        const menuType = location.state?.menuType || 'tasks';
        
        handleNavChange(menuType);
        console.log(`已将导航设置为${menuType}任务`);
      }
      
      setTimeout(() => {
        if (location.state?.newTask) {
          const newTask = location.state.newTask;
          console.log("收到新优化任务数据:", newTask);
          
          setTasks(prevTasks => {
            const taskExists = prevTasks.some(task => task.id === newTask.id);
            if (taskExists) {
              return prevTasks;
            }
            return [newTask, ...prevTasks];
          });
          
          message.success(`优化任务已创建: ${newTask.title}`);
        } 
        else if (location.state?.newTaskId) {
          try {
            const taskData = localStorage.getItem(`task_${location.state.newTaskId}`);
            if (taskData) {
              const newTask = JSON.parse(taskData);
              console.log("从localStorage获取到新任务数据:", newTask);
              
              setTasks(prevTasks => {
                const taskExists = prevTasks.some(task => task.id === newTask.id);
                if (taskExists) {
                  return prevTasks;
                }
                return [newTask, ...prevTasks];
              });
              
              message.success(`优化任务已加载: ${newTask.title}`);
            } else {
              setForceRefresh(prev => prev + 1);
              message.info("任务列表已刷新");
            }
          } catch (error) {
            console.error("从localStorage加载任务失败:", error);
            setForceRefresh(prev => prev + 1);
          }
        } else {
          setForceRefresh(prev => prev + 1);
        }
      }, 200);
      
      return;
    }

    if (location.state?.refreshMenu) {
      console.log("任务页收到刷新菜单请求");
      
      if (location.state.preserveFilters) {
        if (location.state.filterParams) {
          setFilterParams(location.state.filterParams);
        }
        
        if (location.state.sortParams) {
          setSortParams(location.state.sortParams);
        }
      }
      
      return;
    }
    
    if (location.state?.clearFilters) {
      console.log("任务页收到清空筛选条件请求");
      
      setFilterParams(null);
      setSortParams(null);
      
      setTasks([]);
      
      setLoading(true);
      
      return;
    }
    
    if (location.state?.applyViewFilters) {
      try {
        if (location.state.filterParams) {
          setFilterParams(location.state.filterParams);
        }
        
        if (location.state.sortParams) {
          setSortParams(location.state.sortParams);
        }
        
        if (!location.state.filterParams && !location.state.sortParams) {
          const viewDataJson = localStorage.getItem('current_view_data');
          
          if (viewDataJson) {
            const viewData = JSON.parse(viewDataJson);
            
            if (viewData.filterParams) {
              setFilterParams(viewData.filterParams);
            }
            
            if (viewData.sortParams) {
              setSortParams(viewData.sortParams);
            }
          }
        }
        
        setTasks([]);
        
        setLoading(true);
        
        localStorage.removeItem('current_view_data');
      } catch (error) {
        console.error('应用视图筛选条件失败:', error);
      }
    }
  }, [location.state]);

  const getActiveTab = () => {
    if (location.pathname === "/tasks/my") return "my"
    if (location.pathname === "/tasks/team") return "team"
    return "all"
  }

  const getPageTitle = () => {
    if (selectedNav === "personal") return "我的任务"
    if (selectedNav === "workspace") return "工作区任务"
    return "社区任务"
  }

  const handleFilterChange = (filterConfig) => {
    console.log("任务页筛选条件变化:", filterConfig);
    if (!filterConfig) {
      setFilterParams(null);
      setTasks([]);
      setLoading(true);
      return;
    }
    
    if (filterConfig.exprs) {
      console.log("应用API格式的筛选条件:", filterConfig);
      setFilterParams(filterConfig);
    } 
    else if (filterConfig.conditions) {
      console.log("转换UI格式的筛选条件:", filterConfig.conditions);
      
      const apiFilter = [];
      
      filterConfig.conditions.forEach(condition => {
        const conditionValues = condition.values || [];
        if (conditionValues.length === 0) return;
        
        const expr = {
          field: condition.field,
          op: condition.operator.toUpperCase(),
          values: conditionValues
        };
        
        apiFilter.push({
          exprs: [expr]
        });
      });
      
      console.log("转换后的API筛选条件:", apiFilter);
      setFilterParams(apiFilter.length > 0 ? apiFilter : null);
    }
    
    setTasks([]);
    setLoading(true);
  };

  const handleSortChange = (sortConfig) => {
    console.log("任务页排序条件变化:", sortConfig);
    if (sortConfig && sortConfig.field !== undefined) {
      setSortParams(sortConfig);
      setTasks([]);
      setLoading(true);
      return;
    }
    
    if (sortConfig && sortConfig.fields && sortConfig.fields.length > 0) {
      const firstSort = sortConfig.fields[0];
      setSortParams({
        field: firstSort.field,
        desc: firstSort.direction === 'desc'
      });
    } else {
      setSortParams(null);
    }
    
    setTasks([]);
    setLoading(true);
  };

  const handleImportSuccess = () => {
    setForceRefresh(prev => prev + 1);
  };

  useEffect(() => {
    const handleTasksImported = (event) => {
      const { tasks, timestamp } = event.detail;
      if (tasks && Array.isArray(tasks)) {
        console.log('收到导入任务事件，导入任务数量:', tasks.length);
        
        setTasks(prevTasks => {
          return [...tasks, ...prevTasks];
        });
        
        message.success(`成功导入 ${tasks.length} 条任务数据`);
      }
    };
    
    const handleStorageChange = (e) => {
      if (e.key === 'tasks_last_imported') {
        console.log('检测到导入任务数据更新');
        try {
          const importedTasksJson = localStorage.getItem('imported_tasks');
          if (importedTasksJson) {
            const importedTasks = JSON.parse(importedTasksJson);
            
            const recentTasks = importedTasks.slice(0, 3);
            
            setTasks(prevTasks => {
              const newTasks = recentTasks.filter(importedTask => 
                !prevTasks.some(existingTask => existingTask.id === importedTask.id)
              );
              
              if (newTasks.length > 0) {
                return [...newTasks, ...prevTasks];
              }
              return prevTasks;
            });
          }
        } catch (error) {
          console.error('处理导入任务数据失败:', error);
        }
      }
    };
    
    window.addEventListener('tasksImported', handleTasksImported);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('tasksImported', handleTasksImported);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleGenerateReport = (selectedTaskIds) => {
    console.log('生成报告的任务ID:', selectedTaskIds);
    
    setLoading(true);
    
    setTimeout(() => {
      if (selectedTaskIds.length === 0) {
        console.log('创建演示报告...');
        const demoReport = {
          id: `report-demo-${Date.now()}`,
          taskId: 'demo-task',
          title: '演示报告 - 任务评估',
          type: 'report',
          content: '这是一个演示报告，展示报告功能的样式和布局。实际报告将基于任务评估数据生成。',
          createdAt: new Date().toISOString(),
          sourceTask: {
            id: 'demo-task',
            title: '演示任务',
            status: 'completed'
          }
        };
        
        try {
          const existingReportsJson = localStorage.getItem('task_reports') || '[]';
          const existingReports = JSON.parse(existingReportsJson);
          
          existingReports.push(demoReport);
          
          localStorage.setItem('task_reports', JSON.stringify(existingReports));
          
          console.log('已创建演示报告并保存');
          
          const reportEvent = new CustomEvent('reportsUpdated', {
            detail: { timestamp: Date.now() }
          });
          window.dispatchEvent(reportEvent);
          
          localStorage.setItem('reports_last_updated', Date.now().toString());
          
          setLoading(false);
          
          return;
        } catch (error) {
          console.error('保存演示报告失败:', error);
          setLoading(false);
        }
      }
      
      selectedTaskIds.forEach(taskId => {
        console.log(`正在为任务 ${taskId} 生成报告...`);
        
        const taskData = tasks.find(task => task.id === taskId);
        if (!taskData) {
          console.error(`找不到任务数据: ${taskId}`);
          return;
        }
        
        const reportData = {
          id: `report-${Date.now()}-${taskId}`,
          taskId: taskId,
          title: `${taskData.title} - 报告`,
          type: 'report',
          content: `这是任务 "${taskData.title}" 的报告内容`,
          createdAt: new Date().toISOString(),
          sourceTask: taskData
        };
        
        try {
          const existingReportsJson = localStorage.getItem('task_reports') || '[]';
          const existingReports = JSON.parse(existingReportsJson);
          
          existingReports.push(reportData);
          
          localStorage.setItem('task_reports', JSON.stringify(existingReports));
          
          console.log(`已为任务 ${taskId} 生成报告并保存`);
        } catch (error) {
          console.error(`保存报告数据失败:`, error);
          message.error('保存报告数据失败');
        }
      });
      
      try {
        const reportEvent = new CustomEvent('reportsUpdated', {
          detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(reportEvent);
        
        localStorage.setItem('reports_last_updated', Date.now().toString());
        
        console.log('已触发报告更新事件');
      } catch (error) {
        console.error('触发报告更新事件失败:', error);
      }
      
      setLoading(false);
      
      message.success('报告已生成');
    }, 5000);
  };

  const handleTaskUpdate = (taskId, updatedTask) => {
    console.log("任务状态已更新:", taskId, updatedTask);
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    
    try {
      localStorage.setItem(`task_${taskId}_status`, updatedTask.status);
    } catch (error) {
      console.error("保存任务状态到localStorage失败:", error);
    }
  };

  useEffect(() => {
    const handleTaskStatusEvent = (event) => {
      const { taskId, status } = event.detail;
      if (taskId && status) {
        handleTaskUpdate(taskId, { status });
      }
    };
    
    window.addEventListener('taskStatusUpdated', handleTaskStatusEvent);
    
    return () => {
      window.removeEventListener('taskStatusUpdated', handleTaskStatusEvent);
    };
  }, []);

  const lastTaskElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
        setLoading(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadTasks = async () => {
    if (!loading) return;
    try {
      const params = {
        tab: selectedNav || "community",
        pagination: {
          page,
          per_page: 10
        }
      };
      if (filterParams) params.filter = filterParams;
      if (sortParams) params.sort = sortParams;
      const response = await taskService.getTasks(params);
      setTasks((prev) => (page === 1 ? response.card : [...prev, ...response.card]));
      setHasMore(response.card.length > 0 && response.pagination.page * response.pagination.per_page < response.pagination.total);
      setError(null);
    } catch (err) {
      setError("加载数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) loadTasks();
  }, [page, selectedNav, filterParams, sortParams, loading]);

  useEffect(() => {
    setTasks([]);
    setFilterParams(null);
    setSortParams(null);
  }, [selectedNav]);

  return (
    <div className={`task-page ${isChatOpen ? "chat-open" : ""}`}>
      <div className="filter-container">
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onImportSuccess={handleImportSuccess}
          onGenerateReport={handleGenerateReport}
          currentFilter={filterParams}
          currentSort={sortParams}
        />
      </div>

      <div className="tasks-container" style={{width: isChatOpen ? "100%" : "832px"}}>
        {tasks.length > 0 ? (
          <div className="tasks-grid">
            {tasks.map((task, idx) => (
              <div key={task.id} ref={idx === tasks.length - 1 ? lastTaskElementRef : null}>
                <TaskCard task={task} onTaskUpdate={handleTaskUpdate} />
              </div>
            ))}
          </div>
        ) : !loading ? (
          <Empty description="暂无任务数据" />
        ) : null}
        {tasks.length > 0 && <ListFooter loading={loading} hasMore={hasMore} />}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default TaskPage;