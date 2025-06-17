# 登录页逻辑与功能说明

## 1. 登录主流程
- 支持手机号验证码、账号密码、SSO三种登录方式。
- 登录表单提交后，调用 `login` 方法。
- 登录成功后，判断用户信息中是否存在 workspace：
  - 有 workspace：直接登录成功，跳转首页。
  - 无 workspace：弹出 workspace 选择/创建弹窗。

## 2. Workspace 弹窗流程
- 弹窗分为两步：
  1. 选择"创建个人 Workspace"或"加入/创建组织 Workspace"。
  2. 选择"加入/创建组织 Workspace"后，进入 workspace 搜索与选择界面。

### 2.1 创建个人 Workspace
- 点击后提示"个人 Workspace 已自动创建"。
- （可扩展为自动分配个人 workspace 并写入用户信息）

### 2.2 加入/创建组织 Workspace
- 展示 workspace 搜索框和结果列表。
- 搜索框输入内容后，实时过滤 workspace 列表。
- 结果列表由 mock 数据 `/api/workspaces` 提供。
- 可点击选择某个 workspace。
- 下方有"新建 Workspace"与"登入"按钮：
  - "新建 Workspace"：目前仅提示，未实现具体功能。
  - "登入"：如未选中 workspace，提示"请选择或新建一个 Workspace"；选中后，模拟将 workspace 添加到用户信息，并关闭弹窗。

## 3. mock workspace 获取接口
- mock 数据定义在 `src/mocks/data.js`：
  ```js
  export const mockWorkspaces = [
    { id: 'ws1', name: 'Personal Workspace', type: 'personal' },
    { id: 'ws2', name: 'Enterprise Workspace 1', type: 'enterprise' },
    ...
  ];
  ```
- mock 接口定义在 `src/mocks/handlers.js`：
  ```js
  rest.get('/api/workspaces', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ workspaces: mockWorkspaces }));
  });
  ```
- 登录页通过 axios 调用 `/api/workspaces` 获取 workspace 列表。

## 4. 相关UI与交互
- 弹窗使用 Ant Design `Modal` 组件。
- 搜索与列表使用 `Input.Search` 和 `List`。
- 选中 workspace 高亮，未选中时"登入"按钮会提示。
- 所有图片资源均本地引入。

---
如需扩展 workspace 相关功能，可在 mock 数据和接口基础上继续开发。
