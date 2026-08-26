# ==========================================
# Internal AI ALB Security Group
# ==========================================

resource "aws_security_group" "ai_alb" {
  name        = "speakprep-ai-alb-sg"
  description = "Security group for internal SpeakPrep AI ALB"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "speakprep-ai-alb-sg"
    Application = "SpeakPrepAI"
    Component   = "ai-alb"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Allow Web ECS → AI ALB
# ==========================================

resource "aws_vpc_security_group_ingress_rule" "ai_alb_from_web" {
  security_group_id            = aws_security_group.ai_alb.id
  referenced_security_group_id = aws_security_group.web.id

  ip_protocol = "tcp"
  from_port   = 8000
  to_port     = 8000

  description = "Allow Web ECS to access AI ALB"
}

# ==========================================
# AI ALB Outbound
# ==========================================

resource "aws_vpc_security_group_egress_rule" "ai_alb_all_outbound" {
  security_group_id = aws_security_group.ai_alb.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

  description = "Allow AI ALB outbound traffic"
}

# ==========================================
# Internal AI Application Load Balancer
# ==========================================

resource "aws_lb" "ai" {
  name               = "speakprep-ai-alb"
  internal           = true
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.ai_alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name        = "speakprep-ai-alb"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# AI Target Group
# ==========================================

resource "aws_lb_target_group" "ai" {
  name        = "speakprep-ai-tg"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    enabled             = true
    path                = "/health"
    protocol            = "HTTP"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = {
    Name        = "speakprep-ai-tg"
    Application = "SpeakPrepAI"
    Component   = "ai"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Allow AI ALB → AI ECS
# ==========================================

resource "aws_vpc_security_group_ingress_rule" "ai_from_alb" {
  security_group_id            = aws_security_group.ai.id
  referenced_security_group_id = aws_security_group.ai_alb.id

  ip_protocol = "tcp"
  from_port   = 8000
  to_port     = 8000

  description = "Allow AI ALB to access AI ECS"
}

# ==========================================
# AI ALB Listener
# ==========================================

resource "aws_lb_listener" "ai" {
  load_balancer_arn = aws_lb.ai.arn
  port              = 8000
  protocol          = "HTTP"

  default_action {
    type = "forward"

    forward {
      target_group {
        arn = aws_lb_target_group.ai.arn
      }
    }
  }
}