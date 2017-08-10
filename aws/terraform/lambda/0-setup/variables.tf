variable "vpc_id" {}

variable "environment" {}

variable "sg_ids" {
  default = {}
}

variable "keyname" {}

variable "mcd_networks" {}

variable "region" {}

variable "credentials_file" {}

variable "aws_profile" {}

variable "tags" {
  default = {}
}

variable "envprefix" {}

variable "key_file" {}

#Chef info
variable "chef_validation_client_name" {}

variable "chef_url" {}

variable "chef_env" {}

variable "chef_validation_key" {}

variable "chef_key_path" {}

variable "chef_private_key_pem" {}

variable "chef_knife_name" {}

variable "chef_client_name" {}

variable "ecp_version" {}

variable "nugeturl" {}

variable "key_path" {}

variable "domain" {}

variable "domain_zone_id" {}

variable "ad_domain" {}

variable "witnessdns" {}

variable "sqldns" {}

variable "s3_remotestate_bucketname" {}

variable "sql" {
  default = {
    cluster_name = ""
  }
}

variable "sql-witness" {
  default = {
    cluster_name = ""
  }
}

variable "cassandra" {
  default = {
    cluster_name = ""
  }
}

variable "opscenter" {
  default = {
    cluster_name = ""
  }
}

variable "spark" {
  default = {
    cluster_name = ""
  }
}

variable "rabbitmq" {
  default = {
    cluster_name = ""
  }
}

variable "redis" {
  default = {
    cluster_name = ""
  }
}
