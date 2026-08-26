# ==========================================
# RDS Database Secret
# ==========================================

resource "aws_secretsmanager_secret" "database" {
  name = "speakprep/database"

  tags = {
    Name        = "speakprep-database-secret"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id = aws_secretsmanager_secret.database.id

  secret_string = jsonencode({
    DATABASE_URL = "postgresql://speakprep:${var.db_password}@${aws_db_instance.postgres.address}:5432/speakprep"
  })
}

# ==========================================
# SpeakPrep Web Application Secret
# ==========================================

resource "aws_secretsmanager_secret" "web" {
  name = "speakprep/web"

  tags = {
    Name        = "speakprep-web-secret"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}

resource "aws_secretsmanager_secret_version" "web" {
  secret_id = aws_secretsmanager_secret.web.id

  secret_string = jsonencode({
    OPENAI_API_KEY = var.openai_api_key
    JWT_SECRET     = var.jwt_secret
    AI_API_KEY     = var.ai_api_key
    AI_BASE_URL    = var.ai_base_url
  })
}