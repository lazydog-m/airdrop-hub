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
      path: '/dashboard',
      element: (
        <DashboardLayout />
      ),
      children: [
        {
          path: 'app',
          element: <GeneralApp />
        },

        {
          path: 'project',
          children: [
            { path: 'list', element: <ProjectList /> },
            // { path: 'create', element: <ProjectList /> },
            // { path: ':id/edit', element: <ProjectList /> },
          ],
        },

        {
          path: 'profile',
          children: [
            { path: 'list', element: <ProfileList /> },
            // { path: 'create', element: <ProfileList /> },
            // { path: ':id/edit', element: <ProfileList /> },
          ],
        },

        {
          path: 'wallet',
          children: [
            { path: 'list', element: <WalletList /> },
            // { path: 'create', element: <WalletList /> },
            // { path: ':id/edit', element: <WalletList /> },
          ],
        },
        {
          path: 'task',
          children: [
            { path: 'list', element: <TaskList /> },
            { path: 'create', element: <TaskNewEdit /> },
            { path: ':id/edit', element: <TaskNewEdit /> },
          ],
        },
        // { path: 'statistics', element: <ThongKe /> },
      ],
    },

    // { path: '/', element: <Navigate to="/dashboard/employee/list" replace /> },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const ProjectList = Loadable(lazy(() => import('../pages/dashboard/project/list/ProjectList')));
const ProfileList = Loadable(lazy(() => import('../pages/dashboard/profile/list/ProfileList')));
const WalletList = Loadable(lazy(() => import('../pages/dashboard/wallet/list/WalletList')));
const TaskList = Loadable(lazy(() => import('../pages/dashboard/task/list/TaskList')));
const TaskNewEdit = Loadable(lazy(() => import('../pages/dashboard/task/create/TaskNewEdit')));
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/statistics/GeneralApp')));
