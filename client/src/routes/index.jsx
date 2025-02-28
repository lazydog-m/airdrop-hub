import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import DashboardLayout from '../layouts';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  window.scrollTo(0, 0);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <DashboardLayout />
      ),
      children: [
        {
          path: 'project',
          children: [
            { path: 'list', element: <ProjectList /> },
            { path: 'create', element: <ProjectList /> },
            { path: ':id/edit', element: <ProjectList /> },
          ],
        },
        // { path: 'thong-ke', element: <ThongKe /> },
        // {
        //   path: 'san-pham',
        //   children: [
        // { path: 'danh-sach', element: <DanhSachSanPham /> },
        // { path: 'tao-moi', element: <ThemSuaSanPham /> },
        // { path: ':id', element: <ThemSuaSanPham /> },
        //   ],
        // },

        // {
        //   path: 'thuong-hieu',
        //   children: [
        //     { path: 'danh-sach', element: <DanhSachThuongHieu /> },
        //     { path: 'tao-moi', element: <ThemSuaThuongHieu /> },
        //     { path: ':id', element: <ThemSuaThuongHieu /> },
        //   ],
        // },
        //
        // {
        //   path: 'mau-sac',
        //   children: [
        //     { path: 'danh-sach', element: <DanhSachMauSac /> },
        // { path: 'tao-moi', element: <ThemSuaMauSac /> },
        // { path: ':id', element: <ThemSuaMauSac /> },
        //   ],
        // },
        //
        // {
        //   path: 'don-hang',
        //   children: [
        //     { path: 'danh-sach', element: <DanhSachDonHang /> },
        //     { path: ':id', element: <DonHangChiTiet /> },
        //   ],
        // },
        //
        // {
        //   path: 'nhan-vien',
        //   children: [
        //     { path: 'danh-sach', element: <DanhSachNhanVien /> },
        //     { path: 'tao-moi', element: <ThemSuaNhanVien /> },
        //     { path: ':id', element: <ThemSuaNhanVien /> },
        //   ],
        // },
        //
        // {
        //   path: 'khach-hang',
        //   children: [
        //     { path: 'danh-sach', element: <DanhSachKhachHang /> },
        //     { path: 'tao-moi', element: <ThemSuaKhachHang /> },
        //     { path: ':id', element: <ThemSuaKhachHang /> },
        //   ],
        // },
      ],
    },

    // { path: '/', element: <Navigate to="/dashboard/employee/list" replace /> },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// const ThemSuaSanPham = Loadable(lazy(() => import('../pages/dashboard/san-pham/ThemSuaSanPham')));
// const DanhSachDonHang = Loadable(lazy(() => import('../pages/dashboard/don-hang/DanhSachDonHang')));
// const DonHangChiTiet = Loadable(lazy(() => import('../pages/dashboard/don-hang/DonHangChiTiet')));
// const DanhSachSanPham = Loadable(lazy(() => import('../pages/dashboard/san-pham/DanhSachSanPham')));
// const DanhSachThuongHieu = Loadable(lazy(() => import('../pages/dashboard/san-pham/DanhSachThuongHieu')));
// const ThemSuaThuongHieu = Loadable(lazy(() => import('../pages/dashboard/san-pham/ThemSuaThuongHieu')));
// const DanhSachMauSac = Loadable(lazy(() => import('../pages/dashboard/san-pham/DanhSachMauSac')));
// const ThemSuaMauSac = Loadable(lazy(() => import('../pages/dashboard/san-pham/ThemSuaMauSac')));
// const ThemSuaNhanVien = Loadable(lazy(() => import('../pages/dashboard/nhan-vien/ThemSuaNhanVien')));
// const DanhSachNhanVien = Loadable(lazy(() => import('../pages/dashboard/nhan-vien/DachSachNhanVien')));
// const ThemSuaKhachHang = Loadable(lazy(() => import('../pages/dashboard/khach-hang/ThemSuaKhachHang')));
// const DanhSachKhachHang = Loadable(lazy(() => import('../pages/dashboard/khach-hang/DanhSachKhachHang')));
// const ThongKe = Loadable(lazy(() => import('../pages/dashboard/thong-ke/ThongKe')));


const ProjectList = Loadable(lazy(() => import('../pages/dashboard/project/list/ProjectList')));
