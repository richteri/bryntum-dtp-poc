# Calendars

Bryntum Gantt has a powerful calendar system which defines when work on tasks can be performed.

The calendar implementation is very performant, even for a big number of calendars.
This is achieved by using extensive caching of all data and using fast internal data structures.

Calendars can be assigned to a project as well as tasks and resources. By default, if a task or resource has no explicitly
assigned calendar, it uses the calendar of the project. The default calendar of the project (which is used
if not configured explicitly) uses 24/7/365 availability.

Calendars are organized in a tree store (see below for "parent calendars"), which is called
[calendar manager store](#Gantt/data/CalendarManagerStore). It is available as the
[calendarManagerStore](#Gantt/model/ProjectModel#property-calendarManagerStore) property of the project.

Individual calendars are represented by the [CalendarModel](#Gantt/model/CalendarModel) class.

## Duration conversion

Duration conversion happens when we change [duration unit](#Gantt/model/TaskModel#field-durationUnit) of a task.
The Gantt chart then needs to calculate for example, the duration of a one day task in hours.

Every duration unit has a configurable value in milliseconds, and conversions between the units are done by
first converting the duration into milliseconds and then into the desired unit.

The properties of the calendar model that configures this behavior are:

* [hoursPerDay](#Gantt/model/CalendarModel#field-hoursPerDay), default value is 24.
* [daysPerWeek](#Gantt/model/CalendarModel#field-daysPerWeek), default value is 7.
* [daysPerMonth](#Gantt/model/CalendarModel#field-daysPerMonth), default value is 30.

**IMPORTANT**: All calendars use the settings from the project calendar for duration conversion. It is recommended 
to always explicitly assign a calendar with desired conversion rules to the project.

## Availability intervals

Internally, a calendar consists of a collection of [availability intervals](#Gantt/model/CalendarIntervalModel).
The intervals have an [isWorking](#Gantt/model/CalendarIntervalModel#field-isWorking) field, which defines
whether it represents a working time period (`true` value, is default) or non-working (a holiday or other day off, `false` value).

The interval is either static, like `2019/05/01 - 2019/05/02` or recurrent (repeating in time) - `every year 05/01 - every year 05/02`.

A static interval should have [startDate](#Gantt/model/CalendarIntervalModel#field-startDate) and
[endDate](#Gantt/model/CalendarIntervalModel#field-endDate) values provided. A recurrent interval should fill the
[recurrentStartDate](#Gantt/model/CalendarIntervalModel#field-recurrentStartDate) and
[recurrentEndDate](#Gantt/model/CalendarIntervalModel#field-recurrentEndDate) fields. It is not valid to have all 4 fields filled
(and behavior is not defined for such case).

The value of the [recurrentStartDate](#Gantt/model/CalendarIntervalModel#field-recurrentStartDate) / [recurrentEndDate](#Gantt/model/CalendarIntervalModel#field-recurrentEndDate)
fields should be specified in the format defined by the excellent library for recurrent events: [later](http://bunkat.github.io/later/).
Please refer to its [documentation](http://bunkat.github.io/later/parsers.html#overview) on details.

The working status of a timespan, which does not belong to any availability interval, is defined with the
[unspecifiedTimeIsWorking](#Gantt/model/CalendarModel#field-unspecifiedTimeIsWorking) field of the calendar.


## Parent calendars

Calendars are organized in a tree store, and thus a `CalendarModel` has a regular `parent` property inherited from the `TreeNode` mixin.
It denotes a "parent" calendar, from which the current calendar inherits availability intervals. The intervals,
defined in the current calendar overrides the intervals from any parent.

**IMPORTANT**: The `unspecifiedTimeIsWorking` field is not inherited. If you've specified it as `false` in the parent calendar and 
did not specify in the child, it will get the default value of `true` and you might receive unexpected results.

This structure allows very flexible definitions for calendars, from the most common ones at the top of
the hierarchy to more specific at the bottom. A more specific calendar will only need to define data that is different from its parent.

## Assigning a calendar through the API

To set the calendar of an entity using the data API, use the `setCalendar` method. It is available on the
[ProjectModel](#Gantt/model/ProjectModel#function-setCalendar), [TaskModel]((#Gantt/model/TaskModel#function-setCalendar)) and
[ResourceModel](#Gantt/model/ResourceModel#function-setCalendar).

This method will trigger a schedule change propagation and returns a `Promise`.


## Assigning a calendar through the UI

To give user the ability to change the calendar of the task using the UI, you can use a [CalendarColumn](#Gantt/column/CalendarColumn)

<img src="resources/images/calendarcolumn.png" style="max-width : 300px" alt="Calendar column">

Also the `TaskEditor` has a field for changing the calendar on the "Advanced" tab.

<img src="resources/images/calendarfield.png" style="max-width : 500px" alt="Calendar field">
