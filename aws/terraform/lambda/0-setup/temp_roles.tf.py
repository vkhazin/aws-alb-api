
resource "aws_iam_role" "ecp_mssql" {
    name = "ECP-MSSQL"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role" "ecp_cassandra" {
    name = "ECP-Cassandra"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}


resource "aws_iam_role" "ecp_ecpsvc" {
    name = "ECP-ECPSVC"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "ecp_mssql" {
    name = "ECP-MSSQL"
    roles = ["${aws_iam_role.ecp_mssql.name}"]
}

resource "aws_iam_instance_profile" "ecp_cassandra" {
    name = "ECP-Cassandra"
    roles = ["${aws_iam_role.ecp_cassandra.name}"]
}

resource "aws_iam_instance_profile" "ecp_ecpsvc" {
    name = "ECP-ECPSVC"
    roles = ["${aws_iam_role.ecp_ecpsvc.name}"]
}
