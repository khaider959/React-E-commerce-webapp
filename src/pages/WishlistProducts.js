import React from 'react'
import { IndividualWishlist } from './IndividualWishlist'

export const WishProducts = ({cartProducts}) => {
  return cartProducts.map((cartProduct)=>(
    <IndividualWishlist key={cartProduct.ID} cartProduct={cartProduct}
    />
  ))
}
