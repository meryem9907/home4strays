**Spezifikation Home4Strays**

**Zielsetzung![](Aspose.Words.32637d64-ee0a-45c2-b6c2-025db99f582b.001.png)**

Die WebApp “Home4Strays” soll NGOs die Vermittlung von Straßentieren an geeignete Halter erleichtern. Gleichzeitig erhalten potenzielle Halter eine Plattform, um passende Tiere zu finden und aufzunehmen. Die Anwendung bietet Funktionen für Suche von Tieren und Haltern, automatisches Matching von Halter <-> Tier sowie NGO <-> Halter , Kommunikation, Verwaltung von Tier- und Benutzerprofilen sowie zusätzliche Werkzeuge zur Verifikation von NGOs.

**Anforderungen![](Aspose.Words.32637d64-ee0a-45c2-b6c2-025db99f582b.002.png)**

Es gibt zwei Nutzergruppen: Halter und NGOs. GUI und Funktionalitäten unterscheiden sich hinsichtlich der beiden Nutzergruppen. Es gibt aber auch Gemeinsamkeiten.

Im Folgenden werden zunächst die Funktionalitäten und Daten von Haltern, NGOs, NGO- Mitgliedern beschrieben. Dann werden auchd die Daten von den Tierprofilen beschrieben. Anschließend erläutern wir welche Funktionen sowohl beim Halter als auch NGO-Mitglied vorhanden sein sollten.

1. **Halter**

Als Halter gelten vollständig geschäftsfähige Personen, die ein Tier adoptieren oder temporär aufnehmen möchten.

1. **Dashboard**
- Grobe Übersicht aller gematchten Tiere als Bilderkarussel, wie bei Tinder:

  ![](Aspose.Words.32637d64-ee0a-45c2-b6c2-025db99f582b.003.jpeg)

  - Statusanzeige jedes gematchten Tieres (verfügbar, reserviert, adoptiert)
- Übersicht über alle veröffentlichten Tiere
  - Filter- und Suchfunktionen, um nach einem bestimmten Tier zu suchen. Dieses Feature erlaubt auch nicht gematchte Tiere.
- Favoriten-Funktion zum Speichern interessanter Tierprofile
- Detaillierte Einsicht in Tierprofile mit Link zum Profil der Ansprechperson
2. **Halterkonto aus Sicht der NGO**
- **Profilbild** (opt)
- **Persönliche Daten:** Name (mand), Geburtsdatum (mand), Wohnort (mand), Straße (opt), Hausnummer (opt), Telefonnummer (opt), E-Mail (mand)
- **Haustiererfahrung:**
  - Vorerfahrung mit Tieren (z. B. Hundebesitzer seit 10 Jahren) (mand)
  - Aktuelle Haustiere mit Profilen (s. [Tierprofile (https://hedgedoc.obco.pro/s/TE5NcGOB6#3- Tierprofile)](https://hedgedoc.obco.pro/s/TE5NcGOB6#3-Tierprofile)) (opt)
- **Lebenssituation:**
  - Aktueller Familienstand (Single, Familie, Wohngemeinschaft, Alter und Anzahl der Kinder etc.) (mand)
  - Wohnsituation (Wohnung, Haus mit Garten, ländlich/städtisch) (mand)
- **Kapazitäten:**
  - Verfügbare Zeit pro Tag für das Tier in Stunden (mand)
  - Wohnfläche in m³ (mand)
  - Möglichkeiten für Urlaubsbetreuung (mand)
- **Haltungsdauer:** (mand)
  - Adoption (permanent)
  - Temporäre Aufnahme mit definiertem Zeitraum
- **Links zu Social-Media Kanälen (Instagram, Facebook, X, YouTube) und Website der NGO** (opt)
- **Optionale Angaben:**
  - Finanzierungsbedarf für Futter/Tierarzt (falls Unterstützungsoptionen bestehen)
2. **Tierschutz-NGOs**

NGOs sind gemeinützige nichtstaatliche Organisationen, die für die Umsetzung ihrer Ziele generell ohne staatliche Hilfe auskommen. Diese App zielt insbesondere auf NGOs ab, die sich mit dem Wohl und Schutz von Tieren befassen. Ihre Tätigkeiten sind im Allgemeinen die Rettung, Versorgung und Vermittlung von Tieren, das Aufdecken von Missständen, Aufklärungsarbeit sowie politisches Engagement für bessere Tierschutzgesetze.

1. **Dashboard**
- Grobe Übersicht aller gematchten Halter
- Übersicht aller (auch nicht gematchten) Halter
  - Filter-/Suchfunktion, um gezielt Halter zu suchen
- Favoriten-Funktion zum Speichern interessanter Halterprofile
- Sperren oder Einschränken von Halterkonten bei Verstößen
- Markierung von zuverlässigen und geprüften Haltern
- Detaillierte Einsicht in Halterprofile
2. **Zusätzliche Funktionalität bei den Tierprofilen**
- Statusänderung für Tiere (z. B. verfügbar, reserviert, vorübergehend vermittelt, adoptiert)
- Angabe spezieller Anforderungen an den Halter in Bezug auf ein bestimmtes Tier (z. B. Haustiererfahrung, Kapazitäten, Lebenssituation, Wohnort)
- Verweis auf das Profil der NGO-Ansprechperson spezifisch für das Tier. Denn für jedes Tier kann es unterschiedliche Ansprechpersonen aus der NGO geben.
3. **Allgemeines NGO-Konto**
- Name der Organisation
- Anzahl der Mitglieder
- kurze Beschreibung der Mission
- Auflistung der zur NGO zugehörigen Benutzerkonten mit Link
- Links zu Social-Media Kanälen (Instagram, Facebook, X, YouTube) und Website der NGO
4. **Benutzerkonto der NGO-Mitglieder**
- Aus Sicht des Halters:
  - Profilbild (opt.)
  - Persönliche Daten: Vorname (mand), Nachname (mand), Telefonnummer (opt), E- Mail (mand)
  - Sprechzeiten (opt)
  - Links zu Social-Media Kanälen (Instagram, Facebook, X, YouTube) (opt)
- Aus Sicht des Kontobesitzers:
  - NGO-Mitglied kann einen Einladungslink generieren (mand)

**2.4 Verifikationsverfahren für NGOs**

- Falls die NGO zum ersten Mal registriert wird ist der Upload von landesspezifischen offiziellen Dokumenten (z. B. Registrierungsurkunden) erforderlich. Prüfung und Freigabe durch Plattform-Administratoren
- Falls die NGO bereits registriert und verifiziert ist kann ein registriertes Mitglied einen Einladungslink an die E-Mail-Adresse der nicht-registrierten Person schicken. Über diesen Link kann die Person sich dann mit E-Mail und Passwort registrieren ohne das ein zusätzliches Verifikationsverfahren erforderlich ist
3. **Tierprofile**

Jedes Tier hat ein öffentliches individuelles Profil mit folgenden Daten:

- **Allgemeine Informationen:**
  - Profilbild (opt)
  - Name (mand)
  - Rasse (opt)
  - Geschlecht (mand)
  - Alter in Jahren (mand)
  - Gewicht in g bzw. kg (mand)
- **Gesundheitszustand:**
  - Impfstatus (mand)
  - Kastriert/sterilisiert (mand)
  - Chronische Erkrankungen (opt)
  - Datum der letzten tierärztliche Untersuchung (opt)
- **Verhalten:**
  - Sozialverhalten mit anderen Tieren sowie Verhalten gegenüber Menschen (scheu, zutraulich, aggressiv, verspielt) (opt)
  - Ängste oder besondere Bedürfnisse (opt)
- **Ernährungsweise:**
  - Spezielle Diät oder Futterallergien (opt)
  - Fressverhalten (wählerisch, Allesfresser) (opt)
- **Weitere Fotos vom Tier** (opt)
4. **Gemeinsame Funktionen für Halter & NGOs**

Sowohl Halter als auch NGO-Mitglied sollen folgende Funktionen nutzen können:

- **Benutzerprofile anlegen, bearbeiten und löschen**
- **Tierprofile anlegen, bearbeiten und löschen**
- **Registrierung und Anmeldung:** Angabe von E-Mail und Passwort
- **Kommunikation:**
  - Chatfunktion innerhalb der Plattform, damit die Parteien sich austauschen können
  - Automatische E-Mail-Benachrichtigung bei neuen Nachrichten oder Matches

**Technische Umsetzung![](Aspose.Words.32637d64-ee0a-45c2-b6c2-025db99f582b.004.png)**

**Tech-Stack:**

- **Frontend:** Preact mit TypeScript, Tailwind mit Daisy UI
- **Backend:** Express mit TypeScript
- **Datenbank:** PostgreSQL
- **Authentifizierung:** JWT (JSON Web Token) für sichere Anmeldung
- **Datei-Upload:** Cloud-Storage-Integration (S3)
- **Hosting:** Docker-basierte Bereitstellung

**Erweiterungsmöglichkeiten & Zukunftsvision![](Aspose.Words.32637d64-ee0a-45c2-b6c2-025db99f582b.005.png)**

- **Mobile App:** Native App für iOS und Android für besseren Zugriff
- **KI-gestütztes Matching:** Algorithmus zur optimierten Vermittlung von Tieren basierend auf Nutzerpräferenzen und Tiercharakteristika
- **Gamification-Elemente:** Belohnungen für aktive Nutzer (z. B. Abzeichen für erfolgreiche Vermittlungen)
- **Mehrsprachigkeit:** Erweiterung der Plattform für internationale Adoptionen
- **Möglichkeit zur Spendenannahme** (Liberapay, PayPal, direkte Bankverbindung, falls rechtlich möglich)
- **Blog oder Informationsbereich mit Tipps zur Tierpflege und Adoption**
- **Marktplatz für Tierbedarf** (z. B. Futter, Leinen, Transportboxen)
- **Rezension** zu jedem Nutzer basierend auf den Kriterien Freundlichkeit, Antwortdauer, Zuverlässigkeit
- **Statusanzeige:** Benutzer können ihren Status auf online / abwesend / offline setzen

Bildquelle: <https://techcrunch.com/wp-content/uploads/2015/11/tinder-two.jpg?resize=300>

[(https://techcrunch.com/wp-content/uploads/2015/11/tinder-two.jpg?resize=300)](https://techcrunch.com/wp-content/uploads/2015/11/tinder-two.jpg?resize=300)
