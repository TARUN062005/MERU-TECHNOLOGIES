# FinDash Invoice Dashboard

A modern, responsive, full-stack Invoice Details Module designed for SaaS, featuring Node.js, Express, MongoDB on the backend, and React/Vite on the frontend. No UI libraries (like Bootstrap/Tailwind) were used; it contains purely custom CSS optimized for mobile-first views and SaaS aesthetics.

## Features
- **Mobile-first responsive UI**: Tables convert into stacked cards on mobile devices.
- **"Fintech" Dashboard Aesthetics**: Clean, professional layout using custom CSS variables securely mapped to standard SaaS colors and grids.
- **Reusable UI Components**: Modular architecture promoting cleaner code (Buttons, Badges, Modals, Sections).
- **Add Payments**: Dynamically update `BalanceDue` and `AmountPaid`. Real-time validation preventing overpayments and auto-status resolution when fully paid.
- **Architecture**: Separated Frontend/Backend logic without any inline styles or console.logs. 

---

## Setup & Installation Instructions

### Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd invoice-app/backend
   ```
2. Install the necessary dependencies (Express, Mongoose, dotenv, cors):
   ```bash
   npm install
   ```
3. Ensure you have MongoDB running locally, or modify `MONGO_URI` in `.env`.
4. Run the development server (uses nodemon):
   ```bash
   npm run dev
   ```
   *The backend will be live on `http://localhost:5000`.*

### Frontend Setup

1. Open a new terminal tab/window and navigate to the `frontend` directory:
   ```bash
   cd invoice-app/frontend
   ```
2. Install the standard dependencies (React, React-Router-DOM, Axios, Date-fns, Vite):
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend will be live on `http://localhost:3000`.*

### Environment Variables

An `.env` file is generated inside the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/invoice-app
```

---

## API Documentation Summary

1. `GET /api/invoices/:id` 
   - **Description**: Returns deep invoice details, fetching associated line items and previous payments.
2. `POST /api/invoices/:id/payments` 
   - **Description**: Record a new payment linked to the invoice, ensuring no overpayments, reducing the balance, and updating the status to 'PAID' if `balanceDue` hits 0.
3. `POST /api/invoices/archive` 
   - **Description**: Marks the invoice's `isArchived` flag as true.
4. `POST /api/invoices/restore` 
   - **Description**: Unarchives a previously archived invoice.

---

## Project Structure Explanation

```
invoice-app/
  ├── backend/
  │   ├── src/
  │   │   ├── config/          # Configurations (e.g., db connection)
  │   │   ├── controllers/     # Route logic endpoints abstraction
  │   │   ├── models/          # Mongoose Schemas (Invoice, InvoiceLine, Payment)
  │   │   ├── routes/          # Express Routers mappings
  │   │   ├── services/        # Thick business logic (payment validation, aggregation)
  │   │   ├── app.js           # Express App configuration
  │   │   └── server.js        # Executable entry point
  │   └── package.json
  │
  ├── frontend/
  │   ├── src/
  │   │   ├── api/             # Centralized Axios interface requests
  │   │   ├── components/      # Isolated modular React UI logic
  │   │   │   ├── common/      # Reusable UI (Buttons, Card, Modal, Tokens)
  │   │   │   ├── invoice/     # Domain-specific modules (Header, Lines, Totals)
  │   │   │   └── payment/     # Payment rendering lists and add modal overlays
  │   │   ├── hooks/           # Encapsulated state lifecycle (e.g., useInvoices)
  │   │   ├── pages/           # High-Level Route components (e.g., InvoiceDetail views)
  │   │   ├── styles/          # Vanilla Custom CSS for scaling aesthetics
  │   │   ├── App.jsx          # Route mapping
  │   │   └── main.jsx         # React application execution point
  │   └── package.json
  │
  └── README.md
```

## Seeding MongoDB Data Template (Testing)
You can directly insert an entity into your MongoDB to visualize the UI. Replace the ID in the frontend URL (`localhost:3000/invoices/YOUR_OBJECT_ID`) with your newly created ID.

```json
{
  "invoiceNumber": "INV-10250",
  "customerName": "Stark Industries",
  "issueDate": "2026-03-01T00:00:00Z",
  "dueDate": "2026-04-01T00:00:00Z",
  "status": "DRAFT",
  "total": 5500,
  "amountPaid": 0,
  "balanceDue": 5500,
  "isArchived": false
}
```
Create a matching line item pointing to the newly generated `_id` above as `invoiceId` on the `InvoiceLine` model to see lines rendered on the UI dashboard.
