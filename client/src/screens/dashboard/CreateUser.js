import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { useCreateUserMutation } from "../../store/services/userService";
import { setSuccess } from "../../store/reducers/globalReducer";
import toast, { Toaster } from "react-hot-toast";

const CreateUser = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    admin: false
  });

  const [createUser, response] = useCreateUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(state);
  };

  useEffect(() => {
    if (response?.isSuccess) {
      dispatch(setSuccess(response?.data?.msg));
      navigate("/dashboard/users");
    }
  }, [response?.isSuccess]);

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/dashboard/users" className="btn-dark">
          <i className="bi bi-arrow-left-short"></i> Kullanıcılar
        </Link>
      </ScreenHeader>
      <Toaster position="top-right" />
      <div className="flex flex-wrap -mx-3">
        <form className="w-full xl:w-8/12 p-3" onSubmit={handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full p-3">
              <label htmlFor="name" className="label">
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                id="name"
                placeholder="Ad Soyad..."
                onChange={handleInput}
                value={state.name}
              />
            </div>
            <div className="w-full p-3">
              <label htmlFor="email" className="label">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                name="email"
                className="form-control"
                id="email"
                placeholder="Email..."
                onChange={handleInput}
                value={state.email}
              />
            </div>
            <div className="w-full p-3">
              <label htmlFor="password" className="label">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="password"
                placeholder="Şifre..."
                onChange={handleInput}
                value={state.password}
              />
            </div>
            <div className="w-full p-3">
              <label className="label inline-flex items-center">
                <input
                  type="checkbox"
                  name="admin"
                  className="form-checkbox"
                  onChange={(e) =>
                    setState({ ...state, admin: e.target.checked })
                  }
                  checked={state.admin}
                />
                <span className="ml-2">Admin Kullanıcı</span>
              </label>
            </div>
            <div className="w-full p-3">
              <input
                type="submit"
                value={response.isLoading ? "Yükleniyor..." : "Kullanıcı Oluştur"}
                disabled={response.isLoading}
                className="btn btn-indigo"
              />
            </div>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default CreateUser; 