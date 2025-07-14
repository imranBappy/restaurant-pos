'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="bg-[url('/images/restaurant-bg.jpg')] bg-cover bg-center py-24 text-center text-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-6"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-red">
                    Your Restaurant’s Perfect POS
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                    Build a custom, multi-tenant POS system in minutes –
                    tailored to your unique needs.
                </p>
                <div className="space-x-6">
                    <Button
                        size="lg"
                        className="bg-gradient-red hover:bg-red-600 text-white shadow-lg"
                    >
                        Get Started Free
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-white border-white hover:bg-white/20"
                    >
                        Watch Demo
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
