import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { ORDER_STATUSES_LIST, ORDER_TYPE_LIST } from "@/constants/order.constants"
import { useQuery } from "@apollo/client"
import { ORDER_CHANNEL_TYPE, ORDER_CHANNELS_QUERY } from "@/graphql/order"
import { OPTION_TYPE } from "@/components/input"
import { toast } from "@/hooks/use-toast"

const ORDER_TYPE = [...ORDER_TYPE_LIST]
const ORDER_STATUSES = [...ORDER_STATUSES_LIST]
ORDER_STATUSES.unshift('ALL')
ORDER_TYPE.unshift('ALL')

const ORDER_SORT = ['ALL', '-createdAt', 'createdAt', '-final_amount', 'final_amount']
export interface FilterState {
  search: string | undefined;
  orderChannel: typeof ORDER_TYPE[number] | undefined;
  status: typeof ORDER_STATUSES[number] | undefined;
  orderBy: typeof ORDER_SORT[number] | undefined;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}




export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
    onFilterChange(key)(value)
  }
  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleClearFilters = () => {
    onFilterChange('search')(undefined)
    onFilterChange('status')('ALL')
    onFilterChange('orderChannel')('ALL')
    onFilterChange('orderBy')('ALL')
    setDebouncedSearch('')
  };
  const { loading: orderChannelsLoading, data: orderChannelsRes } = useQuery(ORDER_CHANNELS_QUERY, {
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const orderChannels: OPTION_TYPE[] = orderChannelsRes?.orderChannels?.edges?.map(({ node }: { node: ORDER_CHANNEL_TYPE }) => ({
    value: node.id,
    label: node.name,
  })) || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("search")(debouncedSearch)
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  if (orderChannelsLoading) {
    return <p>Filter loading...</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="space-y-2">
          <Input
            placeholder="Search order"
            value={debouncedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={filters.orderChannel}
            onValueChange={handleFilterChange('orderChannel')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Order channel" />
            </SelectTrigger>
            <SelectContent>
              {
                orderChannels.map((item, index) => (
                  <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
            value={filters.status}
            onValueChange={handleFilterChange('status')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {
                ORDER_STATUSES.map((status, index) => (
                  <SelectItem key={index} value={status}>{status}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>


        <div className="space-y-2">
          <Select
            value={filters.orderBy}
            onValueChange={handleFilterChange('orderBy')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select OrderBy" />
            </SelectTrigger>
            <SelectContent>
              {
                ORDER_SORT.map((sort, index) => (
                  <SelectItem key={index} value={sort}>{sort}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>


        <div className="
                    flex-1
                    text-sm
                    text-muted-foreground
                    whitespace-nowrap
                    mr-2
                    flex
                    justify-end
                    items-end

                    ">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="text-sm"

          >
            <X />
            Reset
          </Button>
        </div>
      </div>

    </>
  );
}

export default TableFilters 