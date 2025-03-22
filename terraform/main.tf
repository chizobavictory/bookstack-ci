module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "4.0.0" # or a higher 4.x/5.x version that doesn’t reference ClassicLink

  name = "bookstack-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Name = "bookstack-vpc"
  }
}



module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "19.17.0" 
  cluster_name    = var.cluster_name
  cluster_version = "1.27"
  vpc_id          = module.vpc.vpc_id
  # Use the private subnets for worker nodes
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    default = {
      desired_size   = 1
      min_size       = 1
      max_size       = 2
      instance_types = ["t3.medium"]
      ami_type       = "AL2_x86_64"
      key_name       = var.key_name
    }
  }
}


