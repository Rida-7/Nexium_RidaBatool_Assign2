Sure! Here's the full **`README.md`** content packaged and ready for you to copy and paste into a file:

---

### 📄 `README.md`

```md
# 📚 Blog Summariser with Urdu Translation

This is a full-stack web application that extracts content from a given blog URL, generates a concise English summary using static logic, translates it into Urdu, and stores both in Supabase and MongoDB.

---

## 🚀 Features

- ✨ Enter any blog/article URL
- 📄 Generates an **English summary** using frequency-based static summarization
- 🌐 Provides an **Urdu translation** using a custom dictionary
- 📦 Stores:
  - English summary in **Supabase**
  - Full blog content in **MongoDB**
- ⚡ Clean, responsive UI built with **Next.js 15 + Tailwind + ShadCN UI**

---

## 🛠️ Tech Stack

| Layer      | Stack                         |
|------------|-------------------------------|
| Frontend   | Next.js 15, Tailwind CSS, ShadCN UI |
| Backend    | Next.js API Routes (Edge-compatible) |
| Database   | Supabase (summary), MongoDB (full text) |
| Parsing    | jsdom + Mozilla Readability   |
| Translation | Static Urdu Dictionary (JS-based) |

---

## 📂 Project Structure

```

project-root/
├── app/                     # Next.js pages and components
│   └── api/summarise.ts     # Main API route for summarisation
├── lib/
│   └── translateUrdu.ts     # Urdu translation dictionary logic
├── components/ui/           # Reusable UI (Input, Button)
├── .env.local               # Environment variables (Supabase, Mongo)
└── README.md

````

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blog-summariser.git
cd blog-summariser
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the app locally

```bash
npm run dev
```

Visit `http://localhost:3000` to use the app.

Deployment Link: 
