# Dusza2026

## Hogy működik a programunk?

0. Hogy működik a programunk?
    - nagyrészt jól működik
    - a Miner Script futtatásához felelőtlenül használtuk az ai-t, elég problémás is lett a code.js, amit már nem is tudtunk kijavítani. 

1. először mindig a bejelentkezéshez visz,
    - ahol megadod a felhasználóneved,
    - a jelszavad,
    - majd ha van fiókod, belépsz, ha nincs, regisztrálsz
    - a bejelentkezési adataid a users táblába kerülnek a robotszim adatbázisban.

2. mainScreen
    - ha beléptél, a mainScreenre navigál az oldal.
    - itt láthatod a baloldalt a pályát a robottal
    - a jobboldalt pedig a kódszerkesztőt és a terminált

3. a fejléc gombjai
    - kijelentkezés
    - pálya betöltése szerverről

4. kód futtatása
    - nyomj a start gombra, és ha szerencséd van lefut

5. robot mozgatása
    - a code.js felel a tokenizálásért, kód felbontásáért, futtatásáért, és közben a robot.js függvényeit használja a robottal kapcsolatos funkciókra, mint a robot áthelyezése a pályán, előtte levő akadályok megvizsgálása, stb...

6. pálya/miner script betöltése fileból
    - húzd a pálya [.map végződésű] fájlt a pálya fölé és engedd el.
    - ha megfelelő a fájl formátuma, azt a pályát fogja betölteni.
    - ez működik a minder script [.ms végződésű] fájloknál is
    - vicces trükk: ha betöltesz így egy pályát, majd rányomsz a szerkesztésre és a mentésre sorban, a fájl fel fog kerülni a pályák közé

7. pálya betöltése szerverről
    - a mainScreenen a jobb felső részen a fejlécen levő gombot nagyon szeretem, 
    - a pályák mappában levő map fájlokat lehet lekérni vele, és betölteni a pályára

8. adatbázis
    - az adatbázis létrehozásához a create_db.sql-t írtuk, abban jól látszódik az adatbázis szerkezete
    - a users a felhasználók kezelésére
    - a ranglista úgy működött volna, hogy egy táblába rakjuk az összes pályának a helyezettjeit, eltároljuk a usert, aki az eredményt elérte, az összegyűjtött aranyrögöket, az értük megtett lépéseket, és hogy ez melyik pályán történt. Ezután nagyon szép sql lekérdezést tudtunk volna írni az egyes pályák ranglistáinak létrehozásához.

9. pálya szerkesztése
    - Ez a másik legszebb része a programnak, a *térkép szerkesztésre* kell kattintani a pálya felett, majd kiválasztani, hogy milyen eszközt szeretnél a pályára tenni [# fal, @ aranyrög, . üres cella, vagy a robot a megfelelő irányba nézve]
    - ezután el lehet menteni a pályát a szerverre, ki lehet exportálni és letölteni, vagy lehet importálni fájlból. 

<!-- 10. Ranglista megjelenítése/elrejtése -->

11. felhasználók kezelése
    - users táblában az adatbázisban (titkosítás nélkül :( )
    - php sessionben a felhasználónév -> ezt lehetett volna beírni a ranglista táblába, amikor sikeresen lefutott egy kód egy pályára.

## mappaszerkezet magyarázata
/
- index.php - bejelentkező oldal. ha be vagy jelentkezve, továbbnavigál a mainScreenre.
- script.js, style.css mind az index.php-t szolgálja
- 
- createdb.sql - ezzel hoztuk létre az adatbázist, azért tartottuk meg, mert jól átlátható

## amit tud extrán a programunk
- mutatja, hogy hol tart a kód, ami nem pillanatszerűen fut le.
- mosolyt csal emberek arcára :)

## amit nem tud a programunk a feladatleíráshoz képest (és dolgoztunk rajta):
 - pályánkénti ranglista a felszedett aranyrögök és a lépések alapján