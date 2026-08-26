# ==========================================
# Prisma Migration Task
# ==========================================

resource "aws_ecs_task_definition" "migration" {
  family                   = "speakprep-migration"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  cpu    = "512"
  memory = "1024"

  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "speakprep-migration"
      image     = "${aws_ecr_repository.web_migration.repository_url}:v2"
      essential = true

      command = [
        "pnpm",
        "exec",
        "prisma",
        "migrate",
        "deploy"
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${aws_secretsmanager_secret.database.arn}:DATABASE_URL::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.web.name
          awslogs-region        = "ap-south-1"
          awslogs-stream-prefix = "migration"
        }
      }
    }
  ])

  tags = {
    Name        = "speakprep-migration-task"
    Application = "SpeakPrepAI"
    Component   = "database"
    ManagedBy   = "Terraform"
  }
}