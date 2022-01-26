/* eslint-disable */
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import {
  CartItemCreateInput,
  CartItemsCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import StripeConfig from '../lib/stripe';

const graphql = String.raw;
interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // make sure user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order');
  }
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
         id
         quantity
         product {
           name
           price
           description
           id
           photo {
             id
             image {
               id
               publicUrlTransformed
             }
           }
         }
      }
    `,
  });
  console.dir(user, { depth: null });
  // calculate total price of cart
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);
  console.log(amount);
  // create a charge with stripe library
  const charge = await StripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  console.log(charge);
  // convert cartItem to orderItems
  // create order and return it
}

export { checkout };
