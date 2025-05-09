import { useState } from "react";
import { TwitterPicker } from "react-color";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const ProductVariations = ({ variations = [], onVariationsChange }) => {
  const [variationForm, setVariationForm] = useState({
    size: "",
    price: "",
    stock: "",
    color: "",
    id: ""
  });
  
  const [selectedColor, setSelectedColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setVariationForm({
      ...variationForm,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    });
  };

  const saveColor = (color) => {
    setVariationForm({
      ...variationForm,
      color: color.hex
    });
    setSelectedColor(color.hex);
    setShowColorPicker(false);
  };

  const addVariation = () => {
    // Sadece boyut VEYA renk olmalı, ikisi birden olmamalı
    if (variationForm.size && variationForm.color) {
      toast.error("Lütfen sadece boyut VEYA renk seçiniz, ikisini birden seçemezsiniz!");
      return;
    }

    if (!variationForm.size && !variationForm.color) {
      toast.error("Lütfen en az bir varyasyon (boyut veya renk) seçiniz!");
      return;
    }

    const newVariation = {
      ...variationForm,
      id: uuidv4()
    };

    const updatedVariations = [...variations, newVariation];
    onVariationsChange(updatedVariations);

    // Reset form
    setVariationForm({
      size: "",
      price: "",
      stock: "",
      color: "",
      id: ""
    });
    setSelectedColor("");
  };

  const deleteVariation = (id) => {
    const filteredVariations = variations.filter(v => v.id !== id && v._id !== id);
    onVariationsChange(filteredVariations);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Ürün Varyasyonları</h3>
      
      <div className="mb-4">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/4 px-2 mb-3">
            <label className="label">
              Boyut (Opsiyonel)
            </label>
            <input
              type="text"
              name="size"
              className="form-control"
              placeholder="M, L, XL, 42, vs."
              value={variationForm.size}
              onChange={handleInput}
            />
          </div>
          
          <div className="w-full md:w-1/4 px-2 mb-3">
            <label className="label">
              Fiyat
            </label>
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="0"
              value={variationForm.price}
              onChange={handleInput}
            />
          </div>
          
          <div className="w-full md:w-1/4 px-2 mb-3">
            <label className="label">
              Koli İçi Adet
            </label>
            <input
              type="number"
              name="stock"
              className="form-control"
              placeholder="0"
              value={variationForm.stock}
              onChange={handleInput}
            />
          </div>
          
          <div className="w-full md:w-1/4 px-2 mb-3">
            <label className="label">
              Renk (Opsiyonel)
            </label>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 mr-2 border cursor-pointer relative"
                style={{ backgroundColor: selectedColor || "#fff" }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                {selectedColor && (
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor("");
                      setVariationForm(prev => ({ ...prev, color: "" }));
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="button"
                className="size text-gray-700 font-semibold bg-white"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                {showColorPicker ? "Kapat" : "Renk Seç"}
              </button>
            </div>
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <TwitterPicker
                  onChangeComplete={saveColor}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-indigo"
            onClick={addVariation}
          >
            Varyasyon Ekle
          </button>
        </div>
      </div>
      
      {variations.length > 0 && (
        <div className="p-4 rounded shadow">
          <h4 className="font-medium mb-3">Varyasyonlar</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Boyut</th>
                  <th className="py-2 px-4 border-b text-left">Fiyat</th>
                  <th className="py-2 px-4 border-b text-left">Stok</th>
                  <th className="py-2 px-4 border-b text-left">Renk</th>
                  <th className="py-2 px-4 border-b text-left">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {variations.map((variation) => (
                  <tr key={variation.id || variation._id}>
                    <td className="py-2 px-4 border-b">{variation.size || '-'}</td>
                    <td className="py-2 px-4 border-b">{variation.price}</td>
                    <td className="py-2 px-4 border-b">{variation.stock}</td>
                    <td className="py-2 px-4 border-b">
                      {variation.color ? (
                        <div 
                          className="w-6 h-6 rounded" 
                          style={{ backgroundColor: variation.color }}
                        />
                      ) : '-'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteVariation(variation.id || variation._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariations;