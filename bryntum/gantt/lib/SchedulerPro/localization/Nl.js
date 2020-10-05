import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/Nl.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        SchedulerProCommon : {
            SS                  : 'GB',
            SF                  : 'BE',
            FS                  : 'EB',
            FF                  : 'GE',
            dependencyTypesLong : [
                'Gelijk-Begin',
                'Begin-na-Einde',
                'Einde-na-Begin',
                'Gelijk-Einde'
            ]
        },

        ConstraintTypePicker : {
            none                : 'Geen',
            muststarton         : 'Niet eerder eindigen dan',
            mustfinishon        : 'Niet later eindigen dan',
            startnoearlierthan  : 'Moet beginnen op',
            startnolaterthan    : 'Moet eindigen op',
            finishnoearlierthan : 'Niet eerder beginnen dan',
            finishnolaterthan   : 'Niet later beginnen dan'
        },

        CalendarField : {
            'Default calendar' : 'Standaardkalender'
        },

        ProTaskEdit : {
            'Edit event' : 'Evenement bewerken'
        },

        TaskEditorBase : {
            editorWidth : '55em',
            Information : 'Informatie',
            Save        : 'Opslaan',
            Cancel      : 'Annuleer',
            Delete      : 'Verwijder',
            saveError   : 'Kan niet opslaan. Corrigeer eerst de fouten'
        },

        SchedulerGeneralTab : {
            labelWidth           : '12em',
            General              : 'Algemeen',
            Name                 : 'Naam',
            '% complete'         : '% compleet',
            Duration             : 'Duur',
            Start                : 'Begin',
            Finish               : 'Einde',
            Dates                : 'Datums',
            'Manually scheduled' : 'Handmatig',
            Calendar             : 'Kalender'
        },

        GeneralTab : {
            labelWidth   : '6em',
            General      : 'Algemeen',
            Name         : 'Naam',
            '% complete' : '% compleet',
            Duration     : 'Duur',
            Start        : 'Begin',
            Finish       : 'Einde',
            Effort       : 'Inspanning',
            Dates        : 'Datums'
        },

        AdvancedTab : {
            labelWidth           : '12em',
            Advanced             : 'Geavanceerd',
            Calendar             : 'Kalender',
            'Scheduling mode'    : 'Taaktype',
            'Effort driven'      : 'Op inspanning',
            'Manually scheduled' : 'Handmatig',
            'Constraint type'    : 'Beperkingstype',
            'Constraint date'    : 'Beperkingsdatum',
            Constraint           : 'Beperking',
            Rollup               : 'Samenvouwen'
        },

        DependencyTab : {
            Predecessors                          : 'Voorafgaande taken',
            Successors                            : 'Opvolgende taken',
            ID                                    : 'ID',
            Name                                  : 'Naam',
            Type                                  : 'Type',
            Lag                                   : 'Vertraging',
            'Cyclic dependency has been detected' : 'Cyclische afhankelijkheid',
            'Invalid dependency'                  : 'Ongeldige afhankelijkheid'
        },

        ResourcesTab : {
            unitsTpl  : ({ value }) => `${value}%`,
            Resources : 'Middelen',
            Resource  : 'Hulpbron',
            Units     : 'Eenheden'
        },

        NotesTab : {
            Notes : 'Notities'
        },

        SchedulingModePicker : {
            Normal           : 'Normaal',
            'Fixed Duration' : 'Vaste duur',
            'Fixed Units'    : 'Vaste eenheden',
            'Fixed Effort'   : 'Vast werk'
        },

        DurationColumn : {
            Duration : 'Duur'
        }

    });

export default locale;
//</umd>

LocaleManager.registerLocale('Nl', { desc : 'Nederlands', locale : locale });
