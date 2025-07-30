# Anleitung zur allgemeinen Nutzung von Git

## Grundlagen von Git

- https://git-scm.com/book/en/v2


## Q & A

### Wie kopiere/klone ich ein Repository von Git auf mein Codeeditor (z.B. VsCode)

Gehe auf das gewünschte Git Repository und klicke rechts auf Code.

Kopiere den URL mit https. Z.B. lautet der URL für das H4S-Backend Repo: https://gitlab.informatik.hs-augsburg.de/home4strays/home4strays-backend.git

Öffne ein Terminal in deinem Codeeditor und gebe nacheinander folgende Befehle ein:

 ```
# bewege dich zum Ordner, wo du das Repository clonen möchtest
cd pfad/zum/ordner

# Falls du Git zum ersten Mal nutzt musst du ein Useremail und Username festlegen
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com

# Klone das Repo mit dem URL und gebe deine geforderte RZ-Kennung sowie dein RZ-Passwort ein
git clone https://gitlab.informatik.hs-augsburg.de/home4strays/home4strays-backend.git

# um alle Libraries vom Projekt zu installieren
npm install
```

Das Repo sollte jetzt in deinem Ordner hochgeladen und verfügbar sein.

### Wie kann ich ein Issue-Branch erstellen und es lokal verwalten?

Versichere dich, dass du im Hochschulnetz bist. 

In Git ist es üblich seine Änderungen in einem Branch auszuführen und danach auf den Hauptbranch main zu pushen (zu veröffentlichen).

Angenommen du hast ein Issue erstellt und es wurde genehmigt, wie erstellst du ein Branch basierend auf dem Issue?

Gehe im Issue auf den Pfeil neben "Create Merge Request" und wähle "Create branch". Es sollte im Repo ein Branch mit demselben Namen deines Issues erscheinen.

Um den Branch lokal auszuführen gehe in deinem Codeeditor auf dein Repo-Ordner.

```
cd repo/pfad

git status # gibt an auf welchem Branch du gerade bist 

# falls du Änderungen in deinem aktuellen Branch hast und sie behalten möchtest, musst du sie zuvor committen
git add .
git commit -m "your message"

# falls du die Änderungen *nicht* behalten möchtest
git stash

# synchronisiere dein lokales Repo mit dem remote Repo (damit neu erstellter Branch sichtbar wird)
git pull

# installiere Libraries
npm install

# erstelle einen neuen Branch, der auf dem Issue Branch in Git basiert
git checkout -B dein-neuer-branch-name origin/issue-branch-name

# versichere dich, dass du im neuen Branch bist, der auf dem Issue-Branch basiert
git status
```

### Wie kann ich Änderungen von meinem lokalen Branch auf mein remote Branch hochladen/pushen?

Versichere dich, dass du im Hochschulnetz bist. 

Gehe auf deinen lokalen Repo Ordner.

```
# Damit dein lokaler Branch über alle Änderungen im Repo up to date ist 
git fetch

# installiere neue Libraries
npm install

# Falls nötig commite zuerst alles 
git add .
git commit -m "Your message"

# Möglichkeit 1: Pushe auf den upstream Branch (den Branch mit dem dein lokaler Branch verbunden ist. Kannst du prüfen mit "git status")
git push

# Möglichkeit 2: Definiere den upstream Branch selber
git branch -u origin/upstream-branch-name
git push 

# Möglichkeit 3: In einem Befehl pushen und upstream branch definieren
git push origin dein-branch-name:upstream-branch-name

```
* Upstream-Branch ist immer der Branch auf den du pushen möchtest

### Wie kann ich einen Merge Request zur main machen?

Falls du dir sicher bist, dass du mit deinen Änderungen/Issue fertig bist, kannst du einen Merge Request initieren.

Gehe in GitLab auf dein Issue und wähle "Create Merge Request"

Wähle einen "Assignee"/Beauftragten und einen "Reviewer"/Prüfer

Dann gehe unten auf "Create Merge Request"

Nachdem dein Reviewer alles überprüft hat kannst du auf "Merge" klicken.

### Q & A: Wie synchronisiere ich meinen Branch mit einem anderen Branch?

Manchmal ist es erforderlich Änderungen aus einem anderen remote Branch (z.B. origin/main) zu integrieren

```
# Gehe in dein lokales Repo
cd pfad/zum/repo

# Damit dein lokaler Branch über alle Änderungen im Repo up to date ist 
git fetch

# Erstelle ein Branch, dass auf dem branch basiert, von wo du die Änderungen integrieren möchtest
git checkout -B neuer-feature-branch origin/branch-mit-gewünschten-änderungen

# Wechsle in den Branch, in dem du externe Änderungen integrieren möchtest (falls du nicht schon drin bist)
git checkout mein-branch

# Merge die Änderungen aus dem anfangs erstellten Branch mit dem aktuellen Branch
git merge neuer-feature-branch

# Bei Bedarf 
npm install
```
