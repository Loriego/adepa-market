import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit, Trash2, PlusCircle, Package } from "lucide-react";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "products"),
      where("vendorId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteProduct = async (id) => {
    const confirmDelete = confirm("Delete this product permanently?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="bg-black text-white rounded-[2rem] p-8 mb-8 flex flex-col md:flex-row md:justify-between gap-5">
        <div>
          <p className="text-orange-500 font-black">Vendor Products</p>

          <h1 className="text-4xl md:text-5xl font-black mt-2">
            Manage My Products
          </h1>

          <p className="text-white/70 mt-3">
            Edit, update and delete your uploaded products.
          </p>
        </div>

        <Link
          to="/vendor-dashboard/add-product"
          className="bg-orange-600 text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2 h-fit"
        >
          <PlusCircle size={20} />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-10 text-center">
          <Package className="mx-auto text-orange-600 mb-4" size={60} />

          <h2 className="text-2xl font-black">No products yet</h2>

          <p className="text-gray-500 mt-2 mb-6">
            Upload your first product to start selling.
          </p>

          <Link
            to="/vendor-dashboard/add-product"
            className="bg-orange-600 text-white px-8 py-4 rounded-full font-black inline-block"
          >
            Upload Product
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[2rem] p-4 shadow-sm"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover rounded-3xl"
              />

              <div className="p-3">
                <p className="text-orange-600 font-bold text-sm mt-2">
                  {product.category}
                </p>

                <h2 className="font-black text-xl mt-1 line-clamp-2">
                  {product.name}
                </h2>

                <p className="text-2xl font-black mt-3">
                  GH₵ {product.price}
                </p>

                <p className="text-gray-500 font-bold mt-1">
                  {product.stock || "In Stock"}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Link
                    to={`/vendor-dashboard/edit-product/${product.id}`}
                    className="bg-orange-600 text-white py-3 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-black text-white py-3 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}