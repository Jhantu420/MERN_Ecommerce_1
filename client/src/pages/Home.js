import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VarticalCardProduct";

function Home() {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      <HorizontalCardProduct category={"earphones"} heading={"Top's Airpods"} />
      <HorizontalCardProduct category={"mobiles"} heading={"Top's Mobile"} />
      <VerticalCardProduct category={"Clothing"} heading={"Top's Clothing"} />
      <VerticalCardProduct category={"cameras"} heading={"Top's Camera's"} />
      <VerticalCardProduct
        category={"processors"}
        heading={"Top's Processor's"}
      />
      <VerticalCardProduct category={"speakers"} heading={"Top's Speaker's"} />
    </div>
  );
}

export default Home;
