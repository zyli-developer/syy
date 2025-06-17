"use client"

const ChatHeader = ({ user, onClose }) => {
  return (
    <div className="p-4 border-b border-divider flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
          <img
            src={user.avatar || "/placeholder.svg?height=32&width=32"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-2">
          <div className="font-medium">{user.name}</div>
          <div className="flex items-center text-xs">
            <span className="w-2 h-2 bg-secondary rounded-full mr-1"></span>
            <span className="text-text-tertiary">Active</span>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="text-text-tertiary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default ChatHeader
