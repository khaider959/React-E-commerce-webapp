import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"
import { Products } from './SalesManagerproduct'
import { IndividualFilteredProduct } from "./Salesmanagerfilteredproducts";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import "../css/productmanager.css";
import { useNavigate } from "react-router-dom";




export const Salesmanager = () => {

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

  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          db.collection('users').doc(user.uid).get().then(snapshot => {
            setUser(snapshot.data().FullName);
          })
        }
        else {
          setUser(null);
        }
      })
    }, [])
    return user;
  }


  const user = GetCurrentUser();

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

  const navigate = useNavigate();

  //get categories
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    const categories = await db.collection('categories').get();
    const categoriesArray = [];
    for (var snap of categories.docs) {
      var data = snap.data();
      categoriesArray.push({
        ...data
      })
      if (categoriesArray.length === categories.docs.length) {
        setCategories(categoriesArray);
      }
    }
  }

  useEffect(() => {
    getCategories();
  }, [])

    

  const [active, setActive] = useState('');

  // category state
  const [category, setCategory] = useState('');

  // handle change ... it will set category and active states
  const handleChange = (individualSpan) => {
    setActive(individualSpan.id);
    setCategory(individualSpan.text);
    filterFunction(individualSpan.text);
  }

  // filtering prdocuts
  const [filteredProducts, setFilteredProducts] = useState([]);


  const filterFunction = (text) => {
    if (products.length > 1) {
      const filter = products.filter((products) => products.category === text);
      setFilteredProducts(filter);
    }
  }

  // return to all products
  const returntoAllProducts = () => {
    setActive('');
    setCategory('');
    setFilteredProducts([]);
  }
  // search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Our States
  const [value, setValue] = React.useState([2, 100]);

  // Changing State when volume increases/decreases
  const rangeSelector = (event, newValue) => {
    setValue(newValue);
    console.log(newValue)
  };

  //Frame for deleting categories
  const Frame = ({ course, index }) => {
    console.log(course);
    return (
      <center>
        <div className="div">
          <span key={index} id={course.id}
            onClick={() => handleChange(course)}
            className={course.id === active ? active : 'deactive'}>{course.text}</span>
        </div>
      </center>
    );
  };

  

  const logout_navigate = () => {
    navigate("/welcome");
  }

  const refund_navigate = () => {
    navigate("/refund");
  }

  const invoices_navigate = () => {
    navigate("/showinginvoice");
  }

  const revnues_navigate = () => {
    navigate("/revnue");
  }

  const revnues_navigate2 = () => {
    navigate("/revnue2");
  }


  return (
    <>
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <button className="sign-out" onClick={() => logout_navigate()}>Sign Out</button>
          <button className="sign-out" onClick={() => refund_navigate()}>Refunds</button>
          <button className="sign-out" onClick={() => invoices_navigate()}>Invoices</button>
          <button className="sign-out" onClick={() => revnues_navigate()}>Revnue 30 days</button>
          <button className="sign-out" onClick={() => revnues_navigate2()}>Revnue 15 days</button>

          <h6>Filter by category</h6>
          <div>
            {
              categories.map((data, index) => (
                <Frame course={data} index={index} />
              ))
            }
            <br></br>
            <br></br>
          </div>

          <h6>Filter by price</h6>
          <Typography id="range-slider" gutterBottom> Select Price Range: </Typography>
          <Slider
            value={value}
            onChange={rangeSelector}
            valueLabelDisplay="auto"
            max={500}
          />
          Your range of Price is between {value[0]}  and {value[1]}

        </div>


        {filteredProducts.length > 0 && (
          <div className='my-products'>
            <h1 className='text-center'>{category}</h1>
            <div className="searchInput_Container">
              <input id="searchInput" type="text" placeholder="Search here..." onChange={(event) => {
                setSearchTerm(event.target.value);
              }} />
            </div>
            <div style={{
              margin: 'auto',
              display: 'block',
              width: 'fit-content'
            }}>
            </div>
            <a className="back-to-all" href="javascript:void(0)" onClick={returntoAllProducts}>Return to All Products</a>
            <div className='products-box'>
              {filteredProducts.filter((val) => {
                if (searchTerm == "") {
                  if (val.price > value[0] && val.price < value[1]) {
                    return val;
                  }
                }
                else if (val.product_name.toLowerCase().includes(searchTerm.toLowerCase())) {
                  if (val.price > value[0] && val.price < value[1]) {
                    return val;
                  }
                }
              }).map(individualFilteredProduct => (
                <IndividualFilteredProduct key={individualFilteredProduct.ID}
                  individualFilteredProduct={individualFilteredProduct}
                />
              ))}
            </div>
          </div>
        )}


        {filteredProducts.length < 1 && (
          <>
            {products.length > 0 && (
              <div className="my-products">

                <div style={{
                  margin: 'auto',
                  display: 'block',
                  width: 'fit-content'
                }}>
                </div>
                <div className="searchInput_Container">
                  <input id="searchInput" type="text" placeholder="Search here..." onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }} />
                </div>

                <div className="products-box">
                  <Products products={products} searchTerm={searchTerm} value={value} />
                </div>
              </div>

            )}
            {products.length < 1 && (
              <div className="my-products Loading">Loading..</div>
            )}

          </>
        )}
      </div>
    </>
  )
}
