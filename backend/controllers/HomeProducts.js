const ProductModel = require("../models/ProductModel");

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

class HomeProducts {
  async catProducts(req, res) {
    const { categoryId, page, keyword } = req.params;
    
    const perPage = 12;
    const skip = (page - 1) * perPage;
    
    // Arama seçeneklerini belirle
    let options = {};
    
    if (categoryId) {
      // Kategori ID bazlı arama
      options = { categoryId: categoryId };
    } else if (keyword) {
      // Anahtar kelime bazlı arama - büyük/küçük harf duyarsız ve Türkçe karakter duyarsız
      
      // Türkçe karakterleri normalize et
      const normalizedKeyword = normalizeText(keyword);
      
      // Regex oluştur - büyük/küçük harf duyarsız
      const regex = new RegExp(normalizedKeyword, 'i');
      
      // Arama sorgusunu genişlet - hem orijinal alanlarda hem de normalize edilmiş alanlarda arama yap
      options = { 
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
          { normalizedTitle: { $regex: regex } },
          { normalizedDescription: { $regex: regex } }
        ] 
      };
      
      // Arama sorgusunu daha detaylı incelemek için
      const products = await ProductModel.find(options);
      
      // Eğer hiç ürün bulunamadıysa, daha basit bir arama yap
      if (products.length === 0) {
        
        // Daha basit bir arama sorgusu oluştur
        const simpleOptions = {
          $or: [
            { title: { $regex: new RegExp(keyword, 'i') } },
            { description: { $regex: new RegExp(keyword, 'i') } }
          ]
        };
        
        const simpleProducts = await ProductModel.find(simpleOptions);

        // Eğer basit arama sonuçları varsa, options'ı güncelle
        if (simpleProducts.length > 0) {
          options = simpleOptions;
        }
      }
    }
    
    if (page) {
      try {
        const count = await ProductModel.find(options).countDocuments();
        const response = await ProductModel.find(options)
          .skip(skip)
          .limit(perPage)
          .sort({ createdAt: -1, _id: 1 });
        
        return res.status(200).json({ products: response, perPage, count });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
      }
    } else {
      try {
        const response = await ProductModel.find(options)
          .limit(4)
          .sort({ createdAt: -1, 
           });
        return res.status(200).json({ products: response });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
module.exports = new HomeProducts();
