import React,{useState} from 'react'
import { useAppContext } from '../Context/Context.jsx';
import toast from "react-hot-toast";

function Form() {
  const {setUser,navigate,axios} = useAppContext();
   
  
    const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post("/user/register", {
      name,
      email,
      password,
    });

    if (data?.success) {
      toast.success(data.message || "Registration successful"); // ✅ show backend message
      setUser(data.user);
      navigate('/');
    } else {
      toast.error(data.message || "Registration failed");
    }
  } catch (err) {
    console.error(err);

    // ✅ handle backend errors properly
    const backendMessage = err.response?.data?.message;
    toast.error(backendMessage || "Something went wrong, please try again");
  }
};

  
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email,password);
    // Login logic here
    try {
  const { data } = await axios.post("/user/login", { email, password });

  if (data?.success) {
    toast.success("Login successful");
    setUser(data.user);
    navigate('/');
  } else {
    // backend responded with success: false
    toast.error(data.message || "Login failed");
  }
} catch (err) {
  console.error(err);

  // backend responded with error status (400, 401, 500, etc.)
  const backendMessage = err.response?.data?.message;

  toast.error(backendMessage || "Something went wrong");
}

  };
  return (
   <div className="w-full h-screen flex items-center justify-center bg-gray-100">
    <form  
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" &&  (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="text"
                required
              />
            </div>
          </>
        )}

        <div className="w-full">
         <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="email"
            required
         
          />
        </div>

    
          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="password"
              required
            />
          </div>
      

       

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("login");
              
              }}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button
          onClick={
            state === "register" ? handleRegister : handleLogin
          }
          className="bg-green-400 hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer flex items-center justify-center gap-2"
         
        >
            {state === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
   </div>
  )
}

export default Form

