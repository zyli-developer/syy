"use client"

import { useState, useEffect } from 'react'
import { Empty, Pagination, Spin, Typography, Button, message } from 'antd'
import { DownOutlined, UpOutlined, DownloadOutlined } from '@ant-design/icons'
import AssetCard from './AssetCard'
import { useAssetStyles } from '../../styles/components/assets'
import DownloadReportModal from '../modals/DownloadReportModal'

const { Title } = Typography

/**
 * 资产列表组件
 * @param {Array} assets - 资产数据列表
 * @param {Boolean} loading - 加载状态
 * @param {Number} total - 总记录数
 * @param {Number} currentPage - 当前页码
 * @param {Number} pageSize - 每页记录数
 * @param {Function} onPageChange - 分页回调
 * @param {Boolean} isChatOpen - 聊天区域是否展开
 * @param {Number} refreshTrigger - 刷新触发器，当值变化时重新加载数据
 */
const AssetList = ({ 
  assets = [], 
  loading = false, 
  total = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  isChatOpen = false,
  refreshTrigger = 0
}) => {
  const { styles } = useAssetStyles()
  const [expandedSections, setExpandedSections] = useState({
    scenario: true,
    qa: true,
    flow: true,
    report: true
  })
  
  // 本地报告数据
  const [localReports, setLocalReports] = useState([])
  
  // 下载报告模态框状态
  const [downloadModalVisible, setDownloadModalVisible] = useState(false)
  const [reportDataForDownload, setReportDataForDownload] = useState([])
  // 存储原始报告数据的Map，用于下载
  const [reportDataMap, setReportDataMap] = useState({})
  
  // 按类型分组资产
  const groupAssetsByType = (assets) => {
    const groups = {
      scenario: [],
      qa: [],
      flow: [],
      report: [...localReports] // 添加本地报告数据
    }
    
    // 添加调试日志
    console.log('分组前的资产数据:', assets);
    console.log('本地报告数据:', localReports);
    
    assets.forEach(asset => {
      const type = asset.type || 'flow'
      // 添加调试日志
      // console.log('处理资产:', asset.id, '类型:', type);
      
      if (type === 'scenario') {
        groups.scenario.push(asset)
      } else if (type === 'qa') {
        groups.qa.push(asset)
      } else if (type === 'report') {
        // 确保不重复添加已经在localReports中的报告
        const isDuplicate = groups.report.some(report => report.id === asset.id);
        if (!isDuplicate) {
          groups.report.push(asset)
        }
      } else {
        groups.flow.push(asset)
      }
    })
    
    // 完成分组后记录结果
    console.log('资产分组结果:', {
      scenario: groups.scenario.length,
      qa: groups.qa.length,
      flow: groups.flow.length,
      report: groups.report.length
    });
    
    return groups
  }
  
  // 处理展开/收起区域
  const toggleSection = (sectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionType]: !prev[sectionType]
    }))
  }
  
  // 处理打开下载报告模态框
  const handleDownloadReport = (type) => {
    // 准备报告数据用于下载
    const groupedAssets = groupAssetsByType(assets);
    const reportsForDownload = groupedAssets[type] || [];
    
    // 创建报告数据映射
    const dataMap = {};
    
    // 格式化报告数据用于表格展示
    const formattedReports = reportsForDownload.map((report, index) => {
      const key = report.id || `report-${index}`;
      // 存储原始报告数据
      dataMap[key] = report;
      
      return {
        key,
        name: report.name || report.title || `报告 ${index + 1}`,
        creator: report.created_by || '系统',
        createdFrom: report.created_from || '报告生成器',
        createdAt: report.created_at ? 
                  (typeof report.created_at === 'object' && report.created_at.seconds ? 
                   new Date(report.created_at.seconds * 1000).toLocaleString() : 
                   typeof report.created_at === 'string' ? 
                   new Date(report.created_at).toLocaleString() : 
                   '未知日期') : 
                  '未知日期',
        summary: report.response_summary || report.summary || '无报告内容',
      };
    });
    
    setReportDataMap(dataMap);
    setReportDataForDownload(formattedReports);
    setDownloadModalVisible(true);
  }
  
  // 添加对自定义reportsUpdated事件的监听
  useEffect(() => {
    const handleReportsUpdated = (e) => {
      console.log('收到报告更新事件:', e.detail);
      // 立即重新加载报告数据
      loadReportsFromLocalStorage();
    };
    
    // 添加事件监听
    window.addEventListener('reportsUpdated', handleReportsUpdated);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('reportsUpdated', handleReportsUpdated);
    };
  }, []);
  
  // 也监听reports_last_updated存储变化
  useEffect(() => {
    const checkReportUpdate = () => {
      const lastUpdateTime = localStorage.getItem('reports_last_updated');
      if (lastUpdateTime) {
        console.log('检测到报告最后更新时间:', lastUpdateTime);
        loadReportsFromLocalStorage();
      }
    };
    
    // 初始检查
    checkReportUpdate();
    
    // 添加存储事件监听
    const handleStorageChange = (e) => {
      if (e.key === 'reports_last_updated') {
        checkReportUpdate();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 添加对task_reports直接变化的监听
  useEffect(() => {
    const handleTaskReportsChange = (e) => {
      if (e.key === 'task_reports') {
        console.log('检测到localStorage中的task_reports数据变化');
        loadReportsFromLocalStorage();
      }
    };
    
    // 添加事件监听
    window.addEventListener('storage', handleTaskReportsChange);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('storage', handleTaskReportsChange);
    };
  }, []);
  
  // 添加从localStorage加载报告数据的函数
  const loadReportsFromLocalStorage = () => {
    try {
      // 首先获取已生成的报告ID列表
      const generatedReportIdsJson = localStorage.getItem('generated_reports');
      let generatedReportIds = [];
      
      if (generatedReportIdsJson) {
        try {
          const parsedIds = JSON.parse(generatedReportIdsJson);
          if (Array.isArray(parsedIds)) {
            generatedReportIds = parsedIds;
            console.log('已生成报告ID列表:', generatedReportIds);
          }
        } catch (e) {
          console.error('解析generated_reports失败:', e);
        }
      }
      
      const reportDataJson = localStorage.getItem('task_reports');
      if (reportDataJson) {
        const reportData = JSON.parse(reportDataJson);
        if (Array.isArray(reportData) && reportData.length > 0) {
          console.log('从localStorage加载到报告数据:', reportData.length, '条');
          
          // 过滤出已标记为生成的报告
          let formattedReports;
          if (generatedReportIds.length > 0) {
            // 如果有明确的已生成报告ID列表，则按照列表过滤
            formattedReports = reportData
              .filter(report => generatedReportIds.includes(report.id))
              .map(report => ({
                ...report,
                type: 'report'
              }));
            console.log('已过滤报告数据:', formattedReports.length, '条');
          } else {
            // 如果没有已生成报告ID列表，则加载所有报告
            formattedReports = reportData.map(report => ({
              ...report,
              type: 'report'
            }));
          }
          
          // 更新本地报告数据
          setLocalReports(formattedReports);
          
          // 更新UI显示
          // 由于状态更新是异步的，我们需要确保在下一个渲染周期中能看到新报告
          setTimeout(() => {
            // 如果报告区域已经折叠，自动展开
            if (!expandedSections.report && formattedReports.length > 0) {
              setExpandedSections(prev => ({
                ...prev,
                report: true
              }));
            }
          }, 100);
          
          return formattedReports; // 返回加载的报告数据，方便调用者使用
        } else {
          console.log('localStorage中没有有效的报告数据');
          setLocalReports([]);
          return [];
        }
      } else {
        console.log('localStorage中没有报告数据');
        setLocalReports([]);
        return [];
      }
    } catch (error) {
      console.error('加载报告数据失败:', error);
      setLocalReports([]);
      return [];
    }
  };
  
  // 初始加载报告数据
  useEffect(() => {
    loadReportsFromLocalStorage();
  }, []);
  
  // 添加对reportGenerated事件的监听
  useEffect(() => {
    const handleReportGenerated = (event) => {
      console.log('收到reportGenerated事件:', event.detail);
      
      if (event.detail && event.detail.report) {
        // 方法1：直接将新报告添加到本地报告列表中
        const newReport = event.detail.report;
        setLocalReports(prevReports => {
          // 检查是否已存在相同ID的报告
          const exists = prevReports.some(report => report.id === newReport.id);
          if (exists) {
            // 如果已存在，更新这个报告
            return prevReports.map(report => 
              report.id === newReport.id ? { ...newReport, type: 'report' } : report
            );
          } else {
            // 如果不存在，添加到列表中
            return [...prevReports, { ...newReport, type: 'report' }];
          }
        });
        
        message.success('新报告已生成，已添加到报告列表');
      } else {
        // 方法2：如果事件没有包含完整报告数据，则从localStorage重新加载
        loadReportsFromLocalStorage();
      }
    };
    
    // 添加事件监听
    window.addEventListener('reportGenerated', handleReportGenerated);
    
    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('reportGenerated', handleReportGenerated);
    };
  }, []);
  
  // 渲染资产分组标题
  const renderSectionHeader = (title, type, count) => {
    const isExpanded = expandedSections[type]
    
    return (
      <div className={styles.sectionHeader}>
        <Title level={4} className={styles.sectionTitle}>{title} ({count})</Title>
        <div className={styles.sectionHeaderButtons}>
          {/* 只在报告分组中显示下载按钮 */}
          {type === 'report' && count > 0 && (
            <Button 
              type="link" 
              className={styles.downloadButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReport(type);
              }}
              icon={<DownloadOutlined />}
            >
              下载报告
            </Button>
          )}
          <Button 
            type="link" 
            className={styles.expandButton}
            onClick={() => toggleSection(type)}
            icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          >
            {isExpanded ? '收起' : '展开'}
          </Button>
        </div>
      </div>
    )
  }
  
  // 渲染资产卡片网格
  const renderAssetGrid = (assets) => {
    return (
      <div className={styles.cardGrid}>
        {assets.map((asset, index) => (
          <AssetCard 
            key={asset.id || index} 
            asset={asset} 
            onClick={asset.type === 'report' ? true : false} // 只有报告类型可以点击
          />
        ))}
      </div>
    )
  }
  
  // 渲染资产分组区域
  const renderSection = (title, type, assets) => {
    // 无论是否有数据，报告分组始终渲染（添加强制渲染逻辑）
    const shouldAlwaysRender = type === 'report';
    
    if (!shouldAlwaysRender && (!assets || assets.length === 0)) return null
    
    const isExpanded = expandedSections[type]
    // 默认只显示4条数据，展开时显示全部
    const displayedAssets = isExpanded ? assets : assets.slice(0, 4)
    
    return (
      <div className={styles.assetSection}>
        {renderSectionHeader(title, type, assets ? assets.length : 0)}
        <div className={styles.sectionBackground}>
          {displayedAssets && displayedAssets.length > 0 ? (
            renderAssetGrid(displayedAssets)
          ) : (
            <div className={styles.collapsedHint}>
              <Empty description={`暂无${title}数据`} />
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // 渲染资产卡片列表
  const renderAssetList = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      )
    }
    
    // 合并API资产和本地报告数据
    const allAssets = assets && assets.length > 0 ? assets : [];
    
    if (allAssets.length === 0 && localReports.length === 0) {
      return (
        <Empty 
          className={styles.emptyState}
          description="暂无资产数据" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )
    }
    
    // 按类型分组资产
    const groupedAssets = groupAssetsByType(allAssets);
    
    return (
      <div className={styles.assetSections}>
        {renderSection('报告', 'report', groupedAssets.report)}
        {renderSection('场景', 'scenario', groupedAssets.scenario)}
        {renderSection('问答', 'qa', groupedAssets.qa)}
        {renderSection('模板', 'flow', groupedAssets.flow)}
     
      </div>
    )
  }

  return (
    <div>
      {renderAssetList()}
      
      {/* {total > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 项`}
          />
        </div>
      )} */}
      
      {/* 使用新的下载报告模态框组件 */}
      <DownloadReportModal
        visible={downloadModalVisible}
        onClose={() => setDownloadModalVisible(false)}
        reports={reportDataForDownload}
        reportDataMap={reportDataMap}
      />
    </div>
  )
}

export default AssetList 