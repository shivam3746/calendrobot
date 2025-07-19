'use server' // Marks this file as a Server Action - required for Next.js App Router

import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";


// This function creates a new event in the database after validating the input data.
export async function createEvent(
    unsafeData: z.infer<typeof eventFormSchema> // Accepts raw event data validated by the zod schema
  ): Promise<void> {
    try {
      // Authenticate the user using Clerk
      const { userId } = await auth()
  
      // Validate the incoming data against the event form schema
      const { success, data } = eventFormSchema.safeParse(unsafeData)
  
      // If validation fails or the user is not authenticated, throw an error
      if (!success || !userId) {
        throw new Error("Invalid event data or user not authenticated.")
      }
  
      // Insert the validated event data into the database, linking it to the authenticated user
      await db.insert(EventTable).values({ ...data, clerkUserId: userId })
     
      
    } catch (error: any) {
      // If any error occurs during the process, throw a new error with a readable message
      throw new Error(`Failed to create event: ${error.message || error}`)
    } finally {
      
       // Revalidate the '/events' path to ensure the page fetches fresh data after the database operation
       revalidatePath('/events')

    }
  }

   // This function updates an existing event in the database after validating the input and checking ownership.
export async function updateEvent(
    id: string, // ID of the event to update
    unsafeData: z.infer<typeof eventFormSchema> // Raw event data to validate and update
  ): Promise<void> {
    try {
      // Authenticate the user
      const { userId } = await auth()
  
      // Validate the incoming data against the event form schema
      const { success, data } = eventFormSchema.safeParse(unsafeData)
  
      // If validation fails or the user is not authenticated, throw an error
      if (!success || !userId) {
        throw new Error("Invalid event data or user not authenticated.")
      }
  
      // Attempt to update the event in the database
      const { rowCount } = await db
        .update(EventTable)
        .set({ ...data }) // Update with validated data
        .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId))) // Ensure user owns the event
  
      // If no event was updated (either not found or not owned by the user), throw an error
      if (rowCount === 0) {
        throw new Error("Event not found or user not authorized to update this event.")
      }
  
    } catch (error: any) {
      // If any error occurs, throw a new error with a readable message
      throw new Error(`Failed to update event: ${error.message || error}`)
    } finally {
      // Revalidate the '/events' path to ensure the page fetches fresh data after the database operation
      revalidatePath('/events')
    }


  } 
  
  
    // This function deletes an existing event from the database after checking user ownership. 
    export async function deleteEvent(
      id: string // ID of the event to delete
    ): Promise<void> {
      try {
        // Authenticate the user
        const { userId } = await auth()
    
        // Throw an error if no authenticated user
        if (!userId) {
          throw new Error("User not authenticated.")
        }
    
        // Attempt to delete the event only if it belongs to the authenticated user
        const { rowCount } = await db
          .delete(EventTable)
          .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)))
    
        // If no event was deleted (either not found or not owned by user), throw an error
        if (rowCount === 0) {
          throw new Error("Event not found or user not authorized to delete this event.")
        }
    
      } catch (error: any) {
        // If any error occurs, throw a new error with a readable message
        throw new Error(`Failed to delete event: ${error.message || error}`)
      } finally {
        // Revalidate the '/events' path to ensure the page fetches fresh data after the database operation
        revalidatePath('/events')
      }
    }

  // Infer the type of a row from the EventTable schema
  type EventRow = typeof EventTable.$inferSelect

// Async function to fetch all events (active and inactive) for a specific user
export async function getEvents(clerkUserId: string): Promise<EventRow[]> {
  // Query the database for events where the clerkUserId matches
  const events = await db.query.EventTable.findMany({
    //where: — This defines a filter (a WHERE clause) for your query.

    // ({ clerkUserId: userIdCol }, { eq }) => ... — This is a destructured function:

    // clerkUserId is a variable (likely passed in earlier to the query).

    // userIdCol is a reference to a column in your database (you're just renaming clerkUserId to userIdCol for clarity).
    where: ({ clerkUserId: userIdCol }, { eq }) => eq(userIdCol, clerkUserId),

    // Events are ordered alphabetically (case-insensitive) by name
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

    // Return the full list of events
    return events

}

// Fetch a specific event for a given user
export async function getEvent(userId: string, eventId: string): Promise<EventRow | undefined> {
  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)), // Make sure the event belongs to the user
  })

  return event ?? undefined // Explicitly return undefined if not found
}


// Define a new type for public events, which are always active
// It removes the generic 'isActive' field and replaces it with a literal true
export type PublicEvent = Omit<EventRow, "isActive"> & { isActive: true }
// “This version of an event is guaranteed to be active — no maybe, no false.”


// Async function to fetch all active (public) events for a specific user
export async function getPublicEvents(clerkUserId: string): Promise<PublicEvent[]> {
  // Query the database for events where:
  // - the clerkUserId matches
  // - the event is marked as active
  // Events are ordered alphabetically (case-insensitive) by name
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  // Cast the result to the PublicEvent[] type to indicate all are active
  return events as PublicEvent[]
}