# Lex Consulting Website

A professional website for Lex Consulting, a financial consulting firm. Built with Next.js and Chakra UI.

## Features

- Modern, responsive design optimized for all devices
- Professional layout suitable for a financial consulting company
- Built with Next.js 14 and Chakra UI for a clean, professional appearance
- Placeholder areas for logo and branding that can be easily updated
- Comprehensive site structure with home page, services, about, and contact sections

## Getting Started

### Development

To run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

To build the site for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

### Docker

The application includes Docker configuration for easy deployment in containerized environments.

#### Running with Docker

To build and run the application using Docker:

```bash
# Build the Docker image
docker build -t lex-website .

# Run the container
docker run -p 3000:3000 lex-website
```

#### Using Docker Compose

You can also use Docker Compose for development:

```bash
# Start the application with Docker Compose
docker-compose up

# Build and start in detached mode
docker-compose up -d --build
```

## Customization

### Branding

- **Colors**: The theme colors can be modified in the `src/app/providers.tsx` file. The current theme uses placeholder brand colors that can be updated to match your brand.
- **Logo**: There are placeholder areas for your logo throughout the site. Replace the placeholder boxes with your actual logo images.
- **Content**: Update the text content across the site to reflect your specific services and value proposition.

### Adding Pages

The site includes placeholder links for various pages. To add new pages:

1. Create new files in the `src/app` directory (e.g., `about/page.tsx`, `services/page.tsx`)
2. Design these pages using the Chakra UI components for consistent styling

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [Chakra UI](https://chakra-ui.com/) - Component library for building the UI
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
