import React from 'react';
import { PaymentsMothedTable } from '../../components/data-table/payment-mothod';
import { Card } from '@/components/ui';

const PaymentMedhod = () => {
    return (
        <Card className='p-4  m-4'>
            <PaymentsMothedTable  />
        </Card>
    );
};

export default PaymentMedhod;