"use client"
import React, { useState } from 'react';
import SearchableFiled from './SearchableFiled';
import { useQuery } from '@apollo/client';
import { CUSTOMER_SEARCH_QUERY } from '@/graphql/accounts/queries';
import { ScrollArea } from '@/components/ui/scroll-area';
import { USER_TYPE } from '@/graphql/accounts';
import { Button } from './ui/button';
import { Plus } from "lucide-react";



const CustomerSearch = ({ onSelect }: { onSelect: (user: USER_TYPE) => void }) => {
    const [search, setSearch] = useState("")
    const [value, setValue] = useState("")

    const { data, loading } = useQuery(CUSTOMER_SEARCH_QUERY, {
        variables: {
            search: search,
            first: 30
        },
        fetchPolicy: 'network-only',
    })

    const users: USER_TYPE[] = data?.users?.edges?.map(({ node }: { node: USER_TYPE }) => node)

    const handleSelect = (user: USER_TYPE) => {
        setSearch("")
        setValue(user.name || user.email)
        onSelect(user)
    }



    const resultsElements = users?.map((user: USER_TYPE) => (
        <div
            onClick={() => handleSelect(user)}
            key={user.id} className=" relative text-sm mx-4  rounded-sm cursor-pointer   bg-neutral-800 py-2  px-4  border-b-2 border-black">
            {`${user.name ? user.name + " - " : ""}  ${user.email}`}
        </div>
    ))

    const elementContainer = <div className="absolute shadow dark:bg-black top-10 bg-white">
        <ScrollArea className="h-72   w-80 z-50 rounded-md border ">
            <div className="relative">
                <h4 className="mb-4 px-4 mt-4 text-sm font-medium leading-none ">Search result</h4>
                {resultsElements}
            </div>
        </ScrollArea>
    </div>

    const notFound =
        <div className="absolute shadow dark:bg-black top-10 bg-white">
            <ScrollArea className="h-72 w-80 z-50 rounded-md   border ">
                <p className="  text-center mt-10 text-sm">Not Found Result!</p>
            </ScrollArea>
        </div>

    let content = users?.length ? elementContainer : notFound

    if (loading) content =
        <div className="absolute shadow dark:bg-black top-10 bg-white">
            <ScrollArea className="h-72 w-80 z-50 rounded-md   border ">
                <p className="text-center mt-10 text-sm">Loading...</p>
            </ScrollArea>
        </div>


    if (!search) {
        content = <></>
    }
    return (
        <div className='flex gap-1 items-center'>
            <SearchableFiled
                onChange={(value: string) => setSearch(value)}
                valueState={[value, setValue]}
                placeholder='Search customer...'
            >
                {content}
            </SearchableFiled>
            <Button variant={'secondary'}>
                <Plus />
            </Button>
        </div>
    );
};

export default CustomerSearch;