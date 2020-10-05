<?php

# TODO: not implemented yet

namespace Bryntum\Gantt;

class CalendarIntervalSyncHandler extends \Bryntum\CRUD\SyncHandler
{

    private $gantt;
    private $calendarId;

    public function __construct(&$gantt)
    {
        $this->gantt = &$gantt;
    }

    public function setCalendarId($calendarId)
    {
        $this->calendarId = $calendarId;
    }

    public function prepareData(&$data)
    {
        $response = [];

        // `recurrentStartDate` varchar(255) DEFAULT NULL,
        // `recurrentEndDate` varchar(255) DEFAULT NULL,
        // `isWorking` tinyint(4) DEFAULT '0',

        if (isset($data['isWorking'])) {
            $data['isWorking'] = intval($data['isWorking']);
        }

        if ($this->calendarId) {
            $data['calendar'] = $this->calendarId;
        }

        $phantomIdMap = &$this->gantt->phantomIdMap['calendars'];
        if (isset($phantomIdMap[$data['calendar']])) {
            // use & return actual Id
            $data['calendar'] = $response['calendar'] = $phantomIdMap[$data['calendar']];
        }

        return $response;
    }

    public function add(&$calendarInterval)
    {
        $response = $this->prepareData($calendarInterval);
        $this->gantt->saveCalendarInterval($calendarInterval);
        return $response;
    }

    public function update(&$calendarInterval)
    {
        $response = $this->prepareData($calendarInterval);
        $this->gantt->saveCalendarInterval($calendarInterval);
        return $response;
    }

    public function remove($calendarInterval)
    {
        $response = [];
        $this->gantt->removeCalendarIntervals(['id' => $calendarInterval['id']]);
        return $response;
    }
}
