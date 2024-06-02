resource "aws_iam_role" "iam_role_for_autostop" {
  name               = "discord_mc2_autostop"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "logging_policy_attachment_for_autostop" {
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
  role       = aws_iam_role.iam_role_for_autostop.name
}

resource "aws_iam_role_policy_attachment" "invoke_policy_attachment_for_autostop" {
  policy_arn = aws_iam_policy.lambda_invoke_policy.arn
  role       = aws_iam_role.iam_role_for_autostop.name
}

data "archive_file" "source_code_autostop" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/autostop"
  output_path = "${path.module}/../dist/lambda_function_payload_autostop.zip"
}

resource "aws_lambda_function" "discord_mc2_autostop" {
  filename      = "${path.module}/../dist/lambda_function_payload_autostop.zip"
  function_name = "discord_mc2_autostop"
  role          = aws_iam_role.iam_role_for_autostop.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.source_code_autostop.output_base64sha256

  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  timeout       = 60

  environment {
    variables = {
      EC2_INSTANCE_ID                = var.ec2_instance_id
      STOP_EC2_INSTANCES_LAMBDA      = aws_lambda_function.discord_mc2_stop_ec2.arn
      STATUS_SERVER_INSTANCES_LAMBDA = aws_lambda_function.discord_mc2_status.arn
    }
  }
}
