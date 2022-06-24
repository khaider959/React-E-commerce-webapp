import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"
import "../css/invoice.css";
import { GiFruitBowl } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import Popup from "./addcatpopup";



const ShowingInvoices = () => {

    const navigate = useNavigate();
    const logout = () => { navigate("/welcome"); }
    const goBack = () => { navigate("/salesmanager"); }

    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;





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





    const [ispOpen, setIspOpen] = useState(false);

    const togglepPopup = () => {
        setIspOpen(!ispOpen);
    }

    return (
        <div className="container-fluid">
            <button className="sign-out" onClick={() => goBack()}> <BsArrowLeft size="1rem" /> </button>
            <button className="sign-out" onClick={() => logout()}>Sign Out</button>
            <h1 className="text-center">Show Invoices</h1>
            <div className="products-box">
                {deliveries.map(deliveries =>
                    <>
                        {deliveries.order_status == 'approved' && (
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
                                    <button class="buy--btn" onClick={togglepPopup}>SHOW INVOICE</button>
                                </div>
                            </section>
                        )}
                        {(deliveries.order_status == 'approved' && ispOpen) && <Popup
                            content={

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
                                                                <tr class="heading">
                                                                    <td>Payment Method</td>

                                                                    <td>Invoice #</td>
                                                                </tr>
                                                                <tr class="details">
                                                                    <td>Check</td>

                                                                    <td>{deliveries.user_id}</td>
                                                                </tr>
                                                                <tr class="heading">
                                                                    <td>Item</td>

                                                                    <td>Price</td>
                                                                </tr>
                                                                {deliveries.products.map(data => {
                                                                    <tr class="details">
                                                                        {console.log(data.product_name)}
                                                                        <td>{data.product_name}</td>
                                                                        {console.log(data.price)}
                                                                        <td>{data.price} TL </td>
                                                                    </tr>
                                                                })}
                                                                <tr class="total">
                                                                    <td></td>
                                                                    <td>Total:  {deliveries.total_price} TL</td>
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
                                                        <td>{deliveries.user_id}</td>
                                                    </tr>
                                                    <tr class="heading">
                                                        <td>Item</td>
                                                        <td>Price</td>
                                                    </tr>
                                                    {deliveries.order_status == "approved" &&
                                                        deliveries.products.map(data =>
                                                            <tr class="details">
                                                                <td>{data.product_name}</td>
                                                                <td>{data.price} TL </td>
                                                            </tr>
                                                        )}
                                                    <tr class="total">
                                                        <td></td>
                                                        <td>Total:  {deliveries.total_price} TL</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                </div >
                            }
                            handleClose={togglepPopup}
                        ></Popup>
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default ShowingInvoices;