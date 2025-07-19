import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default async function HomePage() {

  const user = await currentUser();
 
  // Case 1: User is not logged in, redirect to the landing page
  if(!user) return <LandingPage />;

  // Case 2: User is logged in, redirect to the events page
  return redirect("/events");

}
