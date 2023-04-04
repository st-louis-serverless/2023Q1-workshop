import { Context } from 'aws-lambda'

export interface LineItem {
  productId: string
  productName: string
  quantity: number
  salePrice: number
}

export interface Cart {
  lineItems: LineItem[]
}

export interface Shipping {
  contactName: string
  streetAddress: string
  city: string
  state: string
  zipcode: string
}

export interface Order {
  orderId: string
  customerId: string
  orderDate: string
  cart: Cart
  shipping: Shipping
}

export type ResponsePayload = {
  message: string
  event?: any
  context?: Context
  data?: any
}
