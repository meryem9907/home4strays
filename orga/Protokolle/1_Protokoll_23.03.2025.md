# Protokoll 23.03.2025 (online)
Thema: Organisatorisches

1. To-Do's
2. Technologie Stack
3. Aufgabenverteilung
4. Grober Zeitplan
5. Regeln
6. Erste Spezifikation

---

## To-Dos:

(Discord: Aufgaben/#aufgaben)

- Weitere Regeln ausdenken
- Abstimmung des wöchentlichen Meetings (ohne Kolonko)
- Zeitplan erstellen
- Einarbeitung bis zum nächsten Meeeting

## Technologie Stack

- Frontend: React, Tailwind
- Backend: Express, Node.js
- Datenbank: Postgres

## Aufgabenverteilung

- Frontend: Jessica, Nikolai, Borko
- Backend: Thien, Andre, Meryem
- Datenbank: Evi
- Flexibel: Agid

### Festgelegte Rollen

| Person       | Rollen                                         |
| ------------ | ---------------------------------------------- | 
| **Meryem**   | Product Owner, Zeitmanager, Moderator          |
| **Jessica**  | Protokolleur                                   |
| **Nikolai**  | Konfliktmanager                                |
| **Andre**    | Git-Verwalter                                  |
| **Agid**     | Scrum Master, Moderator                        |
| **Thien**    |                                                |
| **Evi**      |                                                |
| **Borko**    |                                                |

## Grober Zeitplan

- Einmal im Monat Retrospektive 
- Einmal die Woche ein internes Meeting
- Alle zwei Wochen Meeting mit Kolonko

## Regeln

(Discord: Organisatorisches/#regeln)

- Meinungsverschiedenheit: Zuhören, Verstehen/ Gehörtes Wiedergeben, eigene Meinung sagen
- Ausreden lassen (Scrum-Master garantiert dies)
- Termine einhalten. Falls man nicht kommen kann, unbedingt in der Gruppe mitteilen
- Sachlich bleiben, nicht persönlich nehmen
- Offen und transparent sein

---

# Erste Spezifikation Home4Strays 

(Discord: Organisatorisches/#spezifikation)

Wir wollen eine WebApp entwickeln mit der NGO’s Straßentiere an Halter vermitteln können und gleichzeitig Halter passende Straßentiere aufnehmen können.

## Anforderungen

### Halter
- [ ] Sollen sich Tiere anschauen und matchen können
- [ ] Es soll über ein Dashboard verfügen, wo alle gematchten Tiere dargestellt sind
- [ ] Benutzerprofil:
  - [ ]  Vorerfahrung mit Tieren
  - [ ]  aktuelle Haustiere
  - [ ]  aktueller Familienstand
  - [ ]  Wohnungslage
  - [ ]  freie Kapazitäten
  - [ ]  Zeitraum der Haltung (permanent/vorübergehend mit Zeitraum)
  - [ ]  opt. Finanzierungsbedarf
### NGO
- [ ] NGOs sollen sich gematchte Benutzer für jedes Tier anzeigen können
- [ ] NGOs sollen Benutzer sperren können
- [ ] Benutzerprofil:
  - [ ] verantwortliche Kontaktperson/Ansprechpartner
  - [ ] Anforderungen von den NGO's an die Tierhalter
  - [ ] Erreichbarkeitszeiten
- [ ] NGOs sollen Tiere anlegen, bearbeiten, löschen und den Status auf "Vergeben" stellen können
### Beide
- [ ] Anlegen, Ändern und Löschen von Profil bzw. Profildaten
- [ ] Statusanzeige (online/abwesend/offline)
- [ ] Chat-/Sprach-/Videocall-Möglichkeit per Weiterleitung auf externen Anbieter, um mit dem Benutzer oder der NGO in Kontakt treten zu können
- [ ] Anmelde-/ und Registrierungsfunktion
  - [ ] Verifikationsverfahren von NGO’s
- [ ] Benutzerprofil:
  - [ ] Kontaktdaten
  - [ ] aktueller Status
  - [ ] Standort
  - [ ] Daten mit Fotos belegen
- opt. Es soll eine Möglichkeit geben Spenden für beide Seiten (entgegenzunehmen (Liberapay, rechtlich schwierig?)
- Email-Benachrichtungsfunktionen bei Matching-Ergebnissen, Anrufen

