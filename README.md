# Budget Tracker Frontend

A modern React frontend application for budget tracking that integrates with the FastAPI backend. Built with React 18, TypeScript, Tailwind CSS, and React Query for optimal performance and user experience.

## Features

- **Authentication System**: JWT-based authentication with automatic token refresh
- **Dashboard**: Financial overview with real-time stats and charts
- **Transaction Management**: Add, edit, and categorize transactions
- **Budget Planning**: Create and track budgets with progress visualization
- **Category Management**: Organize transactions with custom categories
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Visualization**: Interactive charts and graphs for financial insights
- **Real-time Updates**: Optimistic updates for better user experience

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Performant forms with easy validation
- **Zod** - Schema validation
- **Axios** - HTTP client with interceptors
- **Chart.js** - Data visualization
- **Lucide React** - Beautiful SVG icons

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Budget Tracker Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   ```
   
   Update the environment variables in `.env.development`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_NAME=Budget Tracker
   VITE_APP_VERSION=1.0.0
   VITE_DEV_MODE=true
   ```

## Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

3. **API Integration**
   Make sure the FastAPI backend is running on `http://localhost:8000` (or update the `VITE_API_BASE_URL` in your environment file)

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── forms/          # Form components
│   └── layout/         # Layout components (Navbar, Layout, etc.)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API integration services
├── contexts/           # React contexts (Auth, etc.)
├── utils/              # Utility functions and constants
├── types/              # TypeScript type definitions
└── styles/             # CSS and styling files
```

## Key Components

### Authentication
- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Route protection for authenticated users
- **LoginForm/RegisterForm**: Authentication forms with validation

### API Integration
- **apiClient**: Axios instance with request/response interceptors
- **Service files**: Organized API calls by domain (auth, transactions, etc.)
- **Automatic token refresh**: Seamless token renewal without user interruption

### UI Components
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Accessible components**: ARIA labels and keyboard navigation
- **Loading states**: Skeleton screens and loading indicators
- **Error handling**: User-friendly error messages and recovery

### Data Visualization
- **Dashboard charts**: Income/expense trends and category breakdowns
- **Budget progress**: Visual progress bars and alerts
- **Real-time updates**: Optimistic UI updates for better UX

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_APP_NAME` | Application name | `Budget Tracker` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_DEV_MODE` | Development mode flag | `true` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## API Integration

The frontend integrates with the FastAPI backend through these endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Transactions
- `GET /transactions/` - List transactions
- `POST /transactions/` - Create transaction
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction

### Categories
- `GET /categories/` - List categories
- `POST /categories/` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

### Budgets
- `GET /budgets/` - List budgets
- `POST /budgets/` - Create budget
- `PUT /budgets/{id}` - Update budget
- `DELETE /budgets/{id}` - Delete budget
- `GET /budgets/progress` - Get budget progress

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Seamless session renewal
- **Protected Routes**: Route-level authentication guards
- **CSRF Protection**: Request validation
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages

## Performance Optimizations

- **Code Splitting**: Lazy loading of routes and components
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: API response caching and optimistic updates
- **Image Optimization**: Responsive images and lazy loading
- **Memoization**: React.memo and useMemo for expensive operations

## Accessibility

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Meaningful HTML structure

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **ES2020 Support**: Modern JavaScript features

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if backend is running
   - Verify `VITE_API_BASE_URL` is correct
   - Check CORS settings in backend

2. **Authentication Problems**
   - Clear localStorage and cookies
   - Check token expiration
   - Verify backend auth endpoints

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Development Tools

- **React Developer Tools**: Browser extension for React debugging
- **Redux DevTools**: State management debugging
- **Network Tab**: Monitor API requests
- **Console Logs**: Check for JavaScript errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the API documentation