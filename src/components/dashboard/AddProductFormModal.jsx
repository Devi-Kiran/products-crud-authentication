import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Button from "@material-ui/core/Button";

function AddProductFormModal({
  openAddProductForm,
  onCloseAddProductForm,
  addProductsHandler,
  addProductName,
  setAddProductName,
  addProductImage,
  setAddProductImage,
  setAddProductFile,
  addProductPrice,
  setAddProductPrice,
  addProductStock,
  setAddProductStock,
}) {
  return (
    <Modal open={openAddProductForm} onClose={onCloseAddProductForm} center>
      <h2 className="text-lg font-bold capitalize text-brandColor ml-2">
        add product
      </h2>
      <form autoComplete="off" className="px-3" onSubmit={addProductsHandler}>
        <div className="py-2">
          <label className="block capitalize mb-[5px]" htmlFor="addProductName">
            product name:
          </label>
          <input
            id="addProductName"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Name"
            type="text"
            value={addProductName}
            onChange={(e) => setAddProductName(e.target.value)}
          />
        </div>
        <div className="py-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="addProductImage"
          >
            product image:
          </label>
          <input
            id="addProductImage"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Image URL"
            type="url"
            value={addProductImage}
            onChange={(e) => setAddProductImage(e.target.value)}
          />
        </div>
        <div className="py-2">
          <label className="block capitalize mb-[5px]" htmlFor="addUploadFile">
            upload file:
          </label>
          <input
            id="addUploadFile"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Upload File"
            type="file"
            onChange={(e) => setAddProductFile(e.target.files[0])}
          />
        </div>
        <div className="py-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="addProductPrice"
          >
            product price:
          </label>
          <input
            id="addProductPrice"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Price"
            type="number"
            value={addProductPrice}
            onChange={(e) => setAddProductPrice(Number(e.target.value))}
          />
        </div>
        <div className="py-3 mb-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="addProductStock"
          >
            product stock:
          </label>
          <input
            id="addProductStock"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Stock"
            type="number"
            value={addProductStock}
            onChange={(e) => setAddProductStock(Number(e.target.value))}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          style={{ background: "#007DFC", color: "white" }}
        >
          save
        </Button>
      </form>
    </Modal>
  );
}

export default AddProductFormModal;
