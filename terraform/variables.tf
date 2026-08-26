variable "aws_region" {
  description = "AWS region where SpeakPrepAI infrastructure will be deployed"
  type        = string
  default     = "ap-south-1"
}
variable "db_password" {
  description = "Password for the SpeakPrepAI PostgreSQL database"
  type        = string
  sensitive   = true
}
variable "openai_api_key" {
  description = "OpenAI API key for SpeakPrepAI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret for SpeakPrepAI"
  type        = string
  sensitive   = true
}

variable "ai_api_key" {
  description = "API key used to authenticate with the AI service"
  type        = string
  sensitive   = true
}

variable "ai_base_url" {
  description = "Base URL for the SpeakPrep AI service"
  type        = string
}