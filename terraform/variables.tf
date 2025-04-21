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