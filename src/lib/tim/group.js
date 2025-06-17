/**
 * 腾讯云即时通讯IM群组模块
 */
import { getTIMInstance } from './core';
import TencentCloudChat from '@tencentcloud/chat';

/**
 * 创建群组
 * @param {Object} options 群组选项
 * @param {string} options.name 群组名称
 * @param {string} options.type 群组类型，默认为 'Work'
 * @param {Array<Object>} options.memberList 初始群成员列表
 * @returns {Promise<Object>} 创建结果，包含群组ID
 */
export async function createGroup(options) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法创建群组');
    throw new Error('TIM SDK未初始化');
  }

  const groupType = options.type || TencentCloudChat.TYPES.GRP_WORK; // 默认为工作群
  
  try {
    const createGroupOptions = {
      name: options.name,
      type: groupType,
      memberList: options.memberList || []
    };
    
    console.log('开始创建群组', createGroupOptions);
    
    const imResponse = await tim.createGroup(createGroupOptions);
    const group = imResponse.data.group;
    
    console.log('创建群组成功', group);
    
    return group;
  } catch (error) {
    console.error('创建群组失败', error);
    throw error;
  }
}

/**
 * 创建群组并自动添加默认成员
 * @param {Object} options 群组选项
 * @param {string} options.name 群组名称
 * @param {boolean} options.addDefaultMembers 是否添加默认成员，默认为true
 * @returns {Promise<Object>} 创建结果，包含群组信息和添加成员结果
 */
export async function createGroupWithDefaultMembers(options) {
  try {
    // 1. 创建群组
    const group = await createGroup({
      name: options.name,
      type: TencentCloudChat.TYPES.GRP_WORK // 使用SDK常量，固定为工作群
    });
    
    // 2. 如果选项中指定需要添加默认成员（默认为true）
    if (options.addDefaultMembers !== false) {
      // 指定需要添加的默认成员ID列表
      const defaultMemberIDs = [
        '@RBT#001',
        '@RBT#003',
        '@RBT#004',
        '@RBT#005',
        // '@RBT#006'
      ];
      
      console.log(`准备向群组 ${group.groupID} 添加默认成员`, defaultMemberIDs);
      
      try {
        // 3. 添加默认成员
        const addMembersResult = await addGroupMembers(group.groupID, defaultMemberIDs);
        
        // 4. 返回群组信息和添加成员结果
        return {
          group,
          membersResult: addMembersResult
        };
      } catch (addError) {
        console.error(`向群组 ${group.groupID} 添加默认成员失败`, addError);
        // 即使添加成员失败，仍然返回创建成功的群组信息
        return {
          group,
          membersResult: null,
          membersError: addError
        };
      }
    }
    
    // 如果不需要添加默认成员，直接返回群组信息
    return { group };
  } catch (error) {
    console.error('创建群组并添加默认成员失败', error);
    throw error;
  }
}

/**
 * 搜索用户
 * @param {string} keyword 搜索关键词
 * @returns {Promise<Array>} 用户列表
 */
export async function searchUsers(keyword) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法搜索用户');
    throw new Error('TIM SDK未初始化');
  }
  
  try {
    console.log(`搜索用户: ${keyword}`);
    
    // 使用官方的searchCloudUsers API搜索用户
    // 注意：该功能需要购买云端搜索插件，v3.5.0版本及以上支持
    // 参考文档：https://cloud.tencent.com/document/product/269/114757
    const imResponse = await tim.searchCloudUsers({
      keywordList: [keyword], // 关键词列表，这里只使用一个关键词
      keywordListMatchType: 'or', // 关键词匹配类型，默认为or关系
      count: 20 // 每次搜索返回的结果数量，默认为20，最大为100
    });
    
    console.log('搜索用户成功', imResponse.data);
    
    // 从返回结果中提取用户列表
    const { searchResultList } = imResponse.data;
    
    // 如果没有找到用户，尝试获取最近联系人
    if (!searchResultList || searchResultList.length === 0) {
      console.warn('云端搜索未找到匹配用户，尝试搜索本地会话列表');
      try {
        const conversationListResponse = await tim.getConversationList();
        if (conversationListResponse.data.conversationList && conversationListResponse.data.conversationList.length > 0) {
          // 筛选出单聊会话
          const c2cConversations = conversationListResponse.data.conversationList.filter(
            conversation => conversation.type === 'C2C'
          );
          
          // 在单聊会话中进行本地过滤
          const filteredUsers = c2cConversations.filter(conversation => {
            const profile = conversation.userProfile;
            return conversation.userID.includes(keyword) || 
                   (profile && profile.nick && profile.nick.includes(keyword));
          });
          
          if (filteredUsers.length > 0) {
            // 格式化用户数据
            return filteredUsers.map(conversation => ({
              userID: conversation.userID,
              nick: conversation.userProfile?.nick || conversation.userID,
              avatar: conversation.userProfile?.avatar
            }));
          }
        }
      } catch (conversationError) {
        console.warn('获取会话列表失败', conversationError);
      }
      
      // 如果本地会话也没有找到匹配的用户，返回空数组
      return [];
    }
    
    // 返回搜索结果
    return searchResultList;
  } catch (error) {
    console.error('搜索用户失败', error);
    // 如果是云端搜索插件未购买或其他API错误，尝试使用本地会话列表进行搜索
    console.warn('云端搜索失败，可能是未购买云端搜索插件或API不支持，尝试使用本地会话列表');
    try {
      const conversationListResponse = await tim.getConversationList();
      if (conversationListResponse.data.conversationList && conversationListResponse.data.conversationList.length > 0) {
        // 筛选出单聊会话
        const c2cConversations = conversationListResponse.data.conversationList.filter(
          conversation => conversation.type === 'C2C'
        );
        
        // 在单聊会话中进行本地过滤
        const filteredUsers = c2cConversations.filter(conversation => {
          const profile = conversation.userProfile;
          return conversation.userID.includes(keyword) || 
                 (profile && profile.nick && profile.nick.includes(keyword));
        });
        
        if (filteredUsers.length > 0) {
          // 格式化用户数据
          return filteredUsers.map(conversation => ({
            userID: conversation.userID,
            nick: conversation.userProfile?.nick || conversation.userID,
            avatar: conversation.userProfile?.avatar
          }));
        }
      }
    } catch (conversationError) {
      console.warn('获取会话列表失败', conversationError);
    }
    
    return [];
  }
}

/**
 * 添加群成员
 * @param {string} groupID 群组ID
 * @param {Array<string>} userIDList 用户ID列表
 * @returns {Promise<Object>} 添加结果
 */
export async function addGroupMembers(groupID, userIDList) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法添加群成员');
    throw new Error('TIM SDK未初始化');
  }

  try {
    console.log(`向群组 ${groupID} 添加成员`, userIDList);
    
    const imResponse = await tim.addGroupMember({
      groupID,
      userIDList
    });
    
    console.log('添加群成员成功', imResponse.data);
    
    return imResponse.data;
  } catch (error) {
    console.error('添加群成员失败', error);
    throw error;
  }
} 