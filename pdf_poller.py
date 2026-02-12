import os
import time

# UPDATE THIS PATH
DOWNLOADS_DIR = r"C:\Users\krist\Downloads"

def get_pdf_files():
    """Returns a set of all PDF filenames in the folder."""
    try:
        return {f for f in os.listdir(DOWNLOADS_DIR) if f.lower().endswith('.pdf')}
    except FileNotFoundError:
        print(f"❌ Error: Directory not found: {DOWNLOADS_DIR}")
        return set()

def main():
    print(f"👀 Watching {DOWNLOADS_DIR} (Polling Mode)...")
    print("   (Waiting for new files...)")
    
    # 1. Take initial snapshot so we don't open old files
    before_files = get_pdf_files()
    
    while True:
        # 2. Check every second
        time.sleep(1) 
        
        # 3. Take new snapshot
        after_files = get_pdf_files()
        
        # 4. Find the difference (New Files only)
        new_files = after_files - before_files
        
        for filename in new_files:
            filepath = os.path.join(DOWNLOADS_DIR, filename)
            print(f"\n🆕 New File Detected: {filename}")
            
            # 5. THE BRUTE FORCE FIX
            # We wait 2 full seconds to ensure Chrome is 100% done.
            print("   ⏳ Waiting for Chrome to finish writing...")
            time.sleep(2.0) 
            
            try:
                print(f"   🚀 Launching...")
                os.startfile(filepath)
            except Exception as e:
                print(f"   ❌ Failed to open: {e}")
        
        # 6. Update snapshot for next loop
        before_files = after_files

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Stopping...")