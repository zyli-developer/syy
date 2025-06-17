import { mockTemplateData } from './mockData';

export const getTemplateContent = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplateData);
    }, 500);
  });
};

export const updateTemplateContent = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data });
    }, 500);
  });
}; 