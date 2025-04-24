variable "s3_bucket_name" {
  description = "Name of the S3 bucket to be used as origin"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  type        = string
}

variable "s3_bucket_regional_domain" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}

variable "team_name" {
  description = "Team name for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, qa, etc.)"
  type        = string
  default     = "dev"
}

variable "product" {
  description = "Product identifier"
  type        = string
}

variable "purpose" {
  description = "Purpose of the resources"
  type        = string
}
