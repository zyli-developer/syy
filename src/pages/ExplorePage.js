"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Spin } from "antd"
import CardItem from "../components/card/CardItem"
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"
import { useNavContext } from "../contexts/NavContext"
import FilterSystem from "../components/filter/FilterSystem"
import { useLocation } from "react-router-dom"
import ListFooter from "../components/common/ListFooter"

const ExplorePage = () => {
  const { selectedNav } = useNavContext()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [prevNav, setPrevNav] = useState(null)
  const [totalItems, setTotalItems] = useState(0)
  const observer = useRef()
  const loadingRef = useRef(null)
  const { isChatOpen } = useChatContext()
  const [filterParams, setFilterParams] = useState(null)
  const [sortParams, setSortParams] = useState(null)
  const location = useLocation()
  const [keyword, setKeyword] = useState("")

  // 应用保存的视图或清空筛选条件
  useEffect(() => {
    // 检查是否只需要刷新菜单（保存视图后）
    if (location.state?.refreshMenu) {
      console.log("探索页收到刷新菜单请求");
      
      // 如果需要保留筛选条件
      if (location.state.preserveFilters) {
        // 使用传递的筛选和排序条件
        if (location.state.filterParams) {
          setFilterParams(location.state.filterParams);
        }
        
        if (location.state.sortParams) {
          setSortParams(location.state.sortParams);
        }
      }
      
      return;
    }
    
    // 检查是否需要清空筛选条件（点击了一级菜单）
    if (location.state?.clearFilters) {
      console.log("探索页收到清空筛选条件请求");
      
      // 清空筛选条件和排序条件
      setFilterParams(null);
      setSortParams(null);
      
      // 重置页码和卡片列表
      setPage(1);
      setCards([]);
      setLoading(true);
      
      return;
    }
    
    // 检查location.state是否包含应用视图的标志
    if (location.state?.applyViewFilters) {
      try {
        console.log("探索页收到应用视图请求:", location.state);
        
        // 优先从location.state直接获取筛选参数
        if (location.state.filterParams) {
          console.log("应用location.state中的筛选参数:", location.state.filterParams);
          setFilterParams(location.state.filterParams);
        }
        
        // 优先从location.state直接获取排序参数
        if (location.state.sortParams) {
          console.log("应用location.state中的排序参数:", location.state.sortParams);
          setSortParams(location.state.sortParams);
        }
        
        // 如果state中没有直接的参数，则从localStorage获取
        if (!location.state.filterParams && !location.state.sortParams) {
          const viewDataJson = localStorage.getItem('current_view_data');
          
          if (viewDataJson) {
            const viewData = JSON.parse(viewDataJson);
            console.log("从localStorage获取视图数据:", viewData);
            
            // 应用筛选条件
            if (viewData.filterParams) {
              console.log("应用localStorage中的筛选参数:", viewData.filterParams);
              setFilterParams(viewData.filterParams);
            }
            
            // 应用排序条件
            if (viewData.sortParams) {
              console.log("应用localStorage中的排序参数:", viewData.sortParams);
              setSortParams(viewData.sortParams);
            }
          }
        }
        
        // 重置页码和卡片列表
        setPage(1);
        setCards([]);
        setLoading(true);
        
        // 清除本地存储中的视图数据，避免刷新页面时重复应用
        localStorage.removeItem('current_view_data');
      } catch (error) {
        console.error('应用视图筛选条件失败:', error);
      }
    }
  }, [location.state]);

  // 关键词搜索回调
  const handleKeywordSearch = (value) => {
    setKeyword(value);
    // 合并关键词到 filterParams
    let newFilter = filterParams && filterParams.exprs ? [...filterParams.exprs] : [];
    // 移除旧的 keyword 条件
    newFilter = newFilter.filter(expr => expr.field !== "keyword");
    if (value && value.trim()) {
      newFilter.push({ field: "keyword", op: "LIKE", values: [value.trim()] });
    }
    setFilterParams(newFilter.length > 0 ? { exprs: newFilter } : null);
    setPage(1);
    setCards([]);
    setLoading(true);
  };

  // 处理筛选条件变化
  const handleFilterChange = (filterConfig) => {
    let exprs = [];
    if (!filterConfig) {
      // 只保留关键词
      if (keyword && keyword.trim()) {
        exprs.push({ field: "keyword", op: "LIKE", values: [keyword.trim()] });
      }
      setFilterParams(exprs.length > 0 ? { exprs } : null);
      setPage(1);
      setCards([]);
      setLoading(true);
      return;
    }
    if (filterConfig.exprs) {
      exprs = [...filterConfig.exprs];
    } else if (filterConfig.conditions) {
      const apiFilter = [];
      filterConfig.conditions.forEach(condition => {
        const conditionValues = condition.values || [];
        if (conditionValues.length === 0) return;
        const expr = {
          field: condition.field,
          op: condition.operator.toUpperCase(),
          values: conditionValues
        };
        apiFilter.push(expr);
      });
      exprs = apiFilter;
    }
    // 合并关键词
    if (keyword && keyword.trim()) {
      exprs = exprs.filter(expr => expr.field !== "keyword");
      exprs.push({ field: "keyword", op: "LIKE", values: [keyword.trim()] });
    }
    setFilterParams(exprs.length > 0 ? { exprs } : null);
    setPage(1);
    setCards([]);
    setLoading(true);
  };

  // 处理排序条件变化
  const handleSortChange = (sortConfig) => {
    console.log("排序条件变化:", sortConfig);
    // 判断是否已经是API格式的排序参数
    if (sortConfig && sortConfig.field !== undefined) {
      setSortParams(sortConfig);
      setPage(1); // 重置页码
      setCards([]); // 清空现有数据
      setLoading(true);
      return;
      }

    // 处理UI格式的排序配置
    if (sortConfig && sortConfig.fields && sortConfig.fields.length > 0) {
      // 只使用第一个排序字段（API当前只支持单字段排序）
      const firstSort = sortConfig.fields[0];
      setSortParams({
        field: firstSort.field,
        desc: firstSort.direction === 'desc'
      });
    } else {
      setSortParams(null);
    }
    
    setPage(1); // 重置页码
    setCards([]); // 清空现有数据
    setLoading(true);
  };

  const lastCardElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("触底加载，准备 setPage");
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            console.log("setPage 被调用，下一页:", nextPage);
            return nextPage;
          });
          setLoading(true);
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  // 1. 直接定义 loadCards 普通函数
  const loadCards = async () => {
    console.log("loadCards 调用, loading:", loading, "page:", page, "selectedNav:", selectedNav);
    if (!loading) return;
    try {
      const params = {
        tab: selectedNav,
        pagination: {
          page,
          per_page: 1
        }
      };
      if (filterParams) {
        params.filter = filterParams;
      }
      if (sortParams) {
        params.sort = sortParams;
      }
      const response = await cardService.getExplorations(params);
      console.log("loadCards 获取到数据:", response.cards, "当前页:", page);
      setCards((prevCards) => {
        if (page === 1 || prevNav !== selectedNav) {
          console.log("setCards: 覆盖卡片数据", response.cards);
          return response.cards;
        }
        console.log("setCards: 追加卡片数据", [...prevCards, ...response.cards]);
        return [...prevCards, ...response.cards];
      });
      setTotalItems(response.pagination.total);
      setHasMore(response.cards.length > 0 && response.pagination.page * response.pagination.per_page < response.pagination.total);
      console.log("setHasMore:", response.cards.length > 0 && response.pagination.page * response.pagination.per_page < response.pagination.total);
      setPrevNav(selectedNav);
      console.log("setPrevNav:", selectedNav);
      setError(null);
    } catch (err) {
      console.error("加载探索卡片失败:", err);
      setError("加载数据失败，请稍后重试");
    } finally {
      setLoading(false);
      console.log("setLoading(false)");
    }
  };

  // 2. useEffect 依赖所有分页相关参数和 loading
  useEffect(() => {
    console.log("useEffect 依赖触发, loading:", loading, "page:", page, "selectedNav:", selectedNav);
    if (loading) {
      loadCards();
    }
  }, [page, selectedNav, filterParams, sortParams, loading]);

  // 导航变化时重置状态
  useEffect(() => {
    if (prevNav !== selectedNav) {
      setCards([])
      setPage(1)
      setHasMore(true)
      setLoading(true)
    }
  }, [selectedNav, prevNav])

  return (
    <div className={`explore-page ${isChatOpen ? "chat-open" : ""}`}>
      <div className="filter-container">
        <FilterSystem 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          currentFilter={filterParams}
          currentSort={sortParams}
        />
      </div>

      <div className="cards-container">
        {cards.length > 0 ? (
          cards.map((card, index) => {
            if (index === cards.length - 1) {
              return (
                <div ref={lastCardElementRef} key={card.id} className="card-wrapper">
                  <CardItem card={card} />
                </div>
              )
            } else {
              return (
                <div key={card.id} className="card-wrapper">
                  <CardItem card={card} />
                </div>
              )
            }
          })
        ) : !loading ? (
          <div className="no-data">暂无数据</div>
        ) : null}

        {/* 只有有数据时才显示 ListFooter */}
        {cards.length > 0 && <ListFooter loading={loading} hasMore={hasMore} />}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

export default ExplorePage
