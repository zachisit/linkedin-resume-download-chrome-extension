// content.js

function createTriggerButton() {
  if (document.getElementById('linkedin-pdf-trigger-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'linkedin-pdf-trigger-btn';
  btn.innerHTML = '⬇️ Open PDF';
  
  // Styling
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '12px 24px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    fontSize: '14px',
    fontFamily: 'sans-serif'
  });

  btn.onclick = executeSmartDownload;
  document.body.appendChild(btn);
}

function executeSmartDownload() {
  const btn = document.getElementById('linkedin-pdf-trigger-btn');
  btn.innerText = '👀 Finding Menu...';

  // --- CRITICAL FIX: Tell background.js to watch for the next PDF ---
  chrome.runtime.sendMessage({ action: "expecting_pdf" });
  // ----------------------------------------------------------------

  // 1. Find the "More" button container
  const moreButtonContainer = document.querySelector('div[data-view-name="profile-overflow-button"]');
  const moreButton = moreButtonContainer ? moreButtonContainer.querySelector('button') : null;

  if (!moreButton) {
    btn.innerText = '❌ "More" Button Missing';
    console.error('Could not find the "More" button container.');
    setTimeout(() => resetBtn(btn), 2000);
    return;
  }

  // 2. Click "More"
  moreButton.click();
  btn.innerText = '⏳ Waiting...';

  // 3. Smart Poller: Check every 100ms for "Save to PDF"
  let attempts = 0;
  const maxAttempts = 30; // 3 seconds max

  const interval = setInterval(() => {
    attempts++;
    
    // Find text "Save to PDF"
    const allParagraphs = Array.from(document.querySelectorAll('.artdeco-dropdown__content p, div[role="menuitem"] p'));
    const pdfTextNode = allParagraphs.find(p => p.innerText.trim().includes('Save to PDF'));

    if (pdfTextNode) {
      clearInterval(interval);
      
      // Click the parent menu item
      const clickableItem = pdfTextNode.closest('div[role="menuitem"]') || pdfTextNode;
      clickableItem.click();
      
      btn.innerText = '✅ Opening...';
      btn.style.backgroundColor = '#057642'; // Green

      setTimeout(() => resetBtn(btn), 3000);
      
      // Close menu if needed
      setTimeout(() => {
        if (document.querySelector('.artdeco-dropdown--is-open')) {
            moreButton.click(); 
        }
      }, 1000);

    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.error("Timed out finding 'Save to PDF'");
      btn.innerText = '❌ Timeout';
      moreButton.click(); // Close menu
      setTimeout(() => resetBtn(btn), 2000);
    }
  }, 100);
}

function resetBtn(btn) {
  btn.innerText = '⬇️ Open PDF';
  btn.style.backgroundColor = '#0a66c2';
}

const observer = new MutationObserver((mutations) => {
  if (!document.getElementById('linkedin-pdf-trigger-btn')) {
    createTriggerButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
createTriggerButton();