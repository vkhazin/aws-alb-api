module "sg_acct" {
  source       = "../modules/tf-sg/acct"
  vpc_id       = "${var.vpc_id}"
  tags         = "${var.tags}"
  SG_Name      = "ACCT_SG"
  ecp_services = "${module.sg_ecp_services.sg_id}"
  vpc_mgmt     = "${var.sg_ids["vpc_mgmt"]}"
}

module "sg_nodejs_mgw" {
  source   = "../modules/tf-sg/nodejs_mgw"
  vpc_id   = "${var.vpc_id}"
  tags     = "${var.tags}"
  SG_Name  = "MGW-NODEJS_SG"
  vpc_mgmt = "${var.sg_ids["vpc_mgmt"]}"
}

module "sg_nodejs_3pgw" {
  source   = "../modules/tf-sg/nodejs_3pgw"
  vpc_id   = "${var.vpc_id}"
  tags     = "${var.tags}"
  SG_Name  = "3PGW-NODEJS_SG"
  vpc_mgmt = "${var.sg_ids["vpc_mgmt"]}"
}

module "sg_cassandra" {
  source       = "../modules/tf-sg/cassandra"
  vpc_id       = "${var.vpc_id}"
  tags         = "${var.tags}"
  SG_Name      = "CASSANDRA_SG"
  ecp_services = "${module.sg_ecp_services.sg_id}"
  vpc_mgmt     = "${var.sg_ids["vpc_mgmt"]}"
  acct         = "${module.sg_acct.sg_id}"
  ecp_mgmt     = "${module.sg_ecp_mgmt.sg_id}"
}

module "sg_terraform" {
  source   = "../modules/tf-sg/tf"
  vpc_id   = "${var.vpc_id}"
  tags     = "${var.tags}"
  SG_Name  = "TF_SG"
  vpc_mgmt = "${var.sg_ids["vpc_mgmt"]}"
}

module "sg_ecp_mgmt" {
  source       = "../modules/tf-sg/mgm"
  vpc_id       = "${var.vpc_id}"
  tags         = "${var.tags}"
  SG_Name      = "MGM_SG"
  ecp_services = "${module.sg_ecp_services.sg_id}"
  vpc_mgmt     = "${var.sg_ids["vpc_mgmt"]}"
  acct         = "${module.sg_acct.sg_id}"
  mcd_networks = "${var.mcd_networks}"
}

module "sg_ecp_services" {
  source   = "../modules/tf-sg/ecp"
  vpc_id   = "${var.vpc_id}"
  tags     = "${var.tags}"
  SG_Name  = "SERVICES_SGSERVICES_SG"
  vpc_mgmt = "${var.sg_ids["vpc_mgmt"]}"
  acct     = "${module.sg_acct.sg_id}"
}

module "sg_ecp_mock" {
  source   = "../modules/tf-sg/mock"
  vpc_id   = "${var.vpc_id}"
  tags     = "${var.tags}"
  SG_Name  = "MOCK_SG"
  vpc_mgmt = "${var.sg_ids["vpc_mgmt"]}"
}

module "sg_rabbitmq" {
  source       = "../modules/tf-sg/rabbitmq"
  vpc_id       = "${var.vpc_id}"
  tags         = "${var.tags}"
  SG_Name      = "RABBITMQ_SG"
  vpc_mgmt     = "${var.sg_ids["vpc_mgmt"]}"
  ecp_mgmt     = "${module.sg_ecp_mgmt.sg_id}"
  nodejs_mgw   = "${module.sg_nodejs_mgw.sg_id}"
  nodejs_3pgw  = "${module.sg_nodejs_3pgw.sg_id}"
  ecp_services = "${module.sg_ecp_services.sg_id}"
  ecp_mock     = "${module.sg_ecp_mock.sg_id}"
  acct         = "${module.sg_acct.sg_id}"
  rst          = "${module.sg_nodejs_rst.sg_id}"
}

module "sg_redis" {
  source       = "../modules/tf-sg/redis"
  vpc_id       = "${var.vpc_id}"
  tags         = "${var.tags}"
  SG_Name      = "REDIS_SG"
  vpc_mgmt     = "${var.sg_ids["vpc_mgmt"]}"
  nodejs_mgw   = "${module.sg_nodejs_mgw.sg_id}"
  nodejs_3pgw  = "${module.sg_nodejs_3pgw.sg_id}"
  ecp_services = "${module.sg_ecp_services.sg_id}"
  acct         = "${module.sg_acct.sg_id}"
  ecp_mgmt     = "${module.sg_ecp_mgmt.sg_id}"
}

module "sg_sql" {
  source       = "../modules/tf-sg/sql"
  vpc_id       = "${var.vpc_id}"
  tags         = "${var.tags}"
  SG_Name      = "SQL_SG"
  ecp_services = "${module.sg_ecp_services.sg_id}"
  acct         = "${module.sg_acct.sg_id}"
  ecp_mgmt     = "${module.sg_ecp_mgmt.sg_id}"
  vpc_mgmt     = "${var.sg_ids["vpc_mgmt"]}"
}

module "sg_nodejs_rst" {
  source  = "../modules/tf-sg/nodejs_rst"
  vpc_id  = "${var.vpc_id}"
  tags    = "${var.tags}"
  SG_Name = "RST-NODEJS_SG"

  vpc_mgmt = "${var.sg_ids["vpc_mgmt"]}"
}
