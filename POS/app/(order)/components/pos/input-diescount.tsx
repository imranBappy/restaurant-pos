import React from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui';


const InputDiscount = () => {
    return (
        <div className='flex flex-row'>
            <Select defaultValue='percentage' >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Input placeholder='Enter discount' />
        </div>
    );
};

export default InputDiscount;