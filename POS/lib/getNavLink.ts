import { ADMIN, MANAGER, WAITER, CHEF } from "@/constants/role.constants"
import {
    Bot,
    SquareTerminal,
    Users,
    Store
} from "lucide-react"

interface NavItem {
    title: string
    icon?: React.ComponentType
    url: string
    items?: NavItem[]
    isActive?: boolean
}

type NavLinks = {
    [key: string]: NavItem[];
}

export const navbarLinks: NavLinks = {
    [ADMIN]: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: 'Customer',
            url: '/users',
            icon: Users,
            items: [
                {
                    title: 'Customers',
                    url: '/users',
                },
            ],
        },
        {
            title: 'Staffs',
            url: '/staffs',
            icon: Users,
            items: [
                {
                    title: 'Staffs List',
                    url: '/staffs',
                },
            ],
        },
        // {
        //     title: 'Outlet',
        //     url: '/outlets',
        //     icon: Users,
        //     items: [
        //         {
        //             title: 'Outlets List',
        //             url: '/outlets',
        //         },
        //     ],
        // },
        {
            title: 'Product',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Product List',
                    url: '/product',
                },
                {
                    title: 'Category List',
                    url: '/product/category',
                },
            ],
        },
        {
            title: 'Order & POS',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Order list',
                    url: '/orders',
                },
                {
                    title: 'Payment list',
                    url: '/orders/payments',
                },
                {
                    title: 'POS',
                    url: '/orders/pos',
                },
            ],
        },
        {
            title: 'Floor & Table',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Table View',
                    url: '/floor/tables-view',
                },
                {
                    title: 'Floor',
                    url: '/floor',
                },
                {
                    title: 'Table',
                    url: '/floor/table',
                },

                {
                    title: 'Floor Add',
                    url: '/floor/add',
                },
                {
                    title: 'Table Add',
                    url: '/floor/table/add',
                },
            ],
        },
        {
            title: 'Inventory',
            url: '#',
            icon: Store,
            items: [
                {
                    title: 'Units',
                    url: '/units',
                },
                {
                    title: 'Suppliers',
                    url: '/suppliers',
                },
                {
                    title: 'Supplier Invoice',
                    url: '/supplier-invoices',
                },
                {
                    title: 'Supplier Payment',
                    url: '/supplier-payments',
                },
                {
                    title: 'Item Categories',
                    url: '/item-categories',
                },
                {
                    title: 'Items',
                    url: '/items',
                },
                {
                    title: 'Waste Categories',
                    url: '/wastes/categories',
                },
                {
                    title: 'Waste',
                    url: '/wastes',
                },
            ],
        },

    ],
    [MANAGER]: [
        {
            title: 'Dashboard',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: 'Product',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Product List',
                    url: '#',
                },
                {
                    title: 'Product Dashboard',
                    url: '#',
                },
                {
                    title: 'Add Product',
                    url: '#',
                },
            ],
        },
        {
            title: 'Manage Order',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Order list',
                    url: '#',
                },
                {
                    title: 'Counter List',
                    url: '#',
                },
                {
                    title: 'Complete order',
                    url: '#',
                },
            ],
        },
    ],
    [CHEF]: [
        {
            title: 'Dashboard',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
        },
    ],
    [WAITER]: [
        {
            title: 'Order & POS',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Order list',
                    url: '/orders',
                },
                {
                    title: 'Payment list',
                    url: '/orders/payments',
                },
                {
                    title: 'POS',
                    url: '/orders/pos',
                },
            ],
        },
    ],
};

const getNavLink = (): NavItem[] => {
    try {
        return navbarLinks['ADMIN'] || [];
    } catch {
        return [];
    }
}

export default getNavLink;