# ==========================================
# ECS Cluster
# ==========================================

resource "aws_ecs_cluster" "main" {
  name = "speakprep-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "speakprep-cluster"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}