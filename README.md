# 🎁 Gifters Frontend

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-yellow)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Gifters is an open-source application that helps you manage your gift ideas and events with friends and family.

## ✨ Features

- 📋 Create and manage wishlists
- 👪 Organize groups for special occasions
- 🎂 Track birthdays and events
- 💝 Discover and reserve gift ideas for your loved ones
- 🔐 User authentication and authorization
- 🌐 Internationalization (i18n) support for multiple languages
- 📱 Responsive design for mobile and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn or pnpm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BastienPailloux/gifters-frontend.git
   cd gifters-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file and set your API endpoint:
   ```bash
   VITE_API_URL=http://localhost:3000/api/v1
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at http://localhost:5173.

### Testing

Run the test suite:

```bash
npm run test
# or
yarn test
# or
pnpm test
```

### Building for Production

Build the app for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The build output will be in the `dist` directory.

## 🧩 Project Structure

```
frontend/
├── public/            # Static assets and localization files
│   └── locales/       # Translation files (i18next)
│       ├── en/        # English translations
│       └── fr/        # French translations
├── src/               # Source code
│   ├── components/    # React components
│   │   ├── common/    # Shared/common components
│   │   └── layout/    # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── .env.example       # Example environment variables
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## 🛠️ Technologies

- **React**: UI library
- **TypeScript**: Type checking
- **Vite**: Build tool and development server
- **React Router**: Navigation and routing
- **i18next**: Internationalization
- **Axios**: HTTP client
- **Jest & Testing Library**: Testing
- **ESLint & Prettier**: Code quality and formatting

## 🤝 Contributing

We welcome contributions to Gifters! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure to update tests as appropriate and follow our code style.

### Code Style Guidelines

- Follow the ESLint configuration
- Write meaningful commit messages
- Document new components and functions
- Write tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)

## 📞 Contact

For any questions or suggestions, please open an issue on GitHub or contact the maintainers directly.
