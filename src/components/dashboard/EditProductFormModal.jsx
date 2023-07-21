import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { AiOutlineFile } from "react-icons/ai";
import Button from "@material-ui/core/Button";

function EditProductFormModal({
  openEditProductForm,
  onCloseEditProductForm,
  editProductName,
  setEditProductName,
  editProductImage,
  setEditProductImage,
  editFileUrl,
  setEditProductFile,
  editProductPrice,
  setEditProductPrice,
  editProductStock,
  setEditProductStock,
  editProductsHandler,
}) {
  return (
    <Modal open={openEditProductForm} onClose={onCloseEditProductForm} center>
      <h2 className="text-lg font-bold capitalize text-brandColor ml-2">
        edit product
      </h2>
      <form autoComplete="off" className="px-3" onSubmit={editProductsHandler}>
        <div className="py-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="editProductName"
          >
            product name:
          </label>
          <input
            id="editProductName"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Name"
            type="text"
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
          />
        </div>
        <div className="py-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="editProductImage"
          >
            product image:
          </label>
          <input
            id="editProductImage"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Image URL"
            type="text"
            value={editProductImage}
            onChange={(e) => setEditProductImage(e.target.value)}
          />
        </div>
        <div className="py-2">
          <div className="flex justify-between p-1 items-center border-2 border-brandColor w-64 rounded">
            <div className="flex items-center">
              <span className="inline-block font-xl bg-slate-400 text-white rounded">
                <a
                  href={editFileUrl}
                  className="block w-full px-3 py-[8px]"
                  target="_blank"
                  download
                >
                  <AiOutlineFile />
                </a>
              </span>
              <span className="text-slate-600 ml-1">Attached File</span>
            </div>
            <div>
              <Button style={{ background: "#007DFC", color: "white" }}>
                <label htmlFor="editUploadFile">edit</label>
              </Button>
              <input
                type="file"
                id="editUploadFile"
                className="hidden"
                onChange={(e) => setEditProductFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="py-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="editProductPrice"
          >
            product price:
          </label>
          <input
            id="editProductPrice"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Price"
            type="number"
            value={editProductPrice}
            onChange={(e) => setEditProductPrice(Number(e.target.value))}
          />
        </div>
        <div className="py-3 mb-2">
          <label
            className="block capitalize mb-[5px]"
            htmlFor="editProductStock"
          >
            product stock:
          </label>
          <input
            id="editProductStock"
            className="border-2 border-brandColor w-64 rounded px-1.5 py-1"
            placeholder="Product Stock"
            type="number"
            value={editProductStock}
            onChange={(e) => setEditProductStock(Number(e.target.value))}
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

export default EditProductFormModal;