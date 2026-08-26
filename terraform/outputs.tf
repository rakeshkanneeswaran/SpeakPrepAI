output "web_ecr_repository_url" {
  description = "ECR repository URL for the SpeakPrepAI web application"
  value       = aws_ecr_repository.web.repository_url
}

output "ai_ecr_repository_url" {
  description = "ECR repository URL for the SpeakPrepAI AI service"
  value       = aws_ecr_repository.ai.repository_url
}
output "vpc_id" {
  description = "ID of the SpeakPrepAI VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_a_id" {
  description = "ID of public subnet A"
  value       = aws_subnet.public_a.id
}

output "public_subnet_b_id" {
  description = "ID of public subnet B"
  value       = aws_subnet.public_b.id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "alb_security_group_id" {
  description = "Security group ID for the Application Load Balancer"
  value       = aws_security_group.alb.id
}

output "web_security_group_id" {
  description = "Security group ID for Web ECS tasks"
  value       = aws_security_group.web.id
}

output "ai_security_group_id" {
  description = "Security group ID for AI ECS tasks"
  value       = aws_security_group.ai.id
}

output "rds_security_group_id" {
  description = "Security group ID for RDS PostgreSQL"
  value       = aws_security_group.rds.id
}

# ==========================================
# ECS Outputs
# ==========================================

output "ecs_cluster_id" {
  description = "ECS cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "web_log_group" {
  description = "CloudWatch log group for Web service"
  value       = aws_cloudwatch_log_group.web.name
}

output "ai_log_group" {
  description = "CloudWatch log group for AI service"
  value       = aws_cloudwatch_log_group.ai.name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_address" {
  description = "RDS PostgreSQL hostname"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.postgres.port
}

output "web_target_group_arn" {
  description = "ARN of the Web ECS target group"
  value       = aws_lb_target_group.web.arn
}

output "alb_dns_name" {
  description = "DNS name of the SpeakPrepAI ALB"
  value       = aws_lb.main.dns_name
}

# ==========================================
# Redis
# ==========================================

output "redis_address" {
  description = "Redis endpoint address"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_cluster.redis.port
}

output "redis_security_group_id" {
  description = "Redis security group ID"
  value       = aws_security_group.redis.id
}

output "ai_alb_dns_name" {
  description = "Internal AI ALB DNS name"
  value       = aws_lb.ai.dns_name
}