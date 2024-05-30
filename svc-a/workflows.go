package svc_a

import (
	"time"

	"go.temporal.io/sdk/workflow"
)

func TransferWorkflow(ctx workflow.Context, transfer Transfer) (string, error) {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 60 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("Compressed Payloads workflow started")

	var result string
	if err := workflow.ExecuteActivity(ctx, TransferMoney, transfer).Get(ctx, &result); err != nil {
		logger.Error("Activity failed.", "Error", err)
		return "", err
	}

	logger.Info("Compressed Payloads workflow completed.", "result", result)

	return result, nil
}
