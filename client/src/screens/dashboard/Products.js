import {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from "use-debounce";
import { clearMessage } from "../../store/reducers/globalReducer";
import Wrapper from "./Wrapper"
import { useGetProductsQuery, useDeleteProductMutation } from "../../store/services/productService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const Products = () => {
   let {page} = useParams();
   if(!page) {
      page = 1;
   }
   const [searchTerm, setSearchTerm] = useState("");
   const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms debounce   

   const {data = {}, isFetching} = useGetProductsQuery({ page, search: debouncedSearchTerm });
   const {success} = useSelector(state => state.globalReducer);
    const dispatch = useDispatch();

    useEffect(() => {
     if(success) {
       toast.success(success);
     }
     return () => {
        dispatch(clearMessage())
     }
    }, [success, dispatch]) // success ve dispatch'i dependency array'e ekledik

    const [delProduct, response] = useDeleteProductMutation();
    
    const deleteProduct = id => {
      if(window.confirm("Are you really want to delete this product?")) {
          delProduct(id);
      }
    }

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    }

    return(
       <Wrapper>
         <ScreenHeader>
          <Link to="/dashboard/create-product" className="btn-dark">Ürün Oluştur</Link>
          <Toaster position="top-right" />
          </ScreenHeader>

          <div className="mb-4">
             <input 
               type="text"
               placeholder="Ürünlerde ara..."
               className="form-control w-full md:w-1/2 lg:w-1/3"
               value={searchTerm}
               onChange={handleSearchChange}
             />
          </div>

          {!isFetching ? (
             data?.products?.length > 0 ? (
                <div>
                   <table className="w-full bg-gray-900 rounded-md">
                   <thead>
                           <tr className="border-b border-gray-800 text-left">
                              <th className="p-3 uppercase text-sm font-medium text-gray-500">İsim</th>
                              <th className="p-3 uppercase text-sm font-medium text-gray-500">Fiyat</th>
                              <th className="p-3 uppercase text-sm font-medium text-gray-500">Stok</th>
                              <th className="p-3 uppercase text-sm font-medium text-gray-500">Resim</th>
                              <th className="p-3 uppercase text-sm font-medium text-gray-500">Düzenle</th>
                              <th className="p-3 uppercase text-sm font-medium text-gray-500">Sil</th>
                           </tr>
                        </thead>
                        <tbody>
                         {data?.products?.map(product => (
                            <tr className="odd:bg-gray-800" key={product._id}>
                               <td className="p-3 capitalize text-sm font-normal text-gray-400">{product.title}</td>
                               <td className="p-3 capitalize text-sm font-normal text-gray-400">{product.price}{product.currency === 'USD' ? '$' : '₺'}</td>
                               <td className="p-3 capitalize text-sm font-normal text-gray-400">{product.stock}</td>
                               <td className="p-3 capitalize text-sm font-normal text-gray-400">
                                  <img src={product.image1 ? product.image1.startsWith('http') ? product.image1 : `/images/${product.image1}`: '/images/No_image_available.svg'} alt={product.title} className="w-20 h-20 rounded-md object-cover" />
                               </td>
                               <td className="p-3 capitalize text-sm font-normal text-gray-400"><Link to={`/dashboard/edit-product/${product._id}`} className="btn btn-warning">düzenle</Link></td>
                               <td className="p-3 capitalize text-sm font-normal text-gray-400"><span className="btn btn-danger cursor-pointer" onClick={() => deleteProduct(product._id)}>sil</span></td>
                            </tr>
                         ))}
                        </tbody>
                   </table>
                   <Pagination page={parseInt(page)} perPage={data.perPage} count={data.count} path={`dashboard/products${debouncedSearchTerm ? `?search=${debouncedSearchTerm}` : ''}`} />
                 </div> 
             ) : (
                <p className="text-center text-gray-500">{debouncedSearchTerm ? 'Arama kriterlerine uygun ürün bulunamadı.' : 'Henüz ürün yok.'}</p>
             )
          ) : ( 
             <Spinner /> 
          )}
       </Wrapper>
    )
}
export default Products;