// 滚动条样式定义
const hideScrollbarStyle = {
  msOverflowStyle: 'none',  // IE and Edge
  scrollbarWidth: 'none',   // Firefox
  '&::-webkit-scrollbar': {
    display: 'none'          // Chrome, Safari and Opera
  },
  overflow: 'auto'
};

// 透明滚动条样式定义
const transparentScrollbarStyle = {
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0, 0, 0, 0.2)'
  },
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0, 0, 0, 0.1) transparent'
};

export { hideScrollbarStyle, transparentScrollbarStyle };
