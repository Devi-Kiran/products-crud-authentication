import React, { useEffect, useState } from "react";
import Layout from "../components/dashboard/Layout";
import { db } from "../../src/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

function StockChart() {
  const [productsInfo, setProducts] = useState({ loading: true, products: [] });
  const {loading,products} = productsInfo;
  const productsCollectionRef = collection(db, "products");

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

 const data = {
    labels: products.map(product => product.name),
    datasets: [{
        data: products.map(product => product.stock),
        backgroundColor: generateDistinctColors(products.length),
        borderColor: 'white',
        borderWidth: 1,
    }],
};

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
        {<Pie data={data} />}
    </Layout>
  );
}

export default StockChart;