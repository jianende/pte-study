@echo off
chcp 65001 > nul
echo.
echo ========================================
echo    🎯 PTE 65分备考App 服务器
echo ========================================
echo.
echo 🌐 服务器启动中...
echo.
echo 📱 手机访问地址：
echo    http://localhost:8080
echo.
echo 📲 手机访问步骤：
echo    1. 确保手机和电脑在同一WiFi网络
echo    2. 查看电脑IP地址
echo    3. 在手机浏览器输入: http://[你的电脑IP]:8080
echo.
echo 🔧 查看IP地址的方法：
echo    Windows: 打开命令行输入 ipconfig
echo    Mac: 打开终端输入 ifconfig
echo.
echo 💡 使用提示：
echo    - 服务器启动后不要关闭此窗口
echo    - 按 Ctrl+C 可停止服务器
echo    - 推荐使用Chrome、Firefox等现代浏览器访问
echo.
echo ========================================

cd /d "%~dp0"

REM 尝试Python服务器
echo 🐍 尝试启动Python服务器...
python -c "import http.server; import socketserver; socketserver.TCPServer(('', 8080), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul
if errorlevel 1 (
    echo Python服务器启动失败，尝试Node.js...
    node -e "
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    
    const server = http.createServer((req, res) =^ {
        try {
            let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
            const ext = path.extname(filePath);
            const contentType = ext === '.css' ? 'text/css' : 
                               ext === '.js' ? 'application/javascript' : 
                               ext === '.json' ? 'application/json' : 
                               'text/html';
            const data = fs.readFileSync(filePath);
            res.writeHead(200, {'Content-Type': contentType, 'Access-Control-Allow-Origin': '*'});
            res.end(data);
        } catch (err) {
            res.writeHead(404);
            res.end('File not found');
        }
    });
    
    server.listen(8080, () =^ {
        console.log('');
        console.log('✅ PTE备考App服务器启动成功！');
        console.log('');
        console.log('🌐 本地访问地址: http://localhost:8080');
        console.log('');
        console.log('📱 手机访问地址:');
        console.log('   http://[你的电脑IP]:8080');
        console.log('');
        console.log('📋 查看电脑IP地址:');
        console.log('   Windows: ipconfig');
        console.log('   Mac: ifconfig');
        console.log('');
        console.log('💪 按 Ctrl+C 停止服务器');
        console.log('');
    });
    " 2>nul
    if errorlevel 1 (
        echo.
        echo ❌ Node.js服务器也启动失败！
        echo.
        echo 💡 解决方案：
        echo    1. 安装Python 3.6+: https://python.org
        echo    2. 安装Node.js: https://nodejs.org
        echo    3. 确保端口8080没有被其他程序占用
        echo.
        echo 📥 下载地址：
        echo    Python: https://www.python.org/downloads/
        echo    Node.js: https://nodejs.org/en/download/
        echo.
        pause
    )
)

echo.
echo ✅ 服务器正在运行...
echo 🌐 请在浏览器中访问: http://localhost:8080
echo 📱 手机用户请访问: http://[你的电脑IP]:8080
echo.
echo 💪 按 Ctrl+C 停止服务器
echo.

pause