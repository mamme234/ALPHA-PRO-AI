// ============================================
// ALPHA PRO AI - MAIN APP
// ============================================

let state = {
    messageCount: 0,
    isProcessing: false,
    conversationHistory: [],
    messages: []
};

let dom = {};

export function initApp() {
    dom = {
        messagesContainer: document.getElementById('messagesContainer'),
        userInput: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        clearBtn: document.getElementById('clearChatBtn'),
        newChatBtn: document.getElementById('newChatBtn'),
        typingIndicator: document.getElementById('typingIndicator'),
        statusText: document.getElementById('statusText'),
        msgCount: document.getElementById('msgCount'),
        uptime: document.getElementById('uptime')
    };

    showWelcome();
    setupEventListeners();
    startUptime();
    checkHealth();
    setInterval(checkHealth, 30000);
    dom.userInput.focus();

    console.log('⚡ Alpha Pro AI ready');
}

function setupEventListeners() {
    dom.sendBtn.addEventListener('click', handleSend);
    dom.userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    dom.userInput.addEventListener('input', autoResize);
    dom.clearBtn.addEventListener('click', clearChat);
    dom.newChatBtn.addEventListener('click', newChat);

    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            dom.userInput.value = btn.dataset.prompt;
            dom.userInput.dispatchEvent(new Event('input'));
            handleSend();
        });
    });
}

function showWelcome() {
    dom.messagesContainer.innerHTML = `
        <div class="message ai">
            <div class="message-avatar">⚡</div>
            <div class="message-bubble">
                <strong>Alpha Pro AI</strong><br>
                Your intelligent assistant.<br><br>
                I can help you with:<br>
                📥 Download TikTok videos<br>
                🎬 Find movie posters & info<br>
                📢 Create YouTube Community posts<br>
                📝 Generate exam worksheets<br>
                ✍️ Write scripts & content<br>
                💬 Answer any question<br><br>
                <span style="color:var(--text-secondary);font-size:13px;">
                    💡 Just ask me anything!
                </span>
            </div>
        </div>
    `;
}

async function handleSend() {
    const text = dom.userInput.value.trim();
    if (!text || state.isProcessing) return;

    addMessage('user', text);
    dom.userInput.value = '';
    dom.userInput.style.height = 'auto';
    state.messageCount++;
    dom.msgCount.textContent = state.messageCount;

    state.isProcessing = true;
    dom.typingIndicator.classList.add('active');
    dom.statusText.textContent = 'Processing...';

    try {
        const response = await callAPI('/api/chat', {
            prompt: text,
            history: state.conversationHistory
        });

        if (response.type === 'tiktok') {
            handleTikTokResponse(response.response);
        } else if (response.type === 'movie') {
            handleMovieResponse(response.response);
        } else if (response.type === 'community') {
            handleCommunityResponse(response.response);
        } else {
            const aiText = response.response?.response || response.response || "I'm not sure how to respond.";
            addMessage('ai', aiText);
            state.conversationHistory.push({ role: 'user', content: text });
            state.conversationHistory.push({ role: 'assistant', content: aiText });
        }

    } catch (error) {
        addMessage('ai', '⚠️ Error: ' + error.message);
    }

    state.isProcessing = false;
    dom.typingIndicator.classList.remove('active');
    dom.statusText.textContent = 'Ready';
    dom.userInput.focus();
}

function addMessage(role, content, isHtml = false) {
    const container = dom.messagesContainer;
    const div = document.createElement('div');
    div.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '⚡';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (isHtml) {
        bubble.innerHTML = content;
    } else {
        bubble.innerHTML = formatText(content);
    }

    div.appendChild(avatar);
    div.appendChild(bubble);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function formatText(text) {
    if (!text) return '';
    let html = text;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function autoResize() {
    const el = dom.userInput;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function clearChat() {
    dom.messagesContainer.innerHTML = '';
    showWelcome();
    state.messageCount = 0;
    state.conversationHistory = [];
    dom.msgCount.textContent = '0';
}

function newChat() {
    clearChat();
    dom.userInput.focus();
}

function startUptime() {
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        dom.uptime.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        const data = await res.json();
        document.querySelector('.status-dot').style.background = '#10b981';
    } catch (e) {
        document.querySelector('.status-dot').style.background = '#f59e0b';
    }
}

// ============================================
// HANDLE TIKTOK RESPONSE
// ============================================
function handleTikTokResponse(data) {
    if (data.success) {
        const html = `
            <div class="surface-card">
                <div class="surface-title">📥 TikTok Video Ready</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;">
                    <div class="surface-metric"><div class="value">✅</div><div class="label">Download Ready</div></div>
                    <div class="surface-metric"><div class="value">${data.author || 'Unknown'}</div><div class="label">Creator</div></div>
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <a href="${data.videoUrl}" target="_blank" style="flex:1;padding:12px;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;border-radius:10px;text-decoration:none;text-align:center;font-weight:600;">⬇️ Download Video</a>
                    ${data.audioUrl ? `<a href="${data.audioUrl}" target="_blank" style="flex:1;padding:12px;background:var(--bg-hover);color:var(--text-primary);border-radius:10px;text-decoration:none;text-align:center;border:1px solid var(--border-color);">🎵 Download Audio</a>` : ''}
                </div>
                ${data.title ? `<div style="margin-top:10px;color:var(--text-secondary);font-size:13px;">${data.title}</div>` : ''}
            </div>
        `;
        addMessage('ai', html, true);
    } else {
        addMessage('ai', '❌ ' + (data.error || 'Failed to download video'));
    }
}

// ============================================
// HANDLE MOVIE RESPONSE
// ============================================
function handleMovieResponse(data) {
    if (data.success) {
        const html = `
            <div class="surface-card">
                <div class="surface-title">🎬 ${data.title}</div>
                ${data.poster ? `<img src="${data.poster}" alt="${data.title}" style="max-width:200px;border-radius:10px;margin:10px 0;border:1px solid var(--border-color);"/>` : ''}
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
                    <div class="surface-metric"><div class="value">${data.year || 'N/A'}</div><div class="label">Year</div></div>
                    ${data.rating ? `<div class="surface-metric"><div class="value">⭐ ${data.rating}</div><div class="label">Rating</div></div>` : ''}
                    <div class="surface-metric"><div class="value">🎥</div><div class="label">IMDb</div></div>
                </div>
                ${data.description ? `<div style="margin-top:10px;color:var(--text-secondary);font-size:14px;">${data.description}</div>` : ''}
            </div>
        `;
        addMessage('ai', html, true);
    } else {
        addMessage('ai', '❌ ' + (data.error || 'Movie not found'));
    }
}

// ============================================
// HANDLE COMMUNITY RESPONSE
// ============================================
function handleCommunityResponse(data) {
    const html = `
        <div class="surface-card">
            <div class="surface-title">📢 YouTube Community Post</div>
            <div style="background:var(--bg-secondary);padding:16px;border-radius:10px;margin:10px 0;border:1px solid var(--border-color);">
                ${data.content ? data.content.replace(/\n/g, '<br>') : 'No content generated'}
            </div>
            <button onclick="window.postToYouTube && window.postToYouTube()" style="width:100%;padding:12px;background:linear-gradient(135deg,#ff0000,#cc0000);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:16px;">
                📤 Post to YouTube Community
            </button>
        </div>
    `;
    addMessage('ai', html, true);
}
