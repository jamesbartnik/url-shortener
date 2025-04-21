resource "aws_dynamodb_table" "url_shortener" {
  name           = "UrlShortener"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "shortCode"

  attribute {
    name = "shortCode"
    type = "S"
  }

  attribute {
    name = "originalUrl"
    type = "S"
  }

  global_secondary_index {
    name            = "OriginalUrlIndex"
    hash_key        = "originalUrl"
    projection_type = "ALL"
  }

  tags = {
    Name        = "url-shortener-table"
    Environment = var.environment
  }
}