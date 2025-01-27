import { createSlice } from "@reduxjs/toolkit";

const productUploadSlice = createSlice({
  name: "productUpload",
  initialState: {
    name: "",
    description: "",
    price: "",
    image: "",
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
  },
});

export const { setName, setDescription, setPrice, setImage } =
  productUploadSlice.actions;

export const selectName = (state) => state.productUpload.name;
export const selectDescription = (state) => state.productUpload.description;
export const selectPrice = (state) => state.productUpload.price;
export const selectImage = (state) => state.productUpload.image;

export default productUploadSlice.reducer;
