import { toast } from "react-toastify";

export default function AddToCart(e, id) {
  // Prevent default and stop event propagation
  e.stopPropagation();
  e.preventDefault();
//   console.log("Adding product with ID:", id);

  // Make a POST request to add the product to the cart
  fetch("http://localhost:4000/api/addtocart", {
    method: "POST",
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json", // Inform the server that the body is JSON
    },
    body: JSON.stringify({ productId: id }), // Pass the product ID in the request body
  })
    .then(async (res) => {
      const result = await res.json(); // Parse the response JSON

      if (res.ok) {
        // If the response is successful
        toast.success(result.message || "Product added to cart successfully!");
        // console.log("Cart product added:", result);
      } else {
        // If the response indicates an error
        if (res.status === 401) {
          toast.error("Please login to add products to your cart.");
        } else {
          toast.error(result.message || "Failed to add product to cart.");
        }
      }
    })
    .catch((error) => {
      // Handle network or unexpected errors
      console.error("Error adding product to cart:", error);
      toast.error("Something went wrong. Please try again.");
    });
}
