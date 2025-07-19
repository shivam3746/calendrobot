'use client'

import Loading from "@/components/Loading"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function PublicPage() {
  const { user, isLoaded } = useUser()  // Using `isLoaded` to check if user data is available

  if (!isLoaded) {
    // Display loading until user data is loaded
    return <Loading />
  }

  if (!user) {
    // Redirect to login if no user is found
    return redirect('/login')
  }

  // Once user is available, redirect to the booking page [Public Profile Page]
  return redirect(`/book/${user.id}`)
}