"use client"

import { useNavContext } from "../../contexts/NavContext"

const ContentNav = () => {
  const { selectedNav, handleNavChange } = useNavContext()

  const navItems = [
    { key: "community", label: "Community" },
    { key: "workspace", label: "Workspace" },
    { key: "personal", label: "Personal" },
  ]

  return (
    <div className="w-full border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          {navItems.map((item, index) => (
            <div key={item.key} className="flex items-center">
              <button
                className={`py-4 px-2 font-small text-small transition-colors duration-200 ${
                  selectedNav === item.key ? "text-[#122415] font-semibold" : "text-[#afbcb6] hover:text-[#5d6d67]"
                }`}
                onClick={() => handleNavChange(item.key)}
              >
                {item.label}
              </button>

              {/* 分隔符，最后一项不显示 */}
              {index < navItems.length - 1 && <span className="text-[#afbcb6] px-2">|</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContentNav
