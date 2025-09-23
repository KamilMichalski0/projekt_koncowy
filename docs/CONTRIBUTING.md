# 🤝 Contributing to TaskFlow

Dziękujemy za zainteresowanie współpracą przy projekcie TaskFlow! Ten dokument zawiera wszystkie informacje potrzebne do skutecznego współtworzenia projektu.

## 📋 Spis treści

- [Code of Conduct](#code-of-conduct)
- [Jak rozpocząć](#jak-rozpocząć)
- [Workflow rozwoju](#workflow-rozwoju)
- [Standardy kodowania](#standardy-kodowania)
- [Testowanie](#testowanie)
- [Commitowanie](#commitowanie)
- [Pull Requests](#pull-requests)
- [Zgłaszanie błędów](#zgłaszanie-błędów)
- [Sugestie funkcji](#sugestie-funkcji)

## 📜 Code of Conduct

Projekt TaskFlow przestrzega standardów otwartego i przyjaznego środowiska. Oczekujemy od wszystkich uczestników:

- **Szacunku** - Traktuj innych z godnością i szacunkiem
- **Konstruktywności** - Przekazuj feedback w sposób pomocny
- **Inclusywności** - Witaj różnorodność i różne perspektywy
- **Profesjonalizmu** - Utrzymuj wysokie standardy w komunikacji

## 🚀 Jak rozpocząć

### Wymagania środowiska

- **Node.js** v18+
- **npm** v8+
- **Git** v2.20+
- Edytor kodu (zalecany: VS Code)

### Setup projektu

1. **Fork repozytorium**
   ```bash
   # Idź do GitHub i kliknij "Fork"
   ```

2. **Sklonuj swój fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/taskflow.git
   cd taskflow
   ```

3. **Dodaj upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/taskflow.git
   ```

4. **Zainstaluj zależności**
   ```bash
   npm install
   ```

5. **Sprawdź czy wszystko działa**
   ```bash
   npm test
   npm run dev
   ```

## 🔄 Workflow rozwoju

### Synchronizacja z upstream

Przed rozpoczęciem pracy zawsze zsynchronizuj swój fork:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### Tworzenie nowego brancha

```bash
git checkout -b feature/amazing-feature
# lub
git checkout -b fix/critical-bug
# lub
git checkout -b docs/update-readme
```

**Konwencja nazewnictwa branchy:**
- `feature/` - nowe funkcje
- `fix/` - poprawki błędów
- `docs/` - zmiany w dokumentacji
- `test/` - dodanie lub poprawy testów
- `refactor/` - refaktoryzacja kodu

## 📝 Standardy kodowania

### JavaScript

**Używamy:**
- ES6+ syntax
- `const`/`let` zamiast `var`
- Template strings zamiast konkatenacji
- Arrow functions gdzie to sensowne
- Async/await zamiast .then()

**Przykład dobrego kodu:**
```javascript
// ✅ Dobrze
class TaskManager {
    async loadTasks() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            return data.tasks || [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }
}

// ❌ Źle
function loadTasks() {
    return fetch('/api/tasks').then(function(response) {
        return response.json();
    }).then(function(data) {
        return data.tasks || [];
    }).catch(function(error) {
        console.log(error);
        return [];
    });
}
```

### CSS

**Używamy:**
- CSS Custom Properties (zmienne CSS)
- Flexbox i CSS Grid
- Mobile-first responsive design
- BEM methodology dla klas CSS

**Przykład:**
```css
/* ✅ Dobrze */
.task-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-4);
    border-radius: var(--border-radius);
}

.task-item--completed {
    opacity: 0.6;
}

.task-item__text {
    flex: 1;
    font-size: var(--font-size-base);
}
```

### HTML

**Standardy:**
- Semantyczny HTML5
- Accessibility attributes (ARIA)
- Poprawna hierarchia nagłówków
- Alt text dla obrazów

### Komentarze

**Dodawaj komentarze w języku polskim** dla wszystkich funkcji publicznych:

```javascript
// ✅ Dobrze
/**
 * Funkcja dodaje nowe zadanie do listy
 * @param {string} taskText - Tekst zadania
 * @returns {Promise<boolean>} - true jeśli sukces
 */
async function addTask(taskText) {
    // Walidacja tekstu zadania
    if (!taskText.trim()) {
        return false;
    }
    // ... reszta implementacji
}
```

## 🧪 Testowanie

### Uruchamianie testów

```bash
# Wszystkie testy
npm test

# Testy z coverage
npm run test:coverage

# Testy w trybie watch
npm run test:watch
```

### Pisanie testów

Każda nowa funkcja powinna mieć testy:

```javascript
// tests/newFeature.test.js
describe('New Feature', () => {
    test('should work correctly', () => {
        // Arrange
        const input = 'test data';

        // Act
        const result = newFeature(input);

        // Assert
        expect(result).toBe('expected output');
    });

    test('should handle errors gracefully', () => {
        expect(() => newFeature(null)).not.toThrow();
    });
});
```

### Test Requirements

- **Coverage**: Minimum 80% dla nowego kodu
- **Unit tests**: Dla wszystkich funkcji publicznych
- **Integration tests**: Dla API endpoints
- **Error cases**: Testuj błędne scenariusze

## 📦 Commitowanie

### Commit Message Format

Używamy [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: nowa funkcja
- `fix`: poprawka błędu
- `docs`: zmiany w dokumentacji
- `style`: formatowanie, nie wpływa na kod
- `refactor`: refaktoryzacja kodu
- `test`: dodanie testów
- `chore`: zmiany w build process, dependencies

**Przykłady:**
```bash
feat: add task filtering by status
fix: resolve memory leak in TaskManager
docs: update API documentation
test: add tests for task deletion
refactor: extract validation logic to separate module
```

### Commit Guidelines

- **Jeden commit = jedna zmiana** logiczna
- **Opisowe wiadomości** - wyjaśnij "dlaczego", nie "co"
- **Maksymalnie 50 znaków** w tytule
- **Body** dla złożonych zmian
- **Co-authored-by** dla pair programming

## 🔀 Pull Requests

### Przed utworzeniem PR

1. **Aktualizuj branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Uruchom testy**
   ```bash
   npm test
   npm run test:coverage
   ```

3. **Sprawdź kod**
   ```bash
   npm run dev  # Sprawdź czy działa lokalnie
   ```

### PR Template

```markdown
## 📝 Description
Brief description of what this PR does.

## 🔄 Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## 🧪 Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested this feature manually

## 📋 Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code in Polish, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published

## 📸 Screenshots (if applicable)
Add screenshots to help explain your changes.

## 🔗 Related Issues
Fixes #(issue number)
```

### PR Review Process

1. **Automated checks** muszą przejść (testy, linting)
2. **Code review** od co najmniej jednego maintainer'a
3. **Manual testing** dla zmian UI
4. **Documentation** musi być zaktualizowana

### Response do review comments

- **Bądź otwarty** na feedback
- **Wyjaśnij** decyzje projektowe jeśli potrzeba
- **Commituj** poprawki jako oddzielne commity
- **Oznacz** resolved conversations

## 🐛 Zgłaszanie błędów

### Bug Report Template

```markdown
## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## ✅ Expected Behavior
A clear description of what you expected to happen.

## 📸 Screenshots
If applicable, add screenshots to help explain your problem.

## 🌍 Environment
- OS: [e.g. iOS, Windows, Linux]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Node.js version: [e.g. v18.16.0]

## 📝 Additional Context
Add any other context about the problem here.
```

### Priorytety błędów

- **Critical** 🔴: Aplikacja się crashuje/nie działa
- **High** 🟠: Główna funkcja nie działa poprawnie
- **Medium** 🟡: Mniejsze problemy z funkcjonalnością
- **Low** 🟢: Kosmetyczne problemy

## 💡 Sugestie funkcji

### Feature Request Template

```markdown
## 🚀 Feature Description
A clear and concise description of what you want to happen.

## 🤔 Problem Statement
Is your feature request related to a problem? Please describe.

## 💭 Proposed Solution
A clear description of what you want to happen.

## 🔄 Alternatives Considered
A clear description of any alternative solutions you've considered.

## 📊 Additional Context
Add any other context or screenshots about the feature request here.

## 🎯 Acceptance Criteria
- [ ] User can do X
- [ ] System responds with Y
- [ ] Edge case Z is handled
```

## 🏗️ Architecture Guidelines

### Adding New Features

1. **Rozważ impact** na istniejący kod
2. **Zachowaj backward compatibility** gdy to możliwe
3. **Dodaj odpowiednie testy**
4. **Zaktualizuj dokumentację**
5. **Śledź performance impact**

### File Organization

```
src/
├── components/     # Komponenty UI
├── utils/          # Funkcje pomocnicze
├── api/           # API handlers
├── tests/         # Testy
└── docs/          # Dokumentacja
```

### Code Style Tools

Używamy następujących narzędzi (planowane w przyszłości):

```bash
# ESLint dla JavaScript
npm run lint

# Prettier dla formatowania
npm run format

# Pre-commit hooks
npm run pre-commit
```

## 🎯 Areas for Contribution

Szukamy pomocy w następujących obszarach:

### 🐛 Bug Fixes
- Memory leaks
- Cross-browser compatibility
- Performance issues

### ✨ Features
- Task categories/tags
- Due dates and reminders
- Export/import functionality
- Dark mode
- PWA capabilities

### 📚 Documentation
- Code comments
- API documentation
- Tutorial videos
- Examples

### 🧪 Testing
- Unit test coverage
- Integration tests
- E2E tests
- Performance tests

### 🎨 Design
- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Animation polish

## 🏆 Recognition

Contributors będą uznani w:

- **README.md** - lista contributorów
- **CHANGELOG.md** - przy każdym release
- **GitHub Releases** - specjalne podziękowania

## 📞 Kontakt

Potrzebujesz pomocy? Skontaktuj się z nami:

- **GitHub Issues** - dla pytań związanych z kodem
- **GitHub Discussions** - dla ogólnych pytań
- **Email** - dla prywatnych spraw

## 📚 Dodatkowe zasoby

- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [CSS Guidelines](https://cssguidelin.es/)
- [Git Best Practices](https://www.git-tower.com/learn/git/ebook/)
- [Writing Good Commit Messages](https://chris.beams.io/posts/git-commit/)

---

**Dziękujemy za twoją współpracę!** 🙏

Każdy wkład, bez względu na rozmiar, jest ceniony i pomaga uczynić TaskFlow lepszym dla wszystkich użytkowników.