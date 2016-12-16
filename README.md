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
- projektek megtekintése  **DONE**
- problémák megtekintése  **DONE**
- megoldások megtekintése  **DONE**
- az ezekhez tartozó kommentek megtekintése  **DONE**
- _bejelentkezés (exklúzív)_ **DONE**
- profil megtekintése **DONE**

**Felhasználó (User)**
- új probléma nyitása **DONE**
- megoldás beküldése **DONE**
- kommentelés  **DONE**
- szavazás  **DONE**
- új projekt nyitása **DONE**
- kijelentkezés **DONE**
- saját megoldás szerkesztése  **DONE**
- saját probléma szerkesztése **DONE**
- saját szavazás módosítása **DONE**

**Megbízott (Trusted)**
- megoldás elfogadása  **DONE**
- megoldás szerkesztése **DONE**
- probléma szerkesztése **DONE**

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
![Use-Case diagram](/docpics/usecase.png)

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

`POST /login` - belépési adatok -> _beléptetés_ -> főoldal

`GET /register` - regisztrációs oldal

`POST /register` - regisztrációs adatok

`GET /logout` - _kiléptetés_ -> főoldal




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



`GET /show/<PROJECT_ID>/edit` - projekt szerkesztése

`POST /show/<PROJECT_ID>/edit` - projekt szerkesztésének adatai

`POST /show/<PROJECT_ID>/trusted/add` - megbízott hozzáadása

`GET /show/<PROJECT_ID>/trusted/<FELHASZNÁLÓ_ID>/remove` - megbízott törlése



`GET /<PROJECT_ID>/show/<PROBLEM_ID>/edit` - probléma szerkesztése

`POST /<PROJECT_ID>/show/<PROBLEM_ID>/edit` - probléma szerkesztésének adatai


`GET /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/edit` - megoldás szerkesztése

`POST /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/edit` - megoldás szerkesztésének adatai



`POST /show/<PROJECT_ID>/comment` - új projekt komment adatai

`POST /<PROJECT_ID>/show/<PROBLEM_ID>/comment` - új probléma komment adatai

`POST /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/comment` - új projekt komment adatai


`GET /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/accept` - megoldás elfogadása/elfogadásának visszavonása


`POST /show/<PROJECT_ID>/vote/<COMMENT_ID>` - szavazás probléma kommentjére



`POST /<PROJECT_ID>/show/<PROBLEM_ID>/vote` - szavazás problémára

`POST /<PROJECT_ID>/show/<PROBLEM_ID>/vote/<COMMENT_ID>` - szavazás probléma kommentjére



`POST /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/vote` - szavazás megoldásra

`POST /<PROJECT_ID>/<PROBLEM_ID>/show/<SOLUTION_ID>/vote/<COMMENT_ID>` - szavazás megoldás kommentjére





##Oldalvázlatok

**Főoldal** **DONE**

![Főoldal](/docpics/pages/f_oldal.jpg)


**Regisztráció** **DONE**

![Regisztráció](/docpics/pages/register_new.jpg)


**Profil** **DONE**

![Profil](/docpics/pages/profile_new.jpg)


**Új projekt** **DONE**

![Új projekt](/docpics/pages/new_project_new.jpg)


**Kiválasztott projekt** **DONE**

![Kiválasztott projekt](/docpics/pages/project_new.jpg)


**Új probléma beküldése** **DONE**

![Új probléma beküldése](/docpics/pages/new_problem_new.jpg)


**Probléma megoldásai** **DONE**

![Probléma válaszai](/docpics/pages/problem_new.jpg)


**Új megoldás** **DONE**

![Új válasz](/docpics/pages/new_solution_new.jpg)


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


#Kliensoldali programrész

  *Minden script-file a `public/scripts` könyvtárban található szerveroldalon.*

  - Akkordion-menü méretének kiszámolása
  
    Az akkordion-menük animációjához szükséges a tartalmuk magasságának kiszámolása.
    
    A kliensoldali script-file: **accordion.js**


  - Deaktiváció megerősítése
  
    Egy modális ablak jelenik meg egy projekt deaktiválásánál, amin meg kell erősíteni a deaktiválási szándékot.
    
    A kliensoldali script-file: **confirm.js**


  - Kommentek betöltése lapfrissítés nélkül
  
    Egy komment beküldése után a hozzátartozó komment-listát dinamikusan frissíti egy AJAX funkció.
    
    A kliensoldali script-file: **refreshproject.js** és **refreshproblem.js**

  - Szavazatok betöltése lapfrissítés nélkül
  
    Miután a felhasználó a szavazó gombra kattintással szavazott, a szavazatának beküldését és az érintett szavazati mezőt dinamikusan frissíti egy AJAX funkció.
    
    A kliensoldali script-file: **refreshproject.js** és **refreshproblem.js**

  - Dinamikus keresés
  
      A főoldalon megtalálhato projektek között kereső mező dinamikussá tétele AJAX-al.
      A kulcsszó megváltoztatásával, azaz egy bullentyű lenyomásával a kliens új keresési kérést intéz a szerverhez.
      
      A kliensoldali script-file: **search.js**
      
      **Szekvenciadiagram:**
      
      ![Keresés szekvenciadiagramja](/docpics/Untitled.png)
      



#Tesztelés

##Hogy telepitsd a Seleniumot


##Hogy futtasd a teszteket Seleniumban


  - Belépés
  
  - Project deaktiválása
  
  - Project aktiválása
  
  - Szavazás
  
