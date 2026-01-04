class PTEStudyApp {
    constructor() {
        this.tasks = [];
        this.currentCategory = 'all';
        this.currentPriority = 'all';
        this.currentStage = '1';
        this.init();
    }

    init() {
        this.loadTasks();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.updateStageTip();
    }

    bindEvents() {
        // 添加任务
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // 题型分类切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCategory(e.target.dataset.category));
        });

        // 优先级切换
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPriority(e.target.dataset.priority));
        });

        // 阶段切换
        document.querySelectorAll('.stage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchStage(e.target.dataset.stage));
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const categorySelect = document.getElementById('categorySelect');
        const prioritySelect = document.getElementById('prioritySelect');
        const stageSelect = document.getElementById('stageSelect');
        const taskText = input.value.trim();
        
        if (!taskText) {
            this.showMessage('请输入任务内容');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            category: categorySelect.value,
            priority: prioritySelect.value,
            stage: stageSelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // 清空输入
        input.value = '';
        input.focus();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // 更新标签状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.renderTasks();
    }

    switchPriority(priority) {
        this.currentPriority = priority;
        
        // 更新标签状态
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.priority === priority);
        });
        
        this.renderTasks();
    }

    switchStage(stage) {
        this.currentStage = stage;
        
        // 更新标签状态
        document.querySelectorAll('.stage-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.stage === stage);
        });
        
        this.renderTasks();
        this.updateStageTip();
        this.updateStats();
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            const categoryMatch = this.currentCategory === 'all' || task.category === this.currentCategory;
            const priorityMatch = this.currentPriority === 'all' || task.priority === this.currentPriority;
            const stageMatch = this.currentStage === 'all' || task.stage === this.currentStage;
            return categoryMatch && priorityMatch && stageMatch;
        });
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <h3>暂无任务</h3>
                    <p>当前筛选条件下暂无任务，试试调整筛选条件或添加新任务。</p>
                </div>
            `;
            return;
        }

        // 按优先级排序
        filteredTasks.sort((a, b) => a.priority - b.priority);

        taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="app.toggleTask(${task.id})">
                <div class="task-content">
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <div class="task-meta">
                        <span class="task-category category-${task.category}">${this.getCategoryName(task.category)}</span>
                        <span class="task-priority priority-${task.priority}">${this.getPriorityName(task.priority)}</span>
                        <span class="task-stage">阶段${task.stage}</span>
                    </div>
                </div>
                <button class="task-delete" onclick="app.deleteTask(${task.id})">删除</button>
            </div>
        `).join('');
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const currentStageTasks = this.tasks.filter(t => t.stage === this.currentStage);
        const currentStageCompleted = currentStageTasks.filter(t => t.completed).length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
        document.getElementById('currentStage').textContent = this.currentStage;
    }

    updateStageTip() {
        const stageTip = document.getElementById('stageTip');
        const tips = {
            '1': '2025版阶段1：专注核心能力+新增题型。RS/WFD保持高强度训练，RA仅练口语流利度，重点攻克SGD和RTS新题型，DI/RL等人工审核题型要加入个人理解避免纯模板。',
            '2': '2025版阶段2：强化真实语言运用。RS提升到70%+复述率，WFD确保90%+准确率，SGD/RTS强化信息处理和情景反应，阅读独立提升（RA不再供分），人工审核题型注重自然表达。',
            '3': '2025版阶段3：实战模拟+查漏补缺。进行2025新版全真模拟，SGD/RTS最终检查，人工审核题型确保自然无模板痕迹，阅读听力独立能力验证，调整心态适应新考试流程。'
        };
        stageTip.textContent = tips[this.currentStage] || tips['1'];
    }

    getCategoryName(category) {
        const names = {
            speaking: '口语',
            writing: '写作',
            reading: '阅读',
            listening: '听力'
        };
        return names[category] || category;
    }

    getPriorityName(priority) {
        const names = {
            '1': 'P1死磕',
            '2': 'P2模板',
            '3': 'P3随缘'
        };
        return names[priority] || priority;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message) {
        // 创建临时消息提示
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    saveTasks() {
        localStorage.setItem('pte-tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('pte-tasks');
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
            } catch (e) {
                this.tasks = [];
            }
        } else {
            // 添加基于2025最新考情的默认示例任务
            this.tasks = [
                // ===== 阶段1: 打磨武器 (3-7天) =====
                
                // P1: 必须死磕 - 基础能力 (调整优先级)
                {
                    id: 1,
                    text: 'RS (Repeat Sentence) - 练习50%内容复述，流利度第一（听力+口语核心）',
                    category: 'speaking',
                    priority: '1',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    text: 'WFD (Write From Dictation) - 高频300句，拼写100%准确（听力+写作核心）',
                    category: 'listening',
                    priority: '1',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    text: 'RA (Read Aloud) - 每日5-10篇，仅练口语流利度（不再为阅读供分）',
                    category: 'speaking',
                    priority: '1',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                
                // 🆕 P1: 新增题型专项训练
                {
                    id: 4,
                    text: 'SGD (Summarise Group Discussion) - 听3人讨论，10秒准备+2分钟总结',
                    category: 'speaking',
                    priority: '1',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    text: 'RTS (Respond to a Situation) - 情景回答，10秒准备+40秒回应',
                    category: 'speaking',
                    priority: '1',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                
                // P2: 套用模板 - 但需注意人工审核
                {
                    id: 6,
                    text: 'DI (Describe Image) - 准备自然模板，避免机械化背诵（人工审核）',
                    category: 'speaking',
                    priority: '2',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 7,
                    text: 'RL (Retell Lecture) - 逻辑模板+个人理解，避免纯模板（人工审核）',
                    category: 'speaking',
                    priority: '2',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 8,
                    text: 'WE (Writing Essay) - 内容分0-6档，注重逻辑和批判性思维（人工审核）',
                    category: 'writing',
                    priority: '2',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 9,
                    text: 'SST (Summarize Spoken Text) - 个人理解+关键词，避免纯模板（人工审核）',
                    category: 'listening',
                    priority: '2',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 10,
                    text: 'SWT (Summarize Written Text) - 逻辑归纳，避免句式模板化（人工审核）',
                    category: 'writing',
                    priority: '2',
                    stage: '1',
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveTasks();
        }
    }
}

// PWA安装相关
let deferredPrompt;
let installPromptShown = false;

// 监听安装提示事件
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 延迟显示安装提示（用户交互后再显示）
    setTimeout(() => {
        if (!installPromptShown && !localStorage.getItem('pwa-install-dismissed')) {
            showInstallPrompt();
            installPromptShown = true;
        }
    }, 3000);
});

// 显示安装提示
function showInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.style.display = 'flex';
    }
}

// 隐藏安装提示
function hideInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.style.display = 'none';
    }
}

// 安装按钮点击事件
document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installBtn');
    const installCancel = document.getElementById('installCancel');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                
                if (outcome === 'accepted') {
                    console.log('PTE备考App已安装到桌面');
                }
                
                hideInstallPrompt();
            }
        });
    }
    
    if (installCancel) {
        installCancel.addEventListener('click', () => {
            hideInstallPrompt();
            localStorage.setItem('pwa-install-dismissed', 'true');
        });
    }
});

// 检测是否已安装
window.addEventListener('appinstalled', () => {
    console.log('PTE备考App已成功安装');
    hideInstallPrompt();
    localStorage.setItem('pwa-installed', 'true');
});

// 离线状态检测
window.addEventListener('online', () => {
    const toast = document.getElementById('offlineToast');
    if (toast) {
        toast.style.display = 'none';
    }
});

window.addEventListener('offline', () => {
    const toast = document.getElementById('offlineToast');
    if (toast) {
        toast.style.display = 'flex';
    }
});

// 注册Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('PTE备考App Service Worker注册成功:', registration);
            })
            .catch((error) => {
                console.log('PTE备考App Service Worker注册失败:', error);
            });
    });
}

// 请求通知权限
if ('Notification' in navigator && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('PTE备考App通知权限已授权');
        }
    });
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化应用
const app = new PTEStudyApp();