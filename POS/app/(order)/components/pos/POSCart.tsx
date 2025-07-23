'use client';
import React, { memo, useState } from 'react';

import { findVat, randomId, toFixed } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import CardItem from './card-item';
import { toast } from '@/hooks/use-toast';
import Button from '@/components/button';
import { useRouter, useSearchParams } from 'next/navigation';
import DiscountModel from './DiscountModel';

import useStore from '@/stores';
import { CARD_TYPE } from '@/stores/slices/cartSlice';
import CustomerSearch from '@/components/CustomerSearch';
import { USER_TYPE } from '@/graphql/accounts';
import PaymentModal from '@/app/(payment)/components/order-payment/payment-modal';
import { calculateDiscount } from './pos';
import { useMutation, useQuery } from '@apollo/client';
import { FLOOR_TABLES_TYPE, ORDER_MUTATION_V2, ORDERS_QUERY } from '@/graphql/product';
import Sheet from '@/components/Sheet/Sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ORDER_CHANNEL_TYPE, ORDER_CHANNELS_QUERY } from '@/graphql/order';
import { OPTION_TYPE } from '@/components/input';
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
    const finalAmount = (calculatePrice(cart) + calculateVat(cart)).toFixed(2);
    const subTotal = calculatePrice(cart)?.toFixed(2);
    const router = useRouter()
    const outlets = useStore((store) => store.outlets);
    const activeOutlet = outlets[0];
    const clearCart = useStore((store) => store.clearCart);
    const searchParams = useSearchParams();
    const [selectedUser, setSelectedUser] = useState<USER_TYPE>();
    const clearTable = useStore((store) => store.clearTable);
    const [orderChannel, setOrderChannel] = useState("1")

    const { loading, data: res, } = useQuery(ORDER_CHANNELS_QUERY, {
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }
    );
    const orderChannels: OPTION_TYPE[] = res?.orderChannels?.edges?.map(({ node }: { node: ORDER_CHANNEL_TYPE }) => ({
        value: node.id,
        label: node.name,
    })) || [];


    const [createOrder, { loading: createOrderLoading }] = useMutation(
        ORDER_MUTATION_V2,
        {
            onCompleted: ({ orderCuv2 }) => {
                setOrderId(orderCuv2?.order?.id);
                router.push('/orders/pos');
            },
            refetchQueries: [
                {
                    query: ORDERS_QUERY,
                    variables: {
                        first: 10,
                        offset: 0,
                    },
                },
            ],
            awaitRefetchQueries: true,
        }
    );
    const isDisableModel = createOrderLoading;

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


            const amount = calculatePrice(cart).toFixed(2);

            const tableBookings = tableState.map((item: FLOOR_TABLES_TYPE) => [
                item.id,
                60,
            ]);
            if (Number(amount) < 0) {
                toast({
                    title: 'Error',
                    description: "Negative can't be total amount! ",
                    variant: 'destructive',
                });
                return;
            }

            const variables = {
                input: {
                    user: selectedUser?.id,
                    type: 'DINE_IN',
                    status: 'PENDING',
                    outlet: activeOutlet.id,
                    orderId: searchParams.get('orderId')
                        ? `${searchParams.get('orderId')}`
                        : randomId(),
                    isCart: true,
                    tableBookings: tableBookings.length
                        ? JSON.stringify(tableBookings)
                        : null,
                    items: cart.map((item) => ({
                        product: item.id,
                        quantity: item.quantity,
                        discount: `${toFixed(item.discount)}`,
                    })),
                },
            };
            console.log(variables);



            await createOrder({
                variables: variables,
            });



            clearCart();
            setSelectedUser(undefined);
            clearTable();
        } catch (error) {
            console.log(error);

            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
    };
    const handleSelectUser = (newSelectedUser: USER_TYPE) => {
        setSelectedUser(newSelectedUser);
    };
    if (loading) {
        return <></>
    }
    return (
        <Card
            className="w-[350px] 
                col-span-1
                h-[calc(100vh-105px)]
                flex flex-col
            "
        >
            {/* Header with Customer Selection */}
            <div className="p-4 border-b">
                <div className="space-y-3">
                    {/* Customer Search */}
                    <CustomerSearch onSelect={handleSelectUser} />
                    {/* Customer Info */}
                </div>
            </div>
            <div className="p-4 border-b ">
                {/* Table */}
                <div className="flex gap-2 justify-between">
                    <div className="flex justify-between w-full ">

                        <Sheet />

                    </div>
                    {/* divider */}
                    <div className='w-full flex justify-end border-r  '>
                        <Select value={orderChannel} onValueChange={setOrderChannel}>
                            <SelectTrigger className="w-[200px] ">
                                <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        orderChannels.map(item => <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                        )
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>
                </div>
            </div>

            {/* Cart Items Section */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {/* Sample Cart Items */}
                    {cart?.map((item) => (
                        <CardItem
                            onMinusItem={() =>
                                decrementItemQuantity(item.id)
                            }
                            discount={item.discount}
                            key={item.id}
                            name={item.name}
                            price={item.price}
                            quantity={item.quantity}
                            onPlusItem={() =>
                                incrementItemQuantity(item.id)
                            }
                        />
                    ))}
                </div>
            </div>

            <div className="p-4 border-t ">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$ {subTotal || '0'} </span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT</span>
                        <span>
                            ${calculateVat(cart)?.toFixed(2) || '0'}
                        </span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>$ {finalAmount || '0'}</span>
                    </div>
                    <div className=" mt-4  flex flex-col gap-2  ">
                        <DiscountModel />
                        <div className="flex gap-2">
                            <PaymentModal

                                variant="outline"
                                openBtnName="Order"
                                orderId={orderId}
                                // disabled={
                                //     createOrderLoading
                                // }
                                disabled={isDisableModel}
                                onPaymentRequest={handlePlaceOrderV2}
                            />
                            <Button
                                disabled={cart?.length === 0}
                                isLoading={
                                    createOrderLoading
                                }
                                onClick={() => {
                                    handlePlaceOrderV2();
                                }}
                                className="w-full "
                            >
                                Add To Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default memo(POSCart);