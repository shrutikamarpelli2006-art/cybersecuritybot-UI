document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const themeToggle = document.getElementById('theme-icon');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-container');
    const exploreDashboardBtn = document.getElementById('explore-dashboard-btn');
    const askChatbotBtn = document.getElementById('ask-chatbot-btn');
    const viewInsightsBtn = document.getElementById('view-insights-btn');
    const floatingChatBtn = document.getElementById('floating-chat-btn');
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

    // Sound Effects using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playSound = (frequency, duration, type = 'sine') => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
    
    const playSendSound = () => {
        playSound(800, 0.1, 'square');
        setTimeout(() => playSound(600, 0.1, 'square'), 50);
    };
    
    const playReceiveSound = () => {
        playSound(400, 0.15, 'sine');
        setTimeout(() => playSound(600, 0.15, 'sine'), 75);
    };

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeToggle.classList.replace('bxs-moon', 'bxs-sun');
        } else {
            themeToggle.classList.replace('bxs-sun', 'bxs-moon');
        }
    });

    // Navigation functionality - Smooth scrolling
    const scrollToSection = (sectionId) => {
        console.log('Scrolling to section:', sectionId);
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.error('Section not found:', sectionId);
        }
        
        // Update active link
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };

    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            console.log('Navigation clicked:', targetId);
            scrollToSection(targetId);
        });
    });

    // Hero button event listeners
    if (exploreDashboardBtn) {
        exploreDashboardBtn.addEventListener('click', () => scrollToSection('dashboard'));
    }
    if (askChatbotBtn) {
        askChatbotBtn.addEventListener('click', () => {
            scrollToSection('home');
            setTimeout(() => {
                if (chatContainer) {
                    chatContainer.classList.remove('hidden');
                    if (userInput) userInput.focus();
                }
            }, 500);
        });
    }
    if (viewInsightsBtn) {
        viewInsightsBtn.addEventListener('click', () => scrollToSection('insights'));
    }

    // Floating chat button
    if (floatingChatBtn) {
        floatingChatBtn.addEventListener('click', () => {
            chatContainer.classList.remove('hidden');
            userInput.focus();
        });
    }

    // Chat Visibility
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            chatContainer.classList.remove('hidden');
            userInput.focus();
        });
    }

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

        // Play send sound effect
        playSendSound();

        // Add user message to UI
        appendMessage('user', text);
        saveToHistory('user', text);
        userInput.value = '';
        
        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        try {
            console.log('Sending message to API:', text);
            
            // API Call
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text }) // Send "text" as expected by endpoint
            });

            console.log('API Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response data:', data);
            
            // Hide typing indicator
            typingIndicator.classList.add('hidden');

            // Add bot message to UI
            const replyText = data.reply || "I didn't quite get that. Could you rephrase?";
            const suggestions = data.suggestions || [];
            const links = data.links || [];

            // Play receive sound effect
            playReceiveSound();

            appendMessage('bot', replyText, suggestions, links);
            saveToHistory('bot', replyText, suggestions, links);

        } catch (error) {
            console.error('API Error:', error);
            typingIndicator.classList.add('hidden');
            
            // Fallback responses for common questions
            let fallbackResponse = "I'm having trouble connecting to my AI brain right now. ";
            
            const lowerText = text.toLowerCase();
            if (lowerText.includes('phishing')) {
                fallbackResponse += "Phishing is a type of cyber attack where criminals try to trick you into revealing sensitive information like passwords or credit card numbers by pretending to be trustworthy entities.";
            } else if (lowerText.includes('ransomware')) {
                fallbackResponse += "Ransomware is malicious software that blocks access to your computer system until you pay a ransom. Always keep backups and use antivirus software.";
            } else if (lowerText.includes('attack') || lowerText.includes('dangerous')) {
                fallbackResponse += "The most dangerous cyber attacks currently include ransomware, advanced persistent threats (APTs), and supply chain attacks. Always keep your systems updated and use strong security practices.";
            } else if (lowerText.includes('prevent') || lowerText.includes('protect')) {
                fallbackResponse += "To protect yourself: use strong passwords, enable 2FA, keep software updated, be careful with emails, and use reputable antivirus software.";
            } else {
                fallbackResponse += "Please try again later or ask me about phishing, ransomware, or general cybersecurity tips.";
            }
            
            appendMessage('bot', fallbackResponse);
            saveToHistory('bot', fallbackResponse);
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

    // Initialize Charts
    const initializeCharts = () => {
        // Year-wise Cyberattack Trends
        const yearTrendsCtx = document.getElementById('yearTrendsChart');
        if (yearTrendsCtx) {
            new Chart(yearTrendsCtx, {
                type: 'line',
                data: {
                    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: 'Cyber Attacks',
                        data: [1200, 1450, 1800, 2200, 2800, 3500, 4200],
                        borderColor: '#00f3ff',
                        backgroundColor: 'rgba(0, 243, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }

        // Vulnerability Trends
        const vulnerabilityCtx = document.getElementById('vulnerabilityChart');
        if (vulnerabilityCtx) {
            new Chart(vulnerabilityCtx, {
                type: 'line',
                data: {
                    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: 'Critical',
                        data: [450, 520, 680, 890, 1200, 1580, 2100],
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'High',
                        data: [380, 450, 590, 780, 1050, 1380, 1850],
                        borderColor: '#ffa726',
                        backgroundColor: 'rgba(255, 167, 38, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Medium',
                        data: [280, 320, 420, 550, 730, 960, 1280],
                        borderColor: '#42a5f5',
                        backgroundColor: 'rgba(66, 165, 245, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }

        // Attack Severity Levels
        const severityCtx = document.getElementById('severityChart');
        if (severityCtx) {
            new Chart(severityCtx, {
                type: 'bar',
                data: {
                    labels: ['Critical', 'High', 'Medium', 'Low'],
                    datasets: [{
                        label: 'Number of Attacks',
                        data: [850, 1420, 2180, 950],
                        backgroundColor: [
                            'rgba(255, 107, 107, 0.8)',
                            'rgba(255, 167, 38, 0.8)',
                            'rgba(66, 165, 245, 0.8)',
                            'rgba(76, 175, 80, 0.8)'
                        ],
                        borderColor: [
                            '#ff6b6b',
                            '#ffa726',
                            '#42a5f5',
                            '#4caf50'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }

        // Monthly Attack Patterns
        const monthlyCtx = document.getElementById('monthlyChart');
        if (monthlyCtx) {
            new Chart(monthlyCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: '2023',
                        data: [280, 320, 290, 350, 410, 380, 420, 450, 390, 360, 340, 310],
                        borderColor: '#00f3ff',
                        backgroundColor: 'rgba(0, 243, 255, 0.1)',
                        tension: 0.4
                    }, {
                        label: '2024',
                        data: [320, 360, 330, 410, 480, 450, 490, 520, 460, 430, 410, 380],
                        borderColor: '#00ff66',
                        backgroundColor: 'rgba(0, 255, 102, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }

        // Response Time Analysis
        const responseCtx = document.getElementById('responseChart');
        if (responseCtx) {
            new Chart(responseCtx, {
                type: 'doughnut',
                data: {
                    labels: ['< 1 hour', '1-6 hours', '6-24 hours', '1-3 days', '> 3 days'],
                    datasets: [{
                        data: [15, 22, 28, 25, 10],
                        backgroundColor: [
                            '#4caf50',
                            '#8bc34a',
                            '#ffc107',
                            '#ff9800',
                            '#f44336'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#e0e0e0' }
                        }
                    }
                }
            });
        }

        // Device Target Distribution
        const deviceCtx = document.getElementById('deviceChart');
        if (deviceCtx) {
            new Chart(deviceCtx, {
                type: 'polarArea',
                data: {
                    labels: ['Desktop', 'Mobile', 'Server', 'IoT', 'Network'],
                    datasets: [{
                        data: [35, 28, 18, 12, 7],
                        backgroundColor: [
                            'rgba(0, 243, 255, 0.6)',
                            'rgba(0, 255, 102, 0.6)',
                            'rgba(255, 107, 107, 0.6)',
                            'rgba(255, 167, 38, 0.6)',
                            'rgba(156, 39, 176, 0.6)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#e0e0e0' },
                            ticks: { 
                                color: '#a0a0a0',
                                backdropColor: 'transparent'
                            }
                        }
                    }
                }
            });
        }

        // Attack Type Distribution
        const attackTypeCtx = document.getElementById('attackTypeChart');
        if (attackTypeCtx) {
            new Chart(attackTypeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Phishing', 'Ransomware', 'DDoS', 'Malware', 'SQL Injection', 'Others'],
                    datasets: [{
                        data: [36, 22, 15, 12, 8, 7],
                        backgroundColor: [
                            '#00f3ff',
                            '#00ff66',
                            '#ff6b6b',
                            '#4ecdc4',
                            '#45b7d1',
                            '#96ceb4'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#e0e0e0' }
                        }
                    }
                }
            });
        }

        // Country-wise Attack Distribution
        const countryCtx = document.getElementById('countryChart');
        if (countryCtx) {
            new Chart(countryCtx, {
                type: 'bar',
                data: {
                    labels: ['USA', 'China', 'India', 'UK', 'Germany', 'Japan'],
                    datasets: [{
                        label: 'Attack Count',
                        data: [850, 720, 580, 420, 380, 350],
                        backgroundColor: 'rgba(0, 243, 255, 0.6)',
                        borderColor: '#00f3ff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }

        // Industry Risk Analysis
        const industryCtx = document.getElementById('industryChart');
        if (industryCtx) {
            new Chart(industryCtx, {
                type: 'radar',
                data: {
                    labels: ['Banking', 'Healthcare', 'Retail', 'Government', 'Education', 'Technology'],
                    datasets: [{
                        label: 'Risk Level',
                        data: [95, 78, 65, 88, 52, 72],
                        backgroundColor: 'rgba(0, 255, 102, 0.2)',
                        borderColor: '#00ff66',
                        pointBackgroundColor: '#00ff66',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#00ff66'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        }
                    },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#e0e0e0' },
                            ticks: { 
                                color: '#a0a0a0',
                                backdropColor: 'transparent'
                            }
                        }
                    }
                }
            });
        }

        // Financial Loss vs Users Affected
        const financialCtx = document.getElementById('financialChart');
        if (financialCtx) {
            new Chart(financialCtx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Cyber Incidents',
                        data: [
                            {x: 50000, y: 1000},
                            {x: 120000, y: 2500},
                            {x: 85000, y: 1800},
                            {x: 200000, y: 4200},
                            {x: 150000, y: 3200},
                            {x: 300000, y: 6500},
                            {x: 250000, y: 5800}
                        ],
                        backgroundColor: 'rgba(0, 243, 255, 0.6)',
                        borderColor: '#00f3ff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#e0e0e0' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Users: ${context.parsed.x}, Loss: $${context.parsed.y}M`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Users Affected',
                                color: '#e0e0e0'
                            },
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Financial Loss (Millions $)',
                                color: '#e0e0e0'
                            },
                            ticks: { color: '#a0a0a0' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }
    };

    // Create Correlation Heatmap
    const createHeatmap = () => {
        const heatmapContainer = document.getElementById('heatmapContainer');
        if (!heatmapContainer) return;

        const data = [
            { x: 'Phishing', y: 'Phishing', value: 1.0 },
            { x: 'Phishing', y: 'Ransomware', value: 0.3 },
            { x: 'Phishing', y: 'DDoS', value: 0.2 },
            { x: 'Phishing', y: 'Malware', value: 0.6 },
            { x: 'Phishing', y: 'SQL Injection', value: 0.1 },
            
            { x: 'Ransomware', y: 'Phishing', value: 0.3 },
            { x: 'Ransomware', y: 'Ransomware', value: 1.0 },
            { x: 'Ransomware', y: 'DDoS', value: 0.4 },
            { x: 'Ransomware', y: 'Malware', value: 0.7 },
            { x: 'Ransomware', y: 'SQL Injection', value: 0.2 },
            
            { x: 'DDoS', y: 'Phishing', value: 0.2 },
            { x: 'DDoS', y: 'Ransomware', value: 0.4 },
            { x: 'DDoS', y: 'DDoS', value: 1.0 },
            { x: 'DDoS', y: 'Malware', value: 0.3 },
            { x: 'DDoS', y: 'SQL Injection', value: 0.5 },
            
            { x: 'Malware', y: 'Phishing', value: 0.6 },
            { x: 'Malware', y: 'Ransomware', value: 0.7 },
            { x: 'Malware', y: 'DDoS', value: 0.3 },
            { x: 'Malware', y: 'Malware', value: 1.0 },
            { x: 'Malware', y: 'SQL Injection', value: 0.4 },
            
            { x: 'SQL Injection', y: 'Phishing', value: 0.1 },
            { x: 'SQL Injection', y: 'Ransomware', value: 0.2 },
            { x: 'SQL Injection', y: 'DDoS', value: 0.5 },
            { x: 'SQL Injection', y: 'Malware', value: 0.4 },
            { x: 'SQL Injection', y: 'SQL Injection', value: 1.0 }
        ];

        const labels = ['Phishing', 'Ransomware', 'DDoS', 'Malware', 'SQL Injection'];
        
        let heatmapHTML = '<div class="heatmap-grid">';
        
        labels.forEach((yLabel, y) => {
            heatmapHTML += '<div class="heatmap-row">';
            
            if (y === 0) {
                heatmapHTML += '<div class="heatmap-cell corner"></div>';
                labels.forEach((xLabel, x) => {
                    heatmapHTML += `<div class="heatmap-cell header">${xLabel}</div>`;
                });
                heatmapHTML += '</div><div class="heatmap-row">';
                heatmapHTML += `<div class="heatmap-cell header">${yLabel}</div>`;
            } else {
                heatmapHTML += `<div class="heatmap-cell header">${yLabel}</div>`;
            }
            
            labels.forEach((xLabel, x) => {
                const cellData = data.find(d => d.x === xLabel && d.y === yLabel);
                const intensity = cellData ? cellData.value : 0;
                const color = intensity > 0.7 ? '#ff6b6b' : 
                             intensity > 0.4 ? '#ffa726' : 
                             intensity > 0.2 ? '#42a5f5' : '#81c784';
                
                heatmapHTML += `<div class="heatmap-cell" style="background-color: ${color}; opacity: ${0.3 + intensity * 0.7};" title="${xLabel} vs ${yLabel}: ${intensity.toFixed(2)}">${intensity.toFixed(2)}</div>`;
            });
            
            heatmapHTML += '</div>';
        });
        
        heatmapHTML += '</div>';
        heatmapContainer.innerHTML = heatmapHTML;
    };

    // Initialize charts when dashboard is shown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active-section') && 
                mutation.target.id === 'dashboard') {
                setTimeout(() => {
                    initializeCharts();
                    createHeatmap();
                }, 100);
            }
        });
    });

    sections.forEach(section => {
        observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    });

    // Initialize
    loadChatHistory();
});
