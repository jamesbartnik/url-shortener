resource "aws_ecr_repository" "url_shortener_backend" {
  name                 = "url-shortener-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "url-shortener-backend-repo"
    Environment = var.environment
  }
}