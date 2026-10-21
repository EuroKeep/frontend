import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    inject,
    ViewChild
} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {DateBrowserComponent} from "../../../../../components/date-browser/date-browser.component";
import * as echarts from 'echarts/core';
import type {EChartsOption} from 'echarts';
import {PieChart} from 'echarts/charts';
import {LegendComponent, TooltipComponent} from 'echarts/components';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

// Only register what the category donut needs instead of the complete ECharts bundle.
echarts.use([PieChart, TooltipComponent, LegendComponent, LabelLayout, CanvasRenderer]);
import {AnalyzerService} from "../../../../../services/analyzer/analyzer.service";
import {SummaryResponse} from "../../../../overview_module/services/summary/summary.interface";
import {ApiIndexResponse} from "../../../../../services/abstract/abstract.interface";
import {AnalysisApiResponse, AnalysisByCategory} from "../../../../../services/analyzer/analyzer.interface";
import {CardComponent} from "@coreui/angular";
import {
    TransactionListComponent
} from "../../../../../components/transaction/transaction-stream/transaction-list.component";
import {Transaction} from "../../../../../services/transaction/transaction.interface";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'analyzer-month',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        DateBrowserComponent,
        CardComponent,
        TransactionListComponent,
        RouterLink,

    ],
    templateUrl: './analyzer-month.component.html',
    styleUrl: './analyzer-month.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyzerMonthComponent extends AbstractPageComponent implements AfterViewInit {

    private readonly AnalyzerService: AnalyzerService = inject(AnalyzerService);

    // Fields for the page
    protected Transactions: Transaction[] = [];
    protected params: any = {};
    protected year: number = 0;
    protected month: number = 0;
    // Set when the route carries a :categoryId (drill-down into that category's
    // subcategories, see onCategoryClick()/onBack() and the :categoryId route variant).
    protected categoryId: number = 64;

    // Host div for the ECharts pie chart, see #categoryChartRef in the template.
    // ECharts needs a real DOM node with a resolved (non-zero) size to init() into.
    @ViewChild('categoryChartRef') protected categoryChartRef?: ElementRef<HTMLDivElement>;
    private categoryChart?: echarts.ECharts;

    // Categorical colors, fixed order (never cycled / never reassigned per-filter) so a
    // category keeps the same color across renders. Mirrors the light/dark pairs used in
    // analyzer-month.component.css (--chart-surface / --chart-text-*) — kept as plain hex
    // here because ECharts draws to <canvas> and can't resolve CSS custom properties itself.
    private static readonly CATEGORY_COLORS_LIGHT: string[] = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'];
    private static readonly CATEGORY_COLORS_DARK: string[] = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'];

    override ngOnInit() {
        this.ActivatedRoute.paramMap.subscribe(params => {
            this.year = Number(params.get('year'));
            this.month = Number(params.get('month'));
            const categoryId = params.get('categoryId') || 64;
            this.params.categoryId = categoryId !== null ? Number(categoryId) : undefined;


            if (this.year === 0 && this.month === 0) {
                this.onChange(new Date());
                return;
            }

            this.params.start = new Date();
            this.params.start.setUTCFullYear(this.year);
            this.params.start.setUTCMonth(this.month - 1);
            this.params.start.setUTCDate(1);
            this.params.start.setUTCHours(0);
            this.params.start.setUTCMinutes(0);
            this.params.start.setUTCSeconds(0);

            this.params.end = new Date();
            this.params.end.setUTCFullYear(this.year);
            this.params.end.setUTCMonth(this.params.start.getUTCMonth() + 1);
            this.params.end.setUTCDate(1);
            this.params.end.setUTCHours(0);
            this.params.end.setUTCMinutes(0);
            this.params.end.setUTCSeconds(0);

            this.index();
        });

        super.ngOnInit();
    }


    protected onChange(date: Date): void {
        this.Router.navigate(['/', 'mobile', 'analyzer', 'month', date.getUTCFullYear(), date.getUTCMonth() + 1]);
    }

    // Drill into the clicked category's subcategories (wired up from the pie chart's 'click'
    // event in index()).
    protected onCategoryClick(categoryId: number): void {
        this.Router.navigate(['/', 'mobile', 'analyzer', 'month', this.year, this.month, categoryId]);
    }

    // Back out of a drill-down to the top-level categories for the same month.
    protected onBack(): void {
        this.Router.navigate(['/', 'mobile', 'analyzer', 'month', this.year, this.month]);
    }

    ngAfterViewInit(): void {
        // The chart div only has a size once the view is rendered, so init() happens here,
        // not in ngOnInit().
        this.index();
    }

    override ngOnDestroy(): void {
        // Not disposing leaks the canvas/WebGL context and the chart's internal listeners.
        this.categoryChart?.dispose();
        super.ngOnDestroy();
    }

    @HostListener('window:resize')
    protected onResize(): void {
        this.categoryChart?.resize();
    }

    /**
     * Zeichnet ein Kuchendiagramm (als Donut) der Ausgaben pro Kategorie für den gewählten
     * Monat, gefiltert über AnalyzerService.index()/AnalyzerController::category(). Ohne
     * categoryId zeigt es die Top-Level-Kategorien, mit categoryId (Klick auf einen Slice,
     * siehe onCategoryClick()) deren direkte Unterkategorien.
     *
     * Diese Methode dokumentiert absichtlich ausführlich, was jede `EChartsOption`-Eigenschaft
     * bewirkt, damit sie als Vorlage für weitere Charts in der App dienen kann.
     *
     * ── Top-Level-Optionen von EChartsOption (die hier relevanten) ──────────────────────────
     * • color        — Fallback-Farbpalette für Serien, die keine eigene `itemStyle.color`
     *                   pro Datenpunkt setzen. Wird in fester Reihenfolge den Slices
     *                   zugewiesen (Slice 1 → color[0], Slice 2 → color[1], …). Nicht bei
     *                   jedem Filterwechsel neu durchmischen — sonst wechselt eine Kategorie
     *                   ihre Farbe, sobald eine andere Kategorie verschwindet.
     * • backgroundColor — Hintergrund der Zeichenfläche selbst. Hier `'transparent'` gesetzt,
     *                   damit der Karten-Hintergrund aus der CSS-Datei durchscheint, statt
     *                   ihn im Canvas zu duplizieren.
     * • title        — Diagrammtitel (optional; hier weggelassen, weil die Überschrift schon
     *                   im HTML als <h5> steht — sonst gäbe es den Titel doppelt).
     * • tooltip      — Hover-/Touch-Layer. `trigger: 'item'` zeigt beim Überfahren eines
     *                   Slices Name/Wert/Prozent (siehe `formatter`). Für Pie-Charts immer
     *                   'item', nicht 'axis' (kein Koordinatensystem vorhanden).
     * • legend       — Farbe-zu-Kategorie-Zuordnung als Liste unterhalb/seitlich des Charts.
     *                   Pflicht, sobald mehr als eine Serie/Kategorie dargestellt wird, damit
     *                   Identität nie ausschließlich über Farbe transportiert wird.
     * • series       — Array der eigentlichen Diagrammserien; für ein Pie-Chart genau ein
     *                   Eintrag mit `type: 'pie'` (mehrere Einträge = mehrere konzentrische
     *                   Ringe, hier nicht gebraucht).
     *
     * ── Pie-Serien-Optionen (series[0]) ──────────────────────────────────────────────────────
     * • radius       — `['40%', '70%']` macht aus dem Pie einen Donut (innerer/äußerer
     *                   Radius). Ein einzelner Prozentwert (z. B. `'70%'`) ergäbe einen
     *                   klassischen Vollkreis-Kuchen.
     * • center       — Mittelpunkt des Kreises relativ zur Zeichenfläche, hier horizontal
     *                   mittig / vertikal leicht oberhalb der Mitte, um unten Platz für die
     *                   Legende zu lassen.
     * • avoidLabelOverlap — lässt ECharts die Slice-Beschriftungen automatisch versetzen,
     *                   statt sie überlappen zu lassen, wenn viele kleine Kategorien
     *                   nebeneinander liegen.
     * • itemStyle.borderColor/-Width — zeichnet einen 2px "Trennring" in der Kartenfarbe um
     *                   jeden Slice (Analog zum 2px-Flächenabstand bei gestapelten Balken/
     *                   Flächen) — verhindert, dass benachbarte Slices optisch verschmelzen.
     * • itemStyle.borderRadius — rundet die Slice-Kanten leicht ab (entspricht den
     *                   abgerundeten Enden bei Balken/Linien).
     * • label        — Direktbeschriftung pro Slice. Hier bewusst nur für Slices >5% aktiv
     *                   (`formatter` gibt bei kleineren Anteilen nichts zurück), damit nicht
     *                   jeder einzelne Datenpunkt eine Zahl trägt, sondern nur die auffälligen.
     * • labelLine    — Verbindungslinie zwischen Slice und Label, wenn das Label wegen
     *                   Platzmangel nach außen gesetzt wird.
     * • emphasis     — Zusätzlicher Stil beim Hover (hier: fetterer Titel-/Wert-Text
     *                   innerhalb des Donut-Lochs) — rein visuelles Feedback, keine
     *                   Datenänderung.
     * • data         — Die eigentlichen Werte: Array aus `{ value, name, id }`. `value`
     *                   bestimmt den Winkel des Slices, `name` erscheint in Tooltip/Legende/
     *                   Label. `id` ist kein von ECharts interpretiertes Feld, sondern wird
     *                   nur durchgereicht, damit der 'click'-Handler unten weiß, in welche
     *                   Kategorie navigiert werden soll.
     */
    private index(): void {
        let params = structuredClone(this.params);
        if (params.start instanceof Date) {
            params.start = params.start.toISOString();
        }
        if (params.end instanceof Date) {
            params.end = params.end.toISOString();
        }


        this.Subscription.add(this.AnalyzerService.index(params).subscribe({
            next: (result: AnalysisApiResponse<AnalysisByCategory>) => {
                this.unlockButtons();

                if (!this.categoryChartRef) {
                    return;
                }

                this.Transactions = result.transactions;
                this.categoryChart = echarts.init(this.categoryChartRef.nativeElement);

                const isDarkTheme: boolean = document.body.classList.contains('dark-theme');
                const colors: string[] = isDarkTheme
                    ? AnalyzerMonthComponent.CATEGORY_COLORS_DARK
                    : AnalyzerMonthComponent.CATEGORY_COLORS_LIGHT;
                const textColor: string = isDarkTheme ? '#e8eaf4' : '#16192b';
                const secondaryTextColor: string = isDarkTheme ? '#a3a9c2' : '#5a6075';
                // Border between slices is drawn in the card's own surface color so slices read as
                // visually separated rather than sitting on the chart's transparent background.
                const surfaceColor: string = isDarkTheme ? '#171d3a' : '#ffffff';

                const categoryData: { value: number; name: string; id: number }[] = result.items;

                const option: EChartsOption = {
                    color: colors,
                    backgroundColor: 'transparent',
                    tooltip: {
                        trigger: 'item',
                        formatter: (params: any): string => `${params.name}: ${params.value} € (${params.percent}%)`,
                    },
                    legend: {
                        bottom: 0,
                        left: 'center',
                        textStyle: {color: secondaryTextColor},
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: true,
                            itemStyle: {
                                borderColor: surfaceColor,
                                borderWidth: 2,
                                borderRadius: 4,
                            },
                            label: {
                                color: secondaryTextColor,
                                formatter: (params: any): string => params.percent >= 5 ? `${params.name}\n${params.percent}%` : '',
                            },
                            labelLine: {
                                show: true,
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: textColor,
                                },
                            },
                            data: categoryData,
                        },
                    ],
                };

                this.categoryChart.setOption(option);

                // Drill into the clicked slice's subcategories. componentType/data guard
                // against clicks on the legend or the empty donut hole, which also fire
                // 'click' but carry no pie datum.
                this.categoryChart.on('click', (evt: any): void => {
                    if (evt.componentType !== 'series' || evt.data?.id === undefined) {
                        return;
                    }
                    this.onCategoryClick(evt.data.id);
                });

                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));


    }
}
