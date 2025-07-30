# Protokoll 08.05.2025

## Aktueller Stand

### Frontend

Views auf der Main:

- Startseite
- Tierübersicht mit Filter
- NGO-Übersicht mit Filter
- Registrierung: 
    - User: Account-Erstellung
    - NGO: Account-Erstellung
- Admin-Seite mit allen unverifizierten NGOS
- Anmeldung (mit Email + Passwort)

Funktionalität auf der Main:

- Benutzerregistrierung (muss im Backend korrigiert werden)
- Navigation über Navbar


## Zusammenfassung 


### Verifikation

1. Registrierung NGO-User
2. Registrierung NGO-Konto -> Verifikation
3. NGO taucht auf in Admin-Seite
4. Admin: An-/ Ablehnen

Backend Todo: Passwort-Validierung

### Suchen und Filtern

- Backend: 
    - Senden, aller Breeds, Charaktereigenschaften, Länder, ...
    - Empfangen: Filterauswahl
    - Anpassung Verifikation: Backendverbindung auf Webseite geht nicht (URL anpassen)

- Frontend:
    - Zod anschauen

### Matching

1. Halter klickt bei Tier "ich habe Interesse"-Button
2. Speicherung des Haltes als Interessent -> DB-Anpassung
3. Halter: Übersicht aller geliketen/ interessierten Tiere
4. NGO: Seite aller intressierten Halter

Backend: Berechnung des Rankings (Wie gut passen Halter und Tier zusammen?)


## ToDos

### Beide

- Absprache bezüglich Filter

### Backend

- Port Fixen
- Berechnung der Rankings zwischen Halter und Tier
- Passwort Validierung

### Frontend

- Zod anschauen und evtl. einbauen
- Views: Halter-Profil 
- Types 




