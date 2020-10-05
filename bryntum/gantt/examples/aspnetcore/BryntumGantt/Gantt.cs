using Bryntum.CRUD.Exception;
using System;
using System.Collections.Generic;
using System.Linq;
using Bryntum.Gantt.Exception;
using Microsoft.EntityFrameworkCore;

namespace Bryntum.Gantt
{
    public class Gantt
    {
        public GanttContext context;

        /// <summary>
        /// A dictionary keeping phantom to real Id references for all tables.
        /// </summary>
        public IDictionary<String, IDictionary<String, int>> AddedIds { get; set; }

        public IDictionary<String, IDictionary<int, IDictionary<string, object>>> RemovedRows { get; set; }

        public IDictionary<String, IDictionary<int, IDictionary<string, object>>> UpdatedRows { get; set; }

        public Gantt(string connectionString)
        {
            context = new GanttContext(connectionString);
        }

        /// <summary>
        /// Gets a task by its identifier.
        /// </summary>
        /// <param name="id">Task identifier.</param>
        /// <returns>Task.</returns>
        public Task GetTask(int id)
        {
            return context.Tasks.Find(id);
        }

        /// <summary>
        /// Gets list of existing tasks.
        /// </summary>
        /// <returns>List of tasks.</returns>
        public IEnumerable<Task> GetTasks()
        {
            // First load all tasks, then pick parentless
            return context.Tasks.ToList().Where(t => !t.ParentIdRaw.HasValue);
        }

        /// <summary>
        /// Saves a task to the database. Creates a new or updates exisitng record depending on Id value.
        /// </summary>
        /// <param name="task">Task to save.</param>
        public void SaveTask(Task task)
        {
            if (task.Id > 0)
            {
                var entity = GetTask(task.Id);
                if (entity == null) throw new CrudException("Cannot find task #" + task.Id, GanttCodes.TASK_NOT_FOUND);

                // update record
                entity.Name = task.Name;
                entity.ParentId = task.ParentId;
                entity.Duration = task.Duration;
                entity.DurationUnit = task.DurationUnit;
                entity.PercentDone = task.PercentDone;
                entity.StartDate = task.StartDate;
                entity.EndDate = task.EndDate;
                entity.SchedulingMode = task.SchedulingMode;
                entity.Cls = task.Cls;
                entity.CalendarId = task.CalendarId;
                entity.BaselineStartDate = task.BaselineStartDate;
                entity.BaselineEndDate = task.BaselineEndDate;
                entity.BaselinePercentDone = task.BaselinePercentDone;
                entity.Effort = task.Effort;
                entity.EffortUnit = task.EffortUnit;
                entity.Note = task.Note;
                entity.ConstraintDate = task.ConstraintDate;
                entity.ConstraintType = task.ConstraintType;
                entity.ManuallyScheduled = task.ManuallyScheduled;
                entity.Draggable = task.Draggable;
                entity.Resizable = task.Resizable;
                entity.Rollup = task.Rollup;
                entity.Color = task.Color;
                entity.DeadlineDate = task.DeadlineDate;
                entity.ShowInTimeline = task.ShowInTimeline;
                entity.expanded = task.expanded;
            }
            else
            {
                context.Tasks.Add(task);

                context.SaveChanges();

                AddedIds["tasks"].Add(task.PhantomId, task.Id);
            }
        }

        /// <summary>
        /// Removes a task from the database.
        /// </summary>
        /// <param name="task">Task to remove.</param>
        public void RemoveTask(int id)
        {
            if (!RemovedRows["tasks"].Keys.Contains(id))
            {
                foreach (int childId in context.Tasks.Where(e => e.ParentIdRaw == id).Select(e => e.Id).ToList())
                {
                    RemoveTask(childId);
                }

                RemovedRows["tasks"].Add(id, new Dictionary<string, object>() { { "Id", id } });
            }
        }

        /// <summary>
        /// Gets an assignment by its identifier.
        /// </summary>
        /// <param name="id">Assignment identifier.</param>
        /// <returns>Assignment.</returns>
        public Assignment GetAssignment(int id)
        {
            return context.Assignments.Find(id);
        }

        /// <summary>
        /// Gets list of existing assignments.
        /// </summary>
        /// <returns>List of assignments.</returns>
        public IEnumerable<Assignment> GetAssignments()
        {
            return context.Assignments;
        }

        /// <summary>
        /// Saves an assignment to the database. Either creates a new or updates existing record depending on Id value.
        /// </summary>
        /// <param name="assignment">Assignment to save.</param>
        public void SaveAssignment(Assignment assignment)
        {
            if (assignment.Id > 0)
            {
                var entity = GetAssignment(assignment.Id);
                if (entity == null) throw new CrudException("Cannot find assignment #" + assignment.Id, GanttCodes.ASSIGNMENT_NOT_FOUND);

                entity.TaskId = assignment.TaskId;
                entity.ResourceId = assignment.ResourceId;
                entity.Units = assignment.Units;
            }
            else
            {
                context.Assignments.Add(assignment);

                context.SaveChanges();

                AddedIds["assignments"].Add(assignment.PhantomId, assignment.Id);
            }
        }

        /// <summary>
        /// Removes an assignment from the database.
        /// </summary>
        /// <param name="assignment">Assignment to remove.</param>
        public void RemoveAssignment(Assignment assignment)
        {
            RemoveAssignment(assignment.Id);
        }

        public void RemoveAssignment(int id)
        {
            if (!RemovedRows["assignments"].Keys.Contains(id))
            {
                RemovedRows["assignments"].Add(id, new Dictionary<string, object>() { { "Id", id } });
            }
        }

        /// <summary>
        /// Gets a resource by its identifier.
        /// </summary>
        /// <param name="id">Resource identifier.</param>
        /// <returns>Resource.</returns>
        public Resource GetResource(int id)
        {
            return context.Resources.Find(id);
        }

        /// <summary>
        /// Gets list of existing resources.
        /// </summary>
        /// <returns>List of resources.</returns>
        public IEnumerable<Resource> GetResources()
        {
            return context.Resources;
        }

        /// <summary>
        /// Saves a resource to the database. Either creates a new or updates existing record (depending on Id value).
        /// </summary>
        /// <param name="resource">Resource to save.</param>
        public void SaveResource(Resource resource)
        {
            if (resource.Id > 0)
            {
                var entity = GetResource(resource.Id);
                if (entity == null) throw new CrudException("Cannot find resource #" + resource.Id, GanttCodes.RESOURCE_NOT_FOUND);

                entity.Name = resource.Name;
                entity.CalendarId = resource.CalendarId;
            }
            else
            {
                context.Resources.Add(resource);

                context.SaveChanges();

                // let's keep mapping from phantom to real Id
                AddedIds["resources"].Add(resource.PhantomId, resource.Id);
            }
        }

        /// <summary>
        /// Removes a resource from the database.
        /// </summary>
        /// <param name="resource">Resource to remove.</param>
        public void RemoveResource(Resource resource, bool force = false)
        {
            Resource entity = GetResource(resource.Id);
            if (entity != null)
            {
                if (entity.Assignments.Count > 0 && !force)
                    throw new CrudException("Cannot remove resource being used #" + resource.Id, GanttCodes.REMOVE_USED_RESOURCE);

                foreach (Assignment assignment in entity.Assignments.ToList()) RemoveAssignment(assignment);

                context.Resources.Remove(entity);
            }
        }

        /// <summary>
        /// Gets a dependency by its identifier.
        /// </summary>
        /// <param name="id">Dependency identifier.</param>
        /// <returns></returns>
        public Dependency GetDependency(int id)
        {
            return context.Dependencies.Find(id);
        }

        /// <summary>
        /// Gets list of existing dependencies.
        /// </summary>
        /// <returns>List of dependencies.</returns>
        public IEnumerable<Dependency> GetDependencies()
        {
            return context.Dependencies;
        }

        /// <summary>
        /// Saves a dependency to the database. Either creates a new or updates existing record depending on Id value.
        /// </summary>
        /// <param name="dependency">Dependency to save.</param>
        public void SaveDependency(Dependency dependency)
        {
            if (dependency.Id > 0)
            {
                var entity = GetDependency(dependency.Id);
                if (entity == null) throw new CrudException("Cannot find dependency #" + dependency.Id, GanttCodes.DEPENDENCY_NOT_FOUND);

                entity.FromId = dependency.FromId;
                entity.ToId = dependency.ToId;
                entity.Type = dependency.Type;
                entity.Cls = dependency.Cls;
                entity.Lag = dependency.Lag;
                entity.LagUnit = dependency.LagUnit;
            }
            else
            {
                context.Dependencies.Add(dependency);
                
                context.SaveChanges();
                
                AddedIds["dependencies"].Add(dependency.PhantomId, dependency.Id);
            }
        }

        /// <summary>
        /// Removes a dependency from the database.
        /// </summary>
        /// <param name="dependency">Dependency to remove.</param>
        public void RemoveDependency(Dependency dependency)
        {
            RemoveDependency(dependency.Id);
        }

        public void RemoveDependency(int id)
        {
            if (!RemovedRows["dependencies"].Keys.Contains(id))
            {
                RemovedRows["dependencies"].Add(id, new Dictionary<string, object>() { { "Id", id } });
            }
        }

        /// <summary>
        /// Gets a calendar interval by its identifier.
        /// </summary>
        /// <param name="id">Calendar interval identifier.</param>
        /// <returns></returns>
        public CalendarInterval GetCalendarInterval(int id)
        {
            return context.CalendarIntervals.Find(id);
        }

        /// <summary>
        /// Gets list of specific calendar's intervals.
        /// </summary>
        /// <param name="calendarId">Calendar identifier.</param>
        /// <returns></returns>
        public IEnumerable<CalendarInterval> GetCalendarIntervals(int calendarId)
        {
            return context.CalendarIntervals.Where(cd => cd.CalendarIdRaw == calendarId);
        }

        /// <summary>
        /// Saves a calendar interval. Either creates a new or updates existing record (depending on Id field value).
        /// </summary>
        /// <param name="interval">A calendar interval to save.</param>
        public void SaveCalendarInterval(CalendarInterval interval)
        {
            if (interval.Id > 0)
            {
                var entity = GetCalendarInterval(interval.Id);
                if (entity == null) throw new CrudException("Cannot find day #" + interval.Id, GanttCodes.CALENDAR_DAY_NOT_FOUND);

                entity.CalendarIdRaw = interval.CalendarIdRaw;
                entity.StartDate = interval.StartDate;
                entity.EndDate = interval.EndDate;
                entity.RecurrentStartDate = interval.RecurrentStartDate;
                entity.RecurrentEndDate = interval.RecurrentEndDate;
                entity.IsWorkingRaw = interval.IsWorkingRaw;
                entity.Cls = interval.Cls;
            }
            else
            {
                context.CalendarIntervals.Add(interval);

                context.SaveChanges();

                AddedIds["calendarintervals"].Add(interval.PhantomId, interval.Id);
            }
        }

        /// <summary>
        /// Removes a calendar interval.
        /// </summary>
        /// <param name="interval">A calendar interval to remove.</param>
        public void RemoveCalendarInterval(CalendarInterval interval)
        {
            CalendarInterval entity = GetCalendarInterval(interval.Id);
            if (entity != null)
            {
                context.CalendarIntervals.Remove(entity);
            }
        }

        /// <summary>
        /// Gets a calendar by its identifier.
        /// </summary>
        /// <param name="id">A calendar identifier.</param>
        /// <returns>Calendar.</returns>
        public Calendar GetCalendar(int id)
        {
            return context.Calendars.Find(id);
        }

        /// <summary>
        /// Gets list of existing calendars.
        /// </summary>
        /// <returns>List of calendars.</returns>
        public IEnumerable<Calendar> GetCalendars()
        {
            return context.Calendars.Where(c => !c.ParentIdRaw.HasValue)
                                    .Include(c => c.Intervals)
                                    .Include(c => c.ChildrenRaw)
                                    .ThenInclude(c => c.Intervals)
                                    .ToList();
        }

        /// <summary>
        /// Saves a calendar to the database. Either creates a new or updates existing record (depending on Id value).
        /// </summary>
        /// <param name="calendar">Calendar to save.</param>
        public void SaveCalendar(Calendar calendar)
        {
            if (calendar.Id > 0)
            {
                var entity = GetCalendar(calendar.Id);
                if (entity == null) throw new CrudException("Cannot find calendar #" + calendar.Id, GanttCodes.CALENDAR_NOT_FOUND);

                entity.ParentId = calendar.ParentId;
                entity.PhantomId = calendar.PhantomId;
                entity.PhantomParentId = calendar.PhantomParentId;
                entity.Name = calendar.Name;
                entity.DaysPerMonth = calendar.DaysPerMonth;
                entity.DaysPerWeek = calendar.DaysPerWeek;
                entity.HoursPerDay = calendar.HoursPerDay;
            }
            else
            {
                context.Calendars.Add(calendar);
                
                context.SaveChanges();

                AddedIds["calendars"].Add(calendar.PhantomId, calendar.Id);
            }
        }

        /// <summary>
        /// Removes a calendar.
        /// </summary>
        /// <param name="calendar">A calendar to remove.</param>
        /// <param name="force">True to automatically reset all references to the removed calendar</param>
        public void RemoveCalendar(Calendar calendar, bool force = false)
        {
            Calendar entity = GetCalendar(calendar.Id);
            if (entity != null)
            {
                int id = entity.Id;

                if (force)
                {
                    foreach (Calendar child in entity.ChildrenRaw.ToList())
                    {
                        child.ParentIdRaw = null;
                        SaveCalendar(child);

                        var cal = new Dictionary<string, object>();
                        cal.Add("Id", child.Id);
                        cal.Add("parentId", null);
                        UpdatedRows["calendars"].Add(child.Id, cal);
                    }
                    foreach (Resource resource in entity.Resources.ToList())
                    {
                        resource.CalendarIdRaw = null;
                        SaveResource(resource);

                        var res = new Dictionary<string, object>();
                        res.Add("Id", resource.Id);
                        res.Add("CalendarId", null);
                        UpdatedRows["resources"].Add(resource.Id, res);
                    }
                    foreach (Task task in entity.Tasks.ToList())
                    {
                        task.CalendarIdRaw = null;
                        SaveTask(task);

                        var tsk = new Dictionary<string, object>();
                        tsk.Add("Id", task.Id);
                        tsk.Add("CalendarId", null);
                        UpdatedRows["tasks"].Add(task.Id, tsk);
                    }
                }
                else
                {
                    if (entity.ChildrenRaw.Count > 0)
                        throw new CrudException("Cannot remove calendar #" + calendar.Id + " it has child calendars", GanttCodes.CALENDAR_HAS_CALENDARS);

                    if (entity.Resources.Count > 0)
                        throw new CrudException("Cannot remove calendar #" + calendar.Id + " it's used by a resource", GanttCodes.CALENDAR_USED_BY_RESOURCE);

                    if (entity.Tasks.Count > 0)
                        throw new CrudException("Cannot remove calendar #" + calendar.Id + " it's used by a task", GanttCodes.CALENDAR_USED_BY_TASK);
                }

                // drop calendar days
                foreach (CalendarInterval day in entity.Intervals.ToList()) RemoveCalendarInterval(day);

                context.Calendars.Remove(entity);
            }
        }

        /// <summary>
        /// Sets an arbitrary application option value.
        /// </summary>
        /// <param name="option">Option name.</param>
        /// <param name="val">Option value.</param>
        /// <param name="saveChanges">Pass true to save changes immediately</param>
        public void SetOption(string option, string val, bool saveChanges = false)
        {
            var entity = context.Options.SingleOrDefault(r => r.Name == option);
            if (entity == null) {
                context.Options.Add(new Option {
                    Name = option,
                    Value = val
                });
            }
            else
            {
                entity.Value = val;
            }

            if (saveChanges)
            {
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Gets an application option value.
        /// </summary>
        /// <param name="option">Option name.</param>
        /// <returns>Option value.</returns>
        public string GetOption(string option)
        {
            var entity = context.Options.SingleOrDefault(r => r.Name == option);

            if (entity == null) throw new CrudException("Cannot get option " + option + ".", Codes.GET_OPTION);

            return entity.Value;
        }

        /// <summary>
        /// Gets current server revision stamp.
        /// </summary>
        /// <returns>Server revision stamp.</returns>
        public int GetRevision() {
            return Convert.ToInt32(GetOption("revision"));
        }

        /// <summary>
        /// Increments server revision stamp.
        /// </summary>
        /// <param name="saveChanges">Pass true to save changes immediately</param>
        public void UpdateRevision(bool saveChanges = false) {
            try {
                SetOption("revision", Convert.ToString(GetRevision() + 1), saveChanges);
            } catch (System.Exception) {
                throw new CrudException("Cannot update server revision stamp.", Codes.UPDATE_REVISION);
            }
        }

        /// <summary>
        /// Checks if specified revision stamp is not older than current server one.
        /// </summary>
        /// <param name="revision">Revision stamp to check.</param>
        /// <exception cref="CrudException">If specified revision is older than server one method throws CrudException with code OUTDATED_REVISION.</exception>
        public void CheckRevision(int? revision) {
            if (revision.HasValue && revision > 0 && GetRevision() > revision) {
                throw new CrudException("Client data snapshot is outdated please reload you stores before.", Codes.OUTDATED_REVISION);
            }
        }

        /// <summary>
        /// Gets the project calendar identifier.
        /// </summary>
        /// <returns>Identifier of the project calendar.</returns>
        public int GetProjectCalendarId() {
            return Convert.ToInt32(GetOption("projectCalendar"));
        }

        /// <summary>
        /// Initializes structures to keep mapping between phantom and real Ids
        /// and lists of implicitly updated and removed records dictionaries.
        /// </summary>
        public void InitRowsHolders()
        {
            AddedIds = new Dictionary<string, IDictionary<string, int>>();

            AddedIds.Add("tasks", new Dictionary<string, int>());
            AddedIds.Add("calendars", new Dictionary<string, int>());
            AddedIds.Add("resources", new Dictionary<string, int>());
            AddedIds.Add("assignments", new Dictionary<string, int>());
            AddedIds.Add("dependencies", new Dictionary<string, int>());

            UpdatedRows = new Dictionary<string, IDictionary<int, IDictionary<string, object>>>();

            UpdatedRows.Add("tasks", new Dictionary<int, IDictionary<string, object>>());
            UpdatedRows.Add("calendars", new Dictionary<int, IDictionary<string, object>>());
            UpdatedRows.Add("resources", new Dictionary<int, IDictionary<string, object>>());

            RemovedRows = new Dictionary<string, IDictionary<int, IDictionary<string, object>>>();

            RemovedRows.Add("tasks", new Dictionary<int, IDictionary<string, object>>());
            RemovedRows.Add("calendars", new Dictionary<int, IDictionary<string, object>>());
            RemovedRows.Add("calendardays", new Dictionary<int, IDictionary<string, object>>());
            RemovedRows.Add("resources", new Dictionary<int, IDictionary<string, object>>());
            RemovedRows.Add("assignments", new Dictionary<int, IDictionary<string, object>>());
            RemovedRows.Add("dependencies", new Dictionary<int, IDictionary<string, object>>());
        }

        public bool HasNewRows(string table)
        {
            return AddedIds.ContainsKey(table) && AddedIds[table].Count > 0;
        }

        public IList<IDictionary<string, object>> GetNewRows(string table)
        {
            if (!HasNewRows(table)) return null;

            var result = new List<IDictionary<string, object>>();

            foreach (var key in AddedIds[table].Keys)
            {
                result.Add(new Dictionary<string, object>() { { "PhantomId", key }, { "Id", AddedIds[table][key] } });
            }

            return result;
        }

        public bool HasUpdatedRows(String table)
        {
            return UpdatedRows.ContainsKey(table) && UpdatedRows[table].Count > 0;
        }

        public IList<IDictionary<string, object>> GetUpdatedRows(String table)
        {
            if (!HasUpdatedRows(table)) return null;

            return UpdatedRows[table].Values.ToList();
        }

        public bool HasRemovedRows(String table)
        {
            return RemovedRows.ContainsKey(table) && RemovedRows[table].Count > 0;
        }

        public IList<IDictionary<string, object>> GetRemovedRows(String table)
        {
            if (!HasRemovedRows(table)) return null;

            return RemovedRows[table].Values.ToList();
        }

        /// <summary>
        /// Gets real record identifier matching specified phantom one.
        /// </summary>
        /// <param name="table">Table name.</param>
        /// <param name="phantomId">Phantom identifier.</param>
        /// <returns>Real record identifier.</returns>
        public int? GetIdByPhantom(String table, String phantomId)
        {
            if (!AddedIds.ContainsKey(table)) return null;
            IDictionary<String, int> map = AddedIds[table];
            if (map == null) return null;

            // get real task Id
            if (phantomId != null && map.ContainsKey(phantomId))
            {
                return map[phantomId];
            }

            return null;
        }

        /// <summary>
        /// Gets real task identifier by specified phantom one.
        /// </summary>
        /// <param name="phantomId">Task phantom identifier.</param>
        /// <returns>Task real identifier.</returns>
        public int? GetTaskIdByPhantom(String phantomId) {
            return GetIdByPhantom("tasks", phantomId);
        }

        /// <summary>
        /// Gets real resource identifier by specified phantom one.
        /// </summary>
        /// <param name="phantomId">Resource phantom identifier.</param>
        /// <returns>Resource real identifier.</returns>
        public int? GetResourceIdByPhantom(String phantomId) {
            return GetIdByPhantom("resources", phantomId);
        }

        /// <summary>
        /// Gets real calendar identifier by specified phantom one.
        /// </summary>
        /// <param name="phantomId">Calendar phantom identifier.</param>
        /// <returns>Calendar real identifier.</returns>
        public int? GetCalendarIdByPhantom(String phantomId) {
            return GetIdByPhantom("calendars", phantomId);
        }

        /// <summary>
        /// Back-end test handler providing database cleanup.
        /// TODO: WARNING! This code clears the database. Please get rid of this code before running it on production.
        /// </summary>
        public void Reset()
        {
            var db = context.Database;

            // first let's drop foreign keys to be able to truncate tables
            db.ExecuteSqlRaw("ALTER TABLE [Assignments] DROP CONSTRAINT [FK_Assignments_Resources]");
            db.ExecuteSqlRaw("ALTER TABLE [Assignments] DROP CONSTRAINT [FK_Assignments_Tasks]");
            db.ExecuteSqlRaw("ALTER TABLE [CalendarDays] DROP CONSTRAINT [FK_CalendarDays_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Calendars] DROP CONSTRAINT [FK_Calendars_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Dependencies] DROP CONSTRAINT [FK_Dependencies_Tasks]");
            db.ExecuteSqlRaw("ALTER TABLE [Dependencies] DROP CONSTRAINT [FK_Dependencies_Tasks1]");
            db.ExecuteSqlRaw("ALTER TABLE [Resources] DROP CONSTRAINT [FK_Resources_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Tasks] DROP CONSTRAINT [FK_Tasks_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Tasks] DROP CONSTRAINT [FK_Tasks_Tasks]");
            db.ExecuteSqlRaw("ALTER TABLE [TaskSegments] DROP CONSTRAINT [FK_TaskSegments_Tasks]");

            // now we truncate tables
            db.ExecuteSqlRaw("TRUNCATE TABLE [Dependencies]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [TaskSegments]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [Tasks]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [Assignments]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [CalendarDays]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [Resources]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [Calendars]");
            db.ExecuteSqlRaw("TRUNCATE TABLE [options]");

            // and finally we restore foreign keys back
            db.ExecuteSqlRaw("ALTER TABLE [Assignments] WITH CHECK ADD CONSTRAINT [FK_Assignments_Resources] FOREIGN KEY([ResourceId]) REFERENCES [Resources] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Assignments] CHECK CONSTRAINT [FK_Assignments_Resources]");
            db.ExecuteSqlRaw("ALTER TABLE [Assignments] WITH CHECK ADD CONSTRAINT [FK_Assignments_Tasks] FOREIGN KEY([TaskId]) REFERENCES [Tasks] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Assignments] CHECK CONSTRAINT [FK_Assignments_Tasks]");
            db.ExecuteSqlRaw("ALTER TABLE [CalendarDays] WITH CHECK ADD CONSTRAINT [FK_CalendarDays_Calendars] FOREIGN KEY([calendarId]) REFERENCES [Calendars] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [CalendarDays] CHECK CONSTRAINT [FK_CalendarDays_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Calendars] WITH CHECK ADD CONSTRAINT [FK_Calendars_Calendars] FOREIGN KEY([parentId]) REFERENCES [Calendars] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Calendars] CHECK CONSTRAINT [FK_Calendars_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Dependencies] WITH NOCHECK ADD CONSTRAINT [FK_Dependencies_Tasks] FOREIGN KEY([FromId]) REFERENCES [Tasks] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Dependencies] NOCHECK CONSTRAINT [FK_Dependencies_Tasks]");
            db.ExecuteSqlRaw("ALTER TABLE [Dependencies] WITH NOCHECK ADD CONSTRAINT [FK_Dependencies_Tasks1] FOREIGN KEY([ToId]) REFERENCES [Tasks] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Dependencies] NOCHECK CONSTRAINT [FK_Dependencies_Tasks1]");
            db.ExecuteSqlRaw("ALTER TABLE [Resources] WITH CHECK ADD CONSTRAINT [FK_Resources_Calendars] FOREIGN KEY([CalendarId]) REFERENCES [Calendars] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Resources] CHECK CONSTRAINT [FK_Resources_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Tasks] WITH NOCHECK ADD CONSTRAINT [FK_Tasks_Calendars] FOREIGN KEY([CalendarId]) REFERENCES [Calendars] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Tasks] NOCHECK CONSTRAINT [FK_Tasks_Calendars]");
            db.ExecuteSqlRaw("ALTER TABLE [Tasks] WITH NOCHECK ADD CONSTRAINT [FK_Tasks_Tasks] FOREIGN KEY([parentId]) REFERENCES [Tasks] ([Id])");
            db.ExecuteSqlRaw("ALTER TABLE [Tasks] NOCHECK CONSTRAINT [FK_Tasks_Tasks]");
            db.ExecuteSqlRaw("ALTER TABLE [TaskSegments] WITH NOCHECK ADD CONSTRAINT [FK_TaskSegments_Tasks] FOREIGN KEY([TaskId]) REFERENCES [Tasks] ([Id]) ON UPDATE CASCADE ON DELETE CASCADE");
            db.ExecuteSqlRaw("ALTER TABLE [TaskSegments] NOCHECK CONSTRAINT [FK_TaskSegments_Tasks]");

            // initialize server revision stamp
            SetOption("revision", "1");
            SetOption("projectCalendar", "1");
        }

        public void DoRemove()
        {
            IList<IDictionary<string, object>> removedRows;
            IList<int> removedIds;

            // Tasks dependencies and assignments are related to each other. In order to delete them properly and return ids of all deleted tasks
            // we need to process them first
            IEnumerable<int> tasksToRemove = new List<int>();
            IEnumerable<int> dependenciesToRemove = new List<int>();
            IEnumerable<int> assignmentsToRemove = new List<int>();

            removedRows = GetRemovedRows("dependencies");
            if (removedRows != null)
            {
                dependenciesToRemove = dependenciesToRemove.Concat(removedRows.Select(x => (int)x.Values.First()).ToList());
            }

            removedRows = GetRemovedRows("assignments");
            if (removedRows != null)
            {
                assignmentsToRemove = assignmentsToRemove.Concat(removedRows.Select(x => (int)x.Values.First()).ToList());
            }

            removedRows = GetRemovedRows("tasks");
            if (removedRows != null)
            {
                tasksToRemove = removedRows.Select(x => (int)x.Values.First()).ToList();

                dependenciesToRemove = dependenciesToRemove.Concat(context.Dependencies
                                                .Where(x => tasksToRemove.Contains(x.FromIdRaw) || tasksToRemove.Contains(x.ToIdRaw))
                                                .Select(x => x.Id).ToList());

                assignmentsToRemove = assignmentsToRemove.Concat(context.Assignments
                                                .Where(x => tasksToRemove.Contains(x.TaskIdRaw))
                                                .Select(x => x.Id).ToList());
            }

            context.Dependencies.RemoveRange(context.Dependencies.Where(x => dependenciesToRemove.Contains(x.Id)));
            context.Assignments.RemoveRange(context.Assignments.Where(x => assignmentsToRemove.Contains(x.Id)));
            context.Tasks.RemoveRange(context.Tasks.Where(x => tasksToRemove.Contains(x.Id)));

            // Now we need to update removed entities dictionary
            foreach (var id in tasksToRemove)
            {
                if (!RemovedRows["tasks"].Keys.Contains(id))
                {
                    RemovedRows["tasks"].Add(id, new Dictionary<string, object>() { { "Id", id } });
                }
            }

            foreach (var id in dependenciesToRemove)
            {
                if (!RemovedRows["dependencies"].Keys.Contains(id))
                {
                    RemovedRows["dependencies"].Add(id, new Dictionary<string, object>() { { "Id", id } });
                }
            }

            foreach (var id in assignmentsToRemove)
            {
                if (!RemovedRows["assignments"].Keys.Contains(id))
                {
                    RemovedRows["assignments"].Add(id, new Dictionary<string, object>() { { "Id", id } });
                }
            }

            removedRows = GetRemovedRows("resources");
            if (removedRows != null)
            {
                removedIds = removedRows.Select(x => (int)x.Values.First()).ToList();
                context.Resources.RemoveRange(context.Resources.Where(x => removedIds.Contains(x.Id)));
            }
        }
    }
}

