import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      toast.error("Product not found");
      navigate("/vendor/products");
      return;
    }

    const data = docSnap.data();

    if (data.vendorId !== user.uid) {
      toast.error("You cannot edit this product");
      navigate("/vendor/products");
      return;
    }

    setProduct({
      ...data,
      oldPrice: data.oldPrice || "",
      discount: data.discount || "",
      images: data.images?.length ? data.images : [data.image],
    });
  };

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

  const updateProduct = async (e) => {
    e.preventDefault();

    if (product.images.length === 0) {
      toast.error("Product must have at least one image");
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, "products", id), {
        ...product,
        price: Number(product.price),
        oldPrice: Number(product.oldPrice || 0),
        discount: Number(product.discount || 0),
        image: product.images[0],
      });

      toast.success("Product updated successfully");
      navigate("/vendor/products");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <form
          onSubmit={updateProduct}
          className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 shadow-xl"
        >
          <p className="text-orange-600 font-black">Vendor Product Manager</p>

          <h1 className="text-4xl md:text-5xl font-black mt-2 mb-8">
            Edit Product
          </h1>

          <div className="grid gap-6">
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-5 rounded-2xl"
              required
            />

            <input
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Current Price"
              type="number"
              className="border p-5 rounded-2xl"
              required
            />

            <input
              name="oldPrice"
              value={product.oldPrice}
              onChange={handleChange}
              placeholder="Old Price"
              type="number"
              className="border p-5 rounded-2xl"
            />

            <input
              name="discount"
              value={product.discount}
              onChange={handleChange}
              placeholder="Discount Percentage"
              type="number"
              className="border p-5 rounded-2xl"
            />

            <input
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Category"
              className="border p-5 rounded-2xl"
              required
            />

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-5 rounded-2xl h-40"
              required
            ></textarea>

            <select
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="border p-5 rounded-2xl"
            >
              <option>In Stock</option>
              <option>Pre Order</option>
              <option>Out of Stock</option>
            </select>

            <input
              name="supplier"
              value={product.supplier}
              onChange={handleChange}
              placeholder="Supplier / Source"
              className="border p-5 rounded-2xl"
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

            <label className="block border-2 border-dashed border-orange-300 rounded-[2rem] p-10 text-center bg-orange-50 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => uploadImages(e.target.files)}
                className="hidden"
              />

              <p className="text-2xl font-black text-orange-600">
                Upload More Images
              </p>

              <p className="mt-3 text-gray-500">
                Add more product photos if needed
              </p>
            </label>

            {uploading && (
              <p className="font-black text-orange-600">Uploading images...</p>
            )}

            {product.images.length > 0 && (
              <div>
                <p className="font-black text-orange-600 mb-4">
                  {product.images.length} image(s)
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
              disabled={loading || uploading}
              className="bg-orange-600 hover:bg-black transition text-white py-5 rounded-full font-black"
            >
              {loading
                ? "Updating Product..."
                : uploading
                ? "Uploading Images..."
                : "Update Product"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}