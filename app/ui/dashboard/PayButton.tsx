"use client";
// import { PaystackButton } from "react-paystack";
import dynamic from "next/dynamic";
const PaystackButton = dynamic(() => import("react-paystack").then((mod) => mod.PaystackButton), {
  ssr: false,
});


const PayButton = ({
  email,
  amount,
  courseId,
  token, 
}: {
  email: string;
  amount: number;
  courseId: string;
  token: string; 
}) => {
  const publicKey = "pk_test_385cf61e72cf12a464e715aa4c6058105adcff51";

  const verifyPayment = async (reference: string) => {
    if (!token) {
      console.error("Token is missing! Cannot verify payment.");
      alert("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "https://exceptionhandling-production.up.railway.app/api/payments/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token prop directly
          },
          body: JSON.stringify({ reference, email, courseId }),
        }
      );

      const data = await response.json();
      console.log("Verification Response:", data);

      if (response.ok) {
        alert("Payment successful! You are now enrolled.");
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("An error occurred while verifying payment.");
    }
  };

  return (
    <div>
      <PaystackButton
        className="bg-blue-500 text-white px-4 py-2 rounded"
        email={email}
        amount={amount * 100}
        publicKey={publicKey}
        text="Pay Now"
        onSuccess={({ reference }) => {
          console.log("Payment successful:", reference);
          verifyPayment(reference);
        }}
        onClose={() => {
          console.log("Payment window closed");
        }}
      />
    </div>
  );
};

export default PayButton;
