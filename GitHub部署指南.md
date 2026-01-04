# 🌐 PTE备考App - GitHub Pages部署指南

## 🚀 **快速部署到GitHub Pages**

### 📋 **第一步：创建GitHub仓库**

1. **登录GitHub**：访问 https://github.com
2. **新建仓库**：点击右上角"+" → "New repository"
3. **仓库名称**：填写 `pte-study-app`
4. **仓库类型**：选择"Public"公开仓库
5. **描述**：`PTE 65分备考清单 - 2025最新考情版`
6. **点击创建**：点击"Create repository"按钮

---

## 📂 **第二步：上传文件**

### 🔄 **方法一：网页上传（简单）**
1. **进入仓库**：创建成功后进入仓库页面
2. **上传文件**：点击"uploading an existing file"
3. **拖拽上传**：将整个 `PTE备考1` 文件夹拖入上传区域
4. **确认上传**：等待所有文件上传完成

### 🔄 **方法二：Git命令（推荐）**
1. **本地初始化**：
```bash
cd "C:\Users\建恩德\Desktop\PTE备考1"
git init
```

2. **添加远程仓库**：
```bash
git remote add origin https://github.com/[你的用户名]/pte-study-app.git
```

3. **添加文件并提交**：
```bash
git add .
git commit -m "feat: 添加PTE 65分备考清单 - 45个科学任务，三阶段系统化备考，支持PWA手机桌面版"
```

4. **推送到GitHub**：
```bash
git branch -M main
git push -u origin main
```

---

## ⚙️ **第三步：启用GitHub Pages**

### 🔧 **基本设置**
1. **进入设置**：仓库页面点击"Settings"标签
2. **找到Pages**：左侧菜单中找到"Pages"选项
3. **选择部署源**：
   - **Source**：选择"Deploy from a branch"
   - **Branch**：选择"main"分支
   - **Folder**：选择"/ (root)"文件夹
4. **保存设置**：点击"Save"按钮

### 🔧 **高级设置**
1. **自定义域名**：可选，绑定个人域名
2. **HTTPS强制**：GitHub Pages自动启用HTTPS
3. **Jekyll支持**：确保"Disable Jekyll"选项未勾选

---

## ⏳ **第四步：等待部署**

### 📊 **部署状态**
- **初次部署**：需要2-5分钟
- **后续更新**：通常1-2分钟
- **状态检查**：在Pages设置页面查看部署状态

### 🔍 **状态指示**
- **绿色勾号** ✅ - 部署成功
- **黄色圆点** ⏳ - 正在部署
- **红色叉号** ❌ - 部署失败

---

## 🌐 **访问地址**

### 📱 **部署成功后的访问链接**

**GitHub原生地址**：
```
https://[你的GitHub用户名].github.io/pte-study-app/
```

**简化访问地址**：
```
https://pte-study-app.pages.dev
```

**示例地址**（假设用户名为jianende）：
```
https://jianende.github.io/pte-study-app/
https://pte-study-app.pages.dev
```

---

## 🔄 **第五步：更新和维护**

### 📝 **更新文件**
修改本地文件后，使用Git命令推送：
```bash
git add .
git commit -m "update: 更新内容和功能"
git push origin main
```

### 🔧 **查看部署日志**
1. **Actions页面**：仓库 → Actions
2. **查看日志**：点击部署任务查看详细日志
3. **错误排查**：失败时查看具体错误信息

---

## 🎯 **最佳实践**

### ✅ **仓库结构优化**
```
pte-study-app/
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # JavaScript脚本
├── manifest.json        # PWA配置文件
├── sw.js              # Service Worker
├── README.md           # 项目说明
├── .github/
│   └── workflows/
│       └── deploy.yml   # 自动部署配置
└── docs/               # 文档文件
    ├── 使用指南.md
    ├── PWA安装指南.md
    └── GitHub部署指南.md
```

### ✅ **文件命名规范**
- 使用小写字母和连字符
- 避免空格和特殊字符
- 确保文件扩展名正确

### ✅ **提交信息规范**
- feat: 新功能
- update: 更新功能
- fix: 修复问题
- docs: 文档更新

---

## 🛠️ **故障排除**

### ❌ **Pages未启用**
- 确保仓库是Public（公开）
- 检查是否有main分支
- 重新配置Pages设置

### ❌ **404页面错误**
- 检查index.html是否在根目录
- 确认文件名拼写正确
- 清除浏览器缓存

### ❌ **PWA功能异常**
- 检查manifest.json格式
- 确认sw.js路径正确
- 验证Service Worker注册

### ❌ **样式显示问题**
- 检查CSS文件路径
- 确认相对路径正确
- 验证浏览器兼容性

---

## 🚀 **自动部署配置**

### 📁 **GitHub Actions自动部署**
创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy PTE Study App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Build and Deploy
      run: |
        echo "🚀 开始部署PTE备考App..."
        echo "📁 当前目录内容:"
        ls -la
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        
    - name: Get URL
      if: github.ref == 'refs/heads/main'
      run: |
        echo "🌐 部署成功！"
        echo "📱 访问地址："
        echo "https://pte-study-app.pages.dev"
        echo "https://[你的用户名].github.io/pte-study-app/"
```

### 🔧 **自动部署优势**
- ✅ **推送自动部署** - 代码提交后自动部署
- ✅ **分支保护** - 只有main分支部署
- ✅ **错误通知** - 部署失败自动通知
- ✅ **多环境支持** - 支持开发/测试环境

---

## 📱 **PWA优化部署**

### 🎨 **PWA特性确保**
1. **Manifest文件**：正确配置PWA属性
2. **Service Worker**：实现离线缓存和推送
3. **HTTPS访问**：GitHub Pages自动提供HTTPS
4. **响应式设计**：适配各种屏幕尺寸

### 📋 **PWA检查清单**
- ✅ manifest.json配置正确
- ✅ sw.js注册成功
- ✅ 离线缓存工作正常
- ✅ 桌面安装功能正常
- ✅ 全屏显示模式正常

---

## 🎉 **部署成功验证**

### ✅ **检查清单**
- [ ] 访问主地址正常显示
- [ ] PWA安装提示正常弹出
- [ ] 离线功能正常工作
- [ ] 移动端响应式正常
- [ ] 所有交互功能正常
- [ ] 数据本地存储正常

### 📱 **手机测试**
1. **访问地址**：手机浏览器访问部署地址
2. **安装测试**：测试PWA安装功能
3. **功能测试**：测试所有功能是否正常
4. **离线测试**：断网后测试离线功能

---

## 🎯 **总结**

按照以上步骤完成后，你将获得：

🌐 **永久在线地址**
- GitHub Pages免费托管
- 全球CDN加速分发
- 自动HTTPS安全访问

📱 **手机桌面应用**
- PWA技术支持
- 一键安装到桌面
- 离线使用功能

📊 **自动更新机制**
- Git版本控制
- 推送自动部署
- 实时同步更新

---

**🚀 现在就开始部署你的PTE备考App到GitHub Pages吧！**

部署成功后，你就有了一个专业的在线PTE备考工具，任何人都可以访问和使用！🎉

---

*最后更新：2025年1月4日*  
*平台：GitHub Pages*  
*技术：PWA + Git + GitHub Actions*