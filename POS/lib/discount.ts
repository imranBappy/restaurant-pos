type Item = {
    name: string;
    qty: number;
    price: number;
    maxDiscountPercent: number; // Max allowed discount per product
};

function calculateTotalWithDiscount(
    items: Item[],
    discountValue: number,
    discountType: "amount" | "percent"
) {
    const itemTotals = items.map(item => {
        const total = item.qty * item.price;
        const maxDiscount = (total * item.maxDiscountPercent) / 100;
        return { ...item, total, maxDiscount };
    });

    const subtotal = itemTotals.reduce((sum, i) => sum + i.total, 0);

    if (discountType === "percent") {
        // Calculate item-wise discount capped by maxDiscountPercent
        let totalDiscount = 0;
        const itemDiscounts = itemTotals.map(item => {
            const proposed = (item.total * discountValue) / 100;
            const actual = Math.min(proposed, item.maxDiscount);
            totalDiscount += actual;
            return { ...item, discount: actual };
        });
        const grandTotal = subtotal - totalDiscount;
        return { subtotal, totalDiscount, grandTotal, items: itemDiscounts };
    }

    if (discountType === "amount") {
        // Distribute discount proportionally by total but cap each by maxDiscount
        let remainingDiscount = discountValue;
        const itemDiscounts = itemTotals.map(item => {
            const share = (item.total / subtotal) * discountValue;
            const actual = Math.min(share, item.maxDiscount);
            remainingDiscount -= actual;
            return { ...item, discount: actual };
        });

        const totalDiscount = discountValue - remainingDiscount;
        const grandTotal = subtotal - totalDiscount;

        return { subtotal, totalDiscount, grandTotal, items: itemDiscounts };
    }

    throw new Error("Invalid discount type");
}
