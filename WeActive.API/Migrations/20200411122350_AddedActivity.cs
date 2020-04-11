using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WeActive.API.Migrations
{
    public partial class AddedActivity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    HostId = table.Column<int>(nullable: false),
                    PrivateActivity = table.Column<bool>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    FlexStartDate = table.Column<bool>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    FlexEndDate = table.Column<bool>(nullable: false),
                    Place = table.Column<string>(nullable: true),
                    MinParticipantsNumber = table.Column<int>(nullable: false),
                    MaxParticipantsNumber = table.Column<int>(nullable: false),
                    ParticipantsNumber = table.Column<int>(nullable: false),
                    ParticipantsListClosureTime = table.Column<DateTime>(nullable: false),
                    ConfirmationTime = table.Column<DateTime>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    ActivityType = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Activities_Users_HostId",
                        column: x => x.HostId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Participant",
                columns: table => new
                {
                    ActivityId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    ParticipantStatus = table.Column<int>(nullable: false),
                    ActivityId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participant", x => new { x.ActivityId, x.UserId });
                    table.ForeignKey(
                        name: "FK_Participant_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Participant_Activities_ActivityId1",
                        column: x => x.ActivityId1,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Participant_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_HostId",
                table: "Activities",
                column: "HostId");

            migrationBuilder.CreateIndex(
                name: "IX_Participant_ActivityId1",
                table: "Participant",
                column: "ActivityId1");

            migrationBuilder.CreateIndex(
                name: "IX_Participant_UserId",
                table: "Participant",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Participant");

            migrationBuilder.DropTable(
                name: "Activities");
        }
    }
}
