import gql from "graphql-tag";
import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { RouteComponentProps } from "@reach/router";

import { Header, Loading } from "../components";
import { BookTrips, CartItem } from "../containers";
import * as GetCartItemTypes from "./__generated__/GetCartItems";

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

interface CartProps extends RouteComponentProps {}

const Cart: React.FC<CartProps> = () => {
  const { data, loading, error } = useQuery<GetCartItemTypes.GetCartItems>(
    GET_CART_ITEMS
  );

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <>
      <Header>My Cart</Header>
      {!data || (!!data && data.cartItems.length === 0) ? (
        <p data-testid="empty-message">No items in your cart</p>
      ) : (
        <>
          {!!data &&
            data.cartItems.map((launchId: any) => (
              <CartItem key={launchId} launchId={launchId} />
            ))}
          <BookTrips cartItems={!!data ? data.cartItems : []} />
        </>
      )}
    </>
  );
};

export default Cart;
