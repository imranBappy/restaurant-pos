'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        restaurantName: '',
        agree: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, agree: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agree) {
            alert('Please agree to the terms.');
            return;
        }
        console.log('Sign Up Data:', formData);
        // Add API call here to register the user
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
                            Join RestroPOS
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Create your account and start building your POS
                            today.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-gray-700 dark:text-gray-300"
                                >
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                    required
                                />
                            </div>
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
                            <div>
                                <Label
                                    htmlFor="restaurantName"
                                    className="text-gray-700 dark:text-gray-300"
                                >
                                    Restaurant Name
                                </Label>
                                <Input
                                    id="restaurantName"
                                    name="restaurantName"
                                    type="text"
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                    placeholder="John’s Café"
                                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="agree"
                                    checked={formData.agree}
                                    onCheckedChange={handleCheckbox}
                                    className="border-gray-300 dark:border-gray-600 text-red-500 dark:text-red-400"
                                />
                                <Label
                                    htmlFor="agree"
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    I agree to the{' '}
                                    <Link
                                        href="/terms"
                                        className="text-red-500 dark:text-red-400 hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        href="/privacy"
                                        className="text-red-500 dark:text-red-400 hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-red hover:bg-red-600 text-white text-lg py-6 shadow-md"
                                disabled={!formData.agree}
                            >
                                Sign Up
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                href="/sign-in"
                                className="text-red-500 dark:text-red-400 hover:underline"
                            >
                                Log In
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
