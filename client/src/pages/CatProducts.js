import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsByCategoryQuery } from '../store/services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CatProducts = () => {
    const { categoryId } = useParams();
    const { data: products, isLoading, error } = useGetProductsByCategoryQuery(categoryId);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Ürünler</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            {products?.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Bu kategoride henüz ürün bulunmamaktadır.</p>
                </div>
            )}
        </div>
    );
};

export default CatProducts; 