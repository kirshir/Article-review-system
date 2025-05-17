using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ReviewSystemApi.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReviewAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ArticleId = table.Column<int>(type: "integer", nullable: false),
                    ReviewerId = table.Column<int>(type: "integer", nullable: false),
                    Declined = table.Column<bool>(type: "boolean", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReviewAssignments_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReviewAssignments_Users_ReviewerId",
                        column: x => x.ReviewerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReviewAssignments_ArticleId",
                table: "ReviewAssignments",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewAssignments_ReviewerId",
                table: "ReviewAssignments",
                column: "ReviewerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReviewAssignments");
        }
    }
}
