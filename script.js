// Główna klasa zarządzająca aplikacją To-Do
// Ta klasa odpowiada za całą logikę aplikacji - dodawanie, usuwanie, zapisywanie zadań
class TaskManager {
    constructor() {
        // Lista wszystkich zadań przechowywana w pamięci przeglądarki
        this.tasks = [];
        // Adres naszego API (serwera) do komunikacji z bazą danych
        this.apiUrl = '/api/tasks';

        // Uruchamiamy podstawowe funkcje aplikacji
        this.initializeElements();  // Znajdź elementy na stronie
        this.attachEventListeners(); // Podłącz obsługę kliknięć
        this.loadTasks();           // Załaduj zadania z serwera
    }

    // Funkcja znajduje i zapisuje wszystkie ważne elementy HTML ze strony
    initializeElements() {
        this.taskForm = document.getElementById('task-form');        // Formularz dodawania zadań
        this.taskInput = document.getElementById('task-input');      // Pole tekstowe do wpisywania zadań
        this.tasksList = document.getElementById('tasks-list');      // Lista gdzie wyświetlamy zadania
        this.emptyState = document.getElementById('empty-state');    // Komunikat gdy brak zadań
        this.tasksCount = document.getElementById('tasks-count');    // Licznik wszystkich zadań
        this.completedCount = document.getElementById('completed-count'); // Licznik wykonanych zadań
    }

    // Funkcja podłącza obsługę zdarzeń (kliknięcia, wysłanie formularza)
    attachEventListeners() {
        // Gdy użytkownik wyśle formularz (naciśnie Enter lub kliknie "Dodaj")
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
    }

    // Funkcja pobiera zadania z serwera i wyświetla je na stronie
    async loadTasks() {
        try {
            // Wysyłamy zapytanie GET do naszego API aby pobrać wszystkie zadania
            const response = await fetch(this.apiUrl);

            // Sprawdzamy czy serwer odpowiedział poprawnie
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Konwertujemy odpowiedź z serwera na obiekt JavaScript
            const data = await response.json();

            // Jeśli serwer zwrócił sukces
            if (data.success) {
                this.tasks = data.tasks || [];  // Zapisujemy zadania w pamięci
                this.renderTasks();             // Wyświetlamy zadania na stronie
                this.updateStatistics();       // Aktualizujemy liczniki
            } else {
                this.showError('Błąd podczas ładowania zadań');
            }
        } catch (error) {
            // Jeśli coś poszło nie tak (brak internetu, błąd serwera)
            console.error('Error loading tasks:', error);
            this.showError('Nie można załadować zadań. Sprawdź połączenie z internetem.');
        }
    }

    // Funkcja zapisuje wszystkie zadania na serwer
    async saveTasks() {
        try {
            // Wysyłamy zapytanie POST z naszymi zadaniami do serwera
            const response = await fetch(this.apiUrl, {
                method: 'POST',                          // Typ zapytania: POST (wysyłanie danych)
                headers: {
                    'Content-Type': 'application/json', // Mówimy serwerowi że wysyłamy JSON
                },
                body: JSON.stringify({ tasks: this.tasks })  // Konwertujemy nasze zadania na JSON
            });

            // Sprawdzamy czy serwer przyjął nasze dane
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Sprawdzamy odpowiedź serwera
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Unknown server error');
            }

            return true;  // Sukces - zadania zostały zapisane
        } catch (error) {
            // Jeśli nie udało się zapisać
            console.error('Error saving tasks:', error);
            this.showError('Nie można zapisać zadań. Spróbuj ponownie.');
            return false; // Niepowodzenie
        }
    }

    // Funkcja obsługuje dodawanie nowego zadania
    async handleAddTask(event) {
        event.preventDefault(); // Zapobiegamy przeładowaniu strony po wysłaniu formularza

        // Pobieramy tekst z pola input i usuwamy spacje na początku i końcu
        const taskText = this.taskInput.value.trim();

        // Sprawdzamy czy użytkownik wpisał cokolwiek
        if (!taskText) {
            this.showError('Wprowadź treść zadania');
            return;
        }

        // Tworzymy nowe zadanie z unikalnym ID i aktualną datą
        const newTask = {
            id: Date.now(),                           // Unikalny numer ID (czas w milisekundach)
            text: taskText,                          // Tekst zadania wpisany przez użytkownika
            completed: false,                        // Na początku zadanie nie jest wykonane
            createdAt: new Date().toISOString()      // Data utworzenia w formacie ISO
        };

        // Dodajemy nowe zadanie do naszej listy w pamięci
        this.tasks.push(newTask);

        // Próbujemy zapisać zadania na serwerze
        const saved = await this.saveTasks();

        if (saved) {
            // Jeśli się udało - czyścimy pole input i odświeżamy widok
            this.taskInput.value = '';
            this.renderTasks();
            this.updateStatistics();
            this.showSuccess('Zadanie zostało dodane');
        } else {
            // Jeśli się nie udało - usuwamy zadanie z pamięci (rollback)
            this.tasks.pop();
        }
    }

    // Funkcja przełącza status zadania (wykonane/niewykonane)
    async toggleTaskComplete(taskId) {
        // Znajdujemy zadanie o podanym ID w naszej liście
        const task = this.tasks.find(t => t.id === taskId);

        // Jeśli nie znaleźliśmy zadania - kończymy
        if (!task) return;

        // Zmieniamy status zadania na przeciwny
        task.completed = !task.completed;

        // Próbujemy zapisać zmiany na serwerze
        const saved = await this.saveTasks();

        if (saved) {
            // Jeśli się udało - odświeżamy widok i pokazujemy komunikat
            this.renderTasks();
            this.updateStatistics();

            const message = task.completed
                ? 'Zadanie oznaczone jako wykonane'
                : 'Zadanie oznaczone jako niewykonane';
            this.showSuccess(message);
        } else {
            // Jeśli się nie udało - cofamy zmianę (rollback)
            task.completed = !task.completed;
        }
    }

    // Funkcja usuwa zadanie z listy
    async deleteTask(taskId) {
        // Znajdujemy pozycję zadania w liście
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);

        // Jeśli nie znaleźliśmy zadania - kończymy
        if (taskIndex === -1) return;

        // Usuwamy zadanie z listy i zapamiętujemy je na wypadek potrzeby przywrócenia
        const removedTask = this.tasks.splice(taskIndex, 1)[0];

        // Próbujemy zapisać zmiany na serwerze
        const saved = await this.saveTasks();

        if (saved) {
            // Jeśli się udało - odświeżamy widok i pokazujemy komunikat
            this.renderTasks();
            this.updateStatistics();
            this.showSuccess('Zadanie zostało usunięte');
        } else {
            // Jeśli się nie udało - przywracamy zadanie na jego miejsce (rollback)
            this.tasks.splice(taskIndex, 0, removedTask);
        }
    }

    // Funkcja wyświetla wszystkie zadania na stronie
    renderTasks() {
        // Jeśli nie ma żadnych zadań - pokazujemy komunikat o pustej liście
        if (this.tasks.length === 0) {
            this.tasksList.style.display = 'none';     // Ukrywamy listę zadań
            this.emptyState.style.display = 'flex';    // Pokazujemy komunikat "brak zadań"
            return;
        }

        // Jeśli są zadania - pokazujemy listę i ukrywamy komunikat
        this.tasksList.style.display = 'flex';
        this.emptyState.style.display = 'none';

        // Tworzymy HTML dla każdego zadania i wyświetlamy na stronie
        this.tasksList.innerHTML = this.tasks
            .map(task => this.createTaskHTML(task))    // Każde zadanie zamieniamy na HTML
            .join('');                                 // Łączymy wszystkie HTMLe w jeden

        // Podłączamy obsługę zdarzeń do nowych elementów
        this.attachTaskEventListeners();
    }

    // Funkcja tworzy kod HTML dla pojedynczego zadania
    createTaskHTML(task) {
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                     onclick="taskManager.toggleTaskComplete(${task.id})">
                    ${task.completed ? '✓' : ''}  <!-- Pokazujemy ptaszek jeśli zadanie wykonane -->
                </div>
                <span class="task-text">${this.escapeHtml(task.text)}</span>  <!-- Tekst zadania (bezpieczny) -->
                <div class="task-actions">
                    <button class="task-delete" onclick="taskManager.deleteTask(${task.id})"
                            title="Usuń zadanie">
                        ×  <!-- Przycisk X do usuwania -->
                    </button>
                </div>
            </div>
        `;
    }

    // Funkcja dodaje efekty hover do zadań (unoszenie przy najechaniu myszką)
    attachTaskEventListeners() {
        // Znajdujemy wszystkie elementy zadań na stronie
        const taskItems = document.querySelectorAll('.task-item');

        // Dla każdego zadania dodajemy efekty hover
        taskItems.forEach(item => {
            // Gdy myszka wchodzi na zadanie - lekko je unosimy
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-1px)';
            });

            // Gdy myszka opuszcza zadanie - wracamy do normalnej pozycji
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }

    // Funkcja aktualizuje statystyki zadań (liczniki w nagłówku)
    updateStatistics() {
        const totalTasks = this.tasks.length;  // Wszystkie zadania
        const completedTasks = this.tasks.filter(task => task.completed).length;  // Tylko wykonane

        // Aktualizujemy licznik wszystkich zadań z poprawną odmianą polską
        this.tasksCount.textContent = totalTasks === 1
            ? '1 zadanie'                    // 1 zadanie
            : totalTasks < 5
                ? `${totalTasks} zadania`    // 2-4 zadania
                : `${totalTasks} zadań`;     // 5+ zadań

        // Aktualizujemy licznik wykonanych zadań z poprawną odmianą polską
        this.completedCount.textContent = completedTasks === 1
            ? '1 wykonane'                   // 1 wykonane
            : completedTasks < 5
                ? `${completedTasks} wykonane`    // 2-4 wykonane
                : `${completedTasks} wykonanych`;  // 5+ wykonanych
    }

    // Funkcja pokazuje komunikat o sukcesie (zielony)
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Funkcja pokazuje komunikat o błędzie (czerwony)
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Funkcja pokazuje powiadomienia (toast notifications) w prawym górnym rogu
    showNotification(message, type) {
        // Jeśli już jest jakieś powiadomienie - usuwamy je
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Tworzymy nowy element div dla powiadomienia
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        // Ustawiamy style powiadomienia (pozycja, kolory, animacje)
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'};
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Dodajemy powiadomienie do strony
        document.body.appendChild(notification);

        // Po 3 sekundach chowamy powiadomienie z animacją
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Funkcja zabezpiecza tekst przed atakami XSS (ucieczka HTML)
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;  // Przeglądarka automatycznie zabezpieczy tekst
        return div.innerHTML;    // Zwracamy bezpieczny HTML
    }
}

// Gdy strona się załaduje - uruchamiamy naszą aplikację
document.addEventListener('DOMContentLoaded', () => {
    // Tworzymy globalną instancję TaskManager dostępną z HTML (onclick)
    window.taskManager = new TaskManager();
});

// Dodajemy style CSS dla animacji powiadomień bezpośrednio przez JavaScript
const style = document.createElement('style');
style.textContent = `
    /* Animacja wjeżdżania powiadomienia z prawej strony */
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Animacja wyjeżdżania powiadomienia w prawą stronę */
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    /* Płynne przejście dla efektu hover na zadaniach */
    .task-item {
        transition: transform 0.2s ease;
    }

    /* Style dla powiadomień */
    .notification {
        font-family: var(--font-family);
        font-size: var(--font-size-sm);
        font-weight: 500;
    }
`;
// Dodajemy style do sekcji <head> strony
document.head.appendChild(style);