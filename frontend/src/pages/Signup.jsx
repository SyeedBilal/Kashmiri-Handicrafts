import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { setUser } from "../store/Slices/authSlice";
import {api} from '../services/axiosInstance'; 

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues, 
    formState: { errors, isSubmitting },
  } = useForm();

  
 const onSubmit = async (data) => {
 
  try {
    const response = await api.post('/signup', data); 


    if (response.data.success) {

      alert("Signup Successful please login");
      navigate('/');
    } else {
      const errorMsg = response.data.errors?.map(err => err.msg).join('\n') || response.data.error;
      alert(errorMsg);
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed. Please try again.');
  }
};


  return (
    <div className="min-h-screen bg-amber-50 py-16 px-4 flex items-center justify-center">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-amber-900 text-amber-100 p-6">
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        <p className="text-center text-amber-200 mt-2">Join our community</p>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-5">
            <label className="block text-amber-900 mb-1 font-medium">Full Name:</label>
            <input
              type="text"
              {...register('name', {
                required: "Name is required",
                minLength: { value: 3, message: "At least 3 characters required" },
              })}
              className="w-full p-3 border border-amber-300 rounded-md bg-white text-amber-900 outline-none transition duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-amber-900 mb-1 font-medium">Email:</label>
            <input
              type="email"
              {...register('email', {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-3 border border-amber-300 rounded-md bg-white text-amber-900 outline-none transition duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className="block text-amber-900 mb-1 font-medium">Password:</label>
            <input
              type="password"
              {...register('password', {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                validate: (value) => 
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value) || 
                  "Must contain uppercase, lowercase and number"
              })}
              className="w-full p-3 border border-amber-300 rounded-md bg-white text-amber-900 outline-none transition duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-amber-900 mb-1 font-medium">Confirm Password:</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: "Please confirm your password",
                validate: (value) => 
                  value === getValues('password') || "Passwords don't match"
              })}
              className="w-full p-3 border border-amber-300 rounded-md bg-white text-amber-900 outline-none transition duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`bg-amber-700 text-white font-medium w-full p-3 rounded-md transition duration-300 hover:bg-amber-800 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-amber-900">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-amber-700 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
);

  
}

export default Signup;