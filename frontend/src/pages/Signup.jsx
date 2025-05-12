import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { setUser } from "../store/Slices/authSlice";
import {api} from '../services/axiosInstance'; 

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  
 const onSubmit = async (data) => {
 
  try {
    const response = await api.post('/signup', data); 


    if (response.data.success) {

      alert("Signup Successful please login");
      navigate('/');
    } else {
      const errorMsg = result.errors?.map(err => err.msg).join('\n') || result.error;
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
        <div className="bg-amber-900 text-amber-100 p-6">
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="text-center text-amber-200 mt-2">Join our community of artisans and customers</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <label className="block text-amber-900 mb-1 font-medium">Username:</label>
              <input
                type="text"
                {...register('username', {
                  required: "Username is required",
                  maxLength: { value: 40, message: "Maximum 40 characters allowed" },
                  minLength: { value: 4, message: "At least 4 characters required" },
                })}
                className="w-full p-3 border border-amber-300 rounded-md bg-white text-amber-900 outline-none transition duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500"
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-amber-900 mb-1 font-medium">Email Address:</label>
              <input
                type="email"
                {...register('email', {
                  required: "Email Address is required",
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

     

            <div className="mb-6">
              <label className="block text-amber-900 mb-1 font-medium">Password:</label>
              <input
                type="password"
                {...register('password', {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full p-3 border border-amber-300 rounded-md bg-white text-amber-900 outline-none transition duration-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
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