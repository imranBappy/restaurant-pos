"use client"
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
import { Plus, X } from "lucide-react"
import { PAYMENT_METHODS_TYPE } from "@/constants/payment.constants"
import { useRouter } from 'next/navigation'
export const PAYMENT_SORT = ['ALL', '-createdAt', 'createdAt', '-amount', 'amount']


export interface FilterState {
  name: string | undefined;
  type: string | undefined;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}




export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const router = useRouter()
  const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
    onFilterChange(key)(value)
  }
  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleClearFilters = () => {
    onFilterChange('name')(undefined)
    onFilterChange('type')(undefined)
    setDebouncedSearch('')
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("name")(debouncedSearch)
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])



  return (
    <div className="flex justify-between flex-wrap">
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-2">
        <div className="space-y-2">
          <Input
            placeholder="Search by name"
            value={debouncedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Select
            value={filters.type}
            onValueChange={handleFilterChange('type')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS_TYPE.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* ...other filters if any... */}
      </div>
      <div className="flex justify-end gap-5 mb-6">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="text-sm"
        >
          <X />
          Reset
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            router.push("/payments/method/add")
          }}
          className="text-sm"
        >
          <Plus />
          Add
        </Button>
      </div>
    </div>
  );
}

export default TableFilters 