import PropTypes from 'prop-types';
import CollapseButton from './CollapseButton';
import { Layout } from 'antd';
import './header-style.css'
import useCollapse from '../../hooks/useCollapse';
import NotificationPopover from './NotificationPopover';
import AccountPopover from './AccountPopover';

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
}

const { Header } = Layout;

export default function DashboardHeader({ onOpenSidebar, isCollapse }) {
  const { onToggleCollapse } = useCollapse();

  return (
    <Header
      className='header-container bg-color d-flex justify-content-between p-0 align-items-center'
      style={{ width: '100vw' }}
    >
      <div className='header-left ms-15'>
        <CollapseButton
          isCollapse={isCollapse}
          onToggleCollapse={onToggleCollapse}
          onOpenSidebar={onOpenSidebar}
        />
      </div>
      <div className='header-right d-flex pe-18 gap-22'>
        <NotificationPopover />
        <AccountPopover />
      </div>
    </Header>
  )
}

