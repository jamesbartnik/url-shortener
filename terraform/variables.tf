variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "development"
}

variable "application_name" {
  description = "Name of the application"
  type        = string
  default     = "url-shortener"
}

variable "frontend_bucket_name" {
  description = "Name for the S3 bucket that will host the frontend"
  type        = string
  default     = "url-shortener-frontend-us-west-2"  # Or another unique name
}