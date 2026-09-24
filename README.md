# Aan de oever

Een kleine Nederlandstalige webapp met een stil, getekend landschap, optioneel zacht geruis en een tijdelijk briefje. Geen accounts, statistieken, externe lettertypen, afhankelijkheden of backend. Geen behandeling of belofte over een gezondheidseffect.

De app opent stil en zonder beweging. Alleen het water verbergt de bediening; Terug of Escape brengt die terug. Optioneel zijn gedimd beeld en heel langzame beweging beschikbaar. De systeemvoorkeur voor minder beweging gaat voor. Audio start uitsluitend na een klik, komt langzaam op en stopt bij het verlaten van het tabblad. Een briefje blijft uitsluitend in het geheugen van de huidige pagina en verdwijnt bij vernieuwen/sluiten. Geen localStorage, analytics of verzending van tekst. De hostingprovider kan reguliere toegangslogs bewaren.

## Delen

Open de GitHub Pages-link. Voeg voor een persoonlijke begroeting `#voor=Voornaam` toe. Het fragment wordt niet naar de hostingserver gestuurd. Een persoonlijke begroeting is geen toegangsbeveiliging. De naam is geen onderdeel van de broncode.

## Uitvoeren en publiceren

Statische HTML, CSS en JavaScript: geen build nodig. Publiceer de hoofdmap van branch `main` via GitHub Pages. Open voor lokale ontwikkeling de map met een willekeurige lokale HTTP-server. Na een eerste online bezoek worden de appbestanden voor offline gebruik gecachet. Een nieuw bezoek probeert altijd eerst de nieuwste online versie. Verhoog de cacheversie in `sw.js` bij updates. De basisapp werkt ook via `index.html` als lokaal bestand, dan zonder serviceworker.

## Controle

Controleer op mobiel en desktop: persoonlijke begroeting, watermodus en toetsenbordterugkeer, briefje dichtvouwen/heropenen/wissen, dialogen sluiten met Escape, gedimd beeld, optionele beweging, geruis aan/uit en tabbladwissel. Controleer dat vernieuwen het briefje wist en geluid en beweging uit laat. Alle tekstinvoer en namen worden als tekst behandeld, nooit als HTML.
