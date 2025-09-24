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
        this.setupDesignInsights();
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

        // Dispatch mode change event
        document.dispatchEvent(new CustomEvent('modeChanged', { detail: { mode: this.currentMode } }));

        // Update insights trigger visibility
        this.updateInsightsTrigger();

        this.loadDefaultContent();
    }

    handleSearch() {
        const activeInput = document.querySelector(`#${this.currentMode}-mode .search-input`);
        
        if (!activeInput) {
            console.error('No active input found for mode:', this.currentMode);
            return;
        }
        
        const query = activeInput.value.trim();
        
        if (!query) {
            console.warn('Empty query, ignoring search');
            return;
        }

        console.log('Performing search:', { mode: this.currentMode, query });

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
            default:
                console.error('Unknown search mode:', this.currentMode);
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
        
        // Ensure insights trigger is properly set up after content load
        setTimeout(() => {
            this.updateInsightsTrigger();
        }, 100);
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

    setupDesignInsights() {
        const trigger = document.getElementById('insights-trigger');
        const panel = document.getElementById('insights-panel');
        const overlay = document.getElementById('design-overlay');
        const closeBtn = document.getElementById('close-insights');

        if (!trigger || !panel || !overlay || !closeBtn) {
            console.error('Design insights elements not found');
            return;
        }

        // Show/hide trigger based on current mode
        this.updateInsightsTrigger();

        // Open insights panel
        trigger.addEventListener('click', () => {
            console.log('Insights trigger clicked');
            this.openInsightsPanel();
        });

        // Close insights panel
        closeBtn.addEventListener('click', () => {
            console.log('Closing insights panel');
            this.closeInsightsPanel();
        });

        overlay.addEventListener('click', () => {
            console.log('Overlay clicked, closing insights');
            this.closeInsightsPanel();
        });

        // Update insights when mode changes
        document.addEventListener('modeChanged', () => {
            this.updateInsightsTrigger();
        });
    }

    updateInsightsTrigger() {
        const trigger = document.getElementById('insights-trigger');
        
        if (!trigger) {
            console.error('Insights trigger element not found');
            return;
        }
        
        console.log('Updating insights trigger for mode:', this.currentMode);
        
        if (this.currentMode === 'hybrid' || this.currentMode === 'conversational') {
            trigger.classList.add('visible');
            console.log('Insights trigger should be visible');
        } else {
            trigger.classList.remove('visible');
            console.log('Insights trigger should be hidden');
        }
    }

    openInsightsPanel() {
        const panel = document.getElementById('insights-panel');
        const overlay = document.getElementById('design-overlay');
        const title = document.getElementById('insights-title');
        const subtitle = document.getElementById('insights-subtitle');
        const content = document.getElementById('insights-content');

        // Update content based on current mode
        if (this.currentMode === 'hybrid') {
            title.textContent = '混合式智慧搜尋設計理念';
            subtitle.textContent = 'AI 理解 + 傳統搜尋的完美融合';
            content.innerHTML = this.getHybridInsightsContent();
        } else if (this.currentMode === 'conversational') {
            title.textContent = '對話式搜尋設計理念';
            subtitle.textContent = '自然互動，智慧引導的全新體驗';
            content.innerHTML = this.getConversationalInsightsContent();
        }

        // Show panel and overlay
        overlay.classList.add('visible');
        panel.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeInsightsPanel() {
        const panel = document.getElementById('insights-panel');
        const overlay = document.getElementById('design-overlay');

        overlay.classList.remove('visible');
        panel.classList.remove('open');
        document.body.style.overflow = '';
    }

    getHybridInsightsContent() {
        return `
            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon cost-reduction">💰</div>
                    <h4>認知成本降低</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        傳統搜尋讓用戶承擔過多認知負擔，混合式搜尋通過 AI 理解大幅降低各項成本。
                    </p>
                    <div class="cost-breakdown">
                        <div class="cost-item">
                            <div class="cost-arrow">↓</div>
                            <div class="cost-content">
                                <h5>查詢構思成本</h5>
                                <p class="cost-problem">解決「不知道該搜什麼」的困擾</p>
                            </div>
                        </div>
                        <div class="cost-item">
                            <div class="cost-arrow">↓</div>
                            <div class="cost-content">
                                <h5>結果篩選成本</h5>
                                <p class="cost-problem">解決「結果太多，不知從何開始」</p>
                            </div>
                        </div>
                        <div class="cost-item">
                            <div class="cost-arrow">↓</div>
                            <div class="cost-content">
                                <h5>資訊整合成本</h5>
                                <p class="cost-problem">解決「資訊太分散，難以理解」</p>
                            </div>
                        </div>
                        <div class="cost-item">
                            <div class="cost-arrow">↓</div>
                            <div class="cost-content">
                                <h5>驗證成本</h5>
                                <p class="cost-problem">解決「找到的不是我要的」</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon personalization">🎯</div>
                    <h4>個人化智慧理解</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        AI 能夠理解用戶的角色、行業背景和具體需求，提供量身定制的解答。
                    </p>
                    <div class="insight-benefit">
                        <strong>價值體現：</strong>從「一體適用」轉向「個人化精準」，大幅提升信息的相關性和實用性。
                    </div>
                </div>
            </div>

            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon integration">🔄</div>
                    <h4>智慧與傳統的平衡</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        保留傳統搜尋的深度探索能力，同時提供 AI 的智慧整理和引導。
                    </p>
                    <div class="insight-benefit">
                        <strong>設計哲學：</strong>不是取代傳統搜尋，而是在需要時提供更智慧的起點和導航。
                    </div>
                </div>
            </div>
        `;
    }

    getConversationalInsightsContent() {
        return `
            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon conversation">💬</div>
                    <h4>對話式、多輪查詢</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        用戶希望能夠使用自然語言提問，並與系統進行連續、漸進式的多輪對話，而非每次重新開始。
                    </p>
                    <div class="insight-benefit">
                        <strong>核心價值：</strong>模擬人與專家顧問的自然對話模式，讓複雜諮詢變得輕鬆直觀。
                    </div>
                </div>
            </div>

            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon personalization">📊</div>
                    <h4>個人化、即時洞察</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        不僅要提供搜尋結果，更要提供即時分析和個人化見解，幫助用戶快速做出決策。
                    </p>
                    <div class="insight-benefit">
                        <strong>智慧升級：</strong>從「資訊檢索」進化為「智慧諮詢」，主動提供決策支援。
                    </div>
                </div>
            </div>

            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon integration">🧠</div>
                    <h4>動態澄清與多源整合</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        智慧搜尋系統應能主動提出澄清問題，並自動整合多個來源的資訊，提供更全面的回覆。
                    </p>
                    <div class="insight-benefit">
                        <strong>互動智慧：</strong>系統會主動引導用戶深入探索，發現用戶可能沒想到的重要問題。
                    </div>
                </div>
            </div>

            <div class="insight-section">
                <div class="insight-header">
                    <div class="insight-icon cost-reduction">🎨</div>
                    <h4>多模態內容呈現</h4>
                </div>
                <div class="insight-body">
                    <p class="insight-description">
                        結合文字、圖表、影片、互動元素等多種媒體形式，讓複雜的法規資訊更易理解和消化。
                    </p>
                    <div class="insight-benefit">
                        <strong>體驗創新：</strong>打破純文字限制，用視覺化和互動設計降低理解門檻。
                    </div>
                </div>
            </div>
        `;
    }

    setupMultimodalTabs() {
        // Setup content tabs for multimodal content
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-tab')) {
                const tab = e.target;
                const contentType = tab.dataset.content;
                const container = tab.closest('.multimodal-content');
                
                // Remove active class from all tabs in this container
                container.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
                container.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                const panel = container.querySelector(`#${contentType}`);
                if (panel) {
                    panel.classList.add('active');
                }
            }
        });

        // Setup interactive cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.info-card') || e.target.closest('.media-item') || e.target.closest('.resource-card')) {
                const card = e.target.closest('.info-card, .media-item, .resource-card');
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            }
        });
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
                            🚀 我是一家 AI 新創公司，需要了解相關法規
                        </button>
                        <button class="question-btn" onclick="navigator.askQuestion('我們正在開發醫療 AI 產品，合規要求是什麼？')">
                            🏥 我們正在開發醫療 AI 產品，合規要求是什麼？
                        </button>
                        <button class="question-btn" onclick="navigator.askQuestion('如何評估 AI 系統的風險等級？')">
                            🎯 如何評估 AI 系統的風險等級？
                        </button>
                        <button class="question-btn" onclick="navigator.askQuestion('我需要申請什麼認證或許可？')">
                            📋 我需要申請什麼認證或許可？
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
        
        // Setup multimodal content after rendering
        setTimeout(() => {
            this.setupMultimodalTabs();
        }, 100);
        
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
        // Simulate contextual AI responses with multimodal content
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

                    <div class="multimodal-content">
                        <div class="content-tabs">
                            <button class="content-tab active" data-content="overview">法規概覽</button>
                            <button class="content-tab" data-content="flowchart">流程圖解</button>
                            <button class="content-tab" data-content="examples">案例分析</button>
                        </div>
                        
                        <div class="content-panel active" id="overview">
                            <div class="info-grid">
                                <div class="info-card">
                                    <div class="info-icon">📋</div>
                                    <h4>法規檢查清單</h4>
                                    <p>完整的合規檢核項目</p>
                                    <small>12 項必備文件</small>
                                </div>
                                <div class="info-card">
                                    <div class="info-icon">🎯</div>
                                    <h4>風險評估工具</h4>
                                    <p>AI 系統風險等級判定</p>
                                    <small>線上評估系統</small>
                                </div>
                                <div class="info-card">
                                    <div class="info-icon">💰</div>
                                    <h4>補助資源</h4>
                                    <p>政府補助計畫整理</p>
                                    <small>最高 500 萬補助</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-panel" id="flowchart">
                            <div class="flowchart-container">
                                <div class="flow-step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h4>風險評估</h4>
                                        <p>確定 AI 系統風險等級</p>
                                    </div>
                                </div>
                                <div class="flow-arrow">→</div>
                                <div class="flow-step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h4>準備文件</h4>
                                        <p>建立技術文件與管理制度</p>
                                    </div>
                                </div>
                                <div class="flow-arrow">→</div>
                                <div class="flow-step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h4>申請認證</h4>
                                        <p>提交認證申請並接受審查</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-panel" id="examples">
                            <div class="example-cases">
                                <div class="case-card">
                                    <div class="case-header">
                                        <span class="case-tag success">成功案例</span>
                                        <h4>智慧客服系統</h4>
                                    </div>
                                    <p>某新創公司的 AI 客服系統成功通過認證，從申請到核准僅花費 8 個月。</p>
                                    <div class="case-metrics">
                                        <span>⏱️ 8個月</span>
                                        <span>💰 節省50%成本</span>
                                    </div>
                                </div>
                                <div class="case-card">
                                    <div class="case-header">
                                        <span class="case-tag warning">注意事項</span>
                                        <h4>醫療影像AI</h4>
                                    </div>
                                    <p>醫療領域 AI 需要額外的臨床驗證，建議預留 18-24 個月的認證時間。</p>
                                    <div class="case-metrics">
                                        <span>⏱️ 18-24個月</span>
                                        <span>📊 需臨床試驗</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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

                    <div class="multimodal-content">
                        <div class="content-tabs">
                            <button class="content-tab active" data-content="requirements">認證要求</button>
                            <button class="content-tab" data-content="timeline">時程規劃</button>
                            <button class="content-tab" data-content="resources">實用資源</button>
                        </div>
                        
                        <div class="content-panel active" id="requirements">
                            <div class="requirement-checklist">
                                <div class="checklist-item">
                                    <div class="check-icon">✅</div>
                                    <div class="check-content">
                                        <h4>演算法透明度文件</h4>
                                        <p>詳細說明 AI 模型架構、訓練數據、決策邏輯</p>
                                        <div class="requirement-media">
                                            <div class="media-item">
                                                <span class="media-icon">📄</span>
                                                <span>技術規格書範本</span>
                                            </div>
                                            <div class="media-item">
                                                <span class="media-icon">🎥</span>
                                                <span>填寫教學影片</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="checklist-item">
                                    <div class="check-icon">✅</div>
                                    <div class="check-content">
                                        <h4>臨床驗證報告</h4>
                                        <p>證明 AI 系統在真實醫療環境中的有效性和安全性</p>
                                        <div class="requirement-media">
                                            <div class="media-item">
                                                <span class="media-icon">📊</span>
                                                <span>驗證數據範例</span>
                                            </div>
                                            <div class="media-item">
                                                <span class="media-icon">🏥</span>
                                                <span>合作醫院清單</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="checklist-item">
                                    <div class="check-icon">✅</div>
                                    <div class="check-content">
                                        <h4>品質管理系統 (ISO 13485)</h4>
                                        <p>建立符合醫療器材品質標準的管理制度</p>
                                        <div class="requirement-media">
                                            <div class="media-item">
                                                <span class="media-icon">📋</span>
                                                <span>ISO 13485 指南</span>
                                            </div>
                                            <div class="media-item">
                                                <span class="media-icon">🎓</span>
                                                <span>線上課程推薦</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-panel" id="timeline">
                            <div class="timeline-visual">
                                <div class="timeline-item">
                                    <div class="timeline-marker start">開始</div>
                                    <div class="timeline-content">
                                        <h4>準備階段 (3-6個月)</h4>
                                        <ul>
                                            <li>技術文件準備</li>
                                            <li>品質制度建立</li>
                                            <li>合作醫院洽談</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="timeline-item">
                                    <div class="timeline-marker process">進行中</div>
                                    <div class="timeline-content">
                                        <h4>臨床驗證 (6-12個月)</h4>
                                        <ul>
                                            <li>IRB 倫理審查</li>
                                            <li>臨床試驗執行</li>
                                            <li>數據收集分析</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="timeline-item">
                                    <div class="timeline-marker end">完成</div>
                                    <div class="timeline-content">
                                        <h4>認證申請 (6-9個月)</h4>
                                        <ul>
                                            <li>文件送審</li>
                                            <li>現場查核</li>
                                            <li>許可證核發</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-panel" id="resources">
                            <div class="resource-grid">
                                <div class="resource-card">
                                    <div class="resource-icon">🏛️</div>
                                    <h4>衛福部食藥署</h4>
                                    <p>醫療器材認證主管機關</p>
                                    <div class="resource-links">
                                        <a href="#" class="resource-link">📞 諮詢專線</a>
                                        <a href="#" class="resource-link">📧 線上申請</a>
                                    </div>
                                </div>
                                
                                <div class="resource-card">
                                    <div class="resource-icon">🏥</div>
                                    <h4>臨床試驗網路</h4>
                                    <p>配合醫院與研究機構</p>
                                    <div class="resource-links">
                                        <a href="#" class="resource-link">🔍 醫院查詢</a>
                                        <a href="#" class="resource-link">📋 合作流程</a>
                                    </div>
                                </div>
                                
                                <div class="resource-card">
                                    <div class="resource-icon">💰</div>
                                    <h4>補助計畫</h4>
                                    <p>政府與民間資金支援</p>
                                    <div class="resource-links">
                                        <a href="#" class="resource-link">💵 SBIR 計畫</a>
                                        <a href="#" class="resource-link">🏆 創新獎勵</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p><strong>⏰ 建議時程：</strong>整體認證流程約需 18-24 個月</p>
                `,
                followUp: [
                    "臨床驗證需要多長時間？",
                    "ISO 13485 認證如何申請？",
                    "可以邊開發邊申請認證嗎？",
                    "有推薦的認證顧問公司嗎？"
                ]
            },
            "如何評估 AI 系統的風險等級？": {
                message: `
                    <p>AI 系統風險等級評估是合規的第一步，讓我為您詳細說明評估標準：</p>
                    
                    <div class="multimodal-content">
                        <div class="content-tabs">
                            <button class="content-tab active" data-content="risk-matrix">風險矩陣</button>
                            <button class="content-tab" data-content="evaluation-tool">評估工具</button>
                            <button class="content-tab" data-content="examples">應用實例</button>
                        </div>
                        
                        <div class="content-panel active" id="risk-matrix">
                            <div class="risk-assessment">
                                <h4>🎯 風險評估維度</h4>
                                <div class="info-grid">
                                    <div class="info-card high-risk">
                                        <div class="info-icon">🚨</div>
                                        <h4>高風險應用</h4>
                                        <p>醫療、金融、交通安全</p>
                                        <div class="risk-examples">
                                            <span>💊 醫療診斷</span>
                                            <span>🚗 自動駕駛</span>
                                            <span>💰 信貸審核</span>
                                        </div>
                                    </div>
                                    <div class="info-card medium-risk">
                                        <div class="info-icon">⚠️</div>
                                        <h4>中風險應用</h4>
                                        <p>教育、人力資源管理</p>
                                        <div class="risk-examples">
                                            <span>📚 智慧教學</span>
                                            <span>👥 履歷篩選</span>
                                            <span>🎯 個人推薦</span>
                                        </div>
                                    </div>
                                    <div class="info-card low-risk">
                                        <div class="info-icon">✅</div>
                                        <h4>低風險應用</h4>
                                        <p>娛樂、一般商業應用</p>
                                        <div class="risk-examples">
                                            <span>🎮 遊戲 AI</span>
                                            <span>🛒 商品推薦</span>
                                            <span>💬 聊天機器人</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-panel" id="evaluation-tool">
                            <div class="evaluation-steps">
                                <h4>📋 自我評估步驟</h4>
                                <div class="step-by-step">
                                    <div class="eval-step">
                                        <div class="step-header">
                                            <span class="step-num">1</span>
                                            <h4>應用領域識別</h4>
                                        </div>
                                        <div class="step-content">
                                            <p>確認您的 AI 系統應用在哪個領域</p>
                                            <div class="interactive-checklist">
                                                <label><input type="checkbox"> 醫療保健</label>
                                                <label><input type="checkbox"> 金融服務</label>
                                                <label><input type="checkbox"> 交通運輸</label>
                                                <label><input type="checkbox"> 教育培訓</label>
                                                <label><input type="checkbox"> 其他領域</label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="eval-step">
                                        <div class="step-header">
                                            <span class="step-num">2</span>
                                            <h4>影響範圍評估</h4>
                                        </div>
                                        <div class="step-content">
                                            <p>評估 AI 決策對使用者的影響程度</p>
                                            <div class="impact-scale">
                                                <div class="scale-item">
                                                    <span class="scale-dot high"></span>
                                                    <span>重大影響 (生命安全)</span>
                                                </div>
                                                <div class="scale-item">
                                                    <span class="scale-dot medium"></span>
                                                    <span>中等影響 (權益相關)</span>
                                                </div>
                                                <div class="scale-item">
                                                    <span class="scale-dot low"></span>
                                                    <span>輕微影響 (便利性)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="eval-step">
                                        <div class="step-header">
                                            <span class="step-num">3</span>
                                            <h4>技術特徵分析</h4>
                                        </div>
                                        <div class="step-content">
                                            <p>分析 AI 系統的技術複雜度</p>
                                            <div class="tech-features">
                                                <div class="feature-item">
                                                    <span class="feature-icon">🧠</span>
                                                    <div>
                                                        <h5>深度學習模型</h5>
                                                        <p>複雜的神經網路架構</p>
                                                    </div>
                                                </div>
                                                <div class="feature-item">
                                                    <span class="feature-icon">🔄</span>
                                                    <div>
                                                        <h5>自主學習能力</h5>
                                                        <p>持續學習與更新</p>
                                                    </div>
                                                </div>
                                                <div class="feature-item">
                                                    <span class="feature-icon">🎯</span>
                                                    <div>
                                                        <h5>決策透明度</h5>
                                                        <p>可解釋性程度</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="assessment-result">
                                    <div class="result-box">
                                        <h4>🎯 評估工具推薦</h4>
                                        <div class="tool-links">
                                            <a href="#" class="tool-link">
                                                <span class="link-icon">🔧</span>
                                                <div>
                                                    <h5>線上風險評估器</h5>
                                                    <p>5 分鐘快速評估</p>
                                                </div>
                                            </a>
                                            <a href="#" class="tool-link">
                                                <span class="link-icon">📊</span>
                                                <div>
                                                    <h5>詳細評估報告</h5>
                                                    <p>專業評估服務</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="content-panel" id="examples">
                            <div class="example-gallery">
                                <h4>📱 應用實例分析</h4>
                                <div class="example-grid">
                                    <div class="example-card high-risk">
                                        <div class="example-media">
                                            <div class="media-placeholder">
                                                <span class="media-icon">🏥</span>
                                                <div class="play-button">▶️</div>
                                            </div>
                                            <span class="media-label">案例影片：醫療 AI</span>
                                        </div>
                                        <div class="example-content">
                                            <h4>智慧醫療影像辨識</h4>
                                            <div class="risk-badge high">高風險</div>
                                            <p>用於癌症篩檢的 AI 系統，直接影響診斷結果</p>
                                            <div class="example-details">
                                                <span>🎯 風險因子：生命安全</span>
                                                <span>📋 認證需求：FDA + CE + TFDA</span>
                                                <span>⏰ 認證時程：18-24 個月</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="example-card medium-risk">
                                        <div class="example-media">
                                            <div class="media-placeholder">
                                                <span class="media-icon">👥</span>
                                                <div class="view-button">👁️</div>
                                            </div>
                                            <span class="media-label">圖解：HR AI 流程</span>
                                        </div>
                                        <div class="example-content">
                                            <h4>人力資源管理 AI</h4>
                                            <div class="risk-badge medium">中風險</div>
                                            <p>履歷篩選與面試評估系統</p>
                                            <div class="example-details">
                                                <span>🎯 風險因子：就業公平</span>
                                                <span>📋 認證需求：偏見檢測</span>
                                                <span>⏰ 認證時程：6-12 個月</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="example-card low-risk">
                                        <div class="example-media">
                                            <div class="media-placeholder">
                                                <span class="media-icon">🎮</span>
                                                <div class="demo-button">🎲</div>
                                            </div>
                                            <span class="media-label">互動示範：遊戲 AI</span>
                                        </div>
                                        <div class="example-content">
                                            <h4>遊戲智能對手</h4>
                                            <div class="risk-badge low">低風險</div>
                                            <p>遊戲中的 AI 角色與策略系統</p>
                                            <div class="example-details">
                                                <span>🎯 風險因子：娛樂體驗</span>
                                                <span>📋 認證需求：無特殊要求</span>
                                                <span>⏰ 認證時程：自主聲明</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h4>💡 專家建議</h4>
                        <p>建議在產品開發初期就進行風險評估，避免後期大幅修改。如果評估結果為高風險，建議及早諮詢專業法規顧問。</p>
                    </div>
                `,
                followUp: [
                    "我的產品被評為高風險，下一步該怎麼做？",
                    "風險等級可以降低嗎？",
                    "中風險和高風險的認證差別在哪？",
                    "評估報告需要第三方認證嗎？"
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