import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { db } from "../../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import MaterialTable, { MTableToolbar } from "material-table";
import { auth } from "../../firebase-config";
import { storage } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { ThemeProvider, createTheme } from "@mui/material";
import { forwardRef } from "react";
import "react-responsive-modal/styles.css";
import EditProductFormModal from "./EditProductFormModal";
import AddProductFormModal from "./AddProductFormModal";
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
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { InfinitySpin } from "react-loader-spinner";
import { AiOutlineFile } from "react-icons/ai";

const Table = () => {
  const headerCSS = {
    fontWeight: 900,
    textTransform: "capitalize",
    color: "black",
  };
  const tableIcons = {
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    SaveAlt: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };
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

  const [value, setValue] = React.useState([2, 10]);
  const [userEmail, setUserEmail] = useState("");
  const [productsInfo, setProducts] = useState({ loading: true, products: [] });
  const { products } = productsInfo;
  const [unChangebleProducts, setUnChangebleProducts] = useState([]);
  const productsCollectionRef = collection(db, "products");
  const defaultMaterialTheme = createTheme();

  const [addProductName, setAddProductName] = useState("");
  const [addProductImage, setAddProductImage] = useState("");
  const [addProductFile, setAddProductFile] = useState({});
  const [addProductPrice, setAddProductPrice] = useState(0);
  const [addProductStock, setAddProductStock] = useState(0);
  const [editProductId, setEditProductId] = useState("");
  const [editProductName, setEditProductName] = useState("");
  const [editProductImage, setEditProductImage] = useState("");
  const [editProductFile, setEditProductFile] = useState({});
  const [editFileUrl, setEditFileUrl] = useState("");
  const [editProductPrice, setEditProductPrice] = useState(0);
  const [editProductStock, setEditProductStock] = useState(0);

  const [openAddProductForm, setOpenAddProductForm] = useState(false);
  const [openEditProductForm, setOpenEditProductForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [productsIds, setProductIds] = useState([]);
  const [tableColumns, setTableColumns] = useState([
    {
      title: "Image",
      field: "buttons",
      headerStyle: { ...headerCSS },
      render: (rowData) => (
        <a href={rowData.image} target="_blank">
          <img src={rowData.image} className="w-10 md:w-20 rounded-md" />
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
    },
    {
      title: "file",
      field: "buttons",
      headerStyle: { ...headerCSS },
      render: (rowData) => (
        <div className="flex items-center justify-center">
          <span className="inline-block font-xl bg-brandColor text-white rounded">
            <a
              href={rowData.file}
              className="block w-full px-3 py-[8px]"
              target="_blank"
            >
              <AiOutlineFile />
            </a>
          </span>
        </div>
      ),
    },
  ]);

  const onOpenAddProductForm = () => setOpenAddProductForm(true);
  const onCloseAddProductForm = () => setOpenAddProductForm(false);
  const onOpenEditProductForm = () => setOpenEditProductForm(true);
  const onCloseEditProductForm = () => setOpenEditProductForm(false);

  const rangeSelector = (event, newValue) => {
    setValue(newValue);
    const [min, max] = newValue;

    setProducts(() => {
      const filteredProducts = unChangebleProducts?.filter((product) => {
        if (product.price >= min && product.price <= max) {
          return product;
        }
      });
      return { loading: false, products: [...filteredProducts] };
    });
  };

  const editHandler = (rowData) => {
    setEditProductId(rowData?.id);
    setEditProductName(rowData?.name);
    setEditProductImage(rowData?.image);
    setEditFileUrl(rowData?.file);
    setEditProductPrice(rowData?.price);
    setEditProductStock(rowData?.stock);
    onOpenEditProductForm(true);
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      if (file === null) return;
      const fileRef = ref(storage, `documents/${file?.name + v4()}`);
      uploadBytes(fileRef, file)
        .then((snapShot) => {
          getDownloadURL(snapShot.ref).then((url) => {
            resolve(url);
          });
        })
        .catch((e) => {
          reject(e.message);
        });
    });
  };

  const deleteProduct = async ({ id }) => {
    try {
      const productDoc = doc(db, "products", id);
      await deleteDoc(productDoc);

      setProducts((prevProductsInfo) => {
        const updatedProducts = prevProductsInfo?.products?.filter(
          (product) => {
            return product.id != id;
          }
        );

        setUnChangebleProducts([...updatedProducts]);
        return {
          loading: false,
          products: updatedProducts,
        };
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
      console.log(e.message);
    }
  };

  const addProductsHandler = async (e) => {
    e.preventDefault();
    onCloseEditProductForm();

    const fileFormat = /^.+(.doc|.docx|.DOC|.DOCX|.pdf|.PDF)$/;
    const isValidFile = fileFormat.test(addProductFile?.name);

    if (
      addProductName &&
      addProductImage &&
      addProductPrice &&
      addProductStock &&
      addProductFile
    ) {
      if (isValidFile) {
        onCloseAddProductForm();
        uploadFile(addProductFile)
          .then(async (url) => {
            try {
              const product = await addDoc(productsCollectionRef, {
                name: addProductName,
                image: addProductImage,
                file: url,
                price: addProductPrice,
                stock: addProductStock,
              });

              setProducts((prevProductsInfo) => {
                return {
                  loading: false,
                  products: [
                    ...prevProductsInfo.products,
                    {
                      id: product.id,
                      name: addProductName,
                      image: addProductImage,
                      file: url,
                      price: addProductPrice,
                      stock: addProductStock,
                    },
                  ],
                };
              });

              setUnChangebleProducts((prevProducts) => {
                return [
                  ...prevProducts,
                  {
                    id: product.id,
                    name: addProductName,
                    image: addProductImage,
                    price: addProductPrice,
                    stock: addProductStock,
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

              setAddProductName("");
              setAddProductImage("");
              setAddProductFile({});
              setAddProductPrice(0);
              setAddProductStock(0);
            } catch (e) {
              console.log(e.message);
            }
          })
          .catch((e) => {
            console.loh(e);
          });
      } else {
        onOpenAddProductForm();
        toast.info("You can upload only PDF or DOC files", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      onOpenAddProductForm();
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

  const editedProductUpdater = async (url) => {
    try {
      const productDoc = doc(db, "products", editProductId);
      const updatedProduct = {
        id: editProductId,
        name: editProductName,
        image: editProductImage,
        file: url,
        price: editProductPrice,
        stock: editProductStock,
      };
      await updateDoc(productDoc, updatedProduct);
      setProducts((prevProductsInfo) => {
        const updatedProducts = prevProductsInfo.products?.map((product) => {
          if (product.id === editProductId) {
            return { ...updatedProduct };
          }
          return product;
        });
        setUnChangebleProducts([...updatedProducts]);
        return { loading: false, products: [...updatedProducts] };
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
      setEditProductFile({});
    } catch (e) {
      console.log(e.message);
    }
  };

  const editProductsHandler = async (e) => {
    e.preventDefault();
    onCloseEditProductForm();

    const fileFormat = /^.+(.doc|.docx|.DOC|.DOCX|.pdf|.PDF)$/;
    const isValidFile = fileFormat.test(editProductFile?.name);
    if (
      editProductId &&
      editProductName &&
      editProductImage &&
      editFileUrl &&
      editProductPrice &&
      editProductStock
    ) {
      if (isValidFile) {
        uploadFile(editProductFile)
          .then((url) => {
            editedProductUpdater(url);
          })
          .catch((e) => {
            console.log(e.message);
          });
      } else {
        if (Boolean(editProductFile.name)) {
          onOpenEditProductForm();
          toast.info("You can upload only PDF or DOC files", {
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
      }
      if (Boolean(editProductFile.name)) return;

      editedProductUpdater(editFileUrl);
    } else {
      onOpenEditProductForm();
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

  const handleRowSelection = (rows) => {
    setSelectedRows(rows);
    setProductIds(() => {
      const IDs = rows.map((row) => row.id);
      return [...IDs];
    });
  };

  const handleDeleteSelectedRows = () => {
    const filteredData = products.filter(
      (row) =>
        !selectedRows.find(
          (selectedRow) => selectedRow.tableData.id === row.tableData.id
        )
    );
    setProducts({ loading: false, products: filteredData });
    setSelectedRows([]);

    productsIds.forEach((id) => {
      const productDoc = doc(db, "products", id);
      deleteDoc(productDoc)
        .then((res) => {
          toast.success("successfully deleted selected products", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
        })
        .catch((e) => {
          console.log(e.message);
        });
    });
  };

  useEffect(() => {
    if (userEmail === "admin@gmail.com") {
      setTableColumns((prevColumns) => {
        return [...prevColumns, adminColumn];
      });
    }
  }, [userEmail]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts({
        loading: false,
        products: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      });
      setUnChangebleProducts(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getProducts();
    onAuthStateChanged(auth, (currentUser) => {
      setUserEmail(currentUser?.email);
    });
  }, []);

  return (
    <div className="p-2 relative overflow-scroll sm:overflow-hidden">
      <div
        className={`absolute ${
          productsInfo.loading ? "block" : "hidden"
        } h-[420px] z-20 w-[98%] flex justify-center items-center`}
      >
        <div
          className={`bg-white h-[150px] w-full flex justify-center items-center ${
            userEmail === "admin@gmail.com" ? "mt-[250px]" : "mt-[150px]"
          }`}
        >
          <InfinitySpin width="200" color="#007dfc" />
        </div>
      </div>
      
      <div className="flex justify-start">
        <div>
          <div
            style={{
              margin: "auto",
              display: "block",
              width: "300px",
            }}
          >
            <p className="mb-2">
              Products between <span className="font-bold">₹{value[0]}</span>{" "}
              and <span className="font-bold">₹{value[1]}</span>
            </p>
            <Slider
              value={value}
              onChange={rangeSelector}
              valueLabelDisplay="auto"
              min={10}
              max={1000}
            />
          </div>
        </div>
      </div>

      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          components={{
            Toolbar: (props) => (
              <div>
                {userEmail === "admin@gmail.com" && (
                  <>
                    <Button
                      style={{ background: "#007DFC", color: "white" }}
                      onClick={onOpenAddProductForm}
                    >
                      Add{" "}
                      <span className="text-xl">
                        <IoMdAddCircleOutline />
                      </span>
                    </Button>
                    <Button
                      style={{
                        background: "#007DFC",
                        color: "#ffffff",
                        marginLeft: "10px",
                      }}
                      onClick={handleDeleteSelectedRows}
                    >
                      Delete Selected Rows
                    </Button>
                  </>
                )}
                <MTableToolbar {...props} />
              </div>
            ),
          }}
          onSelectionChange={handleRowSelection}
          options={{
            exportButton: true,
            selection: userEmail === "admin@gmail.com" ? true : false,
          }}
          icons={tableIcons}
          columns={tableColumns}
          data={products}
          title="Products List"
        />
      </ThemeProvider>

      <AddProductFormModal
        openAddProductForm={openAddProductForm}
        onCloseAddProductForm={onCloseAddProductForm}
        addProductsHandler={addProductsHandler}
        addProductName={addProductName}
        setAddProductName={setAddProductName}
        addProductImage={addProductImage}
        setAddProductImage={setAddProductImage}
        setAddProductFile={setAddProductFile}
        addProductPrice={addProductPrice}
        setAddProductPrice={setAddProductPrice}
        addProductStock={addProductStock}
        setAddProductStock={setAddProductStock}
      />

      <EditProductFormModal
        openEditProductForm={openEditProductForm}
        onCloseEditProductForm={onCloseEditProductForm}
        editProductName={editProductName}
        setEditProductName={setEditProductName}
        editProductImage={editProductImage}
        setEditProductImage={setEditProductImage}
        editFileUrl={editFileUrl}
        setEditProductFile={setEditProductFile}
        editProductPrice={editProductPrice}
        setEditProductPrice={setEditProductPrice}
        editProductStock={editProductStock}
        setEditProductStock={setEditProductStock}
        editProductsHandler={editProductsHandler}
      />
    </div>
  );
};

export default Table;