import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: ChatBubbleLeftRightIcon },
  { name: 'Filters', href: '/admin/filters', icon: FunnelIcon },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[40] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-[45] w-64 transform bg-[#1a1a1a] shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mt-2 text-base rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 bg-[#1a1a1a]">
          <div className="flex items-center">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full w-10">
                <span className="text-sm font-bold">AD</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 