import styled from 'styled-components'
import { Layout } from 'antd'
const { Sider } = Layout

// Wrap Antd’s Sider
export const StyledSider = styled(Sider)`
  &.app-sidebar.collapsed {
    width: 48px !important;
    min-width: 48px !important;
  }
`

export const SidebarTopContainer = styled.div`
  padding: ${p => (p.collapsed ? '8px' : '24px 16px')};
  display: flex;
  align-items: center;
  color: #122415;
  transition: padding 0.2s;

  .logo-company-icon {
    margin-right: ${p => (p.collapsed ? '0' : '12px')};
  }
`

export const LogoCompanyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--color-primary, #1890ff);
  border-radius: 6px;
  margin-right: ${p => (p.collapsed ? '0' : '8px')};
  color: #fff;
  font-weight: bold;
`

export const LogoCompanyText = styled.div`
  display: ${p => (p.collapsed ? 'none' : 'flex')};
  flex-direction: column;
  justify-content: space-between;

  span:first-child {
    font-weight: 500;
    font-size: 14px;
  }
  span:last-child {
    font-weight: 300;
    font-size: 10px;
  }
`

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  padding: ${p => (p.collapsed ? '12px 0' : '0 16px 4px')};
  border-bottom: 1px solid #e8e9f1;
  justify-content: ${p => (p.collapsed ? 'center' : 'flex-start')};

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background-color: #000;
    border-radius: 6px;
    margin-right: ${p => (p.collapsed ? '0' : '12px')};
    color: #fff;
    font-weight: bold;
    font-size: 10px;
  }
`

export const LogoText = styled.div`
  display: ${p => (p.collapsed ? 'none' : 'block')};
  font-weight: 600;
  font-size: 12px;
`

export const SidebarMenuContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${p => (p.collapsed ? '16px 0' : '8px 0')};
  display: flex;
  flex-direction: column;
  gap: ${p => (p.collapsed ? '24px' : '0')};
`

export const MenuItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${p => (p.collapsed ? '16px 0' : '8px 16px')};
  cursor: pointer;
  background-color: ${p => (p.active ? '#E7F0F5' : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: #E7F0F5;
  }

  .menu-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .menu-item-icon {
    font-size: 16px;
  }

  .menu-item-title {
    display: ${p => (p.collapsed ? 'none' : 'inline')};
    font-size: 14px;
  }

  .menu-item-expand-icon {
    display: ${p => (p.collapsed ? 'none' : 'inline-flex')};
    font-size: 12px;
    color: #8c8c8c;
    padding: 4px;
    border-radius: 4px;
    margin-left: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: #1890ff;
    }
  }
`

export const SubmenuContainer = styled.div`
  padding-left: 10px;
  margin-top: 4px;
`

export const SubmenuItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
  background-color: ${p => (p.active ? '#e6f4fe' : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f7ff;
  }

  .submenu-item-content {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .submenu-item-icon {
    font-size: 14px;
    margin-right: 8px;
    color: #595959;
  }

  .submenu-item-title {
    font-size: 12px;
    color: #333;
  }

  .submenu-more-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    color: #8c8c8c;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s, background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f0f0f0;
      color: #1890ff;
    }
  }
  &:hover .submenu-more-btn {
    opacity: 1;
  }
`

// you can continue similarly for UserInfoArea, workspace-popover, etc.