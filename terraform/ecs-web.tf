# ==========================================
# ECS Web Task Definition
# ==========================================

resource "aws_ecs_task_definition" "web" {
  family                   = "speakprep-web"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  cpu    = "512"
  memory = "1024"

  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "speakprep-web"
      image     = "${aws_ecr_repository.web.repository_url}:v3"
      essential = true

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "3000"
        },
        {
          name  = "HOSTNAME"
          value = "0.0.0.0"
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${aws_secretsmanager_secret.database.arn}:DATABASE_URL::"
        },
        {
          name      = "OPENAI_API_KEY"
          valueFrom = "${aws_secretsmanager_secret.web.arn}:OPENAI_API_KEY::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.web.arn}:JWT_SECRET::"
        },
        {
          name      = "AI_API_KEY"
          valueFrom = "${aws_secretsmanager_secret.web.arn}:AI_API_KEY::"
        },
        {
          name      = "AI_BASE_URL"
          valueFrom = "${aws_secretsmanager_secret.web.arn}:AI_BASE_URL::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.web.name
          awslogs-region        = "ap-south-1"
          awslogs-stream-prefix = "web"
        }
      }
    }
  ])

  tags = {
    Name        = "speakprep-web-task"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# ECS Web Service
# ==========================================

resource "aws_ecs_service" "web" {
  name            = "speakprep-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id
    ]

    security_groups = [
      aws_security_group.web.id
    ]

    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn
    container_name   = "speakprep-web"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener.http
  ]

  tags = {
    Name        = "speakprep-web-service"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}