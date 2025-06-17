import { setupWorker } from "msw"
import { handlers } from "./handlers"

// 创建一个 MSW worker 实例
export const worker = setupWorker(...handlers)
