# ==========================================
# VPC
# ==========================================

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "speakprep-vpc"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Internet Gateway
# ==========================================

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "speakprep-igw"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Public Subnet A
# ==========================================

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "speakprep-public-a"
    Type        = "Public"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Public Subnet B
# ==========================================

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "speakprep-public-b"
    Type        = "Public"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Public Route Table
# ==========================================

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "speakprep-public-rt"
    Type        = "Public"
    Application = "SpeakPrepAI"
    ManagedBy   = "Terraform"
  }
}

# ==========================================
# Route Table Association - Subnet A
# ==========================================

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

# ==========================================
# Route Table Association - Subnet B
# ==========================================

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}