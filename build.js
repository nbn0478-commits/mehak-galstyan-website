#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Простая минификация CSS
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Удаляем комментарии
    .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
    .replace(/;\s*}/g, '}') // Удаляем последние точки с запятой перед }
    .replace(/\s*{\s*/g, '{') // Убираем пробелы вокруг {
    .replace(/}\s*/g, '}') // Убираем пробелы после }
    .replace(/:\s*/g, ':') // Убираем пробелы после :
    .replace(/;\s*/g, ';') // Убираем пробелы после ;
    .replace(/,\s*/g, ',') // Убираем пробелы после ,
    .trim();
}

// Простая минификация JS
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Удаляем многострочные комментарии
    .replace(/\/\/.*$/gm, '') // Удаляем однострочные комментарии
    .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
    .replace(/;\s*}/g, '}') // Убираем точки с запятой перед }
    .replace(/\s*{\s*/g, '{') // Убираем пробелы вокруг {
    .replace(/}\s*/g, '}') // Убираем пробелы после }
    .replace(/;\s*/g, ';') // Убираем пробелы после ;
    .replace(/,\s*/g, ',') // Убираем пробелы после ,
    .trim();
}

console.log('🚀 Начинаем сборку сайта...');

try {
  // Создаем папки если их нет (и dist, и public для совместимости)
  ['./dist', './public'].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (!fs.existsSync(`${dir}/assets`)) {
      fs.mkdirSync(`${dir}/assets`);
    }
    if (!fs.existsSync(`${dir}/assets/css`)) {
      fs.mkdirSync(`${dir}/assets/css`);
    }
    if (!fs.existsSync(`${dir}/assets/js`)) {
      fs.mkdirSync(`${dir}/assets/js`);
    }
    if (!fs.existsSync(`${dir}/images`)) {
      fs.mkdirSync(`${dir}/images`);
    }
  });

  // Собираем CSS из всех файлов
  const cssFiles = [
    './styles/main.css',
    './styles/ux-improvements.css',
    './styles/premium-brands.css',
    './styles/modern-design.css',
    './styles/navigation.css',
    './styles/scroll-button.css',
    './styles/adaptive.css',
    './styles/improved-brands.css'
  ];
  
  let cssBundle = '';
  cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
      cssBundle += fs.readFileSync(file, 'utf8') + '\n';
      console.log(`✅ Добавлен ${file}`);
    }
  });
  
  // Записываем CSS в обе папки
  ['./dist', './public'].forEach(dir => {
    fs.writeFileSync(`${dir}/assets/css/bundle.css`, cssBundle);
    const minifiedCSS = minifyCSS(cssBundle);
    fs.writeFileSync(`${dir}/assets/css/bundle.min.css`, minifiedCSS);
  });
  console.log('✅ CSS собран и минифицирован');

  // Собираем JS из всех файлов
  const jsFiles = [
    './scripts/navigation.js',
    './scripts/main.js'
  ];
  
  let jsBundle = '';
  jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
      jsBundle += fs.readFileSync(file, 'utf8') + '\n';
      console.log(`✅ Добавлен ${file}`);
    }
  });
  
  // Записываем JS в обе папки
  ['./dist', './public'].forEach(dir => {
    fs.writeFileSync(`${dir}/assets/js/bundle.js`, jsBundle);
    const minifiedJS = minifyJS(jsBundle);
    fs.writeFileSync(`${dir}/assets/js/bundle.min.js`, minifiedJS);
  });
  console.log('✅ JS собран и минифицирован');

  // Копируем изображения в обе папки
  if (fs.existsSync('./images')) {
    const images = fs.readdirSync('./images');
    ['./dist', './public'].forEach(dir => {
      images.forEach(image => {
        fs.copyFileSync(`./images/${image}`, `${dir}/images/${image}`);
      });
    });
    console.log('✅ Изображения скопированы');
  }

  // Копируем HTML в обе папки
  if (fs.existsSync('./index.html')) {
    ['./dist', './public'].forEach(dir => {
      fs.copyFileSync('./index.html', `${dir}/index.html`);
    });
    console.log('✅ HTML скопирован');
  }

  // Обновляем HTML для использования минифицированных файлов в обеих папках
  ['./dist', './public'].forEach(dir => {
    let html = fs.readFileSync(`${dir}/index.html`, 'utf8');
    
    // Удаляем все отдельные ссылки на CSS файлы
    const cssLinkRegex = /<link rel="stylesheet" href="\.\/styles\/[^"]+\.css" \/>/g;
    html = html.replace(cssLinkRegex, '');
    
    // Удаляем все отдельные ссылки на JS файлы
    const jsScriptRegex = /<script src="scripts\/[^"]+\.js"><\/script>/g;
    html = html.replace(jsScriptRegex, '');
    
    // Удаляем лишние пустые строки после удаления ссылок
    html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Добавляем ссылку на bundle CSS после шрифтов
    const fontLinkEnd = html.indexOf('</head>');
    if (fontLinkEnd !== -1) {
      const bundleLink = '\n    <!-- Bundled Styles -->\n    <link rel="stylesheet" href="./assets/css/bundle.min.css" />\n';
      html = html.slice(0, fontLinkEnd) + bundleLink + html.slice(fontLinkEnd);
    }
    
    // Добавляем ссылку на bundle JS перед закрытием body
    const bodyEnd = html.lastIndexOf('</body>');
    if (bodyEnd !== -1) {
      const bundleScript = '    <!-- Bundled Scripts -->\n    <script src="./assets/js/bundle.min.js"></script>\n  ';
      html = html.slice(0, bodyEnd) + bundleScript + html.slice(bodyEnd);
    }
    
    fs.writeFileSync(`${dir}/index.html`, html);
  });
  console.log('✅ HTML обновлен с bundle файлами');

  // Создаем .htaccess для Apache
  const htaccess = `
# Кэширование статических ресурсов
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Сжатие
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Безопасность
<IfModule mod_headers.c>
  Header always set X-Frame-Options DENY
  Header always set X-Content-Type-Options nosniff
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Редиректы для SEO
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
`.trim();

  // Создаем robots.txt
  const robots = `
User-agent: *
Allow: /

Sitemap: https://mekhakgalstyan.ru/sitemap.xml
`.trim();

  // Создаем служебные файлы в обеих папках
  ['./dist', './public'].forEach(dir => {
    fs.writeFileSync(`${dir}/.htaccess`, htaccess);
    fs.writeFileSync(`${dir}/robots.txt`, robots);
  });
  console.log('✅ .htaccess и robots.txt созданы');

  // Статистика
  const cssSize = fs.statSync('./dist/assets/css/bundle.css').size;
  const cssMinSize = fs.statSync('./dist/assets/css/bundle.min.css').size;
  const jsSize = fs.statSync('./dist/assets/js/bundle.js').size;
  const jsMinSize = fs.statSync('./dist/assets/js/bundle.min.js').size;

  console.log('\n📊 Статистика сжатия:');
  console.log(`CSS: ${cssSize} → ${cssMinSize} байт (${Math.round((1 - cssMinSize/cssSize) * 100)}% экономии)`);
  console.log(`JS: ${jsSize} → ${jsMinSize} байт (${Math.round((1 - jsMinSize/jsSize) * 100)}% экономии)`);

  console.log('\n🎉 Сборка завершена успешно!');
  console.log('📁 Файлы готовы к деплою в папках:');
  console.log('   📂 dist/ - для обычного хостинга');
  console.log('   📂 public/ - для Vercel/Netlify/GitHub Pages');

} catch (error) {
  console.error('❌ Ошибка сборки:', error.message);
  process.exit(1);
}
