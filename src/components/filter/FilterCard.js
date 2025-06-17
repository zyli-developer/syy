"use client"
import { Button, Select, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import CloseIcon from "../icons/CloseIcon"
import { fieldOptions, operatorOptions, valueOptions } from "../../mocks/filterData"
import { useEffect } from "react"

const { Option } = Select

// 删除原来的硬编码数据
// const fieldOptions = ["场景", "标签", "作者", "来源"]
// const operatorOptions = ["等于", "不等于", "包含", "不包含"]
// const valueOptions = {
//  场景: ["场景1", "场景2", "场景3", "场景4"],
//  标签: ["标签1", "标签2", "标签3", "标签4"],
//  作者: ["作者1", "作者2", "作者3", "作者4"],
//  来源: ["来源1", "来源2", "来源3", "来源4"],
// }

const FilterCard = ({ config, onConfigChange, onNext }) => {
  // 确保所有条件都有对应的值选项并且values属性存在
  useEffect(() => {
    // 检查条件中是否有任何需要修复的问题
    let needsFix = false;
    
    const updatedConditions = config.conditions.map(condition => {
      // 复制条件以便修改
      const newCondition = { ...condition };
      
      // 确保values属性存在，如果不存在则从value属性转换
      if (!Array.isArray(newCondition.values)) {
        if (newCondition.value !== undefined) {
          // 如果有value属性，转换为values数组
          newCondition.values = Array.isArray(newCondition.value) ? newCondition.value : [newCondition.value];
          console.log(`转换条件 ${newCondition.id} 的value到values:`, newCondition.values);
          needsFix = true;
        } else {
          // 如果没有value属性，初始化为空数组
          newCondition.values = [];
          needsFix = true;
        }
      }
      
      // 检查字段是否有对应的值选项
      if (!valueOptions[newCondition.field]) {
        console.warn(`字段 ${newCondition.field} 没有对应的值选项`);
      }
      
      return newCondition;
    });
    
    // 如果有任何条件需要修复，更新配置
    if (needsFix) {
      console.log("修复筛选条件中的values属性:", updatedConditions);
      onConfigChange({
        ...config,
        conditions: updatedConditions
      });
    }
  }, [config, onConfigChange]);

  // 添加新条件 - 使用fieldOptions中的第一个选项作为默认值
  const addCondition = () => {
    const defaultField = fieldOptions[0]; // 使用fieldOptions中的第一个字段
    const newCondition = {
      field: defaultField,
      operator: "等于",
      values: [],
      id: Date.now().toString(),
    }

    console.log("添加新条件:", newCondition);
    
    // 确保条件被添加到数组中
    const updatedConditions = [...config.conditions, newCondition];
    console.log("更新后的条件数组:", updatedConditions);
    
    onConfigChange({
      ...config,
      conditions: updatedConditions,
    });
  }

  // 移除条件
  const removeCondition = (id) => {
    onConfigChange({
      ...config,
      conditions: config.conditions.filter((condition) => condition.id !== id),
    })
  }

  // 更新条件字段
  const updateConditionField = (id, field) => {
    console.log(`更新条件 ${id} 的字段为:`, field);
    // 修改字段时，保留现有操作符，只清空values
    onConfigChange({
      ...config,
      conditions: config.conditions.map((condition) =>
        condition.id === id ? { 
          ...condition, 
          field: field,
          values: [], // 清空值
          value: undefined // 清空旧值
        } : condition
      ),
    })
  }

  // 更新条件操作符
  const updateConditionOperator = (id, operator) => {
    console.log(`更新条件 ${id} 的操作符为:`, operator);
    onConfigChange({
      ...config,
      conditions: config.conditions.map((condition) => (condition.id === id ? { ...condition, operator } : condition)),
    })
  }

  // 更新条件值
  const updateConditionValues = (id, values) => {
    console.log(`更新条件 ${id} 的值为:`, values);
    // 即使清空值也保留该条件，不再清空整行
    onConfigChange({
      ...config,
      conditions: config.conditions.map((condition) => (
        condition.id === id ? { 
          ...condition, 
          values: values || [], // 确保values始终是数组，即使是空数组
          value: values && values.length === 1 ? values[0] : values // 同时更新value属性以保持兼容性
        } : condition
      )),
    })
  }

  // 获取字段对应的值选项
  const getValueOptions = (field) => {
    // 确保字段有对应的值选项
    if (!valueOptions[field]) {
      console.warn(`未找到字段 ${field} 的值选项`);
      return [];
    }
    return valueOptions[field];
  }

  return (
    <div>
      <div className="filter-card-header">
        <h3 className="filter-card-title">设置筛选条件</h3>
      </div>
      <div className="filter-card-content">
        {config.conditions.map((condition) => (
          <div key={condition.id} className="filter-condition">
            <div className="filter-condition-field">
              <Select
                value={condition.field}
                onChange={(value) => updateConditionField(condition.id, value)}
                style={{ width: "100%" }}
              >
                {fieldOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-condition-operator">
              <Select
                value={condition.operator}
                onChange={(value) => updateConditionOperator(condition.id, value)}
                style={{ width: "100%" }}
              >
                {operatorOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-condition-value">
              {condition.operator !== "为空" && condition.operator !== "不为空" ? (
                <Select
                  mode="multiple"
                  value={condition.values || []} // 使用values，并提供默认空数组
                  onChange={(values) => updateConditionValues(condition.id, values)}
                  style={{ width: "100%" }}
                  placeholder="请选择值"
                  optionFilterProp="children"
                  showSearch
                  tagRender={(props) => (
                    <Tag color="blue" closable={props.closable} onClose={props.onClose} style={{ marginRight: 3 }}>
                      {props.value}
                    </Tag>
                  )}
                >
                  {getValueOptions(condition.field).map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              ) : (
                <div style={{ 
                  height: "32px", 
                  lineHeight: "32px", 
                  color: "#999", 
                  padding: "0 11px", 
                  background: "#f5f5f5",
                  borderRadius: "2px" 
                }}>
                  无需选择值
                </div>
              )}
            </div>
            <div className="filter-condition-remove" onClick={() => removeCondition(condition.id)}>
              <CloseIcon />
            </div>
          </div>
        ))}

        <a className="filter-add-condition absolute bottom-1" onClick={addCondition}>
          <PlusOutlined /> 新条件
        </a>

        <div className="filter-actions">
          <Button type="primary" className="filter-next-btn" onClick={onNext}>
            下一项
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterCard
