interface GeoProperties {
  asn: number;
  countryName: string;
  countryCodeAlpha2: string;
  countryCodeAlpha3: string;
  countryCodeNumeric: string;
  regionName: string;
  regionCode: string;
  cityName: string;
  latitude: number;
  longitude: number;
  cisp: string;
}

interface IncomingRequestEoProperties {
  geo: GeoProperties;
  uuid: string;
  clientIp: string;
}

interface EORequest extends Request {
  readonly eo: IncomingRequestEoProperties;
}

// 创建首页 HTML
function createHomePage(): Response {
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub 文件加速下载</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px;
      max-width: 800px;
      width: 100%;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2.5em;
      text-align: center;
    }
    .subtitle {
      color: #666;
      text-align: center;
      margin-bottom: 30px;
      font-size: 1.1em;
    }
    .input-group {
      display: flex;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 10px;
      overflow: hidden;
    }
    input {
      flex: 1;
      padding: 15px 20px;
      border: none;
      font-size: 16px;
      outline: none;
    }
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      font-size: 16px;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    button:hover { opacity: 0.9; }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #333;
      font-size: 1.3em;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
    }
    .example-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 5px;
    }
    .code {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      overflow-x: auto;
      margin: 10px 0;
    }
    .supported-list {
      list-style: none;
      padding: 0;
    }
    .supported-list li {
      padding: 8px 0;
      color: #555;
    }
    .supported-list li:before {
      content: "✓ ";
      color: #667eea;
      font-weight: bold;
      margin-right: 8px;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 GitHub 加速下载</h1>
    <p class="subtitle">为终端命令行和浏览器提供 GitHub 文件加速服务</p>
    
    <div class="input-group">
      <input type="text" id="urlInput" placeholder="输入 GitHub 链接（如: https://github.com/user/repo/archive/master.zip）">
      <button onclick="downloadFile()">下载</button>
    </div>

    <div class="section">
      <h2 class="section-title">📋 支持的链接格式</h2>
      <ul class="supported-list">
        <li>Raw 文件: raw.githubusercontent.com</li>
        <li>Gist: gist.github.com, gist.githubusercontent.com</li>
        <li>分支源码: /archive/master.zip</li>
        <li>Releases 源码: /archive/refs/tags/vX.X.X.zip</li>
        <li>Releases 文件: /releases/download/vX.X.X/file.tar.gz</li>
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">🖥️ 终端使用示例</h2>
      
      <div class="example-box">
        <strong>Git Clone</strong>
        <div class="code">git clone \${location.origin}/https://github.com/user/repo.git</div>
      </div>

      <div class="example-box">
        <strong>Git Clone 私有仓库</strong>
        <div class="code">git clone https://username:token@\${location.host}/https://github.com/user/private-repo.git</div>
      </div>

      <div class="example-box">
        <strong>Wget 下载</strong>
        <div class="code">wget \${location.origin}/https://github.com/user/repo/archive/master.zip</div>
      </div>

      <div class="example-box">
        <strong>Curl 下载</strong>
        <div class="code">curl -O \${location.origin}/https://raw.githubusercontent.com/user/repo/main/file.txt</div>
      </div>
    </div>

    <div class="warning">
      <strong>⚠️ 注意事项</strong>
      <ul style="margin-top: 10px; padding-left: 20px;">
        <li>不支持 SSH Key 方式的 git clone</li>
        <li>私有仓库需要使用 Personal Access Token</li>
        <li>请合理使用，避免滥用</li>
      </ul>
    </div>
  </div>

  <script>
    function downloadFile() {
      const url = document.getElementById('urlInput').value.trim();
      if (!url) {
        alert('请输入 GitHub 链接');
        return;
      }
      
      // 构造代理 URL
      let proxyUrl;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        proxyUrl = location.origin + '/' + url;
      } else {
        proxyUrl = location.origin + '/https://' + url;
      }
      
      // 打开新窗口下载
      window.open(proxyUrl, '_blank');
    }
    
    // 支持回车键下载
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        downloadFile();
      }
    });
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive',
    }
  });
}

// 处理根路径的 OPTIONS 请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// 处理根路径请求 - 显示首页
export async function onRequest({ request }: { request: EORequest }) {
  if (request.method === 'GET') {
    return createHomePage();
  }
  
  // 对于非 GET 请求，返回方法不被支持的错误
  return new Response(
    JSON.stringify({ 
      error: 'Method not allowed on homepage',
      message: 'Only GET requests are supported for the homepage',
      supported_methods: ['GET']
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
}
