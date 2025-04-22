# SSM Parameter to store the backend API URL for frontend reference
resource "aws_ssm_parameter" "backend_url" {
  name        = "/url-shortener/backend-url"
  description = "URL for the backend API endpoint"
  type        = "String"
  # Use your existing Elastic Beanstalk environment's endpoint URL
  # If you're using a different variable or resource name, adjust this reference
  value       = aws_elastic_beanstalk_environment.url_shortener_env.endpoint_url
}

# SSM Parameter to store the CloudFront distribution domain for frontend reference
resource "aws_ssm_parameter" "frontend_url" {
  name        = "/url-shortener/frontend-url"
  description = "CloudFront distribution domain for the frontend"
  type        = "String"
  value       = aws_cloudfront_distribution.frontend.domain_name
}