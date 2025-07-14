'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const pricingPlans = [
    {
        name: 'Starter',
        price: 'Free',
        desc: 'Perfect for small setups.',
        features: ['1 Location', 'Basic POS', 'Email Support'],
        gradient: 'from-red-500 to-orange-500',
    },
    {
        name: 'Pro',
        price: '$29/mo',
        desc: 'For growing businesses.',
        features: [
            'Up to 3 Locations',
            'Advanced Analytics',
            'Priority Support',
        ],
        gradient: 'from-orange-500 to-yellow-500',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'For large operations.',
        features: [
            'Unlimited Locations',
            'Custom Integrations',
            '24/7 Support',
        ],
        gradient: 'from-yellow-500 to-red-500',
    },
];

export default function PricingTeaser() {
    return (
        <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold mb-12 text-gray-900 dark:text-gray-100"
                >
                    Pricing That Fits Your Restaurant
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Card
                                className={`bg-white dark:bg-gray-900 border-none shadow-lg hover:shadow-2xl transition-all`}
                            >
                                <CardHeader
                                    className={`bg-gradient-to-r ${plan.gradient} text-white p-6 rounded-t-lg`}
                                >
                                    <CardTitle className="text-2xl font-bold">
                                        {plan.name}
                                    </CardTitle>
                                    <p className="text-3xl font-extrabold mt-2">
                                        {plan.price}
                                    </p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {plan.desc}
                                    </p>
                                    <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300">
                                        {plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center"
                                            >
                                                <span className="text-green-500 mr-2">
                                                    ✓
                                                </span>{' '}
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12"
                >
                    <Button className="bg-gradient-red hover:bg-red-600 text-white text-lg px-8 py-3 shadow-md">
                        Explore All Plans
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
