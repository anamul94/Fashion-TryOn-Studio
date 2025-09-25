#!/usr/bin/env python3
"""
Run the Virtual Fashion Try-On Streamlit app
"""
import subprocess
import sys

if __name__ == "__main__":
    try:
        subprocess.run([sys.executable, "-m", "streamlit", "run", "app.py"], check=True)
    except KeyboardInterrupt:
        print("\nApp stopped by user")
    except Exception as e:
        print(f"Error running app: {e}")