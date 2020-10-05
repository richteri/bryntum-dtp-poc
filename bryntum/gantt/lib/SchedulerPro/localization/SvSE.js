import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/SvSE.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        SchedulerProCommon : {
            SS                  : 'SS',
            SF                  : 'SA',
            FS                  : 'AS',
            FF                  : 'AA',
            dependencyTypesLong : [
                'Start-Till-Start',
                'Start-Till-Avslut',
                'Avslut-Till-Start',
                'Avslut-Till-Avslut'
            ]
        },

        ConstraintTypePicker : {
            none                : 'Ingen',
            muststarton         : 'Måste starta',
            mustfinishon        : 'Måste avslutas',
            startnoearlierthan  : 'Starta tidigast',
            startnolaterthan    : 'Starta senast',
            finishnoearlierthan : 'Avsluta tidigast',
            finishnolaterthan   : 'Avsluta senast'
        },

        CalendarField : {
            'Default calendar' : 'Standardkalender'
        },

        ProTaskEdit : {
            'Edit event' : 'Redigera händelse'
        },

        TaskEditorBase : {
            editorWidth : '45em',
            Information : 'Information',
            Save        : 'Spara',
            Cancel      : 'Avbryt',
            Delete      : 'Ta bort',
            saveError   : 'Kan inte spara, vänligen korrigera fel först'
        },

        SchedulerGeneralTab : {
            labelWidth           : '11.0em',
            General              : 'Allmänt',
            Name                 : 'Namn',
            '% complete'         : '% Färdig',
            Duration             : 'Varaktighet',
            Start                : 'Start',
            Finish               : 'Slut',
            Dates                : 'Datum',
            'Manually scheduled' : 'Manuellt planerad',
            Calendar             : 'Kalender'
        },

        GeneralTab : {
            labelWidth   : '8em',
            General      : 'Allmänt',
            Name         : 'Namn',
            '% complete' : '% Färdig',
            Duration     : 'Varaktighet',
            Start        : 'Start',
            Finish       : 'Slut',
            Effort       : 'Arbetsinsats',
            Dates        : 'Datum'
        },

        AdvancedTab : {
            labelWidth           : '11em',
            Advanced             : 'Avancerat',
            Calendar             : 'Kalender',
            'Scheduling mode'    : 'Aktivitetstyp',
            'Effort driven'      : 'Insatsdriven',
            'Manually scheduled' : 'Manuellt planerad',
            'Constraint type'    : 'Villkorstyp',
            'Constraint date'    : 'Måldatum',
            Constraint           : 'Villkor',
            Rollup               : 'Upplyft'
        },

        DependencyTab : {
            Predecessors                          : 'Föregångare',
            Successors                            : 'Efterföljare',
            ID                                    : 'ID',
            Name                                  : 'Namn',
            Type                                  : 'Typ',
            Lag                                   : 'Fördröjning',
            'Cyclic dependency has been detected' : 'Cycliskt beroende',
            'Invalid dependency'                  : 'Ogiltigt beroende'
        },

        ResourcesTab : {
            unitsTpl  : ({ value }) => `${value}%`,
            Resources : 'Resurser',
            Resource  : 'Resurs',
            Units     : 'Enheter'
        },

        NotesTab : {
            Notes : 'Anteckning'
        },

        SchedulingModePicker : {
            Normal           : 'Normal',
            'Fixed Duration' : 'Fast varaktighet',
            'Fixed Units'    : 'Fasta enheter',
            'Fixed Effort'   : 'Fast arbete'
        },

        DurationColumn : {
            Duration : 'Varaktighet'
        }
    });

export default locale;
//</umd>

LocaleManager.registerLocale('SvSE', { desc : 'Svenska', locale : locale });
