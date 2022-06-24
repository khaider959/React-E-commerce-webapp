import '../css/category.css'
import React, { useEffect, useState } from "react"
import { db } from "../services/firebase"
import Popup from "./addcatpopup";

export const IndividualProduct = ({individualProduct}) => {

	function discountprice(newprice) {
		console.log("in discount price")
    console.log(individualProduct.product_id)
    var price= parseInt(newprice,10)
    individualProduct.price=price
    individualProduct["isdiscounted"]=true
	  db.collection("products").doc(individualProduct.product_id).set(individualProduct)
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

      const removediscount=(e)=>{
        individualProduct["isdiscounted"]=false
	      db.collection("products").doc(individualProduct.product_id).set(individualProduct)
      }

	return (
		<section class="product">
		<div class="product__photo">
			<div class="photo-container">
					<img class="product_photo"src={individualProduct.product_photos}></img>
			</div>
		</div>
		<div class="product__info">
			<div class="title">
				<h1>{individualProduct.product_name}</h1>
				<h5>Quantity Left: {individualProduct.quantity}</h5>
				<h5>ID:{individualProduct.product_id}</h5>
			</div>
			<div class="price">
				<span>{individualProduct.price}</span> TL 
			</div>
			<div class="buy--btn--container">
			<input
              type="button"
              value="Click to update discount price"
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
            <input
              type="button"
              value="Click to remove discount"
              onClick={(e)=>removediscount(e)}
            />
			</div>

		</div>
	</section>

	)
}
