"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Button from "@/components/button"
import {
    Form,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { SwitchItem } from "@/components/input/switch-item"
import Loading from "@/components/ui/loading"
import { TextField } from "@/components/input"
import { useRouter, useSearchParams } from "next/navigation"
import { PAYMENT_METHODS_TYPE } from "@/constants/payment.constants"
import { PAYMENT_METHOD_MUTATION, PAYMENT_METHOD_QUERY, PAYMENT_METHODS_QUERY } from "@/graphql/payment"

const paymentMethodFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    serviceChargeRate: z.coerce.number().nonnegative("Service charge rate must be zero or positive").default(0),
    type: z.string().default(PAYMENT_METHODS_TYPE[0].value)
})

type PAYMENT_METHOD_TYPE = z.infer<typeof paymentMethodFormSchema>

export function PaymentMothodForm() {
    const params = useSearchParams()
    const id = params.get("id")
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<PAYMENT_METHOD_TYPE>({
        resolver: zodResolver(paymentMethodFormSchema),
        defaultValues: {
            name: "",
            serviceChargeRate: 0,
            type: PAYMENT_METHODS_TYPE[0].value
        },
    })

    const [upsertPaymentMethod, { loading: create_loading }] = useMutation(PAYMENT_METHOD_MUTATION, {
        refetchQueries: [{
            query: PAYMENT_METHODS_QUERY,
            variables: {
                offset: 0,
                first: 10,
            }
        }]
    })


    const { loading: method_loading } = useQuery(PAYMENT_METHOD_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: async (data) => {
            form.reset({
                name: data.paymentMethod?.name,
                serviceChargeRate: data.paymentMethod?.serviceChargeRate,
                type: data.paymentMethod?.type,
            });
        },
        onError: (error) => {
            console.error(error);
            router.push('/payments/method')
        }
    })




    async function onSubmit(data: PAYMENT_METHOD_TYPE) {
        try {
            await upsertPaymentMethod({
                variables: {
                    ...data,
                    serviceChargeRate: data.serviceChargeRate, // already a number
                    id: id || undefined
                },
            })
            toast({
                title: "Success",
                description: "Payment method created successfully",
            })
            form.reset({
                name: "",
                serviceChargeRate: undefined,
                type: 'undefined'
            })
            if (id) router.push('/payments/method')
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    if (method_loading) return <Loading />

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {
                                id ? "Update Payment method" : "Create Payment method"
                            }
                        </CardTitle>
                        <CardDescription>
                            A payment method is a way for customers to pay for goods or services. Common payment methods include cash, credit or debit cards, digital wallets, and bank transfers. In a POS system, payment methods help track how each transaction is completed, making it easier to manage sales, accounting, and reporting.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {/* <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">Basic Information</h3>
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">Active</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            <Separator />
                            <TextField
                                form={form}
                                name="name"
                                label="Paythod Name"
                                placeholder="Enter Paythod name"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <SwitchItem
                                    form={form}
                                    name="type"
                                    label="Payment mothod"
                                    options={PAYMENT_METHODS_TYPE}
                                    placeholder="Payment method type"
                                />
                                <TextField
                                    form={form}
                                    name="serviceChargeRate"
                                    label="Service Charge rate"
                                    placeholder="Enter service charge rate"
                                    type="number"
                                    min={0}
                                />

                            </div>

                        </div>
                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update Method" : "Create Method"
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}