using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique index on Employee Email
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            // Unique index on AppUser Username
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Username)
                .IsUnique();
            // --------------------------------------------------------
            // Seed Data — 15 Employees
            // Identical to Mini Project 1 data.js dataset
            // --------------------------------------------------------
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, FirstName = "Priya", LastName = "Menon", Email = "priya.menon@XYZ.com", Phone = "9876543210", Department = "Engineering", Designation = "Software Engineer", Salary = 750000, JoinDate = new DateTime(2021, 6, 15), Status = "Active", CreatedAt = new DateTime(2021, 6, 15), UpdatedAt = new DateTime(2021, 6, 15) },
                new Employee { Id = 2, FirstName = "Rahul", LastName = "Sharma", Email = "rahul.sharma@XYZ.com", Phone = "9823456781", Department = "Marketing", Designation = "Marketing Executive", Salary = 550000, JoinDate = new DateTime(2020, 3, 10), Status = "Active", CreatedAt = new DateTime(2020, 3, 10), UpdatedAt = new DateTime(2020, 3, 10) },
                new Employee { Id = 3, FirstName = "Anjali", LastName = "Verma", Email = "anjali.verma@XYZ.com", Phone = "9712345678", Department = "HR", Designation = "HR Executive", Salary = 480000, JoinDate = new DateTime(2019, 8, 1), Status = "Inactive", CreatedAt = new DateTime(2019, 8, 1), UpdatedAt = new DateTime(2019, 8, 1) },
                new Employee { Id = 4, FirstName = "Suresh", LastName = "Iyer", Email = "suresh.iyer@XYZ.com", Phone = "9654321098", Department = "Finance", Designation = "Financial Analyst", Salary = 820000, JoinDate = new DateTime(2018, 11, 20), Status = "Active", CreatedAt = new DateTime(2018, 11, 20), UpdatedAt = new DateTime(2018, 11, 20) },
                new Employee { Id = 5, FirstName = "Neha", LastName = "Gupta", Email = "neha.gupta@XYZ.com", Phone = "9543210987", Department = "Operations", Designation = "Operations Manager", Salary = 900000, JoinDate = new DateTime(2017, 5, 25), Status = "Inactive", CreatedAt = new DateTime(2017, 5, 25), UpdatedAt = new DateTime(2017, 5, 25) },
                new Employee { Id = 6, FirstName = "Arjun", LastName = "Patel", Email = "arjun.patel@XYZ.com", Phone = "9432109876", Department = "Engineering", Designation = "Senior Software Engineer", Salary = 1200000, JoinDate = new DateTime(2016, 2, 14), Status = "Active", CreatedAt = new DateTime(2016, 2, 14), UpdatedAt = new DateTime(2016, 2, 14) },
                new Employee { Id = 7, FirstName = "Divya", LastName = "Nair", Email = "divya.nair@XYZ.com", Phone = "9321098765", Department = "Marketing", Designation = "Content Strategist", Salary = 620000, JoinDate = new DateTime(2022, 1, 10), Status = "Inactive", CreatedAt = new DateTime(2022, 1, 10), UpdatedAt = new DateTime(2022, 1, 10) },
                new Employee { Id = 8, FirstName = "Kiran", LastName = "Reddy", Email = "kiran.reddy@XYZ.com", Phone = "9210987654", Department = "HR", Designation = "HR Manager", Salary = 750000, JoinDate = new DateTime(2015, 9, 30), Status = "Active", CreatedAt = new DateTime(2015, 9, 30), UpdatedAt = new DateTime(2015, 9, 30) },
                new Employee { Id = 9, FirstName = "Vikram", LastName = "Singh", Email = "vikram.singh@XYZ.com", Phone = "9109876543", Department = "Finance", Designation = "Accounts Executive", Salary = 510000, JoinDate = new DateTime(2023, 4, 5), Status = "Active", CreatedAt = new DateTime(2023, 4, 5), UpdatedAt = new DateTime(2023, 4, 5) },
                new Employee { Id = 10, FirstName = "Sneha", LastName = "Joshi", Email = "sneha.joshi@XYZ.com", Phone = "9098765432", Department = "Operations", Designation = "Logistics Coordinator", Salary = 470000, JoinDate = new DateTime(2021, 11, 18), Status = "Inactive", CreatedAt = new DateTime(2021, 11, 18), UpdatedAt = new DateTime(2021, 11, 18) },
                new Employee { Id = 11, FirstName = "Rohit", LastName = "Kumar", Email = "rohit.kumar@XYZ.com", Phone = "8987654321", Department = "Engineering", Designation = "QA Engineer", Salary = 680000, JoinDate = new DateTime(2020, 7, 22), Status = "Active", CreatedAt = new DateTime(2020, 7, 22), UpdatedAt = new DateTime(2020, 7, 22) },
                new Employee { Id = 12, FirstName = "Meera", LastName = "Pillai", Email = "meera.pillai@XYZ.com", Phone = "8876543210", Department = "Marketing", Designation = "Brand Manager", Salary = 950000, JoinDate = new DateTime(2019, 3, 15), Status = "Inactive", CreatedAt = new DateTime(2019, 3, 15), UpdatedAt = new DateTime(2019, 3, 15) },
                new Employee { Id = 13, FirstName = "Aditya", LastName = "Chopra", Email = "aditya.chopra@XYZ.com", Phone = "8765432109", Department = "Finance", Designation = "Senior Financial Analyst", Salary = 1100000, JoinDate = new DateTime(2018, 6, 1), Status = "Active", CreatedAt = new DateTime(2018, 6, 1), UpdatedAt = new DateTime(2018, 6, 1) },
                new Employee { Id = 14, FirstName = "Pooja", LastName = "Desai", Email = "pooja.desai@XYZ.com", Phone = "8654321098", Department = "Operations", Designation = "Supply Chain Analyst", Salary = 720000, JoinDate = new DateTime(2022, 8, 9), Status = "Active", CreatedAt = new DateTime(2022, 8, 9), UpdatedAt = new DateTime(2022, 8, 9) },
                new Employee { Id = 15, FirstName = "Manish", LastName = "Tiwari", Email = "manish.tiwari@XYZ.com", Phone = "8543210987", Department = "HR", Designation = "Talent Acquisition Specialist", Salary = 530000, JoinDate = new DateTime(2023, 2, 28), Status = "Inactive", CreatedAt = new DateTime(2023, 2, 28), UpdatedAt = new DateTime(2023, 2, 28) }
            );

            // --------------------------------------------------------
            // Seed Data — 2 Default Users
            // admin / admin123 → Role: Admin
            // viewer / viewer123 → Role: Viewer
            // --------------------------------------------------------
            modelBuilder.Entity<AppUser>().HasData(
                new AppUser { Id = 1, Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = "Admin", CreatedAt = new DateTime(2024, 1, 1) },
                new AppUser { Id = 2, Username = "viewer", PasswordHash = BCrypt.Net.BCrypt.HashPassword("viewer123"), Role = "Viewer", CreatedAt = new DateTime(2024, 1, 1) }
            );
        }
    }
}