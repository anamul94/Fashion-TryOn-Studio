import streamlit as st
import requests
import json
import base64
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

TRY_ON_PROMPT = """You are a professional virtual try-on AI system for fashion e-commerce.

**TASK:** Generate a photorealistic image of the person wearing the garment/outfit from the second image.

**CRITICAL INSTRUCTIONS:**
- IDENTIFY and EXTRACT the specific garment/clothing item from the second image (ignore any model/person wearing it)
- REPLACE the person's current clothing with the identified garment
- If the second image shows a model wearing the garment, focus only on the clothing item itself
- Keep the person's face, body shape, skin tone, and pose identical
- Ensure the garment fits naturally on their body type and size
- Maintain professional lighting and image quality
- The result should look like the person actually put on the new clothes

**IMPORTANT:** This is virtual try-on. Extract the garment from any context and fit it naturally on the person."""

POSE_PROMPT = """You are a professional fashion photography AI for pose transformation.

**TASK:** Change the person's pose to match the reference pose while keeping everything else identical.

**CRITICAL INSTRUCTIONS:**
- Transform ONLY the person's body position and pose to match the reference
- Keep the person's face, identity, clothing, and styling exactly the same
- The clothing should move and drape naturally with the new pose
- Maintain the same lighting, background, and image quality
- Ensure the new pose looks natural, achievable, and professionally photographed
- DO NOT change colors, textures, facial features, or any clothing details
- Preserve all accessories and styling elements

**IMPORTANT:** This is pose transformation only. The person should look identical except for body position."""

def image_to_base64(image):
    """Convert PIL image to base64 string"""
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

def generate_tryon_image(person_image, garment_image):
    """Generate virtual try-on image using OpenRouter API"""
    
    person_b64 = image_to_base64(person_image)
    garment_b64 = image_to_base64(garment_image)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "google/gemini-2.5-flash-image-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": TRY_ON_PROMPT},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{person_b64}"}},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{garment_b64}"}}
                ]
            }
        ],
        "modalities": ["image", "text"]
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        if "error" in result:
            st.error(f"API Error: {result['error'].get('message', 'Unknown error')}")
            return None
            
        if result.get("choices"):
            message = result["choices"][0]["message"]
            if message.get("images"):
                image_data = message["images"][0]["image_url"]["url"]
                return image_data
            elif message.get("content"):
                st.error(f"Model returned text instead of image: {message['content'][:100]}...")
                return None
            else:
                st.error("No image or content in response")
                return None
        else:
            st.error(f"No choices in API response: {str(result)[:200]}...")
            return None
            
    except requests.exceptions.RequestException as e:
        st.error(f"API request failed: {str(e)}")
        return None
    except json.JSONDecodeError as e:
        st.error(f"Failed to parse API response: {str(e)}")
        return None
    except Exception as e:
        st.error(f"Error processing request: {str(e)}")
        return None

def generate_pose_transform(person_image, pose_reference):
    """Generate pose-transformed image using OpenRouter API"""
    
    person_b64 = image_to_base64(person_image)
    pose_b64 = image_to_base64(pose_reference)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "google/gemini-2.5-flash-image-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": POSE_PROMPT},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{person_b64}"}},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{pose_b64}"}}
                ]
            }
        ],
        "modalities": ["image", "text"]
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        if result.get("choices"):
            message = result["choices"][0]["message"]
            if message.get("images"):
                image_data = message["images"][0]["image_url"]["url"]
                return image_data
            elif message.get("content"):
                st.error(f"Model returned text instead of image: {message['content'][:100]}...")
                return None
            else:
                st.error("No image or content in response")
                return None
        else:
            return None
            
    except requests.exceptions.RequestException as e:
        st.error(f"API request failed: {str(e)}")
        return None
    except Exception as e:
        st.error(f"Error processing request: {str(e)}")
        return None

def main():
    st.set_page_config(
        page_title="Virtual Fashion Try-On",
        page_icon="👗",
        layout="wide"
    )
    
    st.title("🛍️ Virtual Fashion Try-On Studio")
    st.markdown("**Professional AI-powered virtual fitting room for e-commerce**")
    
    # Mode selection
    mode = st.radio(
        "Select Mode:",
        ["👗 Virtual Try-On", "🕺 Pose Transform"],
        horizontal=True
    )
    
    if not API_KEY:
        st.error("⚠️ OpenRouter API key not found. Please check your .env file.")
        return
    
    if mode == "👗 Virtual Try-On":
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col1:
            st.subheader("👤 Upload Your Photo")
            person_file = st.file_uploader(
                "Choose your image",
                type=['png', 'jpg', 'jpeg'],
                key="person_tryon"
            )
            
            if person_file:
                person_image = Image.open(person_file).convert("RGB")
                st.image(person_image, caption="Your Photo", use_container_width=True)
        
        with col2:
            st.subheader("👕 Upload Garment")
            st.caption("Can be garment alone or model wearing it")
            garment_file = st.file_uploader(
                "Choose garment image",
                type=['png', 'jpg', 'jpeg'],
                key="garment"
            )
            
            if garment_file:
                garment_image = Image.open(garment_file).convert("RGB")
                st.image(garment_image, caption="Garment", use_container_width=True)
        
        with col3:
            st.subheader("✨ Try-On Result")
            
            if person_file and garment_file:
                if st.button("🎯 Generate Try-On", type="primary"):
                    with st.spinner("Creating your virtual try-on... This may take 30-60 seconds"):
                        result_image = generate_tryon_image(person_image, garment_image)
                        
                        if result_image:
                            st.image(result_image, caption="Virtual Try-On Result", use_container_width=True)
                            st.success("✅ Try-on generated successfully!")
                        else:
                            st.error("❌ Failed to generate try-on. Please try again.")
            else:
                st.info("📸 Upload both images to generate try-on")
    
    else:  # Pose Transform mode
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col1:
            st.subheader("👤 Upload Your Photo")
            person_file = st.file_uploader(
                "Choose your image",
                type=['png', 'jpg', 'jpeg'],
                key="person_pose"
            )
            
            if person_file:
                person_image = Image.open(person_file).convert("RGB")
                st.image(person_image, caption="Your Photo", use_container_width=True)
        
        with col2:
            st.subheader("🕺 Reference Pose")
            pose_file = st.file_uploader(
                "Choose pose reference",
                type=['png', 'jpg', 'jpeg'],
                key="pose_ref"
            )
            
            if pose_file:
                pose_image = Image.open(pose_file).convert("RGB")
                st.image(pose_image, caption="Reference Pose", use_container_width=True)
        
        with col3:
            st.subheader("✨ Pose Result")
            
            if person_file and pose_file:
                if st.button("🎯 Transform Pose", type="primary"):
                    with st.spinner("Transforming pose... This may take 30-60 seconds"):
                        result_image = generate_pose_transform(person_image, pose_image)
                        
                        if result_image:
                            st.image(result_image, caption="Pose Transform Result", use_container_width=True)
                            st.success("✅ Pose transformed successfully!")
                        else:
                            st.error("❌ Failed to transform pose. Please try again.")
            else:
                st.info("📸 Upload both images to transform pose")
    
    # Professional footer
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center; color: #666;'>
        <small>Professional Virtual Try-On & Pose Transform • Powered by AI • E-commerce Ready</small>
        </div>
        """,
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()