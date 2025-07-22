'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, remember: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Log In Data:', formData);
        // Add API call here to authenticate the user
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-red">
                            Welcome Back
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Log in to manage your restaurant POS.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-gray-700 dark:text-gray-300"
                                >
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-gray-700 dark:text-gray-300"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={formData.remember}
                                        onCheckedChange={handleCheckbox}
                                        className="border-gray-300 dark:border-gray-600 text-red-500 dark:text-red-400"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Remember Me
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-red-500 dark:text-red-400 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-red hover:bg-red-600 text-white text-lg py-6 shadow-md"
                            >
                                Log In
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                            Don’t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-red-500 dark:text-red-400 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
