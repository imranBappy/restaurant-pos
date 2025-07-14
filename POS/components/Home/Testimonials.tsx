'use client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const testimonials = [
    {
        name: 'John D.',
        role: 'Café Owner',
        quote: 'Setup was a breeze – my team loves it!',
        avatar: '👨‍🍳',
        color: 'from-red-500 to-orange-500',
    },
    {
        name: 'Sarah K.',
        role: 'Restaurateur',
        quote: 'Scales perfectly with my growing chain.',
        avatar: '👩‍💼',
        color: 'from-orange-500 to-yellow-500',
    },
    {
        name: 'Mike L.',
        role: 'Food Truck Operator',
        quote: 'Affordable and packed with features!',
        avatar: '🚚',
        color: 'from-yellow-500 to-red-500',
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold mb-12 text-gray-900 dark:text-gray-100"
                >
                    What Our Users Say
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Card
                                className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-none shadow-xl hover:shadow-2xl transition-shadow`}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-4">
                                        <span
                                            className={`text-4xl p-2 rounded-full bg-gradient-to-r ${testimonial.color} text-white`}
                                        >
                                            {testimonial.avatar}
                                        </span>
                                        <div className="text-left">
                                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                                        {`"${testimonial.quote}"`}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
