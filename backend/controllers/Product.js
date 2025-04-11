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

class Product {
  async create(req, res) {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (!err) {
        const parsedData = JSON.parse(fields.data);
        const errors = [];

        // Sadece fiyat zorunlu, kategori zorunlu değil
        if (!parsedData.price || !(parseFloat(parsedData.price) > 0)) {
          errors.push({ msg: "Price should be above $1" });
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
            const category = parsedData.category ? parsedData.category.toLowerCase() : 'diğer';


            const response = await ProductModel.create({
              title: title,
              normalizedTitle: normalizedTitle,
              price: parseFloat(parsedData.price),
              currency: parsedData.currency,
              discount: parseInt(parsedData.discount) || 0,
              stock: parseInt(parsedData.stock) || 0,
              category: category,
              colors: parsedData.colors || [],
              sizes: fields.sizes ? JSON.parse(fields.sizes) : [],
              image1: images["image1"] ? images["image1"] : (typeof parsedData.image1 === 'string' ? parsedData.image1 : ''),
              image2: images["image2"] ? images["image2"] : (typeof parsedData.image2 === 'string' ? parsedData.image2 : ''),
              image3: images["image3"] ? images["image3"] : (typeof parsedData.image3 === 'string' ? parsedData.image3 : ''),
              description: description,
              normalizedDescription: normalizedDescription
            });



            return res.status(201).json({ msg: "Product has created", response });
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
    const { page = 1 } = req.params;
    const { search = '' } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    try {
      let query = {};

      if (search) {

        // Regex tabanlı arama
        query = {
          $or: [
            { normalizedTitle: new RegExp(searchTerm, 'i') },
            { normalizedDescription: new RegExp(searchTerm, 'i') }
          ]
        };

      }

      const count = await ProductModel.find(query).countDocuments();

      const response = await ProductModel.find(query)
        .skip(skip)
        .limit(perPage)
        .sort({ updatedAt: -1 });

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

        // Sadece fiyat zorunlu, kategori zorunlu değil
        if (!parsedData.price || parseInt(parsedData.price) < 1) {
          errors.push({ msg: "Price should be above $1" });
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
            const category = parsedData.category ? parsedData.category.toLowerCase() : 'diğer';

            const updateData = {
              title: title,
              normalizedTitle: normalizedTitle,
              price: parseInt(parsedData.price),
              currency: parsedData.currency || 'TL',
              discount: parseInt(parsedData.discount) || 0,
              stock: parseInt(parsedData.stock) || 0,
              category: category,
              description: description,
              normalizedDescription: normalizedDescription,
              sizes: fields.sizes ? JSON.parse(fields.sizes) : []
            };

            if (parsedData.colors && Array.isArray(parsedData.colors)) {
              updateData.colors = parsedData.colors;
            }

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
              return res.status(404).json({ msg: "Product not found" });
            }

            return res.status(200).json({ msg: "Product has been updated successfully", product: updatedProduct });
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
      return res.status(200).json({ msg: "Product has been deleted successfully" });
    } catch (error) {
      console.error("Product can't deleted:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // Tüm ürünlerin normalize edilmiş alanlarını güncelle
  async del20prods(req, res) {
    await ProductModel.find({})
      .sort({ _id: -1 }) // ObjectId'ye göre en son eklenenler
      .limit(20)
      .then(async (products) => {
        const ids = products.map(p => p._id);
        await ProductModel.deleteMany({ _id: { $in: ids } });
        console.log("Son 20 ürün silindi.");
      });

      return true;

  }
}
module.exports = new Product();
