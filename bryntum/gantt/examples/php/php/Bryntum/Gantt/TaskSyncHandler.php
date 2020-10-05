<?php

namespace Bryntum\Gantt;

class TaskSyncHandler extends \Bryntum\CRUD\SyncHandler
{
    private $gantt;

    public function __construct(&$gantt)
    {
        $this->gantt = &$gantt;
        $this->phantomIdMap = &$gantt->phantomIdMap['tasks'];
    }

    protected static function prepareDateForDB($value)
    {
        // Input example: "2017-05-22T10:37:12"
        // Replace "T" in the date string w/ " " to match the format we use further
        $value = str_replace('T', ' ', $value);
        // Convert the date string passed from the client timezone to the server one
        // if the timezone is passed, like this for example: "2017-05-22 10:37:12+06:00".
        return date('Y-m-d H:i:s', strtotime($value));
    }

    protected function prepareTask(&$data)
    {
        // initialize returning hash
        $result = array();

        // Process datetime fields (turns field values to server timezone)

        if (isset($data['constraintDate'])) {
            $data['constraintDate'] = self::prepareDateForDB($data['constraintDate']);
        }

        if (isset($data['startDate'])) {
            $data['startDate'] = self::prepareDateForDB($data['startDate']);
        }

        if (isset($data['endDate'])) {
            $data['endDate'] = self::prepareDateForDB($data['endDate']);
        }

        if (isset($data['deadline'])) {
            $data['deadline'] = self::prepareDateForDB($data['deadline']);
        }

        if (isset($data['duration'])) {
            $data['duration'] = floatval($data['duration']);
        }

        if (isset($data['effort'])) {
            $data['effort'] = floatval($data['effort']);
        }

        if (isset($data['parentIndex'])) {
            $data['parentIndex'] = intval($data['parentIndex']);
        }

        if (isset($data['expanded'])) {
            $data['expanded'] = intval($data['expanded']);
        }

        if (isset($data['manuallyScheduled'])) {
            $data['manuallyScheduled'] = intval($data['manuallyScheduled']);
        }

        if (isset($data['effortDriven'])) {
            $data['effortDriven'] = intval($data['effortDriven']);
        }

        if (isset($data['parentId']) && (strtolower($data['parentId']) == 'root')) {
            $data['parentId'] = null;
        }

        // get newly created task Id if this is a reference to a phantom parent task
        if (isset($this->phantomIdMap[@$data['phantomParentId']])) {
            // use & return actual Id
            $data['parentId'] = $result['parentId'] = $this->phantomIdMap[$data['phantomParentId']];
        }

        $phantomCals = &$this->gantt->phantomIdMap['calendars'];
        // get newly created calendar Id if this is a reference to a phantom parent task
        if (isset($phantomCals[@$data['calendar']])) {
            // use & return actual Id
            $data['calendar'] = $result['calendar'] = $phantomCals[$data['calendar']];
        }

        if (isset($data['calendar'])) {
            $data['calendar'] = $data['calendar'] ? intval($data['calendar']) : null;
        }

        return $result;
    }

    public function add(&$task)
    {
        $response = $this->prepareTask($task);
        $this->gantt->saveTask($task);
        return $response;
    }

    public function update(&$task)
    {
        $response = $this->prepareTask($task);
        $this->gantt->saveTask($task);
        return $response;
    }

    public function remove($task)
    {
        $response = [];
        $this->gantt->removeTask($task['id']);
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
