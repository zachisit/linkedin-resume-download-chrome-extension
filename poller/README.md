
# PDF Auto-Opener (Python Poller)

This directory contains the Python automation logic for the **LinkedIn Resume Downloader**. While the Chrome Extension handles the "Click & Download" action, this script handles the "Detect & Open" action.

## 🛠️ How It Works

This script runs a **polling loop** that monitors your Downloads folder.
1.  **Snapshot:** Every 1 second, it takes a snapshot of all `.pdf` files in the folder.
2.  **Compare:** It compares the current snapshot to the previous one to identify *new* files.
3.  **Wait:** When a new file is detected, it waits **2.0 seconds** to ensure the browser has finished writing the file to disk (preventing file-lock crashes).
4.  **Launch:** It constructs a `file:///` URL and commands your specific browser (Chrome) to open it in a new tab.

**Why Polling instead of Events?**
Earlier versions used event-based monitoring (Watchdog), but Chrome often creates temporary files (`.crdownload`) or holds file locks that crash standard file openers. A "dumb" polling loop with a hard sleep timer proved to be 100% robust against these race conditions.

---

## 📋 Prerequisites

* **Python 3.6+** installed on your system.
* **No external dependencies** are required. This script uses only the Python Standard Library (`os`, `json`, `time`, `webbrowser`, `platform`, `pathlib`).

---

## ⚙️ Configuration

The script relies on a `config.json` file to know where to look and which browser to open.

### 1. Setup
Copy the example configuration file to create your active config:

**Mac/Linux:**
```bash
cp config.example.json config.json

```

**Windows:**

Copy and paste `config.example.json` and rename the copy to `config.json`.

### 2. Customizing `config.json`

By default, the configuration is set to `"AUTO"`. The script will attempt to detect your OS, find your home directory's Download folder, and locate the standard installation path for Google Chrome.

**Default:**

JSON

```
{
    "downloads_folder": "AUTO",
    "chrome_path": "AUTO"
}

```

**Manual Overrides:**

If the script cannot find your paths, or if you use a non-standard setup (e.g., a separate drive for downloads), you can provide absolute paths.

**Windows Example:**

JSON

```
{
    "downloads_folder": "D:\\MyDownloads",
    "chrome_path": "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
}

```

_Note: You must use double backslashes `\\` in JSON paths on Windows._

**Mac Example:**

JSON

```
{
    "downloads_folder": "/Users/zach/Downloads",
    "chrome_path": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}

```

----------

## 🚀 Usage

Open your terminal or command prompt to this directory and run:

Bash

```
python pdf_poller.py

```

**Successful Output:**

Plaintext

```
✅ Chrome detected at: C:\Program Files\Google\Chrome\Application\chrome.exe
👀 Watching: C:\Users\Zach\Downloads

```

Keep this window open in the background while you browse LinkedIn.

----------

## 🐛 Troubleshooting

### "Chrome not found in standard paths"

If you see this warning, the script will fall back to your system's default browser (which might be Edge or Safari). To force Chrome, find the `chrome.exe` (Win) or `Google Chrome` executable (Mac) path and paste it into `config.json`.

### The "Black Screen" Flash (Windows)

If your screen flashes black or the browser crashes when opening a PDF:

1.  This means the script tried to open the file before Chrome finished writing it.
    
2.  Open `pdf_poller.py`.
    
3.  Find the line `time.sleep(2.0)`.
    
4.  Increase this value to `3.0` or `4.0`. Slower disks or internet connections may need a longer buffer.
    

### PDF Opens in a New Window instead of a New Tab

The script uses `webbrowser.open_new_tab()`. However, browser behavior is ultimately user-controlled.

-   Check your browser settings to ensure "Open links in new tab" is selected.
    
-   If you are running the script as Administrator but the browser was started as a User (or vice versa), Windows may force a new window. Try running both as the same user level.
    

----------

## 📝 License

MIT License.