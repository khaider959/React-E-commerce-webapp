import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"

const MyOrders = () => {

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

    const userDetails = GetUserDetails();
    const uid = GetUserID();
    const date = new Date();
    const showTime = date.getHours()
        + ':' + date.getMinutes()
        + ":" + date.getSeconds();

        const [myorders, setOrders] = useState([]);
        const getOrders = async () => {
            const myorders = await db.collection('myorders').get();
            const myordersArray = [];
            for (var snap of myorders.docs) {
                var data = snap.data();
                if(data.user_id==uid){
                    myordersArray.push({
                        ...data
                    })
                }
            }
            setOrders(myordersArray);
        }
        useEffect(() => {
            getOrders();
        }, [])
        
    const orders=getOrders();

    const pushtorefund = (order,Product,date_added,docid) => {
        console.log(date_added)
        console.log("date added"+date_added.seconds)
        const now = new Date();
        console.log("now date"+now)
        const msBetweenDates = Math.abs( now.getTime() - (date_added.seconds*1000) );

        //  convert ms to days                 hour   min  sec   ms
        
        console.log(msBetweenDates/100000000)
        if ((msBetweenDates/100000000 )< 30) {
            var Data_order = [];
        Data_order['delivery_name'] = userDetails.name + " " + userDetails.name;
        Data_order['Address'] = userDetails.delivery_address;
        Data_order['order_status'] = 'pending_approval';
        Data_order['product'] = Product;
        Data_order['user_id'] = uid;
        Data_order['delivery_id'] = uid + showTime
        const obj = Object.assign({}, Data_order);
        var doc_id = uid + showTime;
        db.collection('refunds').doc(doc_id).set(obj);
        var newproductsarray=[]
        console.log("refund order:" +order)
        
        for(var i=0;i<order.products.length;i++){
            console.log("orderproduct "+order.products[i])
            if(order.products[i]!=Product){
                newproductsarray.push(order.products[i])
            }
        }
        console.log(newproductsarray)
        order.products=newproductsarray
        db.collection('myorders').doc(docid).update(order)
        alert("Refund requested");
        } else {
            console.log('date is NOT within 30 days');
            alert("Cannot refund purchase date time over 30 days");
        }
        
      }


    
    return orders&& (
        <div className="products-box">
            {myorders.map(myorders =>
                
                <>
                    <div className="container-fluidd">
                        <div className="products-box">
                            <section class="product3">
                                <div class="product__photo" >
                                    <div class="photo-container">
                                        <img class="product_photo" src={myorders.products.map(data => data.product_photos) }></img>
                                    </div>
                                </div>
                                <div class="product__info">
                                    <div class="title2">
                                        <h1 className="myordersProductsName">Products:  {myorders.products.map((data) => (
                                            <><h5>{"\n" + data.product_name + " ID:" + data.product_id + " "}</h5><input
                                                type="button"
                                                value="Click to refund"
                                                onClick={()=>{pushtorefund(myorders,data,myorders.placement_date,myorders.delivery_id)
                                                console.log(myorders.placement_date)}} />
                                                </>
                                        ))}
                                        </h1>
                                        
                                        <br></br>
                                        <h3>Status:</h3>
                                        <h1 className="myordersStatus"> {myorders.order_status}</h1>
                                    </div>
                                    <div class="price2">
                                        <span className="myordersPrice">Total Price: {myorders.total_price}</span> TL <br></br>
                                        <span className="myordersPrice">Total Quantity: {myorders.total_qty}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default MyOrders