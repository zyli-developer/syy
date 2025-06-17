"use client"

import { useState, useEffect } from "react"
import { Typography, Spin, notification } from "antd"
import { useNavigate } from "react-router-dom"
import AssetList from "../components/asset/AssetList"
import FilterSystem from "../components/filter/FilterSystem"
import { useAssetStyles } from "../styles/components/assets"
import assetService from "../services/assetService"
import { assetData } from "../mocks/data" // 导入mock数据，确保直接可用
import { useChatContext } from "../contexts/ChatContext"

const { Title } = Typography

const AssetsPage = () => {
  const { styles } = useAssetStyles()
  const navigate = useNavigate()
  const { isChatOpen } = useChatContext()
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState([])
  const [reports, setReports] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12
  })
  
  // 当前Tab，用于API查询
  const [currentTab, setCurrentTab] = useState("community")
  
  // 筛选和排序状态
  const [filterParams, setFilterParams] = useState({
    tab: "community",
    filter: null,
    sort: { field: "created_at", desc: true },
    pagination: pagination
  })
  
  // 监听报告更新事件
  useEffect(() => {
    const handleReportsUpdated = (event) => {
      console.log('AssetsPage: 收到报告更新事件，详情:', event.detail);
      
      // 如果事件中包含报告数据，直接更新
      if (event.detail && event.detail.reports && Array.isArray(event.detail.reports)) {
        console.log('从事件中直接获取报告数据:', event.detail.reports.length);
        
        // 更新报告数据
        setReports(prev => {
          // 避免重复添加
          const newReports = event.detail.reports
            .filter(newReport => !prev.some(existingReport => existingReport.id === newReport.id))
            .map(report => ({ ...report, type: 'report' }));
          
          if (newReports.length > 0) {
            console.log(`添加 ${newReports.length} 个新报告`);
            return [...prev, ...newReports];
          }
          
          return prev;
        });
      } else {
        // 否则重新加载报告数据
        console.log('从localStorage加载报告数据');
        
        try {
          const reportDataJson = localStorage.getItem('task_reports');
          if (reportDataJson) {
            const reportData = JSON.parse(reportDataJson);
            if (Array.isArray(reportData) && reportData.length > 0) {
              console.log('从localStorage加载到报告数据:', reportData.length, '条');
              
              // 获取已生成的报告ID列表
              const generatedReportsJson = localStorage.getItem('generated_reports');
              let generatedReportIds = [];
              
              if (generatedReportsJson) {
                try {
                  const parsedIds = JSON.parse(generatedReportsJson);
                  if (Array.isArray(parsedIds)) {
                    generatedReportIds = parsedIds;
                  }
                } catch (e) {
                  console.error('解析generated_reports失败:', e);
                }
              }
              
              // 过滤和格式化报告数据
              const formattedReports = reportData
                .filter(report => generatedReportIds.length === 0 || generatedReportIds.includes(report.id))
                .map(report => ({
                  ...report,
                  type: 'report'
                }));
              
              // 合并报告数据，避免重复
              setReports(prev => {
                // 过滤掉已存在的报告
                const newReports = formattedReports.filter(
                  newReport => !prev.some(existingReport => existingReport.id === newReport.id)
                );
                
                if (newReports.length > 0) {
                  console.log(`添加 ${newReports.length} 个新报告`);
                  return [...prev, ...newReports];
                }
                
                return prev;
              });
            }
          }
        } catch (error) {
          console.error('加载报告数据失败:', error);
        }
      }
      
      // 增加刷新触发器的值，触发AssetList组件刷新
      setRefreshTrigger(prev => prev + 1);
    };
    
    // 处理报告生成事件
    const handleReportGenerated = (event) => {
      console.log('AssetsPage: 收到报告生成事件，详情:', event.detail);
      
      // 从事件中获取生成的报告ID和报告数据
      const generatedReportId = event.detail?.reportId;
      const generatedReport = event.detail?.report;
      
      if (generatedReportId) {
        // 从localStorage获取已生成的报告ID列表
        const generatedReportsJson = localStorage.getItem('generated_reports');
        let generatedReportIds = [];
        
        if (generatedReportsJson) {
          try {
            generatedReportIds = JSON.parse(generatedReportsJson);
          } catch (e) {
            console.error('解析已生成报告ID列表失败:', e);
            generatedReportIds = [];
          }
        }
        
        // 添加新生成的报告ID
        if (!generatedReportIds.includes(generatedReportId)) {
          generatedReportIds.push(generatedReportId);
          
          // 保存更新后的已生成报告ID列表
          localStorage.setItem('generated_reports', JSON.stringify(generatedReportIds));
          console.log('已更新生成的报告ID列表:', generatedReportIds);
          
          // 如果事件中包含报告数据，直接添加到reports数组
          if (generatedReport) {
            // 检查报告是否已存在于reports数组中
            setReports(prevReports => {
              const reportExists = prevReports.some(report => report.id === generatedReport.id);
              
              if (!reportExists) {
                console.log('添加新报告到列表:', generatedReport.id);
                return [...prevReports, { ...generatedReport, type: 'report' }];
              }
              
              console.log('报告已存在，不重复添加:', generatedReport.id);
              return prevReports;
            });
          } else {
            // 如果事件中没有报告数据，则从localStorage重新加载所有报告
            try {
              const reportDataJson = localStorage.getItem('task_reports');
              if (reportDataJson) {
                const reportData = JSON.parse(reportDataJson);
                if (Array.isArray(reportData)) {
                  // 找到新生成的报告
                  const newReport = reportData.find(report => report.id === generatedReportId);
                  
                  if (newReport) {
                    // 检查新报告是否已存在于reports数组中
                    setReports(prevReports => {
                      const reportExists = prevReports.some(report => report.id === generatedReportId);
                      
                      if (!reportExists) {
                        console.log('从localStorage添加新报告到列表:', generatedReportId);
                        return [...prevReports, { ...newReport, type: 'report' }];
                      }
                      
                      console.log('报告已存在，不重复添加:', generatedReportId);
                      return prevReports;
                    });
                  }
                }
              }
            } catch (error) {
              console.error('从localStorage加载报告数据失败:', error);
            }
          }
          
          // 增加刷新触发器的值，触发AssetList组件刷新
          setRefreshTrigger(prev => prev + 1);
        } else {
          console.log('报告ID已存在于生成列表中，不重复添加:', generatedReportId);
        }
      }
    };
    
    // 添加事件监听
    window.addEventListener('reportsUpdated', handleReportsUpdated);
    window.addEventListener('reportGenerated', handleReportGenerated);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('reportsUpdated', handleReportsUpdated);
      window.removeEventListener('reportGenerated', handleReportGenerated);
    };
  }, []);
  
  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = (e) => {
      // 监听报告相关的存储变化
      if (e.key === 'task_reports' || e.key === 'reports_last_updated' || e.key === 'reports_force_update' || e.key === 'generated_reports') {
        console.log(`AssetsPage: 检测到localStorage变化: ${e.key}`);
    
        setRefreshTrigger(prev => prev + 1);
      }
    };
    
    // 添加事件监听
    window.addEventListener('storage', handleStorageChange);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  

  
 
  

  
  // 获取本地备份数据
  const getFallbackData = () => {
    console.log('使用本地备份数据');
    if (assetData && assetData.length > 0) {
      // 过滤当前选择的tab
      let filteredAssets = [...assetData];
      
      if (filterParams.tab === "workspace") {
        filteredAssets = assetData.filter(asset => 
          asset.created_from === "Alibaba" || asset.created_from === "workspace"
        );
      } else if (filterParams.tab === "personal") {
        filteredAssets = assetData.filter(asset => asset.created_by === "Jackson");
      }
      
      // 应用分页
      const { page, per_page } = filterParams.pagination;
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      
      setAssets(filteredAssets.slice(startIndex, endIndex));
      setPagination({
        total: filteredAssets.length,
        page: page,
        per_page: per_page
      });
    } else {
      console.error('本地备份数据也不可用');
      setAssets([]);
    }
  }
  
  // 加载资产数据
  const loadAssets = async () => {
    try {
      setLoading(true)
      console.log('开始加载资产数据, 参数:', filterParams);
      
      const params = { ...filterParams }
      
      // 调用服务获取数据
      const result = await assetService.getAssets(params)
      console.log('获取到资产数据:', result);
      
      // 确保我们有卡片数据
      if (result && result.card && result.card.length > 0) {
        console.log('设置资产数据, 数量:', result.card.length);
        setAssets(result.card)
      } else {
        console.warn("未接收到卡片数据或数据为空，使用本地数据");
        // 使用本地备份数据
        getFallbackData();
      }
      
      // 更新分页信息
      if (result && result.pagination) {
        console.log('更新分页信息:', result.pagination);
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error("加载资产数据失败:", error)
      notification.error({
        message: "加载失败",
        description: "获取资产数据失败，使用本地备份数据"
      })
      // 使用本地备份数据
      getFallbackData();
    } finally {
      setLoading(false)
    }
  }
  
  // 处理搜索
  const handleSearch = (value) => {
    if (!value || !value.trim()) {
      // 如果搜索词为空，清除搜索条件
      setFilterParams(prev => ({
        ...prev,
        filter: {
          ...prev.filter,
          exprs: prev.filter?.exprs?.filter(expr => expr.field !== "keyword") || []
        },
        pagination: { ...prev.pagination, page: 1 }
      }))
    } else {
      // 添加搜索条件
      setFilterParams(prev => {
        const newFilter = { ...prev.filter } || { exprs: [] }
        
        // 如果没有filter或没有exprs，初始化
        if (!newFilter.exprs) {
          newFilter.exprs = []
        }
        
        // 移除旧的keyword筛选条件
        const filteredExprs = newFilter.exprs.filter(expr => expr.field !== "keyword")
        
        // 添加新的keyword筛选条件
        newFilter.exprs = [
          ...filteredExprs,
          { field: "keyword", op: "LIKE", values: [value] }
        ]
        
        return {
          ...prev,
          filter: newFilter,
          pagination: { ...prev.pagination, page: 1 }
        }
      })
    }
  }
  
  // 处理Tab切换
  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setFilterParams(prev => ({
      ...prev,
      tab: tab,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }
  
  // 处理过滤
  const handleFilterChange = (filter) => {
    setFilterParams(prev => ({
      ...prev,
      filter,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }
  
  // 处理排序
  const handleSortChange = (sort) => {
    setFilterParams(prev => ({
      ...prev,
      sort,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }
  
  // 处理分页
  const handlePageChange = (page, pageSize) => {
    setFilterParams(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page, per_page: pageSize }
    }))
  }
  
  // 直接初始化本地数据
  useEffect(() => {
    console.log('组件挂载，初始化本地数据');
    if (assets.length === 0 && !loading) {
      getFallbackData();
    }
    
    // 初始化加载报告数据
    try {
      const reportDataJson = localStorage.getItem('task_reports');
      const generatedReportsJson = localStorage.getItem('generated_reports');
      
      let generatedReportIds = [];
      if (generatedReportsJson) {
        try {
          const parsedIds = JSON.parse(generatedReportsJson);
          if (Array.isArray(parsedIds)) {
            generatedReportIds = parsedIds;
            console.log('初始化时，已生成报告ID列表:', generatedReportIds);
          }
        } catch (e) {
          console.error('解析generated_reports失败:', e);
        }
      }
      
      if (reportDataJson) {
        const reportData = JSON.parse(reportDataJson);
        if (Array.isArray(reportData) && reportData.length > 0) {
          console.log('初始化时，从localStorage加载到报告数据:', reportData.length, '条');
          
          // 过滤和格式化报告数据
          const formattedReports = reportData
            .filter(report => generatedReportIds.length === 0 || generatedReportIds.includes(report.id))
            .map(report => ({
              ...report,
              type: 'report'
            }));
          
          if (formattedReports.length > 0) {
            console.log('初始化时，设置报告数据:', formattedReports.length, '条');
            setReports(formattedReports);
          }
        }
      }
    } catch (error) {
      console.error('初始化加载报告数据失败:', error);
    }
  }, []);
  
  // 参数改变时重新加载数据
  useEffect(() => {
    loadAssets();
  }, [filterParams]);
  
  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.contentArea} ${isChatOpen ? styles.contentWithChat : styles.contentWithoutChat}`}>
        
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          currentFilter={filterParams.filter}
          currentSort={filterParams.sort}
        />
        
        <div className={styles.assetPageBackground}>
          <AssetList 
            assets={[
              // 过滤assets中的报告类型，避免与reports中的数据重复
              ...assets.filter(asset => asset.type !== 'report'),
              ...reports
            ]}
            loading={loading}
            total={pagination.total}
            currentPage={pagination.page}
            pageSize={pagination.per_page}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            isChatOpen={isChatOpen}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  )
}

export default AssetsPage
