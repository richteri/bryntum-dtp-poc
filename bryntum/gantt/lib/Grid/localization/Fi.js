import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Core/localization/Fi.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Features

        ColumnPicker : {
            columnsMenu     : 'Columns',
            hideColumn      : 'Hide column',
            hideColumnShort : 'Hide'
        },

        Filter : {
            applyFilter  : 'Apply filter',
            filter       : 'Filter',
            editFilter   : 'Edit filter',
            on           : 'On',
            before       : 'Before',
            after        : 'After',
            equals       : 'Equals',
            lessThan     : 'Less than',
            moreThan     : 'More than',
            removeFilter : 'Remove filter'
        },

        FilterBar : {
            enableFilterBar  : 'Show filter bar',
            disableFilterBar : 'Hide filter bar'
        },

        Group : {
            groupAscending       : 'Group ascending',
            groupDescending      : 'Group descending',
            groupAscendingShort  : 'Ascending',
            groupDescendingShort : 'Descending',
            stopGrouping         : 'Stop grouping',
            stopGroupingShort    : 'Stop'
        },

        Search : {
            searchForValue : 'Search for value'
        },

        Sort : {
            sortAscending          : 'Sort ascending',
            sortDescending         : 'Sort descending',
            multiSort              : 'Multi sort',
            removeSorter           : 'Remove sorter',
            addSortAscending       : 'Add ascending sorter',
            addSortDescending      : 'Add descending sorter',
            toggleSortAscending    : 'Change to ascending',
            toggleSortDescending   : 'Change to descending',
            sortAscendingShort     : 'Ascending',
            sortDescendingShort    : 'Descending',
            removeSorterShort      : 'Remove',
            addSortAscendingShort  : '+ Ascending',
            addSortDescendingShort : '+ Descending'
        },

        //endregion

        //region Grid

        GridBase : {
            loadFailedMessage  : 'Data loading failed!',
            syncFailedMessage  : 'Data synchronization failed!',
            unspecifiedFailure : 'Unspecified failure',
            unknownFailure     : 'Unknown error',
            networkFailure     : 'Network error',
            parseFailure       : 'Failed to parse server response',
            loadMask           : 'Loading...',
            syncMask           : 'Saving changes, please wait...',
            noRows             : 'No records to display',
            removeRow          : 'Delete record',
            removeRows         : 'Delete records',
            moveColumnLeft     : 'Move to left section',
            moveColumnRight    : 'Move to right section'
        },

        //endregion

        //region Export

        PdfExport : {
            'Waiting for response from server' : 'Odotetaan vastausta palvelimelta...',
            'Export failed'                    : 'Vienti epäonnistui',
            'Server error'                     : 'Palvelinvirhe',
            'Generating pages'                 : 'Sivujen luominen...'
        },

        ExportDialog : {
            width          : '40em',
            labelWidth     : '12em',
            exportSettings : 'Vie asetukset',
            export         : 'Viedä',
            exporterType   : 'Hallitse sivutusta',
            cancel         : 'Peruuttaa',
            fileFormat     : 'Tiedosto muoto',
            rows           : 'Riviä',
            alignRows      : 'Kohdista rivit',
            columns        : 'Pylväät',
            paperFormat    : 'Paperimuoto',
            orientation    : 'Suuntautuminen',
            repeatHeader   : 'Toista otsikko'
        },

        ExportRowsCombo : {
            all     : 'Kaikki rivit',
            visible : 'Näkyvät rivit'
        },

        ExportOrientationCombo : {
            portrait  : 'Muotokuva',
            landscape : 'Maisema'
        },

        SinglePageExporter : {
            singlepage : 'Yksi sivu'
        },

        MultiPageExporter : {
            multipage     : 'Useita sivuja',
            exportingPage : ({ currentPage, totalPages }) => `Sivun vieminen ${currentPage}/${totalPages}`
        },

        MultiPageVerticalExporter : {
            multipagevertical : 'Useita sivuja (pystysuora)',
            exportingPage : ({ currentPage, totalPages }) => `Sivun vieminen ${currentPage}/${totalPages}`
        }

        //endregion
    });

export default locale;
//</umd>

LocaleManager.registerLocale('Fi', { desc : 'Soumi', locale : locale });
