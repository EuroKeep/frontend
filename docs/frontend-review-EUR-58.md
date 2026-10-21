# Frontend-Review Eurokeep (Angular-SPA) — Befunde & Maßnahmenplan für den 8-Wochen-Stable-Release

Stand: 2026-08-21 · Branch `feature/EUR-58` · Analyseumfang: `frontend/src/app/**` (aktiv genutzt: `eurokeep_mobile_module`, `overview_module`; mitgeprüft: verwaiste `account_module`, alle Shared Services/Components, Auth/Login, Routing).

Diese Analyse ist rein lesend entstanden, es wurden keine Code-Änderungen vorgenommen. Ziel: alle Unschlüssigkeiten in CRUD-Verhalten, UX und Code-Konsistenz sammeln und mit konkreten Fixvorschlägen versehen, damit die App in den nächsten acht Wochen stabil released werden kann.

---

## 1. Executive Summary

Die App befindet sich in einem **Übergangszustand nach einem "Mobile First"-Strategiewechsel** (Januar 2026): Ein komplettes Desktop-Modul-System (`account_module` u. a.) wurde verworfen, teils aber nicht sauber entfernt — zwei seiner Dateien sind ausgerechnet die **Basisklassen**, von denen die gesamte aktive App erbt. Der aktive Code selbst (Mobile-Modul) ist im Grundmuster ordentlich (React-freie Standalone-Components, gemeinsame Form-Komponenten, konsistente `AbstractComponent`/`AbstractPageComponent`-Vererbung), aber **jede der fünf CRUD-Entitäten (Account/Budget/Subscription/Transaction/Piggybank) wurde einzeln "nacherfunden"** statt aus einer echten gemeinsamen Basis abgeleitet — mit der Folge, dass Erfolgsmeldungen, Fehlerbehandlung, Navigation und sogar Feldkomponenten zwischen den fünf Entitäten spürbar voneinander abweichen, obwohl sie fachlich identisch sein müssten.

**Die größten Release-Risiken sind nicht kosmetisch, sondern funktional:**

1. Löschen von Budget/Subscription/Transaction hat **keine Fehlerbehandlung** — genau zum jetzigen Zeitpunkt kritisch, weil das Backend seit dem 2026-08-13-Update bei durch Foreign-Keys blockierten Löschversuchen HTTP 409 statt 200 liefert (siehe CLAUDE.md-Abschnitt zu `AddIntegrityConstraints`). Diese Fehlerantwort läuft ins Leere: keine Fehlermeldung, Button bleibt dauerhaft im Ladezustand hängen.
2. Es gibt **nirgends in der App eine Lösch-Bestätigung** (kein `confirm()`, kein Dialog) — bei einer Finanz-App ein greifbares Risiko für versehentlichen, irreversiblen Datenverlust.
3. **Kategorien und Kontotypen sind im Frontend nicht verwaltbar** (kein Edit/Delete, teils nicht mal im Service vorhanden) — falls das nicht bewusst so vorgesehen ist, eine funktionale Kernlücke.
4. Die **Settings-/Profil-Seite ist praktisch leer** (ein einziger Link), Logout und Kontoeinstellungen sind nur über ein Header-Dropdown erreichbar — für Endnutzer schwer auffindbar.
5. Ein hartcodiertes Datumsfenster in der Summary-Seite (`closing-balance-summary.component.ts`) läuft in wenigen Tagen ab und würde noch **vor** dem geplanten Release-Termin sichtbar brechen.
6. i18n (Transloco) ist strukturell eingebaut, aber die Übersetzungsdatei ist quasi leer — das gesamte mehrsprachige UI-Konzept ist aktuell eine Attrappe, kombiniert mit hart eingestreuten deutschen Wörtern in sonst englischen Templates.

Die übrigen Befunde (siehe Kapitel 3–10) sind überwiegend Konsistenz- und Polish-Themen, die einzeln nicht release-blockierend sind, aber in Summe den Eindruck einer "zusammengeklickten" statt einer durchgestalteten App erzeugen — genau das, was in 8 Wochen bis zum Stable-Release behoben werden sollte.

---

## 2. Kritische Befunde (🔴 vor Release zwingend zu beheben)

| # | Befund | Ort | Auswirkung |
|---|---|---|---|
| K1 | Kein `error`-Handler bei `delete()` in Budget/Subscription/Transaction | `budget-mobile-edit.component.ts:80-90`, `subscription-mobile-add.component.ts:120-133`, `transaction-mobile-edit.component.ts:114-127` | HTTP 409 (neue FK-Schutz-Logik) bzw. jeder andere Fehler wird verschluckt, Button hängt dauerhaft im Ladezustand, User denkt Löschen sei "hängen geblieben" |
| K2 | Keine Lösch-Bestätigung irgendwo in der App | alle Delete-Buttons in Account/Budget/Subscription/Transaction-Edit | Versehentliches, irreversibles Löschen von Konten/Buchungen mit einem einzigen Klick |
| K3 | Budget-Delete zeigt weder Erfolgsmeldung noch navigiert es weg | `budget-mobile-edit.component.ts:77-91` | User bleibt auf Edit-Seite eines soeben gelöschten Budgets stehen, kein Feedback ob die Aktion überhaupt etwas getan hat |
| K4 | Subscription-Delete navigiert zu nicht-existenter Route | `subscription-mobile-add.component.ts:130` → `['/', 'mobile', 'subscription', 'index', account_id]` | Route existiert nicht in `eurokeep_mobile_module.routes.ts`; Navigation läuft ins Leere |
| K5 | Category- und Accounttype-Verwaltung fehlt im Frontend fast vollständig | `category.service.ts` (nur `index`/`tree`/`add`), `accounttype.service.ts` (nur `index`) | Kategorien/Kontotypen sind nach dem Erstseeding nicht mehr bearbeit-/löschbar über die UI — Kernfunktion eines Haushaltsbuchs |
| K6 | Hartcodiertes Datumsfenster in Closing-Balance-Summary | `closing-balance-summary.component.ts:45-51` (`2025-01-01` … `2026-09-01`) | Läuft in ca. 10 Tagen ab (Analysedatum 2026-08-21), zeigt danach keine aktuellen Monate mehr — bricht noch vor Release |
| K7 | Settings/Profil-Seite ist ein Platzhalter | `pages/settings/home/home.component.html` (ein Link), `pages/profile/` leer | Kein Passwort-/E-Mail-Ändern, kein Logout dort, keine Spracheinstellung — Nutzer erwarten das an dieser Stelle |
| K8 | i18n ist eine Attrappe | `src/assets/i18n/en_US.json` faktisch leer, gemischt mit hartcodierten deutschen Strings in sonst englischen Templates (`home.component.html:32,38,82`) | Sprachumschaltung hat keinen Effekt, Sprachmix wirkt unfertig |
| K9 | `HistoryService` referenziert in Spec, existiert aber nicht als Datei | `src/app/history.service.spec.ts` importiert `./history.service` (nicht vorhanden) | Test-Suite kompiliert vermutlich nicht durch — CI/Release-Pipeline-Risiko, falls Tests Teil des Release-Gates sind |
| K10 | Unprofessionelle/vulgäre Fehlermeldung im Produktivcode | `authentication.service.ts:15` — `throw new Error("Seems you're not logged in, b1tch")` | Landet potenziell in Logs/Monitoring/Konsole bei Kunden |

---

## 3. CRUD-Konsistenz über alle Entitäten (Account, Budget, Subscription, Transaction, Piggybank)

Das ist der Kernbefund der Analyse: **fünf CRUD-Familien, fünf leicht unterschiedliche Implementierungen**, obwohl sie fachlich identisch sein sollten (Formular → Speichern → Feedback → Navigation, bzw. Löschen → Bestätigung → Feedback → Navigation).

### 3.1 Vererbungsstruktur uneinheitlich

- Account, Subscription, Transaction: `*MobileEditComponent extends *MobileAddComponent` — Edit erbt Feldlogik/Service-Referenzen von Add. (`account-mobile-edit.component.ts:51`, `subscription-mobile-edit.component.ts:57`, `transaction-mobile-edit.component.ts:54`)
- **Budget bricht das Muster:** `BudgetMobileEditComponent extends AbstractPageComponent` (`budget-mobile-edit.component.ts:53`) — komplett eigenständige Klasse, dupliziert Category-Ladelogik und Currency-Property 1:1 aus Add, statt sie zu erben. Das ist die Ursache dafür, dass Budget bei Löschmeldung/-navigation (K3) aus dem Rahmen fällt.
- Piggybank hat gar kein Edit (siehe 3.5).

**Empfehlung:** Budget an das Account/Subscription/Transaction-Muster angleichen (Edit erbt von Add). Mittelfristig: eine echte generische `EntityFormBase<T>`, die Add/Edit/Delete/Feedback/Navigation kapselt, damit neue Entitäten (z. B. Piggybank-Edit) das Muster nicht erneut manuell nachbauen müssen.

### 3.2 Erfolgs-/Fehlermeldung nach Löschen — 3 von 5 Entitäten fehlerhaft

| Entität | Erfolgsmeldung beim Löschen | Fehlerbehandlung beim Löschen |
|---|---|---|
| Account | ✅ korrekt (`NotyService.genericSuccess()`, `{next, error}`) | ✅ |
| Budget | ❌ keine Meldung, keine Navigation | ❌ kein `error`-Handler |
| Subscription | ❌ Text berechnet, aber nie angezeigt (toter Code) | ❌ kein `error`-Handler, kein Lock |
| Transaction | ❌ Text berechnet, aber nie angezeigt | ❌ kein `error`-Handler |
| Piggybank | — (kein Delete vorhanden, siehe 3.5) | — |

**Empfehlung:** Einheitliche `deleteEntity()`-Methode in der gemeinsamen Basisklasse, die Lock/Unlock, Erfolgsmeldung, Fehlerbehandlung (inkl. 409) und Navigation für alle Entitäten identisch übernimmt (deckt K1 und K3 gleichzeitig ab).

### 3.3 Feld-Inkonsistenz zwischen Add und Edit (Regression)

Bei Transaction wird für denselben Wert (`balance_value`) in Add die spezialisierte `nox-balance-input`-Komponente (mit Währungssymbol, Rot/Grün-Einfärbung für Einnahme/Ausgabe) verwendet, in Edit dagegen ein schlichtes `nox-input type="number"` ohne jegliche Formatierung/Farbcodierung (`transaction-mobile-add.component.html:49-58` vs. `transaction-mobile-edit.component.html:45-52`). Beim Bearbeiten eines Betrags fehlt exakt das visuelle Feedback, das beim Anlegen vorhanden ist — wirkt wie ein Copy-Paste-Regressionsfehler.

**Empfehlung:** `nox-balance-input` auch im Edit-Formular verwenden.

### 3.4 Navigationsziele nach dem Speichern uneinheitlich

- Saving/Piggybank navigiert nach dem Einzahlen zu `['transaction', 'edit', result.item.id]` — ohne führenden Slash, ohne `mobile`-Präfix, während **jede** andere Navigation in der App mit `['/', 'mobile', ...]` beginnt (`saving-mobile-save.component.ts:86`). Sichtbarer Copy-Paste-Rest aus `transaction-mobile-add.component.ts`.
- Dieselbe Stelle zeigt zudem eine hartcodierte Meldung „Transaction created successfully" statt einer Piggybank-spezifischen Meldung (`saving-mobile-save.component.ts:84-85`).

### 3.5 CRUD-Symmetrie zwischen den Entitäten

| Entität | Add | Edit | Delete | List |
|---|---|---|---|---|
| Account | ✅ | ✅ | ✅ | ✅ |
| Budget | ✅ | ✅ (eigenständig, s.o.) | ✅ (fehlerhaft, K3) | ✅ |
| Subscription | ✅ | ✅ | ✅ (fehlerhaft, K1/K4) | ✅ |
| Transaction | ✅ | ✅ | ✅ (fehlerhaft, K1) | ✅ (Stream) |
| Piggybank | ✅ | ❌ fehlt komplett | ❌ fehlt komplett (Service hat kein `delete()`) | ✅ |
| Category | ✅ (Route existiert, aber im Frontend nicht erreichbar, siehe 4) | ❌ | ❌ | ✅ (nur Read) |
| Accounttype | ❌ | ❌ | ❌ | ✅ (nur `index()`) |

**Empfehlung:** Vor Release klären, ob Piggybank-Edit/Delete, Category-Edit/Delete und Accounttype-Verwaltung bewusst außerhalb des Scopes liegen (dann in der UI klar kommunizieren, z. B. kein Edit-Icon anzeigen) oder nachgezogen werden müssen (K5).

### 3.6 Weitere CRUD-nahe Bugs

- **Doppelter HTTP-Call beim Öffnen der Transaction-Edit-Seite:** `CategoryService.index()` wird sowohl explizit in `ngOnInit()` als auch erneut über `super.ngOnInit()` (geerbt von Add) aufgerufen — Kategorien werden bei jedem Öffnen zweimal vom Server geholt (`transaction-mobile-edit.component.ts:58-74`).
- **Sequenzieller statt paralleler Ladewasserfall bei Subscription-Edit:** `AccountService.index()` → `CategoryService.index()` → `SubscriptionService.view()` → `SubscriptionService.forecast()` laufen strikt nacheinander, obwohl die ersten drei Requests inhaltlich unabhängig sind (`subscription-mobile-edit.component.ts:61-82`). Mit `forkJoin` ließe sich die Ladezeit der Seite auf das Maximum statt die Summe der Einzel-Latenzen reduzieren.
- **Toter Service-Code:** Jeder Service (`AccountService`, `BudgetService`, `PiggybankService`, `SubscriptionService`, `TransactionService`) hat sowohl `put()` als auch `patch()` gegen denselben Endpunkt — `patch()` wird im gesamten Frontend nirgends aufgerufen.
- Naming-Mismatch bei Piggybank-Formularen: `[name]="'transfer_id'"` gebunden an `post.account_id` (`saving-mobile-add.component.html:9-10`, `saving-mobile-save.component.html:9-10`) — Feldname aus einem kopierten Transfer-Formular nicht angepasst.
- Toter Kommentar/State-Bug: nach dem Speichern einer Piggybank-Einzahlung wird `post` (anders als bei allen anderen Entitäten) nicht mit der Serverantwort aktualisiert (`saving-mobile-save.component.ts:89`, auskommentierte Zeile).

---

## 4. Navigation, Informationsarchitektur & Routing

- **Keine Route-Guards:** Kein `canActivate` in `app.routes.ts`/`eurokeep_mobile_module.routes.ts` — Client-seitiger Zugriffsschutz existiert nicht, greift nur reaktiv über den 401/403-Redirect im `authInterceptor`. Für den produktiven Release-Stand sollte zumindest ein einfacher Auth-Guard ergänzt werden, der ohne gültige Session direkt zu `/login` umleitet, statt erst eine (potenziell teure) fehlschlagende Anfrage abzuwarten.
- **Fehlende `/error`- bzw. Wildcard-Route:** `authInterceptor` leitet bei HTTP 404 zu `/error` um (`auth.interceptor.ts:22-24`) — diese Route existiert nicht, der Nutzer landet auf einer weißen Seite. Ebenso fehlt eine `**`-Wildcard-Route für falsch getippte URLs.
- **Redundante Root-Routen:** `''`, `login` und `login/:demo` laden alle identisch `UserLoginComponent`; `mobile` und `mobile/account/list` laden beide `AccountListComponent` — keine klare `redirectTo`-Struktur.
- **Toter Link in Category-Liste:** `category-list.component.html` verlinkt auf `/mobile/category/add`, eine Route, die im Routing gar nicht registriert ist.
- **URL-Schema-Bruch:** Der Header verlinkt zu `/overview` (ohne `mobile`-Präfix), während der Rest der App konsequent unter `/mobile/...` liegt.
- **Bottom-Navigation unvollständig:** Verlinkt Accounts/Budget/Home/Savings/Subscriptions, nicht aber Settings/Categories — diese sind nur zwei Klicks tief über ein Header-Dropdown erreichbar. Zudem nutzt der mittlere Nav-Button ein Logo-Bild statt eines Icons wie die anderen vier Buttons — Bildsprachenbruch innerhalb derselben Nav-Leiste.
- **Category-Bearbeiten-Badge ohne Funktion:** Das Bearbeiten-Icon im Kategoriebaum hat weder Klick-Handler noch `routerLink` — rein dekorativ, verwirrt Nutzer, die darauf klicken.
- **Closing-Balance-Route unverlinkt:** `overview/closing/:year` ist technisch aktiv, aber von keiner Stelle in der App aus erreichbar (kein `routerLink` irgendwo) — nur per manueller URL-Eingabe, und selbst dann ignoriert die Komponente den `:year`-Parameter (siehe K6).

**Empfehlung:** Einen einfachen `authGuard` ergänzen, `/error`- und `**`-Route nachziehen, tote/verwaiste Links bereinigen, Bottom-Nav und Header-Dropdown-Inhalte einmal ganzheitlich neu gegen die tatsächliche Seitenstruktur abgleichen.

---

## 5. Auth & Login

- **"Angemeldet bleiben" ist unsichtbar hartcodiert:** `remember: true` wird im Code fix gesetzt (`user-login.component.ts:51`), es gibt aber keine Checkbox im Formular — Nutzer haben keine Kontrolle über ein Feature, das für sie unsichtbar aktiv ist.
- **Sinnloser CSRF-Request beim Login:** `AuthenticationService.csrf().subscribe(() => {})` mit leerem Callback — CSRF ist serverseitig deaktiviert (siehe CLAUDE.md), der Request tut nichts außer Netzwerklast zu erzeugen.
- **Keine Client-Validierung im Login-Formular:** kein `required`, kein `type="email"`, keine Mindestlänge fürs Passwort — Fehler kommen ausschließlich als Toast nach einem fehlgeschlagenen Server-Roundtrip.
- **Kein "Passwort vergessen"-Link.**
- **Demo-Login mit hartcodierten Klartext-Credentials** (`demo@eurokeep.io`/`demo`) und automatischem Login ohne Bestätigung unter `/login/demo` — sollte vor einem öffentlichen Release entweder klar abgesichert (Feature-Flag, nur Staging) oder entfernt werden.
- **Marketing-Links im Login-Footer** (Website/Docs/GitHub) stehen in derselben Button-Gruppe wie der Login-Submit-Button und lenken vom eigentlichen Call-to-Action ab.
- **Verwaistes zweites Login-Layout** (`layouts/login/login.layout.ts`) mit Selector- und Klassennamen-Kollision zu `layouts/coreui/header/coreui-header.component.ts` (beide `CoreuiHeaderComponent`, identischer Selector `'coreui-header'`) — nirgends referenziert, reiner Copy-Paste-Rest.

**Empfehlung:** Login-Formular mit Reactive-Forms-Validierung ausstatten, "Angemeldet bleiben" entweder als echte Checkbox anbieten oder den toten CSRF-Call entfernen, Demo-Login absichern, verwaistes Login-Layout entfernen.

---

## 6. Formulare & Validierung

- **Widersprüchliches Pflichtfeld-Verhalten zwischen den beiden Input-Typen:**
  - `nox-input` (Text/Zahl) rendert **immer** ein natives HTML5 `required`-Attribut, unabhängig vom `[required]`-Input der Komponente — das Sternchen ist nur kosmetisch, die Validierung greift auch bei Feldern ohne sichtbares Pflicht-Sternchen (z. B. IBAN bei Account-Add).
  - `nox-select` (ng-select-basiert) hat dagegen **überhaupt keine** Validierung — das rote Sternchen bei z. B. Currency/Accounttype ist rein dekorativ, das Formular lässt sich mit leerem Dropdown absenden.
  - Ergebnis: Text-Felder sind teils zu streng (ohne erkennbaren Grund für den Nutzer), Dropdown-Felder nie streng genug. Das sollte vereinheitlicht werden (idealerweise über echte Angular-Reactive-Forms-Validatoren statt nativem HTML5-`required`).
- **Kein `type="button"` auf reinen Navigations-Buttons in Formularen:** Der "Zurück"-Pfeil in praktisch jedem Add/Edit-Formular hat kein explizites `type="button"`, liegt aber innerhalb eines `<form>` — der HTML-Default-Typ ist `submit`. Ein Klick auf "Zurück" kann dadurch zusätzlich ein `(ngSubmit)` auslösen, bevor die Navigation greift (potenziell ungewolltes Speichern beim Abbrechen). Betrifft alle Add/Edit-Templates von Account/Budget/Subscription/Transaction.
- **Nicht-funktionaler Button in Budget-Edit:** Ein zweiter "Zurück"-Button im Footer von Budget-Edit hat weder `routerLink` noch `click`-Handler — in Kombination mit obigem Punkt tut dieser Button nichts außer (ungewollt) das Formular abzusenden.
- **Uneinheitliche Save-Button-Gestaltung:** Account/Budget/Subscription/Transaction zeigen nur einen unbeschrifteten Pfeil-Icon-Button als primäre Speichern-Aktion, Piggybank/Saving zeigt stattdessen Klartext „Save". Für eine so zentrale Aktion in einer Finanz-App ist Text deutlich selbsterklärender — und die Inkonsistenz fällt beim Wechsel zwischen Modulen auf.
- **`trackBy`/`track` in `@for`-Schleifen uneinheitlich:** Nur die Subscription-Liste trackt über eine stabile ID (`track Subscription.id`); Account-, Budget- und Saving-Liste tracken über `$index`. Bei Budget ist das besonders unglücklich, da die Liste inkrementell per Merge aktualisiert wird — `track $index` unterläuft diesen Mechanismus teilweise.

**Empfehlung:** Gemeinsame Validierungsstrategie für alle Formularfelder (Reactive Forms mit echten Validatoren statt Browser-nativem `required`), `type="button"` konsequent auf allen Nicht-Submit-Buttons ergänzen, Save-Buttons vereinheitlichen (Text + Icon), `track` durchgehend auf stabile IDs umstellen.

---

## 7. Fehlerbehandlung & Service-Layer

- **Uneinheitliche Service-Basis:** `AccountService`, `AccounttypeService`, `AuthenticationService`, `CategoryService`, `TransactionService`, `DiscreteService`, `LayoutService` erben von `AbstractService`; `BudgetService`, `PiggybankService`, `SearchService`, `SubscriptionService`, `SummaryService` injizieren `HttpClient` eigenständig, ohne die gemeinsame Basis zu nutzen. Architektonisch inkonsistent, erschwert künftige Cross-Cutting-Concerns (z. B. zentrales Error-Mapping).
- **Fehlerbehandlung ist fast ausschließlich lokal in einzelnen Komponenten gelöst, nicht zentral:** Von rund 68 `.subscribe(...)`-Aufrufen im gesamten Frontend haben nur 9 einen expliziten `error`-Handler (alle in Add/Edit-Formularen). Index-/View-/Such-/Summary-/Stream-Seiten haben durchgehend **keine** Fehlerbehandlung — HTTP-Fehler abseits von 401/403/404 (die der globale Interceptor abfängt) verpuffen ohne jedes Nutzer-Feedback. Nur eine einzige Datei im ganzen Projekt nutzt den RxJS-`catchError`-Operator.
- **`authInterceptor` behandelt nur 401/403/404 global**, alle anderen Statuscodes (400/409/422/500) werden unverändert durchgereicht — trifft dann auf die oben beschriebene Lücke in den Komponenten.
- **Kein zentrales Envelope-Handling:** Jeder Service reicht die rohe HTTP-Response durch; ob eine Antwort fachlich erfolgreich war (`success: false` bei HTTP 200) oder technisch fehlgeschlagen ist (HTTP-Fehlercode), muss jede Komponente separat unterscheiden — Hauptursache für die in Kapitel 3.2 beschriebenen Lücken.
- **CSRF-Kette komplett funktionslos:** `AuthenticationService.csrfToken` startet mit Platzhalter `'_'` und wird nie aktualisiert (der einzige Call dazu hat einen leeren Callback, siehe Kapitel 5); der `csrfInterceptor` sendet dadurch dauerhaft den Literal-String `_` als `X-CSRF-Token`-Header — wirkungslos, aber unnötiger Overhead auf jedem nicht-GET-Request. Sollte im Zuge der ohnehin geplanten REST-Bereinigung (siehe CLAUDE.md) mit entfernt werden.
- **Globaler Ladeindikator ist toter Code:** `loaderInterceptor`/`GlobalLoadingService` zählen laufende Requests korrekt hoch/runter, aber **kein einziges Template im gesamten Frontend** konsumiert `isLoading$` — der in der Projektdokumentation erwähnte "globale Ladeindikator" existiert UI-seitig schlicht nicht, jede Seite hat stattdessen ihren eigenen lokalen Button-Spinner. Entweder eine echte globale Loading-Bar ergänzen oder Service+Interceptor bewusst als entfernt markieren.
- **`disableGlobalLoader`-Escape-Hatch nur für GET-Requests implementiert** (`loader.interceptor.ts`) — für POST/PUT/PATCH/DELETE nicht vorhanden, Feature nur zur Hälfte umgesetzt.
- **Breite `any`-Nutzung an HTTP-relevanten Stellen:** u. a. `req: any, next: any` in allen drei Interceptoren statt der von Angular exportierten Typen (`HttpRequest<unknown>`, `HttpHandlerFn`); mehrere Services haben `params: any` mit demselben verwaisten Kommentar `// cast ContactsIndexParams into object` — ein Copy-Paste-Rest, der auf einen nie existierenden Typ verweist und zu keinem der Domänenkontexte passt.
- **Kein Caching von Referenzdaten:** Kategorien werden in 7 verschiedenen Komponenten unabhängig voneinander per HTTP neu geladen (kein `shareReplay`/Cache) — unnötiger Netzwerk-Overhead bei jeder Navigation.

**Empfehlung:** Alle `delete()`-Aufrufe (und perspektivisch alle `subscribe()`-Aufrufe) auf `{next, error}` umstellen; zentrales Error-Handling (z. B. via HTTP-Interceptor + einheitlichem `NotyService`-Fallback für unbehandelte Fehler) ergänzen, damit ein fehlender lokaler `error`-Handler nicht automatisch zu "Fehler verschwindet spurlos" führt; Service-Basisklasse konsequent für alle Services nutzen; toten CSRF-/Loader-Code entweder aktivieren oder entfernen.

---

## 8. Shared Components

- **Form-Komponenten (`InputComponent`, `SelectComponent`, `BalanceInputComponent`, `ValidationFeedbackComponent`) sind strukturell konsistent** und werden durchgehend statt nativer PrimeNG-Inputs verwendet (kein einziger Treffer für `p-inputtext` o. ä. im aktiven Code) — das ist ein positiver Befund, sollte so beibehalten werden. Das eigentliche Validierungsproblem liegt nicht in der Komponentenstruktur, sondern im in Kapitel 6 beschriebenen `required`-Verhalten.
- **`spamsave`-Doppelklick-Schutz konsistent eingesetzt**, aber sein `@Output() clicked`-Event wird an keiner der 14 Verwendungsstellen gebunden — überall wird stattdessen parallel ein natives `(click)` gesetzt, der Emitter ist funktional totes Gepäck innerhalb einer sonst aktiv genutzten Direktive.
- **`DiscreteService`-Reaktivität ist auf allen Add/Edit-Seiten gebrochen:** `AbstractComponent.ngOnInit()` abonniert `DiscreteService.isDiscrete$` und löst bei Änderungen `markForCheck()` aus. `AbstractPageComponent.ngOnInit()` (Basisklasse aller Add/Edit-Seiten) überschreibt das aber mit einem **leeren Body ohne `super.ngOnInit()`-Aufruf**. Folge: Der "Diskret-Modus" (Beträge ausblenden) reagiert auf Account-/Budget-/Subscription-/Transaction-Add/Edit-Seiten nicht automatisch, wenn er während des Aufenthalts auf der Seite umgeschaltet wird — inkonsistent zu Listen-Seiten, die direkt von `AbstractComponent` erben und korrekt reagieren.
- **Zwei verschiedene Discrete-Mechanismen ohne erkennbare Regel, wann welcher gilt:** `DiscreteDirective` blendet Elemente komplett aus (genutzt an 2 Stellen), `BalanceComponent` ersetzt Beträge durch einen Platzhalter-Blur (genutzt überall sonst) — funktional beides plausibel, aber nicht dokumentiert und dadurch schwer wartbar.
- **Debug-`console.warn`-Aufrufe im Produktivpfad**, die bei jeder Nutzerinteraktion feuern:
  - `directives/spamsave.directive.ts` — bei jedem Klick auf jeden Save/Delete-Button der ganzen App.
  - `components/form/balance-input-component/balance-input-component.ts` — bei jeder Änderung eines Betragsfeldes.
  - `abstract-index.component.ts` — bei jedem Laden jeder Liste in der App (Basisklasse!).
  - `category-list.component.ts` — loggt bei jedem Seitenaufruf den vollständigen Kategoriebaum.
  - `complete-summary.component.ts` — loggt Jahr/Monat bei jedem Aufruf.
  
  **Vor Release entfernen oder hinter einen Debug-Flag stellen** — betrifft insbesondere die Basisklassen-Logs, die bei jeder Interaktion in der gesamten App auflaufen.
- **Geld-/Datumsformatierung:** `formatBalance`/`formatCurrency` sind fest auf `Intl.NumberFormat('de-DE', ...)` verdrahtet, unabhängig von der über Transloco einstellbaren UI-Sprache (u. a. `en_US` vorgesehen) — bei englischer Oberfläche erscheinen Beträge trotzdem mit deutschem Dezimalkomma. Datum/Zeit wird dagegen manuell mit `getUTCDate()`/`getUTCMonth()` und eigenem Padding statt `Intl.DateTimeFormat` gebaut — funktioniert, ist aber unnötiges Boilerplate und ein weiterer uneinheitlicher Formatierungs-Stil neben der `Intl`-Nutzung bei Beträgen.
- **Kleinere Detail-Bugs in wiederverwendeten Listen-Komponenten:**
  - Fallback-Währung `Currency.czk` (Tschechische Krone) in `transaction-list.component.html`, während überall sonst `Currency.eur` als Default verwendet wird — wirkt wie ein Copy-Paste-Fehler in einer Euro-fokussierten App.
  - `forecast-list.html` übergibt an `showDate()` die Entity-ID statt des Loop-Index (im Gegensatz zum korrekten Pendant in `transaction-list.component.html`) — die Datums-Zwischenüberschrift der ersten Subscription-Gruppe erscheint dadurch vermutlich nie.
  - `forecast-list.html` trackt über ein Datum (`SubscriptionForecast.execution`) statt einer eindeutigen ID — kollidiert bei mehreren Subscriptions mit gleichem Ausführungsdatum.
  - Bug bei Favoriten-Toggle: Die Liste prüft `flags === 3` (exakter Vergleich), die Entry-Komponente daneben prüft bitweise `flags & 2`. Bei zusätzlich gesetzten Flags (undokumentierte Bitmask laut Backend-Analyse) zeigt der Erfolgs-Toast das falsche Ergebnis, obwohl der Stern korrekt umschaltet.

**Empfehlung:** Alle Debug-Logs entfernen; `AbstractPageComponent.ngOnInit()` so anpassen, dass es `super.ngOnInit()` aufruft (oder die Discrete-Logik anders zentralisieren); Geldformatierung an die aktive UI-Sprache koppeln; die genannten Detail-Bugs (Fallback-Währung, Favoriten-Flag-Vergleich, Forecast-Tracking) beheben.

---

## 9. Einzelseiten-UX-Befunde

- **Home/Dashboard:** Sprachmix zwischen deutschen und englischen Strings im selben Template (`t('Transaktionen')` neben `t('Accounts')`/`t('Budgets')`); an einer Stelle fehlt der `t()`-Aufruf komplett (`{{ ('Piggybanks') }}` statt `{{ t('Piggybanks') }}`). Such-Treffer für Accounts/Transactions/Budgets/Subscriptions sind klickbar, Piggybank-Treffer nicht — im Kontext der bekannten Backend-Einschränkung (Piggybank-Transaktionen nicht persistierbar) nachvollziehbar, aber für den Nutzer inkonsistent, ohne dass es erklärt wird.
- **Settings:** Besteht aus einem einzigen Link ("Categories"); Profilseite existiert nur als leeres Verzeichnis. Logout, Summary-Link und Diskret-Modus-Toggle liegen stattdessen ausschließlich im Header-Dropdown — kontobezogene Aktionen sind über zwei unterschiedliche, für den Nutzer nicht offensichtliche Orte verteilt.
- **Category-Verwaltung:** Nur Baumdarstellung + ein (im Routing nicht erreichbarer) Add-Link; Bearbeiten-Icon im Baum ohne Funktion. Faktisch Read-only-Feature mit optischen Versprechen, die nicht eingelöst werden.
- **Account-Liste:** Doppelte Filterlogik für dieselbe Suche (strukturelles `@if` UND zusätzliches `[hidden]`) — redundant und ein Wartungsrisiko, falls künftig nur eine der beiden Stellen angepasst wird. Kein direkter Edit-Zugang aus der Liste heraus, obwohl die zugrunde liegende Entry-Komponente das unterstützen würde.
- **Subscription-Forecast auf der Home-Seite:** Zeilen sind nicht klickbar (kein `routerLink`), obwohl dieselbe zugrunde liegende Komponente in anderen Kontexten klickbar gemacht wird — wirkt für Nutzer wie ein UI-Element, das reagieren müsste, es aber nicht tut.
- **`account-entry` vs. `subscription-entry`/`transaction-entry`:** Erstere ist als Card mit Favoriten-Stern, Edit-Badge und IBAN-Copy-Funktion ausgestattet, die beiden anderen sind rein passive Zeilen ohne eigene Aktionen — spürbarer stilistischer Bruch zwischen den Listen-Bausteinen der App.
- **Closing-Balance-Summary:** Nutzt zur Navigation direkte Objekt-Mutation eines `Date`-Objekts statt echten URL-Routings (im Gegensatz zur Complete-Summary-Seite, die denselben `date-browser` nutzt, aber sauber über Router-Navigation mit Deep-Linking arbeitet). Funktioniert nur, weil `DateBrowserComponent` die übergebene Referenz in-place verändert — fragil und ohne Bookmark-/Zurück-Button-Unterstützung.
- **Vestigiales `matSort`-Markup** in beiden Summary-Tabellen (`<table matSort>`), ohne dass `MatSort` in den Component-Imports enthalten ist — totes Markup, Rest eines Copy-Paste aus dem toten `account_module`.

**Empfehlung:** Sprachmix in Home bereinigen; Settings/Profil-Seite mit echten Inhalten füllen (mindestens: Logout, Passwort ändern, Sprache, Diskret-Modus — an einem Ort statt verteilt über Header und Settings); Category-Verwaltung entweder vervollständigen oder das tote Add/Edit-Markup entfernen; Closing-Balance-Summary auf denselben URL-basierten Navigationsansatz wie Complete-Summary umstellen.

---

## 10. Toter Code & Altlasten

**Wichtiger Befund zuerst — Vorsicht bei Aufräumarbeiten:** `src/app/modules/account_module/` sieht wie vollständig totes Desktop-Altlast-Modul aus, ist es aber **nicht komplett**: `abstract-page.component.ts` und `abstract-index.component.ts` aus genau diesem Ordner sind die Basisklassen, von denen praktisch die gesamte aktive App erbt (App-Root-Component eingeschlossen). Ein pauschales Löschen des Ordners würde die App zerstören. Nur zwei Unterordner sind wirklich tot und ohne Risiko entfernbar:

- `account_module/pages/account/index/account-index.ts` (+ html/css/spec) und `account_module/pages/transfer/index/transfer-index.component.ts` (+ html/css/spec) — nachweislich unreferenziert (kein Import, keine Route), zusätzlich beweisbar kaputt: Beide Templates rufen `onSortChange()` auf, eine Methode, die im gesamten Code nirgends definiert ist — ein Klick auf die Sortier-Spalten würde zur Laufzeit einen Fehler werfen.
- Mit diesen zwei Ordnern kann auch die `@angular/material`-Abhängigkeit (nur dort verwendet, `MatSort`) sowie der zugehörige `material.scss`-Build-Eintrag entfernt werden.
- Trotz des irreführenden Namens bot `transfer-index.component.ts` nie eine "Transfer zwischen Konten"-Funktion — das ist im aktiven Mobile-Modul (`transaction-mobile-add.component.ts`, über `transfer_id`) bereits vollständiger implementiert. Hier entsteht durch das Aufräumen also **keine** funktionale Lücke.

**Empfehlung für die Aufräum-Reihenfolge:** Erst `abstract-page.component.ts`/`abstract-index.component.ts` an einen neutralen Ort verschieben (z. B. neben das bereits vorhandene `components/abstract/abstract.component.ts`), danach den Rest von `account_module` sowie `@angular/material` entfernen.

Weitere identifizierte Altlasten:

- **Verwaistes Login-Layout** mit Namens-/Selector-Kollision zu `CoreuiHeaderComponent` (siehe Kapitel 5) — nirgends referenziert, entfernbar.
- **`ECharts`/`D3`/`uPlot`**, laut Projektdokumentation als Chart-Bibliotheken vorgesehen, sind weder als Dependency noch im Code vorhanden — falls irgendwo Diagramme in Summary/Overview erwartet werden, ist dafür aktuell nichts vorbereitet (rein tabellarische Darstellung).
- **`HttpClientModule`** wird zusätzlich zum funktionalen `provideHttpClient()` importiert (`app.component.ts`) — redundantes, veraltetes NgModule-Pattern neben Standalone-Providers.
- **Leere if/else-Zweige** in der Dark-Mode-Sync-Logik von `app.component.ts`, direkt unter einem Kommentar, der den Code selbst als "quick and dirty hack"/"Brechstange" bezeichnet — harmlos, aber ein sichtbarer Hinweis auf unfertigen Code im produktiven Root-Component.
- **Selector-Kollision `'account-list'`**, vergeben an drei unterschiedliche Komponenten (Dashboard-Home, Settings-Home, tatsächliche Account-Liste) — funktioniert nur, weil keine davon den Selector als Tag tatsächlich verwendet, aber ein Stolperstein für neue Entwickler.
- **Debounce-Decorator ist fehlerhaft und wird nirgends verwendet** (`Function.prototype.apply` falsch aufgerufen) — unkritisch, da tot, aber sollte bei Gelegenheit entfernt werden statt als Kandidat für zukünftige Wiederverwendung stehen zu bleiben.
- **Doppelte Einträge in `@Component.imports`-Arrays** an mehreren Stellen (z. B. `CardBodyComponent` doppelt in `user-login.component.ts`, zwei Direktiven doppelt in `coreui-header.component.ts`) — funktional folgenlos, aber Indiz für fehlende Code-Reviews an diesen Stellen.

---

## 11. Funktionale Lücken zusammengefasst

Diese Punkte sind keine "Bugs" im engeren Sinn, sondern fehlende Funktionalität, die vor einem Stable-Release bewusst entschieden werden sollte (umsetzen oder als "not in scope" dokumentieren):

1. Kategorien: kein Edit/Delete (weder Service noch UI).
2. Kontotypen: keine Verwaltung überhaupt (nur Anzeige).
3. Piggybank: kein Edit/Delete.
4. Profilseite: nicht implementiert (Passwort/E-Mail ändern nicht möglich).
5. Passwort-Reset-Flow: nicht vorhanden.
6. Mehrsprachigkeit: strukturell vorbereitet, aber ohne Übersetzungsinhalte nutzlos.
7. Globaler Ladeindikator: Infrastruktur vorhanden, aber nicht ans UI angebunden.
8. Lösch-Bestätigung: an keiner Stelle vorhanden.

---

## 12. Priorisierte Maßnahmenliste für den 8-Wochen-Zeitraum

**Woche 1–2 — Datenverlust-Risiken & kaputte Fehlerpfade (höchste Priorität):**
- Lösch-Bestätigungsdialog einheitlich für Account/Budget/Subscription/Transaction/Piggybank einführen (K2).
- `{next, error}` konsequent bei allen `delete()`-Aufrufen ergänzen, insbesondere Budget/Subscription/Transaction, um den neuen 409-Fehlerpfad des Backends korrekt zu behandeln (K1).
- Budget-Delete: Erfolgsmeldung + Navigation ergänzen (K3); Subscription-Delete-Navigationsziel korrigieren (K4).
- Hartcodiertes Datumsfenster in `closing-balance-summary.component.ts` durch ein dynamisches Zeitfenster ersetzen (K6) — dringend, da es in wenigen Tagen bricht.
- Vulgäre Fehlermeldung in `authentication.service.ts` entfernen (K10).
- `HistoryService`-Situation klären (Datei nachliefern oder toten Spec entfernen), damit die Test-Suite wieder lauffähig ist (K9).

**Woche 3–4 — CRUD-Konsistenz vereinheitlichen:**
- Budget-Edit an das Account/Subscription/Transaction-Vererbungsmuster angleichen.
- `nox-balance-input` auch im Transaction-Edit-Formular statt `nox-input` verwenden.
- Save-Buttons app-weit vereinheitlichen (Text + Icon statt teils nur Icon).
- `type="button"` auf allen reinen Navigations-Buttons in Formularen ergänzen (verhindert ungewolltes Submit beim Abbrechen).
- `required`-Verhalten zwischen `nox-input` und `nox-select` vereinheitlichen (echte Validatoren statt hartem HTML5-`required`).
- Doppelte/sequenzielle HTTP-Calls bereinigen (Transaction-Edit-Doppel-Load, Subscription-Edit-Wasserfall via `forkJoin`).

**Woche 5 — Funktionale Lücken entscheiden und schließen:**
- Product-Entscheidung: Category-/Accounttype-/Piggybank-Verwaltung nachziehen oder bewusst aus dem Release-Scope nehmen (und UI entsprechend anpassen, z. B. tote Edit-Icons entfernen).
- Settings-/Profilseite mit echten Inhalten befüllen (Logout, Passwort ändern, Diskret-Modus, ggf. Sprache) statt sie über Header-Dropdown und einen Einzeiler zu verteilen.
- i18n-Scope final festlegen: entweder Übersetzungsdatei befüllen und Sprachmix bereinigen, oder Transloco-Infrastruktur vorerst nur für Deutsch/Englisch-Grundgerüst nutzen und das klar kommunizieren.

**Woche 6 — Aufräumen (risikoarm, aber wichtig für Wartbarkeit):**
- `abstract-page.component.ts`/`abstract-index.component.ts` aus `account_module` an einen neutralen Ort verschieben.
- Danach toten Code entfernen: restliches `account_module`, `@angular/material`, verwaistes Login-Layout, Debounce-Decorator.
- Alle Debug-`console.warn`-Aufrufe entfernen (insbesondere in den Basisklassen `abstract-index.component.ts` und der `spamsave`-Direktive, da sie bei jeder Interaktion in der ganzen App feuern).
- Globalen Ladeindikator entweder ans UI anbinden oder Interceptor/Service als bewusst deaktiviert markieren; toten CSRF-Interceptor entfernen (deckt sich mit der ohnehin für die REST-Migration geplanten Bereinigung).

**Woche 7 — Navigation & IA-Politur:**
- Einfachen `authGuard` ergänzen, `/error`- und Wildcard-Route nachziehen.
- Tote Links (Category-Add, Bearbeiten-Icon im Baum) entweder mit Funktion versehen oder entfernen.
- Bottom-Nav/Header-Dropdown-Struktur einmal ganzheitlich gegen die tatsächliche Seitenstruktur abgleichen (Settings/Categories erreichbar machen, Logo-Icon in der Bottom-Nav an die restliche Icon-Sprache angleichen).
- Closing-Balance-Summary auf URL-basierte Navigation umstellen (analog Complete-Summary) und in der UI verlinken oder aus dem Routing nehmen.

**Woche 8 — Stabilisierung & Regressionstest:**
- End-to-End-Durchlauf aller CRUD-Flows (Add/Edit/Delete) für jede Entität mit Fokus auf die in Woche 1–4 gemachten Änderungen.
- Geld-/Datumsformatierung stichprobenartig in beiden Sprachumstellungen prüfen.
- Gezielte Prüfung der in Kapitel 8/9 gelisteten Detail-Bugs (Favoriten-Flag-Vergleich, Forecast-Tracking, Fallback-Währung `czk`).
- Freeze für neue Features, nur noch Bugfixing bis Release.

---

## Anhang: Referenzierte Dateien (Auswahl der wichtigsten Fundorte)

```
src/app/modules/eurokeep_mobile_module/pages/account/{add,edit,list}/*
src/app/modules/eurokeep_mobile_module/pages/budget/{add,edit,list}/*
src/app/modules/eurokeep_mobile_module/pages/subscription/{add,edit,list}/*
src/app/modules/eurokeep_mobile_module/pages/transaction/{add,edit,stream}/*
src/app/modules/eurokeep_mobile_module/pages/saving/{add,list,save}/*
src/app/modules/eurokeep_mobile_module/pages/category/list/category-list.component.*
src/app/modules/eurokeep_mobile_module/components/category-tree/category-tree.component.*
src/app/modules/eurokeep_mobile_module/components/{account-entry,subscription-entry,transaction-entry}/*
src/app/modules/eurokeep_mobile_module/components/subscription-forecast/forecast-list.ts
src/app/modules/eurokeep_mobile_module/pages/settings/home/home.component.*
src/app/modules/eurokeep_mobile_module/pages/home/home/home.component.*
src/app/modules/eurokeep_mobile_module/pages/user/login/user-login.component.*
src/app/modules/eurokeep_mobile_module/eurokeep_mobile_module.routes.ts
src/app/modules/overview_module/pages/summary/{closing-balance-summary,complete-summary}/*
src/app/modules/account_module/pages/abstract/abstract-page.component.ts
src/app/modules/account_module/pages/abstract-index/abstract-index.component.ts
src/app/modules/account_module/pages/{account/index,transfer/index}/* (tot, s. Kap. 10)
src/app/services/{account,accounttype,authentication,budget,category,piggybank,search,subscription,transaction}/*
src/app/interceptors/loader.interceptor.ts
src/app/auth/{auth.interceptor,csrf.interceptor}.ts
src/app/global-loading.service.ts
src/app/components/abstract/abstract.component.ts
src/app/components/form/{input-component,select-component,balance-input-component,validation-feedback}/*
src/app/directives/spamsave.directive.ts
src/app/layouts/coreui/header/coreui-header.component.*
src/app/layouts/login/login.layout.ts
src/app/app.component.ts
src/app/app.routes.ts
```

Diese Analyse wurde durch vier fokussierte Teilanalysen (Mobile-CRUD-Seiten, Mobile-Nebenseiten/Navigation/Auth, Shared Services & Components, Overview-Modul & Altlasten) erstellt und hier konsolidiert. Alle genannten Datei:Zeile-Referenzen beziehen sich auf den Stand des Branches `feature/EUR-58` am 2026-08-21.
