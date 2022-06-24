import React from 'react'
import '../css/category.css'
import { db } from "../services/firebase"



export const IndividualFilteredProduct = ({individualFilteredProduct}) => {

    async function deleteproduct(catname) {
      console.log("in delete product")
    db.collection("products").where("product_id", "==", catname).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()
        })
      })
      console.log("after delete product")
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
          <button class="deleteProductManger" onClick={ ()=>{deleteproduct(individualFilteredProduct.product_id)}}>Delete product</button>
        </div>
  
      </div>
    </section>
    )
}