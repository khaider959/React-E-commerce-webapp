import React from 'react'
import "../css/cart.css"
import { FiPlus,FiMinus,FiX } from "react-icons/fi";
import { auth, db } from "../services/firebase"


export const IndividualCartProduct = ({cartProduct,cartProductIncrease,cartProductDecrease}) => {

  const handleCartProductIncrease= () => {
    cartProductIncrease(cartProduct);
  }

  const handleCartProductDecrease= () => {
    cartProductDecrease(cartProduct);
  }

  const handleCartProductDelete= () => {
    auth.onAuthStateChanged(user=>{
      if(user){
        db.collection('Carts').doc(user.uid).collection('Products').doc(cartProduct.product_id).delete();
      }
      else{
        db.collection('Cart null').doc(cartProduct.ID).delete();
      }
    })
  }

  return (
    <>
      <div class="shopping-cart">
        <div class="item">
          <div class="deleteCart" onClick={handleCartProductDelete}>
            <span class="delete-btn"><FiX size={20}/></span>
          </div>

          <div class="image">
            <img class="image_cart"src={cartProduct.product_photos} alt="picture" />
          </div>

          <div class="description">
            <span>{cartProduct.product_name}</span>
          </div>

          <button class="plus-btn" type="button" name="button" onClick={handleCartProductIncrease}>
              <FiPlus/>
          </button>
          <div class="quantity">
          
            <input class="amount" type="number" name="name" value={cartProduct.qty} />
         
          </div>
          <button class="minus-btn" type="button" name="button" onClick={handleCartProductDecrease}>
              <FiMinus/>
            </button>
          <div class="total-price">{cartProduct.TotalProductPrice} TL</div>
        </div>
      </div>
    </>
  )
}
