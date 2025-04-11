const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// .env dosyasını manuel olarak oku
const envPath = path.resolve(__dirname, '../.env');
let envContent = {};
try {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        envContent[key.trim()] = value.trim();
      }
    }
  });
} catch (error) {
  console.error('.env dosyası okunamadı:', error);
}

// MongoDB bağlantı URL'si - basitleştirilmiş
const mongoUrl = 'mongodb+srv://bomch4nte:123123xxw@clustermern.kbwkcm0.mongodb.net/efe-hirdavat';

console.log('MongoDB bağlantısı kuruluyor...');

// MongoDB bağlantısı
mongoose.connect(mongoUrl)
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Product modelini içe aktar
const ProductModel = require('../models/ProductModel');

// Tüm kategorileri küçük harfe çeviren fonksiyon
async function updateCategoriesToLowercase() {
  try {
    // Tüm ürünleri al
    const products = await ProductModel.find({});
    console.log(`Toplam ${products.length} ürün bulundu`);
    
    let updatedCount = 0;
    
    // Her ürün için kategoriyi küçük harfe çevir
    for (const product of products) {
      if (product.category) {
        const lowercaseCategory = product.category.toLowerCase();
        
        // Eğer kategori zaten küçük harf değilse güncelle
        if (product.category !== lowercaseCategory) {
          await ProductModel.updateOne(
            { _id: product._id },
            { $set: { category: lowercaseCategory } }
          );
          
          updatedCount++;
          console.log(`Ürün güncellendi: ${product.title} - Kategori: ${product.category} -> ${lowercaseCategory}`);
        }
      } else {
        // Kategori yoksa "diğer" olarak ayarla
        await ProductModel.updateOne(
          { _id: product._id },
          { $set: { category: 'diğer' } }
        );
        
        updatedCount++;
        console.log(`Ürün güncellendi: ${product.title} - Kategori: boş -> diğer`);
      }
    }
    
    console.log(`Toplam ${updatedCount} ürün güncellendi`);
    
    // İşlem tamamlandıktan sonra bağlantıyı kapat
    mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('Hata:', error);
    mongoose.connection.close();
  }
}

// Scripti çalıştır
updateCategoriesToLowercase(); 