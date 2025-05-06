
# PFCU Website

## Project Overview

The PFCU (Pentecostal Fellowship of Caritas University) website is a comprehensive platform for the fellowship's online presence, offering various functionalities for both users and administrators. This project uses React with TypeScript for the frontend and integrates with Supabase for database storage, authentication, and file hosting.

## Features

### User-Facing Features

1. **Home Page**
   - Welcoming hero section
   - About section
   - Featured events
   - Leadership profiles
   - Testimonies
   - Ministry units showcase
   - Contact information

2. **Sermons Page**
   - Audio sermon player
   - Sermon library with search functionality
   - Sermon details (preacher, date, duration)
   - Cover image display

3. **Events Page**
   - Upcoming events listing
   - Event details (date, time, location)
   - Event filtering and search
   - Featured events highlight

4. **Giving/Donations**
   - Online payment options
   - Bank transfer information
   - Donation purpose selection
   - Confirmation system

5. **Contact Page**
   - Contact form
   - Church location map
   - Contact information
   - Social media links

### Admin Features

1. **Dashboard**
   - Overview statistics
   - Recent activities

2. **Admin Users Management**
   - Create and manage admin accounts
   - Super admin privileges
   - Admin role management

3. **Donations Management**
   - View all donations
   - Filter and search donations
   - Export donation data
   - Update donation status
   - Donation statistics

4. **Sermons Management**
   - Upload sermon audio
   - Add sermon details
   - Upload sermon cover images
   - Edit and delete sermons

5. **Events Management**
   - Create events
   - Set featured events
   - Edit and delete events

## Technology Stack

### Frontend
- React (with TypeScript)
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui for UI components
- Framer Motion for animations
- React Hook Form for form handling
- Zod for form validation
- date-fns for date manipulation

### Backend (Supabase)
- PostgreSQL database
- Supabase Authentication
- Supabase Storage for file uploads
- Row Level Security policies

### Integrations
- Google Maps API for location display
- Payment gateway integration (ready for implementation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin panel components
│   ├── home/            # Homepage components
│   ├── sermons/         # Sermon page components
│   ├── events/          # Events page components
│   ├── giving/          # Donation page components
│   ├── contact/         # Contact page components
│   ├── map/             # Google Maps components
│   ├── layout/          # Layout components (header, footer, etc.)
│   └── ui/              # UI library components (from shadcn/ui)
│
├── hooks/               # Custom React hooks
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
│
├── pages/               # Main page components
│   └── admin/           # Admin pages
│
├── types/               # TypeScript type definitions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Database Tables

1. **admin_users** - Stores admin user information
2. **donations** - Records all donations
3. **events** - Stores event details
4. **leaders** - Leadership team information
5. **sermons** - Sermon records with audio and image URLs

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Environment Variables
The following environment variables need to be set:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `GOOGLE_MAPS_API_KEY`: Google Maps API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pfcu-website.git
   cd pfcu-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables.

4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

This project can be deployed to any static site hosting service like Vercel, Netlify, or GitHub Pages.

### Build for Production
```
npm run build
```

The build output will be in the `dist` directory.

## Best Practices

1. **Component Creation**
   - Create small, focused components
   - Follow the single responsibility principle
   - Use TypeScript for type safety

2. **State Management**
   - Use React hooks for local state
   - Implement custom hooks for shared logic
   - Use context API for global state when needed

3. **Error Handling**
   - Implement error boundaries
   - Provide user-friendly error messages
   - Log errors for debugging

4. **Responsive Design**
   - Use Tailwind CSS responsive classes
   - Test on various device sizes
   - Ensure accessibility compliance

5. **Security**
   - Implement proper authentication
   - Use Row Level Security in Supabase
   - Sanitize user inputs

## Troubleshooting

### Common Issues:

1. **Google Maps API Issues**
   - Ensure the API key has the correct permissions
   - Check for browser console errors
   - Verify the API is enabled in the Google Cloud Console

2. **Supabase Connection Issues**
   - Confirm environment variables are correct
   - Check for network connectivity issues
   - Verify Supabase service status

3. **File Upload Issues**
   - Check storage bucket permissions
   - Verify file size limits
   - Ensure proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Maps Platform](https://developers.google.com/maps)
