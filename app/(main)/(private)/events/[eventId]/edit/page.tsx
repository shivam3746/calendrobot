import EventForm from "@/components/forms/EventForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEvent } from "@/server/actions/events"
import { auth } from "@clerk/nextjs/server"

// The default exported async function for the EditEventPage
export default async function EditEventPage({
  params,// Extracting the eventId from the URL params
}: {
  params: Promise<{ eventId: string }>
}) {
    // Get the current authenticated user and handle the redirect if the user is not logged in
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn() // If no userId, redirect to sign-in

  const { eventId } = await params
    // Fetch the event from the database using the eventId and the logged-in user's ID
  const event = await getEvent(userId, eventId)
  if(!event) return <h1>Event not found</h1>

    // Render the page with a card layout, displaying the "Edit Event" form
  return (
    <Card className="max-w-md mx-auto border-4 border-blue-100 shadow-2xl shadow-accent-foreground">
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Render the EventForm with the event details, passing the event data as props */}
        <EventForm
          event={{ ...event, description: event.description || undefined }} // If description is null, pass undefined
        />
      </CardContent>
    </Card>
  )


}