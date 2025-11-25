import { motion } from 'framer-motion'
import Header from '../components/Header'
import EventDetails from '../components/EventDetails'
import PhotoGallery from '../components/PhotoGallery'
import Comments from '../components/Comments'
import RSVP from '../components/RSVP'
import LinkGenerator from '../components/LinkGenerator'
import InvitationManager from '../components/InvitationManager'

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-cyan-100 to-teal-200 min-h-screen relative overflow-hidden">
      {/* Clouds at top */}
      <div className="absolute top-0 left-0 w-full h-48 pointer-events-none z-0">
        {/* Large cloud - far left */}
        <motion.div
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-4 opacity-70"
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
            <ellipse cx="30" cy="40" rx="25" ry="15" fill="white" />
            <ellipse cx="50" cy="30" rx="30" ry="18" fill="white" />
            <ellipse cx="75" cy="35" rx="25" ry="15" fill="white" />
            <ellipse cx="95" cy="45" rx="20" ry="12" fill="white" />
          </svg>
        </motion.div>

        {/* Medium cloud - far right */}
        <motion.div
          animate={{ x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 right-4 opacity-60"
        >
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            <ellipse cx="20" cy="25" rx="18" ry="12" fill="white" />
            <ellipse cx="40" cy="20" rx="20" ry="15" fill="white" />
            <ellipse cx="60" cy="25" rx="15" ry="10" fill="white" />
          </svg>
        </motion.div>

        {/* Small cloud - left side */}
        <motion.div
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 left-1/4 opacity-65"
        >
          <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
            <ellipse cx="15" cy="20" rx="12" ry="8" fill="white" />
            <ellipse cx="30" cy="15" rx="15" ry="10" fill="white" />
            <ellipse cx="45" cy="20" rx="10" ry="6" fill="white" />
          </svg>
        </motion.div>

        {/* Another small cloud - right side */}
        <motion.div
          animate={{ x: [0, -35, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 opacity-55"
        >
          <svg width="50" height="25" viewBox="0 0 50 25" fill="none">
            <ellipse cx="12" cy="18" rx="10" ry="6" fill="white" />
            <ellipse cx="25" cy="12" rx="12" ry="8" fill="white" />
            <ellipse cx="38" cy="18" rx="8" ry="5" fill="white" />
          </svg>
        </motion.div>

        {/* Additional clouds for better distribution */}
        {/* Top left corner */}
        <motion.div
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 left-20 opacity-50"
        >
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <ellipse cx="10" cy="15" rx="8" ry="5" fill="white" />
            <ellipse cx="20" cy="10" rx="10" ry="6" fill="white" />
            <ellipse cx="30" cy="15" rx="6" ry="4" fill="white" />
          </svg>
        </motion.div>

        {/* Top right corner */}
        <motion.div
          animate={{ x: [0, -25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 right-20 opacity-45"
        >
          <svg width="45" height="22" viewBox="0 0 45 22" fill="none">
            <ellipse cx="12" cy="16" rx="9" ry="6" fill="white" />
            <ellipse cx="25" cy="11" rx="11" ry="7" fill="white" />
            <ellipse cx="35" cy="16" rx="7" ry="5" fill="white" />
          </svg>
        </motion.div>
      </div>
      {/* Animated Hills Background - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 w-full h-3/4 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Back hill - Distant and soft */}
        <motion.div
          animate={{ x: [-35, 35, -35] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 h-full"
          style={{ left: '-30%', width: '160%' }}
        >
          <svg viewBox="0 0 1600 384" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,384 C120,340 180,240 280,260 C380,280 420,220 520,240 C620,260 680,200 780,220 C880,240 920,180 1020,200 C1120,220 1180,160 1280,180 C1380,200 1440,240 1600,220 L1600,384 Z"
              fill="#a5f3fc"
              opacity="0.6"
            />
          </svg>
        </motion.div>

        {/* Middle hill - Rolling landscape */}
        <motion.div
          animate={{ x: [25, -25, 25] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 h-4/5"
          style={{ left: '-20%', width: '140%' }}
        >
          <svg viewBox="0 0 1400 288" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,288 C80,240 140,180 220,200 C300,220 360,160 440,180 C520,200 580,140 660,160 C740,180 800,120 880,140 C960,160 1020,200 1100,180 C1180,160 1240,220 1400,200 L1400,288 Z"
              fill="#67e8f9"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        {/* Front hill - Close and defined */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 h-3/5"
          style={{ left: '-15%', width: '130%' }}
        >
          <svg viewBox="0 0 1300 240" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,240 C60,200 100,140 160,160 C220,180 280,120 340,140 C400,160 460,100 520,120 C580,140 640,180 700,160 C760,140 820,100 880,120 C940,140 1000,180 1060,160 C1120,140 1180,200 1300,180 L1300,240 Z"
              fill="#22d3ee"
              opacity="0.95"
            />
          </svg>
        </motion.div>

        {/* Foreground hill - Very close */}
        <motion.div
          animate={{ x: [-12, 12, -12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 h-2/5"
          style={{ left: '-10%', width: '120%' }}
        >
          <svg viewBox="0 0 1200 160" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,160 C40,140 80,110 120,120 C160,130 200,100 240,110 C280,120 320,140 360,130 C400,120 440,100 480,110 C520,120 560,140 600,130 C640,120 680,100 720,110 C760,120 800,140 840,130 C880,120 920,140 960,130 C1000,120 1040,140 1080,130 C1120,120 1160,140 1200,130 L1200,160 Z"
              fill="#0891b2"
              opacity="0.7"
            />
          </svg>
        </motion.div>
      </div>

      {/* Main content container */}
      <div className="min-h-screen relative" style={{ zIndex: 2 }}>
      <div className="container mx-auto px-4 py-8 pb-32 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <Header />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <EventDetails />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <RSVP />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <PhotoGallery />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Comments />
          </motion.div>
        </motion.div>
      </div>
      </div>

      {/* Componente oculto para generar enlaces personalizados */}
      <LinkGenerator />

      {/* Panel de administración de invitaciones (modal con Ctrl+Shift+I) */}
      <InvitationManager />
    </div>
  )
}