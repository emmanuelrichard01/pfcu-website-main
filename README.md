
# PFCU - Pentecostal Fellowship of Caritas University

![PFCU Logo](public/lovable-uploads/33b8fdb0-4798-480e-ab47-40a91d170deb.png)

## Project Overview

PFCU (Pentecostal Fellowship of Caritas University) is a comprehensive web application designed to serve the digital needs of the Pentecostal Fellowship at Caritas University. This platform provides information about the fellowship, its leadership, upcoming events, ministry units, and resources like sermons while also offering administrative capabilities for content management.

## Features

### Public Features

- **Homepage**: Overview of the fellowship with sections for about, units, leadership, events, testimonies, and contact information
- **About Pages**: Detailed information about the fellowship, its history, leadership structure, and alumni
- **Units Page**: Showcase of the 16 specialized ministry units with detailed descriptions
- **Events Page**: Calendar of upcoming events with filtering capabilities and detailed event pages
- **Sermons Archive**: Collection of sermons with audio player functionality
- **Contact Page**: Contact information and interactive Google Map showing the fellowship's location
- **Giving Page**: Options for online donations and bank transfers

### Admin Features

- **Secure Admin Dashboard**: Role-based access control with super admin capabilities
- **Content Management**: Tools for managing sermons, events, and leadership information
- **Donation Tracking**: System to monitor and manage donations
- **User Management**: Tools for managing admin users with different permission levels

## Technology Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Maps Integration**: Google Maps API
- **Data Visualization**: Recharts

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── contact/        # Contact page components
│   ├── events/         # Event-related components
│   ├── giving/         # Donation-related components
│   ├── home/           # Homepage sections
│   ├── layout/         # Layout components like Navbar, Footer
│   ├── map/            # Map-related components
│   ├── sermons/        # Sermon-related components
│   ├── ui/             # shadcn/ui components
│   └── units/          # Ministry units components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
├── lib/                # Utility functions and helpers
├── pages/              # Page components
│   ├── about/          # About-related pages
│   └── admin/          # Admin dashboard pages
├── services/           # API service functions
└── types/              # TypeScript type definitions
```

## Key Components

### Public Interface

- **MainLayout**: Consistent layout with navigation and footer for public-facing pages
- **Hero**: Dynamic homepage hero section with background animation
- **AboutSection**: Information about the fellowship's mission and values
- **UnitsSection**: Showcase of the different ministry units
- **LeadershipSection**: Display of the current leadership team
- **EventsSection**: Upcoming events highlight
- **ContactSection**: Contact information and form

### Admin Interface

- **AdminLayout**: Dashboard layout for administrative functions
- **ProtectedRoute**: Authentication and authorization wrapper
- **AdminUserManagement**: Tools for managing admin users and permissions
- **AdminSermons**: Interface for managing sermon content
- **AdminEvents**: Interface for managing events
- **AdminLeadership**: Interface for managing leadership information
- **AdminDonations**: Interface for tracking and managing donations

## Database Tables

The application uses the following main tables in Supabase:

- **admin_users**: Stores admin user information and permissions
- **leaders**: Stores leadership team information
- **events**: Stores events information
- **sermons**: Stores sermon resources
- **donations**: Tracks donation information

## Authentication and Authorization

The application uses Supabase Authentication for secure login and implements role-based access control:

- **Public Access**: Anonymous access to public-facing pages
- **Admin Access**: Restricted access to admin functions
- **Super Admin**: Special privileges for user management

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (for backend functionality)

### Local Development

```sh
# Clone the repository
git clone <REPOSITORY_URL>

# Navigate to the project directory
cd pfcu-website

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Configuration

The project uses Supabase for backend functionality. Ensure you have the following environment variables set up in Supabase secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

### Deployment

This project is configured for deployment through Lovable. You can deploy it by:

1. Opening the [Lovable Project](https://lovable.dev/projects/fdc86b2f-ccc7-415b-9b7e-3dcb7574bc3c)
2. Clicking on Share -> Publish

## Custom Domain Setup

To connect a custom domain to your deployed application:

1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain" and follow the instructions
3. Update DNS settings at your domain provider as directed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the terms of the MIT license.

## Contact

For questions or support regarding this application, please contact the PFCU technology team.

---

Built with [Lovable](https://lovable.dev)
