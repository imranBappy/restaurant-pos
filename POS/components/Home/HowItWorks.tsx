'use client';
import { motion } from 'framer-motion';

const steps = [
    { step: 'Sign Up', desc: 'Create an account in seconds.', icon: '✍️' },
    { step: 'Customize', desc: 'Build your POS with ease.', icon: '🛠️' },
    { step: 'Start Selling', desc: 'Launch and manage orders.', icon: '🚀' },
];

export default function HowItWorks() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">
                    Set Up Your POS in 3 Easy Steps
                </h2>
                <div className="space-y-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center justify-center space-x-4"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <span className="text-3xl">{step.icon}</span>
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {step.step}
                                </h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
