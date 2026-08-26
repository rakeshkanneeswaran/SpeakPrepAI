# ==========================================
# Web Application Logs
# ==========================================

resource "aws_cloudwatch_log_group" "web" {
  name              = "/ecs/speakprep-web"
  retention_in_days = 7

  tags = {
    Name        = "speakprep-web-logs"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# AI Service Logs
# ==========================================

resource "aws_cloudwatch_log_group" "ai" {
  name              = "/ecs/speakprep-ai"
  retention_in_days = 7

  tags = {
    Name        = "speakprep-ai-logs"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}