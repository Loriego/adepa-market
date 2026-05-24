import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, Pencil } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const productList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(productList);
  };

  const deleteProduct = async (id) => {
    const confirmDelete = confirm("Delete this product?");

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center gap-5 mb-8">
          <div>
            <p className="text-orange-600 font-black">Admin</p>
            <h1 className="text-4xl font-black">Manage Products</h1>
          </div>

          <Link
            to="/admin/add-product"
            className="bg-orange-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-10">
            <p>No products yet.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-5 shadow-sm flex flex-col md:flex-row gap-5 md:items-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full md:w-32 h-40 md:h-32 rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-2xl font-black">{product.name}</h2>
                  <p className="text-orange-600 font-bold">
                    {product.category}
                  </p>
                  <p className="text-gray-500 mt-1">{product.stock}</p>
                  <p className="text-2xl font-black mt-2">
                    GH₵ {product.price}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link
                    to={`/admin/edit-product/${product.id}`}
                    className="bg-black text-white px-5 py-3 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <Pencil size={18} />
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-600 text-white px-5 py-3 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}