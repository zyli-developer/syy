import Logo from "../common/Logo"

const Header = () => {
  return (
    <header className="h-12 flex items-center px-2 border-b border-divider">
      <div className="flex items-center min-w-[228px]">
        <Logo />
        <h1 className="text-sm font-medium ml-2 truncate">可信AI公共服务平台</h1>
      </div>
      <div className="flex-1 h-full">
        <img src="/placeholder.svg?height=48&width=800" alt="活动banner" className="h-full w-full object-cover" />
      </div>
    </header>
  )
}

export default Header
