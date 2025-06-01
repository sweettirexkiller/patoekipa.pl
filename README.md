# Portfolio Patoekipy

Patoekipa to grupa przyjaciół z dzieciństwa, która nadal utrzymuje kontakt oraz wszyscy z ekipy skończyli w IT. 

To jest ich portfolio dostępne w dwóch wersjach:
- **Flutter** - aplikacja mobilna i webowa
- **Next.js** - nowoczesna aplikacja webowa

## 📁 Struktura Projektu

```
patoekipa.pl/
├── flutter/              # Aplikacja Flutter
│   ├── lib/              # Kod źródłowy Flutter
│   ├── android/          # Konfiguracja Android
│   ├── web/              # Konfiguracja Web
│   └── pubspec.yaml      # Zależności Flutter
├── nextjs/               # Aplikacja Next.js
│   ├── src/              # Kod źródłowy Next.js
│   ├── public/           # Pliki statyczne
│   └── package.json      # Zależności Node.js
├── shared/               # Wspólne zasoby
│   ├── assets/           # Obrazy, ikony, pliki
│   ├── content/          # Treści, dane portfolio
│   └── branding/         # Logo, kolory, fonty
└── README.md
```

## 🚀 Uruchamianie Projektów

### Flutter

```bash
# Przejdź do katalogu Flutter
cd flutter

# Zainstaluj zależności
flutter pub get

# Uruchom w trybie deweloperskim
flutter run -d chrome  # dla wersji web
flutter run             # dla urządzeń mobilnych
```

### Next.js

```bash
# Przejdź do katalogu Next.js
cd nextjs

# Zainstaluj zależności
npm install

# Uruchom w trybie deweloperskim
npm run dev
```

Aplikacja Next.js będzie dostępna pod adresem: http://localhost:3000

## 🛠️ Rozwój

### Dodawanie Nowych Zasobów

Wszystkie wspólne zasoby (obrazy, ikony, treści) powinny być dodawane do katalogu `shared/`:

- `shared/assets/` - obrazy, ikony, pliki multimedialne
- `shared/content/` - dane portfolio, opisy projektów
- `shared/branding/` - logo, paleta kolorów, fonty

### Synchronizacja Treści

Oba projekty korzystają z tych samych zasobów z katalogu `shared/`, więc:
- Zmiany w treściach automatycznie wpływają na obie wersje
- Nowe obrazy dodane do `shared/assets/` są dostępne w obu projektach
- Aktualizacje brandingu dotyczą obu wersji

## 📱 Wersje

### Flutter
- ✅ Aplikacja mobilna (Android/iOS)
- ✅ Aplikacja webowa
- ✅ Natywna wydajność
- ✅ Wspólny kod dla wszystkich platform

### Next.js
- ✅ Nowoczesna aplikacja webowa
- ✅ Optymalizacja SEO
- ✅ Szybkie ładowanie
- ✅ Responsywny design

## 🔧 Narzędzia

- **Flutter**: SDK Flutter 3.4.3+
- **Next.js**: Node.js 18+, React 19, TypeScript
- **Styling**: Tailwind CSS (Next.js), Material Design (Flutter)

## 📦 Deployment

### Flutter Web
```bash
cd flutter
flutter build web
```

### Next.js
```bash
cd nextjs
npm run build
```

---

**Enjoy!** 🚀 