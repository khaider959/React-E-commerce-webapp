import React from 'react'
import { IndividualProduct } from './individualProduct'

export const Products = ({products,addToCart,addToWishlist,searchTerm,value}) => {
  return products.filter((val) => {
    if(searchTerm == ""){
      if (val.price>value[0]&&val.price<value[1]){
        return val;
      }
    }else if(val.product_name.toLowerCase().includes(searchTerm.toLowerCase())){
      if (val.price>value[0]&&val.price<value[1]){
        return val;
      }
    }
       
  }).map((val) => (
    <IndividualProduct key={val.ID} 
    individualProduct={val} 
    addToCart={addToCart}
    addToWishlist={addToWishlist}
    />
  ))
}