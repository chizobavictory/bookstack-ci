# Terraform Settings Block
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.31"
    }

    kubernetes = {
      source = "hashicorp/kubernetes"
      #version = "~> 2.7"
      version = ">= 2.20"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }

    time = {
      source  = "hashicorp/time"
      version = "~> 0.7"
    }

    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}
