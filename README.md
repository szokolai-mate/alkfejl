# Alkalmazások fejlesztése beadandó

**Készítette:** Szokolai Máté

**Neptun-kód:** F7XDW9

  Ez a github repository tartalmazza a beadandómat az Alkalmazások fejlesztése tárgyra.A feladat egy saját magadnak kitalált alkalmazás megvalósítása és dokumentálása.
# Dokumentáció


##Követelményelemzés

**Projektekre szétosztott probléma és megoldás követő és listázó alkalmazás.**

Egy olyan szerver-kliens alkalmazást fogok elkészíteni, mely egy internetes böngészőn keresztül elérhető. Az alkalmazás projekteknél felmerülő problémákat (például bugok, hibák vagy hiányosságok) fog nyilvántartani, közzétenni és a problémák lehetséges megoldásait nyilvántartani, közzétenni és elfogadni.
A problémákat és megoldásokat lehet véleményleni, valamit hozzájuk szólni.
A projekt tulajdonosa kijelölhet felhasználókat megbízottjaiként, akik a problémák és megoldások moderálását illetve elfogadását végzik.

A leírás alapján a szerepkörök és a hozzájuk tartozó **funkcionális követelmények** a kovetkezők:

**Vendég (Guest)** 
- projektek megtekintése
- problémák megtekintése
- megoldások megtekintése
- az ezekhez tartozó kommentek megtekintése
- _bejelentkezés (exklúzív)_ **DONE**

**Felhasználó (User)**
- új probléma nyitása **DONE**
- megoldás beküldése **DONE**
- kommentelés
- szavazás
- új projekt nyitása **DONE**
- kijelentkezés **DONE**
- saját komment szerkesztése
- saját megoldás szerkesztése
- saját probléma szerkesztése
- saját szavazás visszavonása
- profil megtekintése **DONE**

**Megbízott (Trusted)**
- megoldás elfogadása
- probléma lezárása
- probléma újranyitása
- megoldás szerkesztése
- probléma szerkesztése

**Tulajdonos (Owner)**
- új megbízott felvétele **DONE**
- megbízott törlése **DONE**
- megbízottak megtekintése **DONE**
- projekt inaktivizálása **DONE**
- projekt újranyitása **DONE**
- projekt szerkesztése **DONE**

A szerepkörök kibővítik egymást a következő sorrendben:
**Vendég <- Felhasználó <- Megbízott <- Tulajdonos** , azaz minden funkció amit a bal oldalon szereplő szerepkör része, a jobb oldalon szereplőé is. (Például Megbízott is tud megoldást beküldeni.) Ez alól kivétel a regisztráció, mivel egy felhasználó már regisztrálva van.

**Használati esetek diagramja:**
![Use-Case diagram](/docpics/usecase2.png)

**Péda folyamatábrák:**

![Egy megoldás elfogadása](/docpics/megoldas_elfogadasa.png)

Megbízott felhasználóként: egy megoldás elfogadása.

![Kommentelés egy megoldásra](/docpics/kommenteles_megoldasra.png)

Felhasználóként: Kommentelés egy megoldásra.


##Oldaltérkép

- főoldal = projektek
  - bejelentkezés
  - keresés projektek között
- regisztráció
- projekt
  - projekt kommentjei
  - problémák
    - probléma kommentjei
    - probléma megoldásai
      - megoldások kommentjei
      
**Authentikálva:**

- főoldal = projektek
  - keresés projektek között
- profil
  - saját projektek
    - projekt szerkesztése
      - megbízottak szerkesztése
  - saját problémák
    - probléma szerkesztése
  - saját megoldások
    - megoldás szerkesztése
- projekt
  - projekt kommentjei
    - új probléma
  - problémák
    - új megoldás
    - probléma kommentjei
    - probléma megoldásai
      - megoldások kommentjei
- új projekt

##Végpontok

`GET /` - főoldal, projektek

`POST /login` - belépési adatok -> főoldal

`GET /register` - regisztrációs oldal

`POST /register` - regisztrációs adatok



`POST /search` - keresés projektek között -> főoldal

`GET /profile/<USER_ID>` - profil oldal


`GET /show/<PROJEKT_ID>` - kitüntetett projekt

`GET /<PROJEKT_ID/show/<PROBLEM_ID>` - kitüntetett probléma


`GET /new` - új projekt oldal

`GET /<PROJEKT_ID>/new` - új probléma oldal

`GET /<PROJEKT_ID/<PROBLEM_ID>/new` - új megoldás oldal



`POST /new` - új projekt adatai

`POST /<PROJEKT_ID>/new` - új probléma adatai

`POST /<PROJEKT_ID/<PROBLEM_ID>/new` - új megoldás adatai


`GET /<PROJECT_ID>/manage` - projekt szerkesztése

`POST /show/<PROJECT_ID>/comment` - új projekt komment adatai
`POST /<PROJECT_ID>/show/<PROBLEM_ID>/comment` - új probléma komment adatai
`POST /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/comment` - új projekt komment adatai


##Oldalvázlatok

**Főoldal** **DONE**

![Főoldal](/docpics/pages/főoldal.jpg)


**Regisztráció** **DONE**

![Regisztráció](/docpics/pages/register.jpg)


**Profil** **DONE**

![Profil](/docpics/pages/profile.jpg)


**Új projekt** **DONE**

![Új projekt](/docpics/pages/new_project.jpg)


**Projekt szerkesztése** **DONE**

![Projekt szerkesztése](/docpics/pages/manage_project.jpg)


**Kiválasztott projekt** **DONE**

![Kiválasztott projekt](/docpics/pages/project.jpg)


**Új probléma beküldése**

![Új probléma beküldése](/docpics/pages/new_problem.jpg)


**Probléma megoldásai**

![Probléma válaszai](/docpics/pages/problem.jpg)


**Új megoldás**

![Új válasz](/docpics/pages/new_solution.jpg)


##Adatbázisterv

![adatbázisterv](/docpics/db.png)

##Nem-funkcionális követelmények

- **Szükséges környezet**
  - Kliens oldalon
    - JavaScript futtatására képes böngésző

  - Szerver oldalon
    - Node.js
    - Adonis
    - Relációs adatbáziskezelő
    - Amit még nem tudok hogy kelleni fog

    -AdonisJS
    -ace
    -express-admin
    -sqlite3
  
- **Személyes adatok biztonságos tárolása**
- **Hibás adatok kiszűrése**
- **Aergonomikus kezelőfelület**
- **Vonzó külalak**
