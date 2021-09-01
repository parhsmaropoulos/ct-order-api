import axios from "axios";
import React, {useEffect, useState} from "react";
import { authHeaders } from "../../../utils/axiosHeaders";
import { current_url } from "../../../utils/util";

function EveryPayForm() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.everypay.payform({
            pk: "pk_cgHDp12Elp34Z3njlWAMKR5jlperbdGb", //can be found in your dashboard
            amount: 1000,
            locale: 'el',
            installments: [2, 6, 8],
        }, handleResponse);
    }, []);


    const handleResponse = async (r) => {
        if (r.response === "success") {
            console.log(r)
            let body = {
                token: r.token,
                amount: '1000',
                description: 'order id xxxxxx'
            }
            const res = await axios.post(current_url + "orders/new_payment", body, authHeaders)
        }
        // if (r.onLoad) {
        //     setLoading(false);
        // }
    }

    return (
        <div className="custom-control custom-radio">
        {/* <input id="credit" name="paymentMethod" type="radio" className="custom-control-input" onClick="everypay.showForm()" required/> */}
        {/* <label className="custom-control-label" htmlFor="credit">Credit card</label> */}
        <div id="pay-form"></div>
      </div>
    );
}

export default EveryPayForm;