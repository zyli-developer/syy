import { mockSceneData } from './mockData';

export const getSceneContent = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSceneData);
    }, 500);
  });
};

export const updateSceneContent = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data });
    }, 500);
  });
}; 