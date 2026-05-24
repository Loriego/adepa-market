import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Bot, Send, Sparkles, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebaseConfig";

export default function AiShoppingAssistant() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [reply, setReply] = useState(
    "Hi, I’m Adepa AI. Ask me for products like: sneakers under GH₵500, phones, gadgets, flash sales."
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const productList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(productList);
  };

  const extractMaxPrice = (text) => {
    const match = text.match(/(?:under|below|less than|within|budget)\s*(gh₵|ghc|₵)?\s*(\d+)/i);
    return match ? Number(match[2]) : null;
  };

  const searchProducts = (e) => {
    e.preventDefault();

    const text = question.toLowerCase().trim();

    if (!text) return;

    const maxPrice = extractMaxPrice(text);

    const keywords = text
      .replace(/under|below|less than|within|budget|gh₵|ghc|₵|\d+/gi, "")
      .split(" ")
      .map((word) => word.trim())
      .filter(Boolean);

    let matched = products.filter((product) => {
      const searchable = `
        ${product.name || ""}
        ${product.category || ""}
        ${product.description || ""}
        ${product.supplier || ""}
      `.toLowerCase();

      const keywordMatch =
        keywords.length === 0 ||
        keywords.some((word) => searchable.includes(word));

      const priceMatch = maxPrice
        ? Number(product.price || 0) <= maxPrice
        : true;

      return keywordMatch && priceMatch;
    });

    if (text.includes("flash") || text.includes("deal") || text.includes("discount")) {
      matched = products.filter(
        (product) => product.isFlashSale || Number(product.discount) > 0
      );
    }

    if (text.includes("featured") || text.includes("best")) {
      matched = products.filter((product) => product.isFeatured);
    }

    matched = matched.slice(0, 6);

    setResults(matched);

    if (matched.length > 0) {
      setReply(`I found ${matched.length} product(s) that match what you want.`);
    } else {
      setReply("I couldn’t find an exact match yet. Try another word like phone, gadget, sneaker, fashion, or flash sale.");
    }

    setQuestion("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[80] bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-700 active:scale-95 transition"
      >
        <Bot size={30} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-[90] w-[92vw] max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border"
          >
            <div className="bg-black text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 w-11 h-11 rounded-2xl flex items-center justify-center">
                  <Sparkles />
                </div>

                <div>
                  <h2 className="font-black text-xl">Adepa AI</h2>
                  <p className="text-white/60 text-sm">Shopping Assistant</p>
                </div>
              </div>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="p-5 max-h-[65vh] overflow-y-auto bg-slate-50">
              <div className="bg-white rounded-3xl p-4 mb-4">
                <p className="text-gray-600">{reply}</p>
              </div>

              {results.length > 0 && (
                <div className="grid gap-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setOpen(false)}
                      className="bg-white rounded-3xl p-3 flex gap-3 hover:shadow-lg transition"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-2xl"
                      />

                      <div className="flex-1">
                        <p className="font-black">{product.name}</p>
                        <p className="text-orange-600 font-black">
                          GH₵ {product.price}
                        </p>

                        <p className="text-gray-400 text-sm">
                          {product.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.length === 0 && (
                <div className="bg-white rounded-3xl p-5 text-center">
                  <ShoppingBag className="mx-auto text-orange-600 mb-2" />
                  <p className="text-gray-500 text-sm">
                    Try: “phones under 2000”, “flash deals”, “gadgets”
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={searchProducts} className="p-4 bg-white flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask for products..."
                className="flex-1 border p-4 rounded-2xl outline-none"
              />

              <button className="bg-orange-600 text-white px-5 rounded-2xl">
                <Send />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}