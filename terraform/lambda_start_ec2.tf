resource "aws_iam_role" "iam_role_for_start_ec2" {
  name               = "discord_mc2_start_ec2"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "logging_policy_attachment_for_start_ec2" {
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
  role       = aws_iam_role.iam_role_for_start_ec2.name
}

resource "aws_iam_role_policy_attachment" "start_ec2_policy_attachment_for_start_ec2" {
  policy_arn = aws_iam_policy.lambda_start_ec2_policy.arn
  role       = aws_iam_role.iam_role_for_start_ec2.name
}

resource "aws_iam_role_policy_attachment" "create_record_policy_attachment_for_start_ec2" {
  policy_arn = aws_iam_policy.lambda_create_route53_record_policy.arn
  role       = aws_iam_role.iam_role_for_start_ec2.name
}

data "archive_file" "source_code_start_ec2" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/start_ec2"
  output_path = "${path.module}/../dist/lambda_function_payload_start_ec2.zip"
}

resource "aws_lambda_function" "discord_mc2_start_ec2" {
  filename      = "${path.module}/../dist/lambda_function_payload_start_ec2.zip"
  function_name = "discord_mc2_start_ec2"
  role          = aws_iam_role.iam_role_for_start_ec2.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.source_code_start_ec2.output_base64sha256

  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  timeout       = 60

  environment {
    variables = {
      EC2_INSTANCE_ID = var.ec2_instance_id
      HOSTED_ZONE_ID  = var.route53_hosted_zone_id
      DOMAIN_NAME     = var.route53_server_domain
    }
  }
}
