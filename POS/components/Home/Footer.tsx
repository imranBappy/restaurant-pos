'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
    return (
        <motion.header
            className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg z-10"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-red"
                >
                    RestroPOS
                </Link>
                <nav className="space-x-8">
                    <Link
                        href="/"
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/features"
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                        >
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-gradient-red hover:bg-red-600 text-white shadow-md">
                            Sign Up
                        </Button>
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
}
