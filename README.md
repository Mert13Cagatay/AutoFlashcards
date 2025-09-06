# AI-Powered Flashcard Generator 🤖📚

A modern web application for generating flashcards from study notes using AI, designed with beautiful Material Design principles and modern UI components.

## 🎉 **COMPLETE IMPLEMENTATION** 

✅ **All core features have been implemented and are working!**

![AI Flashcards](https://via.placeholder.com/1200x630/4285F4/ffffff?text=AI+Flashcards)

## ✨ Features

- **🤖 AI-Powered Generation**: Transform any text into intelligent flashcards using OpenAI's GPT-4
- **🎨 Modern Material Design**: Beautiful UI with modern design principles and clean aesthetics
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🧠 Smart Study Sessions**: Spaced repetition algorithm for optimal learning
- **📊 Progress Tracking**: Comprehensive analytics and progress visualization
- **🌙 Dark Mode**: Toggle between light and dark themes
- **⚡ Lightning Fast**: Optimized performance with Next.js 14 and Turbopack

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router with TypeScript)
- **Styling**: Tailwind CSS with Google Material Design
- **Components**: Shadcn/ui components
- **Icons**: Lucide React
- **State Management**: Zustand
- **AI Integration**: OpenAI API (GPT-4)
- **Backend**: Supabase (Database + Auth)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (required for AI flashcard generation)
- Supabase project (optional for data persistence)

### Installation

1. **Clone or download this project**
   ```bash
   cd /Users/mertcagatay/Desktop/AUTOFLASHCARDS
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root:
   ```bash
   touch .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   # Required for AI flashcard generation
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional - for data persistence
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Get your OpenAI API key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy it to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 **What's Working Now**

### ✅ **Complete Features**
1. **🏠 Landing Page** - Beautiful hero section with Google-inspired design
2. **📤 Upload Interface** - Drag & drop for files + direct text input
3. **🤖 AI Generation** - OpenAI integration for smart flashcard creation
4. **📚 Dashboard** - View, filter, and manage all your flashcards
5. **🎓 Study Mode** - Interactive study sessions with progress tracking
6. **🌙 Dark Mode** - Complete light/dark theme toggle
7. **📱 Responsive** - Works perfectly on all devices

### 🎮 **How to Use**
1. **Upload Notes**: Click "Upload" and either drag files or paste text
2. **AI Processing**: Configure settings and let AI generate flashcards
3. **Study**: Use the interactive study mode with flip animations
4. **Track Progress**: View your statistics on the dashboard

## 🎨 Design System

### Color Palette

The app uses a modern, accessible color scheme:

- **Primary Blue**: `#4285F4` - Main CTA buttons and primary actions
- **Accent Red**: `#DB4437` - Error states and secondary actions  
- **Accent Yellow**: `#F4B400` - Warnings and highlights
- **Accent Green**: `#0F9D58` - Success states and confirmations

### Typography

- **Primary Font**: Google Sans (with Inter fallback)
- **Monospace Font**: Geist Mono
- **Font Weights**: 300, 400, 500, 700

### Components

All components follow Material Design 3 principles:
- Elevated cards with proper shadows
- Smooth micro-interactions
- Modern FABs (Floating Action Buttons)
- Consistent spacing and rounded corners

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles with Google theme
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components (Navbar, Hero, etc.)
│   ├── flashcard/        # Flashcard-specific components
│   ├── upload/           # Upload interface components
│   └── study/            # Study session components
├── lib/                   # Utility functions and configurations
│   ├── openai.ts         # OpenAI integration
│   ├── supabase.ts       # Supabase client and operations
│   ├── store.ts          # Zustand state management
│   └── utils.ts          # Common utilities
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env.local` file
3. The app uses GPT-4 for best results (can be configured to use GPT-3.5-turbo)

### Supabase Setup (Optional)

1. Create a new project at [Supabase](https://supabase.com/)
2. Run the database migration scripts (coming soon)
3. Add your project URL and anon key to `.env.local`

## 🎯 Usage

### 1. Upload Notes
- **Text Input**: Paste your study notes directly
- **File Upload**: Support for .txt, .pdf, and .md files
- **Drag & Drop**: Easy file uploading interface

### 2. AI Generation
- AI analyzes your content and extracts key concepts
- Generates questions with appropriate difficulty levels
- Categorizes flashcards by topic
- Adds relevant tags for organization

### 3. Study Sessions
- **Quick Study**: Start studying immediately with generated cards
- **Custom Sessions**: Select specific categories or difficulty levels
- **Spaced Repetition**: Algorithm adjusts based on your performance
- **Progress Tracking**: Visual feedback on your learning progress

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository**
   ```bash
   npx vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard
   - `NEXT_PUBLIC_OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   Your app will be available at your Vercel domain

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material Design** for design inspiration
- **OpenAI** for powerful AI capabilities
- **Vercel** for excellent hosting platform
- **Supabase** for backend infrastructure
- **Shadcn/ui** for beautiful component library

## 🔮 Roadmap

- [ ] **Advanced AI Features**
  - Multi-language support
  - Image-based flashcard generation
  - Voice-to-text note input
  
- [ ] **Collaboration Features**
  - Shared study sets
  - Study groups
  - Real-time collaboration
  
- [ ] **Mobile App**
  - React Native mobile app
  - Offline study mode
  - Push notifications
  
- [ ] **Integrations**
  - Google Drive sync
  - Notion integration
  - Canvas LMS integration

## 📞 Support

- **Documentation**: [docs.ai-flashcards.com](https://docs.ai-flashcards.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-flashcards/issues)
- **Discord**: [Join our community](https://discord.gg/ai-flashcards)
- **Email**: support@ai-flashcards.com

---

**Built with ❤️ by the AI Flashcards Team**

[🌟 Star this repo](https://github.com/yourusername/ai-flashcards) if you found it helpful!