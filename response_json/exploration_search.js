// exploration_search.js
module.exports = {
    "pagination": {
        "total": 8,
        "page": 1,
        "per_page": 10
    },
    "cards": [
        // 探索详情页数据
        {
            "id": "66666666-6666-6666-6666-666666666666",
            "name": "大型语言模型在医疗诊断辅助中的可靠性与伦理评估",
            "priority": 2,
            "status": "completed",
            "version": "1.0",
            "description": "评估大型语言模型在医疗诊断辅助领域的应用",
            "response": "",
            "prompt": "本研究评估了大型语言模型在医疗诊断辅助中的可靠性和伦理问题。研究表明，当前模型在常见疾病诊断建议方面准确率达到87%，但在罕见病识别和紧急情况处理方面存在明显不足。同时，模型在医疗隐私保护和知情同意等伦理方面需要进一步完善。",
            "step": [
                {
                    "id": "d95f28e4-4520-4eb7-85c6-29ed7c75be1f",
                    "name": "医疗AI模型评估",
                    "status": "completed",
                    "inserted_at": "2025-05-28T09:32:48Z",
                    "updated_at": "2025-05-28T09:32:48Z",
                    "score": [
                        {
                            "reason": "医疗AI模型在诊断准确性方面表现优秀，但在罕见病识别方面仍有不足",
                            "version": "1.0",
                            "description": "该模型在常见疾病诊断方面准确率高，但对罕见病例识别能力不足。在医患沟通方面表现良好，能提供清晰的解释。隐私保护措施完善，但知情同意机制有待加强。",
                            "score": 0,
                            "dimension": [
                                {
                                    "latitude": "医患沟通",
                                    "weight": 0.16
                                },
                                {
                                    "latitude": "知情同意",
                                    "weight": 0.16
                                },
                                {
                                    "latitude": "紧急处理",
                                    "weight": 0.17
                                },
                                {
                                    "latitude": "罕见病识别",
                                    "weight": 0.16
                                },
                                {
                                    "latitude": "诊断准确",
                                    "weight": 0.18
                                },
                                {
                                    "latitude": "隐私保护",
                                    "weight": 0.17
                                }
                            ],
                            "confidence": 0,
                            "consumed_points": 120
                        }
                    ],
                    "executor_type": "agent",
                    "agent": "Claude 3"
                }
            ],
            "keyword": [
                "医疗",
                "伦理",
                "AI诊断"
            ],
            "created_by": "Test User 2",
            "annotations": {
                "result": [],
                "flow": [
                    {
                        "id": "5ed7c550-2fb6-45aa-b866-ab4cd9ab7057",
                        "type": "task",
                        "time": "2025-05-28T09:32:48Z",
                        "text": "该模型在医疗诊断准确性方面表现出色，但在处理罕见病例时仍有不足。建议进一步完善伦理控制机制和知情同意流程。",
                        "author": "Admin User",
                        "attachments": [
                            {
                                "name": "demo-image.png",
                                "url": "/uploads/attachments/demo-image.png"
                            },
                            {
                                "name": "demo-document.pdf",
                                "url": "/uploads/attachments/demo-document.pdf"
                            }
                        ],
                        "summary": null
                    }
                ],
                "scenario": [],
                "qa": []
            },
            "assigned_to": {
                "id": "22222222-2222-2222-2222-222222222222",
                "name": "Test User 1",
                "role": "",
                "email": "user1@example.com"
            },
            "due_date": "2023-11-15T15:00:00Z",
            "scenario": {
                "dimension_edge": [
                    {
                        "id": "edge_d0000020-0020-0020-0020-000000000020_d0000022-0022-0022-0022-000000000022",
                        "source": "d0000020-0020-0020-0020-000000000020",
                        "target": "d0000022-0022-0022-0022-000000000022"
                    },
                    {
                        "id": "edge_d0000020-0020-0020-0020-000000000020_d0000023-0023-0023-0023-000000000023",
                        "source": "d0000020-0020-0020-0020-000000000020",
                        "target": "d0000023-0023-0023-0023-000000000023"
                    },
                    {
                        "id": "edge_d0000020-0020-0020-0020-000000000020_d0000024-0024-0024-0024-000000000024",
                        "source": "d0000020-0020-0020-0020-000000000020",
                        "target": "d0000024-0024-0024-0024-000000000024"
                    },
                    {
                        "id": "edge_d0000021-0021-0021-0021-000000000021_d0000025-0025-0025-0025-000000000025",
                        "source": "d0000021-0021-0021-0021-000000000021",
                        "target": "d0000025-0025-0025-0025-000000000025"
                    },
                    {
                        "id": "edge_d0000021-0021-0021-0021-000000000021_d0000026-0026-0026-0026-000000000026",
                        "source": "d0000021-0021-0021-0021-000000000021",
                        "target": "d0000026-0026-0026-0026-000000000026"
                    },
                    {
                        "id": "edge_d0000021-0021-0021-0021-000000000021_d0000027-0027-0027-0027-000000000027",
                        "source": "d0000021-0021-0021-0021-000000000021",
                        "target": "d0000027-0027-0027-0027-000000000027"
                    }
                ],
                "dimension_node": [
                    {
                        "id": "d0000020-0020-0020-0020-000000000020",
                        "label": "诊断能力",
                        "y": 50,
                        "x": 250
                    },
                    {
                        "id": "d0000021-0021-0021-0021-000000000021",
                        "label": "伦理合规",
                        "y": 50,
                        "x": 450
                    },
                    {
                        "id": "d0000022-0022-0022-0022-000000000022",
                        "label": "诊断准确",
                        "y": 150,
                        "x": 150
                    },
                    {
                        "id": "d0000023-0023-0023-0023-000000000023",
                        "label": "罕见病识别",
                        "y": 150,
                        "x": 250
                    },
                    {
                        "id": "d0000024-0024-0024-0024-000000000024",
                        "label": "紧急处理",
                        "y": 150,
                        "x": 350
                    },
                    {
                        "id": "d0000025-0025-0025-0025-000000000025",
                        "label": "隐私保护",
                        "y": 150,
                        "x": 400
                    },
                    {
                        "id": "d0000026-0026-0026-0026-000000000026",
                        "label": "知情同意",
                        "y": 150,
                        "x": 500
                    },
                    {
                        "id": "d0000027-0027-0027-0027-000000000027",
                        "label": "医患沟通",
                        "y": 250,
                        "x": 450
                    }
                ]
            },
            "flow_config": {
                "connections": [
                    {
                        "id": "conn1",
                        "source": "collect",
                        "target": "analyze"
                    },
                    {
                        "id": "conn2",
                        "source": "analyze",
                        "target": "score"
                    },
                    {
                        "id": "conn3",
                        "source": "score",
                        "target": "report"
                    }
                ],
                "entry_points": [
                    "collect"
                ],
                "exit_points": [
                    "report"
                ],
                "steps": [
                    {
                        "id": "collect",
                        "name": "收集评估数据",
                        "position": {
                            "x": 100,
                            "y": 150
                        },
                        "type": "data_collection"
                    },
                    {
                        "id": "analyze",
                        "name": "分析评估维度",
                        "position": {
                            "x": 300,
                            "y": 150
                        },
                        "type": "dimension_analysis"
                    },
                    {
                        "id": "score",
                        "name": "计算评分",
                        "position": {
                            "x": 500,
                            "y": 100
                        },
                        "type": "scoring"
                    },
                    {
                        "id": "report",
                        "name": "生成报告",
                        "position": {
                            "x": 700,
                            "y": 150
                        },
                        "type": "report_generation"
                    }
                ]
            },
            "created_from": "web"
        },
        // taskt list
        {
            "id": "44444444-4444-4444-4444-444444444444",
            "name": "Python代码审查",
            "priority": 2,
            "status": "pending",
            "version": "1.0",
            "keywords": [],
            "prompt": "请审查这段Python代码并提供改进建议",
            "step": [
                {
                    "id": "48bbbd7f-f493-40e4-8800-91a6f7da2895",
                    "name": "单元测试",
                    "status": "pending",
                    "score": [
                        {
                            "reason": "单元测试评估准备",
                            "version": "1.0",
                            "description": "已准备好单元测试框架和测试用例，等待执行测试并收集覆盖率数据",
                            "score": 0,
                            "dimension": [
                                { "weight": 0.3, "latitude": "测试覆盖率" },
                                { "weight": 0.3, "latitude": "测试质量" },
                                { "weight": 0.2, "latitude": "边界情况处理" },
                                { "weight": 0.2, "latitude": "文档完整性" }
                            ],
                            "confidence": 0.85,
                            "consumed_points": 45
                        },
                        {
                            "reason": "单元测试首轮执行",
                            "version": "1.1",
                            "description": "首轮测试执行中，已完成基本功能测试，覆盖率达到65%",
                            "score": 65,
                            "dimension": [
                                { "weight": 0.3, "latitude": "测试覆盖率" },
                                { "weight": 0.3, "latitude": "测试质量" },
                                { "weight": 0.2, "latitude": "边界情况处理" },
                                { "weight": 0.2, "latitude": "文档完整性" }
                            ],
                            "confidence": 0.88,
                            "consumed_points": 65
                        }
                    ],
                    "inserted_at": "2025-05-27T07:46:04Z",
                    "updated_at": "2025-05-27T07:46:04Z",
                    "agent": "Gemini Pro",
                    "executor_type": "agent"
                },
                {
                    "id": "56c69ff5-29aa-46eb-8fbb-5b88342d581c",
                    "name": "代码审查",
                    "status": "completed",
                    "score": [
                        {
                            "reason": "代码质量评估",
                            "version": "1.0",
                            "description": "Python代码整体质量良好，但存在部分安全隐患和性能优化空间",
                            "score": 88,
                            "dimension": [
                                { "weight": 0.25, "latitude": "代码质量" },
                                { "weight": 0.25, "latitude": "安全性" },
                                { "weight": 0.25, "latitude": "性能" },
                                { "weight": 0.25, "latitude": "可维护性" }
                            ],
                            "confidence": 0.92,
                            "consumed_points": 80
                        }
                    ],
                    "inserted_at": "2025-05-27T07:46:04Z",
                    "updated_at": "2025-05-27T07:46:04Z",
                    "agent": "DeepSeek",
                    "executor_type": "agent"
                },
                {
                    "id": "02122b22-938c-44f0-8342-8beaf0ee60ef",
                    "name": "语法检查",
                    "status": "running",
                    "score": [
                        {
                            "reason": "语法检查初始评估",
                            "version": "1.0",
                            "description": "开始进行Python代码语法检查，使用pylint静态分析工具",
                            "score": 0,
                            "dimension": [
                                { "weight": 0.5, "latitude": "语法规范" },
                                { "weight": 0.5, "latitude": "代码风格" }
                            ],
                            "confidence": 0.75,
                            "consumed_points": 15
                        },
                        {
                            "reason": "语法检查进行中",
                            "version": "1.1",
                            "description": "pylint静态分析进行中，已完成50%的代码检查，发现3处潜在问题",
                            "score": 72.5,
                            "dimension": [
                                { "weight": 0.5, "latitude": "语法规范" },
                                { "weight": 0.5, "latitude": "代码风格" }
                            ],
                            "confidence": 0.82,
                            "consumed_points": 35
                        }
                    ],
                    "inserted_at": "2025-05-27T07:46:04Z",
                    "updated_at": "2025-05-27T07:46:04Z",
                    "agent": "Llama 3",
                    "executor_type": "agent"
                }
            ],
            "scenarios": [],
            "created_at": "2025-05-27T07:46:03Z",
            "created_by": "Admin User",
            "like_count": 0,
            "created_from": "web",
            "response_summary": "对Python代码进行安全性和性能审查"
        }
    ]
}