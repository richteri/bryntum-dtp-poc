import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Core/localization/Nl.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Features

        ColumnPicker : {
            column          : 'Kolom',
            columnsMenu     : 'Kolommen',
            hideColumn      : 'Verberg Kolom',
            hideColumnShort : 'Verberg'
        },

        Filter : {
            applyFilter  : 'Pas filter toe',
            filter       : 'Filter',
            editFilter   : 'Wijzig filter',
            on           : 'Aan',
            before       : 'Voor',
            after        : 'Na',
            equals       : 'Is gelijk',
            lessThan     : 'Minder dan',
            moreThan     : 'Meer dan',
            removeFilter : 'Verwijder filter'
        },

        FilterBar : {
            enableFilterBar  : 'Maak filterbalk zichtbaar',
            disableFilterBar : 'Verberg filterbalk'
        },

        Group : {
            group                : 'Groepeer',
            groupAscending       : 'Groepeer oplopend',
            groupDescending      : 'Groepeer aflopend',
            groupAscendingShort  : 'Oplopend',
            groupDescendingShort : 'Aflopend',
            stopGrouping         : 'Maak groepering ongedaan',
            stopGroupingShort    : 'Maak ongedaan'
        },

        Search : {
            searchForValue : 'Zoek op term'
        },

        Sort : {
            sort                   : 'Sorteer',
            sortAscending          : 'Sorteer oplopend',
            sortDescending         : 'Sorteer aflopend',
            multiSort              : 'Meerdere sorteringen',
            removeSorter           : 'Verwijder sortering',
            addSortAscending       : 'Voeg oplopende sortering toe',
            addSortDescending      : 'Voeg aflopende sortering toe',
            toggleSortAscending    : 'Sorteer oplopend',
            toggleSortDescending   : 'Sorteer aflopend',
            sortAscendingShort     : 'Oplopend',
            sortDescendingShort    : 'Aflopend',
            removeSorterShort      : 'Verwijder',
            addSortAscendingShort  : '+ Oplopend',
            addSortDescendingShort : '+ Aflopend'
        },

        //endregion

        //region Grid

        GridBase : {
            loadFailedMessage  : 'Laden mislukt!',
            syncFailedMessage  : 'Gegevenssynchronisatie is mislukt!',
            unspecifiedFailure : 'Niet-gespecificeerde fout',
            unknownFailure     : 'Onbekende fout',
            networkFailure     : 'Netwerk fout',
            parseFailure       : 'Kan server response niet parsen',
            loadMask           : 'Laden...',
            syncMask           : 'Bezig met opslaan...',
            noRows             : 'Geen rijen om weer te geven',
            removeRow          : 'Verwijder rij',
            removeRows         : 'Verwijder rijen',
            moveColumnLeft     : 'Plaats naar het linker kader',
            moveColumnRight    : 'Plaats naar het rechter kader',
            moveColumnTo       : region => `Kolom verplaatsen naar ${region}`
        },

        //endregion

        //region Export

        PdfExport : {
            'Waiting for response from server' : 'Wachten op antwoord van server...',
            'Export failed'                    : 'Export mislukt',
            'Server error'                     : 'Serverfout',
            'Generating pages'                 : 'Pagina\'s genereren...'
        },

        ExportDialog : {
            width          : '40em',
            labelWidth     : '12em',
            exportSettings : 'Instellingen exporteren',
            export         : 'Exporteren',
            exporterType   : 'Paginering beheren',
            cancel         : 'Annuleren',
            fileFormat     : 'Bestandsformaat',
            rows           : 'Rijen',
            alignRows      : 'Rijen uitlijnen',
            columns        : 'Columns',
            paperFormat    : 'Papier formaat',
            orientation    : 'Oriëntatatie',
            repeatHeader   : 'Herhaal koptekst'
        },

        ExportRowsCombo : {
            all     : 'Alle rijen',
            visible : 'Zichtbare rijen'
        },

        ExportOrientationCombo : {
            portrait  : 'Staand',
            landscape : 'Liggend'
        },

        SinglePageExporter : {
            singlepage : 'Enkele pagina'
        },

        MultiPageExporter : {
            multipage     : 'Meerdere pagina\'s',
            exportingPage : ({ currentPage, totalPages }) => `Exporteren van de pagina ${currentPage}/${totalPages}`
        },

        MultiPageVerticalExporter : {
            multipagevertical : 'Meerdere pagina\'s (verticaal)',
            exportingPage : ({ currentPage, totalPages }) => `Exporteren van de pagina ${currentPage}/${totalPages}`
        }

        //endregion
    });

export default locale;
//</umd>

LocaleManager.registerLocale('Nl', { desc : 'Nederlands', locale : locale });
