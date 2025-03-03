resource "aws_security_group" "eks_cluster_sg" {
  vpc_id = var.vpc_id
  name   = "eks-cluster-sg"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}