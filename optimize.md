# CardDetailPage.js 优化模式逻辑总结

## 优化模式入口
- 优化模式由 `isOptimizationMode` 控制，切换后进入多步骤流程。
- 步骤条（OptimizationSteps）展示所有优化阶段，当前步骤由 `currentOptimizationStep` 控制。
- 步骤标题顺序：
  1. 结果质询
  2. QA优化
  3. 场景优化
  4. 模版优化
  5. 再次测试
  6. 提交结果

## 各步骤对应的组件与逻辑

### 1. 结果质询（currentOptimizationStep === 0）
- 组件：`ResultPage`
- 作用：展示评估结果、图表、模型对比等。
- 传参：
  - task（即card）
  - enhancedChartData（多模型数据）
  - evaluationData（模型评估数据）
  - selectedModels、selectedModel、expandedModel
  - radarMaxValue、handleModelChange、handleSelectAll、toggleModelPanel、getModelColor、onAddAnnotation
- 注释：右侧注释列表（可选，暂时注释掉）

### 2. QA优化（currentOptimizationStep === 1）
- 组件：`QAOptimizationSection`（内部实际调用 `QASection`）
- 作用：编辑和优化QA内容，支持注释。
- 传参：
  - isEditable: true
  - taskId: card.id
  - prompt: card.prompt
  - response: card.response_summary
  - comments: card.annotation.qa 或当前comments

### 3. 场景优化（currentOptimizationStep === 2）
- 组件：`SceneOptimizationSection`（内部实际调用 `SceneSection`）
- 作用：编辑和优化场景内容，支持注释。
- 传参：
  - isEditable: true
  - taskId: card.id
  - scenario: card.scenario
  - comments: card.annotation.scene 或当前comments

### 4. 模板优化（currentOptimizationStep === 3）
- 组件：`TemplateOptimizationSection`（内部实际调用 `TemplateSection`）
- 作用：编辑和优化模板内容，支持注释。
- 传参：
  - isEditable: true
  - taskId: card.id
  - steps: card.templateData 或 card.step
  - comments: card.annotation.template 或当前comments

### 5. 再次测试（currentOptimizationStep === 4）
- 组件：`TestConfirmation`
- 作用：再次确认测试配置，发起测试。
- 传参：
  - isTesting, testProgress, task, isTaskStarted, TimelineIcon, currentStep, onPrevious, onStartTest
  - QASection, SceneSection, TemplateSection
  - annotationColumns, annotationData

### 6. 提交结果（currentOptimizationStep === 5）
- 组件：`SubmitResultSection`
- 作用：提交优化后的测试结果。
- 传参：
  - task（即card）

## 优化模式各步骤底部按钮说明

### 0. 结果质询（currentOptimizationStep === 0）
- **按钮及事件：**
  - 返回：关闭优化模式，返回上一页（handleBack）
  - 保存：保存当前步骤数据（saveCurrentData）
  - 保存并进入下一步：保存当前数据并进入下一步（saveAndNext）
  - 优化模式开关（Switch）：切换优化模式（toggleOptimizationMode）

### 1. QA优化（currentOptimizationStep === 1）
- **按钮及事件：**
  - 上一步：返回结果质询（handlePrevStep）
  - 保存：保存当前步骤数据（saveCurrentData）
  - 保存并进入下一步：保存当前数据并进入下一步（saveAndNext）
  - 优化模式开关（Switch）：切换优化模式（toggleOptimizationMode）

### 2. 场景优化（currentOptimizationStep === 2）
- **按钮及事件：**
  - 上一步：返回QA优化（handlePrevStep）
  - 保存：保存当前步骤数据（saveCurrentData）
  - 保存并进入下一步：保存当前数据并进入下一步（saveAndNext）
  - 优化模式开关（Switch）：切换优化模式（toggleOptimizationMode）

### 3. 模板优化（currentOptimizationStep === 3）
- **按钮及事件：**
  - 上一步：返回场景优化（handlePrevStep）
  - 保存：保存当前步骤数据（saveCurrentData）
  - 保存并进入下一步：保存当前数据并进入下一步（saveAndNext）
  - 优化模式开关（Switch）：切换优化模式（toggleOptimizationMode）

### 4. 再次测试（currentOptimizationStep === 4）
- **按钮及事件：**
  - 上一步：返回模板优化（handlePrevStep）
  - 保存：保存当前步骤数据（saveCurrentData）
  - 确认无误，开始测试：启动测试进度，测试完成自动跳转到提交结果（handleStartTest）
  - 优化模式开关（Switch）：切换优化模式（toggleOptimizationMode）

### 5. 提交结果（currentOptimizationStep === 5）
- **按钮及事件：**
  - 生成报告：生成并保存报告到本地（handleGenerateReport）
  - 放弃此次优化：关闭优化模式，回到普通模式（setIsOptimizationMode(false)）
  - 保存并新建任务：提交优化结果，弹出新建任务模态框（handleSubmitResults）
  - 优化模式开关（Switch）：切换优化模式（toggleOptimizationMode）

---

### 说明
- 每一步底部按钮区都包含"优化模式"开关，便于随时退出优化流程。
- 除最后一步外，均有"保存""保存并进入下一步"按钮，确保数据不会丢失。
- "上一步"按钮可返回前一阶段，第一步为"返回"。
- "再次测试"步骤有专属"确认无误，开始测试"按钮，测试中按钮禁用。
- "提交结果"步骤有"生成报告""保存并新建任务""放弃此次优化"三个主要操作。
- 按钮事件建议与CardDetailPage.js中方法命名保持一致，便于维护。

## 其他说明
- 优化模式下，步骤切换会自动保存当前步骤数据。
- 每一步都可通过 `

## 优化模式下右键菜单与IM区操作说明

### CardDetailPage.js 优化模式下
- 仅在优化模式（isOptimizationMode === true）下，支持右键菜单功能。
- 用户在评估结果、QA、场景、模板等可选文本区域右键时，会弹出 TextContextMenu。
- 右键菜单支持：讨论、连续选、添加观点（批注）、（场景/模板下）编辑、删除等操作。
- 菜单操作通过 onAction 回调分发到主页面，进行高亮、批注、讨论等处理。
- 右键菜单的显示和关闭由 contextMenu 状态控制，点击菜单外部或操作后自动关闭。
- 右键菜单的 contextType 可区分普通文本、场景、模板，决定菜单项内容。

### sidebar-chat 区域
- 默认 sidebar-chat 区域未集成 TextContextMenu。
- 如需支持聊天内容的高亮、批注、讨论等功能，可在 ChatMessage.js 或 ChatArea.js 中监听 contextmenu 事件，集成 TextContextMenu。
- 集成方式与 CardDetailPage.js 类似，需传递 onAction、contextType 等参数，并处理批注/讨论逻辑。

### IM（即时通讯/聊天）区的优化模式行为
- 在优化模式下，IM 聊天记录（如 sidebar-chat 区域）每条消息的右上角会显示一组操作按钮。
- 这些按钮通常包括：批注、讨论、引用、复制等，便于对聊天内容进行结构化管理和团队协作。
- 这些操作按钮**不是使用 TextContextMenu.js 组件实现**，而是直接渲染在消息卡片右上角，点击后触发对应操作。
- 优化模式关闭时，这些按钮会隐藏或简化，避免干扰普通聊天体验。
- 设计建议：IM区的操作按钮与主页面的批注/讨论功能保持一致，便于优化流程中对聊天内容的追踪和复用。

## 优化模式下右键菜单功能实现细节（以CardDetailPage.js为例）

### 1. 右键菜单功能入口
- 优化模式下，主内容区（如评估结果、QA、场景、模板等）支持文本右键弹出TextContextMenu。
- 右键菜单支持：讨论、连续选、添加观点（批注）等操作。

### 2. 讨论（DiscussModal）
- 触发方式：右键菜单点击"讨论"后弹出DiscussModal。
- 支持连续选择：若处于连续选择模式，合并所有选中文本作为讨论内容。
- 讨论内容填写后，点击"发送"按钮：
  - 讨论内容会以消息形式发送到IM区（如sidebar-chat），实现主页面与IM的联动。
  - 发送后自动关闭讨论modal，并清除高亮。
- 体验优化：关闭讨论modal时，若为连续选择模式，也会自动清除所有高亮。

### 3. 添加观点（AnnotationModal）
- 触发方式：右键菜单点击"添加观点"后弹出AnnotationModal。
- 支持连续选择：若处于连续选择模式，合并所有选中文本作为观点内容。
- Modal内容：
  - 当前步骤（如QA/场景/模板/结果）会在modal中显示，便于用户确认批注归属。
  - 选中文本、观点内容、摘要、附件等均可填写。
- 点击"保存"后：
  - 会将annotation数据（含选中文本、内容、摘要、附件、步骤等）添加到当前步骤的注释列表（如card.annotation.qa/scene/template/result）。
  - 支持全局注释管理，注释会实时显示在主页面注释区。
  - 保存后自动关闭modal，并清除高亮。

### 4. annotation添加与展示
- 添加观点后，annotation会被追加到当前步骤的注释数组，并通过CommentsList等组件实时展示。
- annotation数据结构包含：id、author、time、selectedText、content、summary、step、attachments等。
- 支持多步骤注释独立管理，切换步骤时自动切换注释内容。

### 5. 用户体验与交互
- 右键菜单与主页面、IM区、注释区高度联动，支持结构化批注与团队协作。
- 连续选择模式下，支持多段文本高亮与批量操作，极大提升批注效率。
- 所有modal关闭后自动清除高亮，避免界面混乱。
- 讨论内容可追溯至IM区，观点内容可追溯至注释区，便于后续优化与复盘。

---