import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"
import { Products } from '../pages/product'
import { IndividualFilteredProduct } from "./individualFilteredProduct";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';



export const Data = () => {
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

  const uid = GetUserID();
  const userDetails = GetUserDetails();


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


  let Data;
  const addToCart = (product) => {
    Data = product;
    Data['qty'] = 1;
    Data['TotalProductPrice'] = Data.qty * Data.price;
    db.collection('Carts').doc(uid).collection('Products').doc(Data.product_id).set(Data).then(() => {
    })

    var productss = []
    for (var x = 0; x < userDetails.basket.length; x++) {
      productss.push(userDetails.Basket[x]);
    }
    productss.push(product.product_id);
    userDetails.basket=productss

    db.collection('users').doc(uid).set(userDetails);
  }

  let Data2;
  const addToWishlist = (product) => {
    Data2 = product;
    Data2['qty'] = 1;
    Data2['TotalProductPrice'] = Data2.qty * Data2.price;
    db.collection('Wishlist ' + uid).doc(product.ID).set(Data2).then(() => {
      console.log("added");
    })
  }



  const [spans] = useState([
    { id: 'Drink', text: 'Drink' },
    { id: 'DairyProducts', text: 'Dairy Products' },
    { id: 'Breakfast', text: 'Breakfast' },
  ])


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
  //Frame forcategories
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


  return (
    <>
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <br></br><br></br>
          <h6 className="side-bar">Filter by category</h6>
          {
              categories.map((data, index) => (
                <Frame course={data} index={index} />

              ))
            }
          <h6 className="side-bar">Filter by price</h6>
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
                  addToCart={addToCart} addToWishlist={addToWishlist} />
              ))}
            </div>
          </div>
        )}


        {filteredProducts.length < 1 && (
          <>
            {products.length > 0 && (
              <div className="my-products">
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
                <h1 className="text-center">All Products</h1>
                <div className="products-box">
                  <Products products={products} addToCart={addToCart} addToWishlist={addToWishlist} searchTerm={searchTerm} value={value} />
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
