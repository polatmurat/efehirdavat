import { NavLink } from "react-router-dom"
import {BsPersonCircle} from "react-icons/bs"
import { AiOutlineLogout} from "react-icons/ai"
import {useDispatch} from "react-redux"
import { logout } from "../../store/reducers/authReducer"
const AccountList = () => {
    const dispatch = useDispatch();
  return (
    <>
    <NavLink to="/user" className="account-list">
    <BsPersonCircle size={22} />
    <span className="account-list-title">Hesabım</span>
    </NavLink>
    <span className="account-list cursor-pointer" onClick={() => dispatch(logout('userToken'))}>
    <AiOutlineLogout size={22} />
    <span className="account-list-title">Çıkış Yap</span>
    </span>
    </>
  )
}

export default AccountList