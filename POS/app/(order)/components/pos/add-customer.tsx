import UserAddForm from "@/app/(user)/users/components/forms/user-add-form"
import { Button } from "@/components/ui/button"

import {
    Sheet,
    SheetContent,

    SheetTrigger,
} from "@/components/ui/sheet"
import { USER_TYPE } from "@/graphql/accounts"
import { Plus } from "lucide-react"
import { useState } from "react"

function AddNewCustomer({ handleSelectUser }) {
    const [open, setOpen] = useState(false)
    return (
        <Sheet defaultOpen={open} onOpenChange={setOpen} modal={open} open={open} >
            <SheetTrigger asChild>
                <Button onClick={() => setOpen(true)} size='icon' variant={'outline'}>
                    <Plus />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <UserAddForm className="grid grid-cols-1  gap-6"
                    onCreatedUser={(user:USER_TYPE) => {
                        setOpen(false)
                        handleSelectUser(user)
                    }}
                />
            </SheetContent>
        </Sheet>
    )
}
export default AddNewCustomer