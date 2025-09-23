# Debug Guide for Fashion TryOn Studio

## Quick Debug Steps

### 1. Check Console Logs
Open browser developer tools (F12) and look for these log messages:

**Expected Flow:**
```
🎨 App: Component initializing...
🖼️ ImageUploader rendered: { id: "user-upload", title: "1. Your Photo", ... }
🖼️ ImageUploader rendered: { id: "garment-upload", title: "2. Garment/Outfit", ... }
```

**When uploading images:**
```
📎 ImageUploader: File selected: { name: "...", type: "image/...", size: ... }
📚 ImageUploader: Starting file read...
📚 ImageUploader: File read completed
✅ ImageUploader: Image data created: { name: "...", mimeType: "...", ... }
✅ ImageUploader: onImageUpload called
```

**When generating images:**
```
🎬 TryOn: handleGenerate called
🚀 TryOn: Starting generation process...
📞 TryOn: Calling generateTryOnImage...
🚀 Starting image generation API call: { type: "tryon", ... }
🎨 Generating demo image for type: tryon
✅ Canvas created successfully: { width: 400, height: 600 }
✅ Demo image generated successfully: { type: "tryon", ... }
✅ Try-on generation result: { success: true, ... }
🖼️ TryOn: Rendering generated image: { imageUrl: "data:image/png;base64,...", ... }
✅ TryOn: Image loaded successfully
```

### 2. Debug Panel
In development mode, a debug panel appears in the bottom-right corner showing:
- Current timestamp
- User image details
- Garment image details  
- Generated image details
- Loading state
- Error state

### 3. Test Files
Run these test files to isolate issues:

**Canvas Test:**
```bash
# Open in browser
open src/test-canvas.html
```

**Flow Test:**
```bash
# Open in browser  
open src/test-flow.html
```

### 4. Common Issues & Solutions

#### Issue: Images not uploading
**Symptoms:** No console logs after file selection
**Check:**
- File input is working: `📎 ImageUploader: File selected`
- FileReader is working: `📚 ImageUploader: File read completed`

**Solution:**
```javascript
// Test file input manually in console
const input = document.querySelector('input[type="file"]');
console.log('File input found:', !!input);
```

#### Issue: Images not generating
**Symptoms:** Loading state but no result
**Check:**
- Generation starts: `🚀 Starting image generation API call`
- Canvas creation: `✅ Canvas created successfully`
- Image data creation: `✅ Demo image generated successfully`

**Solution:**
```javascript
// Test canvas manually in console
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 600;
const ctx = canvas.getContext('2d');
console.log('Canvas context:', !!ctx);
if (ctx) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 400, 600);
    const dataUrl = canvas.toDataURL();
    console.log('Canvas works:', dataUrl.length > 100);
}
```

#### Issue: Images not displaying
**Symptoms:** Generation completes but no image shows
**Check:**
- Image URL created: `imageUrl: "data:image/png;base64,..."`
- Image element renders: `🖼️ TryOn: Rendering generated image`
- Image loads: `✅ TryOn: Image loaded successfully`

**Solution:**
```javascript
// Check generated image in console
console.log('Generated image state:', generatedImage);
if (generatedImage?.imageUrl) {
    const img = new Image();
    img.onload = () => console.log('✅ Image URL is valid');
    img.onerror = () => console.log('❌ Image URL is invalid');
    img.src = generatedImage.imageUrl;
}
```

### 5. Environment Check

**Required Environment Variables:**
```bash
# Check if variables are set
echo $OPENROUTER_API_KEY
echo $SITE_URL
echo $SITE_NAME
```

**Browser Compatibility:**
- Canvas API support
- FileReader API support
- ES6+ features

### 6. Network Issues

**If using actual API:**
```javascript
// Check network requests in browser dev tools
// Look for failed requests to:
// - https://openrouter.ai/api/v1/chat/completions
// - https://generativelanguage.googleapis.com/v1beta/...
```

### 7. Production vs Development

**Development Mode:**
- Uses demo image generation
- Shows debug panel
- Extensive console logging

**Production Mode:**
- Uses actual API calls
- No debug panel
- Minimal logging

### 8. Manual Testing Steps

1. **Upload User Image:**
   - Click "Click to upload" or drag image
   - Check console for upload logs
   - Verify image preview appears

2. **Upload Garment Image:**
   - Repeat upload process
   - Check both images are loaded

3. **Generate Try-On:**
   - Click "Try On Outfit" button
   - Check loading state appears
   - Wait for generation (2-5 seconds)
   - Verify result image appears

4. **Download Result:**
   - Click "Download Image" button
   - Verify file downloads correctly

### 9. Error Recovery

**Reset Everything:**
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

**Clear Component State:**
- Click "Reset" button
- Verify all images cleared
- Check console for reset logs

### 10. Performance Monitoring

**Check for:**
- Memory leaks (multiple canvas elements)
- Large base64 strings in memory
- Excessive re-renders

**Monitor:**
```javascript
// Check memory usage
console.log('Memory:', performance.memory);

// Check component renders
// Look for excessive "Component rendered" logs
```

## Quick Fix Commands

```bash
# Restart development server
npm run dev

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Build for production
npm run build
```

## Contact & Support

If issues persist:
1. Check browser console for errors
2. Run test files to isolate the problem
3. Verify environment setup
4. Check network connectivity (if using real APIs)

The debug panel and extensive logging should help identify exactly where the issue occurs in the flow.