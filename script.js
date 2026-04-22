document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const themeToggle = document.getElementById('theme-icon');
    const startChatBtn = document.getElementById('start-chat-btn');
    const chatContainer = document.getElementById('chat-container');
    const closeChatBtn = document.getElementById('close-chat');
    const clearChatBtn = document.getElementById('clear-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    // API Endpoint
    const API_URL = 'https://cybersecurebot-server-1.onrender.com/api/dialogflow';

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeToggle.classList.replace('bxs-moon', 'bxs-sun');
        } else {
            themeToggle.classList.replace('bxs-sun', 'bxs-moon');
        }
    });

    // Chat Visibility
    startChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        userInput.focus();
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
    });

    // Load Chat History
    const loadChatHistory = () => {
        const history = JSON.parse(localStorage.getItem('cyberBotHistory')) || [];
        if (history.length > 0) {
            chatMessages.innerHTML = ''; // Clear default welcome message if history exists
            history.forEach(msg => {
                appendMessage(msg.sender, msg.text, msg.suggestions, msg.links, false);
            });
            scrollToBottom();
        }
    };

    const saveToHistory = (sender, text, suggestions = [], links = []) => {
        const history = JSON.parse(localStorage.getItem('cyberBotHistory')) || [];
        history.push({ sender, text, suggestions, links });
        localStorage.setItem('cyberBotHistory', JSON.stringify(history));
    };

    clearChatBtn.addEventListener('click', () => {
        localStorage.removeItem('cyberBotHistory');
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="avatar"><i class='bx bx-shield-quarter'></i></div>
                <div class="message-content">
                    <p>Hello! I'm CyberSecureBot. How can I help you stay safe online today?</p>
                </div>
            </div>`;
    });

    // Send Message Logic
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message to UI
        appendMessage('user', text);
        saveToHistory('user', text);
        userInput.value = '';
        
        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        try {
            // API Call
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text }) // Send "text" as expected by endpoint
            });

            if (!response.ok) {
                throw new Error('Server not responding');
            }

            const data = await response.json();
            
            // Hide typing indicator
            typingIndicator.classList.add('hidden');

            // Add bot message to UI
            const replyText = data.reply || "I didn't quite get that. Could you rephrase?";
            const suggestions = data.suggestions || [];
            const links = data.links || [];

            appendMessage('bot', replyText, suggestions, links);
            saveToHistory('bot', replyText, suggestions, links);

        } catch (error) {
            typingIndicator.classList.add('hidden');
            appendMessage('bot', "Error: " + error.message + ". Please try again later.");
        }
    };

    // Append Message to DOM
    const appendMessage = (sender, text, suggestions = [], links = [], animate = true) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        if (!animate) msgDiv.style.animation = 'none';

        const avatarHtml = sender === 'bot' 
            ? `<div class="avatar"><i class='bx bx-shield-quarter'></i></div>`
            : `<div class="avatar"><i class='bx bx-user'></i></div>`;

        let contentHtml = `<div class="message-content"><p>${text}</p>`;

        // Add links if any
        if (links.length > 0) {
            links.forEach(link => {
                const url = typeof link === 'string' ? link : link.url;
                const title = link.name || url;
                contentHtml += `<a href="${url}" target="_blank" class="link-card">${title}</a>`;
            });
        }

        // Add suggestions if any
        if (suggestions.length > 0) {
            contentHtml += `<div class="suggestions-container">`;
            suggestions.forEach(suggestion => {
                contentHtml += `<button class="suggestion-btn">${suggestion}</button>`;
            });
            contentHtml += `</div>`;
        }

        contentHtml += `</div>`;

        msgDiv.innerHTML = avatarHtml + contentHtml;
        chatMessages.appendChild(msgDiv);

        // Add event listeners to new suggestion buttons
        if (suggestions.length > 0) {
            const btns = msgDiv.querySelectorAll('.suggestion-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    sendMessage(btn.innerText);
                });
            });
        }

        scrollToBottom();
    };

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Event Listeners for Input
    sendBtn.addEventListener('click', () => {
        sendMessage(userInput.value);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(userInput.value);
        }
    });

    // Initialize
    loadChatHistory();
});
