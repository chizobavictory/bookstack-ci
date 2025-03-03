terraform {
  backend "s3" {
    bucket  = var.remote_data_s3_bucket
    key     = "${var.environment}/eks-cluster/terraform.tfstate"
    region  = var.aws_region
    dynamodb_table = "${var.environment}-ekscluster"
    encrypt        = true
  }
}