terraform {
  backend "s3" {
    bucket         = "bookstack-eks"
    key            = "test/eks-cluster/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "bookstack-eks"
    encrypt        = true
  }
}
