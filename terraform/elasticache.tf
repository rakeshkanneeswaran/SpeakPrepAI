# ==========================================
# ElastiCache Redis Subnet Group
# ==========================================

resource "aws_elasticache_subnet_group" "redis" {
  name = "speakprep-redis-subnet-group"

  subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name        = "speakprep-redis-subnet-group"
    Application = "SpeakPrepAI"
    Component   = "cache"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Redis Security Group
# ==========================================

resource "aws_security_group" "redis" {
  name        = "speakprep-redis-sg"
  description = "Security group for SpeakPrep Redis"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "speakprep-redis-sg"
    Application = "SpeakPrepAI"
    Component   = "cache"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Allow AI ECS → Redis
# ==========================================

resource "aws_vpc_security_group_ingress_rule" "redis_from_ai" {
  security_group_id = aws_security_group.redis.id

  referenced_security_group_id = aws_security_group.ai.id

  ip_protocol = "tcp"
  from_port   = 6379
  to_port     = 6379

  description = "Allow AI ECS tasks to access Redis"
}

# ==========================================
# Redis Outbound
# ==========================================

resource "aws_vpc_security_group_egress_rule" "redis_all_outbound" {
  security_group_id = aws_security_group.redis.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow Redis outbound traffic"
}

# ==========================================
# ElastiCache Redis
# ==========================================

resource "aws_elasticache_cluster" "redis" {
  cluster_id = "speakprep-redis"

  engine    = "redis"
  node_type = "cache.t3.micro"

  num_cache_nodes = 1

  port = 6379

  subnet_group_name = aws_elasticache_subnet_group.redis.name

  security_group_ids = [
    aws_security_group.redis.id
  ]

  tags = {
    Name        = "speakprep-redis"
    Application = "SpeakPrepAI"
    Component   = "cache"
    ManagedBy   = "Terraform"
  }
}