'use client';
import { motion } from 'framer-motion';

const features = [
    {
        title: 'Customizable POS',
        desc: 'Design a POS that fits your workflow.',
        icon: '⚙️',
    },
    {
        title: 'Multi-Tenant Access',
        desc: 'Manage multiple locations easily.',
        icon: '🏢',
    },
    {
        title: 'Real-Time Insights',
        desc: 'Track sales and data instantly.',
        icon: '📊',
    },
    {
        title: 'Affordable & Scalable',
        desc: 'Pricing for any restaurant size.',
        icon: '💰',
    },
];

export default function Features() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8 text-black">
                    Why Choose RestroPOS?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-4xl mb-4 block">
                                {feature.icon}
                            </span>
                            <h3 className="text-xl font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
