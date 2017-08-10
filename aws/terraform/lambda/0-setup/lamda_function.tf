# ## Requires a IAM role that has desribe EC2 and CREATE TAG
# resource "aws_lambda_function" "tagging_lambda" {
#   filename         = "tagging_lamda.zip"
#   function_name    = "ECP-TAG-Resources"
#   role             = "arn:aws:iam::811322200214:role/TestIAMLamda"
#   handler          = "lamda_tag_code.my_handler"
#   source_code_hash = "${file("tagging_lamda.zip")}"
#   runtime          = "python3.6"
# }

## Requires a IAM role that has desribe EC2 and CREATE TAG
resource "aws_lambda_function" "alb_api_lambda" {
  filename         = "alb_lambda.zip"
  function_name    = "AECP-PERF8-ALB-API"
  role             = "arn:aws:iam::811322200214:role/smith-poc-albapi-lambda-role"
  handler          = "lambda.handler"
  source_code_hash = "${file("alb_lambda.zip")}"
  runtime          = "nodejs6.10"
}

resource "aws_lambda_permission" "allow-api-gateway-parent-resource-get" {
    function_name = "${aws_lambda_function.alb_api_lambda.function_name}"
    statement_id = "allow-api-gateway-parent-resource-get"
    action = "lambda:InvokeFunction"
    principal = "apigateway.amazonaws.com"
    source_arn = "arn:aws:execute-api:us-east-1:811322200214:${aws_api_gateway_rest_api.alb_api_lambda.id}/*/${aws_api_gateway_method.get_account.http_method}${aws_api_gateway_resource.accounts.path}"
}

resource "aws_api_gateway_rest_api" "alb_api_lambda" {
  name        = "Cole_Test_API_Deploy"
  description = "This is my API for demonstration purposes"
}

// List
resource "aws_api_gateway_resource" "accounts" {
    rest_api_id = "${aws_api_gateway_rest_api.alb_api_lambda.id}"
    parent_id = "${aws_api_gateway_rest_api.alb_api_lambda.root_resource_id}"
    path_part = "{proxy}"

    
}

resource "aws_api_gateway_method" "get_account" {
  rest_api_id = "${aws_api_gateway_rest_api.alb_api_lambda.id}"
  resource_id = "${aws_api_gateway_resource.accounts.id}"
  http_method = "POST"
  authorization = "NONE"

  request_parameters {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "get_account_integration" {
    rest_api_id = "${aws_api_gateway_rest_api.alb_api_lambda.id}"
    resource_id = "${aws_api_gateway_resource.accounts.id}"
    http_method = "${aws_api_gateway_method.get_account.http_method}"
    type = "AWS_PROXY"
    integration_http_method = "ANY"
    uri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:811322200214:function:AECP-PERF8-ALB-API/invocations"
    passthrough_behavior = "WHEN_NO_MATCH"

    request_parameters {
      "integration.request.path.id" = "method.request.path.proxy"
    }
}

resource "aws_api_gateway_method_response" "200" {
    rest_api_id = "${aws_api_gateway_rest_api.alb_api_lambda.id}"
    resource_id = "${aws_api_gateway_resource.accounts.id}"
    http_method = "${aws_api_gateway_method.get_account.http_method}"
    status_code = "200"

    response_models = {
         "application/json" = "Empty"
    }
}

resource "aws_api_gateway_integration_response" "MyDemoIntegrationResponse" {
   rest_api_id = "${aws_api_gateway_rest_api.alb_api_lambda.id}"
   resource_id = "${aws_api_gateway_resource.accounts.id}"
   http_method = "${aws_api_gateway_method.get_account.http_method}"
   status_code = "${aws_api_gateway_method_response.200.status_code}"

   response_templates = {
       "application/json" = ""
   } 
}