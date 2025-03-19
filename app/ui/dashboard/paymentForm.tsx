"use client";

import { useState, useEffect } from "react";
import PayButton from "./PayButton"; // Import the existing PayButton component

const PaymentForm = ({
  course,
}: {
  course: { courseId: string; title: string; coursePrice: number };
}) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // if (typeof window !== "undefined") {
      // Retrieve student email from local storage only on client-side
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Course Payment</h2>
      <p className="text-lg">
        Course: <strong>{course.title}</strong>
      </p>
      <p className="text-lg">
        Price: <strong>₦{course.coursePrice || 0}</strong>
      </p>

      {email ? (
        <div className="mt-4">
          {/* Pass courseId to PayButton for verification */}
          <PayButton email={email} amount={course.coursePrice || 0} courseId={course.courseId} />
        </div>
      ) : (
        <p className="text-red-500 mt-4">Please log in to proceed with payment.</p>
      )}
    </div>
  );
};

export default PaymentForm;
