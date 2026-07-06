// ============================================
// UI HELPER FUNCTIONS
// ============================================

function setTyping(visible) {
    const indicator = document.getElementById('typingIndicator');
    if (visible) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

function setStatus(text) {
    document.getElementById('statusText').textContent = text;
}

function updateMessageCount(count) {
    document.getElementById('msgCount').textContent = count;
}

function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    container.scrollTop = container.scrollHeight;
}

// ============================================
// UI ANIMATIONS
// ============================================
const styles = document.createElement('style');
styles.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
    }
    @keyframes typing-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
    }
`;
document.head.appendChild(styles);
