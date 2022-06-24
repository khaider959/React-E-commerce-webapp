import React from 'react'
import "../css/popup.css"
import { IoMdClose } from "react-icons/io";



function Popup(props) {
  return (props.trigger) ? (
    <div className='popup'>
        <div className='popup-inner'>
            <button onClick={() => props.setTrigger(false)}className='close--btn'><IoMdClose/></button>
            { props.children }

        </div>
        
    </div>
  ) : "";
}

export default Popup