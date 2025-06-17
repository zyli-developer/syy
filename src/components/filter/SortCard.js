"use client"
import { Button, Select } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import CloseIcon from "../icons/CloseIcon"
import { sortFieldOptions, sortDirectionOptions } from "../../mocks/filterData"

const { Option } = Select

// 删除原来的硬编码数据
// const fieldOptions = ["场景", "标签", "作者", "来源", "创建时间", "更新时间", "可信度", "评分"]
// const directionOptions = [
//  { value: "asc", label: "升序" },
//  { value: "desc", label: "降序" },
// ]

const SortCard = ({ config, onConfigChange, onPrev, onSave, loading }) => {
  // 添加排序字段
  const addSortField = () => {
    if (config.fields.length >= 3) return // 最多3个排序

    onConfigChange({
      ...config,
      fields: [...config.fields, { field: "created_at", direction: "desc", id: Date.now().toString() }],
    })
  }

  // 移除排序字段
  const removeSortField = (id) => {
    onConfigChange({
      ...config,
      fields: config.fields.filter((field) => field.id !== id),
    })
  }

  // 更新排序字段
  const updateSortField = (id, field) => {
    onConfigChange({
      ...config,
      fields: config.fields.map((item) => (item.id === id ? { ...item, field } : item)),
    })
  }

  // 更新排序方向
  const updateSortDirection = (id, direction) => {
    onConfigChange({
      ...config,
      fields: config.fields.map((item) => (item.id === id ? { ...item, direction } : item)),
    })
  }

  return (
    <div>
      <div className="filter-card-header">
        <h3 className="filter-card-title">设置排序条件</h3>
      </div>
      <div className="filter-card-content">
        <div className="sort-options">
          {config.fields.map((item) => (
            <div key={item.id} className="sort-option">
              <div className="sort-field">
                <Select
                  value={item.field}
                  onChange={(value) => updateSortField(item.id, value)}
                  style={{ width: "100%" }}
                >
                  {sortFieldOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="sort-direction">
                <Select
                  value={item.direction}
                  onChange={(value) => updateSortDirection(item.id, value)}
                  style={{ width: "100%" }}
                >
                  {sortDirectionOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="sort-remove" onClick={() => removeSortField(item.id)}>
                <CloseIcon />
              </div>
            </div>
          ))}
        </div>

        {config.fields.length < 3 && (
          <a className="filter-add-condition absolute bottom-1" onClick={addSortField}>
            <PlusOutlined /> 添加排序
          </a>
        )}

        <div className="filter-actions">
          <Button className="filter-prev-btn" onClick={onPrev}>
            上一项
          </Button>
          <Button type="primary" className="filter-save-btn" onClick={onSave} loading={loading}>
            保存视图
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SortCard
