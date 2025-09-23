# Fashion TryOn Studio - Setup Guide

## Quick Start

1. **Clone and Install**
   ```bash
   cd fashion-tryon-studio
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local .env.local.example
   # Edit .env.local with your API keys
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Configuration Options

### Option 1: Direct Gemini API (Recommended)
```env
GEMINI_API_KEY=your_gemini_api_key_here
SITE_URL=https://your-site.com
SITE_NAME=Fashion TryOn Studio
```

**Advantages:**
- Direct access to Gemini's image generation capabilities
- Better control over API calls
- More reliable for production use

**Setup:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `.env.local`
4. Update `src/services/openRouterService.ts` to use `productionService.ts`

### Option 2: OpenRouter (Alternative)
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
SITE_URL=https://your-site.com
SITE_NAME=Fashion TryOn Studio
```

**Advantages:**
- Access to multiple AI models
- Unified API for different services
- Good for experimentation

**Setup:**
1. Go to [OpenRouter](https://openrouter.ai/)
2. Create an account and get API key
3. Add to `.env.local`

## Production Deployment

### 1. Switch to Production Service
Replace the demo service with the production service:

```typescript
// In src/components/TryOn.tsx and src/components/Pose.tsx
import { generateTryOnImageProduction, generatePoseImageProduction } from '../services/productionService';

// Replace the import and function calls
const result = await generateTryOnImageProduction(userImage, garmentImage);
```

### 2. Environment Variables for Production
```env
# Production environment
NODE_ENV=production

# API Configuration (choose one)
GEMINI_API_KEY=your_production_gemini_key
# OR
OPENROUTER_API_KEY=your_production_openrouter_key

# Site Configuration
SITE_URL=https://your-production-site.com
SITE_NAME=Your Fashion Brand

# Optional: Additional services
REPLICATE_API_KEY=your_replicate_key
HUGGINGFACE_API_KEY=your_hf_key
```

### 3. Build and Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

## Professional E-commerce Integration

### For Fashion Retailers
1. **Brand Customization**
   - Update colors in `src/App.tsx`
   - Replace logo and branding
   - Customize prompts for your specific products

2. **Quality Control**
   - Implement image evaluation (see `productionService.ts`)
   - Add retry logic for failed generations
   - Set up monitoring and logging

3. **Performance Optimization**
   - Implement image caching
   - Add loading states and progress indicators
   - Optimize image sizes and formats

### For Shopping Malls
1. **Multi-tenant Setup**
   - Add store/brand selection
   - Implement user sessions
   - Add analytics tracking

2. **Kiosk Mode**
   - Fullscreen interface
   - Touch-friendly controls
   - Auto-reset functionality

## API Integration Examples

### Direct Gemini Integration
```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      }]
    })
  }
);
```

### OpenRouter Integration
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': SITE_URL,
    'X-Title': SITE_NAME,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.0-flash-exp:free',
    messages: [/* your messages */]
  })
});
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Check if the key is correctly set in `.env.local`
   - Verify the key has proper permissions
   - Check API quotas and billing

2. **Image Generation Fails**
   - Ensure images are properly encoded in base64
   - Check image size limits (usually 4MB max)
   - Verify image formats are supported (PNG, JPEG, WebP)

3. **CORS Issues**
   - Add proper CORS headers for production
   - Use server-side API calls for sensitive operations

### Performance Tips

1. **Image Optimization**
   - Compress images before sending to API
   - Use WebP format when possible
   - Implement client-side image resizing

2. **API Optimization**
   - Implement request caching
   - Add retry logic with exponential backoff
   - Use batch processing for multiple images

## Support and Maintenance

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API usage and costs
- Track user satisfaction metrics

### Updates
- Regularly update AI models
- Monitor for new features and capabilities
- Keep dependencies updated

### Scaling
- Implement CDN for image delivery
- Add database for user sessions
- Consider serverless architecture for API calls

## Business Considerations

### For E-commerce
- **ROI Metrics**: Track conversion rates, return reductions
- **Customer Satisfaction**: Monitor user feedback and usage
- **Cost Management**: Optimize API usage and costs

### For Retail
- **Integration**: Connect with existing POS and inventory systems
- **Analytics**: Track popular items and user preferences
- **Marketing**: Use generated images for promotional materials

This setup provides a professional foundation for fashion AI applications suitable for e-commerce, retail, and shopping mall environments.