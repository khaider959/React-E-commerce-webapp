import React from 'react'
import { BsCart,BsHeart} from "react-icons/bs";
import '../css/category.css'



export const IndividualFilteredProduct = ({individualFilteredProduct, addToCart, addToWishlist}) => {

    const handleAddToCart=()=>{
        addToCart(individualFilteredProduct);
    }

    const handleAddToWishlist = () => {
      addToWishlist(individualFilteredProduct);
    }

    return (
    
      <section class="product">
      <div class="product__photo">
        <div class="photo-container">
            <img class="product_photo"src={individualFilteredProduct.product_photos}></img>
        </div>
      </div>
      <div class="product__info">
        <div class="title">
          <h1>{individualFilteredProduct.product_name}</h1>
          <h5>Quantity Left: {individualFilteredProduct.quantity}</h5>
          <h5>ID:{individualFilteredProduct.product_id}</h5>
        </div>
        <div class="price">
          <span>{individualFilteredProduct.price}</span> TL 
        </div>
        <div class="buy--btn--container">
          <button class="buy--btn" onClick={handleAddToCart}><BsCart size="2em" /></button>
          <button class="buy--btn" onClick={handleAddToWishlist}><BsHeart size="2em" /></button>
        </div>
  
      </div>
    </section>
    )
}