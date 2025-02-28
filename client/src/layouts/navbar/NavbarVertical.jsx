import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { Layout, Menu, Drawer } from 'antd';
import './navbar-vertical-style.css'
import { Logo, LogoMobile } from '../../components/Logo';
import { PATH_PAGE } from '../../routes/path';
import { ChartPie, FolderDot } from 'lucide-react';

NavbarVertical.propTypes = {
  isCollapse: PropTypes.bool,
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

const { Sider } = Layout;

const bgColor = '#09090B';
const headerColor = '#9A9A9B';
const ff = "Inter, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

const NAVBAR_THEME = 'dark';
const NAVBAR_VERTICAL_WIDTH = 240;
const NAVBAR_VERTICAL_COLLAPSED_WIDTH = 58;

const DRAWER_WIDTH = 280;
const NAVBAR_VERTICAL_MOBILE_WIDTH = 280;


const menuStyle = {
  border: 'none',
  backgroundColor: bgColor,
  fontFamily: ff,
};

const siderStyle = {
  height: '100vh',
  position: 'fixed',
  padding: '0px 5px 0px 5px',
  backgroundColor: bgColor,
  zIndex: 1000,
  left: 0,
  top: 0,
};

const siderMobileStyle = {
  height: '100vh',
  position: 'fixed',
  padding: '0px 5px 0px 5px',
  backgroundColor: bgColor,
  left: 0
};

export default function NavbarVertical({ isCollapse, isOpenSidebar, onCloseSidebar }) {
  const { isMobile } = useResponsive();
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }

    if (pathname.includes('/project/list')) {
      setSelectedKey(['project']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/thong-ke')) {
      setSelectedKey(['statistics']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/don-hang')) {
      setSelectedKey(['bill']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/khach-hang')) {
      setSelectedKey(['customer']);
      setOpenKeys(['account']);
    }
    else {
      setSelectedKey([]);
      setOpenKeys([]);
    }

  }, [pathname]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <>
      {!isMobile ?
        <Sider className={`nav-vertical`}
          trigger={null}
          collapsible
          theme={NAVBAR_THEME}
          collapsed={isCollapse}
          style={siderStyle}
          width={NAVBAR_VERTICAL_WIDTH}
          collapsedWidth={NAVBAR_VERTICAL_COLLAPSED_WIDTH}
        >
          {<Logo isCollapse={isCollapse} />}
          {group.map((item, index) => {
            return (
              <ListMenuItem
                key={item.name}
                item={item}
                index={index}
                selectedKey={selectedKey}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                isCollapse={isCollapse}
              />
            )
          })}
        </Sider>
        :
        <Drawer
          width={DRAWER_WIDTH}
          placement={'left'}
          closable={false}
          onClose={onCloseSidebar}
          open={isOpenSidebar}
          style={{ backgroundColor: bgColor }}
        >
          <Sider className='nav-vertical-mobile'
            trigger={null}
            collapsible
            theme={NAVBAR_THEME}
            width={NAVBAR_VERTICAL_MOBILE_WIDTH}
            style={siderMobileStyle}
          >
            <LogoMobile />
            {group.map((item, index) => {
              return (
                <ListMenuItem
                  key={item.name}
                  item={item}
                  index={index}
                  selectedKey={selectedKey}
                  openKeys={openKeys}
                  onOpenChange={handleOpenChange}
                  isCollapse={isCollapse}
                />
              )
            })}
          </Sider>
        </Drawer>
      }
    </>
  )
}

const ICONS = {
  statistics: <ChartPie size={17} />,
  project: <FolderDot size={17} />,
}

const labelStyle = {
  fontSize: 14,
}

const SpanStyle = ({ label }) => (
  <span style={labelStyle}>{label}</span>
)

const ListMenuItem = ({ item, index, selectedKey, openKeys, onOpenChange, isCollapse }) => {
  return (
    <>
      {!isCollapse &&
        <span style={{
          marginLeft: '16px',
          display: 'block',
          marginTop: index > 0 ? '20px' : '0px',
          marginBottom: '5px',
          fontWeight: 'bold',
          fontSize: '12.5px',
          color: headerColor,
          fontFamily: ff,
        }}
        >
          {item.name}
        </span>
      }
      <Menu style={menuStyle}
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={item.items}
      />
    </>
  )
}

const group = [
  {
    name: 'Dashboards',
    items: [
      {
        key: 'statistics',
        label: <Link to={PATH_PAGE.thong_ke}>
          <SpanStyle label="Dashboard" />
        </Link>,
        icon: ICONS.statistics,
      },
      {
        key: 'project',
        label: <Link to={PATH_PAGE.project.list}>
          <SpanStyle label="Project Management" />
        </Link>,
        icon: ICONS.project,
      },
      // {
      //   key: 'account',
      //   label: <SpanStyle label='Tài khoản' />,
      //   icon: ICONS.account,
      //   children: [
      //     {
      //       key: 'customer',
      //       label:
      //         <Link to={DUONG_DAN_TRANG.khach_hang.danh_sach}>
      //           <SpanStyle label='Khách hàng' />
      //         </Link>
      //     },
      //     {
      //       key: 'employee',
      //       label:
      //         <Link to={DUONG_DAN_TRANG.nhan_vien.danh_sach}>
      //           <SpanStyle label='Nhân viên' />
      //         </Link>
      //     },
      //   ],
      // },
    ]
  },

  // {
  //   name: 'App',
  //   items: [
  //     {
  //       key: 'statistics',
  //       label: <Link to={DUONG_DAN_TRANG.thong_ke}>
  //         <SpanStyle label="Dashboard" />
  //       </Link>,
  //       icon: ICONS.statistics,
  //     },
  //     {
  //       key: 'bill',
  //       label: <Link to={DUONG_DAN_TRANG.san_pham.mau_sac}>
  //         <SpanStyle label="Task" />
  //       </Link>,
  //       icon: ICONS.bill,
  //     },
  //   ]
  // }
]

