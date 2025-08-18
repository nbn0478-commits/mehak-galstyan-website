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
  // Читаем и минифицируем CSS
  const cssBundle = fs.readFileSync('./dist/assets/css/bundle.css', 'utf8');
  const minifiedCSS = minifyCSS(cssBundle);
  fs.writeFileSync('./dist/assets/css/bundle.min.css', minifiedCSS);
  console.log('✅ CSS минифицирован');

  // Читаем и минифицируем JS
  const jsBundle = fs.readFileSync('./dist/assets/js/bundle.js', 'utf8');
  const minifiedJS = minifyJS(jsBundle);
  fs.writeFileSync('./dist/assets/js/bundle.min.js', minifiedJS);
  console.log('✅ JS минифицирован');

  // Обновляем HTML для использования минифицированных файлов
  let html = fs.readFileSync('./dist/index.html', 'utf8');
  html = html.replace('./assets/css/bundle.css', './assets/css/bundle.min.css');
  html = html.replace('./assets/js/bundle.js', './assets/js/bundle.min.js');
  fs.writeFileSync('./dist/index.html', html);
  console.log('✅ HTML обновлен');

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

  fs.writeFileSync('./dist/.htaccess', htaccess);
  console.log('✅ .htaccess создан');

  // Создаем robots.txt
  const robots = `
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
`.trim();

  fs.writeFileSync('./dist/robots.txt', robots);
  console.log('✅ robots.txt создан');

  // Статистика
  const cssSize = fs.statSync('./dist/assets/css/bundle.css').size;
  const cssMinSize = fs.statSync('./dist/assets/css/bundle.min.css').size;
  const jsSize = fs.statSync('./dist/assets/js/bundle.js').size;
  const jsMinSize = fs.statSync('./dist/assets/js/bundle.min.js').size;

  console.log('\n📊 Статистика сжатия:');
  console.log(`CSS: ${cssSize} → ${cssMinSize} байт (${Math.round((1 - cssMinSize/cssSize) * 100)}% экономии)`);
  console.log(`JS: ${jsSize} → ${jsMinSize} байт (${Math.round((1 - jsMinSize/jsSize) * 100)}% экономии)`);

  console.log('\n🎉 Сборка завершена успешно!');
  console.log('📁 Файлы готовы к деплою в папке dist/');

} catch (error) {
  console.error('❌ Ошибка сборки:', error.message);
  process.exit(1);
}
