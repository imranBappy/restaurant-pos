'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
    return (
        <motion.header
            className="sticky top-0 bg-white shadow-md z-10"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-red-600">
                    RestroPOS
                </Link>
                <nav className="space-x-6">
                    <Link href="/" className="text-gray-600 hover:text-red-600">
                        Home
                    </Link>
                    <Link
                        href="/features"
                        className="text-gray-600 hover:text-red-600"
                    >
                        Features
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-gray-600 hover:text-red-600"
                    >
                        Pricing
                    </Link>
                    <Link href="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-red-600 text-white hover:bg-red-700">
                            Sign Up
                        </Button>
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
}
