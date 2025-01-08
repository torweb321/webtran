# File Translation App

A Next.js application that translates text from various file formats using the DeepSeek API.

## Features

- Support for multiple file formats:
  - Text files (.txt)
  - PDF documents (.pdf)
  - Word documents (.doc, .docx)
- Multiple target languages
- Modern, responsive UI
- Real-time translation
- Download translated results

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- Supabase for storage
- DeepSeek API for translations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your API keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `DEEPSEEK_API_KEY`: Your DeepSeek API key

## Deployment

The app is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and add the required environment variables in the Vercel dashboard.

## License

MIT
