import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Core/localization/SvSE.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Features

        ColumnPicker : {
            column          : 'Kolumn',
            columnsMenu     : 'Kolumner',
            hideColumn      : 'Dölj kolumn',
            hideColumnShort : 'Dölj'
        },

        Filter : {
            applyFilter  : 'Använd filter',
            editFilter   : 'Redigera filter',
            filter       : 'Filter',
            on           : 'På',
            before       : 'Före',
            after        : 'Efter',
            equals       : 'Lika med',
            lessThan     : 'Mindre än',
            moreThan     : 'Större än',
            removeFilter : 'Ta bort filter'
        },

        FilterBar : {
            enableFilterBar  : 'Visa filterrad',
            disableFilterBar : 'Dölj filterrad'
        },

        Group : {
            group                : 'Gruppera',
            groupAscending       : 'Gruppera stigande',
            groupDescending      : 'Gruppera fallande',
            groupAscendingShort  : 'Stigande',
            groupDescendingShort : 'Fallande',
            stopGrouping         : 'Sluta gruppera',
            stopGroupingShort    : 'Sluta'
        },

        Search : {
            searchForValue : 'Sök efter värde'
        },

        Sort : {
            sort                   : 'Sortera',
            sortAscending          : 'Sortera stigande',
            sortDescending         : 'Sortera fallande',
            multiSort              : 'Multisortering',
            addSortAscending       : 'Lägg till stigande',
            addSortDescending      : 'Lägg till fallande',
            toggleSortAscending    : 'Ändra till stigande',
            toggleSortDescending   : 'Ändra till fallande',
            removeSorter           : 'Ta bort sorterare',
            sortAscendingShort     : 'Stigande',
            sortDescendingShort    : 'Fallande',
            removeSorterShort      : 'Ta bort',
            addSortAscendingShort  : '+ Stigande',
            addSortDescendingShort : '+ Fallande'
        },

        //endregion

        //region Grid

        GridBase : {
            loadFailedMessage  : 'Ett fel har uppstått, vänligen försök igen!',
            syncFailedMessage  : 'Datasynkronisering misslyckades!',
            unspecifiedFailure : 'Ospecificerat fel',
            unknownFailure     : 'Okänt fel',
            networkFailure     : 'Nätverksfel',
            parseFailure       : 'Det gick inte att bearbeta serversvaret',
            loadMask           : 'Laddar...',
            syncMask           : 'Sparar ändringar, vänligen vänta...',
            noRows             : 'Inga rader att visa',
            removeRow          : 'Ta bort rad',
            removeRows         : 'Ta bort rader',
            moveColumnLeft     : 'Flytta till vänstra sektionen',
            moveColumnRight    : 'Flytta till högra sektionen',
            moveColumnTo       : region => `Flytta kolumn till ${region}`
        },

        //endregion

        //region Export

        PdfExport : {
            'Waiting for response from server' : 'Väntar på svar från servern...',
            'Export failed'                    : 'Export misslyckades',
            'Server error'                     : 'Serverfel',
            'Generating pages'                 : 'Genererar sidor...'
        },

        ExportDialog : {
            width          : '40em',
            labelWidth     : '13em',
            exportSettings : 'Exportera inställningar',
            export         : 'Exportera',
            exporterType   : 'Styra sidbrytningarna',
            cancel         : 'Avbryt',
            fileFormat     : 'Filformat',
            rows           : 'Кader',
            alignRows      : 'Anpassa raderna',
            columns        : 'Kolumner',
            paperFormat    : 'Pappersformat',
            orientation    : 'Orientering',
            repeatHeader   : 'Upprepa rubriken'
        },

        ExportRowsCombo : {
            all     : 'Alla rader',
            visible : 'Synliga rader'
        },

        ExportOrientationCombo : {
            portrait  : 'Stående',
            landscape : 'Liggande'
        },

        SinglePageExporter : {
            singlepage : 'En sida'
        },

        MultiPageExporter : {
            multipage     : 'Flera sidor',
            exportingPage : ({ currentPage, totalPages }) => `Exporterar sidan ${currentPage}/${totalPages}`
        },

        MultiPageVerticalExporter : {
            multipagevertical : 'Flera sidor (lodrätt)',
            exportingPage     : ({ currentPage, totalPages }) => `Exporterar sidan ${currentPage}/${totalPages}`
        }

        //endregion
    });

export default locale;
//</umd>

LocaleManager.registerLocale('SvSE', { desc : 'Svenska', locale : locale });
