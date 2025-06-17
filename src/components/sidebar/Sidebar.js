"use client"

import { useState } from "react"
import WorkspaceHeader from "./WorkspaceHeader"
import MenuList from "./MenuList"
import UserInfo from "./UserInfo"
import { menuData } from "../../mocks/data"

const Sidebar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [menuItems, setMenuItems] = useState(menuData)

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive)
  }

  const toggleMenuItem = (id) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)))
  }

  const addMenuItem = (parentId) => {
    // 实现添加菜单项的逻辑
    console.log("Add menu item to", parentId)
  }

  const removeMenuItem = (id) => {
    // 实现删除菜单项的逻辑
    console.log("Remove menu item", id)
  }

  return (
    <aside className="min-w-[180px] border-r border-divider flex flex-col">
      <WorkspaceHeader isSearchActive={isSearchActive} toggleSearch={toggleSearch} />
      <div className="flex-1 overflow-y-auto px-4">
        <MenuList
          items={menuItems}
          toggleMenuItem={toggleMenuItem}
          addMenuItem={addMenuItem}
          removeMenuItem={removeMenuItem}
        />
      </div>
      <UserInfo />
    </aside>
  )
}

export default Sidebar
