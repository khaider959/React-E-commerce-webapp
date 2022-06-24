import React from 'react'
import { IndividualProduct } from './SalesManagerIndividualProduct'

export const Products = ({products,searchTerm,value}) => {
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
    />
  ))
}


