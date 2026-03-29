'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, Calendar, FileText, Shield, Star, ArrowRight, Phone, Video, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const router = useRouter();

  const features = [
    { icon: Video, title: 'Video Consultations', desc: 'Connect with doctors face-to-face from anywhere', color: 'bg-teal-50 text-teal-600' },
    { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments in seconds, anytime', color: 'bg-blue-50 text-blue-600' },
    { icon: FileText, title: 'Digital Prescriptions', desc: 'Receive and store prescriptions digitally', color: 'bg-amber-50 text-amber-600' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your health data is always protected', color: 'bg-purple-50 text-purple-600' },
    { icon: Clock, title: '24/7 Availability', desc: 'Access healthcare whenever you need it', color: 'bg-rose-50 text-rose-600' },
    { icon: Heart, title: 'AI Health Assistant', desc: 'Smart symptom checker and health guidance', color: 'bg-green-50 text-green-600' },
  ];

  const stats = [
    { number: '500+', label: 'Verified Doctors' },
    { number: '50K+', label: 'Happy Patients' },
    { number: '4.9', label: 'Average Rating' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">MediConnect</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button variant="ghost" onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/auth/register')}
              className="gradient-primary text-white border-0"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 px-4 py-1.5 text-sm">
              🏥 Trusted Healthcare Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Health,{' '}
              <span className="text-gradient">Our Priority</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified doctors, book appointments instantly, and manage your health journey — all in one beautiful platform.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                size="lg"
                onClick={() => router.push('/auth/register')}
                className="gradient-primary text-white border-0 px-8 py-6 text-lg rounded-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/auth/login')}
                className="px-8 py-6 text-lg rounded-xl border-gray-200"
              >
                <Phone className="mr-2 w-5 h-5" />
                Sign In with OTP
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 gradient-soft">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A complete healthcare experience designed with patients and doctors in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 card-hover border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-12 text-white"
          >
            <Star className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of patients who trust MediConnect for their healthcare needs.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl font-semibold"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gradient">MediConnect</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 MediConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}