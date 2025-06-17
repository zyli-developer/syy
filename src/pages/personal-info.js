import React, { useEffect, useState } from 'react';
import { Avatar, Button, Tag, Tabs, Breadcrumb, Spin, message } from 'antd';
import { ShareAltOutlined, PlusOutlined, EditOutlined, SettingOutlined, PaperClipOutlined, LeftOutlined } from '@ant-design/icons';
import userService from '../services/userService';
import CreateTemplateModal from '../components/modals/CreateTemplateModal';

const { TabPane } = Tabs;

const PersonalInfoPage = () => {
  const [user, setUser] = useState(null);
  const [honors, setHonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [userInfo, honorList] = await Promise.all([
          userService.getPersonalInfo(),
          userService.getPersonalHonor(),
        ]);
        setUser(userInfo);
        setHonors(honorList);
      } catch (e) {
        message.error('获取个人信息失败');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 min-h-screen bg-[#f7f9f8]"><Spin size="large" /></div>;
  }

  if (!user) {
    return <div className="max-w-4xl mx-auto py-12 min-h-screen bg-[#f7f9f8]">未获取到个人信息</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 min-h-screen bg-[#f7f9f8] relative">
      {/* 面包屑+返回 */}
      <div className="mb-6 text-lg font-semibold text-[#18371D] tracking-wide flex items-center gap-2">
        <Button
          type="text"
          icon={<LeftOutlined />}
          className="!p-0 mr-2 text-base"
          onClick={() => window.history.back()}
        />
        <Breadcrumb>
          <Breadcrumb.Item>我的</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {/* 头像+用户名+设置/分享/编辑 */}
      <div className="flex items-center gap-6 mb-4">
        <Avatar size={96} src={user.avatar} className="bg-blue-100 border-4 border-white shadow-lg text-4xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900">@{user.name}</span>
            <Button type="text" icon={<EditOutlined />} className="!p-0" />
          </div>
          <div className="flex gap-8 text-gray-500 text-base mt-2">
            <span>关注 <b className="text-gray-900 font-bold">{user.follow}</b></span>
            <span>粉丝 <b className="text-gray-900 font-bold">{user.fans}</b></span>
            <span>获赞 <b className="text-gray-900 font-bold">{user.likes}</b></span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button className="bg-[#58BD6D] text-white rounded-full px-10 py-2 text-base font-bold">分享</Button>
          <Button type="text" icon={<SettingOutlined />} className="!p-0" />
        </div>
      </div>
      {/* 简介与标签 */}
      <div className="mt-2 text-gray-700 text-base">{user.intro}</div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {user.tags?.map(tag => (
          <Tag key={tag} className="rounded-full bg-green-50 text-green-700 px-4 py-1 border border-green-200">{tag}</Tag>
        ))}
        <Button type="dashed" shape="circle" icon={<PlusOutlined />} size="small" />
      </div>
      {/* 荣誉区 */}
      <div className="flex gap-4 mt-6 mb-8">
        {honors.map(h => (
          <div key={h.type} className="flex flex-col items-center bg-white rounded-xl shadow-md px-6 py-4 min-w-[100px]">
            <div className="text-sm text-gray-500">{h.label}</div>
            <div className="text-lg font-bold text-[#58BD6D]">{h.count}</div>
          </div>
        ))}
      </div>
      {/* Tab区 */}
      <div className="bg-white rounded-2xl shadow-lg px-6 py-4 mb-8">
        <Tabs
          defaultActiveKey="main"
          className="[&_.ant-tabs-nav]:mb-5 [&_.ant-tabs-tab]:text-base [&_.ant-tabs-tab]:font-semibold [&_.ant-tabs-tab]:px-8 [&_.ant-tabs-tab]:py-2 [&_.ant-tabs-tab]:rounded-t-2xl [&_.ant-tabs-tab-active]:bg-[#e6f7ff] [&_.ant-tabs-tab-active]:text-[#1890ff] [&_.ant-tabs-ink-bar]:hidden"
        >
          <TabPane tab="主页" key="main">
            <div className="grid grid-cols-2 gap-4 min-h-[200px]">
              <div className="bg-gray-200 rounded-lg h-32" />
              <div className="bg-gray-200 rounded-lg h-32" />
              <div className="bg-gray-200 rounded-lg h-32" />
            </div>
          </TabPane>
          <TabPane tab="动态" key="activity">
            <div className="grid grid-cols-2 gap-4 min-h-[200px]">
              <div className="bg-gray-200 rounded-lg h-32" />
              <div className="bg-gray-200 rounded-lg h-32" />
            </div>
          </TabPane>
          <TabPane tab="点赞" key="like">
            <div className="grid grid-cols-2 gap-4 min-h-[200px]">
              <div className="bg-gray-200 rounded-lg h-32" />
              <div className="bg-gray-200 rounded-lg h-32" />
            </div>
          </TabPane>
          <TabPane tab="收藏" key="fav">
            <div className="grid grid-cols-2 gap-4 min-h-[200px]">
              <div className="bg-gray-200 rounded-lg h-32" />
              <div className="bg-gray-200 rounded-lg h-32" />
            </div>
          </TabPane>
        </Tabs>
      </div>
      {/* 底部悬浮按钮 */}
      <div className="fixed left-1/2 bottom-10 -translate-x-1/2 z-20 flex justify-center w-full pointer-events-none">
        <Button
          shape="circle"
          size="large"
          icon={<PlusOutlined />}
          className="w-8 h-8 text-lg bg-gradient-to-br from-[#58BD6D] to-[#36cfc9] border-none flex items-center justify-center shadow-2xl pointer-events-auto hover:scale-110 hover:from-[#7be09a] hover:to-[#5cdbd3] transition-all duration-200 ease-in-out rounded-full"
          style={{ boxShadow: '0 8px 32px 0 rgba(88,189,109,0.25)' }}
          onClick={() => setShowCreateModal(true)}
        />
      </div>
      <CreateTemplateModal visible={showCreateModal} onCancel={() => setShowCreateModal(false)} onSubmit={() => setShowCreateModal(false)} />
    </div>
  );
};

export default PersonalInfoPage; 