# Fashion TryOn Studio

A professional AI-powered virtual try-on and pose generation platform designed for e-commerce, fashion retail, and shopping mall applications.

## 🎯 Features

### Virtual Try-On
- **AI-Powered Fitting**: Upload your photo and a garment image to see realistic try-on results
- **Professional Quality**: E-commerce grade imagery suitable for retail applications
- **Identity Preservation**: Maintains user's facial features, body proportions, and skin tone
- **Garment Accuracy**: Preserves clothing details, colors, textures, and logos

### Pose Generation
- **Fashion Photography**: Transform poses while maintaining clothing and identity
- **Professional Results**: Catalog-quality images for marketing and promotional use
- **Natural Movement**: Ensures poses look achievable and natural
- **Retail Ready**: Perfect for fashion catalogs and e-commerce platforms

### Technical Features
- **Real-time Processing**: Fast AI generation with fallback composite images
- **Drag & Drop Upload**: Intuitive image upload interface
- **Responsive Design**: Works on desktop and mobile devices
- **Debug Panel**: Development tools for troubleshooting (dev mode only)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fashion-tryon-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local .env.local.example
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=Fashion TryOn Studio
```

### Getting API Keys

1. **OpenRouter API Key**:
   - Visit [OpenRouter](https://openrouter.ai/)
   - Create an account and generate an API key
   - Add to your `.env.local` file

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t fashion-tryon-studio .

# Run the container
docker run -p 80:80 fashion-tryon-studio
```

### Docker Compose

```yaml
version: '3.8'
services:
  fashion-tryon:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## 🏗️ Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🎨 Usage

### Virtual Try-On
1. Upload your photo in the "Your Photo" section
2. Upload a garment image in the "Garment/Outfit" section
3. Click "Try On Outfit" to generate the result
4. Download the generated image

### Pose Generation
1. Upload a source image with a person
2. Upload a pose reference image or sketch
3. Click "Generate Pose" to create the result
4. Download the transformed image

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── TryOn.tsx       # Virtual try-on interface
│   ├── Pose.tsx        # Pose generation interface
│   ├── ImageUploader.tsx # Image upload component
│   └── DebugPanel.tsx  # Development debug panel
├── services/           # API services
│   └── openRouterService.ts # OpenRouter integration
├── types.ts           # TypeScript type definitions
└── App.tsx           # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security

- API keys are stored in environment variables
- No sensitive data is exposed in the client
- CORS headers configured for production
- Input validation for uploaded images

## 🎯 Use Cases

### E-commerce
- Product visualization for online stores
- Reduce return rates with accurate try-on previews
- Enhance customer shopping experience

### Fashion Retail
- Create marketing materials and catalogs
- Generate promotional images
- Virtual fitting room experiences

### Shopping Malls
- Interactive kiosks for try-on experiences
- Customer engagement tools
- Brand activation campaigns

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Service**: Google Gemini 2.5 Flash via OpenRouter
- **Image Processing**: HTML5 Canvas API
- **Deployment**: Docker + Nginx

## 📝 API Integration

The application uses OpenRouter to access Google's Gemini 2.5 Flash Image Preview model:

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash-image-preview',
    messages: [/* image and text content */],
    modalities: ['image', 'text']
  })
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the browser console for error messages
2. Verify API key configuration
3. Ensure images are in supported formats (PNG, JPG, WebP)
4. Check network connectivity

## 🔄 Updates

- v1.0.0: Initial release with try-on and pose features
- Professional e-commerce quality results
- Docker deployment support
- Comprehensive debugging tools