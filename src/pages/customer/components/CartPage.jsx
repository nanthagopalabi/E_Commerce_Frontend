import React from 'react'
import Cart from './Cart'
import { useNavigate } from 'react-router-dom'

function CartPage() {

    const navigate=useNavigate();

const handleNavgiation=()=>{
    navigate('/');

}

  return (
    <div>

        <Cart setIsCartOpen={handleNavgiation}/>
    </div>
  )
}

export default CartPage