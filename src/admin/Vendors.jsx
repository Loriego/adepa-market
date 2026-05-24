import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
  Store,
  CheckCircle,
  XCircle,
  Trash2,
  Phone,
  MapPin,
  Mail,
  User,
} from "lucide-react";

import { db } from "../firebase/firebaseConfig";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "vendors"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vendorList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVendors(vendorList);
    });

    return () => unsubscribe();
  }, []);

  const updateVendorStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "vendors", id), {
        status,
      });

      toast.success(`Vendor ${status}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update vendor");
    }
  };

  const deleteVendor = async (id) => {
    const confirmDelete = confirm("Delete this vendor application?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "vendors", id));
      toast.success("Vendor deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete vendor");
    }
  };

  const filteredVendors =
    filter === "All"
      ? vendors
      : vendors.filter((vendor) => vendor.status === filter);

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-orange-600 font-black">Adepa Market Admin</p>

          <h1 className="text-4xl md:text-5xl font-black">
            Vendor Approval Center
          </h1>

          <p className="text-gray-500 mt-3">
            Approve, reject and manage seller applications.
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">All Vendors</p>
            <h2 className="text-4xl font-black">{vendors.length}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">Pending</p>
            <h2 className="text-4xl font-black">
              {vendors.filter((v) => v.status === "Pending").length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">Approved</p>
            <h2 className="text-4xl font-black">
              {vendors.filter((v) => v.status === "Approved").length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">Rejected</p>
            <h2 className="text-4xl font-black">
              {vendors.filter((v) => v.status === "Rejected").length}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm mb-8 flex gap-3 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-3 rounded-full font-black ${
                filter === item
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 text-center">
            <Store className="mx-auto text-orange-600 mb-4" size={60} />
            <h2 className="text-2xl font-black">No vendors found</h2>
            <p className="text-gray-500 mt-2">
              Vendor applications will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-[2rem] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                        <Store size={28} />
                      </div>

                      <div>
                        <h2 className="text-2xl font-black">
                          {vendor.shopName}
                        </h2>

                        <span
                          className={`inline-block mt-2 px-4 py-2 rounded-full font-black text-sm ${getStatusStyle(
                            vendor.status
                          )}`}
                        >
                          {vendor.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-gray-600">
                      <p className="flex items-center gap-2">
                        <User size={18} />
                        {vendor.ownerName}
                      </p>

                      <p className="flex items-center gap-2">
                        <Mail size={18} />
                        {vendor.email}
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={18} />
                        {vendor.phone}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={18} />
                        {vendor.location}
                      </p>
                    </div>

                    <div className="mt-4 bg-slate-50 rounded-2xl p-4">
                      <p className="font-black">Main Category</p>
                      <p className="text-gray-600">{vendor.category}</p>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 flex-wrap">
                    <button
                      onClick={() => updateVendorStatus(vendor.id, "Approved")}
                      className="bg-green-600 text-white px-5 py-3 rounded-full font-black flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>

                    <button
                      onClick={() => updateVendorStatus(vendor.id, "Rejected")}
                      className="bg-red-600 text-white px-5 py-3 rounded-full font-black flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>

                    <button
                      onClick={() => updateVendorStatus(vendor.id, "Pending")}
                      className="bg-yellow-500 text-white px-5 py-3 rounded-full font-black"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() => deleteVendor(vendor.id)}
                      className="bg-black text-white px-5 py-3 rounded-full font-black flex items-center justify-center gap-2"
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
    </main>
  );
}