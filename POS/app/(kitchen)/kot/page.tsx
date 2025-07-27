"use client";
import React, { useState } from "react";
// Import your GraphQL hooks or Apollo client here
import { Input, } from "@/components/ui";
import { useQuery } from "@apollo/client";
import { KITCHEN_ORDER_QUERY, KITCHEN_ORDER_TYPE, KOT_STATUS_TYPES } from "@/graphql/kitchen";
import KOTCard, { statusColorVariants } from "../components/KOTCard";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductSkeleton from "@/app/(order)/components/pos/product-skeleton";

const KOTPage = () => {
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 30,
    })
    const [orderId, setOrderId] = useState("");
    const [status, setStatus] = useState("PENDING")
    const getStatusStyles = (status: string) => statusColorVariants[status] || statusColorVariants.DEFAULT;
    const { data, loading, fetchMore } = useQuery(KITCHEN_ORDER_QUERY,
        {
            variables: {
                offset: 0,
                first: pagination.pageSize,
                orderBy: '-createdAt',
                ...(orderId ? { order: orderId } : {}),
                ...(status !== 'ALL' && status ? { status: status } : {})
            }
        }
    )
    const kitchenOrders = data?.kitchenOrders?.edges || []
    console.log({ kitchenOrders });

    const fetchMoreKitchenOrders = async () => {
        try {
            const currentLength = kitchenOrders?.length;
            await fetchMore({
                variables: {
                    offset: currentLength,
                    first: pagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        kitchenOrders: {
                            __typename: prev.kitchenOrders.__typename,
                            totalCount: fetchMoreResult.kitchenOrders.totalCount,
                            edges: [...prev.kitchenOrders.edges, ...fetchMoreResult.kitchenOrders.edges],
                            pageInfo: fetchMoreResult.kitchenOrders.pageInfo
                        }
                    };
                }
            });
        } catch (error) {
            console.error('Error fetching more products:', error);

        }
    };
    // if (loading) return <Loading />
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Kitchen Order Tickets (KOT)</h1>
            {/* Filters */}
            <div className="flex flex-row md:flex-nowrap flex-wrap gap-4 mb-6">
                <Input

                    className="border rounded px-3 py-2 max-w-80"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                />

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="border rounded px-3 py-2 max-w-80">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>

                        <SelectGroup>
                            <SelectItem value={"ALL"}>
                                ALL
                            </SelectItem>
                            {

                                KOT_STATUS_TYPES.map((item) => <SelectItem key={item.value} value={item.value}>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                                        ${getStatusStyles(item.value).bg} ${getStatusStyles(item.value).text}
                                                                        `}>
                                        {item.label}
                                    </span>
                                </SelectItem>)
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </div>
            <div
                className='h-[calc(100vh-209px)]'
                id="scrollableDiv"
                style={{
                    overflow: 'auto',
                    display: 'flex',
                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
                    cursor: 'grab',
                }}
            >
                {
                    kitchenOrders.length === 0 ? (
                        <div className="w-full flex justify-center items-center h-[calc(100vh-225px)]">
                            <p className=" text-muted-foreground font-medium text-lg">
                                No KOT found
                            </p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={kitchenOrders.length}
                            next={fetchMoreKitchenOrders}
                            hasMore={
                                !loading &&
                                (data?.kitchenOrders?.totalCount || 0) >
                                (kitchenOrders?.length || 0)
                            }
                            loader={Array(8).fill(0).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}
                            className='flex flex-wrap gap-4 w-full'
                            scrollableTarget="scrollableDiv"

                        >
                            {loading && !data ? (
                                <ProductSkeleton />
                            ) : (
                                data?.kitchenOrders?.edges?.map(({ node }: { node: KITCHEN_ORDER_TYPE }) => <KOTCard key={node.id} kot={node} />)
                            )}
                        </InfiniteScroll>
                    )
                }
            </div>
            {/* KOT Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.kitchenOrders?.edges?.map(({ node }) => <KOTCard key={node.id} kot={node} />)}
            </div> */}
        </div>
    );
};

export default KOTPage;

