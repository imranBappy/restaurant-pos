"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Button from "@/components/button"
import { Form, } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { SwitchItem } from "@/components/input/switch-item"
import Loading from "@/components/ui/loading"
import { TextField } from "@/components/input"
import { useRouter, useSearchParams } from "next/navigation"
import { PAYMENT_METHODS_TYPE } from "@/constants/payment.constants"
import { PAYMENT_METHOD_QUERY, } from "@/graphql/payment"
import { ORDER_CHANNEL_TYPES } from "@/constants/order.constants"
import { ORDER_CHANNEL_MUTATION, ORDER_CHANNEL_QUERY } from "@/graphql/order"

const orderChannelFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    commissionRate: z.coerce.number().nonnegative("Service charge rate must be zero or positive").default(0),
    type: z.string().default(PAYMENT_METHODS_TYPE[0].value)
})

type ORDER_CHANNEL_TYPE = z.infer<typeof orderChannelFormSchema>

export function OrderChannelForm() {
    const params = useSearchParams()
    const id = params.get("id")
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<ORDER_CHANNEL_TYPE>({
        resolver: zodResolver(orderChannelFormSchema),
        defaultValues: {
            name: "",
            commissionRate: 0,
            type: ORDER_CHANNEL_TYPES[0].value
        },
    })

    const [upsertupsertPaymentMethod, { loading: create_loading }] = useMutation(ORDER_CHANNEL_MUTATION, {
        refetchQueries: [{
            query: ORDER_CHANNEL_MUTATION,
            variables: {
                offset: 0,
                first: 10,
            }
        }]
    })


    const { loading: method_loading } = useQuery(ORDER_CHANNEL_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: async (data) => {
            form.reset({
                name: data.orderChannel?.name,
                commissionRate: data.orderChannel?.commissionRate,
                type: data.orderChannels?.type,
            });
        },
        onError: (error) => {
            console.error(error);
            router.push('/orders/channel')
        }
    })




    async function onSubmit(data: ORDER_CHANNEL_TYPE) {
        try {
            await upsertupsertPaymentMethod({
                variables: {
                    ...data,
                    orderChannel: data.commissionRate,
                    id: id || undefined
                },
            })
            toast({
                title: "Success",
                description: "Order Channel created successfully",
            })
            form.reset({
                name: "",
                commissionRate: 0,
                type: ''
            })
            if (id) router.push('/orders/channel')
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
                                id ? "Update Order Channel" : "Create Order Channel"
                            }
                        </CardTitle>
                        <CardDescription>
                            An order channel refers to the platform or method through which a customer places an order, such as in-person at the restaurant, via phone, through a website, or using a mobile app. It helps businesses track where orders are coming from and optimize their sales strategies accordingly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">

                            <Separator />
                            <TextField
                                form={form}
                                name="name"
                                label="Order Channel"
                                placeholder="Enter order channel name e.g., Foodpanda, Pathao"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <SwitchItem
                                    form={form}
                                    name="type"
                                    label="Type"
                                    options={ORDER_CHANNEL_TYPES}
                                    placeholder="Order type "
                                />
                                <TextField
                                    form={form}
                                    name="commissionRate"
                                    label="Commission rate"
                                    placeholder="Enter commission rate"
                                    type="number"
                                    min={0}
                                />

                            </div>

                        </div>
                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update Channel" : "Create Channel"
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}