<?php
namespace Bryntum\Gantt;

use Exception;
use PDO;

define(__NAMESPACE__ . '\E_APP_UPDATE_TASK', 100);
define(__NAMESPACE__ . '\E_APP_ADD_TASK', 101);
define(__NAMESPACE__ . '\E_APP_REMOVE_TASK', 102);
define(__NAMESPACE__ . '\E_APP_GET_TASKS', 104);
define(__NAMESPACE__ . '\E_APP_TASK_NOT_FOUND', 105);
define(__NAMESPACE__ . '\E_APP_GET_CALENDAR_INTERVALS', 110);
define(__NAMESPACE__ . '\E_APP_UPDATE_CALENDAR_INTERVAL', 111);
define(__NAMESPACE__ . '\E_APP_ADD_CALENDAR_INTERVAL', 112);
define(__NAMESPACE__ . '\E_APP_REMOVE_CALENDAR_INTERVAL', 113);
define(__NAMESPACE__ . '\E_APP_CALENDAR_INTERVAL_NOT_FOUND', 114);
define(__NAMESPACE__ . '\E_APP_GET_CALENDARS', 120);
define(__NAMESPACE__ . '\E_APP_UPDATE_CALENDAR', 121);
define(__NAMESPACE__ . '\E_APP_ADD_CALENDAR', 122);
define(__NAMESPACE__ . '\E_APP_REMOVE_CALENDAR', 123);
define(__NAMESPACE__ . '\E_APP_CALENDAR_NOT_FOUND', 124);
define(__NAMESPACE__ . '\E_APP_CALENDAR_HAS_CALENDARS', 125);
define(__NAMESPACE__ . '\E_APP_CALENDAR_USED_BY_RESOURCE', 126);
define(__NAMESPACE__ . '\E_APP_CALENDAR_USED_BY_TASK', 127);
define(__NAMESPACE__ . '\E_APP_UPDATE_RESOURCE', 130);
define(__NAMESPACE__ . '\E_APP_ADD_RESOURCE', 131);
define(__NAMESPACE__ . '\E_APP_REMOVE_RESOURCE', 132);
define(__NAMESPACE__ . '\E_APP_GET_RESOURCES', 133);
define(__NAMESPACE__ . '\E_APP_RESOURCE_NOT_FOUND', 134);
define(__NAMESPACE__ . '\E_APP_REMOVE_USED_RESOURCE', 135);
define(__NAMESPACE__ . '\E_APP_UPDATE_ASSIGNMENT', 140);
define(__NAMESPACE__ . '\E_APP_ADD_ASSIGNMENT', 141);
define(__NAMESPACE__ . '\E_APP_REMOVE_ASSIGNMENT', 142);
define(__NAMESPACE__ . '\E_APP_GET_ASSIGNMENTS', 143);
define(__NAMESPACE__ . '\E_APP_ASSIGNMENT_NOT_FOUND', 144);
define(__NAMESPACE__ . '\E_APP_UPDATE_DEPENDENCY', 150);
define(__NAMESPACE__ . '\E_APP_ADD_DEPENDENCY', 151);
define(__NAMESPACE__ . '\E_APP_REMOVE_DEPENDENCY', 152);
define(__NAMESPACE__ . '\E_APP_GET_DEPENDENCIES', 153);
define(__NAMESPACE__ . '\E_APP_DEPENDENCY_NOT_FOUND', 154);
define(__NAMESPACE__ . '\E_APP_UPDATE_TIME_RANGE', 155);
define(__NAMESPACE__ . '\E_APP_ADD_TIME_RANGE', 156);
define(__NAMESPACE__ . '\E_APP_REMOVE_TIME_RANGE', 157);
define(__NAMESPACE__ . '\E_APP_GET_TIME_RANGES', 158);
define(__NAMESPACE__ . '\E_APP_TIME_RANGE_NOT_FOUND', 159);

class Gantt extends \Bryntum\CRUD\BaseDAO
{

    public function __construct($dsn, $dbuser, $dbpwd, $dboptions = null)
    {
        // call parent
        parent::__construct($dsn, $dbuser, $dbpwd, $dboptions);

        $this->initRowsHolders();
    }

    /**
     * Initializes structures to keep mapping between phantom and real Ids
     * and lists of implicitly updated and removed records dictionaries.
     */
    public function initRowsHolders()
    {
        $this->phantomIdMap = [
            'tasks'     => [],
            'calendars' => [],
            'resources' => []
        ];

        $this->updatedRows = [
            'tasks'     => [],
            'calendars' => [],
            'resources' => []
        ];

        $this->removedRows = [
            'tasks'       => [],
            'assignments' => []
        ];
    }

    // Force datetime value to include server timezone info
    public static function applyTimeZoneToDate($value)
    {
        return date('Y-m-d H:i:sP', strtotime($value));
    }

    public function getProjectCalendarId()
    {
        return $this->getOption('projectCalendar');
    }

    public function getProjectStartDate()
    {
        return $this->getOption('projectStartDate');
    }

    /**
     * Creates or updates (depending on provided data) a task record.
     * If $data['id'] is presented in provided data then this method will update corresponding task record otherwise it will create a new task.
     * @param $data array Data to be stored into a task record. It's an array where array keys are task field names.
     */
    public function saveTask(&$data)
    {
        $id = @$data['id'];

        if ($id) {
            if (!$this->getTask($id)) {
                throw new Exception("Cannot find task #$id", E_APP_TASK_NOT_FOUND);
            }

            if (!$this->update('tasks', $data, ['id' => $id], true)) {
                throw new Exception("Cannot update task #$id.", E_APP_UPDATE_TASK);
            }
        } else {
            if (!$this->insert('tasks', $data, true)) {
                throw new Exception('Cannot create task.', E_APP_ADD_TASK);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes task record.
     */
    public function removeTask($id)
    {
        $id       = intval($id);
        $children = $this->getTasks(['parentId' => $id]);

        foreach ((array)$children as $subTask) {
            $this->removeTask($subTask['id']);
        }

        if (!$this->db->query("delete from tasks where id = $id")) {
            throw new Exception($this->getPDOError("Cannot remove task #$id."), E_APP_REMOVE_TASK);
        }

        $this->updateRevision();
    }

    public function getTask($id)
    {
        $tasks = $this->getTasks(['id' => $id]);
        return $tasks ? $tasks[0] : false;
    }

    /**
     * Returns array of tasks.
     */
    public function getTasks($where = null)
    {
        $result   = [];
        $byParent = [];
        $values   = [];

        $cond = $where ? ' where ' . self::buildWhere($where, $values) : '';

        $stmt = $this->db->prepare("select * from tasks $cond order by parentIndex");

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get tasks list.'), E_APP_GET_TASKS);
        }

        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $e['id'] = intval($e['id']);
            if ($e['parentId']) {
                $e['parentId'] = intval($e['parentId']);
            }
            $e['duration']          = $e['duration'] !== null ? floatval($e['duration']) : null;
            $e['percentDone']       = floatval($e['percentDone']);
            $e['parentIndex']       = intval($e['parentIndex']);
            $e['expanded']          = $e['expanded'] == 1;
            $e['effort']            = $e['effort'] !== null ? floatval($e['effort']) : null;
            $e['effortDriven']      = $e['effortDriven'] == 1;
            $e['manuallyScheduled'] = $e['manuallyScheduled'] == 1;

            // Force datetime fields to include server timezone info
            if (@$e['startDate']) {
                $e['startDate'] = self::applyTimeZoneToDate($e['startDate']);
            }
            if (@$e['endDate']) {
                $e['endDate'] = self::applyTimeZoneToDate($e['endDate']);
            }
            if (@$e['constraintDate']) {
                $e['constraintDate'] = self::applyTimeZoneToDate($e['constraintDate']);
            }
            if (@$e['deadline']) {
                $e['deadline'] = self::applyTimeZoneToDate($e['deadline']);
            }

            if (!$where) {
                $parentId = $e['parentId'] ? $e['parentId'] : '';
                if (!isset($byParent[$parentId])) {
                    $byParent[$parentId] = [];
                }

                $byParent[$parentId][] = $e;
            } else {
                $result[] = $e;
            }

            unset($e['parentId']);
        }

        return $where ? $result : self::buildTree($byParent, '');
    }

    public function getCalendarInterval($id)
    {
        $intervals = $this->getCalendarIntervals(['id' => $id]);
        return $intervals ? $intervals[0] : null;
    }

    /**
     * Returns array of intervals for a specific calendar.
     */
    public function getCalendarIntervals($where = null)
    {
        $values = [];
        $cond   = $where ? ' where ' . self::buildWhere($where, $values) : '';
        $stmt   = $this->db->prepare('select * from calendar_intervals ' . $cond);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get calendar intervals list.'), E_APP_GET_CALENDAR_INTERVALS);
        }

        $rows = [];
        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $e['id'] = intval($e['id']);
            // turn to boolean
            $e['isWorking'] = $e['isWorking'] == 1;

            $rows[] = $e;
        }

        return $rows;
    }

    /**
     * Creates/updates calendar interval record.
     */
    public function saveCalendarInterval(&$data)
    {
        $id = @$data['id'];
        if ($id) {
            if (!$this->getCalendarInterval($id)) {
                throw new Exception("Cannot find interval #$id", E_APP_CALENDAR_INTERVAL_NOT_FOUND);
            }

            if (!$this->update('calendar_intervals', $data, ['id' => $id])) {
                throw new Exception("Cannot update calendar interval #$id.", E_APP_UPDATE_CALENDAR_INTERVAL);
            }
        } else {
            if (!$this->insert('calendar_intervals', $data)) {
                throw new Exception('Cannot create calendar interval.', E_APP_ADD_CALENDAR_INTERVAL);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes calendar interval record(s).
     */
    public function removeCalendarIntervals($data)
    {
        $values = [];
        $where  = self::buildWhere($data, $values);
        $sql    = "delete from calendar_intervals $where";
        $stmt   = $this->db->prepare($sql);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError("Cannot remove calendar #$data."), E_APP_REMOVE_CALENDARINTERVALS);
        }

        $this->updateRevision();
    }

    public function getCalendar($id)
    {
        $calendars = $this->getCalendars(['id' => $id]);
        return $calendars ? $calendars[0] : false;
    }

    /**
     * Returns array of calendars.
     */
    public function getCalendars($where = null)
    {
        $result   = [];
        $byParent = [];
        $values   = [];
        $cond     = $where ? ' where ' . self::buildWhere($where, $values) : '';
        $stmt     = $this->db->prepare('select * from calendars ' . $cond);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get calendars list.'), E_APP_GET_CALENDARS);
        }

        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {

            $e['intervals']    = $this->getCalendarIntervals(['calendar' => @$e['id']]);
            $e['daysPerMonth'] = intval($e['daysPerMonth']);
            $e['daysPerWeek']  = intval($e['daysPerWeek']);
            $e['hoursPerDay']  = intval($e['hoursPerDay']);

            if (!$where) {
                $parentId = $e['parentId'] ? $e['parentId'] : '';

                if (!isset($byParent[$parentId])) {
                    $byParent[$parentId] = [];
                }

                $byParent[$parentId][] = $e;
            } else {
                $result[] = $e;
            }
        }

        return $where ? $result : self::buildTree($byParent, '');
    }

    /**
     * Creates/updates calendar record.
     */
    public function saveCalendar(&$data)
    {
        $id = @$data['id'];
        if ($id) {
            if (!$this->getCalendar($id)) {
                throw new Exception("Cannot find calendar #$id", E_APP_CALENDAR_NOT_FOUND);
            }

            if (!$this->update('calendars', $data, ['id' => $id], true)) {
                throw new Exception("Cannot update calendar #$id.", E_APP_UPDATE_CALENDAR);
            }
        } else {
            if (!$this->insert('calendars', $data, true)) {
                throw new Exception('Cannot create calendar.', E_APP_ADD_CALENDAR);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes calendar record.
     */
    public function removeCalendar($id, $force = false)
    {
        $id = intval($id);

        $children  = $this->getCalendars(['parentId' => $id]);
        $resources = $this->getResources(['calendar' => $id]);
        $tasks     = $this->getTasks(['calendar' => $id]);

        if ($force) {
            foreach ((array)$children as $child) {
                $c = ['id' => $child['id'], 'parentId' => null];
                $this->saveCalendar($c);
                // keep implicitly updated record info
                $this->updatedRows['calendars'][$c['id']] = $c;
            }
            foreach ((array)$resources as $resource) {
                $r = ['id' => $resource['id'], 'calendar' => null];
                $this->saveResource($r);
                // keep implicitly updated record info
                $this->updatedRows['resources'][$r['id']] = $r;
            }
            foreach ((array)$tasks as $task) {
                $t = ['id' => $child['id'], 'calendar' => null];
                $this->saveTask($t);
                // keep implicitly updated record info
                $this->updatedRows['tasks'][$t['id']] = $t;
            }
        } else {
            if ($children) {
                throw new Exception("Cannot remove calendar #$id it has child calendars", E_APP_CALENDAR_HAS_CALENDARS);
            }

            if ($resources) {
                throw new Exception("Cannot remove calendar #$id it's used by a resource", E_APP_CALENDAR_USED_BY_RESOURCE);
            }

            if ($tasks) {
                throw new Exception("Cannot remove calendar #$id it's used by a task", E_APP_CALENDAR_USED_BY_TASK);
            }
        }

        $this->removeCalendarIntervals(['calendar' => $id]);

        if (!$this->db->query("delete from calendars where id = $id")) {
            throw new Exception($this->getPDOError("Cannot remove calendar #$id."), E_APP_REMOVE_CALENDAR);
        }

        $this->updateRevision();
    }

    /**
     * Creates/updates resource record.
     */
    public function saveResource(&$data)
    {
        $id = @$data['id'];
        if ($id) {
            if (!$this->getResource($id)) {
                throw new Exception("Cannot find resource #$id", E_APP_RESOURCE_NOT_FOUND);
            }

            if (!$this->update('resources', $data, ['id' => $id])) {
                throw new Exception("Cannot update resource #$id.", E_APP_UPDATE_RESOURCE);
            }
        } else {
            if (!$this->insert('resources', $data)) {
                throw new Exception('Cannot create resource.', E_APP_ADD_RESOURCE);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes resource record.
     */
    public function removeResource($id, $force = false)
    {
        $id = intval($id);

        $assignments = $this->getAssignments(['resource' => $id]);

        if ($assignments && !$force) {
            throw new Exception("Cannot remove resource being used #$id", E_APP_REMOVE_USED_RESOURCE);
        }

        foreach ($assignments as $assignment) {
            $this->removeAssignment($assignment['id']);
            // keep implicitly removed row id
            $this->removedRows['assignments'][$assignment['id']] = ['id' => $assignment['id']];
        }

        if (!$this->db->query("delete from resources where id = $id")) {
            throw new Exception($this->getPDOError("Cannot remove resource #$id."), E_APP_REMOVE_RESOURCE);
        }

        $this->updateRevision();
    }

    public function getResource($id)
    {
        $resources = $this->getResources(['id' => $id]);
        return $resources ? $resources[0] : false;
    }

    /**
     * Returns array of resources.
     */
    public function getResources($where = null)
    {
        $values = [];
        $cond   = $where ? ' where ' . self::buildWhere($where, $values) : '';
        $stmt   = $this->db->prepare('select * from resources ' . $cond);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get resources list.'), E_APP_GET_RESOURCES);
        }

        $rows = [];
        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $e['id'] = intval($e['id']);
            $rows[]  = $e;
        }

        return $rows;
    }

    /**
     * Creates/updates assignment record.
     */
    public function saveAssignment(&$data)
    {
        $id = @$data['id'];
        if ($id) {
            if (!$this->getAssignment($id)) {
                throw new Exception("Cannot find assignment #$id", E_APP_ASSIGNMENT_NOT_FOUND);
            }

            if (!$this->update('assignments', $data, ['id' => $id])) {
                throw new Exception("Cannot update assignment #$id.", E_APP_UPDATE_ASSIGNMENT);
            }
        } else {
            if (!$this->insert('assignments', $data)) {
                throw new Exception('Cannot create assignment.', E_APP_ADD_ASSIGNMENT);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes assignment record.
     */
    public function removeAssignment($id)
    {
        $id = intval($id);

        if (!$this->db->query("delete from assignments where id = $id")) {
            throw new Exception($this->getPDOError("Cannot remove assignment #$id."), E_APP_REMOVE_ASSIGNMENT);
        }

        $this->updateRevision();
    }

    public function getAssignment($id)
    {
        $assignments = $this->getAssignments(['id' => $id]);
        return $assignments ? $assignments[0] : false;
    }

    /**
     * Returns array of assignments.
     */
    public function getAssignments($where = null)
    {
        $values = [];
        $cond   = $where ? ' where ' . self::buildWhere($where, $values) : '';
        $stmt   = $this->db->prepare('select * from assignments ' . $cond);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get assignments list.'), E_APP_GET_ASSIGNMENTS);
        }

        $rows = [];
        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $e['id']       = intval($e['id']);
            $e['event']    = intval($e['event']);
            $e['resource'] = intval($e['resource']);
            $e['units']    = floatval($e['units']);
            $rows[]        = $e;
        }

        return $rows;
    }

    /**
     * Creates/updates dependency record.
     */
    public function saveDependency(&$data)
    {
        $id = @$data['id'];
        if ($id) {
            if (!$this->getDependency($id)) {
                throw new Exception("Cannot find dependency #$id", E_APP_DEPENDENCY_NOT_FOUND);
            }

            if (!$this->update('dependencies', $data, ['id' => $id])) {
                throw new Exception("Cannot update dependency #$id.", E_APP_UPDATE_DEPENDENCY);
            }
        } else {
            if (!$this->insert('dependencies', $data)) {
                throw new Exception('Cannot create dependency.', E_APP_ADD_DEPENDENCY);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes dependency record.
     */
    public function removeDependency($id)
    {
        $id = intval($id);

        if (!$this->db->query("delete from dependencies where id = $id")) {
            throw new Exception($this->getPDOError("Cannot remove dependency #$id."), E_APP_REMOVE_DEPENDENCY);
        }

        $this->updateRevision();
    }

    public function getDependency($id)
    {
        $dependencies = $this->getDependencies(['id' => $id]);
        return $dependencies ? $dependencies[0] : false;
    }

    /**
     * Returns array of dependencies.
     */
    public function getDependencies($where = null)
    {
        $values = [];
        $cond   = $where ? ' where ' . self::buildWhere($where, $values) : '';
        $stmt   = $this->db->prepare('select * from dependencies ' . $cond);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get dependencies list.'), E_APP_GET_DEPENDENCIES);
        }

        $rows = [];
        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $e['id']        = intval($e['id']);
            $e['fromEvent'] = intval($e['fromEvent']);
            $e['toEvent']   = intval($e['toEvent']);
            $e['type']      = intval($e['typ']);
            $e['lag']       = floatval($e['lag']);
            $rows[]         = $e;
        }

        return $rows;
    }

    /**
     * Creates/updates time range record.
     */
    public function saveTimeRange(&$data)
    {
        $id = @$data['id'];
        if ($id) {
            if (!$this->getTimeRange($id)) {
                throw new Exception("Cannot find time range #$id", E_APP_TIME_RANGE_NOT_FOUND);
            }

            if (!$this->update('time_ranges', $data, ['id' => $id])) {
                throw new Exception("Cannot update time range #$id.", E_APP_UPDATE_TIME_RANGE);
            }
        } else {
            if (!$this->insert('time_ranges', $data)) {
                throw new Exception('Cannot create time range.', E_APP_ADD_TIME_RANGE);
            }

            $data['id'] = $this->db->lastInsertId();
        }

        $this->updateRevision();
    }

    /**
     * Removes time range.
     */
    public function removeTimeRange($id)
    {
        $id = intval($id);

        if (!$this->db->query("delete from time_ranges where id = $id")) {
            throw new Exception($this->getPDOError("Cannot remove time range #$id."), E_APP_REMOVE_TIME_RANGE);
        }

        $this->updateRevision();
    }

    public function getTimeRange($id)
    {
        $records = $this->getTimeRanges(['id' => $id]);
        return $records ? $records[0] : false;
    }

    /**
     * Returns array of time ranges.
     */
    public function getTimeRanges($where = null)
    {
        $values = [];
        $cond   = $where ? ' where ' . self::buildWhere($where, $values) : '';
        $stmt   = $this->db->prepare('select * from time_ranges ' . $cond);

        if (!$stmt->execute($values)) {
            throw new Exception($this->getPDOError('Cannot get time range list.'), E_APP_GET_TIME_RANGES);
        }

        $rows = [];
        while ($e = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $e['id'] = intval($e['id']);
            if (@$e['startDate']) {
                $e['startDate'] = self::applyTimeZoneToDate($e['startDate']);
            }
            if (@$e['endDate']) {
                $e['endDate'] = self::applyTimeZoneToDate($e['endDate']);
            }
            $rows[] = $e;
        }

        return $rows;
    }

}
