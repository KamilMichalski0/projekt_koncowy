# 📡 TaskFlow API Documentation

TaskFlow API to prosty RESTful interface do zarządzania zadaniami. API obsługuje operacje CRUD na zadaniach z automatyczną walidacją i normalizacją danych.

## 🔗 Base URL

```
http://localhost:3000/api
```

W środowisku produkcyjnym (Vercel):
```
https://your-app.vercel.app/api
```

## 🔐 Autoryzacja

API nie wymaga autoryzacji. Wszystkie endpointy są publicznie dostępne.

## 📋 Endpoints

### Pobierz wszystkie zadania

```http
GET /api/tasks
```

Zwraca listę wszystkich zadań z bazy danych.

**Headers:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

**Response (200 OK):**
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1758637750035,
      "text": "Przykładowe zadanie",
      "completed": false,
      "createdAt": "2025-09-23T14:29:10.035Z"
    },
    {
      "id": 1758637751024,
      "text": "Zadanie wykonane",
      "completed": true,
      "createdAt": "2025-09-23T14:30:15.024Z"
    }
  ],
  "count": 2
}
```

**Response Fields:**
- `success` (boolean) - Status operacji
- `tasks` (array) - Lista zadań
- `count` (number) - Liczba zadań

### Zaktualizuj zadania

```http
POST /api/tasks
```

Zastępuje całą listę zadań nową listą. Wszystkie istniejące zadania są zastępowane.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "tasks": [
    {
      "id": 1758637750035,
      "text": "Zaktualizowane zadanie",
      "completed": true,
      "createdAt": "2025-09-23T14:29:10.035Z"
    },
    {
      "text": "Nowe zadanie bez ID",
      "completed": false
    }
  ]
}
```

**Request Body Fields:**
- `tasks` (array, required) - Lista zadań do zapisania

**Pojedyncze zadanie może zawierać:**
- `id` (number, optional) - ID zadania (auto-generowane jeśli brak)
- `text` (string, optional) - Treść zadania (domyślnie pusty string)
- `completed` (boolean, optional) - Status wykonania (domyślnie false)
- `createdAt` (string, optional) - Data utworzenia ISO (auto-generowana jeśli brak)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tasks updated successfully",
  "tasks": [
    {
      "id": 1758637750035,
      "text": "Zaktualizowane zadanie",
      "completed": true,
      "createdAt": "2025-09-23T14:29:10.035Z"
    },
    {
      "id": 1758637752000,
      "text": "Nowe zadanie bez ID",
      "completed": false,
      "createdAt": "2025-09-23T14:32:00.000Z"
    }
  ],
  "count": 2
}
```

### CORS Preflight

```http
OPTIONS /api/tasks
```

Obsługuje preflight requests dla CORS.

**Response (200 OK):**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 🚨 Error Responses

### 400 Bad Request - Nieprawidłowe dane

**Przyczyny:**
- `tasks` nie jest tablicą
- Nieprawidłowy JSON w request body

**Example:**
```json
{
  "success": false,
  "error": "Tasks must be an array"
}
```

```json
{
  "success": false,
  "error": "Invalid JSON in request body"
}
```

### 405 Method Not Allowed

**Przyczyna:** Użyto nieobsługiwanej metody HTTP (PUT, DELETE, PATCH, etc.)

**Example:**
```json
{
  "success": false,
  "error": "Method PUT not allowed"
}
```

### 500 Internal Server Error

**Przyczyny:**
- Błąd zapisu do pliku
- Nieoczekiwany błąd serwera

**Example:**
```json
{
  "success": false,
  "error": "Failed to save tasks"
}
```

```json
{
  "success": false,
  "error": "Internal server error"
}
```

## 🔄 Data Flow

### Walidacja i normalizacja

API automatycznie normalizuje dane zadań:

1. **ID Generation:** Jeśli zadanie nie ma ID, generowane jest na podstawie `Date.now()`
2. **Text Validation:** Pusty lub brakujący tekst zastępowany jest pustym stringiem
3. **Boolean Conversion:** `completed` konwertowane na boolean
4. **Timestamp Generation:** Brakująca `createdAt` uzupełniana aktualną datą ISO

**Przykład normalizacji:**
```javascript
// Input
{
  "text": "Task",
  "completed": "true"  // string
}

// Output (po normalizacji)
{
  "id": 1758637750035,
  "text": "Task",
  "completed": true,   // boolean
  "createdAt": "2025-09-23T14:29:10.035Z"
}
```

## 📁 Struktura pliku danych

Dane są przechowywane w pliku `db.json` w następującej strukturze:

```json
{
  "tasks": [
    {
      "id": 1758637750035,
      "text": "Example task",
      "completed": false,
      "createdAt": "2025-09-23T14:29:10.035Z"
    }
  ]
}
```

### Automatyczne tworzenie pliku

Jeśli plik `db.json` nie istnieje, API automatycznie go tworzy z pustą listą zadań:

```json
{
  "tasks": []
}
```

## 🔧 Konfiguracja CORS

API obsługuje Cross-Origin Resource Sharing (CORS) z następującymi nagłówkami:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Uwaga:** W środowisku produkcyjnym zaleca się ograniczenie `Access-Control-Allow-Origin` do konkretnych domen.

## 📝 Przykłady użycia

### JavaScript Fetch API

**Pobieranie zadań:**
```javascript
async function getTasks() {
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();

    if (data.success) {
      console.log('Tasks:', data.tasks);
      console.log('Count:', data.count);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Dodawanie zadania:**
```javascript
async function addTask(taskText) {
  try {
    // Najpierw pobierz istniejące zadania
    const response = await fetch('/api/tasks');
    const data = await response.json();

    const tasks = data.success ? data.tasks : [];

    // Dodaj nowe zadanie
    tasks.push({
      text: taskText,
      completed: false
    });

    // Zapisz zaktualizowaną listę
    const updateResponse = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tasks })
    });

    const result = await updateResponse.json();
    console.log('Update result:', result);

  } catch (error) {
    console.error('Error:', error);
  }
}
```

### cURL Examples

**GET Request:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Accept: application/json"
```

**POST Request:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "text": "New task from cURL",
        "completed": false
      }
    ]
  }'
```

## 🚀 Rate Limiting

API nie implementuje rate limiting w aktualnej wersji. W środowisku produkcyjnym zaleca się dodanie middleware dla rate limiting.

## 📊 Monitoring i Logging

API loguje wszystkie błędy do konsoli serwera:

- Błędy parsowania JSON
- Błędy dostępu do plików
- Nieoczekiwane błędy serwera

**Format logów:**
```
Error reading tasks: [error details]
Error writing tasks: [error details]
Error parsing request body: [error details]
Server error: [error details]
```

## 🔮 Przyszłe wersje

Planowane funkcje w kolejnych wersjach API:

- **v2.0**: Autoryzacja i autentykacja
- **v2.1**: Paginacja dla dużych list zadań
- **v2.2**: Filtrowanie i sortowanie
- **v2.3**: Websockets dla real-time updates
- **v2.4**: Backup i restore
- **v2.5**: Soft delete z koszem

## 🐛 Znane ograniczenia

1. **Brak tranzakcji**: Operacje nie są atomowe
2. **Brak concurrent access protection**: Możliwa utrata danych przy jednoczesnych zapisach
3. **Ograniczenia pliku JSON**: Nie nadaje się do bardzo dużych ilości danych
4. **Brak walidacji tekstu**: Nie ma limitu długości tekstu zadania

## 🤝 Wsparcie

W przypadku problemów z API:

1. Sprawdź logi serwera
2. Zweryfikuj format request body
3. Upewnij się że nagłówki są poprawne
4. Sprawdź czy plik `db.json` ma odpowiednie uprawnienia

Szczegóły implementacji znajdziesz w pliku `api/tasks.js`.