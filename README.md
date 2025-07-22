# Restaurant POS System

This project is a comprehensive Point of Sale (POS) system designed for restaurants, offering robust backend management for various operations and a modern frontend interface for seamless user interaction. It includes features for managing products, orders, inventory, kitchen operations (KOT), floor and table bookings, and user roles.

## Features

### Backend
* **User & Role Management**: Secure authentication and authorization with distinct roles like Admin and Manager.
* **Product Management**: CRUD operations for products, categories, subcategories, and ingredients.
* **Order Processing**: Create, update, and manage customer orders, including order products, discounts, and VAT calculation.
* **Payment Management**: Handle various payment methods and track payment statuses.
* **Inventory Control**: Manage items, item categories, units, suppliers, purchase invoices, and waste.
* **Kitchen Order Ticket (KOT) System**:
    * Automatic generation of KOTs upon order creation/update.
    * Ability for a single order to be split into multiple KOTs for different kitchens.
    * Real-time cooking status tracking for each KOT.
    * Tracking of expected and actual completion times for KOTs.
* **Floor & Table Management**: Define floors and manage individual tables, including booking status.
* **Outlet Management**: Manage multiple restaurant outlets.
* **Background Tasks**: Utilizes Celery for asynchronous operations, such as releasing expired table bookings.

### Frontend
* **Interactive POS Interface**: A user-friendly interface for quick order taking and processing.
* **Dashboard & Analytics**: Visualizations for key business metrics and performance tracking/analytics/page.tsx, uploaded:imranbappy/restaurant-pos/restaurant-pos-480e1145b2277a4502df6b7af1183c6be749c262/POS/components/Chart/Area.tsx, uploaded:imranbappy/restaurant-pos/restaurant-pos-480e1145b2277a4502df6b7af1183c6be749c262/POS/components/Chart/Bar.tsx, uploaded:imranbappy/restaurant-pos/restaurant-pos-480e1145b2277a4502df6b7af1183c6be749c262/POS/components/Chart/Pie.tsx].
* **Table Booking View**: Visual representation of floor plans and table availability.
* **Product & Category Browse**: Easy navigation through menu items.
* **Order History & Details**: View past orders and their detailed information.

## Technologies Used

### Backend (`pos-backend`)
* **Framework**: Django
* **API**: Graphene-Django (GraphQL)
* **Database**: PostgreSQL (recommended, based on common Django setups)
* **Asynchronous Tasks**: Celery
* **Language**: Python

### Frontend (`POS`)
* **Framework**: Next.js
* **Library**: React
* **Language**: TypeScript
* **State Management**: Zustand
* **GraphQL Client**: Apollo Client
* **Styling**: Tailwind CSS, Shadcn UI

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

* Python 3.8+
* Node.js 18+ & npm/yarn
* PostgreSQL (or another database supported by Django)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd pos-backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the `pos-backend` directory and add your environment variables. Example:
    ```
    DJANGO_SECRET_KEY='your_secret_key'
    DEBUG=True
    DATABASE_URL='postgres://user:password@host:port/database_name'
    CELERY_BROKER_URL='redis://localhost:6379/0'
    CELERY_RESULT_BACKEND='redis://localhost:6379/0'
    ```
    *Make sure to replace placeholders with your actual database credentials and a strong Django secret key.*
5.  **Run database migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
    *(If you've just applied the KOT changes, ensure you also run `python manage.py makemigrations kitchen` and `python manage.py migrate kitchen`)*
6.  **Create a superuser (for admin access):**
    ```bash
    python manage.py createsuperuser
    ```
7.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://localhost:8000/graphql`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd POS
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the `POS` directory. Example:
    ```
    NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:8000/graphql/
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```
4.  **Run the Next.js development server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend application will be available at `http://localhost:3000`.

### Running Celery (for background tasks like KOT/Table Booking updates)

For background tasks like automatically releasing expired table bookings, you'll need to run Celery workers.

1.  **Ensure Redis is installed and running.**
2.  **From the `pos-backend` directory, start the Celery worker:**
    ```bash
    celery -A backend worker -l info
    ```

## Usage

Once both the backend and frontend servers are running:
1.  Access the frontend application in your web browser at `http://localhost:3000`.
2.  Log in using the superuser credentials you created or other user accounts.
3.  Explore the various sections of the POS system to manage products, orders, inventory, and more.
4.  Kitchen staff can track KOTs status, and customers can potentially see real-time order status updates (once the frontend is integrated with KOT status queries).

## Contributing

(Add details on how to contribute if this is an open-source project)

## License

(Add license information)