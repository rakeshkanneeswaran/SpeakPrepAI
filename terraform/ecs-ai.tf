# ==========================================
# ECS AI Task Definition
# ==========================================

resource "aws_ecs_task_definition" "ai" {
  family                   = "speakprep-ai"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  cpu    = "512"
  memory = "1024"

  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "speakprep-ai"
      image     = "${aws_ecr_repository.ai.repository_url}:v3"
      essential = true

      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]

      # ==========================================
      # Runtime Environment Variables
      # ==========================================

      environment = [
        {
          name  = "PORT"
          value = "8000"
        },
        {
          name  = "HOST"
          value = "0.0.0.0"
        },
        {
          name  = "REDIS_HOST"
          value = aws_elasticache_cluster.redis.cache_nodes[0].address
        },
        {
          name  = "REDIS_PORT"
          value = "6379"
        },
        {
          name  = "REDIS_USERNAME"
          value = "default"
        }
      ]

      # ==========================================
      # Secrets
      # ==========================================

      secrets = [
        {
          name      = "OPENAI_API_KEY"
          valueFrom = "${aws_secretsmanager_secret.web.arn}:OPENAI_API_KEY::"
        },
        {
          name      = "AI_API_KEY"
          valueFrom = "${aws_secretsmanager_secret.web.arn}:AI_API_KEY::"
        }
      ]

      # ==========================================
      # CloudWatch Logs
      # ==========================================

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.ai.name
          awslogs-region        = "ap-south-1"
          awslogs-stream-prefix = "ai"
        }
      }
    }
  ])

  tags = {
    Name        = "speakprep-ai-task"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# ECS AI Service
# ==========================================

resource "aws_ecs_service" "ai" {
  name            = "speakprep-ai"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.ai.arn

  desired_count = 1
  launch_type   = "FARGATE"

  # ==========================================
  # Network Configuration
  # ==========================================

  network_configuration {
    subnets = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id
    ]

    security_groups = [
      aws_security_group.ai.id
    ]

    assign_public_ip = true
  }

  # ==========================================
  # Internal AI ALB
  # ==========================================

  load_balancer {
    target_group_arn = aws_lb_target_group.ai.arn
    container_name   = "speakprep-ai"
    container_port   = 8000
  }

  tags = {
    Name        = "speakprep-ai-service"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}