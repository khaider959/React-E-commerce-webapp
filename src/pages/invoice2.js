import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"
import "../css/invoice.css";
import { GiFruitBowl } from "react-icons/gi";
import { useNavigate } from "react-router-dom";



const Invoice2 = (Delivery_ID) => {

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
    const userDetails = GetUserDetails();
    const navigate = useNavigate();
    const [cartProducts, setCart] = useState([]);


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                db.collection('orders').doc(user.uid).collection('Products').onSnapshot((snapshot) => {
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


    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    const goBack = () => {
        navigate("/products");
    }


    return userDetails && (
        <div className="container-fluid">
            <>
                <div class="invoice-box">
                    <table>
                        <tbody>
                            <tr class="top">
                                <td colspan="2">
                                    <table>
                                        <tr>
                                            <td class="title">
                                                GetFresh<GiFruitBowl />
                                            </td>

                                            <td>
                                                Invoice #: 123<br />
                                                Created: {date}<br />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr class="information">
                                <td colspan="2">
                                    <table>

                                        <tr>
                                            <td>
                                                {userDetails.Address}<br />
                                            </td>
                                            <td>
                                                {userDetails.FirstName + userDetails.LastName}<br />
                                                {userDetails.Email}
                                            </td>
                                        </tr>

                                    </table>
                                </td>
                            </tr>

                            <tr class="heading">
                                <td>Payment Method</td>

                                <td>Invoice #</td>
                            </tr>

                            <tr class="details">
                                <td>Check</td>

                                <td>{uid} </td>
                            </tr>
                            <tr class="heading">
                                <td>Item</td>
                                <td>Price</td>
                            </tr>
                            {cartProducts.map(cartProducts =>
                                <tr class="details">
                                    <td>{cartProducts.product_name}</td>

                                    <td>{cartProducts.price} TL </td>
                                </tr>
                            )}
                            <tr class="total">
                                <td></td>

                                <td>Total:      {totalPrice} TL</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="sign-out" onClick={() => goBack()}>Go to Products!</button>
                </div>

            </>


        </div >
    )
}

export default Invoice2