import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import Link from "next/link"
import Button from "@/components/button"
import { ORDER_CHANNEL_TYPE } from "@/graphql/order"

export const columns: ColumnDef<ORDER_CHANNEL_TYPE>[] = [
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
        accessorKey: "commissionRate",
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
                <Link href={`/orders/channel/add?id=${row.getValue("id")}`}>
                    <Button>Edit</Button>
                </Link>
            )
        },
    },
]


export default columns