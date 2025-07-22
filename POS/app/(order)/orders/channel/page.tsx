import React from 'react';
import { Card } from '@/components/ui';
import { OrderChannelTable } from '../../components/data-table/channel';

const OrderChannel = () => {
    return (
        <Card className='p-4  m-4'>
            <OrderChannelTable />
        </Card>
    );
};

export default OrderChannel;