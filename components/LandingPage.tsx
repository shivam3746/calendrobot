'use client'   //Mark this file as a client component
import { SignIn } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';
import Image from 'next/image';

export default function LandingPage() { 
    return(
        <main className="flex items-center p-20 gap-24 animate-fade-in max-md:flex-col">
            <section className="flex flex-col items-center">
                <Image
                    src="/assets/logo.svg"
                    width={300}
                    height={300}
                    alt="Logo"
                />

                {/* The main heading of the landing page */}   
                <h1 className="text-2xl font-black lg:text-3xl">
                    Welcome to Calendrobot
                </h1>

                {/* The subheading of the landing page */}
                <p className="font-extralight">
                    The only calendar app you'll ever need. 
                </p>

                {/* The image below the main heading */}
                <Image
                    src="/assets/planning.svg"
                    width={500}
                    height={500}
                    alt="Landing Page Image"
                 />

            </section>

            {/* Clerk Sign In and Sign Up components with custom theme */}
            <div className="mt-3">
                <SignIn
                   routing='hash' //Keeps sign in within the same page
                   appearance={{
                    baseTheme: neobrutalism, //Sets the theme to neobrutalism for SignIn Component
                   }}

                />

            </div>
            
        </main>
    )
}