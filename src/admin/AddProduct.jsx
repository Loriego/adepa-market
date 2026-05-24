import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    description: "",
    stock: "In Stock",
    supplier: "",
    image: "",
    images: [],
    isFlashSale: false,
    isFeatured: false,
  });

  const cloudName = "dayc6qwau";
  const uploadPreset = "adepa_market";

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImages = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const uploadedImages = [];

      for (let file of selectedFiles) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const uploaded = await res.json();

        if (uploaded.secure_url) {
          uploadedImages.push(uploaded.secure_url);
        }
      }

      setProduct((prev) => {
        const allImages = [...prev.images, ...uploadedImages];

        return {
          ...prev,
          image: allImages[0],
          images: allImages,
        };
      });

      toast.success(`${uploadedImages.length} image(s) uploaded`);
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed");
    }

    setUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setProduct((prev) => {
      const newImages = prev.images.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prev,
        image: newImages[0] || "",
        images: newImages,
      };
    });

    toast.success("Image removed");
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (product.images.length === 0) {
      toast.error("Upload product images first");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        ...product,
        price: Number(product.price),
        oldPrice: Number(product.oldPrice || 0),
        discount: Number(product.discount || 0),
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully");

      setProduct({
        name: "",
        price: "",
        oldPrice: "",
        discount: "",
        category: "",
        description: "",
        stock: "In Stock",
        supplier: "",
        image: "",
        images: [],
        isFlashSale: false,
        isFeatured: false,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-5 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-xl p-6 md:p-10">
        <p className="text-orange-600 font-black">Adepa Market Admin</p>

        <h1 className="text-4xl md:text-5xl font-black mb-10">
          Add Product
        </h1>

        <form onSubmit={addProduct} className="space-y-8">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Current Price"
            value={product.price}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
            required
          />

          <input
            type="number"
            name="oldPrice"
            placeholder="Old Price / Was Price"
            value={product.oldPrice}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount Percentage e.g. 30"
            value={product.discount}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
          />

          <div className="grid md:grid-cols-2 gap-5">
            <label className="flex items-center gap-3 font-bold bg-orange-50 p-5 rounded-3xl">
              <input
                type="checkbox"
                checked={product.isFlashSale}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    isFlashSale: e.target.checked,
                  })
                }
              />
              Flash Sale Product
            </label>

            <label className="flex items-center gap-3 font-bold bg-orange-50 p-5 rounded-3xl">
              <input
                type="checkbox"
                checked={product.isFeatured}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    isFeatured: e.target.checked,
                  })
                }
              />
              Featured Product
            </label>
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none h-40"
            required
          ></textarea>

          <select
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
          >
            <option>In Stock</option>
            <option>Pre Order</option>
            <option>Out of Stock</option>
          </select>

          <input
            type="text"
            name="supplier"
            placeholder="Supplier / Shop Location"
            value={product.supplier}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 p-5 md:p-6 rounded-3xl text-lg outline-none"
          />

          <label className="block border-2 border-dashed border-orange-300 rounded-[2rem] p-10 text-center bg-orange-50 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => uploadImages(e.target.files)}
              className="hidden"
            />

            <p className="text-2xl font-black text-orange-600">
              Click to Upload Images
            </p>

            <p className="mt-3 text-gray-500">
              Select many images at once, or upload more later
            </p>
          </label>

          {uploading && (
            <p className="font-black text-orange-600">Uploading images...</p>
          )}

          {product.images.length > 0 && (
            <div>
              <p className="font-black text-orange-600 mb-4">
                {product.images.length} image(s) uploaded
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {product.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt="Product preview"
                      className="w-full h-40 object-cover rounded-2xl border"
                    />

                    <span className="absolute top-2 left-2 bg-black text-white text-sm px-3 py-1 rounded-full">
                      {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-orange-600 hover:bg-orange-700 transition text-white text-xl md:text-2xl font-black py-5 md:py-6 rounded-full"
          >
            {loading
              ? "Adding Product..."
              : uploading
              ? "Uploading..."
              : "Add Product"}
          </button>
        </form>
      </div>
    </main>
  );
}