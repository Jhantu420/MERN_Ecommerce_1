import React, { useState, useEffect } from "react";
import moment from "moment";

export default function OrderList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/get-orderDetails", {
        credentials: "include",
      });
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        setData(result.data);
        console.log("Order details found", result.data);
      } else {
        console.log("No order details found.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div>
      <h2>Order List</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : data.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {data.map((order) => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Total Amount: {order.totalPrice}</p>
              <p>Status: {order.status}</p>
              <p>Date: {moment(order.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
