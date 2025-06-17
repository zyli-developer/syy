"use client"

const WorkspaceHeader = ({ isSearchActive, toggleSearch }) => {
  return (
    <div className="p-4 flex items-center justify-between">
      {!isSearchActive ? (
        <>
          <h2 className="font-medium truncate">Alibaba</h2>
          <button onClick={toggleSearch} className="text-text-tertiary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </>
      ) : (
        <div className="w-full flex items-center">
          <input
            type="text"
            className="w-full border border-divider rounded-md px-2 py-1 text-sm"
            placeholder="搜索..."
            autoFocus
          />
          <button onClick={toggleSearch} className="ml-2 text-text-tertiary">
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
      )}
    </div>
  )
}

export default WorkspaceHeader
