// Importujemy potrzebne moduły Node.js
const http = require('http');     // Moduł do tworzenia serwera HTTP
const fs = require('fs');         // Moduł do pracy z plikami
const path = require('path');     // Moduł do pracy ze ścieżkami
const url = require('url');       // Moduł do parsowania URL

// Importujemy nasze API do obsługi zadań
const tasksHandler = require('./api/tasks.js');

// Port na którym będzie działać nasz serwer
const PORT = 3000;

// Typy MIME dla różnych rozszerzeń plików (mówi przeglądarce jak interpretować plik)
const mimeTypes = {
    '.html': 'text/html',              // Pliki HTML
    '.css': 'text/css',               // Pliki CSS (style)
    '.js': 'application/javascript',   // Pliki JavaScript
    '.json': 'application/json',       // Pliki JSON (dane)
    '.png': 'image/png',              // Obrazy PNG
    '.jpg': 'image/jpeg',             // Obrazy JPEG
    '.jpeg': 'image/jpeg',            // Obrazy JPEG
    '.gif': 'image/gif',              // Obrazy GIF
    '.svg': 'image/svg+xml',          // Obrazy SVG
    '.ico': 'image/x-icon'            // Ikony favicon
};

// Funkcja obsługuje serwowanie plików statycznych (HTML, CSS, JS, obrazy)
function serveStaticFile(req, res, filePath) {
    // Pobieramy rozszerzenie pliku (np. ".html", ".css")
    const ext = path.extname(filePath).toLowerCase();
    // Ustalamy typ MIME na podstawie rozszerzenia
    const contentType = mimeTypes[ext] || 'text/plain';

    // Czytamy plik z dysku
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Jeśli plik nie istnieje - zwracamy błąd 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        // Jeśli plik istnieje - wysyłamy go do przeglądarki
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Tworzymy serwer HTTP - to główna funkcja która odpowiada na wszystkie żądania
const server = http.createServer(async (req, res) => {
    // Parsujemy URL żądania (rozbijamy na części)
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;  // Ścieżka (np. "/", "/api/tasks")

    // Logujemy każde żądanie dla celów debugowania
    console.log(`${req.method} ${pathname}`);

    // Obsługa żądań do API - przekazujemy do naszej funkcji zadań
    if (pathname.startsWith('/api/tasks')) {
        await tasksHandler(req, res);  // Nasz "kelner" z API obsługuje to żądanie
        return;
    }

    // Obsługa plików statycznych (HTML, CSS, JS)
    let filePath;

    // Jeśli ktoś wchodzi na główną stronę ("/") - pokazujemy index.html
    if (pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        // W przeciwnym razie szukamy pliku o podanej nazwie
        filePath = path.join(__dirname, pathname);
    }

    // Sprawdzenie bezpieczeństwa - zapobiegamy wychodzeniu poza folder projektu
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 Forbidden</h1>');
        return;
    }

    // Sprawdzamy czy plik istnieje
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Plik nie istnieje - zwracamy błąd 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        // Plik istnieje - serwujemy go
        serveStaticFile(req, res, filePath);
    });
});

// Uruchamiamy serwer na określonym porcie
server.listen(PORT, () => {
    console.log(`🚀 TaskFlow server running at http://localhost:${PORT}`);
    console.log(`📝 Open your browser and navigate to: http://localhost:${PORT}`);
    console.log(`🔌 API endpoint available at: http://localhost:${PORT}/api/tasks`);
    console.log('\n💡 Press Ctrl+C to stop the server');
});

// Eleganckie zamykanie serwera przy naciśnięciu Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);  // Kończymy proces
    });
});