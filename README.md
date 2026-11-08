# Dusza2026  
  
## Hogy működik a programunk?  
  
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

4. kód futtatása

5. robot mozgatása

6. pálya/miner script betöltése fileból
    - húzd a pálya [.map végződésű] fájlt a pálya fölé és engedd el.
    - ha megfelelő a fájl formátuma, azt a pályát fogja betölteni.
    - ez működik a minder script [.ms végződésű] fájloknál is
    - vicces trükk: ha betöltesz így egy pályát, majd rányomsz a szerkesztésre és a mentésre sorban, a fájl fel fog kerülni a pályák közé

7. pálya betöltése szerverről

8. adatbázis
    - az adatbázis létrehozásához a create_db.sql-t írtuk, abban jól látszódik az adatbázis szerkezete

9. pálya szerkesztése

## mappaszerkezet magyarázata
/
- index.php - bejelentkező oldal. ha be vagy jelentkezve, továbbnavigál a mainScreenre.
- script.js, style.css mind az index.php-t szolgálja
- 
- createdb.sql - ezzel hoztuk létre az adatbázist, azért tartottuk meg, mert jól átlátható

## amit tud extrán a programunk
 - :)

## amit nem tud a programunk a feladatleíráshoz képest (és dolgoztunk rajta):
 - pályánkénti ranglista a felszedett aranyrögök és a lépések alapján