import { Link } from 'react-router-dom';
import { Home, CloudSun, Leaf, LineChart, BookOpen, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-xl hidden md:flex flex-col">
      <div className="p-6 bg-primary text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf /> KisanMitra
        </h1>
        <p className="text-sm opacity-80 mt-1">Smart Advisory System</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/" icon={<Home />} label="Dashboard" />
        <NavItem to="/weather" icon={<CloudSun />} label="Weather & Soil" />
        <NavItem to="/disease" icon={<Leaf />} label="Disease AI" />
        <NavItem to="/market" icon={<LineChart />} label="Market Prices" />
        <NavItem to="/schemes" icon={<BookOpen />} label="Govt Schemes" />
        <NavItem to="/settings" icon={<Settings />} label="Settings" />
      </nav>
    </div>
  );
}

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-green-50 hover:text-primary rounded-lg transition-colors font-medium">
    {icon} {label}
  </Link>
);