variable "aws_region" {
  description = "AWS region for the EKS cluster"
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  default     = "bookstack-ci-cluster"
}

variable "node_group_name" {
  description = "Name of the node group"
  default     = "bookstack-ci-node-group"
}

variable "node_instance_type" {
  description = "EC2 instance type for nodes"
  default     = "t3.medium"
}

variable "desired_capacity" {
  description = "Number of worker nodes"
  default     = 1
}
