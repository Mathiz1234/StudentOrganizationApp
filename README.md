# Aplikacja do zarządzania organizacją studencką
Aplikacja pomaga głównie w zarządaniu zasobami ludzkimi organizacji. Można ją zaintalować na urządzenia z systemem android i IOS. Wymagane jest połącznie internetowe do korzystania z aplikacji.

## Funkcjonalności:
- [ ] Logowanie się za pomocą google jako forma rejstracji i logowania do aplikacji (in progress)
- [x] Lista osób w organizacji wraz z filtracją
- [x] Baza wiedzy o osobach (ich szczegółowe dane, jakie zajmowali funkcje oraz jakie przeszli treninigi, wyjazdy itd.)
- [x] Edycja roli i statusu członków organizacji
- [x] Edycja zajmowanych funkcji, szkoleń, wyjazdów itd. członków organizacji
- [x] Lista odliczania do urodzin
- [x] Zmiana danych profilowych
- [x] Zarządzanie dostępnymi projektami i funkcjami
- [x] Zarządzanie dostępnymi dodatkowymi aktywnościami jak treningi, wyjazdy itd.
- [x] Podgląd w postaci chronologicznej "calli" na dane projekty oraz możliwość dodawania własnych (kalendarium + tasklista)
- [x] Podgląd w postaci chronologicznej "feedbacków" na dane projekty oraz możliwość dodawania własnych (kalendarium + tasklista)

## Frontend
Część frontendowa aplikacji została napisana wykorzystując technologie webowe. Dzięki spejcalnemu narzędziu jakim jest Capasitor udało się osiągnąć uniwersalność i możliość instalowania aplikacji na urządzenia mobilne.

### Użyte technologie
- Ionic
- Capasitor
- Type Script
- React
- Vite
- pomniejsze odpowiednie paczki (można znaleźć w package.json)

### Jak uruchomić
Należy mieć zainstalowane środowisko NodeJS i Ionic oraz odpowiednio dla androida AndroidStudio, a dla IOS XCode.
Nastęnie wejść w katalog "frontend" i urchuchomić poniższe komendy:

Budowanie aplikacji:
```
$ npm i
$ npm run build

```
Uruchomienie aplikacji w przeglądarce:
```
$ npm run dev
```

Uruchomienie aplikacji dla androida:
```
$ ionic add android
$ ionic cap sync
$ ionic open android
```

Uruchomienie aplikacji dla IOS:
```
$ ionic add ios
$ ionic cap sync
$ ionic open ios
```

## Backend
Część backendowa aplikacji jest REST-owym API napisanym w środowiku NodeJS.
Dodatkowo backend został wyhostowany na platformie chmurowej railway. Adres do dokumentacji API: https://bestgliwicebackend-production.up.railway.app/api-docs#/

### Użyte technologie
- NestJS
- PostgreSQL
- Type Script
- Googleapis
- pomniejsze odpowiednie paczki (można znaleźć w package.json)

### Bezpieczeństwo
Aplikacjia backendowa korzysta z Json Web Tokens w celu zabezpieczania swoich zasobów.
 
### Jak uruchomić
Należy mieć zainstalowane środowisko NodeJS oraz PostgreSQL.
Nastęnie wejść w katalog "backend", odpowiednio utworzyć i uzupełnić plik ".env" ze zmiennymi środowikowymi (przykłaodwy plik z wymaganymi zmiennymi to .env.example)

Uruchamianie api:
```
$ npm i
$ npm run build
$ npm run start:prod
```
