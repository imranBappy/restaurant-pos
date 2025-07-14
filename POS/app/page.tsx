'use client';

import Features from '@/components/Home/Features';
import Footer from '@/components/Home/Footer';
import Header from '@/components/Home/Header';
import Hero from '@/components/Home/Hero';
import HowItWorks from '@/components/Home/HowItWorks';
import PricingTeaser from '@/components/Home/PricingTeaser';
import Testimonials from '@/components/Home/Testimonials';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <PricingTeaser />
            </motion.main>
            <Footer />
        </div>
    );
}
