import React, { useState } from 'react';
import DashboardHeader from "./header";
import NavbarVertical from "./navbar/NavbarVertical"
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import useCollapse from '../hooks/useCollapse';

const { Content } = Layout;

const DashboardLayout = () => {
  const { isCollapse } = useCollapse();
  const [open, setOpen] = useState(false);

  return (
    <Layout className='bg-color'>
      <NavbarVertical
        isCollapse={isCollapse}
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />

      <Layout style={{ marginLeft: !isCollapse ? 240 : 58 }}>
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
