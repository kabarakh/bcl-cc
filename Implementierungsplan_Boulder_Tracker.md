# Implementierungsplan -- Boulder-Tracker (Vue)

## Ziel

Eine Vue-3-Anwendung zur Verwaltung gekletterter Boulder. Daten werden
lokal mit Dexie (IndexedDB) gespeichert. Pinia dient als zentrale
Datenquelle und kapselt den Zugriff auf Dexie.

## Technologie

-   Vue 3
-   Vue Router
-   Pinia
-   Dexie
-   Tailwind CSS
-   Flowbite
-   Luxon

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

Views und Komponenten greifen ausschließlich auf Pinia zu. Nur die
Stores kommunizieren mit dem Repository. Nur das Repository kennt Dexie.

## Projektstruktur

``` text
src/
  components/
    hall/
    area/
    wall/
    route/
    common/
  db/
    database.ts
    schema.ts
  repositories/
    hallRepository.ts
    areaRepository.ts
    wallRepository.ts
    routeRepository.ts
    attemptRepository.ts
  stores/
    hallStore.ts
    areaStore.ts
    wallStore.ts
    routeStore.ts
  router/
    index.ts
  views/
    HallListView.vue
    HallView.vue
    AreaView.vue
    WallView.vue
  types/
    Hall.ts
    HallArea.ts
    Wall.ts
    Route.ts
    Attempt.ts
  utils/
    dates.ts
```

## Datenmodell

### Hall

-   id
-   name
-   city
-   createdAt
-   updatedAt

### HallArea

-   id
-   hallId
-   name
-   createdAt
-   updatedAt

### Wall

-   id
-   hallAreaId
-   name
-   angle
-   height
-   createdAt
-   updatedAt

### Route

-   id
-   wallId
-   grade
-   color
-   setter
-   openedAt
-   removedAt
-   notes
-   createdAt
-   updatedAt

### Attempt

-   id
-   routeId
-   date
-   result
-   flash
-   top
-   attempts
-   notes
-   createdAt
-   updatedAt

## Dexie-Schema

``` ts
db.version(1).stores({
  halls: "++id,name",
  hallAreas: "++id,hallId",
  walls: "++id,hallAreaId",
  routes: "++id,wallId",
  attempts: "++id,routeId,date"
});
```

Alle Fremdschlüssel werden indexiert.

## Repository-Layer

Für jede Entität:

-   getAll()
-   get(id)
-   create()
-   update()
-   delete()

Zusätzliche Methoden:

-   AreaRepository.getByHall(hallId)
-   WallRepository.getByArea(areaId)
-   RouteRepository.getByWall(wallId)
-   AttemptRepository.getByRoute(routeId)

Keine Dexie-Abfragen außerhalb des Repository-Layers.

## Pinia

Je Entität ein Store.

State:

-   Datenliste
-   loading

Getter:

-   byId()
-   childrenByParent()

Actions:

-   load()
-   create()
-   update()
-   remove()

## Datenfluss

Laden:

``` text
View
→ Store.load()
→ Repository
→ Dexie
→ Store-State
→ Reaktive UI
```

Speichern:

``` text
Component
→ Store.create()
→ Repository.create()
→ Dexie
→ Store aktualisiert State
→ Alle Views reagieren automatisch
```

## Routing

``` text
/
→ HallListView

/halls/:hallId
→ HallView

/areas/:areaId
→ AreaView

/walls/:wallId
→ WallView
```

## MVP-Views

### HallListView

-   Hallenliste
-   Neue Halle anlegen

### HallView

-   Hallendetails
-   Bereiche der Halle anzeigen
-   Bereich anlegen

### AreaView

-   Bereichsdetails
-   Wände anzeigen
-   Wand anlegen

### WallView

-   Wanddetails
-   Kurse anzeigen
-   Kurs anlegen

## Komponenten

``` text
PageHeader
List
Card
Modal
Button
Input
Textarea
Badge
Breadcrumb
Navbar
```

Flowbite wird über wiederverwendbare Wrapper-Komponenten eingebunden.

## Luxon

`utils/dates.ts`

-   formatDate()
-   formatRelative()
-   daysAgo()
-   isToday()
-   isYesterday()

Komponenten verwenden ausschließlich diese Hilfsfunktionen.

## Erweiterungen

1.  Cascade Delete.
2.  BaseRepository.
3.  Gemeinsamer EntityStore.
4.  Soft Delete.
5.  Dexie-Migrationen.
6.  JSON-Export/-Import.
7.  Statistiken auf Basis der Attempts.
