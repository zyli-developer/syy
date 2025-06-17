import { useState, useEffect, useCallback } from 'react';

/**
 * 测试进度的自定义Hook
 * @param {Function} onComplete - 进度完成后的回调函数
 * @returns {Object} 包含测试状态、进度和开始测试方法的对象
 */
const useTestProgress = (onComplete) => {
  // 测试状态
  const [isTesting, setIsTesting] = useState(false);
  // 测试进度，0-100
  const [testProgress, setTestProgress] = useState(0);
  
  /**
   * 开始测试方法
   * 重置进度并设置测试状态为true
   */
  const startTest = useCallback(() => {
    setIsTesting(true);
    setTestProgress(0);
  }, []);
  
  /**
   * 监听测试状态变化
   * 当测试进行中时，启动定时器自动增加进度
   */
  useEffect(() => {
    let timer;
    if (isTesting && testProgress < 100) {
      // 设置定时器，每100ms增加1%进度
      timer = setInterval(() => {
        setTestProgress(prev => {
          const next = prev + 1;
          // 达到100%时清除定时器并调用完成回调
          if (next >= 100) {
            clearInterval(timer);
            setIsTesting(false);
            if (onComplete) onComplete();
          }
          return next;
        });
      }, 100);
    }
    // 清除定时器，防止内存泄漏
    return () => timer && clearInterval(timer);
  }, [isTesting, testProgress, onComplete]);
  
  return { isTesting, testProgress, startTest };
};

export default useTestProgress; 