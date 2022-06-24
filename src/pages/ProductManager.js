import React, { useEffect, useState } from "react"
import { auth, db } from "../services/firebase"
import { Products } from './ProductManagerproduct'
import { IndividualFilteredProduct } from "./Productmanagerfilteredproducts";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Button } from "react-bootstrap";
import "../css/productmanager.css";
import Popup from "./addcatpopup";
import { useNavigate } from "react-router-dom";




export const Productmanager = () => {

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

  function deletecategory(catname) {
    db.collection('categories').doc(catname).delete();
    getCategories();
    db.collection("products").where("category", "==", catname).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
    getProducts();
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


  let Data;
  const addToCart = (product) => {
    Data = product;
    Data['qty'] = 1;
    Data['TotalProductPrice'] = Data.qty * Data.price;
    db.collection('Cart ' + uid).doc(product.ID).set(Data).then(() => {
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
          <Button className='deleteProductManger' onClick={() => { deletecategory(course.id) }}>Delete</Button>
        </div>
      </center>
    );
  };

  //For the popup
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const logout_navigate = () => {
    navigate("/welcome");
  }

  const delivery_navigate = () => {
    navigate("/pmdeliveries");
  }

  const comments_navigate = () => {
    navigate("/mycomments");
  }


  //for the category form
  const [catid, setId] = useState('');
  const [text, setText] = useState('');
  const [caturl, setCaturl] = useState('');

  // function to update state of name with
  // value enter by user in form
  const handleidChange = (e) => {
    setId(e.target.value);
  }
  // function to update state of age with value
  // enter by user in form
  const handletextChange = (e) => {
    setText(e.target.value);
  }
  const handleurlChange = (e) => {
    setCaturl(e.target.value);
  }

  const handleSubmit = (e) => {

    alert('Making a new category with text: "' + text + ' and category id: ' + catid);
    db.collection('categories')
      .doc(catid)
      .set({
        id: catid,
        text: text,
        url: caturl
      })
      .then(() => {
        console.log('Category added!');
      });
    e.preventDefault();

  }

  //For adding a new product
  const [product_category, setProduct_category] = useState('');
  const [distributor, setDistributor] = useState('');
  const [product_price, setProduct_price] = useState(0);
  const [product_id, setProduct_id] = useState('');
  const [product_name, setProduct_name] = useState('');
  const [product_photos, setProduct_photos] = useState('');
  const [product_quantity, setProduct_quantity] = useState(0);
  const [product_warranty, setProduct_warranty] = useState('');
  const [product_description, setProduct_description] = useState('');

  // function to update state of name with
  // value enter by user in form
  const handleproduct_categoryChange = (e) => {
    setProduct_category(e.target.value);
  }

  const handledistributorChange = (e) => {
    setDistributor(e.target.value);
  }

  const handleproduct_priceChange = (e) => {
    setProduct_price(e.target.value);
  }

  const handleproduct_idChange = (e) => {
    setProduct_id(e.target.value);
  }

  const handleproduct_nameChange = (e) => {
    setProduct_name(e.target.value);
  }

  const handleproduct_photosChange = (e) => {
    setProduct_photos(e.target.value);
  }

  const handleproduct_quantityChange = (e) => {
    setProduct_quantity(e.target.value);
  }

  const handleproduct_warrantyChange = (e) => {
    setProduct_warranty(e.target.value);
  }

  const handleproduct_descriptionChange = (e) => {
    setProduct_description(e.target.value);
  }

  const comments = [""];

  const handleproductSubmit = (e) => {

    alert('Adding a new product: ' + product_name);
    db.collection('products')
      .doc(product_id)
      .set({
        category: product_category,
        date_added: text,
        distributor: distributor,
        price: parseInt(product_price),
        product_description: product_description,
        product_id: product_id,
        product_name: product_name,
        product_photos: product_photos,
        quantity: parseInt(product_quantity),
        warranty: product_warranty,
        date_added: new Date(),
        total_points: 0,
        total_votings: 0,
        user_comments: comments,
        isdiscounted: false,
      })
      .then(() => {
        console.log('Product added!');
      });
    e.preventDefault();
    getProducts();
  }

  //For the popup
  const [ispOpen, setIspOpen] = useState(false);

  const togglepPopup = () => {
    setIspOpen(!ispOpen);
  }

  return (
    <>
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <button className="sign-out" onClick={() => logout_navigate()}>Sign Out</button>
          <button className="sign-out" onClick={() => delivery_navigate()}>Delivery</button>
          <button className="sign-out" onClick={() => comments_navigate()}>Comments</button>
          
          <h6>Filter by category</h6>
          <div>
            {
              categories.map((data, index) => (
                <Frame course={data} index={index} />

              ))
            }
            <br></br>
            <input
              type="button"
              value="Click to Add Product"
              onClick={togglepPopup}
            />
            {ispOpen && <Popup
              content={
                <div>
                  <header className="App-header">
                    <form onSubmit={(e) => { handleproductSubmit(e) }}>
                      {/*when user submit the form , handleSubmit()
          function will be called .*/}
                      <h2> Add a product </h2>
                      <label >
                        Name:
                      </label><br />
                      <input type="text" value={product_name} required onChange={(e) => { handleproduct_nameChange(e) }} /><br />

                      <label >
                        ID:
                      </label><br />
                      <input type="text" value={product_id} required onChange={(e) => { handleproduct_idChange(e) }} /><br />

                      <label >
                        Category:
                      </label><br />
                      <input type="text" value={product_category} required onChange={(e) => { handleproduct_categoryChange(e) }} /><br />

                      <label >
                        Price:
                      </label><br />
                      <input type="number" value={product_price} required onChange={(e) => { handleproduct_priceChange(e) }} /><br />

                      <label >
                        Description:
                      </label><br />
                      <input type="text" value={product_description} required onChange={(e) => { handleproduct_descriptionChange(e) }} /><br />

                      <label >
                        Quantity:
                      </label><br />
                      <input type="number" value={product_quantity} required onChange={(e) => { handleproduct_quantityChange(e) }} /><br />

                      <label >
                        Photo link:
                      </label><br />
                      <input type="text" value={product_photos} required onChange={(e) => { handleproduct_photosChange(e) }} /><br />

                      <label >
                        Warranty:
                      </label><br />
                      <input type="text" value={product_warranty} required onChange={(e) => { handleproduct_warrantyChange(e) }} /><br />

                      <label >
                        Distributor:
                      </label><br />
                      <input type="text" value={distributor} required onChange={(e) => { handledistributorChange(e) }} /><br />

                      <input type="submit" value="Submit" />
                    </form>
                  </header>
                </div>}
              handleClose={togglepPopup}
            />}
            <br></br>
            <br></br>
            <input
              type="button"
              value="Click to Add Category"
              onClick={togglePopup}
            />
            {isOpen && <Popup
              content={
                <div>
                  <header className="App-header">
                    <form onSubmit={(e) => { handleSubmit(e) }}>
                      {/*when user submit the form , handleSubmit()
          function will be called .*/}
                      <h2> Add a category </h2>
                      <label >
                        ID:
                      </label><br />
                      <input type="text" value={catid} required onChange={(e) => { handleidChange(e) }} /><br />
                      { /*when user write in name input box , handleChange()
                function will be called. */}
                      <label >
                        Text:
                      </label><br />
                      <input type="text" value={text} required onChange={(e) => { handletextChange(e) }} /><br />
                      <label >
                        Url:
                      </label><br />
                      <input type="text" value={caturl} required onChange={(e) => { handleurlChange(e) }} /><br />
                      
                      <input type="submit" value="Submit" />
                    </form>
                  </header>
                </div>}
              handleClose={togglePopup}
            />}
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
