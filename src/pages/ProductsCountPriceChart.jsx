import React, { useEffect, useState } from "react";
import Layout from "../components/dashboard/Layout";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function ProductsCountPriceChart() {
  const productsCollectionRef = collection(db, "products");
  const [productsPrice, setProductsPrice] = useState([]);
  const [productsCount, setProductsCount] = useState({
    "0to100": 0,
    "101to200": 0,
    "201to300": 0,
    "301to400": 0,
    "401to500": 0,
    "501to600": 0,
    "601to700": 0,
    "701to800": 0,
    "801to900": 0,
    "901to1000": 0,
  });

  const data = {
    labels: [
      "0 - 100",
      "101 - 200",
      "201 - 300",
      "301 - 400",
      "401 - 500",
      "501 - 600",
      "601 - 700",
      "701 - 800",
      "801 - 900",
      "901 - 1000",
    ],
    datasets: [
      {
        label: "products count by price",
        data: [
          productsCount["0to100"],
          productsCount["101to200"],
          productsCount["201to300"],
          productsCount["301to400"],
          productsCount["401to500"],
          productsCount["501to600"],
          productsCount["601to700"],
          productsCount["701to800"],
          productsCount["801to900"],
          productsCount["901to1000"],
        ],
        borderWidth: 1,
        backgroundColor: [
            'rgba(0, 125, 252, 0.8)'
          ],
      },
    ],
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProductsPrice(
        data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .map((product) => product.price)
      );
    };
    getProducts();
  }, []);

  useEffect(() => {
    productsPrice?.forEach((price) => {
      if (price >= 0 && price <= 100) {
        setProductsCount((prev) => {
          return { ...prev, "0to100": prev["0to100"] + 1 };
        });
      } else if (price >= 101 && price <= 200) {
        setProductsCount((prev) => {
          return { ...prev, "101to200": prev["101to200"] + 1 };
        });
      } else if (price >= 201 && price <= 300) {
        setProductsCount((prev) => {
          return { ...prev, "201to300": prev["201to300"] + 1 };
        });
      } else if (price >= 301 && price <= 400) {
        setProductsCount((prev) => {
          return { ...prev, "301to400": prev["301to400"] + 1 };
        });
      } else if (price >= 401 && price <= 500) {
        setProductsCount((prev) => {
          return { ...prev, "401to500": prev["401to500"] + 1 };
        });
      } else if (price >= 501 && price <= 600) {
        setProductsCount((prev) => {
          return { ...prev, "501to600": prev["501to600"] + 1 };
        });
      } else if (price >= 601 && price <= 700) {
        setProductsCount((prev) => {
          return { ...prev, "601to700": prev["601to700"] + 1 };
        });
      } else if (price >= 701 && price <= 800) {
        setProductsCount((prev) => {
          return { ...prev, "701to800": prev["701to800"] + 1 };
        });
      } else if (price >= 801 && price <= 900) {
        setProductsCount((prev) => {
          return { ...prev, "801to900": prev["801to900"] + 1 };
        });
      } else if (price >= 901 && price <= 1000) {
        setProductsCount((prev) => {
          return { ...prev, "901to1000": prev["901to1000"] + 1 };
        });
      }
    });
  }, [productsPrice]);

  return (
    <Layout>
      <div>
        <h2 className="mb-3 font-bold text-2xl text-center">
          Products count price chart
        </h2>
        {<Bar data={data} />}
      </div>
    </Layout>
  );
}

export default ProductsCountPriceChart;
