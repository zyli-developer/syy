/**
 * 日期工具函数
 */

/**
 * 格式化日期为可读字符串
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 是否为今天
  if (date >= today) {
    return formatTime(date);
  }
  
  // 是否为昨天
  if (date >= yesterday && date < today) {
    return `昨天 ${formatTime(date)}`;
  }
  
  // 是否为过去7天内
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
  if (date >= oneWeekAgo) {
    const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${dayNames[date.getDay()]} ${formatTime(date)}`;
  }
  
  // 是否为本年内
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(date)}`;
  }
  
  // 超过一年
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(date)}`;
}

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  let hours = date.getHours();
  let minutes = date.getMinutes();
  
  // 补零
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutes}`;
}
