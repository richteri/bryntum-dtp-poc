using Bryntum.CRUD.Response;
using Bryntum.Gantt;
using Bryntum.Gantt.Request;
using Bryntum.Gantt.Request.Handler;
using Bryntum.Gantt.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BryntumGanttDemo.Controllers
{
    [ApiController]
    [Route("ganttcrud")]
    public class GanttCrudController : Controller
    {
        public const string dateFormat = "yyyy-MM-dd\\THH:mm:ss";

        private readonly IOptions<MySQLConnectionSettingsModel> Configuration;

        public GanttCrudController(IOptions<MySQLConnectionSettingsModel> config)
        {
            Configuration = config;
        }

        public string GetMySQLConnectionString()
        {
            return $"server={Configuration.Value.Host};port={Configuration.Value.Port};database={Configuration.Value.Database};user={Configuration.Value.DB_User};password={Configuration.Value.DB_Password};protocol=tcp;";
        }

        /// <summary>
        /// Helper method to get POST request body.
        /// </summary>
        /// <returns>POST request body.</returns>
        private async Task<string> getPostBody()
        {
            var streamReader = new StreamReader(Request.Body, System.Text.Encoding.UTF8);
            return await streamReader.ReadToEndAsync();
        }

        /// <summary>
        /// Load request handler.
        /// </summary>
        /// <returns>JSON encoded response.</returns>
        [HttpGet]
        [Route("load")]
        public ActionResult Load()
        {
            GanttLoadRequest loadRequest = null;
            ulong? requestId = null;

            try
            {
                string json = Request.Query["q"].ToString();

                var gantt = new Gantt(GetMySQLConnectionString());

                // decode request object
                try
                {
                    loadRequest = JsonConvert.DeserializeObject<GanttLoadRequest>(json);
                } catch (Exception) {
                    throw new Exception("Invalid load JSON");
                }

                // get request identifier
                requestId = loadRequest.requestId;

                // initialize response object
                var loadResponse = new GanttLoadResponse(requestId);

                loadResponse.Project = new ProjectMetaData()
                {
                    Calendar = 1
                };

                // if a corresponding store is requested then add it to the response object
                if (loadRequest.calendars != null) loadResponse.setCalendars(gantt.GetCalendars());
                if (loadRequest.assignments != null) loadResponse.setAssignments(gantt.GetAssignments());
                if (loadRequest.tasks != null) loadResponse.setTasks(gantt.GetTasks());
                if (loadRequest.resources != null) loadResponse.setResources(gantt.GetResources());
                if (loadRequest.dependencies != null) loadResponse.setDependencies(gantt.GetDependencies());

                // put current server revision to the response
                loadResponse.revision = gantt.GetRevision();

                // just in case we make any changes during load request processing
                gantt.context.SaveChanges();

                return Content(JsonConvert.SerializeObject(loadResponse), "application/json");
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ErrorResponse(e, requestId)), "application/json");
            }
        }

        protected SyncStoreResponse AddModifiedRows(Gantt gantt, string table, SyncStoreResponse response)
        {
            var resp = response ?? new SyncStoreResponse();

            if (gantt.HasUpdatedRows(table))
            {
                var rows = gantt.GetUpdatedRows(table);
                resp.rows = resp.rows != null ? resp.rows.Concat(rows).ToList() : rows;
            }

            if (gantt.HasRemovedRows(table))
            {
                resp.removed = gantt.GetRemovedRows(table);
            }

            return resp;
        }

        /// <summary>
        /// Sync response handler.
        /// </summary>
        /// <returns>JSON encoded response.</returns>
        [HttpPost]
        [Route("sync")]
        public async Task<ActionResult> Sync()
        {
            ulong? requestId = null;
            GanttSyncRequest syncRequest = null;

            try
            {
                string json = await getPostBody();

                var gantt = new Gantt(GetMySQLConnectionString());

                // decode request object
                try
                {
                    syncRequest = JsonConvert.DeserializeObject<GanttSyncRequest>(json, new Newtonsoft.Json.Converters.IsoDateTimeConverter{ DateTimeFormat = dateFormat });
                }
                catch (Exception e)
                {
                    throw new Exception("Invalid sync JSON");
                }

                // initialize phantom to real Id maps
                gantt.InitRowsHolders();

                // get request identifier
                requestId = syncRequest.requestId;

                // initialize response object
                var syncResponse = new GanttSyncResponse(requestId);

                // Here we reject client's changes if we suspect that they are out-dated
                // considering difference between server and client revisions.
                // You can get rid of this call if you don't need such behavior.
                gantt.CheckRevision(syncRequest.revision);

                // if a corresponding store modified data are provided then we handle them

                // first let's process added and updated records

                CalendarSyncHandler calendarHandler = null;
                if (syncRequest.calendars != null)
                {
                    calendarHandler = new CalendarSyncHandler(gantt, dateFormat);
                    syncResponse.calendars = calendarHandler.Handle(syncRequest.calendars, CalendarSyncHandler.Rows.AddedAndUpdated);
                }
                ResourceSyncHandler resourcesHandler = null;
                if (syncRequest.resources != null)
                {
                    resourcesHandler = new ResourceSyncHandler(gantt);
                    syncResponse.resources = resourcesHandler.Handle(syncRequest.resources, ResourceSyncHandler.Rows.AddedAndUpdated);
                }
                TaskSyncHandler taskHandler = null;
                if (syncRequest.tasks != null)
                {
                    taskHandler = new TaskSyncHandler(gantt, dateFormat);
                    syncResponse.tasks = taskHandler.Handle(syncRequest.tasks, TaskSyncHandler.Rows.AddedAndUpdated);
                }
                AssignmentSyncHandler assignmentHandler = null;
                if (syncRequest.assignments != null)
                {
                    assignmentHandler = new AssignmentSyncHandler(gantt);
                    syncResponse.assignments = assignmentHandler.Handle(syncRequest.assignments, AssignmentSyncHandler.Rows.AddedAndUpdated);
                }
                DependencySyncHandler dependencyHandler = null;
                if (syncRequest.dependencies != null)
                {
                    dependencyHandler = new DependencySyncHandler(gantt);
                    syncResponse.dependencies = dependencyHandler.Handle(syncRequest.dependencies, DependencySyncHandler.Rows.AddedAndUpdated);
                }

                // then let's process records removals

                if (syncRequest.dependencies != null)
                    syncResponse.dependencies = dependencyHandler.HandleRemoved(syncRequest.dependencies, syncResponse.dependencies);

                if (syncRequest.assignments != null)
                    syncResponse.assignments = assignmentHandler.HandleRemoved(syncRequest.assignments, syncResponse.assignments);

                if (syncRequest.tasks != null)
                    syncResponse.tasks = taskHandler.HandleRemoved(syncRequest.tasks, syncResponse.tasks);

                if (syncRequest.resources != null)
                    syncResponse.resources = resourcesHandler.HandleRemoved(syncRequest.resources, syncResponse.resources);

                if (syncRequest.calendars != null)
                    syncResponse.calendars = calendarHandler.HandleRemoved(syncRequest.calendars, syncResponse.calendars);

                // remove records in bulk
                gantt.DoRemove();

                // we also return implicit modifications made by server
                // (implicit records updates/removals caused by data references)
                gantt.UpdateRevision();
                gantt.context.SaveChanges();

                syncResponse.calendars = AddModifiedRows(gantt, "calendars", syncResponse.calendars);
                syncResponse.tasks = AddModifiedRows(gantt, "tasks", syncResponse.tasks);
                syncResponse.resources = AddModifiedRows(gantt, "resources", syncResponse.resources);
                syncResponse.assignments = AddModifiedRows(gantt, "assignments", syncResponse.assignments);
                syncResponse.dependencies = AddModifiedRows(gantt, "dependencies", syncResponse.dependencies);

                // put current server revision to the response
                syncResponse.revision = gantt.GetRevision();

                return Content(JsonConvert.SerializeObject(syncResponse), "application/json");
            }
            catch (Exception e)
            {
                return Content(JsonConvert.SerializeObject(new ErrorResponse(e, requestId)), "application/json");
            }
        }

        /// <summary>
        /// Back-end test handler providing database cleanup.
        /// TODO: WARNING! This code clears the database. Please get rid of this code before running it on production.
        /// </summary>
        /// <returns>Empty string.</returns>
        public string Reset()
        {
            var gantt = new Gantt(GetMySQLConnectionString());

            gantt.Reset();
            gantt.context.SaveChanges();

            return "";
        }
    }
}
