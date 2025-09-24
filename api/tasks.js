// Używamy in-memory storage dla Vercel (serverless environment)
// Uwaga: Dane będą tymczasowe i resetują się przy każdym cold start
let tasksCache = [
    {
        id: 1,
        text: "Przykładowy task - aplikacja działa!",
        completed: false,
        createdAt: new Date().toISOString()
    }
];

// Funkcja odczytuje wszystkie zadania z cache
async function readTasks() {
    try {
        return tasksCache;
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
}

// Funkcja zapisuje zadania do cache
async function writeTasks(tasks) {
    try {
        // Aktualizuj cache
        tasksCache = tasks;
        console.log('Tasks saved to memory cache:', tasks.length);
        return true;
    } catch (error) {
        console.error('Error writing tasks:', error);
        return false;
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
            const tasks = await readTasks();  // Czytamy zadania z cache/storage
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
            req.on('end', async () => {
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

                    // Próbujemy zapisać zadania do storage
                    const success = await writeTasks(validTasks);

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