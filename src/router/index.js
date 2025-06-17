import { Routes, Route } from "react-router-dom"
import ExplorePage from "../pages/ExplorePage"
import TaskPage from "../pages/TaskPage"
import TaskDetailPage from "../pages/TaskDetailPage"
import CardDetailPage from "../pages/CardDetailPage"
import EvaluationPage from "../pages/EvaluationPage"
import AssetsPage from "../pages/AssetsPage"
import ScenesPage from "../pages/ScenesPage"
import PersonalInfoPage from "../pages/personal-info"
import ProposalSquarePage from "../pages/ProposalSquarePage"
import FindFriendsPage from "../pages/FindFriendsPage"

// 子路由配置
const taskRoutes = [
  {
    path: "/tasks",
    element: <TaskPage />,
  },
  {
    path: "/tasks/detail/:id",
    element: <TaskDetailPage />,
  },
  {
    path: "/tasks/evaluate/:id",
    element: <EvaluationPage />,
  },
]

// 卡片路由
const cardRoutes = [
  {
    path: "/cards/detail/:id",
    element: <CardDetailPage />,
  },
  {
    path: "/explore/detail/:id",
    element: <CardDetailPage />,
  },
]

const assetsRoutes = [
  {
    path: "/assets/templates",
    element: <div>模板资产页面</div>,
  },
  {
    path: "/assets/my-templates",
    element: <div>我的模板页面</div>,
  },
  {
    path: "/assets/others-templates",
    element: <div>别人的模板页面</div>,
  },
]

const mainRoutes = [
  {
    path: "/",
    element: <ExplorePage />,
  },
  {
    path: "/explore",
    element: <ExplorePage />,
  },
  {
    path: "/explore/proposals",
    element: <ProposalSquarePage />,
  },
  {
    path: "/explore/friends",
    element: <FindFriendsPage />,
  },
  {
    path: "/tasks",
    element: <TaskPage />,
  },
  {
    path: "/assets",
    element: <AssetsPage />,
  },
  {
    path: "/scenes",
    element: <ScenesPage />,
  },
  {
    path: "/personal-info",
    element: <PersonalInfoPage />,
  },
]

// 所有路由配置
const allRoutes = [...mainRoutes, ...taskRoutes, ...assetsRoutes, ...cardRoutes]

// 路由组件
const AppRouter = () => {
  return (
    <Routes>
      {allRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default AppRouter
