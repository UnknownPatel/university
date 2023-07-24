import axios from "axios";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import { RazorpayOptions } from "react-razorpay";

export default function FeePayGetway() {
  const [Razorpay] = useRazorpay();

  const handlePayment = useCallback(() => {
    const options = {
      key: "rzp_test_tZlQ1CoRvo4DTY",
      amount: "30000",
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      // image: "https://example.com/your_logo",
      order_id: "order_MG1xpRicjhhT3X",
      handler: (res) => {
        console.log(res);
        var subdomain = "silver_oak";
        var access_token = "K7G3jeCx9XmZWN8ogc6Zk4pYJKLX4Q1V2on8d9pLwgg";
        var headers = { Authorization: `Bearer ${access_token}` };

        axios
          .post(
            `https://9c5d-182-69-164-36.ngrok-free.app/api/v1/students/payments/callback`,
            {
              order_id: res.razorpay_order_id,
              subdomain: subdomain,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then((responce) => {
            console.log(responce);
          })
          .catch(function (err) {
            console.log(err.message);
          });
      },
      prefill: {
        name: "Piyush Garg",
        card_number: "5267 3181 8797 5449",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        subdomain: "silver_oak",
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
    rzpay.on("payment.success", (res) => {
      console.log(res);
    });
  }, [Razorpay]);

  return (
    <div className="App">
      <div className="flex items-center  text-center h-screen w-96 p-4">
        <div className="bg-slate-100 rounded-lg shadow-md w-full h-96 flex flex-col">
          <div className="">
            <div className="text-center">student Name:</div>
            <div className="text-center">Enrollment Number:</div>
            <div className="text-center">Total Fee Amount:</div>
            <button
              className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
              onClick={handlePayment}
            >
              Click
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
