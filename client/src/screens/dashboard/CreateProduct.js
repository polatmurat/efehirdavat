import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { TwitterPicker } from "react-color"
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from "react-quill"
import toast, { Toaster } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import ScreenHeader from "../../components/ScreenHeader"
import Wrapper from "./Wrapper"
import { useAllCategoriesQuery } from "../../store/services/categoryService"
import { useCProductMutation } from "../../store/services/productService";
import Spinner from "../../components/Spinner"
import Colors from "../../components/Colors";
import SizesList from "../../components/SizesList";
import ImagesPreview from "../../components/ImagesPreview";
import { setSuccess } from "../../store/reducers/globalReducer";
const CreateProduct = () => {
    const { data = [], isFetching } = useAllCategoriesQuery();
    const [value, setValue] = useState('');
    const [state, setState] = useState({
        title: '',
        price: 0,
        currency: 'TL',
        discount: 0,
        stock: 0,
        category: '',
        isAvailable: true,
        colors: [],
        image1: '',
        image2: '',
        image3: ''
    });
    const [imageUrls, setImageUrls] = useState({
        image1: '',
        image2: '',
        image3: ''
    });
    const [sizeInput, setSizeInput] = useState('');
    const [sizeList, setSizeList] = useState([]);
    const [preview, setPreview] = useState({
        image1: '',
        image2: '',
        image3: ''
    })


    const imageHandle = e => {
        if (e.target.files.length !== 0) {
            setState({ ...state, [e.target.name]: e.target.files[0] });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview({ ...preview, [e.target.name]: reader.result })
            }
            reader.readAsDataURL(e.target.files[0]);
            // URL alanını temizle
            setImageUrls({ ...imageUrls, [e.target.name]: '' });
        }
    }

    const handleImageUrlChange = (e) => {
        const { name, value } = e.target;
        setImageUrls({ ...imageUrls, [name]: value });

        // URL girildiğinde preview'i güncelle
        if (value.trim() !== '') {
            setPreview({ ...preview, [name]: value });
            // Dosya alanını temizle
            setState({ ...state, [name]: '' });
        }
    }

    const handleInput = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const saveColors = (color) => {
        const filtered = state.colors.filter((clr) => clr.color !== color.hex);
        setState({ ...state, colors: [...filtered, { color: color.hex, id: uuidv4() }] })
    }
    const deleteColor = color => {
        const filtered = state.colors.filter(clr => clr.color !== color.color);
        setState({ ...state, colors: filtered });
    }

    const addSize = () => {
        if (sizeInput.trim() !== '') {
            const newSize = { name: sizeInput.trim() };
            setSizeList([...sizeList, newSize]);
            setSizeInput('');
        }
    }

    const handleSizeInputChange = (e) => {
        setSizeInput(e.target.value);
    }

    const handleSizeKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSize();
        }
    }

    const deleteSize = name => {
        const filtered = sizeList.filter(size => size.name !== name);
        setSizeList(filtered);
    }

    const [createNewProduct, response] = useCProductMutation();
    const createPro = e => {
        e.preventDefault();
        const formData = new FormData();

        // Ürün verilerini hazırla
        const productData = { ...state };

        // URL ile girilen resimleri ekle
        if (imageUrls.image1) productData.image1 = imageUrls.image1;
        if (imageUrls.image2) productData.image2 = imageUrls.image2;
        if (imageUrls.image3) productData.image3 = imageUrls.image3;

        formData.append('data', JSON.stringify(productData));
        formData.append('sizes', JSON.stringify(sizeList));
        formData.append('description', value);

        // Dosya olarak yüklenen resimleri ekle
        if (state.image1 && state.image1 instanceof File) formData.append('image1', state.image1);
        if (state.image2 && state.image2 instanceof File) formData.append('image2', state.image2);
        if (state.image3 && state.image3 instanceof File) formData.append('image3', state.image3);

        createNewProduct(formData);
    }
    useEffect(() => {
        if (!response.isSuccess) {
            response?.error?.data?.errors.map(err => {
                toast.error(err.msg);
            })
        }
    }, [response?.error?.data?.errors])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (response?.isSuccess) {
            dispatch(setSuccess(response?.data?.msg));
            navigate('/dashboard/products');
        }
    }, [response?.isSuccess])
    const handleCurrencyChange = (currency) => {
        setState({ ...state, currency: currency });
    }

    const handleAvailability = (isAvailable) => {
        setState({ ...state, isAvailable: isAvailable });
    }
    return (
        <Wrapper>
            <ScreenHeader>
                <Link to="/dashboard/products" className="btn-dark"><i className="bi bi-arrow-left-short"></i> products list</Link>
            </ScreenHeader>
            <Toaster position="top-right" reverseOrder={true} />
            <div className="flex flex-wrap -mx-3">
                <form className="w-full xl:w-8/12 p-3" onSubmit={createPro}>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-6/12 p-3">
                            <label htmlFor="title" className="label">Ürün Başlığı</label>
                            <input type="text" name="title" className="form-control" id="title" placeholder="ürün..." onChange={handleInput} value={state.title} />
                        </div>
                        <div className="w-full md:w-6/12 p-3">
                            <label htmlFor="price" className="label">Fiyat</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="price"
                                    className="form-control rounded-r-none"
                                    id="price"
                                    placeholder="fiyat..."
                                    onChange={handleInput}
                                    value={state.price}
                                />
                                <div className="flex">
                                    <button
                                        type="button"
                                        className={`size ${state.currency === 'TL' ? 'bg-gray-100' : ''}`}
                                        onClick={() => handleCurrencyChange('TL')}
                                    >
                                        ₺
                                    </button>
                                    <button
                                        type="button"
                                        className={`size ${state.currency === 'USD' ? 'bg-gray-100' : ''}`}
                                        onClick={() => handleCurrencyChange('USD')}
                                    >
                                        $
                                    </button>
                                    <button
                                        type="button"
                                        className={`size ${state.currency === 'EUR' ? 'bg-gray-100' : ''}`}
                                        onClick={() => handleCurrencyChange('EUR')}
                                    >
                                        €
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 p-3">
                            <label htmlFor="isAvailable" className="label">Stokta Mevcut Mu?</label>
                            <button
                                type="button"
                                className={`size ${state.isAvailable === true ? 'bg-gray-100' : ''}`}
                                onClick={() => handleAvailability(true)}
                            >
                                EVET
                            </button>
                            <button
                                type="button"
                                className={`size ${state.isAvailable === false ? 'bg-gray-100' : ''}`}
                                onClick={() => handleAvailability(false)}
                            >
                                HAYIR
                            </button>
                        </div>
                        <div className="w-full md:w-6/12 p-3">
                            <label htmlFor="stock" className="label">Koli İçi Adet</label>
                            <input type="number" name="stock" className="form-control" id="stock" placeholder="Koli İçi Adet..." onChange={handleInput} value={state.stock} />
                        </div>
                        <div className="w-full md:w-6/12 p-3">
                            <label htmlFor="categories" className="label">Kategoriler</label>
                            {!isFetching ? data?.categories?.length > 0 && <select name="category" id="categories" className="form-control uppercase" onChange={handleInput} value={state.category}>
                                <option value="">Kategori seçiniz</option>
                                {data?.categories?.map(category => (
                                    <option value={category.name} key={category._id} className="uppercase">{category.name}</option>
                                ))}
                            </select> : <Spinner />}
                        </div>
                        <div className="w-full md:w-6/12 p-3">
                            <label htmlFor="colors" className="label">Renk Seçiniz</label>
                            <TwitterPicker onChangeComplete={saveColors} />
                        </div>

                        <div className="w-full p-3">
                            <label htmlFor="sizes" className="label">Boyut Seçiniz</label>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-8/12 p-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Boyut giriniz..."
                                        value={sizeInput}
                                        onChange={handleSizeInputChange}
                                        onKeyPress={handleSizeKeyPress}
                                    />
                                </div>
                                <div className="w-full md:w-4/12 p-3">
                                    <button
                                        type="button"
                                        className="btn btn-indigo w-20"
                                        onClick={addSize}
                                    >
                                        Ekle
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Resim 1 */}
                        <div className="w-full p-3">
                            <label htmlFor="image1" className="label">
                                Resim 1
                            </label>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-6/12 p-3">
                                    <input type="file" name="image1" id="image1" className="input-file" onChange={imageHandle} />
                                </div>
                                <div className="w-full md:w-6/12 p-3">
                                    <input
                                        type="text"
                                        name="image1"
                                        className="form-control"
                                        placeholder="Resim URL'si giriniz..."
                                        value={imageUrls.image1.startsWith("http") ? imageUrls.image1 : ''}
                                        onChange={handleImageUrlChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Resim 2 */}
                        <div className="w-full p-3">
                            <label htmlFor="image2" className="label">
                                Resim 2
                            </label>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-6/12 p-3">
                                    <input type="file" name="image2" id="image2" className="input-file" onChange={imageHandle} />
                                </div>
                                <div className="w-full md:w-6/12 p-3">
                                    <input
                                        type="text"
                                        name="image2"
                                        className="form-control"
                                        placeholder="Resim URL'si giriniz..."
                                        value={imageUrls.image2}
                                        onChange={handleImageUrlChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Resim 3 */}
                        <div className="w-full p-3">
                            <label htmlFor="image3" className="label">
                                Resim 3
                            </label>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-6/12 p-3">
                                    <input type="file" name="image3" id="image3" className="input-file" onChange={imageHandle} />
                                </div>
                                <div className="w-full md:w-6/12 p-3">
                                    <input
                                        type="text"
                                        name="image3"
                                        className="form-control"
                                        placeholder="Resim URL'si giriniz..."
                                        value={imageUrls.image3}
                                        onChange={handleImageUrlChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-3">
                            <label htmlFor="description" className="label">
                                Açıklama
                            </label>
                            <ReactQuill theme="snow" id="description" value={value} onChange={setValue} placeholder="Açıklama..." />
                        </div>
                        <div className="w-full p-3">
                            <input type="submit" value={response.isLoading ? 'Yükleniyor...' : 'Ürünü Kaydet'} disabled={response.isLoading ? true : false} className="btn btn-indigo" />
                        </div>
                    </div>
                </form>
                <div className="w-full xl:w-4/12 p-3">
                    <Colors colors={state.colors} deleteColor={deleteColor} />
                    <SizesList list={sizeList} deleteSize={deleteSize} />
                    <ImagesPreview url={preview.image1} heading="image 1" />
                    <ImagesPreview url={preview.image2} heading="image 2" />
                    <ImagesPreview url={preview.image3} heading="image 3" />
                </div>
            </div>
        </Wrapper>
    )
}
export default CreateProduct