import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { NotebookPen } from "lucide-react"
import useStore from "@/stores"

export function ItemNoteDialog({ item }: { item: { name: string, id: string } }) {
    const cart = useStore((store) => store.cart);
    const cardItem = cart.find((it) => it.id === item.id)
    const [note, setNote] = useState(cardItem?.note || "")
    const addNote = useStore((store) => store.addItemNote);

    const handleAddNote = () => {
        if (note) {
            addNote(item.id, note)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full   hover:text-white transition-colors"
                >
                    <NotebookPen className="h-2 w-2" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Special Instructions</DialogTitle>
                    <DialogDescription>
                        Let the kitchen know how you’d like it prepared.
                    </DialogDescription>
                </DialogHeader>

                <div className="text-lg font-medium">{item.name}</div>

                <Textarea
                    className="mt-4"
                    placeholder="E.g., no onions, extra sauce, very spicy..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <div className="flex justify-end mt-4">
                    <DialogClose asChild>
                        <Button
                            onClick={handleAddNote}
                        >
                            Save Note
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}
