import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Droplets, Sun, Wind } from 'lucide-react';

const yieldData = [
  { name: 'Jan', yield: 400 },
  { name: 'Feb', yield: 300 },
  { name: 'Mar', yield: 550 },
  { name: 'Apr', yield: 450 },
  { name: 'May', yield: 700 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Farmer 👋</h1>
          <p className="text-slate-500">Here's your smart advisory for today.</p>
        </div>
      </header>

      {/* Top Banner - Weather & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <Sun className="absolute -right-4 -top-4 w-32 h-32 opacity-20" />
          <h3 className="text-lg font-medium opacity-90">Nashik, Maharashtra</h3>
          <div className="text-5xl font-bold mt-2">32°C</div>
          <p className="mt-1 text-blue-100">Partly Cloudy</p>
          <div className="flex gap-4 mt-6 text-sm">
            <span className="flex items-center gap-1"><Droplets size={16} /> 55% Hum</span>
            <span className="flex items-center gap-1"><Wind size={16} /> 12 km/h</span>
          </div>
        </div>

        {/* Smart AI Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">🤖 AI Advisory Actions</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <AlertTriangle className="flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Rain Expected Tomorrow</p>
                <p className="text-xs mt-1">Delay pesticide application to prevent wash-off. Irrigate less today.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
              <Droplets className="flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Optimal Soil Moisture</p>
                <p className="text-xs mt-1">Soil moisture is at 62%. No immediate irrigation required for wheat crop.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-80">
        <h3 className="text-lg font-bold text-slate-800 mb-6">📈 Yield Estimation Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yieldData}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
            />
            <Line type="monotone" dataKey="yield" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}