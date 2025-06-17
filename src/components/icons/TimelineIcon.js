import React from 'react';

const TimelineIcon = ({ active = false }) => {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M1 3C1 2.05719 1 1.58579 1.29289 1.29289C1.58579 1 2.05719 1 3 1H9.26297C9.78693 1 10.0489 1 10.27 1.11833C10.4911 1.23665 10.6364 1.45463 10.9271 1.8906L12.2604 3.8906C12.6189 4.42835 12.7981 4.69722 12.7981 5C12.7981 5.30278 12.6189 5.57165 12.2604 6.1094L10.9271 8.1094C10.6364 8.54537 10.4911 8.76335 10.27 8.88167C10.0489 9 9.78693 9 9.26297 9H3C2.05719 9 1.58579 9 1.29289 8.70711C1 8.41421 1 7.94281 1 7V3Z" 
        stroke={active ? "var(--color-primary)" : "var(--color-text-tertiary)"} 
        strokeWidth="2"
      />
    </svg>
  );
};

export default TimelineIcon; 