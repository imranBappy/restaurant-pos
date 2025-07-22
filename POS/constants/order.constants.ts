
export const ORDER_STATUSES_LIST = [
    'PENDING', 'COMPLETED', 'DELIVERED', 'CANCELLED', 'DUE'
];
export const ORDER_STATUSES = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    DUE: "DUE",
}


export const ORDER_TYPE_LIST = ['DELIVERY', 'PICKUP', 'DINE_IN']
export const ORDER_TYPES = {
    DELIVERY: 'DELIVERY',
    PICKUP: 'PICKUP',
    DINE_IN: 'DINE_IN'
}

export const ORDER_CHANNEL_TYPES = [
    {
        label: 'Delivery Platform',
        value: "DELIVERY_PLATFORM"
    },
    {
        label: "Dine In",
        value: "DINE_IN"
    },
    {
        label: "Pickup",
        value: "PICKUP"
    },
    {
        label: "Website Orders",
        value: "WEBSITE"
    },
    {
        label: "Phone Orders",
        value: "PHONE"
    },
    {
        label: "Social Media",
        value: "SOCIAL_MEDIA"
    },
    {
        label: "Other",
        value: "OTHER"
    },
]