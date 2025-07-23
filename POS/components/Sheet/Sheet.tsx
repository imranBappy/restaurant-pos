import TableView from "@/app/(space)/floor/components/table-view/table-view";
import {
    Sheet as CNSheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import useStore from "@/stores";
import { useState } from "react";
import { Button } from "../ui/button";
import { MdTableBar } from "react-icons/md";

const Sheet = () => {
    const [open, setOpen] = useState(false)
    const tableState = useStore((store) => store.table);

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
                <Button variant={'secondary'}>
                    <MdTableBar />
                    {tableState?.length}
                </Button>
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