# ==========================================
# RDS Subnet Group
# ==========================================

resource "aws_db_subnet_group" "main" {
  name = "speakprep-db-subnet-group"

  subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name        = "speakprep-db-subnet-group"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# RDS PostgreSQL
# ==========================================

resource "aws_db_instance" "postgres" {
  identifier = "speakprep-postgres"

  engine         = "postgres"
  engine_version = "16"

  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 50
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "speakprep"
  username = "speakprep"
  password = var.db_password

  port = 5432

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false

  backup_retention_period = 7

  skip_final_snapshot = true

  deletion_protection = false

  tags = {
    Name        = "speakprep-postgres"
    Application = "SpeakPrepAI"
    Component   = "database"
    ManagedBy   = "Terraform"
  }
}