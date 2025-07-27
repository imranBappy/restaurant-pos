import { FaUser, FaUtensils, FaClock, FaStickyNote } from "react-icons/fa";
import { format } from "date-fns";
import { useMutation } from "@apollo/client";
import { KOT_STATUS_UPDATE } from "@/graphql/kitchen/mutations";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { KITCHEN_ORDER_QUERY, KITCHEN_ORDER_TYPE, KOT_STATUS_TYPES } from "@/graphql/kitchen";
import { useToast } from "@/hooks/use-toast";
import { ORDER_ITEM_TYPE } from "@/graphql/product";
export const statusColorVariants = {
    PENDING: {
        bg: "bg-yellow-200 dark:bg-yellow-800/20",
        text: "text-yellow-900 dark:text-yellow-100",
        border: "border-yellow-400",
        hover: "hover:bg-yellow-100 dark:hover:bg-yellow-800/60"
    },
    ACKNOWLEDGED: {
        bg: "bg-purple-200 dark:bg-purple-800/20",
        text: "text-purple-900 dark:text-purple-100",
        border: "border-purple-400",
        hover: "hover:bg-purple-100 dark:hover:bg-purple-800/60"
    },
    IN_PROGRESS: {
        bg: "bg-orange-200 dark:bg-orange-800/20",
        text: "text-orange-900 dark:text-orange-100",
        border: "border-orange-400",
        hover: "hover:bg-orange-100 dark:hover:bg-orange-800/60"
    },
    ON_HOLD: {
        bg: "bg-pink-200 dark:bg-pink-800/20",
        text: "text-pink-900 dark:text-pink-100",
        border: "border-pink-400",
        hover: "hover:bg-pink-100 dark:hover:bg-pink-800/60"
    },
    READY: {
        bg: "bg-green-200 dark:bg-green-800/20",
        text: "text-green-900 dark:text-green-100",
        border: "border-green-500",
        hover: "hover:bg-green-100 dark:hover:bg-green-800/60"
    },
    SERVED: {
        bg: "bg-indigo-200 dark:bg-indigo-800/20",
        text: "text-indigo-900 dark:text-indigo-100",
        border: "border-indigo-400",
        hover: "hover:bg-indigo-100 dark:hover:bg-indigo-800/60"
    },
    CANCELLED: {
        bg: "bg-red-200 dark:bg-red-800/20",
        text: "text-red-900 dark:text-red-100",
        border: "border-red-400",
        hover: "hover:bg-red-100 dark:hover:bg-red-800/60"
    },
    COMPLETED: {
        bg: "bg-blue-200 dark:bg-blue-800/20",
        text: "text-blue-900 dark:text-blue-100",
        border: "border-blue-400",
        hover: "hover:bg-blue-100 dark:hover:bg-blue-800/60"
    },
    DEFAULT: {
        bg: "bg-gray-200 dark:bg-gray-700/20",
        text: "text-gray-900 dark:text-gray-100",
        border: "border-gray-400",
        hover: "hover:bg-gray-100 dark:hover:bg-gray-700/60"
    }
};

const KOTCard = ({ kot }: { kot: KITCHEN_ORDER_TYPE}) => {
    const getStatusStyles = (status:string) => statusColorVariants[status] || statusColorVariants.DEFAULT;
    const { toast } = useToast()

    const [update] = useMutation(KOT_STATUS_UPDATE, {
        onCompleted: () => {
            toast({
                description: 'Status updated!',
            })
        },
        refetchQueries: [
            {
                query: KITCHEN_ORDER_QUERY,

            },
        ],
        awaitRefetchQueries: true,

    })
    const statusStyles = getStatusStyles(kot.status);

    const handleUpdateKOTStatus = (status:string) => {
        update({
            variables: {
                kotId: kot.id,
                status: status
            }
        })
    }



    return (
        <div className={`
  relative rounded-xl min-w-[400px] shadow-md border-l-4 p-5 mb-4
  transition-all duration-200 hover:shadow-xl
  ${statusStyles.bg} ${statusStyles.border} ${statusStyles.hover}
`}>
            {/* Status badge and time */}
            <div className="flex justify-between items-center mb-2">

                <Select defaultValue={kot.status}
                    onValueChange={handleUpdateKOTStatus}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            {
                                KOT_STATUS_TYPES.map((item) => <SelectItem key={item.value} value={item.value}>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
  ${getStatusStyles(item.value).bg} ${getStatusStyles(item.value).text}
`}>
                                        {item.label}
                                    </span>
                                </SelectItem>)
                            }


                        </SelectGroup>
                    </SelectContent>
                </Select>

                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200">
                    <FaClock className="inline-block" />
                    {format(new Date(kot.completionTime), "HH:mm, dd MMM yyyy")}
                </span>
            </div>
            {/* Order/Kitchen/Customer */}
            <div className="mb-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                    <FaUtensils className="text-blue-500" />
                    {kot.kitchen.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <FaUser className="text-green-500" />
                    {kot.order?.user?.name || "Anonymous"} {
                        kot.order?.user?.email && <span className="text-gray-400">({kot.order?.user?.email})</span>
                    }
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-indigo-700 dark:text-indigo-300">Order #</span>
                    <span className="font-bold text-indigo-900 dark:text-indigo-100">{kot.order.orderId}</span>
                </div>
               
            </div>
            {/* Order Items */}
            <div className="mt-3">
                <div className="font-semibold mb-1 text-sm text-gray-700 dark:text-gray-200">Order Items:</div>
                <div className="flex flex-col gap-3">
                    {kot.productOrders?.edges?.map(({ node }) => (
                        <div
                            key={node.id}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-xs text-gray-800 dark:text-gray-100 shadow-sm flex flex-col gap-1"
                        >
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm">{node?.product?.name}</div>
                                <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full px-2 font-bold">
                                    x{node.quantity}
                                </span>
                            </div>

                            {node.note && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300 mt-1">
                                    <FaStickyNote className="text-yellow-500" />
                                    <span className="italic">{node.note}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KOTCard;