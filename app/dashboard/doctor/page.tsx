'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, Calendar, FileText, Users, LogOut, Bell, ChevronRight, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!savedUser || !token) { router.push('/auth/login'); return; }
    setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const cards = [
    { icon: Calendar, title: 'My Appointments', desc: 'View and manage appointments', color: 'bg-teal-50 text-teal-600', href: '/dashboard/doctor/appointments' },
    { icon: FileText, title: 'Write Prescription', desc: 'Create digital prescriptions', color: 'bg-blue-50 text-blue-600', href: '/dashboard/doctor/prescriptions' },
    { icon: Users, title: 'My Patients', desc: 'View your patient list', color: 'bg-amber-50 text-amber-600', href: '/dashboard/doctor/patients' },
    { icon: Star, title: 'My Profile', desc: 'Update your doctor profile', color: 'bg-purple-50 text-purple-600', href: '/dashboard/doctor/profile' },
  ];

  const stats = [
    { label: 'Total Patients', value: '0', color: 'text-teal-600' },
    { label: 'Appointments', value: '0', color: 'text-blue-600' },
    { label: 'Prescriptions', value: '0', color: 'text-amber-600' },
    { label: 'Rating', value: '5.0', color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">MediConnect</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Doctor</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, Dr. {user?.full_name?.split(' ')[0] || 'Doctor'} 👨‍⚕️
          </h1>
          <p className="text-gray-500 mt-1">Here's your practice overview for today</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="gradient-primary rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">Today's Schedule</p>
              <h2 className="text-2xl font-bold mb-2">No appointments today</h2>
              <p className="text-white/80 text-sm">Your schedule is clear — enjoy your day!</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => router.push(card.href)}
                className="bg-white rounded-2xl p-5 border border-gray-100 card-hover flex items-center gap-4 text-left w-full"
              >
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <p className="text-gray-500 text-sm">{card.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No appointments yet</p>
            <p className="text-gray-400 text-sm mt-1">Patients will appear here once they book with you</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}