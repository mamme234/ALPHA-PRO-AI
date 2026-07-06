// ============================================
// API CALLS
// ============================================

async function callAPI(endpoint, data) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

// ============================================
// YOUTUBE POST FUNCTION
// ============================================
window.postToYouTube = async function() {
    const contentEl = document.querySelector('.surface-card .message-bubble');
    if (!contentEl) {
        showToast('No content to post');
        return;
    }

    const content = contentEl.textContent || '';

    try {
        const response = await callAPI('/api/community/post', { content });
        if (response.success) {
            showToast('✅ Posted to YouTube Community!', 'success');
        } else {
            showToast('❌ Failed: ' + response.error, 'error');
        }
    } catch (error) {
        showToast('❌ Error: ' + error.message, 'error');
    }
};

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        animation: slideUp 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
