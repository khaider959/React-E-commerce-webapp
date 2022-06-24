import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import "../css/emptyWishlist.css";
import { WishProducts } from "./WishlistProducts";




export const Wishlist = () => {

  const [cartProducts, setCart] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("Wishlist " + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCart(newCartProduct);
        });
      } else {
        db.collection("Wishlist null").onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCart(newCartProduct);
        });
      }
    });
  }, []);


  return (
    <>
      <div>
        {cartProducts.length >= 1 && (
          <div className="container-fluid">
            <h1 className="text-center">WishList</h1>
            <div className="products-box">
              <WishProducts cartProducts={cartProducts}/>
            </div>
          </div>
        )}
        {cartProducts.length < 1 && (
          <div class="stage2">
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
            <div class="layer2"></div>
          </div>
        )}
      </div>
    </>
  );
};
