import React from 'react';
import { Typography } from 'antd';
import SceneSection from '../components/SceneSection';

const { Title } = Typography;

const ScenePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>场景编辑</Title>
      <SceneSection isEditable={true} />
    </div>
  );
};

export default ScenePage; 