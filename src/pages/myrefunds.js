import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"

const MyRefunds = () => {

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

    const [myrefunds, setRefunds] = useState([]);
    const getRefunds = async () => {
            const myorders = await db.collection('refunds').get();
            const myordersArray = [];
            for (var snap of myorders.docs) {
                var data = snap.data();
                console.log("user id:"+uid)
                console.log(data.user)
                if(data.user_id==uid){
                    myordersArray.push({
                        ...data
                    })
                }
            }
            setRefunds(myordersArray);
            console.log(myrefunds)
        }
        useEffect(() => {
            getRefunds();
        }, [])
        
    const refunds=getRefunds()


    return refunds&&(
        <div className="products-box">
            {myrefunds.map(myorders =>
                
                <>
                    <div className="container-fluidd">
                        <div className="products-box">
                            <section class="product3">
                                <div class="product__photo" >
                                    <div class="photo-container">
                                        <img class="product_photo" src={myorders.product.product_photos[0] }></img>
                                    </div>
                                </div>
                                <div class="product__info">
                                    <div class="title2">
                                        <h1 className="myordersProductsName">Product:  {myorders.product.product_name}   ID: {myorders.product.product_id}
                                        </h1>
                                        
                                        <br></br>
                                        <h3>Status:</h3>
                                        <h1 className="myordersStatus"> {myorders.order_status}</h1>
                                    </div>
                                    <div class="price2">
                                        <span className="myordersPrice">Price: {myorders.product.price}</span> TL <br></br>
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

export default MyRefunds