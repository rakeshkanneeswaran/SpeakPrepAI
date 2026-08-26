# ==========================================
# ALB Security Group
# ==========================================

resource "aws_security_group" "alb" {
  name        = "speakprep-alb-sg"
  description = "Security group for SpeakPrepAI Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "speakprep-alb-sg"
    Application = "SpeakPrepAI"
    Component   = "alb"
    ManagedBy   = "Terraform"
  }
}

# HTTP - Public
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"

  description = "Allow HTTP traffic from the internet"
}

# HTTPS - Public
resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 443
  to_port     = 443
  ip_protocol = "tcp"

  description = "Allow HTTPS traffic from the internet"
}

# Outbound
resource "aws_vpc_security_group_egress_rule" "alb_all_outbound" {
  security_group_id = aws_security_group.alb.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow outbound traffic"
}


# ==========================================
# Web ECS Security Group
# ==========================================

resource "aws_security_group" "web" {
  name        = "speakprep-web-sg"
  description = "Security group for SpeakPrepAI Web ECS tasks"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "speakprep-web-sg"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}

# Web traffic ONLY from ALB
resource "aws_vpc_security_group_ingress_rule" "web_from_alb" {
  security_group_id = aws_security_group.web.id

  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = 3000
  to_port                      = 3000
  ip_protocol                  = "tcp"

  description = "Allow Next.js traffic from ALB"
}

# Outbound
resource "aws_vpc_security_group_egress_rule" "web_all_outbound" {
  security_group_id = aws_security_group.web.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow outbound traffic"
}


# ==========================================
# AI ECS Security Group
# ==========================================

resource "aws_security_group" "ai" {
  name        = "speakprep-ai-sg"
  description = "Security group for SpeakPrepAI AI ECS tasks"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "speakprep-ai-sg"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}

# AI traffic ONLY from Web ECS
resource "aws_vpc_security_group_ingress_rule" "ai_from_web" {
  security_group_id = aws_security_group.ai.id

  referenced_security_group_id = aws_security_group.web.id
  from_port                    = 8000
  to_port                      = 8000
  ip_protocol                  = "tcp"

  description = "Allow FastAPI traffic from Web ECS"
}

# Outbound
resource "aws_vpc_security_group_egress_rule" "ai_all_outbound" {
  security_group_id = aws_security_group.ai.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow outbound traffic"
}


# ==========================================
# RDS Security Group
# ==========================================

resource "aws_security_group" "rds" {
  name        = "speakprep-rds-sg"
  description = "Security group for SpeakPrepAI PostgreSQL RDS"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "speakprep-rds-sg"
    Application = "SpeakPrepAI"
    Component   = "database"
    ManagedBy   = "Terraform"
  }
}

# PostgreSQL ONLY from Web ECS
resource "aws_vpc_security_group_ingress_rule" "rds_from_web" {
  security_group_id = aws_security_group.rds.id

  referenced_security_group_id = aws_security_group.web.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"

  description = "Allow PostgreSQL traffic from Web ECS"
}

# Outbound
resource "aws_vpc_security_group_egress_rule" "rds_all_outbound" {
  security_group_id = aws_security_group.rds.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow outbound traffic"
}

resource "aws_vpc_security_group_ingress_rule" "rds_local_dev" {
  security_group_id = aws_security_group.rds.id

  cidr_ipv4   = "152.59.3.5/32"
  from_port   = 5432
  to_port     = 5432
  ip_protocol = "tcp"

  description = "Temporary access from Rakesh local Mac for Prisma migrations"
}