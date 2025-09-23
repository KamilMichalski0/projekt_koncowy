Plan Aplikacji: Interaktywna Aplikacja To-Do z Zapisem do Pliku JSON
1. Podsumowanie Projektu
Stworzymy w pełni funkcjonalną, nowoczesną aplikację internetową typu "To-Do List". Użytkownik będzie mógł dodawać, wyświetlać i oznaczać zadania jako wykonane. Aplikacja będzie posiadała graficzny interfejs, a co najważniejsze, wszystkie dane będą trwale zapisywane w pliku db.json po stronie serwera. Finalny projekt zostanie opublikowany w internecie na platformie Vercel.

2. Kluczowa Koncepcja: Frontend + Backend (Serverless)
Ze względów bezpieczeństwa, JavaScript w przeglądarce (frontend) nie ma bezpośredniego dostępu do plików na serwerze. Aby to obejść, stworzymy mały "program-pośrednik" (backend), który będzie działał na serwerze Vercela.

Analogia: Nasza strona w przeglądarce to klient w restauracji. Plik db.json to składniki w kuchni. Klient (frontend) nie może sam wejść do kuchni. Zamiast tego, woła kelnera (naszą funkcję serwerową) i składa zamówienie (np. "dodaj nowe zadanie"). Kelner idzie do kuchni, aktualizuje składniki (zapisuje dane w db.json) i przynosi potwierdzenie.

Tego "kelnera" zrealizujemy jako funkcję serwerową w Node.js, co jest niezwykle proste do zrobienia na Vercelu.

3. Technologie
Frontend: HTML, CSS, JavaScript (z użyciem fetch do komunikacji z API)

Backend: Node.js (jako Vercel Serverless Function)

Przechowywanie danych: Plik db.json na serwerze

Narzędzie Główne: Claude Code CLI do generowania całego kodu

Hosting: Vercel

4. Struktura Plików w Projekcie
Nasz projekt będzie miał następującą, przejrzystą strukturę:

/
|-- index.html              # Główny plik z interfejsem użytkownika
|-- style.css               # Style dla naszej aplikacji
|-- script.js               # Logika frontendu (obsługa kliknięć, komunikacja z API)
|
|-- api/
|   |-- tasks.js            # Nasza funkcja serwerowa (backend)
|
|-- db.json                 # Nasza "baza danych" w pliku JSON
Ważne: Vercel automatycznie rozpoznaje, że pliki w folderze api/ to funkcje serwerowe, które mają być uruchamiane po stronie serwera.

5. Punkty Końcowe API (Nasz "Kelner")
Nasza funkcja w api/tasks.js będzie obsługiwać dwa rodzaje "zamówień" od frontendu:

GET /api/tasks: Prośba o pobranie wszystkich zadań. Nasz backend odczyta plik db.json i odeśle jego zawartość.

POST /api/tasks: Prośba o zapisanie nowej listy zadań. Nasz backend odbierze nową listę, nadpisze plik db.json i odeśle potwierdzenie.

6. Plan Pracy (Etapy Budowy Aplikacji z Claude Code)
Podzielimy pracę na cztery logiczne etapy:

Krok 1: Struktura i Wygląd (Frontend)
Zaczniemy od części wizualnej. Poprosimy Claude'a o wygenerowanie kodu dla:

index.html: Szkielet aplikacji z formularzem i listą.

style.css: Proste, nowoczesne style, aby aplikacja wyglądała dobrze.

Krok 2: Logika Backendu (Funkcja Serwerowa)
To serce naszej aplikacji. Poprosimy Claude'a o stworzenie szkieletu funkcji serwerowej w api/tasks.js (Node.js), która będzie potrafiła:

Obsłużyć żądanie GET i odczytać zawartość db.json.

Obsłużyć żądanie POST i zapisać nowe dane do db.json.

Krok 3: Połączenie Całości (Logika Frontendu)
W pliku script.js zlecimy Claude'owi napisanie logiki, która:

Po załadowaniu strony, wyśle żądanie GET do /api/tasks i wyświetli zadania.

Po dodaniu nowego zadania przez użytkownika, wyśle całą zaktualizowaną listę żądaniem POST do /api/tasks.

Będzie obsługiwać oznaczanie zadań jako wykonanych i ich usuwanie (poprzez aktualizację listy i wysłanie jej przez POST).

Krok 4: Publikacja w Internecie (Deployment)
Na sam koniec, używając terminala, zainstalujemy Vercel CLI i jedną komendą opublikujemy naszą aplikację, uzyskując publiczny link do naszego działającego projektu.