# Protokoll 10.04.2025 (mit Herr Kolonko)

## User Stories

- große Userstory -> Epic
- Userstories klein halten


## NGOs anlegen

- Wer und wann legt account an
- Verifizierung anhand eines dokuments

## Wichtig

- Im Issue mehr infos (was hab ich implementiert?)

## Datenbankmodell (Herr Kolonkos Tipps)
 
**User**

- UserID: Keine Künstliche ID (lieber Email)
- Passwort: kein Namenskonvention!
- Telefonnummer: Keine Identifikation!
- Message: Sender + Timestamp (+ Empfänger) = Identifikator
- NGO -> NGOMember (0:\*)
- NGOID -> (Name + Land) 

**Shelter** 

- Besseren Namen für Shelter suchen
- "Willing" statt "Willingnes"
- Experience nicht lexikalisch (überlegen)
- Bessere Struktur für Shelter-Felder (nicht nur Freitext)
- Living Situation, Living Space zusammen betrachten


**Adresse**

- Abstrakt machen
- Aufsplitten
- Weniger Relationen: Joins kosten Performance

**Pet** 

- Bild keine Namenskonvention
- Rasse: Genauer werden (Unterscheidung Hund vs. Katze)
- Tier kann eine Krankheit haben -> Nicht als Freitext, Mehrere Krankheiten möglich
- Behaviour: Lieber als Enum oder ähnliches (Bemerkungsfeld)
- PetID kein Basistyp
