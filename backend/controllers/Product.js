const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const ProductModel = require("../models/ProductModel");

// Türkçe karakterleri normalize eden yardımcı fonksiyon
function normalizeText(text) {
  if (!text) return '';

  // Metni küçük harfe çevir
  const lowerCase = text.toLowerCase();

  // Türkçe karakterleri Latin eşdeğerleriyle değiştir
  const normalized = lowerCase
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/i̇/g, 'i'); // Unicode birleşik i̇ karakteri

  return normalized;
}

// Varyasyonların toplamını hesaplayan yardımcı fonksiyon
function calculateTotals(variations) {
  if (!variations || !Array.isArray(variations) || variations.length === 0) {
    return { totalStock: 0, basePrice: 0 };
  }

  let totalStock = 0;
  // Baz fiyat olarak en düşük varyasyon fiyatını kullanalım
  let basePrice = variations[0].price;

  variations.forEach(variation => {
    totalStock += parseInt(variation.stock) || 0;
    if (variation.price < basePrice) {
      basePrice = variation.price;
    }
  });

  return { totalStock, basePrice };
}

class Product {
  async create(req, res) {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (!err) {
        const parsedData = JSON.parse(fields.data);
        const errors = [];

        // Ürünün en az bir fiyatı olmalı - ya ana fiyat ya da varyasyonlar
        const variations = fields.variations ? JSON.parse(fields.variations) : [];
        const hasValidPrice = (parsedData.price && parseFloat(parsedData.price) > 0) ||
          (variations.length > 0 && variations.some(v => parseFloat(v.price) > 0));

        if (!hasValidPrice) {
          errors.push({ msg: "Ürün için geçerli bir fiyat belirtilmelidir" });
        }

        if (errors.length === 0) {
          const images = {};
          // Resimler opsiyonel
          if (files["image1"]) {
            const mimeType = files["image1"].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (extension === "jpeg" || extension === "jpg" || extension === "png") {
              const imageName = uuidv4() + `.${extension}`;
              const __dirname = path.resolve();
              const newPath = __dirname + `/../client/public/images/${imageName}`;
              images["image1"] = imageName;
              fs.copyFile(files["image1"].filepath, newPath, (err) => {
                if (err) console.log(err);
              });
            }
          }
          if (files["image2"]) {
            const mimeType = files["image2"].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (extension === "jpeg" || extension === "jpg" || extension === "png") {
              const imageName = uuidv4() + `.${extension}`;
              const __dirname = path.resolve();
              const newPath = __dirname + `/../client/public/images/${imageName}`;
              images["image2"] = imageName;
              fs.copyFile(files["image2"].filepath, newPath, (err) => {
                if (err) console.log(err);
              });
            }
          }
          if (files["image3"]) {
            const mimeType = files["image3"].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (extension === "jpeg" || extension === "jpg" || extension === "png") {
              const imageName = uuidv4() + `.${extension}`;
              const __dirname = path.resolve();
              const newPath = __dirname + `/../client/public/images/${imageName}`;
              images["image3"] = imageName;
              fs.copyFile(files["image3"].filepath, newPath, (err) => {
                if (err) console.log(err);
              });
            }
          }

          try {
            // Orijinal metinleri koru, normalize edilmiş versiyonları da ekle
            const title = parsedData.title || '';
            const description = fields.description || '';
            const normalizedTitle = normalizeText(title);
            const normalizedDescription = normalizeText(description);
            const category = typeof parsedData.category === 'string' ? parsedData.category.toLowerCase() : 'diğer';
            const isAvailable = parsedData.hasOwnProperty("isAvailable") ? parsedData.isAvailable : true;

            // Varyasyonlar varsa stock ve price hesapla
            let basePrice = parseFloat(parsedData.price) || 0;
            let totalStock = parseInt(parsedData.stock) || 0;

            // Varyasyonlar varsa onların fiyat ve stoklarını kullan
            if (variations.length > 0) {
              const { totalStock: varTotalStock, basePrice: varBasePrice } = calculateTotals(variations);

              // Eğer ana ürün fiyatı belirtilmemişse varyasyonların en düşük fiyatını kullan
              if (!parsedData.price || parseFloat(parsedData.price) <= 0) {
                basePrice = varBasePrice;
              }

              // Eğer ana ürün stoku belirtilmemişse varyasyonların toplam stokunu kullan
              if (!parsedData.stock || parseInt(parsedData.stock) <= 0) {
                totalStock = varTotalStock;
              }
            }

            const response = await ProductModel.create({
              title: title,
              normalizedTitle: normalizedTitle,
              price: basePrice,
              currency: parsedData.currency || 'TL',
              discount: parseInt(parsedData.discount) || 0,
              stock: totalStock,
              category: category,
              isAvailable: isAvailable,
              variations: variations,
              image1: images["image1"] ? images["image1"] : (typeof parsedData.image1 === 'string' ? parsedData.image1 : ''),
              image2: images["image2"] ? images["image2"] : (typeof parsedData.image2 === 'string' ? parsedData.image2 : ''),
              image3: images["image3"] ? images["image3"] : (typeof parsedData.image3 === 'string' ? parsedData.image3 : ''),
              description: description,
              normalizedDescription: normalizedDescription
            });

            return res.status(201).json({ msg: "Ürün başarıyla oluşturuldu", response });
          } catch (error) {
            console.log(error);
            return res.status(500).json(error);
          }
        } else {
          return res.status(400).json({ errors });
        }
      }
    });
  }

  async get(req, res) {
    const page = parseInt(req.params.page) || 1;
    const { search = '' } = req.query;
    const perPage = 52;
    const skip = (page - 1) * perPage;

    try {
      let query = {};

      if (search) {
        const searchRegex = new RegExp(search, 'i');

        // Regex tabanlı arama
        query = {
          $or: [
            { normalizedTitle: searchRegex },
            { normalizedDescription: searchRegex }
          ]
        };
      }

      const count = await ProductModel.find(query).countDocuments();

      const response = await ProductModel.find(query)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1, _id: 1 });

      return res.status(200).json({ products: response, perPage, count });
    } catch (error) {
      console.log('Arama hatası:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductModel.findOne({ _id: id });

      return res.status(200).json(product);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (!err) {
        const parsedData = JSON.parse(fields.data);
        const errors = [];
        const __dirname = path.resolve();

        // Ürünün en az bir fiyatı olmalı - ya ana fiyat ya da varyasyonlar
        const variations = fields.variations ? JSON.parse(fields.variations) : [];
        const hasValidPrice = (parsedData.price && parseFloat(parsedData.price) > 0) ||
          (variations.length > 0 && variations.some(v => parseFloat(v.price) > 0));

        if (!hasValidPrice) {
          errors.push({ msg: "Ürün için geçerli bir fiyat belirtilmelidir" });
        }

        if (errors.length === 0) {
          const images = {};
          // Resimler opsiyonel
          if (files["image1"]) {
            const mimeType = files["image1"].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (extension === "jpeg" || extension === "jpg" || extension === "png") {
              const imageName = uuidv4() + `.${extension}`;
              const newPath = __dirname + `/../client/public/images/${imageName}`;
              images["image1"] = imageName;
              fs.copyFile(files["image1"].filepath, newPath, (err) => {
                if (err) console.log(err);
              });
            }
          }
          if (files["image2"]) {
            const mimeType = files["image2"].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (extension === "jpeg" || extension === "jpg" || extension === "png") {
              const imageName = uuidv4() + `.${extension}`;
              const __dirname = path.resolve();
              const newPath = __dirname + `/../client/public/images/${imageName}`;
              images["image2"] = imageName;
              fs.copyFile(files["image2"].filepath, newPath, (err) => {
                if (err) console.log(err);
              });
            }
          }
          if (files["image3"]) {
            const mimeType = files["image3"].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (extension === "jpeg" || extension === "jpg" || extension === "png") {
              const imageName = uuidv4() + `.${extension}`;
              const __dirname = path.resolve();
              const newPath = __dirname + `/../client/public/images/${imageName}`;
              images["image3"] = imageName;
              fs.copyFile(files["image3"].filepath, newPath, (err) => {
                if (err) console.log(err);
              });
            }
          }

          try {
            // Orijinal metinleri koru, normalize edilmiş versiyonları da ekle
            const title = parsedData.title || '';
            const description = fields.description || '';
            const normalizedTitle = normalizeText(title);
            const normalizedDescription = normalizeText(description);
            const category = typeof parsedData.category === 'string' ? parsedData.category.toLowerCase() : 'diğer';
            const isAvailable = parsedData.hasOwnProperty("isAvailable") ? parsedData.isAvailable : true;

            // Varyasyonlar varsa stock ve price hesapla
            let basePrice = parseFloat(parsedData.price) || 0;
            let totalStock = parseInt(parsedData.stock) || 0;

            // Varyasyonlar varsa onların fiyat ve stoklarını kullan
            if (variations.length > 0) {
              const { totalStock: varTotalStock, basePrice: varBasePrice } = calculateTotals(variations);

              // Eğer ana ürün fiyatı belirtilmemişse varyasyonların en düşük fiyatını kullan
              if (!parsedData.price || parseFloat(parsedData.price) <= 0) {
                basePrice = varBasePrice;
              }

              // Eğer ana ürün stoku belirtilmemişse varyasyonların toplam stokunu kullan
              if (!parsedData.stock || parseInt(parsedData.stock) <= 0) {
                totalStock = varTotalStock;
              }
            }

            const updateData = {
              title: title,
              normalizedTitle: normalizedTitle,
              price: basePrice,
              currency: parsedData.currency || 'TL',
              discount: parseInt(parsedData.discount) || 0,
              stock: totalStock,
              category: category,
              isAvailable: isAvailable,
              description: description,
              normalizedDescription: normalizedDescription,
              variations: variations
            };

            if (images["image1"]) updateData.image1 = images["image1"];
            if (images["image2"]) updateData.image2 = images["image2"];
            if (images["image3"]) updateData.image3 = images["image3"];

            if (parsedData.image1 && !updateData.image1) updateData.image1 = parsedData.image1;
            if (parsedData.image2 && !updateData.image2) updateData.image2 = parsedData.image2;
            if (parsedData.image3 && !updateData.image3) updateData.image3 = parsedData.image3;

            const updatedProduct = await ProductModel.findByIdAndUpdate(
              parsedData._id,
              { $set: updateData },
              { new: true }
            );

            if (!updatedProduct) {
              return res.status(404).json({ msg: "Ürün bulunamadı" });
            }

            return res.status(200).json({ msg: "Ürün başarıyla güncellendi", product: updatedProduct });
          } catch (error) {
            console.log(error);
            return res.status(500).json(error);
          }
        } else {
          return res.status(400).json({ errors });
        }
      }
    });
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductModel.findOne({ _id: id });

      for (let number of [1, 2, 3]) {
        let key = `image${number}`;
        let image = product[key];
        if (!image) continue; // Eğer görsel yoksa atla

        const imagePath = path.join(__dirname, "..", "client", "public", "images", image);

        // Dosya gerçekten var mı kontrol et
        if (fs.existsSync(imagePath)) {
          try {
            await fs.promises.unlink(imagePath);
          } catch (err) {
            console.warn(`⚠️ ${imagePath} silinemedi:`, err.message);
          }
        }
      }

      await ProductModel.findByIdAndDelete(id);
      return res.status(200).json({ msg: "Ürün başarıyla silindi" });
    } catch (error) {
      console.error("Ürün silinemedi:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteAll(req, res) {
    try {
      await ProductModel.deleteMany({});
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new Product();