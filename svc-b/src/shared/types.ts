export interface ITransfer {
  amount: number;
  fromUser: string;
  toUser: string;
  referenceID: string;
}

export interface IOrder {
  id: string;
  productId: number;
  price: number;
}
