import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { CartProducts } from "./CartProducts";
import { BsFillCartCheckFill } from "react-icons/bs";
import Popup from "./addcatpopup";
import "../css/emptyCart.css";
import "../css/popup.css";
import "../images/foodiesfeed.com_red-fruit-and-vegetables-on-a-white-background.jpg";
import { useNavigate } from "react-router-dom";



export const Cart = () => {
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(user);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }



  function GetUserDetails() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data());
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  function GetUserID() {
    const [uid, setUID] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          setUID(user.uid);
        }
      })
    }, [])
    return uid;
  }

  const uid = GetUserID();
  const user = GetCurrentUser();
  const userDetails = GetUserDetails();
  const navigate = useNavigate();
  const date = new Date();
  const showTime = date.getHours()
    + ':' + date.getMinutes()
    + ":" + date.getSeconds();



  const [cartProducts, setCart] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection('Carts').doc(user.uid).collection('Products').onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCart(newCartProduct);
        });
      } else {
        db.collection("Cart null").onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCart(newCartProduct);
        });
      }
    });
  }, []);



  let Product;
  const cartProductIncrease = (cartProduct) => {
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;

    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection('Carts')
          .doc(uid)
          .collection('Products')
          .doc(Product.product_id)
          .update(Product)
          .then(() => { });
        } else {
        db.collection('Cart null')
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => { });
      }
    });
  };


  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;

      auth.onAuthStateChanged((user) => {
        if (user) {
          db.collection('Carts')
            .doc(uid)
            .collection('Products')
            .doc(Product.product_id)
            .update(Product)
            .then(() => { });
        } else {
          db.collection('Cart null')
            .doc(cartProduct.ID)
            .update(Product)
            .then(() => { });
        }
      });
    }
  };

  // displaying total quantity in cart
  const qty = cartProducts.map(cartProduct => {
    return cartProduct.qty
  })
  const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;
  const totalQty = qty.reduce(reducerOfQty, 0);


  // displaying price
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  })
  const reducerOfPrice = (accumulator, currentValue) => accumulator + currentValue;
  const totalPrice = price.reduce(reducerOfPrice, 0);


  const pushtodelivery = () => {
    
    var Data_order = [];
    Data_order['delivery_name'] = userDetails.name + " " + userDetails.surname;
    Data_order['Address'] = userDetails.delivery_address;
    Data_order['order_status'] = 'pending_approval';
    Data_order['placement_date'] = new Date();
    Data_order['products'] = cartProducts;
    Data_order['total_price'] = totalPrice;
    Data_order['total_qty'] = totalQty;
    Data_order['user_id'] = uid;
    Data_order['delivery_id'] = uid + showTime
    const obj = Object.assign({}, Data_order);
    var doc_id = uid + showTime;
    var orderlist=[]
    cartProducts.map(products=>{
      orderlist.push(products.product_id)
    })
    db.collection('users').doc(uid).update({'ordered_items':orderlist})
    db.collection('orders').doc(doc_id).set(obj);
    db.collection('myorders').doc(doc_id).set(obj);
    db.collection('Carts').doc(uid).delete()
    db.collection('users').doc(uid).update({'basket':[]})
    alert("posted");
    navigate("/invoice");
  }


  // toggle
  const [ispOpen, setIspOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const togglepPopup = () => {
    setIspOpen(!ispOpen);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(!loggedIn);
      }
      else navigate("/Login");

    });
  }


  return (
    <>
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Shopping Cart</h1>
          <div className="products-box">
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>
          <div className="container-checkout">
            <input
              onClick={() => togglepPopup()} className="check-btn" type="button"
              value="Checkout"
            />
            {(ispOpen && loggedIn) && <Popup
              content={
                <div class="container">
                  <div class="wrapper">
                    <div class="outer-card">
                      <div class="forms">
                        <img
                          className="credit-card-picture"
                          src="https://www.local1197.com/wp-content/uploads/2020/04/accept-credit-card-payments.jpg"
                        />
                        <div class="input-items">
                          <span>Card Number</span>
                          <input
                            placeholder=".... .... .... ...."
                            data-slots="."
                            data-accept="\d"
                            size="19"
                          />
                        </div>
                        <div class="input-items">
                          {" "}
                          <span>Name on card</span>{" "}
                          <input placeholder="Samuel Iscon" />
                        </div>
                        <div class="one-line">
                          <div class="input-items">
                            <span>Expiry Date</span>
                            <input placeholder="mm/yyyy" data-slots="my" />
                          </div>{" "}
                          <div class="input-items">
                            <span>CVV</span>{" "}
                            <input
                              placeholder="..."
                              data-slots="."
                              data-accept="\d"
                              size="3"
                            />{" "}
                          </div>
                        </div>
                        <div class="input-buttons" onClick={() => {
                          pushtodelivery()
                        }}>
                          <a>Pay!</a>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              }
              handleClose={togglepPopup}
            ></Popup>
            }
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div class="stage">
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
          <div class="layer"></div>
        </div>
      )}
    </>
  );
};

