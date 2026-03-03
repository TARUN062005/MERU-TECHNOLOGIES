# FinDash - Invoice Details Module

A complete, production-ready Full-Stack Invoice Management Application rebuilt securely from scratch without any mock values, inline data, templates, or third-party CSS libraries. 

## 🛠️ Technology Stack
- **Frontend**: React + Vite + Custom CSS + React Router DOM + Axios
- **Backend**: Node.js + Express + MongoDB + Mongoose 

---

## 🔥 Application Features
- **Live Preview Dashboarding**: Full Split-Screen view during Invoice Initialization updating precisely in real-time as state data updates locally.
- **Strict No Overpayments Backend Validator**: Rejects arbitrary values over `BalanceDue` via the backend services, calculating lines efficiently dynamically.
- **Status Autosyncs**: Auto-tags the Invoice Status as `PAID` once the specific payload targets compute exactly a zero `BalanceDue`.
- **Global Toast Notification Context**: Alerts user visually across the architecture successfully across validations, insertions, edits, or archives synchronously.
- **REST APIs Complete Isolation**: Database abstractions strictly limited internally within the `invoiceService` class layers decoupled cleanly from explicit route mapping `invoiceRoutes`.  

---

## 🚀 Setup & Execution 

1. **Configure Environment**
Ensure you have MongoDB running natively. Inside `invoice-app/backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/invoice-app
```

2. **Run Backend Node Server**
```bash
cd invoice-app/backend
npm install
npm run dev
```

3. **Run Frontend Vite Client**
```bash
cd invoice-app/frontend
npm install
npm run dev
```
Navigate your browser to: `http://localhost:3000`

---

## 📖 API Documentation Summary

The backend uses RESTful standards exposing pure business models safely.
- `POST /api/invoices` - Bootstraps an initial invoice including its default array lines natively. 
- `GET /api/invoices/:id` - Populates invoice models deep binding `lineItems` and `payments` records natively utilizing Mongo. 
- `POST /api/invoices/:id/lines` - Commits a novel `LineItem` entry specifically pushing it securely against its parent invoice constraint recalculating values automatically.
- `POST /api/invoices/:id/payments` - Deposits payment allocations updating limits globally processing exceptions smoothly. 
- `POST /api/invoices/:id/archive` & `restore` - Toggles boolean status flags safely updating UI representation correctly!
