import React, { useEffect, useState } from "react"
import { db } from "../services/firebase"
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import { FcApproval } from "react-icons/fc";
import { IoIosRemoveCircle } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";



const Delivery = () => {

  const navigate = useNavigate();
  const logout = () => {
    navigate("/welcome");
  }

  const goBack = () => {
    navigate("/productmanager");
  }

  const [deliveries, setDeliveries] = useState([]);
  const getDeliveries = async () => {
    const deliveries = await db.collection('orders').get();
    const deliveriesArray = [];
    for (var snap of deliveries.docs) {
      var data = snap.data();
      deliveriesArray.push({
        ...data
      })
      if (deliveriesArray.length === deliveries.docs.length) {
        setDeliveries(deliveriesArray);
      }
    }
  }
  useEffect(() => {
    getDeliveries();
  }, [])

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



  const handledeliveryapproval = (doc_id, prod) => {
    db.collection('orders').doc(doc_id).update({ order_status: 'approved' })
    db.collection('myorders').doc(doc_id).update({ order_status: 'approved' })

    prod.map((data) => {
      for (var i = 0; i < products.length; i++) {
        if (products[i].product_id == data.ID) {
          products[i].quantity -= data.qty
          db.collection('products').doc(data.ID).set(products[i])
        }
      }
    })
    getDeliveries();
  }

  const handledeliveryrejected = (doc_id) => {
    db.collection('orders').doc(doc_id).delete()
    db.collection('myorders').doc(doc_id).delete()
    console.log("here")
    getDeliveries();
  }

  return (
    <div className="container-fluid">
      <button className="sign-out" onClick={() => goBack()}> <BsArrowLeft size="1rem" /> </button>
      <button className="sign-out" onClick={() => logout()}>Sign Out</button>
      <h1 className="text-center">Orders Placed</h1>
      <div className="products-box">
        {deliveries.map(deliveries =>
          <>
            {deliveries.order_status == 'pending_approval' && (
              <section class="product2">
                <div class="product__info">
                  <div class="title2">
                    <h1>Products: {deliveries.products.map(data => data.product_name + " ID:" + data.product_id + " ")}</h1>
                    <br></br>
                    <h5>Name: {deliveries.delivery_name}</h5>
                    <h5>Address: {deliveries.Address}</h5>
                    <h5>Status: {deliveries.order_status}</h5>
                    <h5>User ID: {deliveries.user_id}</h5>
                    <h5>Delivery ID: {deliveries.delivery_id}</h5>
                  </div>
                  <div class="price2">
                    <span>Total Price: {deliveries.total_price}</span> TL <br></br>
                    <span>Total Quantity: {deliveries.total_qty}</span>
                  </div>
                </div>
                <div class="buy--btn--container">
                  <button class="buy--btn" onClick={() => { handledeliveryapproval(deliveries.delivery_id, deliveries.products) }}><FcApproval size="2em" /></button>
                  <button class="buy--btn" onClick={() => { handledeliveryrejected(deliveries.delivery_id) }}><IoIosRemoveCircle size="2em" /></button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Delivery;