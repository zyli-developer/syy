import { useState, useCallback } from 'react';

// 合并重叠或相邻的区间
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  // 按start排序
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged = [Object.assign({}, sorted[0])];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = sorted[i];
    if (curr.start <= prev.end) {
      // 有重叠或相邻，合并
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push(Object.assign({}, curr));
    }
  }
  return merged;
}

/**
 * 通用受控高亮 Hook
 * 支持单条文本和多条文本（通过 id 区分）
 *
 * @returns {
 *   highlightMap, // { [id]: [{start, end, id}] }
 *   addHighlight(id, start, end),
 *   clearHighlights(id?),
 *   renderHighlightedText(text, highlights)
 * }
 */
export default function useTextHighlight() {
  const [highlightMap, setHighlightMap] = useState({});

  // 添加高亮区间，自动合并重叠区间
  const addHighlight = useCallback((id, start, end) => {
    if (start === end) return;
    setHighlightMap(prev => {
      const list = prev[id] || [];
      // 新区间
      const newInterval = { start: Math.min(start, end), end: Math.max(start, end), id: Date.now() + '-' + Math.random() };
      // 合并所有区间
      const merged = mergeIntervals([...list, newInterval]);
      return {
        ...prev,
        [id]: merged
      };
    });
  }, []);

  // 清除高亮
  const clearHighlights = useCallback((id) => {
    if (!id) {
      setHighlightMap({});
    } else {
      setHighlightMap(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }
  }, []);

  // 渲染高亮文本，自动合并区间，避免嵌套，key 用 start-end 保证唯一且稳定
  const renderHighlightedText = useCallback((text, highlights) => {
    if (!highlights || !highlights.length) return text;
    // 合并区间，避免重叠
    const merged = mergeIntervals(highlights);
    const result = [];
    let lastIndex = 0;
    merged.forEach((hl) => {
      if (hl.start > lastIndex) result.push(text.slice(lastIndex, hl.start));
      result.push(
        <span key={`${hl.start}-${hl.end}`} className="text-highlight-selection">
          {text.slice(hl.start, hl.end)}
        </span>
      );
      lastIndex = hl.end;
    });
    if (lastIndex < text.length) result.push(text.slice(lastIndex));
    return result;
  }, []);

  return {
    highlightMap,
    addHighlight,
    clearHighlights,
    renderHighlightedText,
  };
} 