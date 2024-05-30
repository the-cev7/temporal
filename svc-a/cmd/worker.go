package main

import (
	"log"

	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
	"go.temporal.io/sdk/workflow"

	"svc_a"
)

func main() {
	// Create the client object just once per process
	c, err := client.Dial(client.Options{
		HostPort:  "temporal:7233",
		Namespace: "default",
	})
	if err != nil {
		log.Fatalln("unable to create Temporal client", err)
	}
	defer c.Close()

	w := worker.New(c, "TRANSFER_MONEY_A_TASK_QUEUE", worker.Options{})
	registerWFOptions := workflow.RegisterOptions{
		Name: "transferWorkflow",
	}
	w.RegisterWorkflowWithOptions(svc_a.TransferWorkflow, registerWFOptions)
	w.RegisterActivity(svc_a.TransferMoney)

	// Start listening to the Task Queue
	err = w.Run(worker.InterruptCh())
	if err != nil {
		log.Fatalln("unable to start Worker", err)
	}
}
