import Dashboard from './dashboard_page';
import Profile from './profile-page';
import Markdown from './Markdown';
import GodsPage from './gods_page';
import Full from './full-page';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Full },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/markdown', name: 'Markdown', component: Markdown },
  { path: '/gods', name: 'Gods', component: GodsPage },
];

export default routes;