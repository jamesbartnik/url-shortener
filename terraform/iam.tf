# Elastic Beanstalk Service Role
resource "aws_iam_role" "elasticbeanstalk_service_role" {
  name = "url-shortener-elasticbeanstalk-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "elasticbeanstalk.amazonaws.com"
        }
      }
    ]
  })
}

# Attach Elastic Beanstalk Service Policy
resource "aws_iam_role_policy_attachment" "elasticbeanstalk_service_role" {
  role       = aws_iam_role.elasticbeanstalk_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk"
}

# EC2 Instance Profile Role
resource "aws_iam_role" "elasticbeanstalk_ec2_role" {
  name = "url-shortener-elasticbeanstalk-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Attach Web Tier Policy to EC2 Role
resource "aws_iam_role_policy_attachment" "elasticbeanstalk_web_tier" {
  role       = aws_iam_role.elasticbeanstalk_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

# Attach Worker Tier Policy to EC2 Role (Optional)
resource "aws_iam_role_policy_attachment" "elasticbeanstalk_worker_tier" {
  role       = aws_iam_role.elasticbeanstalk_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

# Additional policy for EC2 role to allow reading from ECR
resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  role       = aws_iam_role.elasticbeanstalk_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# Create instance profile
resource "aws_iam_instance_profile" "elasticbeanstalk_profile" {
  name = "url-shortener-elasticbeanstalk-profile"
  role = aws_iam_role.elasticbeanstalk_ec2_role.name
}