'use client'
import { eventFormSchema } from "@/schema/events"
import { getCategoryOnly, getCategoryAndDescription } from "@/lib/firecrawl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useTransition } from "react"
import Link from "next/link"
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Loading from "../Loading"


type EventFormValues = z.infer<typeof eventFormSchema>;

// Marks this as a Client Component in Next.js




// Component to handle creating/editing/deleting an event
export default function EventForm({
    event, // Destructure the `event` object from the props
}: {
    // Define the shape (TypeScript type) of the expected props
    event?: { // Optional `event` object (might be undefined if creating a new event)
        id: string // Unique identifier for the event
        name: string // Name of the event
        description?: string // Optional description of the event
        category: string // Category of the event
        link?: string // Optional link to the event details
        durationInMinutes: number // Duration of the event in minutes
        isActive: boolean // Indicates whether the event is currently active
    }
}) {


    // useTransition is a React hook that helps manage the state of transitions in async operations
    // It returns two values:
    // 1. `isDeletePending` - This is a boolean that tells us if the deletion is still in progress
    // 2. `startDeleteTransition` - This is a function we can use to start the async operation, like deleting an event

    const [isDeletePending, startDeleteTransition] = useTransition()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showErrorDialog, setShowErrorDialog] = useState(false)


    const form = useForm<z.input<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event
            ? {
                // If `event` is provided (edit mode), spread its existing properties as default values
                ...event,
            }
            : {
                // If `event` is not provided (create mode), use these fallback defaults
                isActive: true,             // New events are active by default
                durationInMinutes: 30,      // Default duration is 30 minutes
                description: '',            // Ensure controlled input: default to empty string
                name: '',                   // Ensure controlled input: default to empty string
                link: '',                   // Ensure controlled input: default to empty string
                category: '',               // Ensure controlled input: default to empty string
            },

    })

    // Handle form submission
    async function onSubmit(values: EventFormValues) {
        setIsLoading(true)
        const action = event == null ? createEvent : updateEvent.bind(null, event.id)
        try {
            const link = values.link as string | undefined;
            const desc = values.description as string | undefined;

            if (link) {
                if (!desc?.trim()) {
                    const { category, description } = await getCategoryAndDescription(link);
                    values.category = category;
                    values.description = description;
                } else {
                    const category = await getCategoryOnly(link);
                    values.category = category;
                }
            }

            const parsedValues = eventFormSchema.parse(values)
            await action(parsedValues)
            router.push('/events')

        } catch (error: any) {
            // Handle any error that occurs during the action (e.g., network error)
            setShowErrorDialog(true)
            //   form.setError("root", {
            //     message: `There was an error saving your event ${error.message}`,
            //   })
            form.reset();
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <Loading />;


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col"
            >
                {/* Show root error if any */}
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                {/* Event Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                The name users will see when booking
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Duration Field */}
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => {
                        const typedField = {
                            ...field,
                            value: Number(field.value) || 0, // Ensure the value is always a number
                        }

                        return (
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                    <Input type="number" {...typedField} />
                                </FormControl>
                                <FormDescription>In minutes</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />

                {/* Optional Description Field */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none h-32" {...field} />
                            </FormControl>
                            <FormDescription>
                                Optional description of the event
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Optional Link Field */}
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                                <Input type="url" placeholder="https://example.com/event-details" {...field} />
                            </FormControl>
                            <FormDescription>
                                Optional Link for the event
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Toggle for Active Status */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Active</FormLabel>
                            </div>
                            <FormDescription>
                                Inactive events will not be visible for users to book
                            </FormDescription>
                        </FormItem>
                    )}
                />

                {/* Buttons section: Delete, Cancel, Save */}
                <div className="flex gap-2 justify-end">
                    {/* Delete Button (only shows if editing existing event) */}
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="cursor-pointer hover:scale-105 hover:bg-red-700"
                                    variant="destructive"
                                    disabled={isDeletePending || form.formState.isSubmitting}
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        this event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-700 cursor-pointer"
                                        disabled={isDeletePending || form.formState.isSubmitting}
                                        onClick={() => {
                                            // Start a React transition to keep the UI responsive during this async operation
                                            startDeleteTransition(async () => {
                                                try {
                                                    // Attempt to delete the event by its ID
                                                    await deleteEvent(event.id)
                                                    router.push('/events')
                                                } catch (error: any) {
                                                    // If something goes wrong, show an error at the root level of the form
                                                    form.setError("root", {
                                                        message: `There was an error deleting your event: ${error.message}`,
                                                    })
                                                }
                                            })
                                        }}


                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {/*Failing Request Dialog Section*/}
                    <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Error</AlertDialogTitle>
                                <AlertDialogDescription>
                                    There was an error saving your event. Please try again.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>
                                    Close
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Cancel Button - redirects to events list */}
                    <Button
                        disabled={isDeletePending || form.formState.isSubmitting}
                        type="button"
                        asChild
                        variant="outline"
                    >
                        <Link href="/events">Cancel</Link>
                    </Button>

                    {/* Save Button - submits the form */}
                    <Button
                        className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600"
                        disabled={isDeletePending || form.formState.isSubmitting}
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )

}