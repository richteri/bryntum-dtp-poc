using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;
using System.Text;

namespace Bryntum.Gantt
{
    public class GanttContext : DbContext
    {
        private readonly string ConnectionString;

        public GanttContext(string connectionString)
        {
            ConnectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Ignore<Baseline>();

            modelBuilder.Entity<Option>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Options");
            });

            modelBuilder.Entity<Calendar>(entity =>
            {
                entity.ToTable("Calendars");

                entity.HasKey(e => e.Id);

                entity.Ignore(e => e.PhantomId);
                entity.Ignore(e => e.PhantomParentId);
                entity.Ignore(e => e.ParentId);
                entity.Ignore(e => e.Children);
                entity.Ignore(e => e.Resources);
                entity.Ignore(e => e.Tasks);

                entity.Property(e => e.ParentIdRaw).HasColumnName("ParentId");

                entity.HasOne(e => e.Parent).WithMany(e => e.ChildrenRaw).HasForeignKey(e => e.ParentIdRaw);
            });

            modelBuilder.Entity<CalendarInterval>(entity =>
            {
                entity.ToTable("CalendarIntervals");

                entity.HasKey(e => e.Id);

                entity.Ignore(e => e.PhantomId);
                entity.Ignore(e => e.Calendar);
                entity.Ignore(e => e.IsWorking);

                entity.Property(e => e.CalendarIdRaw).HasColumnName("CalendarId");
                entity.Property(e => e.IsWorkingRaw).HasColumnName("IsWorking");

                entity.HasOne(e => e.Calendar).WithMany(e => e.Intervals).HasForeignKey(e => e.CalendarIdRaw);
            });

            modelBuilder.Entity<Assignment>(entity => 
            {
                entity.ToTable("Assignments");

                entity.HasKey(e => e.Id);

                entity.Ignore(e => e.PhantomId);
                entity.Ignore(e => e.PhantomResourceId);
                entity.Ignore(e => e.PhantomTaskId);

                entity.Ignore(e => e.ResourceId);
                entity.Ignore(e => e.TaskId);

                entity.Property(e => e.TaskIdRaw).HasColumnName("TaskId");
                entity.Property(e => e.ResourceIdRaw).HasColumnName("ResourceId");

                //entity.Ignore(e => e.Resource);
                //entity.Ignore(e => e.Task);

                //entity.HasOne(e => e.Resource).WithMany(r => r.Assignments).HasForeignKey(e => e.ResourceIdRaw);
                //entity.HasOne(e => e.Task).WithMany(r => r.Assignments).HasForeignKey(e => e.TaskIdRaw);
            });

            modelBuilder.Entity<Resource>(entity =>
            {
                entity.ToTable("Resources");

                entity.HasKey(e => e.Id);

                entity.Ignore(e => e.PhantomId);
                entity.Ignore(e => e.PhantomIdField);
                entity.Ignore(e => e.PhantomCalendarId);
                entity.Ignore(e => e.CalendarId);
                entity.Ignore(e => e.Assignments);
                entity.Ignore(e => e.Calendar);

                entity.Property(e => e.CalendarIdRaw).HasColumnName("CalendarId");

                entity.HasOne(e => e.Calendar).WithMany(e => e.Resources).HasForeignKey(e => e.CalendarIdRaw);
            });

            modelBuilder.Entity<Task>(entity =>
            {
                entity.ToTable("Tasks");

                entity.HasKey(e => e.Id);

                entity.Ignore(e => e.PhantomId);
                entity.Ignore(e => e.PhantomIdField);
                entity.Ignore(e => e.PhantomCalendarId);
                entity.Ignore(e => e.PhantomParentId);
                entity.Ignore(e => e.CalendarId);
                entity.Ignore(e => e.ParentId);
                
                entity.Ignore(e => e.Assignments);
                entity.Ignore(e => e.Predecessors);
                entity.Ignore(e => e.Successors);
                entity.Ignore(e => e.Calendar);
                entity.Ignore(e => e.ChildrenRaw);

                entity.Property(e => e.CalendarIdRaw).HasColumnName("CalendarId");
                entity.Property(e => e.ParentIdRaw).HasColumnName("ParentId");

                entity.HasOne(e => e.Calendar).WithMany(e => e.Tasks).HasForeignKey(e => e.CalendarIdRaw);
                entity.HasOne(e => e.Parent).WithMany(e => e.Children).HasForeignKey(e => e.ParentIdRaw);
            });

            modelBuilder.Entity<Dependency>(entity =>
            {
                entity.ToTable("Dependencies");

                entity.HasKey(e => e.Id);

                entity.Ignore(e => e.PhantomId);
                entity.Ignore(e => e.PhantomFromId);
                entity.Ignore(e => e.PhantomToId);
                entity.Ignore(e => e.FromId);
                entity.Ignore(e => e.ToId);

                entity.Property(e => e.FromIdRaw).HasColumnName("FromId");
                entity.Property(e => e.ToIdRaw).HasColumnName("ToId");
                entity.Property(e => e.Type).HasColumnName("Typ");

                entity.HasOne(e => e.FromTask).WithMany(e => e.Successors).HasForeignKey(e => e.FromIdRaw);
                entity.HasOne(e => e.ToTask).WithMany(e => e.Predecessors).HasForeignKey(e => e.ToIdRaw);
            });
        }

        public DbSet<Assignment> Assignments { get; set; }

        public DbSet<Resource> Resources { get; set; }

        public DbSet<Task> Tasks{ get; set; }

        public DbSet<Dependency> Dependencies { get; set; }

        public DbSet<Calendar> Calendars { get; set; }

        public DbSet<CalendarInterval> CalendarIntervals { get; set; }

        public DbSet<Option> Options { get; set; }
    }

    public class Option
    {
        public string Name { get; set; }

        public string Value { get; set; }

        public DateTime? dt { get; set; }
    }
}
