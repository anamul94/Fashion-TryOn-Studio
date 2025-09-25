# Virtual Fashion Try-On Studio

Professional AI-powered virtual fitting room for e-commerce applications.

## Features

- **Realistic Try-On**: Generate photorealistic images of users wearing different outfits
- **Professional Quality**: Designed for e-commerce with high-quality output
- **Easy Upload**: Simple drag-and-drop interface for user photos and garments
- **Fast Processing**: Powered by Google's Gemini 2.5 Flash model via OpenRouter

## Setup

1. Install dependencies:
```bash
uv sync
```

2. Set up your OpenRouter API key in `.env`:
```
OPENROUTER_API_KEY=your_api_key_here
```

3. Run the app:
```bash
python run.py
```

Or directly with Streamlit:
```bash
streamlit run app.py
```

## Usage

1. Upload a clear photo of the person (front-facing works best)
2. Upload an image of the garment/outfit to try on
3. Click "Generate Try-On" and wait for the AI to process
4. View the realistic try-on result

## Requirements

- Python 3.11+
- OpenRouter API key
- Clear, well-lit images for best results

## E-commerce Ready

This application is designed for professional e-commerce use with:
- Error handling and validation
- Professional UI/UX
- High-quality image generation
- Reliable API integration