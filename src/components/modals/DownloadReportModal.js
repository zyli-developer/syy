import { useState, useEffect } from 'react';
import { Modal, Button, Table, message, Typography, Tag } from 'antd';
import colorToken from '../../styles/utils/colorToken';

const { Text } = Typography;

/**
 * 下载报告模态框组件
 * @param {boolean} visible - 控制模态框显示/隐藏
 * @param {function} onClose - 关闭模态框的回调函数
 * @param {array} reports - 报告数据数组
 * @param {object} reportDataMap - 报告原始数据映射
 */
const DownloadReportModal = ({ 
  visible, 
  onClose, 
  reports = [],
  reportDataMap = {}
}) => {
  // 选中的行keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // 在modal关闭时重置选中状态
  useEffect(() => {
    if (!visible) {
      setSelectedRowKeys([]);
    }
  }, [visible]);
  
  // 处理表格行选择变化
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  
  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  
  // 格式化所有报告内容，生成单个HTML文件
  const formatMultipleReportsContent = (reports) => {
    try {
      // 确保报告数据有默认值
      const defaultValues = {
        score: 80,
        credibility: 85,
        prompt: "这是默认提示内容",
        response: "这是默认响应内容",
        tags: ["报告"]
      };

      // 整理报告数据，确保必要字段存在
      const formattedReports = reports.map((report, index) => {
        // 提取数据，并设置默认值
        const processedReport = {
          index: index + 1,
          id: report.id || `report-${index + 1}`,
          title: report.name || report.title || `报告 ${index + 1}`,
          prompt: report.prompt || report.question || defaultValues.prompt,
          response: report.response_summary || report.summary || report.response || defaultValues.response,
          score: Number(report.score || report.rating || defaultValues.score).toFixed(1),
          credibility: Number(report.credibility || report.confidence || defaultValues.score).toFixed(0),
          credibilityChange: report.credibilityChange || report.scoreChange || '+0%',
          createdAt: report.created_at ? 
                     (typeof report.created_at === 'object' && report.created_at.seconds ? 
                      new Date(report.created_at.seconds * 1000).toLocaleString() : 
                      typeof report.created_at === 'string' ? 
                      new Date(report.created_at).toLocaleString() : 
                      '未知日期') : 
                     new Date().toLocaleString(),
          tags: Array.isArray(report.tags) ? report.tags : 
                Array.isArray(report.keywords) ? report.keywords : defaultValues.tags,
        };
        
        return processedReport;
      });

      // 生成HTML内容，只包含报告汇总表格
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Syntrust报告汇总 - ${new Date().toLocaleDateString()}</title>
  <style>
    :root {
      --color-primary: ${colorToken.colorPrimary};
      --color-primary-hover: ${colorToken.colorPrimaryHover};
      --color-primary-active: ${colorToken.colorPrimaryActive};
      --color-primary-bg: ${colorToken.colorPrimaryBg};
      --color-heavy: ${colorToken.colorHeavy};
      --color-assist-1: ${colorToken.colorAssist1};
      --color-assist-2: ${colorToken.colorAssist2};
      --color-success: ${colorToken.colorSuccess};
      --color-error: ${colorToken.colorError};
      --color-text-base: ${colorToken.colorTextBase};
      --color-text-secondary: ${colorToken.colorTextSecondary};
      --color-text-tertiary: ${colorToken.colorTextTertiary};
      --color-bg-container: ${colorToken.colorBgContainer};
      --color-bg-layout: ${colorToken.colorBgLayout};
      --color-border: ${colorToken.colorBorder};
      --color-border-secondary: ${colorToken.colorBorderSecondary};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: var(--color-text-base);
      background-color: var(--color-bg-layout);
      padding: 20px;
      line-height: 1.5;
    }
    
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .report-container {
      margin-bottom: 40px;
      background: var(--color-bg-container);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    
    .header {
      background: var(--color-primary);
      color: white;
      padding: 16px 24px;
    }
    
    .title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .subtitle {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .reports-summary {
      background: ${colorToken.colorPrimaryBg};
      padding: 12px 24px;
      border-bottom: 1px solid var(--color-border-secondary);
    }
    
    .summary-text {
      color: var(--color-text-secondary);
      font-size: 14px;
    }
    
    .report-count {
      color: var(--color-primary);
      font-weight: 600;
    }
    
    /* 表格样式 */
    .table-container {
      width: 100%;
      overflow-x: auto;
      padding: 16px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    
    thead {
      background-color: ${colorToken.colorPrimaryBg};
    }
    
    th {
      padding: 10px;
      text-align: left;
      font-weight: 600;
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-primary);
      white-space: nowrap;
    }
    
    td {
      padding: 8px 10px;
      border-bottom: 1px solid var(--color-border-secondary);
    }
    
    tr:nth-child(even) {
      background-color: ${colorToken.colorBgLayout};
    }
    
    tr:hover {
      background-color: ${colorToken.colorPrimaryBg};
    }
    
    .footer {
      background: #f9fafc;
      padding: 16px 24px;
      text-align: center;
      color: var(--color-text-tertiary);
      font-size: 12px;
      border-top: 1px solid var(--color-border-secondary);
    }
    
    @media print {
      body {
        background-color: white;
        padding: 0;
      }
      
      .page-container {
        max-width: none;
      }
      
      .report-container {
        box-shadow: none;
        border-radius: 0;
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="report-container">
      <div class="header">
        <h1 class="title">Syntrust评估报告汇总</h1>
        <div class="subtitle">生成时间: ${new Date().toLocaleString()}</div>
      </div>
      
      <div class="reports-summary">
        <p class="summary-text">共包含 <span class="report-count">${formattedReports.length}</span> 个报告</p>
      </div>
      
      <!-- 报告汇总表格 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>报告标题</th>
              <th>问题</th>
              <th>答案</th>
              <th>评分</th>
              <th>可信度</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            ${formattedReports.map(report => `
            <tr>
              <td>${report.index}</td>
              <td>${report.title}</td>
              <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${report.prompt}">${report.prompt}</td>
              <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${report.response}">${report.response}</td>
              <td class="score-cell" style="color: var(--color-success);">${report.score}</td>
              <td>${report.credibility}%</td>
              <td>${report.createdAt}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Syntrust Dashboard · 报告生成时间: ${new Date().toLocaleString()}
      </div>
    </div>
  </div>
</body>
</html>
      `;
      
      return html;
    } catch (error) {
      console.error('格式化多个报告内容失败:', error);
      console.error(error.stack);
      // 返回简单HTML作为后备
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Syntrust报告汇总</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: ${colorToken.colorPrimary}; }
            .error { color: ${colorToken.colorError}; }
          </style>
        </head>
        <body>
          <h1>Syntrust报告汇总</h1>
          <p>生成时间: ${new Date().toLocaleString()}</p>
          <p class="error">报告生成过程中发生错误，请重试。</p>
          <p>错误信息: ${error.message}</p>
        </body>
        </html>
      `;
    }
  };
  
  // 处理下载选中报告
  const handleDownloadSelectedReports = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要下载的报告');
      return;
    }
    
    try {
      // 获取选中报告的原始数据
      const selectedReports = selectedRowKeys.map(key => {
        // 优先从reportDataMap中获取完整的报告数据
        return reportDataMap[key] || reports.find(r => r.key === key)?.originalData;
      }).filter(Boolean);
      
      if (selectedReports.length === 0) {
        message.warning('选中的报告数据无效');
        return;
      }

      console.log('选中的报告原始数据:', selectedReports);
      
      // 生成单个HTML文件包含所有选中的报告
      const reportsContent = formatMultipleReportsContent(selectedReports);
      const blob = new Blob([reportsContent], { type: 'text/html' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Syntrust报告_${new Date().toISOString().split('T')[0]}.html`;
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success(`成功下载 ${selectedReports.length} 个报告`);
    } catch (error) {
      console.error('下载选中报告失败:', error);
      message.error('下载选中报告失败');
    }
  }
  
  // 处理下载所有报告
  const handleDownloadAllReports = () => {
    try {
      // 获取所有报告原始数据
      const allReports = reports.map(report => {
        // 优先使用reportDataMap中的完整数据
        return reportDataMap[report.key] || report.originalData || report;
      }).filter(Boolean);
      
      if (allReports.length === 0) {
        message.warning('没有可下载的报告数据');
        return;
      }
      
      // 生成单个HTML文件包含所有报告
      const reportsContent = formatMultipleReportsContent(allReports);
      const blob = new Blob([reportsContent], { type: 'text/html' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Syntrust所有报告_${new Date().toISOString().split('T')[0]}.html`;
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success(`成功下载 ${allReports.length} 个报告`);
    } catch (error) {
      console.error('下载所有报告失败:', error);
      message.error('下载所有报告失败');
    }
  }

  // 定义下载报告模态框的列配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Text ellipsis={{ tooltip: text || record.title }}>{text || record.title}</Text>,
    },
    {
      title: '问题',
      dataIndex: 'prompt',
      key: 'prompt',
      width: 180,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: '回答',
      dataIndex: 'response',
      key: 'response',
      width: 180,
      render: (text, record) => <Text ellipsis={{ tooltip: text || record.response_summary }}>{text || record.response_summary}</Text>,
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (text) => <Text style={{ color: 'var(--color-success)' }}>{text}</Text>,
    },
    {
      title: '可信度',
      dataIndex: 'credibility',
      key: 'credibility',
      width: 80,
      render: (text) => <Text>{text}%</Text>,
    },
  ];

  return (
    <Modal
      title="下载报告"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button 
          key="downloadSelected" 
          type="primary" 
          disabled={selectedRowKeys.length === 0}
          onClick={handleDownloadSelectedReports}
        >
          下载选中项 ({selectedRowKeys.length})
        </Button>,
        <Button key="downloadAll" onClick={handleDownloadAllReports}>
          下载全部
        </Button>,
      ]}
      width={800}
    >
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={reports.map(report => {
          // 获取报告的原始数据 - 可能存储在reportDataMap中
          const originalReport = reportDataMap[report.key] || report;
          
          // 从step数组中提取评分和可信度信息
          const firstStep = originalReport.step && Array.isArray(originalReport.step) ? originalReport.step[0] : null;
          const firstScore = firstStep?.score && Array.isArray(firstStep.score) 
            ? firstStep.score[0] 
            : (firstStep?.score || null);
          
          // 智能提取评分
          const scoreValue = originalReport.score || 
            (firstScore?.score ? parseFloat(firstScore.score).toFixed(1) : '0.0');
          
          // 智能提取可信度
          let credibility = '';
          if (originalReport.credibility) {
            credibility = typeof originalReport.credibility === 'number' ? 
              originalReport.credibility.toFixed(0) : originalReport.credibility.toString().replace('%', '');
          } else if (firstScore?.confidence) {
            const confValue = parseFloat(firstScore.confidence);
            credibility = (confValue > 1 ? confValue : confValue * 100).toFixed(0);
          } else {
            credibility = '0';
          }
          
          return {
            key: report.key,
            name: report.name,
            // 从原始报告数据中提取问题和回答
            prompt: originalReport.prompt || originalReport.question || '未提供问题',
            response: originalReport.response_summary || originalReport.summary || report.summary || '未提供回答',
            score: scoreValue,
            credibility: credibility,
            // 保存原始数据引用，用于下载时使用
            originalData: originalReport
          };
        })}
        pagination={{ pageSize: 5 }}
        scroll={{ y: 300 }}
        size="small"
        bordered
      />
    </Modal>
  );
};

export default DownloadReportModal; 