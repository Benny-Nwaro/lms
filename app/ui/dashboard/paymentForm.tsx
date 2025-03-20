"use client";

import PayButton from "./PayButton"; // Import the existing PayButton component

const PaymentForm = ({
  course,
  email,
  token,
}: {
  course: { courseId: string; title: string; coursePrice: number };
  email: string;
  token: string; // Ensure token is always passed
}) => {
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
          <PayButton 
            email={email} 
            amount={course.coursePrice || 0} 
            courseId={course.courseId} 
            token={token || ""} // Ensure token is always a valid string
          />
        </div>
      ) : (
        <p className="text-red-500 mt-4">Please log in to proceed with payment.</p>
      )}
    </div>
  );
};

export default PaymentForm;
