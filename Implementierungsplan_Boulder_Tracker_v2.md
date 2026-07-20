# Implementierungsplan -- Boulder-Tracker (Vue)

## Ziel

Eine Vue-3-Anwendung zur Verwaltung gekletterter Boulder. Daten werden
lokal mit Dexie (IndexedDB) gespeichert. Pinia dient als zentrale
Datenquelle und kapselt den Zugriff auf Dexie. Die App läuft vollständig
offline (keine Backend-Abhängigkeit) und ist auf Desktop wie Mobile-Browser
nutzbar.

## Technologie

| Paket | Zweck |
|---|---|
| `vue` (^3.4) | UI-Framework, Composition API mit `<script setup>` |
| `vue-router` (^4) | Client-seitiges Routing |
| `pinia` (^2) | State Management / Datenzugriffsschicht |
| `dexie` (^4) | Wrapper um IndexedDB, Schema & Queries |
| `tailwindcss` (^3) | Utility-First-Styling |
| `flowbite` + `flowbite-vue` | Fertige UI-Bausteine auf Tailwind-Basis |
| `luxon` (^3) | Datum/Zeit-Handling |
| `vite` | Build-Tool / Dev-Server |
| `typescript` | Typisierung durchgängig, `strict: true` |
| `vitest` | Unit-Tests für Repositories und Stores |
| `eslint` + `prettier` | Linting/Formatierung |

Scaffolding: `npm create vite@latest boulder-tracker -- --template vue-ts`,
danach die übrigen Pakete per `npm install` ergänzen.

## Architektur

``` text
Vue
├── Views
├── Components
└── Pinia Stores
        │
        ▼
 Repository (Dexie)
        │
        ▼
   IndexedDB
```

Regeln (verbindlich, per Code Review durchgesetzt):

1. Views und Komponenten importieren **nie** `db/database.ts` oder ein
   Repository direkt -- nur Stores.
2. Stores importieren **nie** `dexie` direkt -- nur Repositories.
3. Nur `db/database.ts` importiert `dexie`.
4. Kein Store kennt einen anderen Store direkt; bereichsübergreifende
   Logik (z. B. "lösche Halle inkl. aller Bereiche") liegt in einer
   eigenen Service-Funktion (`services/cascade.ts`), die mehrere
   Repositories orchestriert.

## Projektstruktur

``` text
src/
  main.ts
  App.vue
  assets/
    tailwind.css
  components/
    hall/
      HallCard.vue
      HallForm.vue
    area/
      AreaCard.vue
      AreaForm.vue
    wall/
      WallCard.vue
      WallForm.vue
    route/
      RouteCard.vue
      RouteForm.vue
      AttemptForm.vue
      AttemptList.vue
    common/
      PageHeader.vue
      ListLayout.vue
      Card.vue
      Modal.vue
      Button.vue
      Input.vue
      Textarea.vue
      Select.vue
      Badge.vue
      Breadcrumb.vue
      Navbar.vue
      EmptyState.vue
      ConfirmDialog.vue
  db/
    database.ts
    schema.ts
  repositories/
    baseRepository.ts
    hallRepository.ts
    areaRepository.ts
    wallRepository.ts
    routeRepository.ts
    attemptRepository.ts
  services/
    cascade.ts
  stores/
    hallStore.ts
    areaStore.ts
    wallStore.ts
    routeStore.ts
    attemptStore.ts
  router/
    index.ts
  views/
    HallListView.vue
    HallView.vue
    AreaView.vue
    WallView.vue
    RouteView.vue
    NotFoundView.vue
  types/
    Hall.ts
    HallArea.ts
    Wall.ts
    Route.ts
    Attempt.ts
    index.ts
  utils/
    dates.ts
    id.ts
tests/
  repositories/
  stores/
  utils/
```

Ergänzt gegenüber der ursprünglichen Skizze: `main.ts`/`App.vue` als
Einstiegspunkte, `RouteView` (fehlte, obwohl Kurs-Details ein eigenes
MVP-View sind), `AttemptForm`/`AttemptList` (Versuche sind eine eigene
Entität mit eigenem CRUD), `NotFoundView` für unbekannte Routen,
`services/cascade.ts` für Cross-Store-Logik, `baseRepository.ts` (siehe
"Erweiterungen", wird direkt in Phase 1 mit eingeführt statt später
nachgezogen) sowie ein `tests/`-Verzeichnis.

## Datenmodell

Übernommen aus dem Prototyp im Ordner `boulder-checklist`
(`src/interfaces/*.ts`, `src/database/Root.ts`). Feldnamen und Typen
sind 1:1 übernommen, bis auf zwei bewusste Abweichungen:

- Beziehungen werden als numerischer Fremdschlüssel modelliert
  (`hallId: number` statt eingebettetem `hall: Hall`-Objekt). Der
  Prototyp speicherte in `Area`, `Wall`, `Problem` und `Attempt` jeweils
  das ganze verknüpfte Objekt (`Area.hall: Hall`, `Wall.area: Area`,
  ...). Das dupliziert Daten in IndexedDB und läuft auseinander, sobald
  sich z. B. der Hallenname ändert -- und widerspricht dem
  Repository-Layer, der genau das verhindern soll. Deshalb wird hier
  stattdessen nur die ID referenziert, wie im übrigen Plan bereits
  vorgesehen.
- `Problem` heißt hier weiterhin `Route`, damit der Rest dieses
  Plans (`RouteRepository`, `RouteStore`, `RouteView`, Routing) konsistent
  bleibt. Felder und Typen sind unverändert aus `Problem` übernommen.

Zwei Bugs aus dem Prototyp werden **nicht** übernommen: der ungültige
Dexie-Schema-Key `id++` (muss `++id` heißen) und die Inkonsistenz
zwischen Tabellenname `try` und Interface-/Property-Namen `attempt` in
`database/Root.ts`.

Alle IDs sind `number` (Dexie `++id`, Auto-Increment). Zeitstempel sind
ISO-8601-Strings (`string`), erzeugt über `utils/dates.ts`, nicht über
`new Date()` direkt in Komponenten -- das war im Prototyp noch nicht
vorhanden (`AbstractDexieInterface` kannte nur `id`).

### Hall (`types/Hall.ts`)

``` ts
export interface Hall {
  id?: number;
  name: string;
  address: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type HallInput = Omit<Hall, "id" | "createdAt" | "updatedAt">;
```

`address` statt `city` -- so hieß das Feld bereits im Prototyp.
`image` ist optional (Referenz auf ein Foto der Halle).

### HallArea (`types/HallArea.ts`)

``` ts
export interface HallArea {
  id?: number;
  hallId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type HallAreaInput = Omit<HallArea, "id" | "createdAt" | "updatedAt">;
```

Deckt sich mit `Area` aus dem Prototyp (dort ohne eigene Zusatzfelder
außer dem `hall`-Bezug).

### Wall (`types/Wall.ts`)

``` ts
export type WallType = "traverse" | "boulder";

export interface Wall {
  id?: number;
  hallAreaId: number;
  name: string;
  type: WallType;
  lastSetDate: string;   // ISO-Datum, wann zuletzt neu geschraubt wurde
  createdAt: string;
  updatedAt: string;
}

export type WallInput = Omit<Wall, "id" | "createdAt" | "updatedAt">;
```

Die im ursprünglichen Entwurf vorgesehenen Felder `angle`/`height`
entfallen zugunsten der Prototyp-Felder `type` (Quergang vs.
Boulderwand) und `lastSetDate`.

### Route (`types/Route.ts`, vormals `Problem`)

``` ts
export interface Route {
  id?: number;
  wallId: number;
  difficulty: string;    // z. B. "6A+", freies Textfeld
  type?: string;         // frei vergeben, z. B. "crimpy", "slopey"
  media: string[];       // Foto-/Video-Referenzen
  color: string;          // freies Textfeld, kein Enum
  setDate: string;
  archived: boolean;     // Soft-Delete-Flag statt Lösch-Zeitstempel
  createdAt: string;
  updatedAt: string;
}

export type RouteInput = Omit<Route, "id" | "createdAt" | "updatedAt">;
```

1:1 aus `Problem` übernommen (inkl. `difficulty` statt `grade`,
`color` als freies Textfeld statt Enum, `archived: boolean` statt
`removedAt`-Zeitstempel). `setter` und `notes` gab es im Prototyp
nicht und werden nicht ergänzt. Da `archived` kein Zeitstempel ist,
lässt sich nicht auswerten, *wann* eine Route archiviert wurde --
siehe "Erweiterungen".

### Attempt (`types/Attempt.ts`)

``` ts
export interface Attempt {
  id?: number;
  routeId: number;
  date: string;
  success: boolean;
  notes?: string;
  media?: string;         // einzelne Referenz (Route.media ist ein Array)
  createdAt: string;
  updatedAt: string;
}

export type AttemptInput = Omit<Attempt, "id" | "createdAt" | "updatedAt">;
```

1:1 aus dem Prototyp übernommen. Ohne `flash`/`top`-Flags lässt sich
eine Flash-Quote nicht direkt aus einem indexierten Feld lesen,
sondern muss aus `attemptRepository.getByRoute(routeId)` abgeleitet
werden (erster Versuch mit `success === true` = Flash). Für die in
"Erweiterungen" Punkt 7 vorgesehene Statistik reicht das; bei Bedarf
lässt sich ein abgeleitetes, indexiertes `flash`-Feld später ergänzen.

## Dexie-Schema

`db/schema.ts`:

``` ts
export const DB_NAME = "boulder-tracker";
export const DB_VERSION = 1;

export const SCHEMA_V1 = {
  halls: "++id,&name",
  hallAreas: "++id,hallId,&name",
  walls: "++id,hallAreaId,&name,type,lastSetDate",
  routes: "++id,wallId,difficulty,color,archived",
  attempts: "++id,routeId,date,success"
};
```

`&name` = eindeutiger Index, wie im Prototyp für Halle/Bereich/Wand
vorgesehen (`&name` in `Root.ts`).

`db/database.ts`:

``` ts
import Dexie, { type Table } from "dexie";
import { DB_NAME, DB_VERSION, SCHEMA_V1 } from "./schema";
import type { Hall } from "@/types/Hall";
import type { HallArea } from "@/types/HallArea";
import type { Wall } from "@/types/Wall";
import type { Route } from "@/types/Route";
import type { Attempt } from "@/types/Attempt";

export class BoulderTrackerDB extends Dexie {
  halls!: Table<Hall, number>;
  hallAreas!: Table<HallArea, number>;
  walls!: Table<Wall, number>;
  routes!: Table<Route, number>;
  attempts!: Table<Attempt, number>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(SCHEMA_V1);
  }
}

export const db = new BoulderTrackerDB();
```

Alle Fremdschlüssel (`hallId`, `hallAreaId`, `wallId`, `routeId`) sind
indexiert, ebenso `archived` (Filter "nur aktive Routen") und
`success`/`date` (Statistik-Queries auf Attempts) sowie die
eindeutigen `name`-Felder von Halle/Bereich/Wand.

## Repository-Layer

`repositories/baseRepository.ts` -- generische Basisklasse, die die
CRUD-Grundoperationen für eine Dexie-Table kapselt:

``` ts
import type { Table } from "dexie";

export class BaseRepository<T, TInput> {
  constructor(protected table: Table<T, number>) {}

  async getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  async get(id: number): Promise<T | undefined> {
    return this.table.get(id);
  }

  async create(input: TInput): Promise<number> {
    const now = new Date().toISOString();
    return this.table.add({
      ...input,
      createdAt: now,
      updatedAt: now
    } as T);
  }

  async update(id: number, changes: Partial<TInput>): Promise<number> {
    return this.table.update(id, {
      ...changes,
      updatedAt: new Date().toISOString()
    });
  }

  async delete(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
```

Konkrete Repositories erweitern `BaseRepository` und ergänzen
entitätsspezifische Abfragen:

``` ts
// repositories/areaRepository.ts
import { db } from "@/db/database";
import { BaseRepository } from "./baseRepository";
import type { HallArea, HallAreaInput } from "@/types/HallArea";

export class AreaRepository extends BaseRepository<HallArea, HallAreaInput> {
  constructor() {
    super(db.hallAreas);
  }

  async getByHall(hallId: number): Promise<HallArea[]> {
    return this.table.where("hallId").equals(hallId).toArray();
  }
}

export const areaRepository = new AreaRepository();
```

Analog: `WallRepository.getByArea(hallAreaId)`,
`RouteRepository.getByWall(wallId)` (mit optionalem Filter
`includeArchived: boolean = false`),
`AttemptRepository.getByRoute(routeId)`. Jedes Repository wird als
Singleton exportiert (`export const xRepository = new XRepository()`),
damit Stores es ohne Konstruktor-Aufruf importieren.

Keine Dexie-Abfragen (`db.*`, `Table.*`) außerhalb dieses Ordners --
ESLint-Regel `no-restricted-imports` auf `dexie` und `@/db/database`
für `src/stores/**`, `src/views/**`, `src/components/**`.

## Pinia

Je Entität ein Store, jeweils mit identischem Muster. Beispiel
`stores/areaStore.ts`:

``` ts
import { defineStore } from "pinia";
import { areaRepository } from "@/repositories/areaRepository";
import type { HallArea, HallAreaInput } from "@/types/HallArea";

interface AreaState {
  items: HallArea[];
  loading: boolean;
}

export const useAreaStore = defineStore("area", {
  state: (): AreaState => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id: number) =>
      state.items.find((a) => a.id === id),
    byHall: (state) => (hallId: number) =>
      state.items.filter((a) => a.hallId === hallId)
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        this.items = await areaRepository.getAll();
      } finally {
        this.loading = false;
      }
    },

    async create(input: HallAreaInput) {
      const id = await areaRepository.create(input);
      this.items.push({ ...input, id, createdAt: "", updatedAt: "" });
      await this.load(); // stellt korrekte Timestamps aus der DB sicher
    },

    async update(id: number, changes: Partial<HallAreaInput>) {
      await areaRepository.update(id, changes);
      await this.load();
    },

    async remove(id: number) {
      await areaRepository.delete(id);
      this.items = this.items.filter((a) => a.id !== id);
    }
  }
});
```

`load()` nach `create`/`update` re-synct bewusst den vollständigen
State statt optimistisch zu patchen -- das hält den Store einfach und
ist bei der erwarteten Datenmenge (Hobby-Nutzung, keine Hunderte
gleichzeitiger Schreibvorgänge) performant genug. Optimistisches
Update ist als spätere Optimierung möglich, aber kein Ziel des MVP.

`AttemptStore` bekommt zusätzlich einen Getter `byRoute(routeId)`
sowie `stats(routeId)` (Anzahl Versuche, Flash-Quote), der auf Views
zugreift, ohne dass Views selbst über Attempts iterieren müssen.

## Datenfluss

Laden (z. B. beim Öffnen von `AreaView`):

``` text
AreaView.onMounted()
→ areaStore.load()          -- alle Bereiche
→ wallStore.load()          -- alle Wände (client-seitig gefiltert über byHallArea)
→ areaRepository.getAll() / wallRepository.getAll()
→ Dexie
→ Store-State aktualisiert
→ Computed-Properties in AreaView reagieren automatisch
```

Für die Filterung nach Parent-ID wird bewusst der gesamte Datensatz je
Entität geladen und im Store gefiltert (kleine Datenmenge, keine
Pagination nötig). Sollte die App später sehr große Datenmengen
bekommen, kann `load()` auf `loadByParent(parentId)` umgestellt
werden, ohne die Komponenten-Schnittstelle zu ändern.

Speichern:

``` text
AreaForm.emit("submit", input)
→ AreaView-Handler ruft areaStore.create(input)
→ areaRepository.create(input)
→ Dexie add()
→ Store re-lädt State (load())
→ Alle Views/Komponenten, die areaStore.items lesen, reagieren automatisch
→ Modal schließt, Formular wird zurückgesetzt
```

Löschen mit Cascade (`services/cascade.ts`):

``` ts
import { areaRepository } from "@/repositories/areaRepository";
import { wallRepository } from "@/repositories/wallRepository";
import { routeRepository } from "@/repositories/routeRepository";
import { attemptRepository } from "@/repositories/attemptRepository";

export async function deleteAreaCascade(hallAreaId: number): Promise<void> {
  const walls = await wallRepository.getByArea(hallAreaId);
  for (const wall of walls) {
    const routes = await routeRepository.getByWall(wall.id!);
    for (const route of routes) {
      const attempts = await attemptRepository.getByRoute(route.id!);
      await Promise.all(attempts.map((a) => attemptRepository.delete(a.id!)));
      await routeRepository.delete(route.id!);
    }
    await wallRepository.delete(wall.id!);
  }
  await areaRepository.delete(hallAreaId);
}
```

Wird vom aufrufenden Store (`areaStore.removeCascade(id)`) genutzt, der
danach `load()` auf allen betroffenen Stores auslöst. Diese Funktion
ersetzt Erweiterungspunkt 1 ("Cascade Delete") -- sie wird nicht als
spätere Erweiterung nachgezogen, sondern ist Teil des MVP, weil ohne
sie verwaiste Datensätze entstehen, sobald eine Halle gelöscht wird.

## Routing

`router/index.ts`:

``` ts
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "halls", component: () => import("@/views/HallListView.vue") },
    { path: "/halls/:hallId", name: "hall", component: () => import("@/views/HallView.vue"), props: true },
    { path: "/areas/:areaId", name: "area", component: () => import("@/views/AreaView.vue"), props: true },
    { path: "/walls/:wallId", name: "wall", component: () => import("@/views/WallView.vue"), props: true },
    { path: "/routes/:routeId", name: "route", component: () => import("@/views/RouteView.vue"), props: true },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFoundView.vue") }
  ]
});

export default router;
```

Route-Params kommen als `string` an; Views casten sie beim Laden
(`Number(props.hallId)`) und leiten bei `NaN` auf `not-found` weiter.
`RouteView` fehlte in der ursprünglichen Skizze, ist aber nötig, da
Kurs-Details (Notizen, Versuchsliste) eine eigene Seite brauchen statt
nur ein Modal in `WallView`.

## MVP-Views

### HallListView

- Liste aller Hallen als `Card`-Grid (Name, Adresse, Anzahl Bereiche)
- `EmptyState`, falls keine Halle existiert
- Button "Neue Halle" öffnet `Modal` mit `HallForm` (Felder: `name`,
  `address`, optional `image`; Validierung: `name`/`address`
  Pflichtfelder, min. 2 Zeichen)
- Klick auf Karte → `router.push({ name: "hall", params: { hallId } })`

### HallView

- `Breadcrumb`: Hallen / \<Hallenname\>
- Hallendetails (Name, Adresse, Bild) mit Inline-Edit über `HallForm`
  im Modal
- Liste der `HallArea`s dieser Halle (`AreaCard`), gefiltert über
  `areaStore.byHall(hallId)`
- Button "Bereich anlegen" öffnet `AreaForm` (Feld: `name`)
- Button "Halle löschen" öffnet `ConfirmDialog`, ruft bei Bestätigung
  Cascade-Delete auf

### AreaView

- `Breadcrumb`: Hallen / \<Halle\> / \<Bereich\>
- Bereichsdetails, Inline-Edit
- Liste der `Wall`s (`WallCard`, zeigt Typ und zuletzt neu
  geschraubt), gefiltert über `wallStore.byArea(areaId)`
- Button "Wand anlegen" öffnet `WallForm` (Felder: `name`, `type`
  (Select: Quergang/Boulderwand), `lastSetDate`)

### WallView

- `Breadcrumb`: Hallen / \<Halle\> / \<Bereich\> / \<Wand\>
- Wanddetails
- Liste der `Route`s (`RouteCard`, Farbe als `Badge`, Schwierigkeit),
  standardmäßig nur `archived === false`, Toggle "Archivierte
  anzeigen"
- Button "Kurs anlegen" öffnet `RouteForm`
- Klick auf `RouteCard` → `RouteView`

### RouteView (ergänzt, fehlte in Original)

- Kursdetails (Schwierigkeit, Typ, Farbe, Medien, gesetzt am,
  archiviert)
- `AttemptList`: chronologische Liste aller Versuche
  (`attemptStore.byRoute(routeId)`), Icon für Erfolg/kein Erfolg
- Button "Versuch protokollieren" öffnet `AttemptForm` (Felder:
  `date` (Default: heute), `success`, `notes`, `media`)
- Statistik-Badge: Erfolgsquote, Gesamtversuche (aus
  `attemptStore.stats(routeId)`, Flash abgeleitet aus erstem
  erfolgreichen Versuch)

## Komponenten

Gemeinsame Wrapper-Komponenten um Flowbite, mit fester Props-API, damit
Views nicht direkt gegen Flowbite-Klassen schreiben:

| Komponente | Kern-Props | Zweck |
|---|---|---|
| `PageHeader` | `title`, `subtitle?` | Seitentitel + optionaler Slot für Action-Buttons |
| `ListLayout` | `items`, `loading` | Grid/Liste mit Loading- und Empty-State |
| `Card` | `clickable?` | Klickbare Container-Karte |
| `Modal` | `modelValue` (v-model), `title` | Overlay-Dialog, schließt via ESC/Backdrop |
| `Button` | `variant` (`primary`\|`secondary`\|`danger`), `loading?` | Flowbite-Button-Wrapper |
| `Input` | `modelValue`, `label`, `error?` | Text-/Number-Input mit Fehlermeldung |
| `Textarea` | `modelValue`, `label` | Mehrzeiliges Textfeld |
| `Select` | `modelValue`, `options`, `label` | Dropdown, u. a. für `Wall.type` |
| `Badge` | `color` | Farbige Markierung (Boulder-Farbe, Result) |
| `Breadcrumb` | `items: {label, to}[]` | Navigationspfad |
| `Navbar` | -- | App-weite Kopfzeile |
| `EmptyState` | `message`, `actionLabel?` | Platzhalter bei leeren Listen |
| `ConfirmDialog` | `modelValue`, `message` | Bestätigung für destruktive Aktionen |

Alle Formular-Komponenten (`HallForm`, `AreaForm`, `WallForm`,
`RouteForm`, `AttemptForm`) folgen demselben Muster: `props: { modelValue?: T }`
für Edit-Fälle, `emit("submit", input: TInput)`, interne Validierung vor
Emit, kein direkter Store-Zugriff (Store-Aufruf passiert im
aufrufenden View).

## Luxon

`utils/dates.ts`:

``` ts
import { DateTime } from "luxon";

export function formatDate(iso: string): string {
  return DateTime.fromISO(iso).toFormat("dd.MM.yyyy");
}

export function formatRelative(iso: string): string {
  return DateTime.fromISO(iso).toRelative() ?? "";
}

export function daysAgo(iso: string): number {
  return Math.floor(DateTime.now().diff(DateTime.fromISO(iso), "days").days);
}

export function isToday(iso: string): boolean {
  return DateTime.fromISO(iso).hasSame(DateTime.now(), "day");
}

export function isYesterday(iso: string): boolean {
  return DateTime.fromISO(iso).hasSame(DateTime.now().minus({ days: 1 }), "day");
}

export function nowIso(): string {
  return DateTime.now().toISO() as string;
}
```

Komponenten und Repositories verwenden ausschließlich diese
Hilfsfunktionen -- `nowIso()` ersetzt in `baseRepository.ts` das
bisherige `new Date().toISOString()`, damit Zeitzonen-Handling an
einer Stelle liegt.

## Phasen und Abnahmekriterien

**Phase 0 -- Setup** (~0,5 Tag)
Vite-Projekt, Tailwind + Flowbite konfiguriert, ESLint/Pret