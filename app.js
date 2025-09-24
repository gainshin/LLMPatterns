// AI 法規領航員 - 搜尋模式演進示範

class AIRegulationNavigator {
    constructor() {
        this.currentMode = 'traditional';
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.setupModeSelector();
        this.setupSearchHandlers();
        this.loadDefaultContent();
    }

    setupModeSelector() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                modeButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Switch mode
                this.currentMode = btn.dataset.mode;
                this.switchMode();
            });
        });
    }

    setupSearchHandlers() {
        document.querySelectorAll('.search-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleSearch());
        });

        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        });
    }

    switchMode() {
        // Hide all modes
        document.querySelectorAll('.search-mode').forEach(mode => {
            mode.classList.add('hidden');
        });

        // Show current mode
        const currentModeElement = document.getElementById(`${this.currentMode}-mode`);
        if (currentModeElement) {
            currentModeElement.classList.remove('hidden');
        }

        this.loadDefaultContent();
    }

    handleSearch() {
        const activeInput = document.querySelector(`#${this.currentMode}-mode .search-input`);
        const query = activeInput.value.trim();
        
        if (!query) return;

        switch (this.currentMode) {
            case 'traditional':
                this.performTraditionalSearch(query);
                break;
            case 'hybrid':
                this.performHybridSearch(query);
                break;
            case 'conversational':
                this.performConversationalSearch(query);
                break;
        }
    }

    loadDefaultContent() {
        switch (this.currentMode) {
            case 'traditional':
                this.performTraditionalSearch('AI 法規');
                break;
            case 'hybrid':
                this.performHybridSearch('我是一家做智慧醫療影像辨識的新創，這法案對我有什麼衝擊？');
                break;
            case 'conversational':
                this.initializeConversation();
                break;
        }
    }

    performTraditionalSearch(query) {
        const resultsContainer = document.getElementById('traditional-results');
        
        // Simulate traditional keyword matching
        const traditionalResults = this.generateTraditionalResults(query);
        
        resultsContainer.innerHTML = `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <h4><i class="fas fa-info-circle"></i> 傳統搜尋特點</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>基於關鍵詞匹配</li>
                    <li>靜態結果展示</li>
                    <li>需要用戶自行篩選整合</li>
                    <li>無法理解複雜情境</li>
                </ul>
            </div>
            
            <div class="search-stats" style="margin-bottom: 20px; color: #666;">
                找到約 ${traditionalResults.length} 筆結果 (0.15 秒)
            </div>
            
            ${traditionalResults.map(result => `
                <div class="result-item">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                    <div class="result-meta">
                        <i class="fas fa-link"></i> ${result.url} • 
                        <i class="fas fa-calendar"></i> ${result.date}
                    </div>
                </div>
            `).join('')}
        `;
    }

    performHybridSearch(query) {
        const resultsContainer = document.getElementById('hybrid-results');
        
        // AI Intent Analysis
        const intentAnalysis = this.analyzeIntent(query);
        
        resultsContainer.innerHTML = `
            <div class="ai-response">
                <h3><i class="fas fa-brain"></i> AI 意圖理解</h3>
                <p><strong>用戶角色：</strong>${intentAnalysis.userRole}</p>
                <p><strong>業務領域：</strong>${intentAnalysis.domain}</p>
                <p><strong>風險等級：</strong><span style="color: ${intentAnalysis.riskLevel === '高風險' ? '#ff6b6b' : '#51cf66'}">${intentAnalysis.riskLevel}</span></p>
                <p><strong>關鍵需求：</strong>${intentAnalysis.needs.join('、')}</p>
                
                <div style="margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px;">
                    <strong>🎯 個人化建議：</strong>
                    <div style="margin-top: 10px;">
                        ${intentAnalysis.recommendations.map(rec => `
                            <div style="margin: 8px 0;">• ${rec}</div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active" data-tab="structured">結構化回答</button>
                <button class="tab" data-tab="categories">分類結果</button>
                <button class="tab" data-tab="traditional">傳統結果</button>
            </div>

            <div class="tab-content active" id="structured">
                ${this.generateStructuredResponse(intentAnalysis)}
            </div>

            <div class="tab-content" id="categories">
                <div class="category-grid">
                    ${this.generateCategoryResults().map(cat => `
                        <div class="category-item">
                            <div class="category-icon">${cat.icon}</div>
                            <h4>${cat.title}</h4>
                            <p>${cat.description}</p>
                            <small>${cat.count} 筆相關資料</small>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="tab-content" id="traditional">
                <div class="expandable-section">
                    <div class="expandable-header">
                        <span>傳統搜尋結果 (12)</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="expandable-content">
                        ${this.generateTraditionalResults(query).slice(0, 3).map(result => `
                            <div class="result-item">
                                <div class="result-title">${result.title}</div>
                                <div class="result-description">${result.description}</div>
                                <div class="result-meta">
                                    相關度: ${result.relevance}% • ${result.date}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.setupTabs();
        this.setupExpandableSection();
    }

    performConversationalSearch(query) {
        const container = document.getElementById('conversation-container');
        
        if (this.conversationHistory.length === 0 && !query) {
            // Initialize conversation
            this.initializeConversation();
            return;
        }

        if (query) {
            // Add user message
            this.conversationHistory.push({
                type: 'user',
                message: query,
                timestamp: new Date()
            });

            // Generate AI response
            const aiResponse = this.generateAIResponse(query);
            this.conversationHistory.push({
                type: 'ai',
                message: aiResponse.message,
                followUp: aiResponse.followUp,
                timestamp: new Date()
            });

            // Clear input
            document.querySelector('#conversational-mode .search-input').value = '';
        }

        this.renderConversation();
    }

    initializeConversation() {
        const container = document.getElementById('conversation-container');
        container.innerHTML = `
            <div class="message">
                <div class="ai-message">
                    <h4><i class="fas fa-robot"></i> AI 法規顧問</h4>
                    <p>您好！我是您的專屬 AI 法規領航員。我能協助您：</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>分析法規對您業務的具體影響</li>
                        <li>提供個人化合規建議</li>
                        <li>解答複雜的法規疑問</li>
                        <li>協助制定合規策略</li>
                    </ul>
                    <p><strong>請告訴我您的具體情況，我會為您量身定制解答：</strong></p>
                    
                    <div class="follow-up-questions">
                        <button class="question-btn" onclick="navigator.askQuestion('我是一家 AI 新創公司，需要了解相關法規')">
                            我是一家 AI 新創公司，需要了解相關法規
                        </button>
                        <button class="question-btn" onclick="navigator.askQuestion('我們正在開發醫療 AI 產品，合規要求是什麼？')">
                            我們正在開發醫療 AI 產品，合規要求是什麼？
                        </button>
                        <button class="question-btn" onclick="navigator.askQuestion('如何評估 AI 系統的風險等級？')">
                            如何評估 AI 系統的風險等級？
                        </button>
                        <button class="question-btn" onclick="navigator.askQuestion('我需要申請什麼認證或許可？')">
                            我需要申請什麼認證或許可？
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.conversationHistory = [];
        container.classList.add('active');
    }

    askQuestion(question) {
        const input = document.querySelector('#conversational-mode .search-input');
        input.value = question;
        this.performConversationalSearch(question);
    }

    renderConversation() {
        const container = document.getElementById('conversation-container');
        container.classList.add('active');
        
        const conversationHTML = this.conversationHistory.map(msg => {
            if (msg.type === 'user') {
                return `
                    <div class="message">
                        <div class="user-message">
                            <strong><i class="fas fa-user"></i> 您</strong>
                            <p>${msg.message}</p>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="message">
                        <div class="ai-message">
                            <strong><i class="fas fa-robot"></i> AI 法規顧問</strong>
                            <div>${msg.message}</div>
                            ${msg.followUp ? `
                                <div class="follow-up-questions">
                                    <p><strong>🤔 您可能還想了解：</strong></p>
                                    ${msg.followUp.map(q => `
                                        <button class="question-btn" onclick="navigator.askQuestion('${q}')">
                                            ${q}
                                        </button>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        }).join('');

        container.innerHTML = conversationHTML;
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    // Helper methods for generating content

    generateTraditionalResults(query) {
        const keywords = query.toLowerCase().split(' ');
        const allResults = [
            {
                title: "人工智慧發展法案 - 全文",
                description: "完整的人工智慧發展法案條文，包含定義、適用範圍、管理機制等詳細規定。",
                url: "law.gov.tw/ai-act-full",
                date: "2024-01-15",
                relevance: 95
            },
            {
                title: "AI 系統風險分級管理辦法",
                description: "針對不同風險等級的 AI 系統制定的管理規範，包含高風險 AI 的特別要求。",
                url: "ndc.gov.tw/ai-risk-management",
                date: "2024-02-20",
                relevance: 88
            },
            {
                title: "醫療器材 AI 軟體認證流程",
                description: "衛福部針對醫療用途 AI 軟體的認證申請流程和技術要求說明。",
                url: "mohw.gov.tw/medical-ai-cert",
                date: "2024-01-30",
                relevance: 82
            },
            {
                title: "AI 法規常見問答集",
                description: "整理業界最常詢問的 AI 法規相關問題與官方回覆。",
                url: "faq.ai-regulation.tw",
                date: "2024-03-01",
                relevance: 75
            },
            {
                title: "新創企業 AI 合規指南",
                description: "專為新創企業設計的 AI 法規合規指南，包含實務操作建議。",
                url: "startup.gov.tw/ai-compliance",
                date: "2024-02-15",
                relevance: 70
            }
        ];

        return allResults;
    }

    analyzeIntent(query) {
        // Simulate AI intent understanding
        const analysis = {
            userRole: "AI 新創企業",
            domain: "智慧醫療影像辨識",
            riskLevel: "高風險",
            needs: ["合規認證", "風險評估", "技術標準", "市場准入"],
            recommendations: [
                "您的醫療 AI 產品屬於高風險應用，需要完整的認證流程",
                "建議先進行風險評估，確認具體的合規要求",
                "可申請監理沙盒，降低初期合規成本",
                "建議諮詢專業法規顧問，制定合規時程規劃"
            ]
        };

        return analysis;
    }

    generateStructuredResponse(intentAnalysis) {
        return `
            <div class="result-item">
                <div class="result-title">🎯 針對您的情況的專業分析</div>
                <div class="result-description">
                    <p><strong>影響分析：</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>直接影響：</strong>作為醫療 AI 影像辨識系統，您的產品將被歸類為高風險 AI 應用</li>
                        <li><strong>認證需求：</strong>需要通過衛福部醫材認證 + AI 法案合規認證雙重審查</li>
                        <li><strong>技術要求：</strong>必須建立完整的演算法驗證、風險管控和品質管理制度</li>
                        <li><strong>時程影響：</strong>預估認證流程 12-18 個月，建議提前規劃</li>
                    </ul>
                </div>
            </div>

            <div class="result-item">
                <div class="result-title">📋 立即行動清單</div>
                <div class="result-description">
                    <ol style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>風險評估 (1-2個月)：</strong>委託第三方機構進行 AI 系統風險評估</li>
                        <li><strong>技術文件準備 (2-3個月)：</strong>建立演算法說明書、驗證報告等</li>
                        <li><strong>品質管理制度 (1個月)：</strong>建置符合法規要求的 QMS</li>
                        <li><strong>申請認證 (12-18個月)：</strong>同時進行醫材與 AI 法案認證</li>
                    </ol>
                </div>
            </div>

            <div class="result-item">
                <div class="result-title">💰 資源與補助</div>
                <div class="result-description">
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>監理沙盒計畫：</strong>可申請最高 500 萬元補助，降低合規成本</li>
                        <li><strong>AI 創新應用補助：</strong>經濟部提供技術驗證資金支援</li>
                        <li><strong>法規諮詢服務：</strong>政府提供免費初步法規諮詢</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateCategoryResults() {
        return [
            {
                icon: "⚖️",
                title: "法規條文",
                description: "相關法案全文與解釋",
                count: 15
            },
            {
                icon: "🏥",
                title: "醫療認證",
                description: "醫療器材AI認證流程",
                count: 8
            },
            {
                icon: "🔍",
                title: "風險評估",
                description: "AI系統風險分級指南",
                count: 12
            },
            {
                icon: "🚀",
                title: "新創支援",
                description: "新創企業專屬資源",
                count: 6
            },
            {
                icon: "💰",
                title: "補助資源",
                description: "政府補助與支援計畫",
                count: 9
            },
            {
                icon: "📚",
                title: "技術標準",
                description: "AI技術規範與標準",
                count: 18
            }
        ];
    }

    generateAIResponse(query) {
        // Simulate contextual AI responses
        const responses = {
            "我是一家 AI 新創公司，需要了解相關法規": {
                message: `
                    <p>很高興為您服務！針對 AI 新創公司，以下是您需要重點關注的法規面向：</p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h4>🎯 核心法規架構</h4>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>人工智慧發展法：</strong>主要規範框架</li>
                            <li><strong>個資法：</strong>數據處理與隱私保護</li>
                            <li><strong>行業特定法規：</strong>根據應用領域而定</li>
                        </ul>
                    </div>

                    <p><strong>💡 新創友善措施：</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>監理沙盒計畫：可申請法規彈性適用</li>
                        <li>分階段合規：根據公司發展階段調整要求</li>
                        <li>免費諮詢服務：政府提供初期法規指導</li>
                    </ul>
                `,
                followUp: [
                    "我們的AI產品屬於哪個風險等級？",
                    "新創公司有哪些合規豁免或優惠？",
                    "如何申請監理沙盒？",
                    "需要聘請法規顧問嗎？"
                ]
            },
            "我們正在開發醫療 AI 產品，合規要求是什麼？": {
                message: `
                    <p>醫療 AI 產品確實是高度管制的領域，讓我為您詳細說明：</p>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h4>⚠️ 重要提醒</h4>
                        <p>醫療 AI 屬於<strong>高風險應用</strong>，需要雙重認證：</p>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                            <li>衛福部醫療器材許可證</li>
                            <li>AI 法案高風險系統認證</li>
                        </ol>
                    </div>

                    <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h4>📋 合規檢查清單</h4>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>✅ 演算法透明度文件</li>
                            <li>✅ 臨床驗證報告</li>
                            <li>✅ 風險管理檔案</li>
                            <li>✅ 品質管理系統 (ISO 13485)</li>
                            <li>✅ 網路安全評估</li>
                        </ul>
                    </div>

                    <p><strong>⏰ 建議時程：</strong>整體認證流程約需 18-24 個月</p>
                `,
                followUp: [
                    "臨床驗證需要多長時間？",
                    "ISO 13485 認證如何申請？",
                    "可以邊開發邊申請認證嗎？",
                    "有推薦的認證顧問公司嗎？"
                ]
            }
        };

        return responses[query] || {
            message: `
                <p>感謝您的提問。根據您提供的資訊，我建議：</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>先確認您的 AI 應用屬於哪個風險等級</li>
                    <li>了解相關的行業特定法規要求</li>
                    <li>評估是否需要申請相關許可或認證</li>
                </ul>
                <p>需要更具體的協助嗎？請提供更多關於您業務的詳細資訊。</p>
            `,
            followUp: [
                "我的AI產品風險等級如何判定？",
                "需要哪些具體的認證文件？",
                "合規成本大概是多少？",
                "有沒有快速合規的方法？"
            ]
        };
    }

    setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }

    setupExpandableSection() {
        document.querySelectorAll('.expandable-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('i');
                
                if (content.classList.contains('expanded')) {
                    content.classList.remove('expanded');
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    content.classList.add('expanded');
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            });
        });
    }
}

// Initialize the application
const navigator = new AIRegulationNavigator();

// Make askQuestion globally available
window.navigator = navigator;