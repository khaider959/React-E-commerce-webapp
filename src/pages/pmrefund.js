import React, { useEffect, useState } from "react"
import { db } from "../services/firebase"
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import { FcApproval } from "react-icons/fc";
import { IoIosRemoveCircle } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";



const Refund = () => {

  const navigate = useNavigate();
  const logout = () => {
    navigate("/welcome");
  }

  const goBack = () => {
    navigate("/salesmanager");
  }

  const [refunds, setRefunds] = useState([]);
  const getRefunds = async () => {
    const refund_orders = await db.collection('refunds').get();
    const refund_ordersarray = [];
    for (var snap of refund_orders.docs) {
      var data = snap.data();
      refund_ordersarray.push({
        ...data
      })
      if (refund_ordersarray.length === refund_orders.docs.length) {
        setRefunds(refund_ordersarray);
      }
    }
    console.log("Got refunds")
    console.log(refunds)
  }
  useEffect(() => {
    getRefunds();
  }, [])
  
  const gettingrefunds=getRefunds();
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    const products = await db.collection('products').get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      productsArray.push({
        ...data
      })
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  }

  useEffect(() => {
    getProducts();
  }, [])

  

   const handledeliveryapproval = (doc_id,prod) => {
     db.collection('refunds').doc(doc_id).update({ order_status: 'approved' })
     products.map((data) => {
         if(data.product_id==prod.ID){
          data.quantity+=prod.qty
          db.collection('products').doc(prod.ID).set(data)
        }
      })
  }

  const handledeliveryrejected = (doc_id) => {
    db.collection('refunds').doc(doc_id).delete()
    console.log("here")
    
  }

  return gettingrefunds&&(
    <div className="container-fluid">
      <button className="sign-out" onClick={() => goBack()}> <BsArrowLeft size="1rem" /> </button>
      <button className="sign-out" onClick={() => logout()}>Sign Out</button>
      <h1 className="text-center">Refunds Requested</h1>
      <div className="products-box">
        {refunds.map(refunds =>
          <>
            {refunds.order_status == 'pending_approval' && (
              <section class="product2">
                <div class="product__info">
                  <div class="title2">
                    <h1>Products: {refunds.product.product_name + " ID:" + refunds.product.product_id + " "}</h1>
                    <br></br>
                    <h5>Status: {refunds.order_status}</h5>
                    <h5>User ID: {refunds.user_id}</h5>
                    <h5>Delivery ID: {refunds.delivery_id}</h5>
                  </div>
                  <div class="price2">
                    <span>Price: {refunds.product.price}</span> TL <br></br>
                    <span>Total Quantity: {refunds.product.qty}</span> 
                  </div>
                </div>
                <div class="buy--btn--container">
                  <button class="buy--btn" onClick={() => { handledeliveryapproval(refunds.delivery_id,refunds.product) }}><FcApproval size="2em" /></button>
                  <button class="buy--btn" onClick={() => { handledeliveryrejected(refunds.delivery_id) }}><IoIosRemoveCircle size="2em" /></button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Refund;