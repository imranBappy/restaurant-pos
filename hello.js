/*
Why need KOT
1, Send to kitchen
2, Tracking kitchen cooking report 
3, Tracking Order timing 

Note: Customer can track their order on realtime 
    1, They can see cooking status on realtime
*/

/*
Requirements
1, When order will be generate with KOT will be generate by default
2, One order can cooked in multiple kitchen


KOT schema 
KOT:{
    id:ID,
    kitchen:ID,
    orderID
    status
    items:[
        orderItemID
    ]
    tcompDuration:Ticket Completion Duration
}
*/ 
// Test