import React, { useEffect } from 'react'
import "../css/cart.css"
import {  FiX } from "react-icons/fi";
import { auth, db } from "../services/firebase"
import { CartProducts } from './CartProducts';


export const IndividualWishlist = ({ cartProduct }) => {


    const handleWishlisttDelete = () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('Wishlist ' + user.uid ).doc(cartProduct.ID).delete();
            }
            else {
                db.collection('Wishlist null').doc(cartProduct.ID).delete();
            }
        })
    }
    
    const shownotification=()=>{
      if(cartProduct.isdiscounted==true){
        alert(cartProduct.product_name+" is discounted! New price is "+cartProduct.price+"TL")
      }
    }
    useEffect(() => {
      shownotification();
    }, [])
    return (
        <>
          <div class="shopping-cart">
            <div class="item">
              <div class="deleteCart" onClick={handleWishlisttDelete}>
                <span class="delete-btn"><FiX size={20}/></span>
              </div>
    
              <div class="image">
                <img class="image_cart"src={cartProduct.product_photos} alt="picture" />
              </div>
    
              <div class="description">
                <span>{cartProduct.product_name}</span>
              </div>

              <div class="quantity">
                <span>{cartProduct.product_description}</span>          
              </div>
              <div class="total-price">{cartProduct.TotalProductPrice} TL</div>
            </div>
          </div>
        </>
      )
}
