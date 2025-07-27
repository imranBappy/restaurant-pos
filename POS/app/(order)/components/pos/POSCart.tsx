'use client';
import React, { memo, useState } from 'react';

import { findVat, randomId, toFixed } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import CardItem from './card-item';
import { toast } from '@/hooks/use-toast';
import Button from '@/components/button';
import { useSearchParams } from 'next/navigation';
import DiscountModel from './DiscountModel';

import useStore from '@/stores';
import { CARD_TYPE } from '@/stores/slices/cartSlice';
import CustomerSearch from '@/components/CustomerSearch';
import { USER_TYPE } from '@/graphql/accounts';
import PaymentModal from '@/app/(payment)/components/order-payment/payment-modal';
import { calculateDiscount } from './pos';
import { useMutation, useQuery } from '@apollo/client';
import { FLOOR_TABLES_QUERY, FLOOR_TABLES_TYPE, ORDER_MUTATION_V2, ORDERS_QUERY } from '@/graphql/product';
import Sheet from '@/components/Sheet/Sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ORDER_CHANNEL_TYPE, ORDER_CHANNELS_QUERY } from '@/graphql/order';
import { OPTION_TYPE } from '@/components/input';
import { Users, LayoutList, } from 'lucide-react'; // Import icons for better visual cues
import AddCustomer from './add-customer';

const calculatePrice = (cart: CARD_TYPE[]) => {
    const result = cart?.reduce((total, item) => {
        if (item.discount > 0) {
            return (
                total + calculateDiscount(item.price, item.vat, item.totalDiscount) * item.quantity
            );
        }
        return total + item.price * item.quantity;
    }, 0);
    return result;
};
const calculateVat = (cart: CARD_TYPE[]) => {
    const result = cart?.reduce((total, item) => {
        if (item.discount > 0) {
            const discountedPrice = calculateDiscount(
                item.price,
                item.vat,
                item.totalDiscount
            );
            return total + findVat(discountedPrice, item.vat) * item.quantity;
        }
        return total + findVat(item.price, item.vat) * item.quantity;
    }, 0);
    return result;
};

const POSCart = () => {
    const decrementItemQuantity = useStore(
        (store) => store.decrementItemQuantity
    );
    const incrementItemQuantity = useStore(
        (store) => store.incrementItemQuantity
    );

    const [orderId, setOrderId] = useState<string | undefined>();
    const tableState = useStore((store) => store.table);
    const cart = useStore((store) => store.cart);
    const subTotal = calculatePrice(cart) || 0;
    const vatAmount = calculateVat(cart) || 0;
    const finalAmount = (subTotal + vatAmount).toFixed(2);

    const outlets = useStore((store) => store.outlets);
    const activeOutlet = outlets[0];
    const clearCart = useStore((store) => store.clearCart);
    const searchParams = useSearchParams();
    const [selectedUser, setSelectedUser] = useState<USER_TYPE>();
    const clearTable = useStore((store) => store.clearTable);
    const [orderChannel, setOrderChannel] = useState("1"); // Default to '1' or a sensible default ID

    const { loading: orderChannelsLoading, data: orderChannelsRes } = useQuery(ORDER_CHANNELS_QUERY, {
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    const orderChannels: OPTION_TYPE[] = orderChannelsRes?.orderChannels?.edges?.map(({ node }: { node: ORDER_CHANNEL_TYPE }) => ({
        value: node.id,
        label: node.name,
    })) || [];

    const [createOrder, { loading: createOrderLoading }] = useMutation(
        ORDER_MUTATION_V2,
        {
            onCompleted: ({ orderCuv2 }) => {
                setOrderId(orderCuv2?.order?.id);
                toast({
                    title: "Order Placed",
                    description: `Order ${orderCuv2?.order?.orderId} placed successfully!`,
                });

                clearCart();
                setSelectedUser(undefined);
                clearTable();
                // router.push('/orders/pos');
            },
            refetchQueries: [
                {
                    query: ORDERS_QUERY,
                    variables: {
                        first: 10,
                        offset: 0,
                    },
                },
                {
                    query: FLOOR_TABLES_QUERY,
                    variables: {
                        first: 10,
                        offset: 0,
                    },
                },
            ],
            awaitRefetchQueries: true,
            onError: (error) => {
                toast({
                    title: "Error Placing Order",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    );
    const isDisablePlaceOrder = createOrderLoading;

    const handlePlaceOrderV2 = async () => {
        try {
            setOrderId(undefined);
            if (!cart.length) {
                toast({
                    title: 'Error',
                    description: 'Cart is empty!',
                    variant: 'destructive',
                });
                return;
            }

            const amount = calculatePrice(cart);
            if (amount < 0) {
                toast({
                    title: 'Error',
                    description: "Total amount cannot be negative!",
                    variant: 'destructive',
                });
                return;
            }

            const tableBookings = tableState.map((item: FLOOR_TABLES_TYPE) => [
                item.id,
                60,
            ]);

            const variables = {
                input: {
                    user: selectedUser?.id || null,
                    status: 'PENDING',
                    outlet: activeOutlet?.id,
                    orderId: searchParams.get('orderId') || randomId(),
                    isCart: true,
                    tableBookings: tableBookings.length ? JSON.stringify(tableBookings) : null,
                    items: cart.map((item) => ({
                        product: item.id,
                        quantity: item.quantity,
                        discount: `${toFixed(item.discount)}`,
                        ...(item.note ? { note: item.note } : {})
                    })),
                    orderChannel: orderChannel,
                },
            };

            console.log(variables); // Keep for debugging as in original code

            await createOrder({
                variables: variables,
            });


        } catch (error) {
            console.error("Error in handlePlaceOrderV2:", error);
        }
    };

    const handleSelectUser = (newSelectedUser: USER_TYPE) => {
        setSelectedUser(newSelectedUser);
    };

    if (orderChannelsLoading) {
        return (
            <Card className="w-[350px] col-span-1 h-[calc(100vh-105px)] flex flex-col items-center justify-center">
                Loading Order Channels...
            </Card>
        );
    }

    return (
        <Card
            className="w-[350px] min-h-[calc(100vh-105px)] flex flex-col shadow-lg rounded-xl overflow-hidden"
        >
            {/* Header: Customer and Order Type Selection */}
            <div className="p-4 bg-secondary text-secondary-foreground border-b border-border/50">
                <h3 className="text-xl font-bold mb-3">Current Order</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <CustomerSearch onSelect={handleSelectUser} />
                        {/* <Button size='icon' className='bg-black text-white hover:bg-slate-800' >
                            <Plus />
                        </Button> */}
                        <AddCustomer handleSelectUser={handleSelectUser} />
                    </div>
                    {/* {selectedUser && (
                        <p className="text-sm text-muted-foreground ml-7 -mt-2">
                            {selectedUser.name}({selectedUser.phone})
                        </p>
                    )} */}
                    <div className="flex items-center gap-2">
                        <LayoutList className="h-5 w-5 text-muted-foreground" />
                        <Select value={orderChannel} onValueChange={setOrderChannel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {orderChannels.map(item => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Assuming Sheet is for Table Selection and handles its own UI */}
                        <Sheet />
                    </div>
                </div>
            </div>

            {/* Cart Items Section */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                <h4 className="text-md font-semibold mb-3 text-foreground/80">Order Items</h4>
                <div className="space-y-3">
                    {cart?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-10">Cart is empty. Add some items!</p>
                    ) : (
                        cart.map((item) => (
                            <CardItem
                                onMinusItem={() => decrementItemQuantity(item.id)}
                                discount={item.discount}
                                key={item.id}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                id={item.id}
                                onPlusItem={() => incrementItemQuantity(item.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Footer: Totals and Action Buttons */}
            <div className="p-4 border-t border-border/50 bg-background/95">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${toFixed(subTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-muted-foreground">VAT</span>
                        <span className="font-medium">${toFixed(vatAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-primary">
                        <span>Total</span>
                        <span>${finalAmount}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <DiscountModel />
                    <div className="grid grid-cols-2 gap-3">
                        <PaymentModal
                            variant="default"
                            openBtnName="Payment"
                            orderId={orderId}
                            disabled={isDisablePlaceOrder || cart.length === 0}
                            onPaymentRequest={handlePlaceOrderV2}

                        />
                        <Button
                            disabled={cart?.length === 0 || isDisablePlaceOrder}
                            isLoading={createOrderLoading}
                            onClick={handlePlaceOrderV2}
                            className="w-full text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default memo(POSCart);