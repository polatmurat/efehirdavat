import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct, getCategories } from '../../api';
import Spinner from '../../components/Spinner';

const ProductDetail = () => {
    const { id } = useParams();
    const [state, setState] = useState({
        categoryId: '',
        // ... other state properties
    });

    const { data: productData, isLoading: isFetchingProduct } = useQuery(['product', id], () => getProduct(id));
    const { data: categoriesData, isLoading: isFetchingCategories } = useQuery(['categories'], getCategories);

    const handleInput = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (productData) {
            setState({
                ...state,
                categoryId: productData.categoryId || '',
                // ... other state updates
            });
        }
    }, [productData]);

    const isFetching = isFetchingProduct || isFetchingCategories;
    const data = {
        categories: categoriesData?.categories || []
    };

    return (
        <div className="w-full md:w-6/12 p-3">
            <label htmlFor="categories" className="label">Kategori</label>
            {!isFetching ? data?.categories?.length > 0 && <select name="categoryId" id="categories" className="form-control uppercase" onChange={handleInput} value={state.categoryId}>
                <option value="">Kategori seçiniz</option>
                {data?.categories?.map(category => (
                    <option value={category._id} key={category._id} className="uppercase">{category.name}</option>
                ))}
            </select> : <Spinner />}
        </div>
    );
};

export default ProductDetail; 