'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        console.log('Password reset requested for:', email);
        // Add API call here to send reset link
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
                            Forgot Password
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Enter your email to receive a password reset link.
                        </p>
                    </CardHeader>
                    <CardContent>
                        {!submitted ? (
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
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-red-500 dark:focus:ring-red-400"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-red hover:bg-red-600 text-white text-lg py-6 shadow-md"
                                >
                                    Send Reset Link
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-gray-700 dark:text-gray-300 text-lg"
                                >
                                    A password reset link has been sent to{' '}
                                    <span className="font-semibold">
                                        {email}
                                    </span>
                                    . Please check your inbox (and spam folder).
                                </motion.p>
                                <Button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 bg-gradient-red hover:bg-red-600 text-white text-lg py-3 shadow-md"
                                >
                                    Try Another Email
                                </Button>
                            </div>
                        )}
                        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                            Remember your password?{' '}
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
