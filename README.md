# 📝 TaskFlow - Nowoczesna Aplikacja To-Do

**TaskFlow** to elegancka, responsywna aplikacja do zarządzania zadaniami zbudowana z wykorzystaniem nowoczesnych technologii web. Aplikacja oferuje intuicyjny interfejs użytkownika z trwałym zapisem danych i pełną funkcjonalnością CRUD.

![TaskFlow Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)

## ✨ Funkcje

- ➕ **Dodawanie zadań** - Szybkie dodawanie nowych zadań z walidacją
- ✅ **Oznaczanie jako wykonane** - Przełączanie statusu zadań jednym kliknięciem
- 🗑️ **Usuwanie zadań** - Bezpieczne usuwanie niepotrzebnych zadań
- 📊 **Statystyki w czasie rzeczywistym** - Liczniki zadań z polską odmianą
- 💾 **Trwały zapis danych** - Wszystkie dane zapisywane w pliku JSON
- 📱 **Design responsywny** - Działa na komputerach i urządzeniach mobilnych
- 🎨 **Nowoczesny design** - Glassmorphism i trendy UI/UX 2025
- ⚡ **Powiadomienia toast** - Informacje zwrotne o statusie operacji
- 🔒 **Bezpieczeństwo** - XSS protection i walidacja danych

## 🚀 Szybki start

### Wymagania

- Node.js v18+
- npm v8+

### Instalacja

1. **Sklonuj repozytorium**
   ```bash
   git clone <repository-url>
   cd projekt_koncowy
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski**
   ```bash
   npm run dev
   ```

4. **Otwórz w przeglądarce**
   ```
   http://localhost:3000
   ```

## 🛠️ Dostępne komendy

```bash
# Uruchomienie serwera deweloperskiego
npm run dev
npm start

# Uruchomienie testów
npm test
npm run test:watch    # Tryb watch
npm run test:coverage # Z pokryciem kodu

# Deployment na Vercel
vercel
vercel dev
```

## 🏗️ Architektura

### Frontend
- **HTML5** - Semantyczna struktura z accessibility
- **CSS3** - Modern CSS z custom properties i glassmorphism
- **JavaScript ES6+** - Vanilla JS z klasami i async/await
- **Inter Font** - Nowoczesna typografia

### Backend
- **Node.js** - Serverless functions
- **JSON File Storage** - Prosty i niezawodny system persistencji
- **CORS Support** - Pełna kompatybilność cross-origin

### Design System
- **Kolory**: Indigo primary (#6366f1) z neutralną paletą
- **Spacing**: Modułowa skala 0.25rem - 5rem
- **Typography**: Inter z wagami 300-700
- **Shadows**: System cieni dla głębi i elevacji
- **Border Radius**: 12px, 16px, 20px dla różnych komponentów

## 📁 Struktura projektu

```
projekt_koncowy/
├── 📄 index.html           # Główny plik HTML z UI
├── 🎨 style.css            # Style CSS z design system
├── ⚡ script.js            # Logika frontend w klasie TaskManager
├── 🖥️ server.js            # Lokalny serwer deweloperski
├── 📦 package.json         # Konfiguracja projektu i scriptu
├── 🙈 .gitignore          # Reguły ignorowania Git
├── api/
│   └── 🔧 tasks.js         # Serverless function (API)
├── tests/
│   └── 🧪 tasks.test.js    # Unit testy (12 test cases)
├── docs/
│   ├── 📚 API.md           # Dokumentacja API
│   └── 🤝 CONTRIBUTING.md  # Przewodnik dla kontrybutorów
└── 💾 db.json             # Plik z danymi (auto-tworzony)
```

## 🌐 API Endpoints

### GET /api/tasks
Pobiera wszystkie zadania

**Odpowiedź:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1234567890,
      "text": "Przykładowe zadanie",
      "completed": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/tasks
Zapisuje/aktualizuje zadania

**Request Body:**
```json
{
  "tasks": [
    {
      "id": 1234567890,
      "text": "Nowe zadanie",
      "completed": false
    }
  ]
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "message": "Tasks updated successfully",
  "tasks": [...],
  "count": 1
}
```

## 🧪 Testowanie

Projekt zawiera kompleksowy zestaw testów jednostkowych:

```bash
# Uruchomienie wszystkich testów
npm test

# Testy z pokryciem kodu
npm run test:coverage

# Testy w trybie watch (automatyczne ponowne uruchamianie)
npm run test:watch
```

**Pokrycie testów**: 100% dla plików API

**Test Cases (12 testów):**
- ✅ GET endpoint - różne scenariusze
- ✅ POST endpoint - walidacja i normalizacja danych
- ✅ Error handling - obsługa błędów
- ✅ CORS headers - nagłówki bezpieczeństwa
- ✅ Nieobsługiwane metody HTTP

## 🚀 Deployment

### Vercel (Recommended)

1. **Zainstaluj Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Zaloguj się**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### Alternatywne platformy

- **Netlify**: Dodaj `netlify.toml` z konfiguracją serverless functions
- **Heroku**: Stwórz `Procfile` z komendą start
- **Railway**: Push do Git repo podłączonego do Railway

## 🔧 Konfiguracja środowiska

### Zmienne środowiskowe

Nie są wymagane dla podstawowej funkcjonalności. Opcjonalnie:

```env
PORT=3000              # Port serwera (domyślnie 3000)
NODE_ENV=production    # Środowisko (development/production)
```

### CORS

API automatycznie obsługuje CORS dla wszystkich origin. W środowisku produkcyjnym można ograniczyć dostęp modyfikując nagłówki w `api/tasks.js`.

## 🎨 Customizacja

### Zmiana kolorów

Edytuj zmienne CSS w `style.css`:

```css
:root {
  --color-primary: #6366f1;    /* Główny kolor aplikacji */
  --color-success: #10b981;    /* Kolor sukcesu */
  --color-danger: #ef4444;     /* Kolor błędów */
}
```

### Dodanie nowych funkcji

1. **Frontend**: Rozszerz klasę `TaskManager` w `script.js`
2. **Backend**: Dodaj nowe endpointy w `api/tasks.js`
3. **Testy**: Napisz testy w `tests/tasks.test.js`

## 🐛 Troubleshooting

### Częste problemy

1. **Port 3000 zajęty**
   ```bash
   lsof -ti:3000 | xargs kill -9  # macOS/Linux
   netstat -ano | findstr :3000   # Windows
   ```

2. **Błąd EACCES przy instalacji**
   ```bash
   npm config set prefix ~/.npm-global
   export PATH=~/.npm-global/bin:$PATH
   ```

3. **Problemy z CORS**
   - Sprawdź czy serwer jest uruchomiony na localhost:3000
   - Upewnij się że używasz `npm run dev` zamiast statycznego serwera

4. **Testy nie przechodzą**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm test
   ```

## 🤝 Współpraca

Chcesz przyczynić się do rozwoju projektu? Sprawdź [CONTRIBUTING.md](docs/CONTRIBUTING.md)!

### Szybkie kroki:

1. Fork repozytorium
2. Stwórz branch dla swojej funkcji (`git checkout -b feature/amazing-feature`)
3. Commituj zmiany (`git commit -m 'Add amazing feature'`)
4. Push do brancha (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

## 📈 Roadmap

- [ ] **v2.0**: Kategorie zadań i filtry
- [ ] **v2.1**: Terminy wykonania z przypomnieniami
- [ ] **v2.2**: Eksport danych (JSON, CSV)
- [ ] **v2.3**: Dark mode
- [ ] **v2.4**: PWA support (offline mode)
- [ ] **v2.5**: Synchronizacja między urządzeniami

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik [LICENSE](LICENSE) po szczegóły.

## 🙏 Podziękowania

- **Claude Code** - AI assistant który pomógł w tworzeniu projektu
- **Inter Font** - Za piękną typografię
- **Vercel** - Za świetną platformę hosting
- **Jest** - Za framework do testowania

## 📞 Kontakt

- **Autor**: [Twoje Imię]
- **Email**: [Twój Email]
- **GitHub**: [Twój GitHub]

---

**Stworzono z ❤️ używając nowoczesnych technologii web**