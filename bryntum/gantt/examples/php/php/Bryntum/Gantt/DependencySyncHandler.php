<?php

namespace Bryntum\Gantt;

class DependencySyncHandler extends \Bryntum\CRUD\SyncHandler
{

    private $gantt;

    public function __construct(&$gantt)
    {
        $this->gantt = &$gantt;
    }

    protected function prepareData(&$data)
    {
        // initialize response part related to the record
        $response = array();

        $taskIds = $this->gantt->phantomIdMap['tasks'];

        if (isset($data['type'])) {
            $data['typ'] = $data['type'];
            unset($data['type']);
        }

        // get newly created task Ids if these are references to phantom tasks
        if (isset($data['fromEvent']) && isset($taskIds[$data['fromEvent']])) {
            // use & return actual Id
            $data['fromEvent'] = $response['fromEvent'] = $taskIds[$data['fromEvent']];
        }

        if (isset($data['toEvent']) && isset($taskIds[$data['toEvent']])) {
            // use & return actual Id
            $data['toEvent'] = $response['toEvent'] = $taskIds[$data['toEvent']];
        }

        return $response;
    }

    public function add(&$dependency)
    {
        $response = $this->prepareData($dependency);
        $this->gantt->saveDependency($dependency);
        return $response;
    }

    public function update(&$dependency)
    {
        $response = $this->prepareData($dependency);
        $this->gantt->saveDependency($dependency);
        return $response;
    }

    public function remove($dependency)
    {
        $response = [];
        $this->gantt->removeDependency($dependency['id']);
        return $response;
    }
}
