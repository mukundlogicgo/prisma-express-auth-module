import Spinner from "@/components/Spinner";
import { formatZodError } from "@/helper/formateZodError.helper";
import { NEXT_PUBLIC_SERVER_BASE_URL } from "@/pages/_app";
import { loginFormSchema } from "@/validation/signupForm.validation";

import axios from "axios";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [disableLoginButton, setDisableLoginButton] = useState(true);

  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  // reset state
  const resetAllState = async () => {
    setEmail("");
    setPassword("");
    setDisableLoginButton(true);
    setIsLoading(false);
    setFormError({
      email: "",
      password: "",
    });
  };

  // handle signup with email and password
  const handleLoginWithEmailPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userData = {
        email,
        password,
      };

      const axiosRes = await axios.post(
        `${NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/login`,
        userData
      );

      if (axiosRes.status === 200) {
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
        // clear all message if no text in form
        if (!email && !password) {
          setFormError({
            email: "",
            password: "",
          });
          return;
        }

        // validate form
        await loginFormSchema.parse({
          email,
          password,
        });

        // reset error message after successfully validate form
        setFormError({
          email: "",
          password: "",
        });
        // enable login button
        setDisableLoginButton(false);
      } catch (error) {
        setDisableLoginButton(true);
        const errors = await formatZodError({ error });
        setFormError(errors);
      }
    })();
  }, [email, password]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign in</h1>
              <div className="w-full flex-1 mt-8">
                {/* sign in with email and password */}
                <div className="mx-auto max-w-xs">
                  <form>
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

                    {/* sign in button */}
                    <button
                      type="submit"
                      disabled={disableLoginButton}
                      onClick={handleLoginWithEmailPassword}
                      className={`mt-5 tracking-wide font-semibold ${
                        disableLoginButton ? "bg-indigo-300" : "bg-indigo-500"
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
                          <span className="ml-3">Sign In</span>
                        </>
                      ) : (
                        <>
                          <Spinner />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Already have account ? */}
                  <div className="flex items-center justify-center w-full mt-3">
                    <span className="text-sm">
                      Don't have account ?{" "}
                      <Link href={"/auth/signup"} className={"text-indigo-400"}>
                        Sign Up
                      </Link>
                    </span>
                  </div>
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

export default Login;
