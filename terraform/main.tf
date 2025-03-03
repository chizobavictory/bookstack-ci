module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "19.17.0" 
  cluster_name    = var.cluster_name
  cluster_version = "1.27"
  subnet_ids      = var.subnet_ids
  vpc_id          = var.vpc_id

  eks_managed_node_groups = {
    default = {
      desired_size = 1
      min_size     = 1
      max_size     = 2

      instance_types = ["t3.medium"]
      ami_type       = "AL2_x86_64"
      key_name       = var.key_name
    }
  }
}

