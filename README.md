# Cambridge YLE Testing Platform

A comprehensive digital platform for Cambridge Young Learners English (YLE) assessments, providing interactive testing capabilities for students, teachers, and administrators.

## Features

- **Student Portal**: Take practice tests, track progress, view results
- **Teacher Dashboard**: Manage classes, assign tests, monitor student performance
- **Admin Panel**: System management, user administration, analytics
- **Multi-level Support**: Starters, Movers, and Flyers assessments
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Testing**: Vitest
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   ├── assessment/      # Assessment-specific components
│   └── admin/           # Admin interface components
├── pages/               # Page-level components
├── hooks/               # Custom React hooks
├── services/            # API calls and external services
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── assets/              # Static assets
└── styles/              # Global styles and themes
```

## Contributing

1. Follow the established code style and naming conventions
2. Write tests for new features
3. Ensure accessibility compliance
4. Update documentation as needed

## License

This project is proprietary and confidential.