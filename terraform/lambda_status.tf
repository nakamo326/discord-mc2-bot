resource "aws_iam_role" "iam_role_for_status" {
  name               = "discord_mc2_status"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "logging_policy_attachment_for_status" {
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
  role       = aws_iam_role.iam_role_for_status.name
}

data "archive_file" "source_code_status" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/status"
  output_path = "${path.module}/../dist/lambda_function_payload_status.zip"
}

resource "aws_lambda_function" "discord_mc2_status" {
  filename      = "${path.module}/../dist/lambda_function_payload_status.zip"
  function_name = "discord_mc2_status"
  role          = aws_iam_role.iam_role_for_status.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.source_code_status.output_base64sha256

  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  timeout       = 10

  environment {
    variables = {
      DOMAIN_NAME = var.route53_server_domain
    }
  }
}
