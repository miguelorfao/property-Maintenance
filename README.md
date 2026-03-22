# Maintenance Management App

A React-based application for managing maintenance of holiday flats and shops. Built with modern web technologies for optimal performance and user experience.

## Features

- **Property Management**: Add, view, and delete holiday flats and shops
- **Issue Tracking**: Report and track maintenance issues with status updates
- **Dashboard**: Overview of properties and issues with statistics
- **Firebase Integration**: Cloud-based data persistence with offline fallbacks
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Modern Build**: Powered by Vite for fast development and builds

## Tech Stack

- **Frontend**: React 19 with hooks
- **UI Library**: Material-UI (MUI) components
- **Build Tool**: Vite 5
- **Database**: Firebase Firestore
- **Testing**: Jest
- **Styling**: Material-UI theme system

## Getting Started

### Prerequisites

- Node.js 20.10 or higher
- npm or yarn
- Firebase project (for data persistence)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/miguelorfao/property-Maintenance.git
cd property-Maintenance
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (optional):
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore database
   - Copy your Firebase config to `src/firebase.js`

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5176`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard with statistics
│   ├── PropertyList.jsx       # List of properties with delete functionality
│   ├── IssueList.jsx          # List of issues with status updates
│   ├── AddPropertyForm.jsx    # Form to add new properties
│   └── AddIssueForm.jsx       # Form to report new issues
├── App.jsx                    # Main application component
├── firebase.js                # Firebase configuration
└── index.jsx                  # Application entry point
```

## Deployment

The app can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

To build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.(https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
