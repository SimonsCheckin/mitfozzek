# Mit főzzek? – telepítés iPhone-ra (Mac nélkül)

Ez egy webapp (PWA): feltöltöd egy ingyenes tárhelyre, megnyitod iPhone-on Safariban, és felteszed a kezdőképernyőre. Onnantól saját ikonja van, teljes képernyőn fut, és internet nélkül is működik.

## 1. Feltöltés (válassz egyet)

### A) Netlify Drop (a leggyorsabb)
1. Csomagold ki a zip-et egy mappába (a mappában ott legyen az `index.html`).
2. Nyisd meg: https://app.netlify.com/drop
3. Húzd rá a **mappát** az oldalra. Pár másodperc múlva kapsz egy linket (pl. `valami-nev.netlify.app`).
4. Ha az oldal felajánlja, hogy fiókot hozol létre vagy hozzárendeled az oldalt, fogadd el (ingyenes). Így biztosan megmarad az oldal.

### B) GitHub Pages
1. Hozz létre egy ingyenes fiókot a github.com-on, majd egy új, **publikus** repository-t (pl. `mitfozzek`).
2. *Add file ▸ Upload files*: húzd be a mappa **tartalmát** (nem magát a mappát), és mentsd (Commit).
3. *Settings ▸ Pages ▸ Build and deployment*: Source: *Deploy from a branch*, Branch: `main`, mappa: `/ (root)`, Save.
4. Egy-két perc múlva a címed: `https://FELHASZNALONEV.github.io/mitfozzek/`

## 2. Telepítés az iPhone-ra
1. Nyisd meg a linket **Safariban** (ne Chrome-ban).
2. Koppints a **Megosztás** gombra (négyzet nyíllal) ▸ **Kezdőképernyőhöz adás** ▸ Hozzáadás.
3. Innentől a kezdőképernyőn lévő ikonról indítsd.

## Tudnivalók
- Az adataid (otthoni készlet, kedvencek, bevásárlólista) csak a telefonodon tárolódnak, nincs fiók, nincs szerver.
- iPhone-on a kezdőképernyős app külön tárolót használ, mint a Safari. Ezért az ikonról indítva elölről kell megadnod az alapanyagokat, ami a Safariban volt, az nem jön át.
- Frissítés: ha később módosítunk valamit, töltsd fel újra a fájlokat ugyanoda. Az app következő indításakor, ha van net, magától frissül (néha kétszer kell bezárni és megnyitni).
- Új recept: a `data.js` fájlban találod az összes receptet és alapanyagot.
