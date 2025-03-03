variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "The AWS profile to use"
  type        = string
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID"
  type        = string
  sensitive   = false
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = false
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
}

variable "environment" {
  description = "Environment Variable used as a prefix"
  type        = string
}

variable "key_name" {
  description = "SSH key name for the nodes"
  type        = string
}

variable "jwt_secret" {
  description = "JWT Secret Key"
  type        = string
  sensitive   = false
}

variable "mongo_uri" {
  description = "MongoDb URL"
  type        = string
  sensitive   = false
}

variable "remote_data_s3_bucket" {
  description = "remote data s3 bucket"
  type        = string
}
