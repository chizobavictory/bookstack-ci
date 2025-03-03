resource "kubernetes_deployment" "bookstack" {
  metadata {
    name = "bookstack-backend"
    namespace = "bookstack"
  }

  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "bookstack"
      }
    }

    template {
      metadata {
        labels = {
          app = "bookstack"
        }
      }

      spec {
        container {
          image = "your-docker-image-url"
          name  = "bookstack"
          port {
            container_port = 5000
          }
        }
      }
    }
  }
}
