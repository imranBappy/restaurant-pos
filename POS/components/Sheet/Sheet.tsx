import TableView from "@/app/(space)/floor/components/table-view/table-view";
import {
    Sheet as CNSheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const Sheet = () => {
    const [open, setOpen] = useState(false)
    const handleToggleSheet = () => {
        setOpen(!open)
    }
    return (
        <CNSheet
            onOpenChange={handleToggleSheet}
            open={open}
        >
            <SheetTrigger
                onClick={handleToggleSheet}
            >
                <ChevronRight  />
            </SheetTrigger>
            <SheetContent style={{ maxWidth: "80%" }}>
                <SheetHeader>
                    <SheetTitle className="ml-5">Book Table </SheetTitle>
                    <TableView onClickBook={handleToggleSheet} />
                </SheetHeader>
            </SheetContent>
        </CNSheet>
    );
};

export default Sheet;