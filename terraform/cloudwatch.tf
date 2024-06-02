resource "aws_cloudwatch_event_rule" "discord_mc2_autostop_rule" {
  name        = "discord_mc2_autostop_rule"
  description = "Rule to trigger the Discord MC2 autostop Lambda function"
  // every 2 hours
  schedule_expression = "cron(0 */2 * * ? *)"
}

resource "aws_cloudwatch_event_target" "discord_mc2_autostop_target" {
  rule      = aws_cloudwatch_event_rule.discord_mc2_autostop_rule.name
  target_id = "discord_mc2_autostop_target"
  arn       = aws_lambda_function.discord_mc2_autostop.arn
}

