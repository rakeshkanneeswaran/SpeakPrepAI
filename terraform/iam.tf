# ==========================================
# ECS Task Execution Role
# ==========================================

resource "aws_iam_role" "ecs_task_execution" {
  name = "speakprep-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "speakprep-ecs-task-execution-role"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}


# ==========================================
# AWS Managed ECS Execution Policy
# ==========================================

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role = aws_iam_role.ecs_task_execution.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


# ==========================================
# Allow ECS to Read Application Secrets
# ==========================================

resource "aws_iam_role_policy" "ecs_secrets" {
  name = "speakprep-ecs-secrets"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "secretsmanager:GetSecretValue"
        ]

        Resource = [
          aws_secretsmanager_secret.database.arn,
          aws_secretsmanager_secret.web.arn
        ]
      }
    ]
  })
}