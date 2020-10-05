<?php

namespace Bryntum\CRUD;

define(__NAMESPACE__.'\ALL_ROWS', 0);
define(__NAMESPACE__.'\ADDED_ROWS', 1);
define(__NAMESPACE__.'\UPDATED_ROWS', 2);
define(__NAMESPACE__.'\ADDED_AND_UPDATED_ROWS', 3);
define(__NAMESPACE__.'\REMOVED_ROWS', 4);
define(__NAMESPACE__.'\META_DATA', 5);

abstract class SyncHandler
{

    protected $phantomIdField = '$PhantomId';
    protected $idField = 'id';

    public function __construct($phantomIdField = null, $idField = null)
    {
        if ($phantomIdField) {
            $this->phantomIdField = $phantomIdField;
        }
        if ($idField) {
            $this->idField = $idField;
        }
    }

    abstract public function add(&$record);

    abstract public function update(&$record);

    abstract public function remove($record);

    protected function onRecordAdded($record, &$recordResponse, $phantomId)
    {
        $recordResponse[$this->phantomIdField] = $phantomId;
        $recordResponse[$this->idField] = @$record[$this->idField];

        return $recordResponse;
    }

    protected function onRecordUpdated($record, &$recordResponse)
    {
        $recordResponse[$this->idField] = $record[$this->idField];

        return $recordResponse;
    }

    protected function onRecordRemoved($record, &$recordResponse)
    {
        $recordResponse[$this->idField] = $record[$this->idField];

        return $recordResponse;
    }

    protected function onAddedHandled(&$response)
    {
        return $response;
    }

    protected function onUpdatedHandled(&$response)
    {
        return $response;
    }

    protected function onRemovedHandled(&$response)
    {
        return $response;
    }

    protected function onHandled(&$response)
    {
        return $response;
    }

    protected function applyMetaData($mataData, $request, &$response)
    {
    }

    public function handleMetaData($request, &$response)
    {
        if (isset($request['metaData'])) {
            $this->applyMetaData($request['metaData'], $request, $response);
        }

        return $response;
    }

    public function handleAdded($request, &$response)
    {
        $added = [];

        if (isset($request['added'])) {
            foreach ($request['added'] as $row) {
                $phantomId = $row[$this->phantomIdField];
                unset($row[$this->phantomIdField]);

                $r = $this->add($row);

                $added[] = $this->onRecordAdded($row, $r, $phantomId);
            }
        }

        if (!$response) {
            $response = array();
        }

        if (sizeof($added)) {
            $response['rows'] = @$response['rows'] ? array_merge((Array)$response['rows'], (Array)$added) : $added;
        }

        return $this->onAddedHandled($response);
    }

    public function handleUpdated($request, &$response)
    {
        $updated = [];

        if (isset($request['updated'])) {
            foreach ($request['updated'] as $row) {
                $r = $this->update($row);
                $updated[] = $this->onRecordUpdated($row, $r);
            }
        }

        if (!$response) {
            $response = array();
        }

        if (sizeof($updated)) {
            $response['rows'] = @$response['rows'] ? array_merge((Array)$response['rows'], (Array)$updated) : $updated;
        }

        return $this->onUpdatedHandled($response);
    }

    public function handleRemoved($request, &$response)
    {
        $removed = [];

        if (isset($request['removed'])) {
            foreach ($request['removed'] as $row) {
                $r = $this->remove($row);
                $removed[] = $this->onRecordRemoved($row, $r);
            }
        }

        if (!$response) {
            $response = array();
        }

        if (sizeof($removed)) {
            $response['removed'] = @$response['removed'] ? array_merge((Array)$response['removed'], (Array)$removed) : $removed;
        }

        return $this->onRemovedHandled($response);
    }

    public function handle($request, $mode = ALL_ROWS)
    {
        $res = array();

        if ($mode == ALL_ROWS || $mode == META_DATA) {
            $this->handleMetaData($request, $res);
        }

        if ($mode == ALL_ROWS || $mode == ADDED_ROWS || $mode == ADDED_AND_UPDATED_ROWS) {
            $this->handleAdded($request, $res);
        }
        if ($mode == ALL_ROWS || $mode == UPDATED_ROWS || $mode == ADDED_AND_UPDATED_ROWS) {
            $this->handleUpdated($request, $res);
        }
        if ($mode == ALL_ROWS || $mode == REMOVED_ROWS) {
            $this->handleRemoved($request, $res);
        }

        if ($mode == ALL_ROWS) {
            if (@!$res['rows'] && @!$res['removed']) {
                throw new \Exception('No data to save.', E_APP_NO_SYNC_DATA);
            }
        }

        return $this->onHandled($res);
    }
}
