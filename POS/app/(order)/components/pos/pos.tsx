'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
    PRODUCT_TYPE,
    ORDER_QUERY,
    FLOOR_TABLE_TYPE,
} from '@/graphql/product';
import { cn, findVat, toFixed } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FilterState } from '@/app/product/components';
import { SidebarContext } from '@/components/ui/sidebar';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { Search } from 'lucide-react';

import { useSearchParams } from 'next/navigation';
import POSCategories from './POS-categories';
import POSProducts from './POS-products';
import useStore from '@/stores';
import { CARD_TYPE } from '@/stores/slices/cartSlice';

import POSCart from './POSCart';
// import KOTTicket from './print-kot';
// import CustomerInvoice from './CustomerInvoice';
export const calculateDiscount = (
    price: number,
    vat: number,
    discount: number
) => {
    const total = findVat(price, vat) + price;
    const discountPrice = ((total - discount) / (100 + vat)) * 100;
    return discountPrice;
};



const Pos = () => {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: null,
        subcategory: null,
        kitchen: null,
        tag: '',
        price: 0,
        priceLte: null,
        orderByPrice: '',
        isActive: 'ALL',
        orderBy: '',
    });
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const debouncedSearch = useDebouncedValue(filters.search, 500);
    const addTables = useStore((store) => store.addTables);
    const cart = useStore((store) => store.cart);
    const addCart = useStore((store) => store.addCart);
    const addCarts = useStore((store) => store.addCarts);
    const incrementItemQuantity = useStore(
        (store) => store.incrementItemQuantity
    );
    const sidebarContext = useContext(SidebarContext);




    useQuery(ORDER_QUERY, {
        variables: {
            id: id,
        },
        skip: !id,
        onCompleted: ({ order }) => {
            const items = order?.items?.edges?.map(
                ({ node }: { node: CARD_TYPE }) => ({
                    id: node?.product?.id,
                    name: node?.product?.name,
                    vat: node?.product?.vat,
                    discount: parseFloat(`${node.discount}`),
                    price: parseFloat(`${node.price}`),
                    quantity: node.quantity,
                    itemId: node.id,
                    totalDiscount: node.discount
                        ? parseFloat(`${toFixed(node.discount)}`) +
                        findVat(
                            parseFloat(`${node.discount}`),
                            node?.product?.vat || 1
                        )
                        : 0,
                })
            );

            const bookedTables = order?.tableBookings?.edges?.map(
                ({ node }: { node: FLOOR_TABLE_TYPE }) => ({
                    id: node.floorTable?.id,
                    name: node.floorTable?.name,
                    createdAt: node.floorTable?.createdAt,
                    isActive: node.floorTable?.isActive,
                    isBooked: node.floorTable?.isBooked,
                })
            );
            if (bookedTables?.length) {
                addTables(bookedTables)
            }


            addCarts(items);
        },
    });

    const handleFilterChange =
        (key: keyof FilterState) => (value: FilterState[typeof key]) => {
            setFilters((prev) => ({
                ...prev,
                [key]: value,
            }));
        };
    const handleAddToCart = (product: PRODUCT_TYPE) => {
        if (!product.id) return;
        const existingItem = cart?.find((item) => item.id === product.id);
        if (existingItem) {
            incrementItemQuantity(existingItem.id);
            return;
        }
        const newCartItem = {
            id: product.id as string,
            name: product.name,
            price: product.price,
            quantity: 1,
            vat: product.vat,
            discount: 0,
            totalDiscount: 0,
        };
        addCart(newCartItem);
    };




    useEffect(() => {
        handleFilterChange('search')(debouncedSearch);
    }, [debouncedSearch]);
    return (
        <div className="w-full h-[calc(100vh-100px)] flex gap-4">
            <div
                className={cn(
                    'h-full',
                    sidebarContext?.open
                        ? 'w-[calc(100vw-654px)]'
                        : 'w-[calc(100vw-447px)]'
                )}
            >
                <Card className=" p-3">
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={filters.search}
                            onChange={(e) =>
                                setFilters((preState) => ({
                                    ...preState,
                                    search: e.target.value,
                                }))
                            }
                            placeholder="Search products..."
                            className="pl-8"
                        />
                    </div>
                    {/* Categories Section */}
                    <POSCategories
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                    />
                    <POSProducts
                        filters={filters}
                        handleAddToCart={handleAddToCart}
                        cart={cart}
                    />
                </Card>
            </div>
            {/* Updated Cart Section */}
            <POSCart />

        </div>
    );
};

export default Pos;
