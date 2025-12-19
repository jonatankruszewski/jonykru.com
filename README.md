# Jonatan Kruszewski - Web Developer Portfolio

Welcome to my personal portfolio! I'm Jonatan Kruszewski, a senior front-end developer with a passion for building scalable and maintainable web applications. This repository contains my personal website, showcasing my work, certifications, publications, and ways to get in touch.

## 🎯 About Me

I specialize in building front-end solutions that are robust, scalable, and easy to maintain. With expertise in technologies like React, Redux, TypeScript, and scalable architectures, I focus on delivering high-quality, efficient code that keeps tech debt at bay.

I've had the privilege of working on large-scale applications, mentoring fellow developers, and helping teams optimize messy codebases. I'm committed to writing clean and performant code that scales as projects grow.

## ✨ Features

- **Multi-language Support**: Full internationalization (i18n) with support for English, Spanish, and Hebrew, including RTL (Right-to-Left) layout support
- **Dark Mode**: Seamless theme switching with system preference detection
- **Publications**: Dynamic display of articles and tutorials from Medium
- **Certifications**: Interactive certification showcase with filtering capabilities
- **Contact Form**: Integrated contact form with validation using Formspree
- **Performance Optimized**: Built with performance in mind, including Lighthouse optimizations
- **Responsive Design**: Fully responsive design that works on all devices
- **Accessibility**: WCAG-compliant components and semantic HTML

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) with strict mode
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Key Libraries

- **Form Management**: [React Hook Form](https://react-hook-form.com/) + [Formspree](https://formspree.io/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Headless UI](https://headlessui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)
- **Internationalization**: Custom i18n implementation with localStorage persistence
- **Testing**: [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/)

### Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/) (v10.8.0)
- **Linting**: [ESLint](https://eslint.org/) with Next.js and TypeScript plugins
- **Formatting**: [Prettier](https://prettier.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged)
- **Commit Linting**: [Commitlint](https://commitlint.js.org/) with custom conventional commit format
- **CI/CD**: GitHub Actions for automated deployment

## 📁 Project Structure

```
jonykru.com/
├── .github/
│   ├── workflows/          # GitHub Actions workflows
│   └── actions/           # Custom GitHub Actions
├── public/
│   ├── images/            # Static images (badges, medium thumbnails)
│   └── version.json        # Version metadata
├── scripts/               # Automation scripts
│   ├── bump-version.ts    # Version bumping utility
│   ├── generate-version.ts # Version generation
│   ├── update-credly.ts   # Credly badge fetcher
│   └── update-medium.ts   # Medium article fetcher
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── globals.css    # Global styles
│   │   └── fonts.tsx      # Font configuration
│   ├── components/        # React components
│   │   ├── Toast/         # Toast notification components
│   │   └── ...            # Other components
│   ├── context/           # React Context providers
│   │   ├── i18nContext.tsx    # Internationalization
│   │   ├── themeContext.tsx   # Theme management
│   │   └── sectionContext.tsx # Section visibility tracking
│   ├── dataFetchers/      # Static data files
│   ├── locales/           # Translation files (en, es, he)
│   ├── styles/            # Additional CSS files
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions and hooks
└── coverage/              # Test coverage reports
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v24.x (specified in `package.json` engines)
- **pnpm**: v10.8.0+ (specified in `package.json` packageManager)
- **Git**: For version control

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jonatankruszewski/jonykru.com.git
   cd jonykru.com
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

   Your site will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# Generate version file and build
pnpm build

# The static export will be in the `out/` directory
```

### Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📜 Available Scripts

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Serve production build locally

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors automatically
- `pnpm prettier` - Check code formatting
- `pnpm prettier:fix` - Fix code formatting

### Testing

- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report

### Automation

- `pnpm update-credly` - Fetch latest certifications from Credly API
- `pnpm update-medium` - Fetch latest articles from Medium RSS
- `pnpm version:patch` - Bump patch version (x.x.1)
- `pnpm version:minor` - Bump minor version (x.1.0)
- `pnpm version:major` - Bump major version (1.0.0)

### Analysis

- `pnpm build-analyze` - Build with bundle analyzer enabled

## 🏗️ Architecture & Design Decisions

### Component Architecture

- **Server Components by Default**: Using Next.js App Router, components are server components unless marked with `'use client'`
- **Client Components**: Only used when interactivity is needed (forms, animations, browser APIs)
- **Component Composition**: Small, focused components that can be easily composed
- **Custom Hooks**: Business logic extracted into reusable hooks (e.g., `useCertificationFilters`, `useI18n`)

### State Management

- **React Context**: Used for global state (theme, i18n, section visibility)
- **React Hook Form**: For form state management
- **Local State**: `useState` for component-specific state

### Performance Optimizations

- **Static Export**: Next.js static export for optimal performance
- **Image Optimization**: Next.js Image component with WebP format
- **Code Splitting**: Automatic code splitting via Next.js
- **Lighthouse Optimizations**: Special handling for performance testing tools
- **Intersection Observer**: Debounced section visibility tracking

### Internationalization (i18n)

- **Custom Implementation**: Lightweight i18n solution without external dependencies
- **LocalStorage Persistence**: User language preference saved in browser
- **RTL Support**: Full right-to-left layout support for Hebrew
- **Fallback Strategy**: Falls back to English if translation key is missing

### Testing Strategy

- **Unit Tests**: Comprehensive test coverage for utility functions and hooks
- **Test Coverage Thresholds**: 70% minimum coverage for lines, functions, branches, and statements
- **Testing Library**: React Testing Library for component testing
- **Vitest**: Fast test runner with excellent TypeScript support

## 🔧 Configuration

### TypeScript

- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `@/*` maps to `src/*` for cleaner imports
- **Incremental Compilation**: Enabled for faster builds

### ESLint

- **Next.js Rules**: Enforces Next.js best practices
- **React Hooks**: Validates React Hooks rules
- **Import Sorting**: Automatic import sorting and grouping
- **TypeScript**: TypeScript-specific linting rules

### Commit Convention

This project uses a custom commit convention:

```
[TYPE] subject

[FEAT] Add new feature
[FIX] Fix bug
[UI] Update UI component
[REFACTOR] Refactor code
[CLEANUP] Clean up code
[UTIL] Add utility function
[CONFIG] Update configuration
[INFRA] Infrastructure changes
```

## 🚢 Deployment

### Static Export

The project is configured for static export:

```bash
pnpm build
```

The output is in the `out/` directory, ready to be deployed to any static hosting service.

### GitHub Actions

The project includes GitHub Actions workflows for:

- **Version Bumping**: Automatic version bumps based on commit messages
- **Deployment**: Automated deployment to AWS S3 and CloudFront

### Environment Variables

No environment variables are required for local development. The project uses static data files for certifications and publications.

## 📊 Code Quality Metrics

- **TypeScript**: 100% TypeScript coverage
- **Test Coverage**: 70%+ threshold (lines, functions, branches, statements)
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier with consistent configuration
- **Git Hooks**: Pre-commit hooks for linting and type checking

## 🤝 Contributing

I'm always open to contributions, whether it's fixing a bug, improving documentation, or adding a new feature. To contribute:

1. **Fork this repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the code style and conventions
4. **Write or update tests** if applicable
5. **Run the linter and tests** (`pnpm lint && pnpm test`)
6. **Commit your changes** using the commit convention (`[TYPE] description`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Use meaningful commit messages

## 📄 Key Sections of the Website

- **About**: Introduction, achievements, and professional expertise
- **Publications**: Dynamic display of Medium articles with thumbnails
- **Certifications**: Interactive certification showcase with provider filtering
- **Contact**: Contact form with validation and social media links

## 🏆 Certifications

Some of my key certifications include:

- AWS Certified Cloud Practitioner
- Google Cloud Digital Leader Certification
- Microsoft Certified: Azure Fundamentals
- GitHub Advanced Security
- MongoDB Certified Associate Developer
- Professional Scrum Master™ (PSM I & II)
- And many more...

## ✍️ Publications

I regularly publish technical articles on Medium covering topics like:

- React and TypeScript best practices
- Code architecture and scalability
- Development workflows and tooling
- Technical debt management

Check out my [Medium profile](https://medium.com/@jonatan.kruszewski) for the latest articles.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [jonykru.com](https://jonykru.com)
- **LinkedIn**: [jonatan-kruszewski](https://www.linkedin.com/in/jonatan-kruszewski)
- **GitHub**: [jonatankruszewski](https://github.com/jonatankruszewski)
- **Medium**: [@jonatan.kruszewski](https://medium.com/@jonatan.kruszewski)
- **Stack Overflow**: [jonatan-kruszewski](https://stackoverflow.com/users/17625486/jonatan-kruszewski)

## 🙏 Acknowledgments

Special thanks to the open-source community for all the tools and libraries that make building great websites possible!

---

**Built with ❤️ using Next.js, TypeScript & Tailwind CSS**
