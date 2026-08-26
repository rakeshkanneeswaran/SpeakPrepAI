resource "aws_ecr_repository" "web" {
  name                 = "speakprep-web"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "speakprep-web"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}

resource "aws_ecr_repository" "ai" {
  name                 = "speakprep-ai"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name        = "speakprep-ai"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}


# ==========================================
# ECR — Web Migration
# ==========================================

resource "aws_ecr_repository" "web_migration" {
  name                 = "speakprep-web-migration"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "speakprep-web-migration"
    Application = "SpeakPrepAI"
    Component   = "database"
    ManagedBy   = "Terraform"
  }
}