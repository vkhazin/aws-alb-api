provider "aws" {
  region                  = "${var.region}"
  shared_credentials_file = "${var.credentials_file}"
  profile                 = "${var.aws_profile}"
}

provider "chef" {
  server_url           = "${var.chef_url}/"
  client_name          = "${var.chef_client_name}"
  key_material         = "${file("${var.chef_key_path}${var.chef_private_key_pem}")}"
  allow_unverified_ssl = true
}
