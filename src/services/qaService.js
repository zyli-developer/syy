import { mockQAData } from './mockData';

export const getQAContent = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockQAData);
    }, 500);
  });
}; 