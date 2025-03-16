locals {
  common_tags = {
    Name                 = var.s3_bucket_name
    Env                  = var.environment
    "Project/Application" = var.product
    team                 = var.team_name
    Purpose              = var.purpose
    Product              = var.product
  }
}

# Create CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.s3_bucket_name}"
}

# Create S3 Bucket Policy to allow CloudFront access only
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = var.s3_bucket_name

  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess",
        Effect    = "Allow",
        Principal = { AWS = aws_cloudfront_origin_access_identity.oai.iam_arn },
        Action    = "s3:GetObject",
        Resource  = "${var.s3_bucket_arn}/*"
      }
    ]
  })
}

# Create CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for ${var.s3_bucket_name}"
  default_root_object = "index.html"

  origin {
    domain_name = var.s3_bucket_regional_domain
    origin_id   = "s3-${var.s3_bucket_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-${var.s3_bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.common_tags
}


