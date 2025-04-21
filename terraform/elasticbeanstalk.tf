resource "aws_elastic_beanstalk_application" "url_shortener" {
  name        = "url-shortener"
  description = "URL Shortener Application"
}

resource "aws_elastic_beanstalk_environment" "url_shortener_env" {
  name                = "url-shortener-env"
  application         = aws_elastic_beanstalk_application.url_shortener.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.5.0 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.elasticbeanstalk_profile.name
  }

  # Environment variables
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "3000"
  }

  # Add more environment variables as needed
}