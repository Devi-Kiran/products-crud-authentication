import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import MaterialTable, { MTableToolbar } from "material-table";
import {auth} from "../firebase-config";
import { OnStateChanged } from "@material-ui/icons";
import { ThemeProvider, createTheme } from "@mui/material";
import { forwardRef } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { IoMdAddCircleOutline } from "react-icons/io";
import { onAuthStateChanged } from "firebase/auth";
import {BiEdit} from "react-icons/bi";
import {AiOutlineDelete} from "react-icons/ai";

const Table = () => {
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (<ChevronRight {...props} ref={ref} />)),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    SaveAlt: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (<ChevronLeft {...props} ref={ref} />)),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (<ArrowDownward {...props} ref={ref} />)),
    ThirdStateCheck: forwardRef((props, ref) => (<Remove {...props} ref={ref} />)),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const headerCSS = {
    fontWeight: 900,
    textTransform: "capitalize",
    color: "black",
  };

  const [isAddForm, setIsAddForm] = useState(true);
  const [userEmail,setUserEmail] = useState('');
  const [products, setProducts] = useState([]);
  const productsCollectionRef = collection(db, "products");

  const [tableColumns,setTableColumns] = useState([
    {
      title: "Image",
      field: "image",
      headerStyle: { ...headerCSS },
      render: (rowData) => (
        <a href={rowData.image} target="_blank">
          <img
            src={rowData.image}
            className="w-10 md:w-20 rounded-md"
          />
        </a>
      ),
    },
    {
      title: "Product Name",
      field: "name",
      headerStyle: { ...headerCSS },
    },
    {
      title: "Price",
      field: "price",
      type: "numeric",
      headerStyle: { ...headerCSS },
    },
    {
      title: "Stock",
      field: "stock",
      type: "numeric",
      headerStyle: { ...headerCSS },
    }
  ]);

  const adminColumn = {
    title: "edit",
    field: "buttons",
    headerStyle: { ...headerCSS },
    render: (rowData) => (
      <div className="flex flex-col md:flex-row gap-1 lg:gap-0 justify-evenly">
        <Button
          style={{ background: "#007DFC", color: "white" }}
          onClick={() => editHandler(rowData)}
        >
          <span className="text-xl">
            <BiEdit />
          </span>
        </Button>{" "}
        <Button
          style={{ background: "#007DFC", color: "white" }}
          onClick={() => deleteProduct(rowData)}
        >
          <span className="text-xl">
            <AiOutlineDelete />
          </span>
        </Button>
      </div>
    ),
  };

  useEffect(() => {
    if(userEmail === "admin@gmail.com") {
      setTableColumns(prevColumns => {
        return [...prevColumns,adminColumn]
      });
    }
  },[userEmail]);

  ////////////////////////for inputs//////////////////////////
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0);

  ////////////////////modal show and hidden/////////////////////////
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProducts();

    onAuthStateChanged(auth,(currentUser) => {
      setUserEmail(currentUser?.email);
    }) 
  }, []);

  ////////////////show table row data in inputs////////////////////
  const editHandler = (rowData) => {
    setIsAddForm(false);
    setProductId(rowData.id);
    setProductName(rowData.name);
    setProductImage(rowData.image);
    setProductPrice(rowData.price);
    setProductStock(rowData.stock);
    onOpenModal(true);
  };
  
  /////////////////create product in firebase/////////////////////
  const createProduct = async () => {
    try {
      await addDoc(productsCollectionRef, {
        name: productName,
        image: productImage,
        price: productPrice,
        stock: productStock,
      });
      setProducts((prevProducts) => {
        return [
          ...prevProducts,
          {
            name: productName,
            image: productImage,
            price: productPrice,
            stock: productStock,
          },
        ];
      });
      toast.success("Successfully Added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  /////////////////update product in firebase/////////////////////
  const updateProduct = async (id, name, image, price, stock) => {
    try {
      const productDoc = doc(db, "products", id);
      const updatedProduct = { name, image, price, stock };
      await updateDoc(productDoc, updatedProduct);

      setProducts((prevProducts) => {
        const updatedProducts = prevProducts?.map((product) => {
          if (product.id === id) {
            return { ...updatedProduct, id };
          }
          return product;
        });

        toast.success("Successfully Updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: false,
          theme: "dark",
        });
        return updatedProducts;
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  //////////////////delete product in firebase//////////////////////
  const deleteProduct = async ({ id }) => {
    try {
      const productDoc = doc(db, "products", id);
      await deleteDoc(productDoc);
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts?.filter(
          (product) => product.id != id
        );
        return updatedProducts;
      });
      toast.success("Successfully Deleted", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
      });
    } catch (e) {
      console.message(e);
    }
  };

  /////////////////////to create product and edit product///////////////////////
  const submitHandler = (e) => {
    e.preventDefault();
    onCloseModal();

    if (productName && productImage && productPrice && productStock) {
      if (isAddForm === false) {
        updateProduct(
          productId,
          productName,
          productImage,
          productPrice,
          productStock
        );
      }
      if (isAddForm) {
        createProduct();
      }
    } else {
      onOpenModal();
      toast.info("Please Enter Required Data", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
      });
    }
  };

  //////////////////////////////////////////
  const addProductHandler = () => {
    setProductName("");
    setProductImage("");
    setProductPrice();
    setProductStock();
    setIsAddForm(true);
    onOpenModal();
  };

  const defaultMaterialTheme = createTheme();

  return (
    <div className="p-2">
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div>
                <Button
                  style={{ background: "#007DFC", color: "white" }}
                  onClick={addProductHandler}
                >
                  Add{" "}
                  <span className="text-xl">
                    <IoMdAddCircleOutline />
                  </span>
                </Button>
                <MTableToolbar {...props} />
              </div>
            ),
          }}
          icons={tableIcons}
          columns={tableColumns}
          data={products}
          title="Products List"
        />
      </ThemeProvider>

      <Modal open={open} onClose={onCloseModal} center>
        <h2 className="text-lg font-bold capitalize text-brandColor ml-2">
          {isAddForm ? "add product" : "edit Product"}
        </h2>
        <form autoComplete="off" className="px-3" onSubmit={submitHandler}>
          <div className="py-2">
            <label className="block capitalize mb-[5px]" htmlFor="productName">
              product name:
            </label>
            <input
              id="productName"
              className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
              placeholder="Porduct Name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="py-2">
            <label className="block capitalize mb-[5px]" htmlFor="productImage">
              product image:
            </label>
            <input
              id="productImage"
              className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
              placeholder="Porduct Image URL"
              type="url"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>
          <div className="py-2">
            <label className="block capitalize mb-[5px]" htmlFor="productPrice">
              product price:
            </label>
            <input
              id="productPrice"
              className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
              placeholder="Product Price"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="py-3 mb-2">
            <label className="block capitalize mb-[5px]" htmlFor="productStock">
              product stock:
            </label>
            <input
              id="productStock"
              className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
              placeholder="Porduct Stock"
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            onClick={submitHandler}
            className="w-full"
            style={{ background: "#007DFC", color: "white" }}
          >
            save
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Table;