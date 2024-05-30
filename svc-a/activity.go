package svc_a

import (
	"context"
	"fmt"
)

func TransferMoney(ctx context.Context, transfer Transfer) (string, error) {
	str := fmt.Sprintf(
		"\nTransfer $%f from user %s to user %s ReferenceId: %s\n",
		transfer.Amount,
		transfer.FromUser,
		transfer.ToUser,
		transfer.ReferenceID,
	)

	fmt.Println(str)

	return str, nil
}
