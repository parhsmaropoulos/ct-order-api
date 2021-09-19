import axios from "axios";
import React, { useEffect, useState } from "react";
import { authHeaders } from "../../../utils/axiosHeaders";
import { current_url } from "../../../utils/util";

const EveryPayForm = React.memo(({ amount, description, func }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.everypay.payform(
      {
        pk: "pk_cgHDp12Elp34Z3njlWAMKR5jlperbdGb", //can be found in your dashboard
        locale: "el",
        theme: "material",
        amount: amount,
        display: {
          button: false,
        },
      },
      handleResponse
    );
  });

  const handleResponse = async (r) => {
    if (r.response === "success") {
      // console.log(r);
      let body = {
        token: r.token,
        amount: String(amount),
        description: description,
      };
      const res = await axios.post(
        current_url + "payments/new_payment",
        body,
        authHeaders
      );
      if (res.status === 200) {
        func();
      }
      return res;
    }
    if (r.onLoad) {
      setLoading(false);
    }
  };

  return (
    <div className="custom-control custom-radio">
      {/* <input id="credit" name="paymentMethod" type="radio" className="custom-control-input" onClick="everypay.showForm()" required/> */}
      {/* <label className="custom-control-label" htmlFor="credit">Credit card</label> */}
      <div id="pay-form"></div>
    </div>
  );
});

export default EveryPayForm;
