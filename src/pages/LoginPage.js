import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, message, Typography, Spin, Alert, Modal, List, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChatContext } from "../contexts/ChatContext";
import loginLeft from '../styles/images/login-left.png';
import loginTitle from '../styles/images/login-title.png';
import workspaceCreate from '../styles/images/workspace-create.png';
import workspaceJoin from '../styles/images/workspace-join.png';
import workspaceService from '../services/workspaceService';
const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { initChat } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checked, setChecked] = useState(false);
  const [loginType, setLoginType] = useState("phone"); // "phone" | "account" | "sso"
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceStep, setWorkspaceStep] = useState('select'); // select | join
  const [workspaceList, setWorkspaceList] = useState([]);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    industry: '',
    orgName: '',
    role: '',
    product: '',
    market: '',
    preference: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createErrors, setCreateErrors] = useState({});
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: '',
    industry: '',
    orgName: '',
    role: '',
    product: '',
    market: '',
    preference: '',
  });
  const [personalErrors, setPersonalErrors] = useState({});
  const [personalLoading, setPersonalLoading] = useState(false);

  const industryOptions = [
    { label: '互联网', value: '互联网' },
    { label: '教育', value: '教育' },
    { label: '医疗', value: '医疗' },
    { label: '金融', value: '金融' },
    { label: '制造业', value: '制造业' },
    { label: '其他', value: '其他' },
  ];

  const roleOptions = [
    { label: '项目经理', value: '项目经理' },
    { label: '科研人员', value: '科研人员' },
    { label: '法务', value: '法务' },
    { label: '学生', value: '学生' },
    { label: '经纪人', value: '经纪人' },
    { label: '运营', value: '运营' },
    { label: '其他', value: '其他' },
  ];

  const marketOptions = [
    { label: 'B2B', value: 'B2B' },
    { label: 'B2C', value: 'B2C' },
    { label: 'Gov', value: 'Gov' },
    { label: 'Others', value: 'Others' },
  ];

  const preferenceOptions = [
    { label: '线上', value: '线上' },
    { label: '线下', value: '线下' },
    { label: '混合', value: '混合' },
  ];

  const customSuffixIcon = (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path d="M5 7l4 4 4-4" stroke="#5D6D67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, location]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setLoginError("");
      const success = await login({
        username: values.username || values.phone,
        password: values.password || values.code,
      });
      console.log('login返回:', success);
      if (success && typeof success === 'object') {
        const user = success.user || success;
        handleLoginSuccess(user);
      } else {
        setLoginError("账号/密码或验证码错误，请检查并修改");
      }
    } catch (error) {
      setLoginError("账号/密码或验证码错误，请检查并修改");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (user) => {
    // 先完成页面跳转和 UI 反馈
    if (!user?.workspace) {
      setShowWorkspaceModal(true);
    } else {
      message.success('登录成功');
      navigate("/");
    }

    // IM 登录异步执行，不阻塞主流程
    if (user && user.user_signature) {
      setTimeout(async () => {
        try {
          await initChat(user.id || user.email, user.user_signature);
          console.log('IM登录成功');
        } catch (e) {
          console.error('IM登录失败', e);
        }
      }, 0);
    }
  };

  const fetchWorkspaceList = async (search = "") => {
    setWorkspaceLoading(true);
    try {
      let list = await workspaceService.getWorkspaces();
      if (search) {
        list = list.filter(ws => ws.name.toLowerCase().includes(search.toLowerCase()));
      }
      setWorkspaceList(list);
    } catch {
      setWorkspaceList([]);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  useEffect(() => {
    if (showWorkspaceModal && workspaceStep === 'join') {
      fetchWorkspaceList(workspaceSearch);
    }
  }, [showWorkspaceModal, workspaceStep]);

  const handleWorkspaceSearch = (e) => {
    setWorkspaceSearch(e.target.value);
    fetchWorkspaceList(e.target.value);
  };

  const handleSelectWorkspace = (ws) => {
    setSelectedWorkspace(ws);
  };

  const handleJoinWorkspace = () => {
    if (!selectedWorkspace) {
      message.warning('请选择或新建一个Workspace');
      return;
    }
    message.success(`已加入Workspace: ${selectedWorkspace.name}`);
    setShowWorkspaceModal(false);
    navigate("/");
  };

  const handleCreateWorkspace = () => {
    setShowCreateModal(true);
  };

  const handleCreateInput = (key, value) => {
    setCreateForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateSubmit = async () => {
    const { name, industry, orgName, role, product, market, preference } = createForm;
    const errors = {};
    if (!name) errors.name = true;
    if (!industry) errors.industry = true;
    if (!orgName) errors.orgName = true;
    if (!role) errors.role = true;
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) {
      message.warning('请填写所有必填项');
      return;
    }
    setCreateLoading(true);
    setTimeout(() => {
      // 写入workspace到localStorage的syntrust_user
      try {
        const userStr = localStorage.getItem('syntrust_user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userObj.workspace = {
            name,
            industry,
            orgName,
            role,
            product,
            market,
            preference
          };
          localStorage.setItem('syntrust_user', JSON.stringify(userObj));
        }
      } catch (e) { /* ignore */ }
      message.success('Workspace 创建成功');
      setShowCreateModal(false);
      setShowWorkspaceModal(false);
      navigate("/");
      setCreateLoading(false);
    }, 1000);
  };

  const switchLoginType = (type) => setLoginType(type);

  const handlePersonalInput = (key, value) => {
    setPersonalForm(prev => ({ ...prev, [key]: value }));
  };
  const handlePersonalSubmit = async () => {
    const { name, industry } = personalForm;
    const errors = {};
    if (!name) errors.name = true;
    if (!industry) errors.industry = true;
    setPersonalErrors(errors);
    if (Object.keys(errors).length > 0) {
      message.warning('请填写所有必填项');
      return;
    }
    setPersonalLoading(true);
    setTimeout(() => {
      try {
        const userStr = localStorage.getItem('syntrust_user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userObj.workspace = { ...personalForm };
          localStorage.setItem('syntrust_user', JSON.stringify(userObj));
        }
      } catch (e) { /* ignore */ }
      message.success('个人 Workspace 创建成功');
      setShowPersonalModal(false);
      setShowWorkspaceModal(false);
      navigate("/");
      setPersonalLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* 左侧图片区 */}
      <div className="hidden md:flex flex-1 items-center justify-center  h-screen">
        <img src={loginLeft} alt="login left" className="w-full h-full" style={{ borderTopRightRadius: 42, borderBottomRightRadius: 42 }} />
      </div>
      {/* 右侧登录表单区 */}
      <div className="flex flex-col flex-1 items-center justify-center  min-h-screen px-8">
        {/* Logo与标题 */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[32px] font-normal text-[#122415] font-opposans">登录到</span>
            <img src={loginTitle} alt="SynTrust" className="h-10 align-middle" />
          </div>
        </div>
        {/* 登录方式切换 */}
        <div className="flex w-full max-w-[400px] rounded-[29px] mb-8 overflow-hidden">
          <button
            className={`flex-1 py-3 text-[18px] font-opposans transition-colors bg-[#F7F9F8] ${loginType === "phone" ? "text-[#122415] font-[400]" : "text-[#5D6D67]"}`}
            onClick={() => switchLoginType("phone")}
          >
            验证码登录
          </button>
          <div className="h-[20px] w-[1px] bg-[#5D6D67] mx-auto my-auto"></div>
          <button
            className={`flex-1 py-3 text-[18px] font-opposans transition-colors bg-[#F7F9F8] ${loginType === "account" ? "text-[#122415] font-[400]" : "text-[#5D6D67]"}`}
            onClick={() => switchLoginType("account")}
          >
            账号登录
          </button>
          <div className="h-[20px] w-[1px] bg-[#5D6D67] mx-auto my-auto"></div>
          <button
            className={`flex-1 py-3 text-[18px] font-opposans transition-colors bg-[#F7F9F8] ${loginType === "sso" ? "text-[#122415] font-[400]" : "text-[#5D6D67]"}`}
            onClick={() => switchLoginType("sso")}
          >
            SSO登录
          </button>
        </div>
        {/* 登录表单 */}
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          className="w-full max-w-[400px]"
        >
          {loginType === "phone" && (
            <>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "请输入手机号" }]}
                className="mb-2"
              >
                <Input
                  className="rounded-[29px] h-12 bg-[#F7F9F8] border  px-4 text-base"
                  placeholder="手机号"
                  prefix={<span className="text-[#5D6D67] mr-2">+86</span>}
                />
              </Form.Item>
              <Form.Item
                name="code"
                rules={[{ required: true, message: "请输入验证码" }]}
                className="mb-2"
              >
                <Input
                  className="rounded-[23px] h-12 bg-[#F7F9F8] border  px-4 text-base"
                  placeholder="请输入6位短信验证码"
                  suffix={<Button type="link" className="text-[#006FFD] px-0">获取验证码</Button>}
                />
              </Form.Item>
            </>
          )}
          {loginType === "account" && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
                className="mb-2"
              >
                <Input
                  className="rounded-[29px] h-12 bg-[#F7F9F8] border  px-4 text-base"
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
                className="mb-2"
              >
                <Input.Password
                  className="rounded-[23px] h-12 bg-[#F7F9F8] border  px-4 text-base"
                  placeholder="密码"
                />
              </Form.Item>
            </>
          )}
          {loginType === "sso" && (
            <div className="w-full flex flex-col items-center py-8">
              <span className="text-[#5D6D67] text-lg">请使用企业SSO登录</span>
            </div>
          )}
          {/* 协议勾选 */}
          <Form.Item className="mb-4">
            <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)}>
              <span className="text-xs text-[#122415]">
                勾选即代表您已阅读并同意我们的
                <a href="#" className="text-[#58BD6D] underline mx-1">用户协议</a>
                与
                <a href="#" className="text-[#58BD6D] underline mx-1">隐私政策</a>，未注册的手机号将自动注册
              </span>
            </Checkbox>
          </Form.Item>
          {/* 错误提示 */}
          {loginError && (
            <Alert message={loginError} type="error" showIcon className="mb-4" />
          )}
          {/* 登录按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-[24px] text-base font-inter bg-[#122415] hover:bg-[#58BD6D] border-none"
              loading={loading}
              disabled={!checked}
            >
              登录/注册
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* Workspace Modal */}
      <Modal
        open={showWorkspaceModal}
        footer={null}
        closable={false}
        width={600}
        styles={{ body: { padding: 0, borderRadius: 24 } }}
      >
        {workspaceStep === 'select' && (
          <div className="flex flex-col md:flex-row items-center justify-center p-8 gap-8">
            <div className="flex-1 flex flex-col items-center cursor-pointer" onClick={() => setShowPersonalModal(true)}>
              <img src={workspaceCreate} alt="create workspace" className="w-32 h-32 mb-4" />
              <div className="text-lg font-bold mb-2">创建个人 Workspace</div>
              <div className="text-gray-500 text-sm">适合个人使用，自动创建</div>
            </div>
            <div className="flex-1 flex flex-col items-center cursor-pointer" onClick={() => setWorkspaceStep('join')}>
              <img src={workspaceJoin} alt="join workspace" className="w-32 h-32 mb-4" />
              <div className="text-lg font-bold mb-2">加入/创建组织 Workspace</div>
              <div className="text-gray-500 text-sm">适合团队协作，支持搜索/新建</div>
            </div>
          </div>
        )}
        {workspaceStep === 'join' && (
          <div className="p-8">
            <div className="mb-4 text-lg font-bold">加入 Workspace</div>
            <Input.Search
              placeholder="输入Workspace名称搜索"
              value={workspaceSearch}
              onChange={handleWorkspaceSearch}
              enterButton
              loading={workspaceLoading}
              className="mb-4"
            />
            <List
              bordered
              dataSource={workspaceList}
              loading={workspaceLoading}
              renderItem={item => (
                <List.Item
                  className={`cursor-pointer ${selectedWorkspace?.id === item.id ? 'bg-green-100' : ''}`}
                  onClick={() => handleSelectWorkspace(item)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-xs text-gray-400">({item.type})</span>
                  </div>
                </List.Item>
              )}
              style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}
            />
            <div className="flex gap-4 mt-4">
              <Button onClick={handleCreateWorkspace} type="default" className="flex-1">新建 Workspace</Button>
              <Button onClick={handleJoinWorkspace} type="primary" className="flex-1">登入</Button>
            </div>
          </div>
        )}
      </Modal>
      {showCreateModal && (
        <Modal
          open={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          footer={null}
          width={700}
          styles={{ body: { padding: 0, borderRadius: 24, background: '#F7F9F8' } }}
          closable={false}
        >
          <div className="bg-[#F7F9F8] rounded-[24px] p-6">
            <div className="text-2xl font-bold mb-2">新建组织 Workspace</div>
            {/* 第一行：名称、行业 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-2">
              <div>
                <label className="font-bold text-sm mb-1 block">
                  <span className="text-red-500 mr-1">*</span>名称
                </label>
                <Input
                  placeholder="请输入名称"
                  value={createForm.name}
                  onChange={e => handleCreateInput('name', e.target.value)}
                  className="rounded-[12px] h-9 bg-[#F7F9F8] border border-[#E5E7EB] px-2 text-xs"
                  status={createErrors.name ? 'error' : ''}
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block">
                  <span className="text-red-500 mr-1">*</span>行业
                </label>
                <Select
                  placeholder="请选择行业"
                  value={createForm.industry}
                  onChange={v => handleCreateInput('industry', v)}
                  options={industryOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                  status={createErrors.industry ? 'error' : ''}
                />
              </div>
            </div>
            {/* 第二行：组织名称、职务/团队角色 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-2">
              <div>
                <label className="font-bold text-sm mb-1 block">
                  <span className="text-red-500 mr-1">*</span>组织名称
                </label>
                <Input
                  placeholder="请输入组织名称"
                  value={createForm.orgName}
                  onChange={e => handleCreateInput('orgName', e.target.value)}
                  className="rounded-[12px] h-9 bg-[#F7F9F8] border border-[#E5E7EB] px-2 text-xs"
                  status={createErrors.orgName ? 'error' : ''}
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block">
                  <span className="text-red-500 mr-1">*</span>职务/团队角色
                </label>
                <Select
                  placeholder="请选择职务/团队角色"
                  value={createForm.role}
                  onChange={v => handleCreateInput('role', v)}
                  options={roleOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                  status={createErrors.role ? 'error' : ''}
                />
              </div>
            </div>
            {/* 横线和奖励提示 */}
            <div className="my-2 border-t border-[#E5E7EB]" />
            <div className="text-[#2A703C] text-center mb-4">以下信息填写完整后奖励3积分</div>
            {/* 第三行：产品/项目（整行） */}
            <div className="mb-2">
              <label className="font-bold text-sm mb-1 block">产品/项目</label>
              <Input
                placeholder="请输入产品/项目"
                value={createForm.product}
                onChange={e => handleCreateInput('product', e.target.value)}
                className="rounded-[12px] h-9 bg-[#F7F9F8] border border-[#E5E7EB] px-2 text-xs"
              />
            </div>
            {/* 第四行：受众/市场、使用偏好 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
              <div>
                <label className="font-bold text-sm mb-1 block">受众/市场</label>
                <Select
                  placeholder="请选择受众/市场"
                  value={createForm.market}
                  onChange={v => handleCreateInput('market', v)}
                  options={marketOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block">使用偏好</label>
                <Select
                  placeholder="请选择使用偏好"
                  value={createForm.preference}
                  onChange={v => handleCreateInput('preference', v)}
                  options={preferenceOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                />
              </div>
            </div>
            <Button
              type="primary"
              className="w-full h-9 rounded-[12px] text-xs font-bold bg-[#122415] hover:bg-[#58BD6D] border-none mt-2"
              loading={createLoading}
              onClick={handleCreateSubmit}
            >
              创建完成
            </Button>
          </div>
        </Modal>
      )}
      {/* 新建个人workspace Modal */}
      {showPersonalModal && (
        <Modal
          open={showPersonalModal}
          onCancel={() => setShowPersonalModal(false)}
          footer={null}
          width={700}
          styles={{ body: { padding: 0, borderRadius: 24, background: '#F7F9F8' } }}
          closable={false}
        >
          <div className="bg-[#F7F9F8] rounded-[24px] p-6">
            <div className="text-2xl font-bold mb-2">新建个人 Workspace</div>
            {/* 第一行：名称、行业 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-2">
              <div>
                <label className="font-bold text-sm mb-1 block"><span className="text-red-500 mr-1">*</span>名称</label>
                <Input
                  placeholder="请输入名称"
                  value={personalForm.name}
                  onChange={e => handlePersonalInput('name', e.target.value)}
                  className="rounded-[12px] h-9 bg-[#F7F9F8] border border-[#E5E7EB] px-2 text-xs"
                  status={personalErrors.name ? 'error' : ''}
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block"><span className="text-red-500 mr-1">*</span>行业</label>
                <Select
                  placeholder="请选择行业"
                  value={personalForm.industry}
                  onChange={v => handlePersonalInput('industry', v)}
                  options={industryOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                  status={personalErrors.industry ? 'error' : ''}
                />
              </div>
            </div>
            {/* 横线和奖励提示 */}
            <div className="my-2 border-t border-[#E5E7EB]" />
            <div className="text-[#2A703C] text-center mb-4">以下信息填写完整后奖励3积分</div>
            {/* 第二行：组织名称、职务/团队角色 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-2">
              <div>
                <label className="font-bold text-sm mb-1 block"><span className="text-red-500 mr-1">*</span>组织名称</label>
                <Input
                  placeholder="请输入组织名称"
                  value={personalForm.orgName}
                  onChange={e => handlePersonalInput('orgName', e.target.value)}
                  className="rounded-[12px] h-9 bg-[#F7F9F8] border border-[#E5E7EB] px-2 text-xs"
                  status={personalErrors.orgName ? 'error' : ''}
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block"><span className="text-red-500 mr-1">*</span>职务/团队角色</label>
                <Select
                  placeholder="请选择职务/团队角色"
                  value={personalForm.role}
                  onChange={v => handlePersonalInput('role', v)}
                  options={roleOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                  status={personalErrors.role ? 'error' : ''}
                />
              </div>
            </div>
            {/* 第三行：产品/项目（整行） */}
            <div className="mb-2">
              <label className="font-bold text-sm mb-1 block">产品/项目</label>
              <Input
                placeholder="请输入产品/项目"
                value={personalForm.product}
                onChange={e => handlePersonalInput('product', e.target.value)}
                className="rounded-[12px] h-9 bg-[#F7F9F8] border border-[#E5E7EB] px-2 text-xs"
              />
            </div>
            {/* 第四行：受众/市场、使用偏好 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
              <div>
                <label className="font-bold text-sm mb-1 block">受众/市场</label>
                <Select
                  placeholder="请选择受众/市场"
                  value={personalForm.market}
                  onChange={v => handlePersonalInput('market', v)}
                  options={marketOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block">使用偏好</label>
                <Select
                  placeholder="请选择使用偏好"
                  value={personalForm.preference}
                  onChange={v => handlePersonalInput('preference', v)}
                  options={preferenceOptions}
                  className="custom-select rounded-[12px] h-9 px-2 text-xs w-full"
                  dropdownStyle={{ borderRadius: 8, fontSize: 12, padding: 0 }}
                  popupClassName="custom-select-dropdown"
                  suffixIcon={customSuffixIcon}
                />
              </div>
            </div>
            <Button
              type="primary"
              className="w-full h-9 rounded-[12px] text-xs font-bold bg-[#122415] hover:bg-[#58BD6D] border-none mt-2"
              loading={personalLoading}
              onClick={handlePersonalSubmit}
            >
              创建完成
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoginPage; 