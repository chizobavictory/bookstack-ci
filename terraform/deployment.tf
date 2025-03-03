resource "kubernetes_deployment" "bookstack" {
  metadata {
    name      = "bookstack-backend"
    namespace = "bookstack"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "bookstack-backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "bookstack-backend"
        }
      }

      spec {
        container {
          name  = "bookstack-backend"
          image = "${aws_ecr_repository.bookstack_repo.repository_url}:version-1.0.0"

          port {
            container_port = 5000
          }

          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = "app-secrets"
                key  = "jwt-secret"
              }
            }
          }

          env {
            name = "MONGO_URI"
            value_from {
              secret_key_ref {
                name = "app-secrets"
                key  = "mongo-uri"
              }
            }
          }
        }
      }
    }
  }
}


resource "aws_ecr_repository" "bookstack_repo" {
  name                 = "bookstack-ci-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "kubernetes_service" "bookstack_service" {
  metadata {
    name      = "bookstack-backend-service"
    namespace = "bookstack"
  }

  spec {
    selector = {
      app = "bookstack-backend"
    }

    port {
      port        = 80
      target_port = 5000
    }

    type = "LoadBalancer"
  }
}
