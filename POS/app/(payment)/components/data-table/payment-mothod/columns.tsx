import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import { PAYMENT_METHOD_TYPE } from "@/graphql/payment"
import Link from "next/link"
import Button from "@/components/button"

export const columns: ColumnDef<PAYMENT_METHOD_TYPE>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },

    {
        accessorKey: "type",
        header: "Type",

    },
    {
        accessorKey: "serviceChargeRate",
        header: "Rate ",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <div className="capitalize">{`${moment(row.getValue("createdAt")).format("DD-MM-YYYY")} - ${moment(row.getValue("createdAt")).fromNow()}`}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <Link href={`/payments/method/add?id=${row.getValue("id")}`}>
                    <Button>Edit</Button>
                </Link>
            )
        },
    },
]


export default columns