<?php

use Bryntum\CRUD;
use Bryntum\Gantt;

try {
    // initialize application
    include 'init.php';

    // decode request object
    $request = json_decode(file_get_contents('php://input'), true);

    $response = [
        'success'   => false,
        'requestId' => $request['requestId']
    ];

    $app->db->beginTransaction();

    // Here we reject client's changes if we suspect that they are outdated
    // considering difference between server and client revisions.
    // You can get rid of this call if you don't need such behavior.
    $app->checkRevision($request['revision']);

    // if a corresponding store modified data are provided then we handle them

    // first let's process added and updated records

    $calendarHandler = $resourceHandler = $taskHandler = $assignmentHandler = $dependencyHandler = null;

    // if we have calendars to sync
    if (isset($request['calendars'])) {
        $calendarHandler = new Gantt\CalendarSyncHandler($app);
        $response['calendars'] = $calendarHandler->handle($request['calendars'], CRUD\ADDED_AND_UPDATED_ROWS);
    }

    // if we have resources to sync
    if (isset($request['resources'])) {
        $resourceHandler = new Gantt\ResourceSyncHandler($app);
        $response['resources'] = $resourceHandler->handle($request['resources'], CRUD\ADDED_AND_UPDATED_ROWS);
    }
    // if we have tasks to sync
    if (isset($request['tasks'])) {
        $taskHandler = new Gantt\TaskSyncHandler($app);
        $response['tasks'] = $taskHandler->handle($request['tasks'], CRUD\ADDED_AND_UPDATED_ROWS);
    }

    // if we have assignments to sync
    if (isset($request['assignments'])) {
        $assignmentHandler = new Gantt\AssignmentSyncHandler($app);
        $response['assignments'] = $assignmentHandler->handle($request['assignments'], CRUD\ADDED_AND_UPDATED_ROWS);
    }

    // if we have dependencies to sync
    if (isset($request['dependencies'])) {
        $dependencyHandler = new Gantt\DependencySyncHandler($app);
        $response['dependencies'] = $dependencyHandler->handle($request['dependencies'], CRUD\ADDED_AND_UPDATED_ROWS);
    }

    // then let's process records removals

    if ($dependencyHandler) {
        $response['dependencies'] = $dependencyHandler->handleRemoved($request['dependencies'], $response['dependencies']);
    }

    if ($assignmentHandler) {
        $response['assignments'] = $assignmentHandler->handleRemoved($request['assignments'], $response['assignments']);
    }

    if ($taskHandler) {
        $response['tasks'] = $taskHandler->handleRemoved($request['tasks'], $response['tasks']);
    }

    if ($resourceHandler) {
        $response['resources'] = $resourceHandler->handleRemoved($request['resources'], $response['resources']);
    }

    if ($calendarHandler) {
        $response['calendars'] = $calendarHandler->handleRemoved($request['calendars'], $response['calendars']);
    }


    // we also return implicit modifications made by server
    // (implicit records updates/removals caused by data references)

    // helper function to apply those "implicit" records to response
    function addModifiedRows($gantt, $table, &$resp)
    {
        if (@$gantt->updatedRows[$table]) {
            if (!isset($resp[$table])) {
                $resp[$table] = array();
            }
            $rows = array_values($gantt->updatedRows[$table]);
            $resp[$table]['rows'] = @$resp[$table]['rows'] ? array_merge((array)$resp[$table]['rows'], $rows) : $rows;
        }

        if (@$gantt->removedRows[$table]) {
            if (!isset($resp[$table])) {
                $resp[$table] = array();
            }
            $removed = array_values($gantt->removedRows[$table]);
            $resp[$table]['removed'] = @$resp[$table]['removed'] ? array_merge((array)$resp[$table]['removed'], $removed) : $removed;
        }
    }

    addModifiedRows($app, 'calendars', $response);
    addModifiedRows($app, 'tasks', $response);
    addModifiedRows($app, 'resources', $response);
    addModifiedRows($app, 'assignments', $response);
    addModifiedRows($app, 'dependencies', $response);

    $app->db->commit();

    $response['success'] = true;
    // return updated server revision mark
    $response['revision'] = $app->getRevision();

    die(json_encode($response));

// handle exceptions gracefully
} catch (Exception $e) {
    $app->db->rollback();

    $response['success'] = false;
    $response['message'] = $e->getMessage();
    $response['code'] = $e->getCode();
    die(json_encode($response));
}
