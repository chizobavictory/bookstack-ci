resource "kubernetes_secret" "app_secrets" {
  metadata {
    name      = "app-secrets"
    namespace = "bookstack"
  }

  data = {
    jwt-secret = base64encode(var.jwt_secret)
    mongo-uri  = base64encode(var.mongo_uri)
    aws-access-key-id     = var.aws_access_key_id
    aws-secret-access-key = var.aws_secret_access_key
  }

  type = "Opaque"
}

resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = "bookstack"
  }

  data = {
    NODE_ENV = "production"
    PORT     = "5000"
  }
}
