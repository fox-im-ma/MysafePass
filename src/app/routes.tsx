import { createBrowserRouter } from 'react-router';
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GeneratePassword from './pages/GeneratePassword';
import EntryDetail from './pages/EntryDetail';
import Assistant from './pages/Assistant';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/auth',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/generate',
    Component: GeneratePassword,
  },
  {
    path: '/assistant',
    Component: Assistant,
  },
  {
    path: '/entry/:id',
    Component: EntryDetail,
  },
]);
