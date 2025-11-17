import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/authValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthFormFieldProps } from "@/types/auth";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "@/components/ui/use-toast";
import { verifyToken } from "@/utils/verifyToken";
import { setUser } from "@/redux/features/auth/authSlice";
import LoginAnimate from "./LoginAnimate";
import { Eye, EyeOff } from "lucide-react"; // Assuming you're using an icon library like Lucide
import googleIcon from '@/assets/auth/google.png'
import linkedin from '@/assets/auth/linkedin.png'
import github from '@/assets/auth/github.png'
import logo from "@/assets/logo.png";
const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await login(data).unwrap();
      const user = verifyToken(res.token);

      dispatch(setUser({ user, token: res.token }));

      toast({ title: res.message });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 ">
      <div className="w-full max-w-md lg:max-w-lg mb-8 lg:mb-0">
        <LoginAnimate />
      </div>

      <div className="lg:w-1/3 w-full bg-white p-10 rounded-2xl shadow-2xl">
        <img src={logo} alt="bike rental logo" className="mx-auto mb-4 w-[100px] h-[100px]" />
        <div className="text-center">
          <h4 className="text-4xl font-extrabold ">Sign In</h4>
          <div className="flex justify-center items-center gap-2 mt-2 mb-6">
            <p>New to Bike Rental? </p>
            <Link
              className="text-[#F43650] font-semibold underline"
              to={"/auth/register"}
            >
              Create an Account
            </Link>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 bg-white dark:bg-gray-800 p-6 md:p-8"
          >
            <SignupFormField
              name="email"
              label="Username or Email Address"
              placeholder="Enter your email"
              inputType="email"
              formControl={form.control}
            />
            <SignupFormField
              name="password"
              label="Password"
              placeholder="Enter your password"
              description="At least 8 characters."
              inputType="password"
              formControl={form.control}
            />
            <Button className="bg-[#002147]  text-white w-full" type="submit">
              {isLoading ? "Logging..." : "Login"}
            </Button>
            <p className="text-center">Need to find <span className="text-[#F43650] font-semibold underline"> your username</span> or your <span className="text-[#F43650] font-semibold underline">password?</span></p>
          </form>
        </Form>
            <div className="flex justify-center items-center gap-4">
                           <Button variant="secondary" className="w-[120px] h-[40px] border-2 border-[#44AA62] p-4"><img src={googleIcon} alt="" className="w-[48px] h-[48px]"/>Google</Button>
                           <Button className="w-[120px] h-[40px]  border-2 border-[#812290] p-4 " variant="secondary" > <img src={github} alt="" className="w-[40px] h-[40px]" /> Github</Button>
                           <Button className="w-[120px] h-[40px] border border-[#0066C8] p-4 " variant="secondary" ><img src={linkedin} alt="" className="w-[48px] h-[48px]" /> Linkedin</Button>
        </div>
      </div>
    </div>
  );
};

const SignupFormField: React.FC<AuthFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={
                  showPassword && inputType === "password"
                    ? "text"
                    : inputType || "text"
                }
                {...field}
                className="w-full pr-10"
              />
              {inputType === "password" && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Login;
