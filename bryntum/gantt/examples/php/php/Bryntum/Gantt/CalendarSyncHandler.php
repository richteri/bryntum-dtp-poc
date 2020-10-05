<?php

namespace Bryntum\Gantt;

class CalendarSyncHandler extends \Bryntum\CRUD\SyncHandler
{
    private $gantt;
    private $calendarIntervalHandler;

    public function __construct(&$gantt)
    {
        $this->gantt = &$gantt;
        $this->phantomIdMap = &$gantt->phantomIdMap['calendars'];

        // $this->calendarIntervalHandler = new CalendarIntervalSyncHandler($gantt);
    }

    protected function prepareData(&$data)
    {
        // initialize record related response part
        $response = [];

        if (isset($data['parentId'])) {
            if (strtolower($data['parentId']) == 'root') {
                $data['parentId'] = null;
            }

            if (isset($this->phantomIdMap[$data['parentId']])) {
                // use & return actual Id
                $data['parentId'] = $response['parentId'] = $this->phantomIdMap[$data['parentId']];
            }
        }

        return $response;
    }

    public function add(&$calendar)
    {
        $response = $this->prepareData($calendar);
        $this->gantt->saveCalendar($calendar);

        // TODO: save intervals
        // if (@$calendar['intervals']) {
        //     $this->calendarIntervalHandler->setCalendarId($calendar['id']);
        //     $response['intervals'] = $this->calendarIntervalHandler->handle($calendar['intervals']);
        // }

        return $response;
    }

    public function update(&$calendar)
    {
        $response = $this->prepareData($calendar);
        $this->gantt->saveCalendar($calendar);

        // TODO: save intervals
        // if (@$calendar['intervals']) {
        //     $this->calendarIntervalHandler->setCalendarId($calendar['id']);
        //     $response['intervals'] = $this->calendarIntervalHandler->handle($calendar['intervals']);
        // }

        return $response;
    }

    public function remove($calendar)
    {
        $response = [];
        $this->gantt->removeCalendar($calendar['id']);
        return $response;
    }

    protected function onRecordAdded($record, &$recordResponse, $phantomId)
    {
        parent::onRecordAdded($record, $recordResponse, $phantomId);

        // let's keep phantom Id to real Id mapping
        $this->phantomIdMap[$phantomId] = $recordResponse['id'];

        return $recordResponse;
    }
}
