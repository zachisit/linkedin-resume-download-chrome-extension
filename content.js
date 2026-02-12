// content.js

function createTriggerButton() {
  // Prevent duplicate buttons
  if (document.getElementById('linkedin-pdf-trigger-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'linkedin-pdf-trigger-btn';
  btn.innerHTML = '⬇️ PDF Resume';
  
  // Styling
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '12px 24px',
    backgroundColor: '#0a66c2', // LinkedIn Blue
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  });

  // Hover effects
  btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';

  // Attach the click handler
  btn.onclick = executeDownloadSequence;

  document.body.appendChild(btn);
}

function executeDownloadSequence() {
  const btn = document.getElementById('linkedin-pdf-trigger-btn');
  btn.innerText = 'Searching...';
  btn.style.backgroundColor = '#555'; // Grey out button while working

  // ---------------------------------------------------------
  // STEP 1: Find and Click the "More" Button
  // Target the specific container provided: data-view-name="profile-overflow-button"
  // ---------------------------------------------------------
  const moreButtonContainer = document.querySelector('div[data-view-name="profile-overflow-button"]');
  const moreButton = moreButtonContainer ? moreButtonContainer.querySelector('button') : null;

  if (!moreButton) {
    console.error('Could not find "More" button container.');
    btn.innerText = '❌ Button Not Found';
    setTimeout(() => resetBtn(btn), 2000);
    return;
  }

  // Click the "More" button to open the dropdown
  moreButton.click();
  btn.innerText = 'Opening Menu...';

  // ---------------------------------------------------------
  // STEP 2: Wait for Menu & Click "Save to PDF"
  // ---------------------------------------------------------
  // We wait 100ms for the menu to render in the DOM
  setTimeout(() => {
    // Find all 'p' tags (since your snippet shows the text is inside a <p>)
    const paragraphs = Array.from(document.querySelectorAll('div[role="menuitem"] p'));
    
    // Find the one containing "Save to PDF"
    const pdfTextNode = paragraphs.find(p => p.innerText.trim() === 'Save to PDF');

    if (pdfTextNode) {
      // Vital: We usually need to click the 'menuitem' container, not just the text.
      // We look for the closest parent with role="menuitem"
      const clickableMenuItem = pdfTextNode.closest('div[role="menuitem"]');
      
      if (clickableMenuItem) {
        clickableMenuItem.click();
        btn.innerText = '✅ Downloading';
        btn.style.backgroundColor = '#057642'; // Green
        
        // Reset button after 3 seconds
        setTimeout(() => resetBtn(btn), 3000);
      } else {
        // Fallback: try clicking the text node directly if parent finding fails
        pdfTextNode.click();
        btn.innerText = '✅ Clicked Text';
      }
    } else {
      console.error('"Save to PDF" text not found in menu items.');
      btn.innerText = '❌ PDF Option Missing';
      // Close the menu so it doesn't stay stuck open
      moreButton.click();
      setTimeout(() => resetBtn(btn), 2000);
    }
  }, 500); // 500ms delay is usually safe for LinkedIn's React render speed
}

function resetBtn(btn) {
  btn.innerText = '⬇️ PDF Resume';
  btn.style.backgroundColor = '#0a66c2';
}

// ---------------------------------------------------------
// Mutation Observer
// ---------------------------------------------------------
// Keeps the button on screen even if LinkedIn does a soft-navigation (SPA)
const observer = new MutationObserver((mutations) => {
  if (!document.getElementById('linkedin-pdf-trigger-btn')) {
    createTriggerButton();
  }
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
createTriggerButton();