"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
interface DatePickerProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    placeholder?: string;
    name: Path<T>;
    label?: string;
    description?: string,
    disabled?: boolean
}
export function DatePicker<T extends FieldValues>({ description, disabled = false, form, name, placeholder = 'Pick a date', label }: DatePickerProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col mt-[10px]">
                    <FormLabel >{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger disabled={disabled} asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        " h-11 pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>{placeholder}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {
                        description ? <FormDescription>
                            {description}
                        </FormDescription> : <></>
                    }

                    <FormMessage />
                </FormItem>
            )}
        />

    )
}

export default DatePicker