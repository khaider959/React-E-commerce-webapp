import '../css/category.css'
import React, { useEffect, useState } from "react"
import { BsCart, BsHeart } from "react-icons/bs";
import { FaStar, FaRegCommentDots } from 'react-icons/fa'
import Popup from "./addcatpopup";
import "../css/trying.scss"
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";


export const IndividualProduct = ({ individualProduct, addToCart, addToWishlist }) => {



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
	const [rating, setRating] = useState(Math.floor(individualProduct.total_points / individualProduct.total_votings));
	const [hover, setHover] = useState(null);
	const handleAddToCart = () => {
		addToCart(individualProduct);
	}
	const handleAddToWishlist = () => {
		addToWishlist(individualProduct);
	}

	const [ispOpen, setIspOpen] = useState(false);
	const [isComment, setIsComment] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);

	const [ucomments_is_approved, setUcomments] = useState(individualProduct["ucomments_is_approved"])
	const navigate = useNavigate();

	const login = () => {
		navigate("/login");
	}

	const togglepPopup = () => {
		setIspOpen(!ispOpen);
	}





	let Data
	const IncreaseFunc = (ratingValue) => {
		Data = individualProduct;
		Data['total_points'] += ratingValue;
		Data['total_votings'] += 1;
		setRating(Math.floor(Data['total_points'] / Data['total_votings']));
		db.collection('products').doc(Data.product_id).set(Data).then(() => {
			console.log("added");
		})
		setRating(avg => avg);
	}

	const togglepComment = () => {
		setIsComment(!isComment);
		auth.onAuthStateChanged((user) => {
			if (user) {
				setLoggedIn(!loggedIn);
			}
		});
		togglepPopup();
		found_in_my_orders();
	}


	const found_in_my_orders = async () => {
		const myorders = await db.collection('myorders').get();
		const myordersArray = [];
		for (var snap of myorders.docs) {
			var data = snap.data();
			console.log(data.product_id);
			if (data.product_id === individualProduct.id) {
				//setComment(true);
			}
		}
	}
	useEffect(() => {
		found_in_my_orders();
	}, [])



	const [comments, setComments] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		var user_comments = []
		var user_check_comments = []
		for (var x = 0; x < individualProduct.user_comments.length; x++) {
			user_comments.push(individualProduct.user_comments[x])
			user_check_comments.push(individualProduct.ucomments_is_approved[x])
		}
		user_comments.push(comments)
		user_check_comments.push(false);

		individualProduct.user_comments = user_comments;
		individualProduct.ucomments_is_approved = user_check_comments;
		console.log(individualProduct.user_comments);
		console.log(individualProduct.ucomments_is_approved);
		db.collection('products').doc(individualProduct.product_id).set(individualProduct);
	}


	return (
		<section class="product" >
			<div class="product__photo" >
				<div class="photo-container">
					<img class="product_photo" src={individualProduct.product_photos} onClick={togglepPopup}></img>
					{(ispOpen && !isComment) && <Popup
						content={
							<div class="container card">
								<div class="card_left">
									<a href="#"><i class="fa fa-long-arrow-left left" aria-hidden="true"></i></a>
									<a href="#"><i class="fa fa-long-arrow-right right" aria-hidden="true"></i></a>
									<img src={individualProduct.product_photos} />
								</div>
								<div class="card_right">
									<span>{individualProduct.product_name}</span>
									<h3>{individualProduct.category}</h3> <br></br>
									<span class="price">{individualProduct.price} TL</span>

									<p>{individualProduct.product_description} </p>
									<div className='rating'>
										<div>
											{[...Array(5)].map((star, i) => {
												const ratingValue = i + 1;

												return (
													<label>
														<input
															type="radio"
															name="rating"
															value={ratingValue}
															onClick={() => IncreaseFunc(ratingValue)}
														/>
														<FaStar
															className="star"
															size={50}
															color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
															onMouseOver={() => setHover(ratingValue)}
															onMouseOut={() => setHover(null)}
														/>
													</label>
												)
											})}
										</div >
									</div>


									<div class="card_footer">
										<a href="#" class="btn">
											<button class="buy--btn" onClick={handleAddToCart}><BsCart size="2em" /></button>
										</a>

										<a href="#" class="btn">
											<button class="buy--btn" onClick={handleAddToWishlist}><BsHeart size="2em" /></button>
										</a>
									</div>
								</div>
							</div>
						}
						handleClose={togglepPopup}
					></Popup>
					}
				</div>
			</div>
			<div class="product__info">
				<div class="title">
					<h1>{individualProduct.product_name}</h1>
					<h5>Quantity Left: {individualProduct.quantity}</h5>
					<h5>ID:{individualProduct.product_id}</h5>
				</div>
				<div class="price">
					<span>{individualProduct.price}</span> TL
				</div>
				<div class="buy--btn--container">
					<button class="buy--btn" onClick={handleAddToCart}><BsCart size="2em" /></button>
					<button class="buy--btn" onClick={handleAddToWishlist}><BsHeart size="2em" /></button>
					<button class="buy--btn" onClick={togglepComment}><FaRegCommentDots size="2em" /></button>


					{(ispOpen && isComment && loggedIn) && <Popup
						content={
							<>
								<div class="container card">
									<p>{individualProduct.user_comments.map((eachComment, i) => {
										return ucomments_is_approved[i] ? (
											<h1 className='comment'> {eachComment} </h1>
										) : null

									})}</p>
								</div>

								<form onSubmit={handleSubmit}>
									<label> Comment:
										<input className="form-input"
											type="text"
											required
											value={comments}
											placeholder="Enter your comment"
											onChange={(e) => setComments(e.target.value)}
										/>
									</label>
									<button> Post Comment! </button>
								</form>
							</>
						}
						handleClose={togglepComment}
					></Popup>
					}
					{(ispOpen && isComment && !loggedIn) && <Popup
						content={
							<>
								<div className="log-in-before-commenting">
									Please login before commenting!
									<button className="sign-out-popup" onClick={() => login()}>Log In!</button>
								</div>
							</>
						}
						handleClose={togglepComment}
					></Popup>
					}
				</div>
			</div>
		</section>

	)
}
