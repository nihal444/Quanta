const elements = {
    sidebar: document.getElementById('sidebar'),
    chatHistory: document.getElementById('chatHistory'),
    newChatBtn: document.getElementById('newChatBtn'),
    chatArea: document.getElementById('chatArea'),
    userInput: document.getElementById('userInput'),
    sendBtn: document.getElementById('sendBtn'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    darkModeToggle: document.querySelector('.dark-mode-toggle')
};

let chatHistory = [];

function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : ''}`;

    if (isUser) {
        messageDiv.innerHTML = `
            <img class="avatar2" src="/static/assets/images-removebg-preview.png" alt="User Avatar">
            <div class="message-content">${content}</div>
        `;
    } else {
        const formattedContent = marked.parse(content);
        messageDiv.innerHTML = `
            <img class="avatar" src="/static/assets/quanta_icon.svg" alt="Quanta Avatar">
            <div class="message-content markdown-body">${formattedContent}</div>
        `;
        setTimeout(() => {
            messageDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }, 0);
    }

    elements.chatArea.appendChild(messageDiv);
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message gemini-loading';
    loadingDiv.innerHTML = `
        <img class="avatar" src="/static/assets/quanta_icon.svg" alt="Gemini Avatar">
        <div class="loading-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    elements.chatArea.appendChild(loadingDiv);
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight;
    return loadingDiv;
}

async function sendMessage() {
    const userInput = elements.userInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, true);
    elements.userInput.value = '';

    const loadingDiv = showLoading();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput }),
        });
        const data = await response.json();
        loadingDiv.remove();
        addMessage(data.response);
        updateChatHistory(userInput);
    } catch (error) {
        console.error('Error:', error);
        loadingDiv.remove();
        addMessage('An error occurred. Please try again.');
    }
}

function updateChatHistory(prompt) {
    chatHistory.push(prompt);
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.textContent = prompt;
    historyItem.addEventListener('click', () => loadChat(prompt));
    elements.chatHistory.appendChild(historyItem);
}

function loadChat(prompt) {
    elements.chatArea.innerHTML = '';
    addMessage(prompt, true);
    sendMessage(prompt);
}

function startNewChat() {
    elements.chatArea.innerHTML = '';
    elements.userInput.value = '';
    addMessage('# Welcome to Quanta...\n\nHow can I help you today?');
}

elements.sendBtn.addEventListener('click', sendMessage);
elements.userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
elements.newChatBtn.addEventListener('click', startNewChat);
elements.sidebarToggle.addEventListener('click', toggleSidebar);
elements.darkModeToggle.addEventListener('click', toggleDarkMode);

// Initialize
startNewChat();

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// About modal functionality
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeBtn = aboutModal.querySelector('.close');

aboutBtn.onclick = function() {
    aboutModal.style.display = "block";
}

closeBtn.onclick = function() {
    aboutModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == aboutModal) {
        aboutModal.style.display = "none";
    }
}