// Importujemy moduły Node.js potrzebne do pracy z plikami i ścieżkami
const fs = require('fs');        // Moduł do czytania i zapisywania plików
const path = require('path');    // Moduł do pracy ze ścieżkami plików

// Ścieżka do naszego pliku bazy danych (db.json w głównym folderze projektu)
const DB_PATH = path.join(process.cwd(), 'db.json');

// Funkcja sprawdza czy plik db.json istnieje, jeśli nie - tworzy go
function ensureDbFile() {
    if (!fs.existsSync(DB_PATH)) {
        // Tworzymy pusty plik z początkowymi danymi
        const initialData = { tasks: [] };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

// Funkcja odczytuje wszystkie zadania z pliku db.json
function readTasks() {
    try {
        ensureDbFile();  // Sprawdzamy czy plik istnieje
        // Czytamy zawartość pliku jako tekst
        const data = fs.readFileSync(DB_PATH, 'utf8');
        // Konwertujemy JSON na obiekt JavaScript
        const parsed = JSON.parse(data);
        // Zwracamy listę zadań lub pustą listę jeśli nie ma
        return parsed.tasks || [];
    } catch (error) {
        // Jeśli coś poszło nie tak - logujemy błąd i zwracamy pustą listę
        console.error('Error reading tasks:', error);
        return [];
    }
}

// Funkcja zapisuje zadania do pliku db.json
function writeTasks(tasks) {
    try {
        // Pakujemy zadania do obiektu z właściwą strukturą
        const data = { tasks };
        // Zapisujemy do pliku jako sformatowany JSON (z wcięciami)
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;  // Sukces
    } catch (error) {
        // Jeśli nie udało się zapisać - logujemy błąd
        console.error('Error writing tasks:', error);
        return false; // Niepowodzenie
    }
}

// Funkcja pomocnicza do wysyłania odpowiedzi JSON (kompatybilna z Vercel i lokalnym serwerem)
function sendJson(res, statusCode, data) {
    // Ustawiamy nagłówki HTTP odpowiedzi
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',           // Mówimy że wysyłamy JSON
        'Access-Control-Allow-Origin': '*',           // Zezwalamy na dostęp z każdej domeny (CORS)
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Dozwolone metody HTTP
        'Access-Control-Allow-Headers': 'Content-Type'        // Dozwolone nagłówki
    });
    // Wysyłamy dane jako JSON
    res.end(JSON.stringify(data));
}

// Główna funkcja obsługująca żądania HTTP (nasze API)
// Jest to "kelner" z analogii w planie - pośrednik między frontendem a plikiem
module.exports = async (req, res) => {
    // Obsługujemy żądania OPTIONS (potrzebne do CORS)
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',           // Zezwalamy na dostęp z każdej domeny
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Dozwolone metody
            'Access-Control-Allow-Headers': 'Content-Type'        // Dozwolone nagłówki
        });
        res.end();
        return;
    }

    try {
        // Obsługa żądania GET - pobieranie wszystkich zadań
        if (req.method === 'GET') {
            const tasks = readTasks();  // Czytamy zadania z pliku
            // Wysyłamy odpowiedź z listą zadań
            sendJson(res, 200, {
                success: true,
                tasks: tasks,
                count: tasks.length
            });
        }
        // Obsługa żądania POST - zapisywanie/aktualizacja zadań
        else if (req.method === 'POST') {
            let body = '';  // Bufor na dane przychodzące

            // Zbieramy dane przychodzące kawałek po kawałku
            req.on('data', chunk => {
                body += chunk.toString();
            });

            // Gdy wszystkie dane dotarły - przetwarzamy je
            req.on('end', () => {
                try {
                    // Parsujemy JSON i wyciągamy listę zadań
                    const { tasks } = JSON.parse(body);

                    // Sprawdzamy czy zadania to tablica
                    if (!Array.isArray(tasks)) {
                        sendJson(res, 400, {
                            success: false,
                            error: 'Tasks must be an array'
                        });
                        return;
                    }

                    // Normalizujemy zadania - dodajemy brakujące pola i sprawdzamy typy
                    const validTasks = tasks.map((task, index) => ({
                        id: task.id || Date.now() + index,        // ID: istniejące lub nowe na podstawie czasu
                        text: task.text || '',                   // Tekst: istniejący lub pusty string
                        completed: Boolean(task.completed),      // Status: konwertujemy na boolean
                        createdAt: task.createdAt || new Date().toISOString()  // Data: istniejąca lub aktualna
                    }));

                    // Próbujemy zapisać zadania do pliku
                    const success = writeTasks(validTasks);

                    if (success) {
                        // Sukces - wysyłamy potwierdzenie
                        sendJson(res, 200, {
                            success: true,
                            message: 'Tasks updated successfully',
                            tasks: validTasks,
                            count: validTasks.length
                        });
                    } else {
                        // Błąd zapisu - informujemy o problemie
                        sendJson(res, 500, {
                            success: false,
                            error: 'Failed to save tasks'
                        });
                    }
                } catch (parseError) {
                    // Błąd parsowania JSON - nieprawidłowe dane
                    console.error('Error parsing request body:', parseError);
                    sendJson(res, 400, {
                        success: false,
                        error: 'Invalid JSON in request body'
                    });
                }
            });
        }
        // Obsługa nieobsługiwanych metod HTTP (PUT, DELETE, itp.)
        else {
            sendJson(res, 405, {
                success: false,
                error: `Method ${req.method} not allowed`  // Metoda nie jest dozwolona
            });
        }
    } catch (error) {
        // Obsługa nieoczekiwanych błędów serwera
        console.error('Server error:', error);
        sendJson(res, 500, {
            success: false,
            error: 'Internal server error'  // Wewnętrzny błąd serwera
        });
    }
};