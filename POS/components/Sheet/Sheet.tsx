import TableView from "@/app/(space)/floor/components/table-view/table-view";
import {
    Sheet as CNSheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import useStore from "@/stores";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { MdTableBar } from "react-icons/md";
import { CheckCircle2 } from "lucide-react"; // New icons from lucide-react

const Sheet = () => {
    const [open, setOpen] = useState(false)
    const tableState = useStore((store) => store.table);
    const selectedTableCount = useMemo(() => tableState?.length || 0, [tableState]);
    const selectedTableNames = useMemo(() =>
        tableState.map(table => table.name).join(', ') || 'None',
        [tableState]
    );

    const handleToggleSheet = () => {
        setOpen(!open)
    }
    return (
        <CNSheet
            onOpenChange={handleToggleSheet}
            open={open}
        >
            <SheetTrigger asChild>
                <Button
                    variant={selectedTableCount > 0 ? "default" : "outline"} // Changes appearance if tables are selected
                    className="relative px-4 py-2  text-lg font-semibold transition-all duration-200 ease-in-out group"
                    aria-label="Select tables for the order"
                    style={{
                        zIndex: 1
                    }}
                >
                    <div className="flex items-center gap-2">
                        <MdTableBar className="h-5 w-5" />
                        {selectedTableCount > 0 ? (
                            <>
                                <span className="mr-1">Selected Tables:</span>
                                <span className="font-bold text-lg">{selectedTableCount}</span>
                                <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" /> {/* Green check icon */}
                            </>
                        ) : (
                            <span>Select Table</span>
                        )}
                    </div>
                    {/* Optional: Show table names on hover for desktop users */}
                    {selectedTableCount > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {selectedTableNames}
                        </div>
                    )}
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