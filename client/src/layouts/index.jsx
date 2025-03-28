import React, { useState } from 'react';
import DashboardHeader from "./header";
import NavbarVertical from "./navbar/NavbarVertical"
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import useCollapse from '../hooks/useCollapse';
import useResponsive from '@/hooks/useResponsive';

const { Content } = Layout;

const DashboardLayout = () => {
  const { isCollapse } = useCollapse();
  const { isMobile } = useResponsive();
  const [open, setOpen] = useState(false);

  return (
    <Layout className='bg-color'>
      <NavbarVertical
        isCollapse={isCollapse}
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />

      <Layout style={{ marginLeft: isMobile ? 0 : !isCollapse ? 240 : 58 }}>
        <DashboardHeader
          isCollapse={isCollapse}
          onOpenSidebar={() => setOpen(true)}
        />
        <Content style={{ marginTop: 64 }}>
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  )
}

export default DashboardLayout;
