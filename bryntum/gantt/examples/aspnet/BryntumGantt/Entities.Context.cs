

//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


namespace Bryntum.Gantt
{

using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;


public partial class GanttEntities : DbContext
{
    public GanttEntities()
        : base("name=GanttEntities")
    {

    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        throw new UnintentionalCodeFirstException();
    }


    public virtual DbSet<Assignment> Assignments { get; set; }

    public virtual DbSet<Calendar> Calendars { get; set; }

    public virtual DbSet<Dependency> Dependencies { get; set; }

    public virtual DbSet<Option> Options { get; set; }

    public virtual DbSet<Resource> Resources { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<TaskSegment> TaskSegments { get; set; }

    public virtual DbSet<CalendarInterval> CalendarIntervals { get; set; }

}

}
