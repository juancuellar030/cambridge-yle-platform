# Project Structure

## Current Structure
```
.
├── .kiro/
│   └── steering/          # AI assistant steering rules
├── .vscode/
│   └── settings.json      # VSCode configuration
```

## Recommended Project Organization

### Frontend Structure
```
src/
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   ├── assessment/       # Assessment-specific components
│   └── admin/            # Admin interface components
├── pages/                # Page-level components
├── hooks/                # Custom React hooks
├── services/             # API calls and external services
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── assets/               # Static assets (images, fonts)
└── styles/               # Global styles and themes
```

### Backend Structure
```
server/
├── controllers/          # Request handlers
├── models/               # Data models
├── routes/               # API route definitions
├── middleware/           # Custom middleware
├── services/             # Business logic
├── utils/                # Server utilities
├── config/               # Configuration files
└── tests/                # Server-side tests
```

### Additional Directories
```
docs/                     # Project documentation
tests/                    # Test files and configurations
public/                   # Static public assets
scripts/                  # Build and deployment scripts
```

## Naming Conventions
- Use kebab-case for file and folder names
- Use PascalCase for React components
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants

## File Organization Principles
- Group related functionality together
- Keep components small and focused
- Separate concerns (UI, logic, data)
- Use index files for clean imports
- Place tests near the code they test

## Special Considerations for Educational Platform
- Separate student and admin interfaces
- Organize assessment content by skill level
- Keep user data handling in dedicated modules
- Implement proper content versioning structure