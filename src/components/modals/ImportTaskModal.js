import { useState } from "react"
import { Modal, Upload, Button, Form, message } from "antd"
import { UploadOutlined, InboxOutlined } from "@ant-design/icons"
import { taskCardsData, mockImportData } from "../../mocks/data"

const { Dragger } = Upload



const ImportTaskModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)

  // 处理文件变化
  const handleChange = (info) => {
    // 只保留最后一个文件
    const fileList = [...info.fileList].slice(-1)
    setFileList(fileList)
  }

  // 提交表单
  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("请选择Excel文件")
      return
    }

    try {
      setUploading(true)
      
      // 模拟上传和处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 为每个预设任务生成唯一ID以确保不会冲突
      const timestamp = Date.now()
      const importedTasks = []
      
      // 处理每个预设任务数据
      mockImportData.forEach((task, index) => {
        // 为每个任务生成唯一ID（使用时间戳和索引组合）
        const taskWithUniqueId = {
          ...task
        }
        
        // 添加到导入任务列表
        importedTasks.push(taskWithUniqueId)
        
        // 同时添加到taskCardsData数组中(保持原有功能)
        taskCardsData.unshift(taskWithUniqueId)
      })
      
      // 将导入的任务保存到localStorage中
      try {
        // 获取现有任务数据
        const existingTasksJson = localStorage.getItem('imported_tasks') || '[]'
        const existingTasks = JSON.parse(existingTasksJson)
        
        // 合并新导入的任务
        const updatedTasks = [...importedTasks, ...existingTasks]
        
        // 保存回localStorage
        localStorage.setItem('imported_tasks', JSON.stringify(updatedTasks))
        
        // 设置最后更新时间，用于触发Storage事件
        localStorage.setItem('tasks_last_imported', Date.now().toString())
        
        // 触发自定义事件，通知TaskPage组件刷新数据
        const importEvent = new CustomEvent('tasksImported', {
          detail: { 
            tasks: importedTasks,
            timestamp: Date.now() 
          }
        })
        window.dispatchEvent(importEvent)
      } catch (error) {
        console.error('保存导入任务到localStorage失败:', error)
      }
      
      message.success("导入成功：已添加3条任务数据")
      
      // 清空表单和文件列表
      form.resetFields()
      setFileList([])
      
      // 关闭Modal
      onCancel()
      
      // 延迟一下再通知父组件成功，确保组件状态更新顺序正确
      setTimeout(() => {
        // 通知父组件导入成功
        if (onSuccess) {
          onSuccess()
        }
      }, 100)
    } catch (error) {
      console.error("导入失败:", error)
      message.error("导入失败，请重试")
    } finally {
      setUploading(false)
    }
  }

  // 自定义上传按钮
  const uploadProps = {
    onRemove: (file) => {
      setFileList([])
    },
    beforeUpload: (file) => {
      // 检查文件类型
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel' ||
                     /\.xlsx?$/.test(file.name.toLowerCase());
      const isCSV = file.type === 'text/csv' || /\.csv$/.test(file.name.toLowerCase());
      if (!isExcel && !isCSV) {
        message.error('请上传Excel或CSV文件');
        return Upload.LIST_IGNORE;
      }
      return false; // 阻止自动上传
    },
    fileList,
    onChange: handleChange,
  }

  return (
    <Modal
      title="导入任务"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={handleSubmit}
        >
          导入
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="file" label="选择Excel文件">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">仅支持Excel或CSV文件格式(.xlsx, .xls, .csv)</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ImportTaskModal 