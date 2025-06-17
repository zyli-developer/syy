# Syntrust API JSON 规范 v1

## 目录

- [Syntrust API JSON 规范 v1](#syntrust-api-json-规范-v1)
  - [目录](#目录)
  - [1. API 设计规范说明](#1-api-设计规范说明)
    - [1.1 版本控制](#11-版本控制)
    - [2.2 认证方式](#22-认证方式)
    - [2.3 请求/响应格式](#23-请求响应格式)
    - [2.4 状态码使用](#24-状态码使用)
    - [2.5 错误响应格式](#25-错误响应格式)
    - [2.6 分页参数](#26-分页参数)
    - [3 条件搜索](#3-条件搜索)
      - [3.1 复合过滤条件](#31-复合过滤条件)
        - [3.1.1 比较运算符](#311-比较运算符)
        - [3.1.2 单一条件表达式](#312-单一条件表达式)
        - [3.1.3 过滤条件列表结构](#313-过滤条件列表结构)
      - [3.2 排序表达式](#32-排序表达式)
      - [3.3 分页参数](#33-分页参数)
      - [3.4 探索列表搜索接口](#34-探索列表搜索接口)
  - [3. API 端点定义](#3-api-端点定义)
    - [3.1 用户认证](#31-用户认证)
      - [3.1.1 密码登录](#311-密码登录)
      - [3.1.2 手机验证码登录](#312-手机验证码登录)
        - [3.1.2.1 发送验证码](#3121-发送验证码)
        - [3.1.2.2 验证码登录](#3122-验证码登录)
      - [3.1.3 SSO 登录](#313-sso-登录)
      - [3.1.4 用户注册](#314-用户注册)
    - [3.2 探索](#32-探索)
      - [3.2.1 获取探索列表](#321-获取探索列表)
      - [3.2.2 获取探索详情](#322-获取探索详情)
    - [3.3 任务](#33-任务)
      - [3.3.1 获取任务列表](#331-获取任务列表)
      - [3.3.2 获取任务详情](#332-获取任务详情)
    - [3.4 资产](#34-资产)
      - [3.4.1 获取资产详情](#341-获取资产详情)
    - [3.5 task工作流](#35-task工作流)
      - [3.5.1 保存 task 草稿](#351-保存-task-草稿)
      - [3.5.2 新建 task 信息](#352-新建-task-信息)
      - [3.5.3 更新 task 信息](#353-更新-task-信息)
      - [3.5.4 删除 task](#354-删除-task)
    - [3.6 文件上传](#36-文件上传)
      - [3.6.1 上传文件](#361-上传文件)
    - [3.7 机器人对话](#37-机器人对话)
      - [3.7.1 发送消息](#371-发送消息)
  - [附录：条件搜索常用示例](#附录条件搜索常用示例)
    - [示例 1：按可信度区间、场景多选、作者模糊、时间倒序分页](#示例-1按可信度区间场景多选作者模糊时间倒序分页)
    - [示例 2：只按关键词模糊搜索，按名称升序](#示例-2只按关键词模糊搜索按名称升序)
    - [示例 3：按模板多选、点赞数降序](#示例-3按模板多选点赞数降序)
    - [示例 4：复杂嵌套过滤（可信度区间 且 (场景 A 或 场景 B) 且 作者张）](#示例-4复杂嵌套过滤可信度区间-且-场景-a-或-场景-b-且-作者张)

## 1. API 设计规范说明

### 1.1 版本控制

- API 版本通过 URL 路径前缀`/v1`进行控制
- 重大更新时递增版本号，如`/v2`，确保向后兼容

### 2.2 认证方式

- 统一使用 token 认证（e.g.: JWT Token）
- Token 通过请求头`Authorization: Bearer <token>`传递
- 登录接口返回 token，其他接口需要携带 token 访问

### 2.3 请求/响应格式

- 请求和响应消息使用 JSON 格式
- 时间类型使用 ISO 8601 标准格式（YYYY-MM-DDThh:mm:ss.sssZ）

### 2.4 状态码使用

- 200: 请求成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未授权
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器错误

### 2.5 错误响应格式

```json
{
  "errors": {
    "detail": {
      "code": "string",
      "message": "string"
    }
  }
}
```

### 2.6 分页参数

页数请求：
```json
// request
{
  "pagination":{
    {
      "page": 1, // 默认1
      "per_page": 20 // 默认20
    }
  }
}
```

页数响应：
```json
// response
{
  "pagination":{
    {
      "total": 100,
      "page": 1,
      "per_page": 20
    }
  }
}

```


### 3 条件搜索

#### 3.1 复合过滤条件

复合过滤条件使用 and 处理多条件组合，其核心结构如下：

##### 3.1.1 比较运算符

```json
// 在JSON请求中使用以下字符串值作为运算符
"EQ"      // 等于
"NEQ"     // 不等于
"GT"      // 大于
"GTE"     // 大于等于
"LT"      // 小于
"LTE"     // 小于等于
"IN"      // 包含于集合
"NOT_IN"  // 不包含于集合
"LIKE"    // 字符串模糊匹配
"RANGE"   // 数值区间
```

##### 3.1.2 单一条件表达式

```json
{
  "field": "string", // 字段名，如 confidence, scenario, task, keyword, creator
  "op": "EQ", // 操作符
  "values": ["value1", "value2"] // 支持多选或区间，如 ["0.8", "1.0"] 表示区间
}
```

##### 3.1.3 过滤条件列表结构

实际业务中仅使用 AND 逻辑连接所有条件

```json
{
  "exprs": [
    // FilterExpr 数组，所有条件均以 AND 关系组合
  ]
}
```

#### 3.2 排序表达式

```json
{
  "field": "string", // 排序字段（如 confidence, name, created_at, like_count）
  "desc": true // 是否倒序
}
```

#### 3.3 分页参数

与 [2.6 分页参数](#26-分页参数) 一致，点击查看

#### 3.4 探索列表搜索接口

- **URL**: `/v1/syntrust/explorations/search`
- **Method**: POST
- **请求**:

```json
{
  "tab": "community", // 必填: community | workspace | personal
  "filter": {
    "exprs": [
      // FilterExpr 数组
    ]
  },
  "sort": {
    "field": "created_at",
    "desc": true
  },
  "pagination": {
    "page": 1,
    "per_page": 20
  }
}
```

- **响应**:

```json
{
  "card": [
    // ExplorationCard 数组
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  "filter_echo": {
    // 回显请求中的 filter
  },
  "sort_echo": {
    // 回显请求中的 sort
  }
}
```

## 3. API 端点定义

### 3.1 用户认证

#### 3.1.1 密码登录

- **URL**: `/v1/syntrust/auth/login`
- **Method**: POST
- **请求**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **响应**:

```json
{
  "token": "string",
  "user": {
    // User 结构
    "id": "string",
    "email": "string",
    "name": "string",
    "workspace": "string",
    "vip": boolean,
    "avatar": "string",
    "phone": "string",
    "role": "string",
    "preferences": {
      "key1": "value1",
      "key2": "value2"
    },
    "last_login": "2023-01-01T12:00:00Z",
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
  },
  "sidebar_list": {
    // Sidebar 结构
    {
      "classification": [
        // ClassificationList 数组
        {
          "classification_name":"string",
          "level1": [
            // Level1 数组
            {
              "level_1_name": "string",
              "level2": [
                // Level2 数组
                {
                  "level_2_name": "string",
                  "level3": [
                    // Element 数组
                    {
                      "name": "string",
                      "classification": "string",
                      "id": "string"
                    },
                    ...
                  ]
                },
                ...
              ]
            },
            ...
          ]
        }
      ]
      
    }
  },
  "user_signature": "string", // 来自腾讯im生成的，用来调用AI的
  "workspace": "string" //
}
```

#### 3.1.2 手机验证码登录

##### 3.1.2.1 发送验证码

- **URL**: `/v1/syntrust/auth/sms/code`
- **Method**: POST
- **请求**:

```json
{
  "phone": "string"
}
```

- **响应**:

```json
{
  "message": "验证码已发送"
}
```

##### 3.1.2.2 验证码登录

- **URL**: `/v1/syntrust/auth/sms/login`
- **Method**: POST
- **请求**:

```json
{
  "phone": "string",
  "code": "string"
}
```

- **响应**:

```json
{
  "token": "string",
  "user": {
    // User 结构
  },
  "sidebar_list": {
    // Sidebar 结构
  },
  "user_signature": "string",
  "workspace": "string"
}
```

#### 3.1.3 SSO 登录

- **URL**: `/v1/syntrust/auth/sso/login`
- **Method**: POST
- **请求**:

```json
{
  "sso_token": "string",
  "provider": "string" // 例如: "google", "github"
}
```

- **响应**:

```json
{
  "token": "string",
  "user": {
    // User 结构
  },
  "sidebar_list": {
    // Sidebar 结构
  },
  "user_signature": "string",
  "workspace": "string"
}
```

#### 3.1.4 用户注册

- **URL**: `/v1/syntrust/auth/register`
- **Method**: POST
- **请求**:

```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

- **响应**:

```json
{
  "message": "string" // 跳转登陆页
}
```

### 3.2 探索

#### 3.2.1 获取探索列表

- **URL**: `/v1/syntrust/explorations/search`
- **Method**: post
- **请求参数**:

```json
{
  "tab": "community", // community || workspace || personal
  "user_id": "string",

  // 以下条件，可以省略，会返回默认结果
  "pagination": {
    "page": 1,
    "per_page": 20
  },
  "filter": [
    { 
      "field":"name",  // "name" || "description" || "status" || "priority" || "keyword" || "creator" 
      "campare_operationn": "EQ", // EQ 等于 || NEQ 不等于 || GT 大于 || GTE 大于等于 || LT 小于 || LTE 小于等于 || IN 范围内 || NOT_IN 范围外 || LIKE:字符串模糊 || RANGE:数值区间
      "values": [
        1,
        2,
        ...
      ]
    },
    ...
  ],
  "sort": {
    "field": "created_at", // "created_at" -> :inserted_at || "updated_at" -> :updated_at || "name" -> :name || "status" -> :status || "priority" -> :priority || "due_date" -> :due_date || "like_count" -> :like_count
    "desc": true // true || false
  },
}
```

- **响应**:

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  // Cards 结构
  "cards": [
    {
      "id": "string",
      "name": "string",
      "prompt": "string", 
      "response_summary": "string",
      "created_by": "string",
      "created_from": "string",
      "created_at": "2023-01-01T12:00:00Z",
      "like_count": 42,
      "keywords": ["安全性", "儿童", "语音交互"],
      "status": "string", // pending || in_progress || completed || failed || reviewing
      // Step 数组
      "step": [
        {
          "id": "string",
          "name": "string",
          "status": "completed",
          "agent": "GPT-4",
          "result": {
            "version": "1.0",
            "confidence": 0.88,
            "score": 92,
            "consumed_points": 100,
            "description": "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流畅，响应速度快。",
            "updated_at": "2025-05-18T07:36:12Z",
            "dimension": [
              { "latitude": "语音识别", "weight": 0.85 },
              { "latitude": "内容安全", "weight": 0.78 },
              { "latitude": "隐私保护", "weight": 0.65 },
              { "latitude": "数据加密", "weight": 0.70 },
              { "latitude": "家长控制", "weight": 0.60 },
              { "latitude": "系统稳定", "weight": 0.88 }
            ],
            "reason": "综合评估结果良好，但在隐私保护和家长控制方面需要改进"
          },
        },
        ...
      ]
    },
    ...
  ],
  
}
```

#### 3.2.2 获取探索详情

- **URL**: `/v1/syntrust/exploration/{exploration_id}`
- **Method**: GET

- **响应**:

```json
// task 结构
{
  "id": "string",
  "name": "string",
  "prompt": "string",
  "response": "string",
  "description": "string",
  "status": "string",
  // "object": "string",
  // "brand": "string",
  // "model": "string",
  "version": "string",
  // "parameter_quantity": "string",
  // "reasoning_accuracy": "string",
  "priority": 1,
  "due_date": "2023-01-01T12:00:00Z",
  "created_by": "string",
  "created_from": "string",
  "keyword": ["string", ...],
  "assigned_to": {
    // User 结构
    "id": "string",
    "email": "string",
    "name": "string",
    "workspace": "string",
    "vip": boolean,
    "avatar": "string",
    "phone": "string",
    "role": "string",
    "preferences": {
      "key1": "value1",
      "key2": "value2"
    },
    "last_login": "2023-01-01T12:00:00Z",
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
  },
  "step": [
    // Step 数组
    {
      "id": "string",
      // "name": "string", // 冗余
      // "status": "completed",
      "agent": "GPT-4",
      // scores 表中type是result, 代表给QA打分
      "result":[
        {
          "version": "1.0",
          "confidence": 0.88,
          "score": 92,
          "consumed_points": 100,
          // "consumption_instructions": "string",  // UI中暂时还没有"消费积分介绍"
          "description": "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流畅，响应快。",
          "updated_at": "2025-05-18T07:36:12Z",
          "dimension": [
            { "latitude": "语音识别", "weight": 0.85 },
            { "latitude": "内容安全", "weight": 0.78 },
            { "latitude": "隐私保护", "weight": 0.65 },
            { "latitude": "数据加密", "weight": 0.70 },
            { "latitude": "家长控制", "weight": 0.60 },
            { "latitude": "系统稳定", "weight": 0.88 }
          ],
          "reason": "综合评估结果良好，但在隐私保护和家长控制方面需要改进"
        },
        ...
      ] 
    },
    ...
  ],
  "flow_config": {
    // FlowConfig 结构
    "step_nodes": [
      // StepNode 数组
      {
        "id": "string",
        "name": "string",  
        "executor_type": "human",  // "human" or "agent"
        "executor_id": "string",
        "description": "string",
        "position": {
          "x": 100,
          "y": 200
        },
        "type": "string",
        "dimension": [
          // Dimension 数组, 用于雷达图
          {"latitude": "string", "weight": 0.81},
          {"latitude": "string", "weight": 0.82},
          ...
        ],
      }
    ],
    "step_edges": [
      // StepEdge 数组
      {
        "id": "string",
        "source": "step node id",
        "target": "step node id"
      }
    ]
  },
  "scenario":{
    // Scenario 结构
    "dimension_node": [
      // DimensionNode 数组
      {
        "id": "string",
        "label": "string",  // equals "name"
        // "weight": 0.5,
        "type": "string",
        // "position": {
        //   "x": 100,
        //   "y": 200
        // }
      },
      ...
    ],
    "dimension_edge": [
      // DimensionEdge 数组
      {
        "id": "string",
        "source": "string",
        "target": "string"
      },
      ...
    ]
  },
  "annotations": [
    // Annotation 数组
    {
      "id": "string", 
      "type": "string", // prompt || response || task || flow || step || score || dimension || scenario || annotation
      "target_id": "string", // 根据annotatable_type，判断 annotatable_id 指向那种目标
      "created_at": "2023-01-01T12:00:00Z",
      "updated_at": "2023-01-01T12:00:00Z",
      "body": "string", 
      "name": "string",
      // Attachment 结构
      "attachment": [
        {
          "id": "string",
          "file_name": "string",
          "content_type": "string",
          "file_path": "string",
          "description": "string",
        },
        ...
      ],
      "target_detail": 
        // 根据不同类型，可能包含以下之一：根据annotations表中的annotation_detail字段复制到这里，
        {
          "type": "image",
          "path": "string", // 图片标注的文件路径, attachment@id
          "position": {
            "x": integer(),   // 图片标注的 x 坐标
            "y": integer(),   // 图片标注的 y 坐标
            "width": integer(),   // 图片标注的宽度
            "height": integer()   // 图片标注的高度
          }
        }
        // 或
        {
          "type": "text",
          "path": "string",   // 文本标注的文件路径, prompt@id || task@id || score@id || dimension@id
          "position": {
            "start": integer(),   // 文本标注的起始位置
            "end": integer()      // 文本标注的结束位置
          }
        }
      }
  ],
}
```

### 3.3 任务

#### 3.3.1 获取任务列表

- **URL**: `/v1/syntrust/tasks/search`
- **Method**: POST
- **请求参数**:

```json
{
  "tab": "community", // community || workspace || personal
  "user_id": "string",
 
  // 以下条件，可以省略，会返回默认结果
  "pagination": {
    "page": 1,
    "per_page": 20
  },
  "filter": [
    { 
      "field":"name",  // "name" || "description" || "status" || "priority" || "keyword" -|| "creator" 
      "campare_operationn": "EQ", // EQ 等于 || NEQ 不等于 || GT 大于 || GTE 大于等于 || LT 小于 || LTE 小于等于 || IN 范围内 || NOT_IN 范围外 || LIKE:字符串模糊 || RANGE:数值区间
      "values": [
        1,
        2,
        ...
      ]
    },
    ...
  ],
  "sort": {
    "field": "created_at", // "created_at" -> :inserted_at || "updated_at" -> :updated_at || "name" -> :name || "status" -> :status || "priority" -> :priority || "due_date" -> :due_date || "like_count" -> :like_count
    "desc": true // true || false
  },
}
```

- **响应**:

```json
{
  // Cards 结构
  "cards": [
    {
      "id": "string",
      "name": "string",
      "prompt": "string", 
      "response_summary": "string",
      "created_by": "string",
      "created_from": "string",
      "created_at": "2023-01-01T12:00:00Z",
      "like_count": 42,
      "keywords": ["安全性", "儿童", "语音交互"],
      "status": "string", // pending || in_progress || completed || failed || reviewing
      // Step 数组
      "step": [
        {
          "id": "string",
          "name": "string",
          "status": "completed",
          "agent": "GPT-4",
          "result": {
            "version": "1.0",
            "confidence": 0.88,
            "score": 92,
            "consumed_points": 100,
            "description": "该AI玩具在语音识别方面表现优秀，能够准确识别儿童的语音指令。安全性设计符合国际标准，无小零件脱落风险。交互体验流畅，响应速度快。",
            "updated_at": "2025-05-18T07:36:12Z",
            "dimension": [
              { "latitude": "语音识别", "weight": 0.85 },
              { "latitude": "内容安全", "weight": 0.78 },
              { "latitude": "隐私保护", "weight": 0.65 },
              { "latitude": "数据加密", "weight": 0.70 },
              { "latitude": "家长控制", "weight": 0.60 },
              { "latitude": "系统稳定", "weight": 0.88 }
            ],
            "reason": "综合评估结果良好，但在隐私保护和家长控制方面需要改进"
          },
        },
        ...
      ]
    },
    ...
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 20
  }
}
```

#### 3.3.2 获取任务详情

- **URL**: `/v1/syntrust/task/{task_id}`
- **Method**: GET
- **请求参数**:

- **响应**:

```json
{
  // task 结构
}
```


### 3.4 资产

#### 3.4.1 获取资产详情

- **URL**: `/v1/syntrust/assets/{asset_id}`
- **Method**: GET
- **请求参数**:

```json
{
  "tab": "community" // 必填: community || workspace || personal
}
```

- **响应**:

```json
{
  "asset": {
    // Asset 结构
  }
}
```

### 3.5 task工作流

#### 3.5.1 保存 task 草稿
- **URL**: `/v1/syntrust/users/{user_id}/tasks`
- **Method**: POST
- **请求**:

```json
{
  "task": {
    // Task 结构
  },
  "completed": "yes" // yes || no 标记是否完成，还是草稿
}
```


#### 3.5.2 新建 task 信息

- **URL**: `/v1/syntrust/users/{user_id}/tasks`
- **Method**: POST
- **请求**:

```json
{
  "task": {
    // Task 结构
  },
  "completed": "yes" // yes || no 标记是否完成，还是草稿
}
```

- **响应**:

```json
{
  "code": 201,
  "message": "string"
}
```

#### 3.5.3 更新 task 信息

- **URL**: `/v1/syntrust/users/{user_id}/tasks/{task_id}`
- **Method**: PUT
- **请求**:

```json
{
  //Task 结构
}
```

- **响应**:

```json
{
  "code": 200,
  "message": "Created"
}
```

#### 3.5.4 删除 task

- **URL**: `/v1/syntrust/users/{user_id}/tasks/{task_id}`
- **Method**: DELETE
- **响应**:

```json
{
  "message": "Task successfully deleted"
}
```

### 3.6 文件上传

#### 3.6.1 上传文件

- **URL**: `/v1/syntrust/attachments`
- **Method**: POST
- **请求**:
  使用 multipart/form-data 格式上传:

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="example.jpg"
Content-Type: image/jpeg

(二进制文件内容)
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="user_id"

user123
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

- **响应**:

```json
{
  "file_id": "string",
  "status": "string",
  "url": "string"
}
```

### 3.7 机器人对话

#### 3.7.1 发送消息

- **URL**: `/v1/rbt/chats/{chat_id}/messages`
- **Method**: POST
- **请求**:

```json
{
  "content": "string",
  "type": "string",
  "priority": 1,
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

- **响应**:

```json
{
  "message": {
    // Message 结构
  }
}
```


## 附录：条件搜索常用示例

以下为基于 条件搜索 API 设计的典型请求示例，便于开发和测试参考：

### 示例 1：按可信度区间、场景多选、作者模糊、时间倒序分页

- **API**: `POST /v1/syntrust/explorations/search`
- **请求**

```json
{
  "tab": "community",
  "filter": {
    "exprs": [
      { "field": "confidence", "op": "RANGE", "values": ["0.8", "1.0"] },
      { "field": "scenario", "op": "IN", "values": ["foo", "bar"] },
      { "field": "creator", "op": "LIKE", "values": ["张"] }
    ]
  },
  "sort": {
    "field": "created_at",
    "desc": true
  },
  "pagination": {
    "page": 2,
    "per_page": 20
  }
}
```

- **响应**

```json
{
  "card": [
    {
      "id": "exp123",
      "prompt": "AI 智能助手探索",
      "response_summary": "本探索介绍了AI助手的核心能力...",
      "created_by": "张三",
      "created_from": "web",
      "created_at": "2024-04-30T12:00:00Z",
      "step": []
    }
    // 其余19条
  ],
  "pagination": {
    "total": 100,
    "page": 2,
    "per_page": 20
  },
  "filter_echo": {
    // 同请求中的filter
  },
  "sort_echo": {
    "field": "created_at",
    "desc": true
  }
}
```

### 示例 2：只按关键词模糊搜索，按名称升序

- **API**: `POST /v1/syntrust/tasks/search`
- **请求**

```json
{
  "tab": "personal",
  "filter": {
    "exprs": [{ "field": "keyword", "op": "LIKE", "values": ["AI"] }]
  },
  "sort": {
    "field": "name",
    "desc": false
  },
  "pagination": {
    "page": 1,
    "per_page": 20
  }
}
```

- **响应**

```json
{
  "card": [
    {
      "id": "task001",
      "prompt": "AI 自动摘要任务",
      "response_summary": "本任务要求对长文本进行自动摘要...",
      "created_by": "李四",
      "created_from": "web",
      "created_at": "2024-04-30T12:00:00Z",
      "step": [],
      "status": "open"
    }
    // 其余19条
  ],
  "pagination": {
    "total": 35,
    "page": 1,
    "per_page": 20
  },
  "filter_echo": {
    // 同请求中的filter
  },
  "sort_echo": {
    "field": "name",
    "desc": false
  }
}
```

### 示例 3：按模板多选、点赞数降序

- **API**: `POST /v1/syntrust/assets/search`
- **请求**

```json
{
  "tab": "workspace",
  "filter": {
    "exprs": [{ "field": "task", "op": "IN", "values": ["T1", "T2"] }]
  },
  "sort": {
    "field": "like_count",
    "desc": true
  },
  "pagination": {
    "page": 1,
    "per_page": 10
  }
}
```

- **响应**

```json
{
  "card": [
    {
      "id": "asset001",
      "name": "模型模板T1资产"
      // 其它资产字段
    }
    // 其余9条
  ],
  "pagination": {
    "total": 18,
    "page": 1,
    "per_page": 10
  },
  "filter_echo": {
    // 同请求中的filter
  },
  "sort_echo": {
    "field": "like_count",
    "desc": true
  }
}
```

### 示例 4：复杂嵌套过滤（可信度区间 且 (场景 A 或 场景 B) 且 作者张）

- **API**: `POST /v1/syntrust/tasks/search`
- **请求**

```json
{
  "tab": "community",
  "filter": {
    "exprs": [
      { "field": "confidence", "op": "RANGE", "values": ["0.7", "0.95"] },
      { "field": "scenario", "op": "IN", "values": ["A", "B"] },
      { "field": "creator", "op": "LIKE", "values": ["张"] }
    ]
  },
  "sort": {
    "field": "created_at",
    "desc": true
  },
  "pagination": {
    "page": 1,
    "per_page": 20
  }
}
```

- **响应**

```json
{
  "card": [
    {
      "id": "task888",
      "prompt": "场景A高可信度任务",
      "response_summary": "该任务聚焦于A场景下的高可信度...",
      "created_by": "张三",
      "created_from": "web",
      "created_at": "2024-04-30T12:00:00Z",
      "step": [],
      "status": "closed"
    }
    // 其余19条
  ],
  "pagination": {
    "total": 22,
    "page": 1,
    "per_page": 20
  },
  "filter_echo": {
    // 同请求中的filter
  },
  "sort_echo": {
    "field": "created_at",
    "desc": true
  }
}
```
