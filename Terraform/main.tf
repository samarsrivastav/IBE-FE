module "s3" {
  source      = "./modules/s3"
  team_name    = var.team_name
  environment = var.environment
  product     = var.product
  purpose     = var.purpose
  logging_bucket = var.logging_bucket
}

module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_name              = module.s3.bucket_name
  s3_bucket_arn               = module.s3.bucket_arn
  s3_bucket_regional_domain   = module.s3.bucket_regional_domain_name

  team_name   = var.team_name
  environment = var.environment
  product     = var.product
  purpose     = var.purpose
}
