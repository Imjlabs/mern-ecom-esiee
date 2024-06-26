import React, { Fragment } from "react";
import Layout from "../layout";
import { CheckoutComponent } from "./CheckoutProducts";

const CheckoutPage = () => {
  return (
    <Fragment>
      <Layout children={<CheckoutComponent />} />
    </Fragment>
  );
};

export default CheckoutPage;
