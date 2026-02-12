import os
import time
import json
import webbrowser
import platform
from pathlib import Path

# --- CONSTANTS ---
CONFIG_FILE = 'config.json'

def load_config():
    """Loads settings from config.json or creates default if missing."""
    default_config = {
        "downloads_folder": "AUTO",
        "chrome_path": "AUTO"
    }
    
    if not os.path.exists(CONFIG_FILE):
        print(f"⚠️ {CONFIG_FILE} not found. Creating default...")
        with open(CONFIG_FILE, 'w') as f:
            json.dump(default_config, f, indent=4)
        return default_config
        
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def get_downloads_path(configured_path):
    """Returns the Downloads path. Uses 'AUTO' detection if specified."""
    if configured_path != "AUTO":
        return Path(configured_path)
    
    # Auto-detect Downloads folder (Works on Win/Mac/Linux)
    return Path.home() / "Downloads"

def get_chrome_path(configured_path):
    """Returns the Chrome executable path or None if not found."""
    if configured_path != "AUTO":
        return configured_path

    system = platform.system()
    
    if system == "Windows":
        paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
        ]
        for p in paths:
            if os.path.exists(p): return p
            
    elif system == "Darwin": # MacOS
        return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        
    elif system == "Linux":
        # Usually in path as 'google-chrome' or 'google-chrome-stable'
        return "google-chrome"
        
    return None # Fallback to system default browser

def main():
    # 1. Load Configuration
    config = load_config()
    downloads_dir = get_downloads_path(config["downloads_folder"])
    chrome_path = get_chrome_path(config["chrome_path"])

    # 2. Register Chrome Browser
    if chrome_path and os.path.exists(chrome_path):
        webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))
        browser_key = 'chrome'
        print(f"✅ Chrome detected at: {chrome_path}")
    else:
        print("⚠️ Chrome not found in standard paths. Using system default browser.")
        browser_key = None # Uses default

    print(f"👀 Watching: {downloads_dir}")
    
    if not downloads_dir.exists():
        print(f"❌ Error: Directory not found: {downloads_dir}")
        print(f"👉 Please edit {CONFIG_FILE} with the correct path.")
        return

    # 3. Initial Snapshot
    known_files = {f for f in os.listdir(downloads_dir) if f.lower().endswith('.pdf')}
    
    try:
        while True:
            time.sleep(1)
            
            # Check for new files
            current_files = {f for f in os.listdir(downloads_dir) if f.lower().endswith('.pdf')}
            new_files = current_files - known_files
            
            for filename in new_files:
                print(f"\n🆕 New PDF: {filename}")
                filepath = downloads_dir / filename
                
                # Wait for download to finish writing (2s buffer)
                time.sleep(2.0)
                
                try:
                    url = filepath.as_uri() # Handles file:/// formatting correctly
                    print(f"   🚀 Opening...")
                    
                    if browser_key:
                        webbrowser.get(browser_key).open_new_tab(url)
                    else:
                        webbrowser.open_new_tab(url)
                        
                except Exception as e:
                    print(f"   ❌ Error: {e}")
            
            known_files = current_files
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping...")

if __name__ == "__main__":
    main()