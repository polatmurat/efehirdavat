const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
require('dotenv').config();

// MongoDB bağlantı URL'si
const MONGODB_URI = process.env.URL || 'mongodb://localhost:27017/efe-hirdavat';

// Türkçe karakterleri normalize eden yardımcı fonksiyon
function normalizeText(text) {
  if (!text) return '';
  
  // Türkçe karakterleri İngilizce karşılıklarına dönüştür
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c');
}

async function updateNormalizedFields() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB\'ye bağlandı');
    
    // Tüm ürünleri al
    const products = await ProductModel.find({});
    
    // Her ürün için normalize edilmiş alanları güncelle
    let updatedCount = 0;
    
    for (const product of products) {
      const normalizedTitle = normalizeText(product.title);
      const normalizedDescription = normalizeText(product.description);
      
      // Her zaman güncelle
      await ProductModel.updateOne(
        { _id: product._id },
        { 
          $set: { 
            normalizedTitle: normalizedTitle,
            normalizedDescription: normalizedDescription
          } 
        }
      );
      
      updatedCount++;
      console.log(`Ürün güncellendi: ${product.title} -> ${normalizedTitle}`);
    }
    
    console.log(`Toplam ${updatedCount} ürün güncellendi`);
    
    // Bağlantıyı kapat
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
    
  } catch (error) {
    console.error('Hata:', error);
  }
}

// Scripti çalıştır
updateNormalizedFields(); 