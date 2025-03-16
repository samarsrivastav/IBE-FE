terraform {
  backend "s3" {
    bucket         = "genwin-state-bucket"
    key            = "genwin/backend/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "genwin-state-table"
  }
}

provider "aws" {
  region = "ap-south-1"
}
