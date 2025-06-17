"use client"
import { Link } from "react-router-dom"

const MenuItem = ({ item, toggleMenuItem, addMenuItem, removeMenuItem }) => {
  const handleToggle = (e) => {
    e.preventDefault()
    toggleMenuItem(item.id)
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    addMenuItem(item.id)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    removeMenuItem(item.id)
  }

  return (
    <div>
      <div className={`menu-item group ${item.active ? "active" : ""}`}>
        <Link to={item.path} className="flex items-center flex-1">
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.title}</span>
        </Link>
        <div className="flex items-center">
          {item.children && (
            <button onClick={handleToggle} className="mr-1 text-text-tertiary">
              {item.expanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          )}
          <button onClick={handleAdd} className="menu-item-icon mr-1 text-text-tertiary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button onClick={handleRemove} className="menu-item-icon text-text-tertiary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>
      {item.expanded && item.children && (
        <div className="pl-4">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              toggleMenuItem={toggleMenuItem}
              addMenuItem={addMenuItem}
              removeMenuItem={removeMenuItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuItem
