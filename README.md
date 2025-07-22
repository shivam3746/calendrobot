# 📅 Calendrobot – Your AI-Powered Calendar Assistant 🤖

> The only calendar app you’ll ever need.

Calendrobot is a modern, AI-enhanced calendar application built to streamline event creation and scheduling. Whether you’re organizing meetings, webinars, or community events, Calendrobot does the heavy lifting — just paste a link, and let the bot do the rest.

---

## 🚀 Vision

Calendrobot aims to **redefine how events are added to calendars**. No more manual form filling or repetitive copying and pasting. Just share an event link, and Calendrobot will intelligently:

- 🧠 Parse the link for relevant details using web scraping (via [Firecrawl](https://www.firecrawl.dev/))
- ✍️ Generate a rich, human-readable description using LLMs (via Hugging Face inference APIs)
- 🗂️ Automatically categorize your event

We believe in making **calendar management effortless**, intelligent, and delightful.

---

## ✨ Key Features

- 🔗 **Link-Based Event Creation**  
  Paste any event link (e.g., from [Eventbrite](https://www.eventbrite.com/)), and Calendrobot will fetch and format event details automatically.

- 🧠 **AI-Generated Descriptions**  
  LLMs generate natural language descriptions based on scraped data from the link.

- 🏷️ **Auto Categorization**  
  Events are intelligently categorized (e.g., Meeting, Webinar, Interview, Sales Call, etc.).

- 👥 **Clerk Authentication**  
  Secure sign-in and session management using [Clerk](https://clerk.dev/).

- 🌐 **Modern Frontend with Next.js**  
  Beautiful, responsive UI powered by [Next.js](https://nextjs.org/) and deployed on [Vercel](https://vercel.com/).

- 🗄️ **Serverless Backend**  
  Built on [NEON](https://neon.tech/) (PostgreSQL serverless) and using [Drizzle ORM](https://orm.drizzle.team/).

---

## 🧪 Tested With

- ✅ Eventbrite public event links
- ✅ Works with standard metadata-rich URLs

---

## 🛠️ Features in Progress

- 🥇 **Event Prioritization**  
  Handle conflicts and assign priority to events scheduled at the same time.

- 📹 **Zoom / Google Meet / MS Teams Integration**  
  Detect and embed video conferencing links for virtual events.

- 📬 **Mailer Notifications**  
  Automatic email reminders before an event starts.

---

## 📸 Screenshots

> _Coming soon..._

---

## 📦 Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | Next.js (TypeScript)           |
| Styling     | Tailwind CSS                   |
| Auth        | Clerk.dev                      |
| Backend     | Serverless PostgreSQL (NEON)   |
| ORM         | Drizzle ORM                    |
| AI          | Firecrawl + Hugging Face APIs  |
| Hosting     | Vercel                         |

---

## 🧑‍💻 Getting Started (Local Development)

> _Want to contribute or run locally?_

1. Clone the repo:
   ```bash
   git clone https://github.com/shivam3746/calendrobot.git
   cd calendrobot

   npm install

   npm run dev
   ```
