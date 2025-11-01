# tRPC Drizzle Blog

Welcome to **tRPC Drizzle Blog**! 📝 This is a full-stack blog application built using **Next.js**, **tRPC**, **Drizzle ORM**, and **SQLite**. The application leverages the **tRPC** framework to simplify API communication, **Drizzle ORM** for database management, and **SQLite** as the relational database to store blog data.

## 🚀 Features

- **tRPC API**: Communication between frontend and backend is powered by **tRPC**, providing end-to-end type safety and seamless API calls.
- **Database Management**: Using **Drizzle ORM** for efficient and easy-to-use database interactions with **SQLite**.
- **Fast Development**: Built on **Next.js** for a modern, fast, and scalable web app experience.
- **TailwindCSS**: Beautiful, responsive design with **TailwindCSS**, making it easy to style and customize the application.
- **Type Safety**: Full type safety with **TypeScript** and **Zod** for runtime validation.
- **React Query**: Manage server state and caching with **React Query** for a seamless and optimized user experience.

## 🛠️ Technologies Used

- **Next.js**: React framework for server-side rendering and API routes.
- **tRPC**: End-to-end typesafe API calls from the frontend to the backend.
- **Drizzle ORM**: Type-safe ORM for interacting with SQLite databases.
- **SQLite**: Lightweight and fast relational database for storing blog data.
- **React Query**: Data fetching, caching, and synchronization for better performance.
- **TailwindCSS**: Utility-first CSS framework for rapid styling.
- **Zod**: Runtime schema validation for data consistency and safety.
- **TypeScript**: Type-safe development for robust and maintainable code.

## 📂 Installation

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/trpc-drizzle.git
cd trpc-drizzle
```

Install the dependencies:

```bash
npm install
```

## 🏃‍♂️ Running the Project Locally

To start the development server, run:

```bash
npm run dev
```

Now, you can open your browser and visit [http://localhost:3000](http://localhost:3000) to see the app in action.

## ⚙️ Build and Deploy

To build the app for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 🔧 Database Setup

1. Set up your SQLite database by running Drizzle Kit migrations:

```bash
npx drizzle-kit generate
```

2. This will automatically generate the necessary tables for your application in your SQLite database.

## 💡 Features to Explore

- **Blog Management**: Easily create, edit, and view blog posts.
- **Type-safe API**: Enjoy full type safety with **tRPC** from the frontend to backend.
- **SQLite Database**: All blog posts are stored in an **SQLite** database with efficient querying via **Drizzle ORM**.
- **React Query**: Fetch blog data and manage server state seamlessly with **React Query**.

## 💌 Contact

Feel free to open an issue or reach out if you have any questions or feedback. Contributions are always welcome! 🚀
