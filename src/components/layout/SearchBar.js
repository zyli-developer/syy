"use client"

import { useState } from "react"
import { Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"

/**
 * 搜索栏组件
 * @param {Object} props
 * @param {string} props.placeholder - 搜索框占位文本
 * @param {Function} props.onSearch - 搜索回调函数
 * @param {string} props.defaultValue - 默认搜索值
 * @param {string} props.className - 自定义类名
 */
const SearchBar = ({ placeholder = "搜索感兴趣的任务", onSearch, defaultValue = "", className = "" }) => {
  const [searchValue, setSearchValue] = useState(defaultValue)

  // 处理搜索值变化
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

  // 处理搜索提交
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue)
    }
  }

  return (
    <div className={`relative w-[832px] h-9 mx-auto my-4 ${className}`}>
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        onPressEnter={handleSearch}
        className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-300 focus:border-blue-500 focus:shadow-none"
        allowClear={false}
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-gray-500 hover:text-blue-500"
        onClick={handleSearch}
      >
        <SearchOutlined style={{ fontSize: "16px" }} />
      </button>
    </div>
  )
}

export default SearchBar
