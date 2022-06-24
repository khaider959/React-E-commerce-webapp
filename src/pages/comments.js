import React, { useEffect, useState } from "react"
import { db } from "../services/firebase"
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import { BsArrowLeft } from "react-icons/bs";
import { FcApproval } from "react-icons/fc";
import { IoIosRemoveCircle } from "react-icons/io";



const MyComments = () => {

    const navigate = useNavigate();
    const logout = () => {
        navigate("/welcome");
    }
    const goBack = () => {
        navigate("/productmanager");
    }
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
    


    const handledeliveryapproval = (i,id) => {
        products.map((data)=>{
            
                if(data.product_id==id){
                    data.ucomments_is_approved[i]=true
                    db.collection('products').doc(id).set(data)
                }
            
        })
        console.log("here")
        
    }
    //const [user_comments, setValue] = useState([])
    //const [ucomments_is_approved, setUcomments] = useState([])

    const handledeliveryrejected = (i,theproduct) => {
        var user_comments=[]
        var ucomments_is_approved=[]
        for(var x=0;x<theproduct.user_comments.length;x++){
            if(x!=i){
                user_comments.push( theproduct.user_comments[x])
                ucomments_is_approved.push(theproduct.ucomments_is_approved[x])
            }
        }
        theproduct.user_comments=user_comments
        theproduct.ucomments_is_approved= ucomments_is_approved
        console.log(theproduct.user_comments)
        console.log(theproduct.ucomments_is_approved)
        db.collection('products').doc(theproduct.product_id).set(theproduct)
    }
    function checkcomments(comments){
        var flag=false;
        for (var i=0;i<comments.length;i++){
            if (comments[i]==false){
                flag=true;
                return flag
            }
        }
        return flag;
    }


    return (

        <div className="container-fluid">
            <button className="sign-out" onClick={() => goBack()}> <BsArrowLeft size="1rem"/> </button>
            <button className="sign-out" onClick={() => logout()}>Sign Out</button>
            <h1 className="text-center">Comments to be Accepted/Rejected: </h1>
            
            <div className="products-box">
            {products.map((deliveries) =>
          <>
          
            {(
                
              <section class="product2">
                <div class="product__info">
                  <div class="title2">
                    
                    <h3>Comments: {deliveries.user_comments?.map((eachComment, i) => {
										if(checkcomments(deliveries.ucomments_is_approved)){
                                            return !deliveries.ucomments_is_approved[i] ? (
                                                <><h5> {eachComment} </h5>
                                                <div class="buy--btn--container">
                                                    <button class="buy--btn" onClick={() => { handledeliveryapproval(i,deliveries.product_id); } }><FcApproval size="2em" /></button>
                                                    <button class="buy--btn" onClick={() => { handledeliveryrejected(i,deliveries); } }><IoIosRemoveCircle size="2em" /></button>
                                                </div></>
    
                                            ) : null
                                        }

									})}</h3>
                    <br></br>
                    <h5>Product Name: {deliveries.product_name}</h5>
                    <h5>Product ID: {deliveries.product_id}</h5>
                  </div>
                </div>
                
              </section>
            )}
          </>
        )}
            </div>
        </div>
    );
};

export default MyComments;