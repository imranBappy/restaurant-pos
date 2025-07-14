import { Card } from "@/components/ui";
import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PROPS_TYPE {
    image: Promise<string>,
    name: string,
    price: number,
    onClick?: () => void,
    selected?: boolean
}

const ProductCard = ({ image, name, price, onClick, selected }: PROPS_TYPE) => {
    return (
        <Card
            onClick={onClick}
            className={cn("p-3 w-[150px] cursor-pointer dark:hover:bg-slate-100/20 hover:bg-slate-100 ", selected && "dark:bg-slate-100/20 bg-slate-100")}>
            <Image
                src={image}
                className="rounded-lg"
                width={200}
                height={200}
                alt={name || "Product image"}
            />
            <Link href={"#"} className="line-clamp-1  block font-medium mt-1">
                <p className="line-clamp-2">{name}</p>
            </Link>
            <p className="text-sm text-muted-foreground">${price.toFixed(2)}</p>
        </Card>
    );
};

export default ProductCard;