import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Core/localization/En.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Features

        ColumnPicker : {
            column          : 'Column',
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
            group                : 'Group',
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
            sort                   : 'Sort',
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
            moveColumnLeft     : 'Move to left section',
            moveColumnRight    : 'Move to right section',
            removeRow          : 'Delete record',
            removeRows         : 'Delete records',
            moveColumnTo       : region => `Move column to ${region}`
        },

        //endregion

        //region Export

        PdfExport : {
            'Waiting for response from server' : 'Waiting for response from server...',
            'Export failed'                    : 'Export failed',
            'Server error'                     : 'Server error',
            'Generating pages'                 : 'Generating pages...'
        },

        ExportDialog : {
            width          : '40em',
            labelWidth     : '12em',
            exportSettings : 'Export settings',
            export         : 'Export',
            exporterType   : 'Control pagination',
            cancel         : 'Cancel',
            fileFormat     : 'File format',
            rows           : 'Rows',
            alignRows      : 'Align rows',
            columns        : 'Columns',
            paperFormat    : 'Paper format',
            orientation    : 'Orientation',
            repeatHeader   : 'Repeat header'
        },

        ExportRowsCombo : {
            all     : 'All rows',
            visible : 'Visible rows'
        },

        ExportOrientationCombo : {
            portrait  : 'Portrait',
            landscape : 'Landscape'
        },

        SinglePageExporter : {
            singlepage : 'Single page'
        },

        MultiPageExporter : {
            multipage     : 'Multiple pages',
            exportingPage : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
        },

        MultiPageVerticalExporter : {
            multipagevertical : 'Multiple pages (vertical)',
            exportingPage     : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
        }

        //endregion
    });

export default locale;
//</umd>

LocaleManager.registerLocale('En', { desc : 'English', locale : locale });
