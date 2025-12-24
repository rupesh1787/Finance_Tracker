# Finance Tracker

A full-stack finance tracking application built with React, TypeScript, Node.js, and PostgreSQL. Track your income and expenses with an intuitive dashboard, charts, and transaction management.

## Features

- 📊 Dashboard with financial overview
- 💰 Transaction management (income and expenses)
- 📈 Expense charts and analytics
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 🔄 Real-time updates with React Query
- 🗄️ PostgreSQL database with Drizzle ORM
- 🚀 Deployable on Vercel (frontend) and Render (backend)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- React Query (TanStack Query)
- Wouter (lightweight routing)

### Backend
- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- CORS

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rupesh1787/Finance_Tracker.git
cd Finance_Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Create a PostgreSQL database
   - Update the database connection in `drizzle.config.ts` and `server/db.ts`

4. Push the database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the frontend configuration
3. The `vercel.json` file is already configured for proper routing
4. Deploy the frontend

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configurations:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `DATABASE_URL=your_postgresql_connection_string`
4. Add your PostgreSQL database URL as an environment variable
5. Deploy the backend

### Database Setup for Production

For production, you'll need a PostgreSQL database. You can use:
- Render PostgreSQL
- Supabase
- PlanetScale
- AWS RDS
- Any other PostgreSQL provider

Update the `DATABASE_URL` environment variable with your production database connection string.

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # Application entry point
├── server/                 # Backend Node.js application
│   ├── data/              # Sample data
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database configuration
│   └── ...
├── shared/                 # Shared types and schemas
├── script/                 # Build scripts
└── package.json           # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you have any questions or issues, please open an issue on GitHub.