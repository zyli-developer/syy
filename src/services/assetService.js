"use client"

import api from './api'
import endpoints from './endpoints'
import { getCurrentUser } from './authService'

/**
 * 处理资产响应数据
 * @param {Object} response - API响应
 * @returns {Object} 处理后的资产数据
 */
const processAssetsResponse = (response) => {
  console.log('资产服务 - 原始响应: ', response);
  
  if (!response || !response.data) {
    console.error('资产服务 - 响应无效: 缺少data字段');
    return { card: [], pagination: { total: 0, page: 1, per_page: 10 } }
  }
  
  // 适配不同的响应格式 (兼容直接返回card和包含在data字段中的情况)
  const responseData = response.data.data || response.data;
  console.log('资产服务 - 处理后的响应数据: ', responseData);
  
  const result = {
    card: responseData.card || [],
    pagination: responseData.pagination || { total: 0, page: 1, per_page: 10 },
    filterEcho: responseData.filter_echo,
    sortEcho: responseData.sort_echo
  };
  
  console.log('资产服务 - 返回结果: ', result);
  return result;
}

const assetService = {
  /**
   * 获取资产列表
   * @param {Object} params - 查询参数，包括tab, pagination, filter, sort
   * @returns {Promise} - 资产列表数据，包含card和pagination
   */
  getAssets: async (params = {}) => {
    try {
      console.log('资产服务 - 获取资产列表，参数: ', params);
      
      // 获取当前用户
      const currentUser = getCurrentUser()
      
      // 构建符合API规范的请求参数
      const requestParams = {
        tab: params.tab || "community", // 默认为community
        user_id: currentUser?.id || "",
        pagination: params.pagination || {
          page: 1,
          per_page: 12
        }
      }
      
      console.log('资产服务 - 请求参数: ', requestParams);

      // 如果有筛选条件，添加到搜索请求中
      if (params.filter || params.sort) {
        console.log('资产服务 - 使用搜索接口');
        // 使用搜索接口
        const searchParams = {
          tab: requestParams.tab,
          filter: params.filter,
          sort: params.sort,
          pagination: requestParams.pagination
        }
        
        // 调用搜索接口
        try {
          console.log('资产服务 - 调用搜索接口，参数: ', searchParams);
          const response = await api.post(
            endpoints.assets.search, 
            searchParams,
            'AssetSearchRequest',
            'AssetSearchResponse'
          )
          
          console.log('资产服务 - 搜索接口响应: ', response);
          // 处理响应数据
          return processAssetsResponse(response)
        } catch (error) {
          console.error('资产服务 - 搜索接口调用失败: ', error);
          throw error;
        }
      }
      
      // 调用列表接口
      try {
        console.log('资产服务 - 调用列表接口');
        const response = await api.get(
          endpoints.assets.list, 
          { params: requestParams },
          'GetAssetsResponse'
        )
        
        console.log('资产服务 - 列表接口响应: ', response);
        // 处理响应数据
        return processAssetsResponse(response)
      } catch (error) {
        console.error('资产服务 - 列表接口调用失败: ', error);
        throw error;
      }
    } catch (error) {
      console.error("获取资产列表失败:", error)
      // 返回一个空的响应结构，避免前端报错
      return {
        card: [],
        pagination: {
          total: 0,
          page: 1,
          per_page: 12
        }
      }
    }
  },
  
  /**
   * 获取资产详情
   * @param {String} id - 资产ID
   * @returns {Promise} - 资产详情数据
   */
  getAssetDetails: async (id) => {
    try {
      console.log(`资产服务 - 获取资产详情，ID: ${id}`);
      const response = await api.get(
        endpoints.assets.detail(id),
        {},
        'GetAssetResponse'
      )
      
      console.log('资产服务 - 详情接口响应: ', response);
      return response.data && response.data.asset ? response.data.asset : null
    } catch (error) {
      console.error(`获取资产详情失败:`, error)
      return null
    }
  }
}

export default assetService 