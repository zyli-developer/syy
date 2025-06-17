"use client"
import Header from "./Header"
import Sidebar from "../sidebar/Sidebar"
import ChatArea from "../sidebar-chat/ChatArea"
import { useChatContext } from "../../contexts/ChatContext"

const Layout = ({ children }) => {
  const { isChatOpen, toggleChat } = useChatContext()

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 ${isChatOpen ? "w-2/3" : "w-full"} overflow-auto`}>{children}</main>
        {isChatOpen && <ChatArea className="w-1/3 border-l border-divider" />}
        {!isChatOpen && (
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => toggleChat()}
              className="w-24 h-24 bg-primary text-white rounded-[32px] flex items-center justify-center shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Layout
