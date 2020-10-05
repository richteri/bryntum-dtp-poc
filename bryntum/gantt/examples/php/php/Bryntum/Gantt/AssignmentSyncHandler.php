<?php

namespace Bryntum\Gantt;

class AssignmentSyncHandler extends \Bryntum\CRUD\SyncHandler
{

    private $gantt;

    public function __construct(&$gantt)
    {
        $this->gantt = &$gantt;
    }

    protected function prepareData(&$data)
    {
        // initialize returning hash
        $result = array();

        $taskIds = $this->gantt->phantomIdMap['tasks'];
        // get newly created task Id if this is a reference to a phantom task
        if (isset($taskIds[@$data['event']])) {
            // use & return actual Id
            $data['event'] = $result['event'] = $taskIds[$data['event']];
        }

        $resourceIds = $this->gantt->phantomIdMap['resources'];
        // get newly created resource Id if this is a reference to a phantom resource
        if (isset($resourceIds[@$data['resource']])) {
            // use & return actual Id
            $data['resource'] = $result['resource'] = $resourceIds[$data['resource']];
        }

        return $result;
    }

    public function add(&$assignment)
    {
        $response = $this->prepareData($assignment);
        $this->gantt->saveAssignment($assignment);
        return $response;
    }

    public function update(&$assignment)
    {
        $response = $this->prepareData($assignment);
        $this->gantt->saveAssignment($assignment);
        return $response;
    }

    public function remove($assignment)
    {
        $response = [];
        $this->gantt->removeAssignment($assignment['id']);
        return $response;
    }
}
