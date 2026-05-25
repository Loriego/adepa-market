import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorAddProduct() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [vendor, setVendor] = useState(null);

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
    if (user) fetchVendor();
  }, [user]);

  const fetchVendor = async () => {
    const q = query(
      collection(db, "vendors"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setVendor({
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      });
    }
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

  const addProduct = async (e) => {
    e.preventDefault();

    if (!vendor) {
      toast.error("Vendor account not found");
      return;
    }

    if (vendor.status !== "Approved") {
      toast.error("Your vendor account is not approved yet");
      return;
    }

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

        vendorId: user.uid,
        vendorDocId: vendor.id,
        vendorShopName: vendor.shopName,
        vendorEmail: vendor.email,
        vendorPhone: vendor.phone,
        vendorLocation: vendor.location,
        uploadedBy: "vendor",

        createdAt: serverTimestamp(),
      });

      toast.success("Vendor product uploaded successfully");

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
      toast.error("Failed to upload product");
    }

    setLoading(false);
  };

  if (!vendor) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="bg-white rounded-[2rem] p-10 text-center shadow">
          <h1 className="text-3xl font-black mb-4">
            Vendor Application Required
          </h1>

          <p className="text-gray-500">
            Apply as a vendor before uploading products.
          </p>
        </div>
      </div>
    );
  }

  if (vendor.status !== "Approved") {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="bg-yellow-50 rounded-[2rem] p-10 text-center shadow">
          <h1 className="text-3xl font-black mb-4">
            Vendor Account Not Approved
          </h1>

          <p className="text-gray-600">
            Your current status is <strong>{vendor.status}</strong>.
            Admin must approve your account before you can upload
            products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <form
        onSubmit={addProduct}
        className="bg-white rounded-[2rem] p-8 shadow-xl"
      >
        <p className="text-orange-600 font-black">
          Vendor Product Upload
        </p>

        <h1 className="text-4xl md:text-5xl font-black mt-2 mb-3">
          Add Product
        </h1>

        <p className="text-gray-500 mb-8">
          Shop: <strong>{vendor.shopName}</strong>
        </p>

        <div className="grid gap-6">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="border p-5 rounded-2xl outline-none focus:border-orange-500"
            required
          />

          <div className="grid md:grid-cols-3 gap-5">
            <input
              type="number"
              name="price"
              placeholder="Current Price"
              value={product.price}
              onChange={handleChange}
              className="border p-5 rounded-2xl outline-none focus:border-orange-500"
              required
            />

            <input
              type="number"
              name="oldPrice"
              placeholder="Old Price"
              value={product.oldPrice}
              onChange={handleChange}
              className="border p-5 rounded-2xl outline-none focus:border-orange-500"
            />

            <input
              type="number"
              name="discount"
              placeholder="Discount %"
              value={product.discount}
              onChange={handleChange}
              className="border p-5 rounded-2xl outline-none focus:border-orange-500"
            />
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            className="border p-5 rounded-2xl outline-none focus:border-orange-500"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            className="border p-5 rounded-2xl h-40 outline-none focus:border-orange-500"
            required
          ></textarea>

          <div className="grid md:grid-cols-2 gap-5">
            <select
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="border p-5 rounded-2xl outline-none focus:border-orange-500"
            >
              <option>In Stock</option>
              <option>Pre Order</option>
              <option>Out of Stock</option>
            </select>

            <input
              type="text"
              name="supplier"
              placeholder="Supplier / Source"
              value={product.supplier}
              onChange={handleChange}
              className="border p-5 rounded-2xl outline-none focus:border-orange-500"
            />
          </div>

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

          <label className="block border-2 border-dashed border-orange-300 rounded-[2rem] p-10 text-center bg-orange-50 cursor-pointer hover:bg-orange-100 transition">
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
              Select multiple product images
            </p>
          </label>

          {uploading && (
            <p className="font-black text-orange-600">
              Uploading images...
            </p>
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
            className="bg-orange-600 hover:bg-black transition text-white py-5 rounded-full font-black text-lg"
          >
            {loading
              ? "Uploading Product..."
              : uploading
              ? "Uploading Images..."
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}