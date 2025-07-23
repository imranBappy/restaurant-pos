import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import Link from "next/link";

interface PROPS_TYPE {
    name: string;
    price: number;
    quantity: number;
    onPlusItem?: () => void;
    onMinusItem: () => void;
    discount?: number;
}

const CardItem = ({ name, price, quantity, discount = 0, onPlusItem, onMinusItem }: PROPS_TYPE) => {
    const finalPrice = price - discount;

    return (
        <div className="flex items-center justify-between p-2 border rounded-md shadow-sm bg-card text-card-foreground hover:bg-card/90 transition-colors duration-200 ease-in-out text-sm">
            <div className="flex-1 min-w-0">
                {/* Product Name */}
                <Link href='#' className="block text-base font-semibold truncate text-primary hover:underline">
                    {name}
                </Link>
                {/* Price and Quantity Display */}
                <div className="flex items-baseline gap-1 mt-0.5">
                    {discount > 0 && (
                        <p className="text-xs line-through text-muted-foreground">
                            ${price.toFixed(2)}
                        </p>
                    )}
                    <p className="text-sm font-bold text-accent-foreground">
                        ${finalPrice.toFixed(2)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                        x {quantity}
                    </span>
                </div>
            </div>
            {/* Quantity Adjustment Controls */}
            <div className="flex items-center space-x-1 ml-2">
                <Button
                    onClick={onMinusItem}
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="text-base font-semibold w-6 text-center">
                    {quantity}
                </span>
                <Button
                    onClick={onPlusItem}
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Increase quantity"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};

export default CardItem;