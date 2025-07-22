import Button from "@/components/button";
import { FaChair, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";

const TableCard = ({
    table,
    handleTableClick,
    selected,
    handleBookUnbook,
}: {
    handleTableClick: (id: string) => void;
    handleBookUnbook: () => void;
    table: { status: string; id: string; name: string; size: number };
    selected: boolean;
}) => {
    const isBusy = table.status === "busy";
    const cardColor =
        isBusy
            ? "bg-red-50 dark:bg-red-900/30 border-red-400"
            : selected
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-400"
                : "bg-green-50 dark:bg-green-900/30 border-green-400";

    const badgeColor =
        isBusy
            ? "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100"
            : selected
                ? "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100"
                : "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100";

    const statusText = isBusy ? (
        <span className="flex items-center gap-1">
            <FaTimesCircle className="text-red-500" /> Busy
        </span>
    ) : (
        <span className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500" /> Free
        </span>
    );

    return (
        <div
            className={`
        relative rounded-xl shadow-lg border-l-4 p-6 m-2 w-56 transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col justify-between
        ${cardColor}
        bg-gradient-to-br from-white/80 via-transparent to-gray-100 dark:from-gray-900/80 dark:to-gray-800
      `}
            onClick={() => handleTableClick(table.id)}
            style={{
                boxShadow:
                    selected && !isBusy
                        ? "0 4px 24px 0 rgba(59,130,246,0.15)"
                        : "0 2px 8px 0 rgba(0,0,0,0.08)",
            }}
        >
            {/* Status badge */}
            <div className="flex justify-between items-center mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeColor}`}>
                    {isBusy ? "Busy" : selected ? "Selected" : "Free"}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200">
                    <FaChair className="inline-block" />
                    {table.size}
                </span>
            </div>
            {/* Table name */}
            <div className="flex items-center justify-center gap-2 mb-2">
                <FaStar
                    className={`text-xl ${selected
                        ? "text-blue-500 drop-shadow"
                        : isBusy
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                />
                <span
                    className={`
            text-2xl font-extrabold tracking-wide text-center
            ${selected
                            ? "bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent drop-shadow"
                            : isBusy
                                ? "bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent"
                                : "bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent"
                        }
          `}
                >
                    {table.name}
                </span>
            </div>
            {/* Status */}
            <div className="mb-2 text-sm text-gray-700 dark:text-gray-200 text-center">{statusText}</div>
            {/* Book/Free Button */}
            <Button
                onClick={e => {
                    // e.stopPropagation();
                    handleBookUnbook();
                }}
                className={`
          mt-4 w-full py-2 rounded-lg font-semibold transition-colors shadow
          ${isBusy
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"}
        `}
            >
                {isBusy ? "Free Table" : "Book Table"}
            </Button>
        </div>
    );
};

export default TableCard;