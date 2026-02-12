# LinkedIn Resume Downloader & Auto-Opener

**A hybrid Chrome Extension + Python automation tool that turns LinkedIn's 4-click "Save to PDF" process into a single click.**

## 📖 The Problem

Downloading a resume from a LinkedIn profile usually requires a tedious workflow:

1. Click the "More" button.
2. Wait for the dropdown.
3. Click "Save to PDF".
4. Wait for the download.
5. Open your Downloads folder.
6. Find the file (which is often just named `Profile.pdf`) and open it.

## 🚀 The Solution

This tool streamlines the process into **one interaction**:

1. **Click the "⬇️ Open PDF" floating button** injected directly onto the profile page.
2. The PDF downloads and **immediately opens in a new browser tab**.

### How it Works (The Hybrid Architecture)

Due to browser security sandboxing, Chrome Extensions cannot directly open downloaded files from the disk without complex permissions. This project uses a lightweight **Hybrid Approach**:

* **The Extension:** Handles the DOM manipulation to find the hidden LinkedIn API triggers and initiates the download.
* **The Python Poller:** Watches your downloads folder for new PDF files and uses the OS-native file handler to open them immediately in your preferred browser.

---

## 📂 Project Structure

```text
/linkedin-resume-grabber
│
├── extension/              # Chrome Extension Source
│   ├── manifest.json
│   ├── content.js
│   └── background.js
│
├── poller/                 # Python Automation Script
│   ├── pdf_poller.py       # The watcher script
│   └── config.example.json # Configuration template
│
└── README.md

```

---

## 🛠️ Installation

### Part 1: Install the Chrome Extension

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Toggle **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the `extension/` folder from this repository.
6. *Verify:* Go to any LinkedIn profile. You should see a blue **⬇️ Open PDF** button in the bottom right.

### Part 2: Setup the Python Watcher

This script uses only the Python **Standard Library**. No `pip install` required.

1. Navigate to the `poller/` directory:
```bash
cd poller

```


2. Create your configuration file:
* **Mac/Linux:** `cp config.example.json config.json`
* **Windows:** Copy `config.example.json` and rename it to `config.json`.


3. (Optional) Edit `config.json` if you have a custom setup. By default, it is set to `"AUTO"`, which attempts to detect your Downloads folder and default browser automatically.

---

## 🏃 Usage

### 1. Start the Watcher

Before you start sourcing candidates, run the script in your terminal:

```bash
python poller/pdf_poller.py

```

*You will see a message: `👀 Watching: C:\Users\YourName\Downloads*`

### 2. Browse LinkedIn

1. Navigate to a LinkedIn user profile.
2. Click the floating **⬇️ Open PDF** button.
3. **Result:** The file downloads, and within 2 seconds, a new tab opens displaying the resume.

---

## ⚙️ Configuration (`config.json`)

The `config.json` file allows you to override the auto-detection logic.

**Default (Auto-Detect):**

```json
{
  "downloads_folder": "AUTO",
  "chrome_path": "AUTO"
}

```

**Custom Windows Example:**
If the script can't find your specific Chrome installation or you use a different drive for downloads:

```json
{
  "downloads_folder": "D:\\MyDownloads",
  "chrome_path": "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
}

```

**Custom Mac Example:**

```json
{
  "downloads_folder": "/Users/username/Downloads",
  "chrome_path": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}

```

---

## ❓ Troubleshooting

**Q: The button doesn't appear on LinkedIn.**

* A: Refresh the page. LinkedIn is a Single Page Application (SPA), and sometimes the DOM loads dynamically. The extension uses a `MutationObserver`, but a hard refresh usually fixes it.

**Q: The PDF downloads, but doesn't open.**

* A: Ensure the Python script is running. The extension *only* downloads; the Python script *opens*.
* A: Check your `config.json`. If `"chrome_path": "AUTO"` isn't working, find your Chrome executable path manually and paste it there.

**Q: I see a "Black Screen Flash" on Windows.**

* A: This happens when the OS tries to open a file that is still being written by the browser. The script includes a 2-second "Safety Buffer" to prevent this. If your internet is very slow, you may need to increase the `time.sleep(2.0)` value in `pdf_poller.py`.

**Q: Does this work on Mac? Linux?**

* A: No clue. I tested this on Windows only.

---

## ⚖️ Disclaimer

This tool is for educational and productivity purposes only. It is not affiliated with, endorsed by, or connected to LinkedIn Corporation. Please respect LinkedIn's User Agreement and Terms of Service when using automation tools.

## 📄 License

MIT License. Feel free to fork, modify, and distribute.