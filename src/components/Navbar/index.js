import React from "react";
import { GiFruitBowl } from "react-icons/gi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContext";
import { auth, db } from "../../services/firebase";
import { useState, useEffect } from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  SignOutBtn,
  Email,
} from "./NavbarElements";

const Navbar = () => {
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user.email);
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const notify = () => {
    toast.error("Failed to log out!", {
      position: toast.POSITION.TOP_LEFT,
    });
  };

  async function handleLogout() {
    try {
      await auth.signOut();
    } catch {
      notify();
    }
  }

  const user = GetCurrentUser();
  return (
    <>
      <Nav>
        <NavLink to="/welcome">
          <h1>
            GetFresh <GiFruitBowl />{" "}
          </h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/products" activeStyle>
            Products
          </NavLink>
          <NavLink to="/wishlist" activeStyle>
            Wishlist
          </NavLink>
          <NavLink to="/cart" activeStyle>
            Cart
          </NavLink>
          {!user && (
            <NavLink to="/Signup" activeStyle>
              Sign Up
            </NavLink>
          )}
          {user && (
            <NavLink to="/myorders" activeStyle>
              My Orders
            </NavLink>
          )}
          {user && (
            <NavLink to="/myrefunds" activeStyle>
              My Refunds
            </NavLink>
          )}
        </NavMenu>
        {!user && (
          <NavBtn>
            <NavBtnLink to="/Login">Sign In</NavBtnLink>
          </NavBtn>
        )}
        {user &&
          <SignOutBtn className="sign-out-btn" onClick={handleLogout}>Sign Out</SignOutBtn>

        }
        {user && <Email className="email"> {user} </Email>}
      </Nav>
    </>
  );
};

export default Navbar;
