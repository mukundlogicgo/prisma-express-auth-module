import Spinner from "@/components/Spinner";
import { formatZodError } from "@/helper/formateZodError.helper";
import { NEXT_PUBLIC_SERVER_BASE_URL } from "@/pages/_app";
import { signupFormSchema } from "@/validation/signupForm.validation";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Signup = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [disableSignupButton, setDisableSignupButton] = useState(true);

  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
  });

  // reset state
  const resetAllState = async () => {
    setName("");
    setEmail("");
    setPassword("");
    setDisableSignupButton(true);
    setIsLoading(false);
    setFormError({
      name: "",
      email: "",
      password: "",
    });
  };

  // handle sign up with google  on success
  const googleLoginOnSuccess = async (response) => {
    try {
      const { access_token } = response;
      if (!access_token) {
        return alert(
          "Unable to get credential from google retry after some time"
        );
      }

      const axiosRes = await axios.get(
        `${NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/google`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // set token to local storage
      localStorage.setItem("token", axiosRes.data.token);

      // redirect user to home page
      if (axiosRes.status === 200) {
        alert(axiosRes.data.message);
        router.replace("/");
      }
    } catch (error) {
      console.log("[ERROR]", error.message);

      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  // custom google button
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleLoginOnSuccess,
  });

  // handle signup with email and password
  const handleSignupWithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userData = {
        name,
        email,
        password,
      };

      const axiosRes = await axios.post(
        `${NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/register`,
        userData
      );

      if (axiosRes.status === 201) {
        alert(axiosRes.data.message);

        localStorage.setItem("token", axiosRes.data.token);

        // reset all state
        await resetAllState();

        // navigate to home page
        router.replace("/");
      }
    } catch (error) {
      error?.response?.data?.message && alert(error?.response?.data?.message);

      error?.response?.data?.error &&
        setFormError(error?.response?.data?.error);
      // reset all state
      await resetAllState();
    }
  };

  // validate sign up form
  useEffect(() => {
    (async () => {
      try {
        if (!name && !email && !password) {
          setFormError({
            name: "",
            email: "",
            password: "",
          });
          return;
        }
        await signupFormSchema.parse({
          name,
          email,
          password,
        });

        setFormError({
          name: "",
          email: "",
          password: "",
        });

        setDisableSignupButton(false);
      } catch (error) {
        setDisableSignupButton(true);
        const errors = await formatZodError({ error });

        setFormError(errors);
      }
    })();
  }, [name, email, password]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  {/* Sign up with google button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  >
                    <div className="bg-white p-1 rounded-full">
                      <FcGoogle size={24} />
                    </div>
                    <span className="ml-4">Sign Up with Google</span>
                  </button>

                  {/* sign up with github button */}
                  <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                    <div className="bg-white p-1 rounded-full">
                      <AiFillGithub size={24} />
                    </div>
                    <span className="ml-4">Sign Up with GitHub</span>
                  </button>
                </div>

                {/* or sign up with email div */}
                <div className="my-12 border-b text-center">
                  <div className=" leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or
                  </div>
                </div>

                {/* sign up with email and password */}
                <div className="mx-auto max-w-xs">
                  <form>
                    {/* name input */}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="text"
                      placeholder="Name"
                    />
                    <p className="text-red-400 text-xs mt-1">
                      {formError.name}
                    </p>

                    {/* email input */}
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="email"
                      placeholder="Email"
                    />
                    <p className="text-red-400 text-xs mt-1">
                      {formError.email}
                    </p>

                    {/* password input */}
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
                    />
                    <p className="text-red-400 text-xs mt-1">
                      {formError.password}
                    </p>

                    {/* signup button */}
                    <button
                      type="submit"
                      disabled={disableSignupButton}
                      onClick={handleSignupWithEmailPassword}
                      className={`mt-5 tracking-wide font-semibold ${
                        disableSignupButton ? "bg-indigo-300" : "bg-indigo-500"
                      }  text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                    >
                      {!isLoading ? (
                        <>
                          <svg
                            className="w-6 h-6 -ml-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <path d="M20 8v6M23 11h-6" />
                          </svg>
                          <span className="ml-3">Sign Up</span>
                        </>
                      ) : (
                        <>
                          <Spinner />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Already have account ? */}
                <div className="flex items-center justify-center w-full mt-3">
                  <span className="text-sm">
                    Already have account ?{" "}
                    <Link href={"/auth/login"} className={"text-indigo-400"}>
                      Login
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
