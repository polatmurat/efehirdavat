import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { useUpdateUserMutation, useGetUserQuery } from "../../store/services/userService";
import { setSuccess } from "../../store/reducers/globalReducer";
import toast, { Toaster } from "react-hot-toast";

const EditUser = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    admin: false
  });

  const { id } = useParams();
  const [updateUser, response] = useUpdateUserMutation();
  const { data: userData, isSuccess: isUserDataSuccess, isLoading, error } = useGetUserQuery(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    
    if (userData) {
      setState({
        name: userData.name || "",
        email: userData.email || "",
        password:  "",
        admin: userData.admin || false
      });
    }
  }, [userData]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Zorunlu alanları kontrol et
    if (!state.name.trim()) {
      toast.error("İsim alanı zorunludur!");
      return;
    }
    if (!state.email.trim()) {
      toast.error("Kullanıcı adı alanı zorunludur!");
      return;
    }
    if (!state.email.length >= 3) {
      toast.error("Kullanıcı adınız 3 veya daha fazla karakterden oluşmalıdır.");
      return;
    }

    // Eğer password boşsa, updateUser'a gönderme
    const updateData = { ...state };
    if (!updateData.password) {
      delete updateData.password;
    }



    updateUser({ id, user: updateData });
  };

  useEffect(() => {
    if (response?.isSuccess) {
      dispatch(setSuccess(response?.data?.msg));
      navigate("/dashboard/users");
    }
  }, [response?.isSuccess]);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">Kullanıcı bilgileri yüklenirken bir hata oluştu.</div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/dashboard/users" className="btn-dark">
          <i className="bi bi-arrow-left"></i> Kullanıcı Listesi
        </Link>
      </ScreenHeader>
      <div className="w-full md:w-8/12">
        <form onSubmit={handleSubmit} className=" rounded-lg p-6" autoComplete="off">
          <h3 className="text-lg font-medium mb-4">Kullanıcı Düzenle</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleInput}
              className="form-input w-full text-black2"
              placeholder="Kullanıcı adı"
              required
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={state.email}
              onChange={handleInput}
              className="form-input w-full text-black2"
              placeholder="Username..."
              required
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={state.password}
              onChange={handleInput}
              className="form-input w-full text-black2"
              placeholder="Şifreyi değiştirmek için doldurun"
              autoComplete="new-password"
            />
            <p className="text-sm text-gray-500 mt-1">
              Şifreyi değiştirmek istemiyorsanız boş bırakın
            </p>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="admin"
                checked={state.admin}
                onChange={handleInput}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700">Admin Yetkisi</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-indigo"
              disabled={response.isLoading}
            >
              {response.isLoading ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </Wrapper>
  );
};

export default EditUser; 