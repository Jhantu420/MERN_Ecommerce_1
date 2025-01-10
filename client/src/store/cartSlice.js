import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalProducts: 0 },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.totalProducts = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalProducts = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.totalProducts = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
  },
});

export const { setCart, addItem, removeItem } = cartSlice.actions;

export const fetchCart = () => async (dispatch) => {
  try {
    // Step 1: Fetch cart items from server
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL +
        "/api/getCartProductRelatedUserController",
      { withCredentials: true }
    );

    if (response.data.success) {
      // Step 2: Fetch product details for each product ID
      const productDetailsPromises = response.data.data.map(async (item) => {
        const productResponse = await axios.get(
          process.env.REACT_APP_BACKEND_URL +
            `/api/get-products/${item.productId}`
        );
        return {
          ...item,
          productDetails: productResponse.data.data,
        };
      });

      const completeCartItems = await Promise.all(productDetailsPromises);

      // Step 3: Calculate total products
      const totalProducts = completeCartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      // console.log("Total Products after fetchCart:", totalProducts);

      // Step 4: Dispatch action to set cart items and total products in Redux state
      dispatch(setCart(completeCartItems));
    }
  } catch (error) {
    console.error("Failed to fetch cart items", error);
  }
};

export const deleteCartItem = (productId) => async (dispatch) => {
  try {
    const response = await axios.delete(
      process.env.REACT_APP_BACKEND_URL +
        `/api/deleteCartProductController/${productId}`,
      { withCredentials: true }
    );

    if (response.data.success) {
      dispatch(removeItem(productId));
      // Optional: Log or show a message to confirm the count update
      console.log("Item removed and total count updated in Redux.");
    }
  } catch (error) {
    console.error("Failed to delete cart item", error);
  }
};

export default cartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: { items: [], totalProducts: 0 },
//   reducers: {
//     setCart: (state, action) => {
//       state.items = action.payload;
//     },
//     addItem: (state, action) => {
//       const existingItem = state.items.find(
//         (item) => item._id === action.payload._id
//       );
//       if (existingItem) {
//         existingItem.quantity += action.payload.quantity;
//       } else {
//         state.items.push(action.payload);
//       }
//     },
//     updateTotalProducts: (state, action) => {
//       state.totalProducts = action.payload; // Update the total product count
//     },
//   },
// });

// export const { setCart, addItem, updateTotalProducts } = cartSlice.actions;

// export const fetchCart = () => async (dispatch) => {
//   try {
//     const response = await axios.get(
//       "http://localhost:4000/api/getCartProductRelatedUserController",
//       { withCredentials: true }
//     );

//     if (response.data.success) {
//       const productDetailsPromises = response.data.data.map(async (item) => {
//         const productResponse = await axios.get(
//           `http://localhost:4000/api/get-products/${item.productId}`
//         );
//         return { ...item, productDetails: productResponse.data.data };
//       });

//       const completeCartItems = await Promise.all(productDetailsPromises);

//       // Calculate total products
//       const totalProducts = completeCartItems.reduce(
//         (acc, item) => acc + item.quantity,
//         0
//       );

//       // Dispatch actions
//       dispatch(setCart(completeCartItems));
//       dispatch(updateTotalProducts(totalProducts)); // Update totalProducts in Redux
//     }
//   } catch (error) {
//     console.error("Failed to fetch cart items", error);
//   }
// };

// export default cartSlice.reducer;
