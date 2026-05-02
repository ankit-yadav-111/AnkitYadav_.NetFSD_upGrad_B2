using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AppUsers",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "$2a$11$Jmo2o9x8TeD9XS0zZS4DTuDpf/UtA4fbbozFBYqpfMnU1EMqCNscq", "Admin", "admin" },
                    { 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "$2a$11$pKYZLvGpjJ5WVof.C5PR/O7.10jY1it70T4cMBeTJ2z8nUBjQMp06", "Viewer", "viewer" }
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "Department", "Designation", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Salary", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2021, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Engineering", "Software Engineer", "priya.menon@XYZ.com", "Priya", new DateTime(2021, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Menon", "9876543210", 750000m, "Active", new DateTime(2021, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2020, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Marketing", "Marketing Executive", "rahul.sharma@XYZ.com", "Rahul", new DateTime(2020, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sharma", "9823456781", 550000m, "Active", new DateTime(2020, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "HR", "HR Executive", "anjali.verma@XYZ.com", "Anjali", new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Verma", "9712345678", 480000m, "Inactive", new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, new DateTime(2018, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Finance", "Financial Analyst", "suresh.iyer@XYZ.com", "Suresh", new DateTime(2018, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Iyer", "9654321098", 820000m, "Active", new DateTime(2018, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 5, new DateTime(2017, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Operations", "Operations Manager", "neha.gupta@XYZ.com", "Neha", new DateTime(2017, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gupta", "9543210987", 900000m, "Inactive", new DateTime(2017, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 6, new DateTime(2016, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Engineering", "Senior Software Engineer", "arjun.patel@XYZ.com", "Arjun", new DateTime(2016, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Patel", "9432109876", 1200000m, "Active", new DateTime(2016, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 7, new DateTime(2022, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Marketing", "Content Strategist", "divya.nair@XYZ.com", "Divya", new DateTime(2022, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nair", "9321098765", 620000m, "Inactive", new DateTime(2022, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 8, new DateTime(2015, 9, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "HR", "HR Manager", "kiran.reddy@XYZ.com", "Kiran", new DateTime(2015, 9, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reddy", "9210987654", 750000m, "Active", new DateTime(2015, 9, 30, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 9, new DateTime(2023, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Finance", "Accounts Executive", "vikram.singh@XYZ.com", "Vikram", new DateTime(2023, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Singh", "9109876543", 510000m, "Active", new DateTime(2023, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 10, new DateTime(2021, 11, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Operations", "Logistics Coordinator", "sneha.joshi@XYZ.com", "Sneha", new DateTime(2021, 11, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Joshi", "9098765432", 470000m, "Inactive", new DateTime(2021, 11, 18, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 11, new DateTime(2020, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Engineering", "QA Engineer", "rohit.kumar@XYZ.com", "Rohit", new DateTime(2020, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kumar", "8987654321", 680000m, "Active", new DateTime(2020, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 12, new DateTime(2019, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Marketing", "Brand Manager", "meera.pillai@XYZ.com", "Meera", new DateTime(2019, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pillai", "8876543210", 950000m, "Inactive", new DateTime(2019, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 13, new DateTime(2018, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Finance", "Senior Financial Analyst", "aditya.chopra@XYZ.com", "Aditya", new DateTime(2018, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chopra", "8765432109", 1100000m, "Active", new DateTime(2018, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 14, new DateTime(2022, 8, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Operations", "Supply Chain Analyst", "pooja.desai@XYZ.com", "Pooja", new DateTime(2022, 8, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Desai", "8654321098", 720000m, "Active", new DateTime(2022, 8, 9, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 15, new DateTime(2023, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "HR", "Talent Acquisition Specialist", "manish.tiwari@XYZ.com", "Manish", new DateTime(2023, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tiwari", "8543210987", 530000m, "Inactive", new DateTime(2023, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_Username",
                table: "AppUsers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
