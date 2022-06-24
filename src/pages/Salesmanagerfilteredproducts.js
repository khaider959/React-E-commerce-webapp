import '../css/category.css'
import React, { useEffect, useState } from "react"
import { db } from "../services/firebase"
import Popup from "./addcatpopup";



export const IndividualFilteredProduct = ({individualFilteredProduct}) => {

  async function discountprice(newprice) {
		console.log("in discount price")
	  console.log(individualFilteredProduct.product_id)
    var price= parseInt(newprice,10)
    individualFilteredProduct.price=price
	  db.collection("products").doc(individualFilteredProduct.product_id).set(individualFilteredProduct)
		console.log("after discount price")
	}
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
    setIsOpen(!isOpen);
    }

    const [newprice, setNewPrice] = useState(0);
    const handleprice = (e) => {
        setNewPrice(e.target.value);
      }
      const handlesubmit = (e) => {
        discountprice(newprice)
        e.preventDefault();
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
        <input
              type="button"
              value="Click to update price"
              onClick={togglePopup}
            />
            {isOpen && <Popup
              content={
                <div>
                  <header className="App-header">
                    <form onSubmit={(e) => {handlesubmit(e) }}>
                      <h2> Discounted Price </h2>
                      <label >
                        New Price:
                      </label><br />
                      <input type="number" value={newprice} required onChange={(e) => {handleprice(e) }} /><br />
                      <input type="submit" value="Submit" />
                    </form>
                  </header>
                </div>}
              handleClose={togglePopup}
            />}
        </div>
  
      </div>
    </section>
    )
}