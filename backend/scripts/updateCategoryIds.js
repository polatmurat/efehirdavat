require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/Category');

// Kategori ismini normalize eden fonksiyon
function normalizeCategoryName(name) {
    if (!name) return '';
    
    return name.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/g, '') // Özel karakterleri kaldır
        .replace(/\s+/g, ' ') // Birden fazla boşluğu tek boşluğa çevir
        .trim(); // Baştaki ve sondaki boşlukları kaldır
}

async function updateCategoryIds() {
    try {
        // MongoDB bağlantısı
        const mongoURL = "mongodb+srv://bomch4nte:123123xxw@clustermern.kbwkcm0.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMern";
        if (!mongoURL) {
            throw new Error('URL environment variable is not set');
        }

        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB bağlantısı başarılı');

        // Tüm kategorileri al
        const categories = await CategoryModel.find({});
        console.log(`${categories.length} kategori bulundu`);

        // Kategori isimlerini normalize et ve ID'leri eşleştir
        const categoryMap = new Map();
        categories.forEach(category => {
            const normalizedName = normalizeCategoryName(category.name);
            categoryMap.set(normalizedName, category._id);
            console.log(`Kategori eşleştirmesi: "${category.name}" -> "${normalizedName}"`);
        });

        // Tüm ürünleri al
        const products = await ProductModel.find({});
        console.log(`${products.length} ürün bulundu`);

        // Her ürün için kategori ID'sini güncelle
        let updatedCount = 0;
        let notFoundCount = 0;
        let notFoundCategories = new Set();

        for (const product of products) {
            const normalizedCategory = normalizeCategoryName(product.category);
            const categoryId = categoryMap.get(normalizedCategory);
            
            if (categoryId) {
                await ProductModel.updateOne(
                    { _id: product._id },
                    { $set: { categoryId: categoryId } }
                );
                updatedCount++;
                console.log(`Ürün güncellendi: "${product.title}" -> "${product.category}"`);
            } else {
                notFoundCount++;
                notFoundCategories.add(product.category);
                console.log(`Kategori bulunamadı: "${product.category}" -> "${normalizedCategory}"`);
            }
        }

        console.log('\nÖzet:');
        console.log(`Toplam ${updatedCount} ürün güncellendi`);
        console.log(`${notFoundCount} ürün için kategori bulunamadı`);
        console.log('\nBulunamayan kategoriler:');
        notFoundCategories.forEach(category => {
            console.log(`- "${category}" -> "${normalizeCategoryName(category)}"`);
        });

    } catch (error) {
        console.error('Hata:', error);
    } finally {
        // MongoDB bağlantısı kapat
        await mongoose.connection.close();
        console.log('\nMongoDB bağlantısı kapatıldı');
    }
}

// Scripti çalıştır
updateCategoryIds(); 