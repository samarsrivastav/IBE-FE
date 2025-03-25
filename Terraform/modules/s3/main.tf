locals {
  bucket_name = "${var.team_name}-frontend-${var.environment}"
  common_tags = {
    Name                  = local.bucket_name
    Env                   = var.environment
    "Project/Application" = var.product
    team                  = var.team_name
    Purpose               = var.purpose
    Product               = var.product
  }
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = local.bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  logging {
    target_bucket = var.logging_bucket
    target_prefix = "${local.bucket_name}/"
  }

  tags = local.common_tags
}

