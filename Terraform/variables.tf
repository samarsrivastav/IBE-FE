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

variable "logging_bucket" {
  description = "Existing S3 bucket for storing access logs"
  type        = string
}
