# ==========================================
# Application Load Balancer
# ==========================================

resource "aws_lb" "main" {
  name               = "speakprep-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  enable_deletion_protection = false

  tags = {
    Name        = "speakprep-alb"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}


# ==========================================
# Web Target Group
# ==========================================

resource "aws_lb_target_group" "web" {
  name        = "speakprep-web-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"

  vpc_id = aws_vpc.main.id

  health_check {
    enabled             = true
    path                = "/"
    protocol            = "HTTP"
    port                = "3000"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
  }

  tags = {
    Name        = "speakprep-web-tg"
    Application = "SpeakPrepAI"
    Component   = "web"
    ManagedBy   = "Terraform"
  }
}


# ==========================================
# HTTP Listener
# ==========================================

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}