import { useMemo, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { ImagePlus, PackagePlus, CheckCircle2, X, Star, Zap } from "lucide-react";

const categories = [
  "Phones & Gadgets",
  "Fashion",
  "Computers",
  "Home & Living",
  "Audio",
  "Gaming",
  "Watches & Accessories",
  "Sports & Outdoors",
  "Beauty",
  "Automotive",
  "Other",
];

const emptyProduct = {
  name: "",
  brand: "",
  sku: "",
  price: "",
  oldPrice: "",
  discount: "",
  category: "",
  condition: "New",
  description: "",
  stock: "In Stock",
  stockQuantity: "",
  supplier: "",
  tags: "",
  image: "",
  images: [],
  isFlashSale: false,
  isFeatured: false,
  sponsored: false,
};

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState(emptyProduct);

  const cloudName = "dayc6qwau";
  const uploadPreset = "adepa_market";

  const calculatedDiscount = useMemo(() => {
    const price = Number(product.price);
    const oldPrice = Number(product.oldPrice);
    if (!price || !oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }, [product.price, product.oldPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImages = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;

    const remaining = 8 - product.images.length;
    const valid = selectedFiles
      .filter((file) => file.type.startsWith("image/") && file.size <= 8 * 1024 * 1024)
      .slice(0, remaining);

    if (!remaining) return toast.error("Maximum 8 product images");
    if (!valid.length) return toast.error("Choose JPG, PNG or WebP images under 8MB");

    setUploading(true);
    try {
      const uploadedImages = [];
      for (const file of valid) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: data,
        });
        if (!res.ok) throw new Error("Cloudinary upload failed");
        const uploaded = await res.json();
        if (uploaded.secure_url) uploadedImages.push(uploaded.secure_url);
      }

      setProduct((prev) => {
        const images = [...prev.images, ...uploadedImages].slice(0, 8);
        return { ...prev, image: images[0] || "", images };
      });
      toast.success(`${uploadedImages.length} image(s) uploaded`);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setProduct((prev) => {
      const images = prev.images.filter((_, index) => index !== indexToRemove);
      return { ...prev, image: images[0] || "", images };
    });
  };

  const makeCover = (index) => {
    setProduct((prev) => {
      const images = [...prev.images];
      const [selected] = images.splice(index, 1);
      images.unshift(selected);
      return { ...prev, image: images[0], images };
    });
    toast.success("Cover image updated");
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (product.images.length === 0) return toast.error("Add at least one product image");
    if (product.name.trim().length < 3) return toast.error("Add a clear product name");
    if (Number(product.price) <= 0) return toast.error("Enter a valid selling price");

    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...product,
        name: product.name.trim(),
        brand: product.brand.trim(),
        sku: product.sku.trim(),
        description: product.description.trim(),
        supplier: product.supplier.trim(),
        tags: product.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        price: Number(product.price),
        oldPrice: Number(product.oldPrice || 0),
        discount: Number(product.discount || calculatedDiscount || 0),
        stockQuantity: Number(product.stockQuantity || 0),
        uploadedBy: "admin",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Product published to Adepa Market");
      setProduct(emptyProduct);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-200 bg-white px-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition";
  const labelClass = "block text-xs font-extrabold text-slate-700 mb-2";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-7">
          <p className="text-[10px] tracking-[0.14em] text-orange-600 font-extrabold">CATALOG MANAGEMENT</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Add a new product</h1>
          <p className="text-sm text-slate-500 mt-2">Use consistent titles, pricing and high-quality images so every listing feels premium.</p>
        </div>

        <form onSubmit={addProduct} className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-5">
            <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
              <h2 className="font-black mb-5">Product information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className={labelClass}>Product name *</label><input name="name" value={product.name} onChange={handleChange} placeholder="e.g. JBL Clip 5 Portable Bluetooth Speaker" className={inputClass} required /></div>
                <div><label className={labelClass}>Brand</label><input name="brand" value={product.brand} onChange={handleChange} placeholder="e.g. JBL" className={inputClass} /></div>
                <div><label className={labelClass}>SKU / product code</label><input name="sku" value={product.sku} onChange={handleChange} placeholder="e.g. JBL-CLIP5-BLK" className={inputClass} /></div>
                <div><label className={labelClass}>Category *</label><select name="category" value={product.category} onChange={handleChange} className={inputClass} required><option value="">Choose category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
                <div><label className={labelClass}>Condition</label><select name="condition" value={product.condition} onChange={handleChange} className={inputClass}><option>New</option><option>Used - Like New</option><option>Used - Good</option><option>Refurbished</option></select></div>
                <div className="md:col-span-2"><label className={labelClass}>Description *</label><textarea name="description" value={product.description} onChange={handleChange} placeholder="Describe the product, key features, what is included and important specifications." className={`${inputClass} min-h-36 resize-y`} required /></div>
                <div className="md:col-span-2"><label className={labelClass}>Search tags</label><input name="tags" value={product.tags} onChange={handleChange} placeholder="speaker, bluetooth, portable, audio" className={inputClass} /><p className="text-[11px] text-slate-400 mt-1.5">Separate tags with commas.</p></div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
              <h2 className="font-black mb-5">Pricing & inventory</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className={labelClass}>Selling price (GH₵) *</label><input type="number" min="0" step="0.01" name="price" value={product.price} onChange={handleChange} placeholder="0.00" className={inputClass} required /></div>
                <div><label className={labelClass}>Was price (GH₵)</label><input type="number" min="0" step="0.01" name="oldPrice" value={product.oldPrice} onChange={handleChange} placeholder="Optional" className={inputClass} /></div>
                <div><label className={labelClass}>Discount %</label><input type="number" min="0" max="100" name="discount" value={product.discount} onChange={handleChange} placeholder={calculatedDiscount ? `Auto: ${calculatedDiscount}%` : "Optional"} className={inputClass} /></div>
                <div><label className={labelClass}>Availability</label><select name="stock" value={product.stock} onChange={handleChange} className={inputClass}><option>In Stock</option><option>Pre Order</option><option>Out of Stock</option></select></div>
                <div><label className={labelClass}>Quantity</label><input type="number" min="0" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} placeholder="e.g. 20" className={inputClass} /></div>
                <div><label className={labelClass}>Supplier / location</label><input name="supplier" value={product.supplier} onChange={handleChange} placeholder="Optional" className={inputClass} /></div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4"><div><h2 className="font-black">Product images</h2><p className="text-xs text-slate-500 mt-1">Up to 8 images. The first image is the storefront cover.</p></div><span className="text-xs font-bold text-slate-400">{product.images.length}/8</span></div>

              <label className="block border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-8 text-center bg-slate-50 hover:bg-orange-50/40 cursor-pointer transition">
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => uploadImages(e.target.files)} className="hidden" />
                <ImagePlus className="mx-auto text-orange-600" size={28} />
                <p className="text-sm font-black mt-3">{uploading ? "Uploading images..." : "Choose product images"}</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG or WebP · maximum 8MB each</p>
              </label>

              {!!product.images.length && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {product.images.map((img, index) => (
                    <div key={img} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute left-2 top-2 bg-black/75 text-white text-[9px] px-2 py-1 rounded-full font-bold">{index === 0 ? "COVER" : index + 1}</span>
                      <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                        {index !== 0 && <button type="button" onClick={() => makeCover(index)} className="flex-1 bg-white text-[10px] font-black py-1.5 rounded-lg">Make cover</button>}
                        <button type="button" onClick={() => removeImage(index)} aria-label="Remove image" className="w-8 bg-red-600 text-white rounded-lg flex items-center justify-center"><X size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-black">Storefront placement</h2>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-sm font-bold"><input type="checkbox" checked={product.isFeatured} onChange={(e) => setProduct((prev) => ({ ...prev, isFeatured: e.target.checked }))} /><Star size={16} className="text-orange-600" /> Featured product</label>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-sm font-bold"><input type="checkbox" checked={product.isFlashSale} onChange={(e) => setProduct((prev) => ({ ...prev, isFlashSale: e.target.checked }))} /><Zap size={16} className="text-red-500" /> Flash sale</label>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-sm font-bold"><input type="checkbox" checked={product.sponsored} onChange={(e) => setProduct((prev) => ({ ...prev, sponsored: e.target.checked }))} /><PackagePlus size={16} className="text-amber-500" /> Sponsored placement</label>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-black">Listing quality</h2>
              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <p className="flex gap-2"><CheckCircle2 size={15} className={product.name.length >= 3 ? "text-emerald-500" : "text-slate-300"} /> Clear product title</p>
                <p className="flex gap-2"><CheckCircle2 size={15} className={product.category ? "text-emerald-500" : "text-slate-300"} /> Correct category</p>
                <p className="flex gap-2"><CheckCircle2 size={15} className={product.description.length >= 40 ? "text-emerald-500" : "text-slate-300"} /> Useful description</p>
                <p className="flex gap-2"><CheckCircle2 size={15} className={product.images.length >= 2 ? "text-emerald-500" : "text-slate-300"} /> Multiple product images</p>
                <p className="flex gap-2"><CheckCircle2 size={15} className={Number(product.price) > 0 ? "text-emerald-500" : "text-slate-300"} /> Valid selling price</p>
              </div>
            </section>

            <button type="submit" disabled={loading || uploading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-black text-sm transition flex items-center justify-center gap-2">
              <PackagePlus size={17} /> {loading ? "Publishing..." : uploading ? "Uploading images..." : "Publish product"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}
