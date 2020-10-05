// prepare "namespace"
window.bryntum = window.bryntum || {};
window.bryntum.locales = window.bryntum.locales || {};

// put the locale under window.bryntum.locales to make sure it is discovered automatically
window.bryntum.locales.De = {

    localeName : 'De',
    localeDesc : 'Deutsch',

    App : {
        'Localization demo' : 'Lokalisierungs-Demo'
    },

    //region Common

    Object : {
        Yes    : 'Ja',
        No     : 'Nein',
        Cancel : 'Stornieren',
        Save   : 'Sparen'
    },

    //endregion

    //region Shared localization

    Button : {
        'Add column'    : 'Spalte hinzufügen',
        Apply           : 'Anwenden',
        'Display hints' : 'Tipps anzeigen',
        'Remove column' : 'Spalte entfernen'
    },

    Checkbox : {
        'Auto apply'   : 'Automatisch anwenden',
        Automatically  : 'Automatisch',
        CheckAutoHints : 'Aktivieren Sie diese Option, um beim Laden des Beispiels automatisch Hinweise anzuzeigen'
    },

    CodeEditor : {
        'Code editor'   : 'Code-Editor',
        'Download code' : 'Code herunterladen'
    },

    Combo : {
        noResults       : 'Keine Ergebnisse',
        'Select theme'  : 'Thema wählen',
        'Select locale' : 'Gebietsschema auswählen',
        'Select size'   : 'Wähle die Größe aus'
    },

    Tooltip : {
        'Click to show info and switch theme or locale' : 'Klicken Sie hier, um Informationen anzuzeigen und das Thema oder Gebietsschema zu wechseln',
        'Click to show the built in code editor'        : 'Klicken Sie hier, um den integrierten Code-Editor anzuzeigen',
        Fullscreen                                      : 'Ganzer Bildschirm'

    },

    Shared : {
        'Locale changed' : 'Sprache geändert',
        'Full size'      : 'Volle Größe',
        'Phone size'     : 'Telefongröße'
    },

    //endregion

    //region Columns

    AddNewColumn : {
        'New Column' : 'Neue Spalte hinzufügen...'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Frühes Startdatum'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Frühes Ende'
    },

    LateStartDateColumn : {
        'Late Start' : 'Später Start'
    },

    LateEndDateColumn : {
        'Late End' : 'Spätes Ende'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Gesamte Pufferzeit'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Einschränkung Datum'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Einschränkung'
    },

    DeadlineDateColumn : {
        Deadline : 'Frist'
    },

    DependencyColumn : {
        'Invalid dependency found, change is reverted' : 'Ungültige Abhängigkeit gefunden, Änderung rückgängig gemacht'
    },

    DurationColumn : {
        Duration : 'Dauer'
    },

    EffortColumn : {
        Effort : 'Aufwand'
    },

    EndDateColumn : {
        Finish : 'Fertig stellen'
    },

    EventModeColumn : {
        'Event mode' : 'Ereignismodus',
        Manual       : 'Manuell',
        Auto         : 'Auto'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuell geplant'
    },

    MilestoneColumn : {
        Milestone : 'Meilenstein'
    },

    NameColumn : {
        Name : 'Vorgangsname'
    },

    NoteColumn : {
        Note : 'Notiz'
    },

    PercentDoneColumn : {
        '% Done' : '% erledigt'
    },

    PredecessorColumn : {
        Predecessors : 'Vorgänger'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Zugwiesene Ressourcen',
        'more resources'     : 'Zusätzliche Ressourcen'
    },

    ResourceInfoColumn : {
        eventCountText : function(data) {
            return data + ' Veranstaltung' + (data !== 1 ? 'en' : '');
        }
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modus'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zur Zeitachse hinzufügen'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    StartDateColumn : {
        Start : 'Anfang'
    },

    SuccessorColumn : {
        Successors : 'Nachfolger'
    },

    WBSColumn : {
        WBS : 'WBS'
    },

    //endregion

    //region Gantt

    ProjectLines : {
        'Project Start' : 'Projektstart',
        'Project End'   : 'Projektabende'
    },

    TaskTooltip : {
        Start    : 'Beginnt',
        End      : 'Endet',
        Duration : 'Dauer',
        Complete : 'Erledigt'
    },

    AssignmentGrid : {
        Name     : 'Ressourcenname',
        Units    : 'Einheiten',
        unitsTpl : function(value) {
            return value.value ? value.value + '%' : '';
        }
    },

    AssignmentEditGrid : {
        Name  : 'Resourcenname',
        Units : 'Einheiten'
    },

    Gantt : {
        Edit                   : 'Buchung redigieren',
        Indent                 : 'Herunterstufen',
        Outdent                : 'Heraufstufen',
        'Convert to milestone' : 'Zu Meilenstein konvertieren',
        Add                    : 'Hinzufügen...',
        'New task'             : 'Neue aufgabe',
        'New milestone'        : 'Neue meilenstein',
        'Task above'           : 'Aufgabe vor',
        'Task below'           : 'Aufgabe unter',
        'Delete task'          : 'Lösche Aufgabe(n)',
        Milestone              : 'Meilenstein',
        'Sub-task'             : 'Unteraufgabe',
        Successor              : 'Nachfolger',
        Predecessor            : 'Vorgänger',
        changeRejected         : 'Scheduling Engine hat die Änderungen abgelehnt'
    },

    GanttCommon : {
        dependencyTypes : [
            'AA',
            'EA',
            'AE',
            'EE'
        ]
    },

    Indicators : {
        earlyDates   : 'Früh  start/ende',
        lateDates    : 'Spät start/ende',
        deadlineDate : 'Frist',
        Start        : 'Start',
        End          : 'Ende'
    },

    //endregion

    //region SchedulerPro

    SchedulerProCommon : {
        SS                  : 'AA',
        SF                  : 'EA',
        FS                  : 'AE',
        FF                  : 'EE',
        dependencyTypesLong : [
            'Anfang-Anfang',
            'Anfang-Ende',
            'Enge-Anfang',
            'Enge-Ende'
        ]
    },

    ConstraintTypePicker : {
        none                : 'Keiner',
        muststarton         : 'Ende nicht früher als',
        mustfinishon        : 'Ende nicht später als',
        startnoearlierthan  : 'Muss anfangen am',
        startnolaterthan    : 'Muss enden am',
        finishnoearlierthan : 'Anfang nicht früher als',
        finishnolaterthan   : 'Anfang nicht später als'
    },

    CalendarField : {
        'Default calendar' : 'Standardkalender'
    },

    ProTaskEdit : {
        'Edit event' : 'Buchung redigieren'
    },

    TaskEditorBase : {
        editorWidth : '50em',
        Information : 'Informationen',
        Save        : 'Sparen',
        Cancel      : 'Stornieren',
        Delete      : 'Löschen',
        saveError   : 'Kann nicht speichern, bitte korrigieren Sie zuerst die Fehler'
    },

    SchedulerGeneralTab : {
        labelWidth           : '15em',
        General              : 'Generell',
        Name                 : 'Name',
        '% complete'         : 'Abgeschlossen in Prozent',
        Duration             : 'Dauer',
        Start                : 'Start',
        Finish               : 'Ende',
        Dates                : 'Datumsangaben',
        'Manually scheduled' : 'Manuell geplant',
        Calendar             : 'Kalender'
    },

    GeneralTab : {
        labelWidth   : '15em',
        General      : 'Generell',
        Name         : 'Name',
        '% complete' : 'Abgeschlossen in Prozent',
        Duration     : 'Dauer',
        Start        : 'Start',
        Finish       : 'Ende',
        Effort       : 'Anstrengung',
        Dates        : 'Datumsangaben'
    },

    AdvancedTab : {
        labelWidth           : '15em',
        Advanced             : 'Fortgeschritten',
        Calendar             : 'Kalender',
        'Scheduling mode'    : 'Planungsmodus',
        'Effort driven'      : 'Mühe getrieben',
        'Manually scheduled' : 'Manuell geplant',
        'Constraint type'    : 'Einschränkungstyp',
        'Constraint date'    : 'Datum der Einschränkung',
        Constraint           : 'Einschränkung',
        Rollup               : 'Rollup'
    },

    DependencyTab : {
        Predecessors                          : 'Vorgänger',
        Successors                            : 'Nachfolger',
        ID                                    : 'ID',
        Name                                  : 'Name',
        Type                                  : 'Typ',
        Lag                                   : 'Verzögern',
        'Cyclic dependency has been detected' : 'Die zyklische Abhängigkeit wurde erkannt',
        'Invalid dependency'                  : 'Ungültige Abhängigkeit'
    },

    ResourcesTab : {
        Resources : 'Ressourcen',
        Resource  : 'Ressource',
        Units     : 'Einheiten',
        unitsTpl  : function(value) {
            return value.value ? value.value + '%' : '';
        }
    },

    NotesTab : {
        Notes : 'Notizen'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Feste Dauer',
        'Fixed Units'    : 'Feste Einheiten',
        'Fixed Effort'   : 'Feste Arbeit'
    },

    //endregion

    //region Mixins

    CrudManagerView : {
        serverResponseLabel : 'Serverantwort:'
    },

    //endregion

    //region Features

    ColumnPicker : {
        column          : 'Splate',
        columnsMenu     : 'Spalten',
        hideColumn      : 'Versteck spalte',
        hideColumnShort : 'Versteck'
    },

    Filter : {
        applyFilter  : 'Filter anwenden',
        filter       : 'Filter',
        editFilter   : 'Filter redigieren',
        on           : 'Auf',
        before       : 'Vor',
        after        : 'Nach',
        equals       : 'Gleichen',
        lessThan     : 'Weniger als',
        moreThan     : 'Mehr als',
        removeFilter : 'Filter entfernen'
    },

    FilterBar : {
        enableFilterBar  : 'Filterleiste anzeigen',
        disableFilterBar : 'Filterleiste ausblenden'
    },

    Group : {
        group                : 'Gruppe',
        groupAscending       : 'Aufsteigend gruppieren',
        groupDescending      : 'Absteigend gruppieren',
        groupAscendingShort  : 'Aufsteigend',
        groupDescendingShort : 'Absteigend',
        stopGrouping         : 'Stoppen gruppierung',
        stopGroupingShort    : 'Stoppen'
    },

    Search : {
        searchForValue : 'Suche nach Wert'
    },

    Sort : {
        sort                   : 'Sorte',
        sortAscending          : 'Aufsteigend sortierung',
        sortDescending         : 'Absteigend sortierung',
        multiSort              : 'Multi sortieren',
        removeSorter           : 'Sortierung entfernen',
        addSortAscending       : 'Aufsteigend sortieren hinzufügen',
        addSortDescending      : 'Absteigend sortieren hinzufügen',
        toggleSortAscending    : 'Ändern Sie auf aufsteigend',
        toggleSortDescending   : 'Zu absteigend wechseln',
        sortAscendingShort     : 'Aufsteigend',
        sortDescendingShort    : 'Absteigend',
        removeSorterShort      : 'Entfernen',
        addSortAscendingShort  : '+ Aufsteigend',
        addSortDescendingShort : '+ Absteigend'
    },

    Summary : {
        'Summary for' : function(date) {
            return 'Zusammenfassung für ' + date;
        }
    },

    //endregion

    //region Grid

    GridBase : {
        loadFailedMessage  : 'Wird geladen, bitte versuche es erneut!',
        syncFailedMessage  : 'Datensynchronisation fehlgeschlagen!',
        unspecifiedFailure : 'Nicht spezifizierter Fehler',
        unknownFailure     : 'Unbekannter Fehler',
        networkFailure     : 'Netzwerkfehler',
        parseFailure       : 'Serverantwort konnte nicht analysiert werden',
        loadMask           : 'Laden...',
        syncMask           : 'Speichere Änderungen, bitte warten...',
        noRows             : 'Keine Zeilen zum Anzeigen',
        removeRow          : 'Zeile löschen',
        removeRows         : 'Zeilen löschen',
        moveColumnLeft     : 'Bewegen Sie sich zum linken Bereich',
        moveColumnRight    : 'Bewegen Sie sich nach rechts',
        moveColumnTo       : function(region) {
            return 'Spalte verschieben nach ' + region;
        }
    },

    //region Export

    PdfExport : {
        'Waiting for response from server' : 'Warten auf Antwort vom Server...',
        'Export failed'                    : 'Export fehlgeschlagen',
        'Server error'                     : 'Serverfehler',
        'Generating pages'                 : 'Seiten generieren...'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Exporteinstellungen',
        export         : 'Export',
        exporterType   : 'Kontrolliere die Paginierung',
        cancel         : 'Stornieren',
        fileFormat     : 'Datei Format',
        rows           : 'Reihen',
        alignRows      : 'Zeilen ausrichten',
        columns        : 'Säulen',
        paperFormat    : 'Papierformat',
        orientation    : 'Orientierung',
        repeatHeader   : 'Header wiederholen'
    },

    ExportRowsCombo : {
        all     : 'Alle Zeilen',
        visible : 'Sichtbare Zeilen'
    },

    ExportOrientationCombo : {
        portrait  : 'Porträt',
        landscape : 'Landschaft'
    },

    SinglePageExporter : {
        singlepage : 'Einzelne Seite'
    },

    MultiPageExporter : {
        multipage     : 'Mehrere Seiten',
        exportingPage : function(data) {
            return 'Seite exportieren ' + data.currentPage + '/' + data.totalPages;
        }
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Mehrere Seiten (vertikal)',
        exportingPage     : function(data) {
            return 'Seite exportieren ' + data.currentPage + '/' + data.totalPages;
        }
    },

    ScheduleRangeCombo : {
        completeview : 'Vollständiger Zeitplan',
        currentview  : 'Sichtbarer Zeitplan',
        daterange    : 'Datumsbereich',
        completedata : 'Vollständiger Zeitplan (für alle Veranstaltungen)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Zeitplanbereich ',
        'Export from'    : 'Von',
        'Export to'      : 'Zu'
    },

    //endregion

    //endregion

    //region Widgets

    FilePicker : {
        file : 'Datei'
    },

    DateField : {
        invalidDate : 'Ungültige Datumseingabe'
    },

    Field : {
        // native input ValidityState statuses
        badInput        : 'Ungültiger Feldwert',
        patternMismatch : 'Der Wert sollte einem bestimmten Muster entsprechen',
        rangeOverflow   : function(value) {
            return 'Der Wert muss größer als oder gleich ' + value.max + ' sein';
        },
        rangeUnderflow : function(value) {
            return 'Der Wert muss größer als oder gleich ' + value.min + ' sein';
        },
        stepMismatch : 'Der Wert sollte zum Schritt passen',
        tooLong      : 'Der Wert sollte kürzer sein',
        tooShort     : 'Der Wert sollte länger sein',
        typeMismatch : 'Der Wert muss in einem speziellen Format vorliegen',
        valueMissing : 'Dieses Feld wird benötigt',

        invalidValue          : 'Ungültiger Feldwert',
        minimumValueViolation : 'Mindestwertverletzung',
        maximumValueViolation : 'Maximalwertverletzung',
        fieldRequired         : 'Dieses Feld wird benötigt',
        validateFilter        : 'Der Wert muss aus der Liste ausgewählt werden'
    },

    List : {
        loading : 'Beladung...'
    },

    PagingToolbar : {
        firstPage : 'Gehe zur ersten Seite',
        prevPage  : 'Zurück zur letzten Seite',
        page      : 'Seite',
        nextPage  : 'Gehe zur nächsten Seite',
        lastPage  : 'Gehe zur letzten Seite',
        reload    : 'Aktuelle Seite neu laden',
        noRecords : 'Keine Zeilen zum Anzeigen',
        pageCountTemplate(store) {
            return `von ${store.lastPage}`;
        },
        summaryTemplate(store) {
            const start = (store.currentPage - 1) * store.pageSize + 1;

            return `Ergebnisse ${start} - ${start + store.pageSize - 1} von ${store.allCount}`;
        }
    },

    TimeField : {
        invalidTime : 'Ungültige Zeitangabe'
    },

    //endregion

    //region Dates

    DateHelper : {
        locale       : 'de',
        weekStartDay : 1,
        unitNames    : [
            { single : 'Millisekunde', plural : 'Millisekunden', abbrev : 'ms' },
            { single : 'Sekunde', plural : 'Sekunden', abbrev : 's' },
            { single : 'Minute', plural : 'Minuten', abbrev : 'min' },
            { single : 'Stunde', plural : 'Stunden', abbrev : 'std' },
            { single : 'Tag', plural : 'Tage', abbrev : 't' },
            { single : 'Woche', plural : 'Wochen', abbrev : 'W' },
            { single : 'Monat', plural : 'Monathe', abbrev : 'mon' },
            { single : 'Quartal', plural : 'Quartal', abbrev : 'Q' },
            { single : 'Jahr', plural : 'Jahre', abbrev : 'jahr' }
        ],
        // Used to build a RegExp for parsing time units.
        // The full names from above are added into the generated Regexp.
        // So you may type "2 w" or "2 wk" or "2 week" or "2 weeks" into a DurationField.
        // When generating its display value though, it uses the full localized names above.
        unitAbbreviations : [
            ['mil'],
            ['s', 'sec'],
            ['m', 'min'],
            ['h', 'hr'],
            ['d'],
            ['w', 'wk'],
            ['mo', 'mon', 'mnt'],
            ['q', 'quar', 'qrt'],
            ['y', 'yr']
        ],
        parsers : {
            L  : 'DD.MM.YYYY',
            LT : 'HH:mm'
        },
        ordinalSuffix : function(number) {
            return number;
        }
    },

    //endregion

    //region Scheduler

    ExcelExporter : {
        'No resource assigned' : 'Keine Ressource zugewiesen'
    },

    Dependencies : {
        from     : 'Von',
        to       : 'Zo',
        valid    : 'Gültig',
        invalid  : 'Ungültig',
        Checking : 'Überprüfung…'
    },

    DependencyEdit : {
        From              : 'Von',
        To                : 'Zu',
        Type              : 'Typ',
        Lag               : 'Verzögern',
        'Edit dependency' : 'Abhängigkeit bearbeiten',

        Save         : 'Speichern',
        Delete       : 'Löschen',
        Cancel       : 'Abbrechen',
        StartToStart : 'Anfang-Anfang',
        StartToEnd   : 'Anfang-Ende',
        EndToStart   : 'Ende-Anfang',
        EndToEnd     : 'Ende-Ende'
    },

    EventEdit : {
        Name         : 'Name',
        Resource     : 'Ressource',
        Start        : 'Start',
        End          : 'Ende',
        Save         : 'Speichern',
        Delete       : 'Löschen',
        Cancel       : 'Abbrechen',
        'Edit Event' : 'Buchung redigieren'
    },

    Scheduler : {
        'Add event'      : 'Ereignis hinzufügen',
        'Delete event'   : 'Buchung löschen',
        'Unassign event' : 'Ereignis nicht zuordnen'
    },

    EventDrag : {
        eventOverlapsExisting : 'Ereignis überlappt vorhandenes Ereignis für diese Ressource',
        noDropOutsideTimeline : 'Event wird möglicherweise nicht vollständig außerhalb der Timeline gelöscht'
    },

    HeaderContextMenu : {
        pickZoomLevel   : 'Zoomen',
        activeDateRange : 'Datumsbereich',
        startText       : 'Anfangsdatum',
        endText         : 'Endtermin',
        todayText       : 'Heute'
    },

    EventFilter : {
        filterEvents : 'Aufgaben filtern',
        byName       : 'Namentlich'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Aktuelle Zeitleiste anzeigen'
    },

    PresetManager : {
        minuteAndHour : {
            topDateFormat : 'ddd DD.MM, HH:mm'
        },
        hourAndDay : {
            topDateFormat : 'ddd DD.MM'
        },
        weekAndDay : {
            displayDateFormat : 'HH:mm'
        }
    },

    //endregion

    //region Examples

    Column : {
        Name              : 'Name',
        Age               : 'Alter',
        City              : 'Stadt',
        Food              : 'Essen',
        Color             : 'Farbe',
        'First name'      : 'Vorname',
        Surname           : 'Nachname',
        Team              : 'Team',
        Score             : 'Ergebnis',
        Rank              : 'Rang',
        Percent           : 'Prozent',
        Birthplace        : 'Geburstort',
        Start             : 'Anfang',
        Finish            : 'Ende',
        Template          : 'Vorlage (template)',
        Date              : 'Datum',
        Check             : 'Check',
        Contact           : 'Kontakt',
        Favorites         : 'Favoriten',
        'Customer#'       : 'Kunde#',
        When              : 'Wann',
        Brand             : 'Marke',
        Model             : 'Modell',
        'Personal best'   : 'Persönlicher rekord',
        'Current rank'    : 'Aktueller rang',
        Hometown          : 'Heimatstadt',
        Satisfaction      : 'Zufriedenheit',
        'Favorite color'  : 'Lieblingsfarbe',
        Rating            : 'Wertung',
        Cooks             : 'Zuberaiten',
        Birthday          : 'Geburstag',
        Staff             : 'Personal',
        Machines          : 'Maschinen',
        Type              : 'Typ',
        'Task color'      : 'Aufgabe farbe',
        'Employment type' : 'Beschäftigungsverhältnis',
        Capacity          : 'Kapazität',
        'Production line' : 'Fließband',
        Company           : 'Firma',
        End               : 'Ende'
    }

    //endregion

};
