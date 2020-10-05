<?php

namespace Bryntum\Gantt;

class ResourceSyncHandler extends \Bryntum\CRUD\SyncHandler
{

    private $gantt;

    public function __construct(&$gantt)
    {
        $this->gantt = &$gantt;
        $this->phantomIdMap = &$gantt->phantomIdMap['resources'];
    }

    protected function prepareData(&$data)
    {
        $result = array();

        $phantomCals = $this->gantt->phantomIdMap['calendars'];

        // get newly created calendar Id if this is a reference to a phantom parent task
        if (isset($phantomCals[@$data['calendar']])) {
            // use & return actual Id
            $data['calendar'] = $result['calendar'] = $phantomCals[$data['calendar']];
            $result['calendar'] = intval($result['calendar']);
        }

        if (isset($data['calendar'])) {
            $data['calendar'] = $data['calendar'] ? intval($data['calendar']) : null;
        }

        if (@!$data['id']) {
            unset($data[$this->phantomIdField]);
        }

        return $result;
    }

    public function add(&$resource)
    {
        $response = $this->prepareData($resource);
        $this->gantt->saveResource($resource);
        return $response;
    }

    public function update(&$resource)
    {
        $response = $this->prepareData($resource);
        $this->gantt->saveResource($resource);
        return $response;
    }

    public function remove($resource)
    {
        $response = [];
        $this->gantt->removeResource($resource['id']);
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
