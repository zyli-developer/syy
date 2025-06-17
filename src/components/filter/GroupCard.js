"use client"
import { Button, Select } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import CloseIcon from "../icons/CloseIcon"
import { groupFieldOptions } from "../../mocks/filterData"

const { Option } = Select

// 删除原来的硬编码数据
// const fieldOptions = ["场景", "标签", "作者", "来源", "创建时间"]

const GroupCard = ({ config, onConfigChange, onPrev, onNext }) => {
  // 添加分组字段
  const addGroupField = () => {
    if (config.fields.length >= 3) return // 最多3个分组

    onConfigChange({
      ...config,
      fields: [...config.fields, { field: "场景", id: Date.now().toString() }],
    })
  }

  // 移除分组字段
  const removeGroupField = (id) => {
    onConfigChange({
      ...config,
      fields: config.fields.filter((field) => field.id !== id),
    })
  }

  // 更新分组字段
  const updateGroupField = (id, field) => {
    onConfigChange({
      ...config,
      fields: config.fields.map((item) => (item.id === id ? { ...item, field } : item)),
    })
  }

  return (
    <div>
      <div className="filter-card-header">
        <h3 className="filter-card-title">设置分组条件</h3>
      </div>
      <div className="filter-card-content">
        <div className="group-options">
          {config.fields.map((item) => (
            <div key={item.id} className="group-option">
              <div className="group-field">
                <Select
                  value={item.field}
                  onChange={(value) => updateGroupField(item.id, value)}
                  style={{ width: "100%" }}
                >
                  {groupFieldOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="group-remove" onClick={() => removeGroupField(item.id)}>
                <CloseIcon />
              </div>
            </div>
          ))}
        </div>

        {config.fields.length < 3 && (
          <a className="filter-add-condition absolute bottom-1" onClick={addGroupField}>
            <PlusOutlined /> 添加分组
          </a>
        )}

        <div className="filter-actions">
          <Button className="filter-prev-btn" onClick={onPrev}>
            上一项
          </Button>
          <Button type="primary" className="filter-next-btn" onClick={onNext}>
            下一项
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GroupCard
