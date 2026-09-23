import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Image from "next/legacy/image";
import google_icon from "../../public/assets/images/google_icon.svg";
import facebook_icon from "../../public/assets/images/facebook_icon.svg";
// import discord from "../../public/assets/images/discord.svg"; // re-enable with Discord login

import { useRouter } from "next/router";
import { useAuth } from "../../context/authcontext";
import { updateProfile } from "firebase/auth";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useUserData } from "../../context/userDataHook";
import { toast } from "react-hot-toast";
import Loader from "../../components/loader";

interface SignupType {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  companyName: string;
  userType: string;
  isNew: boolean;
  metamask: string;
}

const inputClass =
  "w-full h-[45px] bg-[#257d860d] border border-[#139bad33] rounded-sm px-5 py-2.5 text-white placeholder:text-lightWhite focus-visible:outline-0";

const getErrorMessage = (error: any) =>
  error?.message || String(error) || "Something went wrong";

export default function SingUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    user,
    authModal: { setWhichAuth },
  } = useAuth();
  const { userData } = useUserData();

  // default user type = customer ("user")
  const methods = useForm<SignupType>({
    mode: "onBlur",
    defaultValues: { userType: "user" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const userType = watch("userType");

  // redirect if userData or user updated
  useEffect(() => {
    if (user?.uid && userData?.userType === "user") {
      router.push("/users/dashboard");
    } else if (user?.uid && userData?.userType === "company") {
      router.push("/company/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit = async (data: SignupType) => {
    setLoading(true);
    try {
      const success = await signUp(data.email, data.password);
      const displayName =
        data.userType === "company" ? data.companyName : data.name;

      try {
        await updateProfile(success.user, { displayName });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }

      // add this user to firestore "users" collection
      try {
        await addDoc(collection(db, "users"), {
          email: data.email,
          name: displayName,
          firstName: data.firstName,
          lastName: data.lastName,
          userType: data.userType,
          uid: success.user?.uid,
          isNew: true,
          metamask: "",
        });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }

      setLoading(false);
      router.push(
        data.userType === "company" ? "/company/dashboard" : "/users/dashboard"
      );
      toast.success("Account created successfully");
    } catch (error) {
      setLoading(false);
      toast.error(getErrorMessage(error));
    }
  };

  const socialSignIn = async (provider: () => Promise<any>) => {
    setLoading(true);
    try {
      const success = await provider();
      if (success) {
        try {
          await addDoc(collection(db, "users"), {
            email: success.user?.email,
            name: success.user?.displayName,
            userType: "user",
            uid: success.user?.uid,
            isNew: true,
          });
        } catch (error) {
          toast.error(getErrorMessage(error));
        }
        router.push("/users/dashboard");
        toast.success("Account created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = () => socialSignIn(signInWithGoogle);
  const signInFacebook = () => socialSignIn(signInWithFacebook);

  return (
    <>
      <div className="p-5">
        <Loader show={loading} />
        {/* FORM DETAILS */}
        <div className="w-full max-w-[450px] mx-auto">
          {/* Logo + Copy */}
          <div className="flex-col items-center text-center space-y-5 p-5">
            <h2 className="text-xl font-medium">Get Started</h2>
          </div>

          {/* FORM */}
          <FormProvider {...methods}>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3 mb-4">
                {/* user type (default: customer) */}
                <select
                  className="w-full h-[45px] bg-[#257d860d] border border-[#139bad33] rounded-sm px-5 py-2.5 text-white focus-visible:outline-0"
                  {...register("userType", {
                    required: "User Type is Required",
                  })}
                >
                  <option className="text-black" value="user">
                    Customer
                  </option>
                  <option className="text-black" value="company">
                    Business
                  </option>
                </select>
                {errors.userType && (
                  <p className="text-red">{errors.userType.message}</p>
                )}

                {/* business → company name */}
                {userType === "company" && (
                  <>
                    <input
                      className={inputClass}
                      placeholder="Company User Name"
                      type="text"
                      {...register("companyName", {
                        required: "Company User Name is required",
                      })}
                    />
                    {errors.companyName && (
                      <p className="text-red">{errors.companyName.message}</p>
                    )}
                  </>
                )}

                {/* customer → username */}
                {userType === "user" && (
                  <>
                    <input
                      className={inputClass}
                      placeholder="Username"
                      type="text"
                      {...register("name", {
                        required: "Username is required",
                      })}
                    />
                    {errors.name && (
                      <p className="text-red">{errors.name.message}</p>
                    )}
                  </>
                )}

                <input
                  className={inputClass}
                  placeholder="First Name"
                  type="text"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red">{errors.firstName.message}</p>
                )}

                <input
                  className={inputClass}
                  placeholder="Last Name"
                  type="text"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red">{errors.lastName.message}</p>
                )}

                <input
                  className={inputClass}
                  placeholder="Email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red">{errors.email.message}</p>
                )}

                <input
                  className={inputClass}
                  placeholder="Create password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red">{errors.password.message}</p>
                )}
              </div>

              {/* BUTTON */}
              <button type="submit" className="buttonPrimary font-semibold">
                Create Account
              </button>
            </form>

            <p className="mt-5 text-center">
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#F6B519]"
                onClick={() => setWhichAuth("sign-in")}
              >
                Sign in instead
              </button>
            </p>

            {/* OR */}
            <div className="my-7 text-base relative after:content-[''] after:absolute after:bg-teal-100 after:w-full after:h-[1px] after:opacity-20 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:translate-y-1/2">
              <span className="block m-auto text-center">or continue with</span>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="flex items-center space-x-5">
              <div className="socialSignup">
                <Image
                  className="relative z-10"
                  src={google_icon}
                  alt="google_icon"
                  layout="intrinsic"
                  onClick={signInGoogle}
                />
              </div>
              <div className="socialSignup">
                <Image
                  className="relative z-10"
                  src={facebook_icon}
                  alt="facebook_icon"
                  layout="intrinsic"
                  onClick={signInFacebook}
                />
              </div>
              {/* TODO: Add Discord authentication */}
            </div>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
