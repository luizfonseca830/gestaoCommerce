# Replit.md

## Overview

This is a full-stack web application for managing a grocery store network. The application provides an admin dashboard for managing establishments, products, and offers, plus a customer-facing interface for browsing products and making purchases. It's built with React, TypeScript, Express, and uses PostgreSQL with Drizzle ORM for data management.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite middleware integration

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/               # Backend Express application
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database interface
│   └── vite.ts           # Development server setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle database schema
└── migrations/           # Database migration files
```

## Key Components

### Database Schema
- **Establishments**: Store information (name, type, address, status)
- **Categories**: Product categorization with icons and colors
- **Products**: Product details linked to establishments and categories
- **Offers**: Discount management with percentage or fixed amount discounts
- **Carts**: Shopping cart functionality with session-based tracking
- **Orders**: Order management and tracking

### API Endpoints
- Establishments CRUD operations
- Products management with establishment filtering
- Offers management with time-based activation
- Shopping cart operations
- Order processing and tracking
- Statistics dashboard data

### UI Components
- Admin dashboard with sidebar navigation
- Establishment, product, and offer management forms
- Customer shopping interface
- Real-time cart updates
- Responsive design with mobile support

## Data Flow

1. **Admin Flow**: Users manage establishments, products, and offers through the admin dashboard
2. **Customer Flow**: Customers browse products, add items to cart, and place orders
3. **Data Persistence**: All data is stored in PostgreSQL with Drizzle ORM handling queries
4. **Real-time Updates**: TanStack Query manages cache invalidation and refetching
5. **Form Validation**: Zod schemas ensure data integrity on both client and server

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development
- Run `npm run dev` to start development server
- Vite handles hot module replacement
- Express server runs with live reload

### Production Build
- `npm run build` creates optimized client bundle
- Server code is bundled with esbuild
- Static assets served from Express

### Database Management
- `npm run db:push` syncs schema changes
- Drizzle migrations handle schema evolution
- Environment variables configure database connection

## Changelog

Changelog:
- July 07, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.