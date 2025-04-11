import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../store/reducers/globalReducer";
import Wrapper from "./Wrapper";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../store/services/userService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const Users = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { data = [], isFetching } = useGetAllUsersQuery(page);
  
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const [deleteUser] = useDeleteUserMutation();  

  const deleteUserHandler = (id) => {
    if (window.confirm("Kullanıcıyı silmek istediğinizden emin misiniz?")) {
      deleteUser(id);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, []);

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/dashboard/create-user" className="btn-dark">
          Kullanıcı Ekle <i className="bi bi-plus"></i>
        </Link>
      </ScreenHeader>
      {!isFetching ? (
        data?.length > 0 ? (
          <div>
            <table className="w-full bg-gray-900 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">Ad</th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">Email</th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">Rol</th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">Düzenle</th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">Sil</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((user) => (
                  <tr key={user._id} className="odd:bg-gray-800">
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {user.name}
                    </td>
                    <td className="p-3 text-sm font-normal text-gray-400">
                      {user.email}
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {user.admin ? "Admin" : "Kullanıcı"}
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      <Link
                        to={`/dashboard/edit-user/${user._id}`}
                        className="btn btn-warning"
                      >
                        düzenle
                      </Link>
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUserHandler(user._id)}
                      >
                        sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path="dashboard/users"
            />
          </div>
        ) : (
          "Kullanıcı bulunamadı!"
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};

export default Users; 