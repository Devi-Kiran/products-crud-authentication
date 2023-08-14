import React, { useEffect, useState } from "react";
import Layout from "../components/dashboard/Layout";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function ProductsStockChart() {
  const [productsInfo, setProducts] = useState({ loading: true, products: [] });
  const { loading, products } = productsInfo;
  const productsCollectionRef = collection(db, "products");
  const data = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        data: products.map((product) => product.stock),
        backgroundColor: generateDistinctColors(products.length),
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  function generateDistinctColors(numColors) {
    const colors = [];
    const goldenRatio = 0.618033988749895;
    let hue = Math.random();

    for (let i = 0; i < numColors; i++) {
      hue += goldenRatio;
      hue %= 1;
      const color = `hsl(${hue * 360}, 70%, 60%)`;
      colors.push(color);
    }

    return colors;
  }

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts({
        loading: false,
        products: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      });
    };
    getProducts();
  }, []);

  return (
    <Layout>
      <div>
        <div className="max-w-xl mx-auto">
          <h2 className="mb-3 font-bold text-2xl text-center">
            Products stock chart
          </h2>
          {<Pie data={data} />}
        </div>
      </div>
    </Layout>
  );
}

export default ProductsStockChart;
