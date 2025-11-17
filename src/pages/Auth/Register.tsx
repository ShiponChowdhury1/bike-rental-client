import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/validation/authValidation";
import { z } from "zod";
import { SignUpFormFieldProps } from "@/types/auth";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "@/redux/features/auth/authApi";
import { toast } from "@/components/ui/use-toast";
import RegisterAnimate from "./RegisterAnimate";
import { Eye, EyeOff } from "lucide-react"; // Assuming you're using an icon library like Lucide
import logo from "@/assets/logo.png";
import googleIcon from '@/assets/auth/google.png'
import linkedin from '@/assets/auth/linkedin.png'
import github from '@/assets/auth/github.png'
const Register = () => {
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userData = {
      ...data,
      role: "user",
    };

    try {
      const res = await signUp(userData).unwrap();
    
      if (res.success) {
        toast({
          variant: "default",
          title: res.message,
        });
    
        navigate("/auth");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast({
        variant: "destructive",
        title: err?.data?.message || "An unexpected error occurred",
      });
    }
  };

  return (
     <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 gap-24">
        <div className="w-full max-w-md lg:max-w-lg mb-8 lg:mb-0">
          <RegisterAnimate />
        </div>
        <div className="lg:w-1/3 w-full bg-white p-10 rounded-2xl shadow-2xl">
         <img src={logo} alt="bike rental logo" className="mx-auto mb-4 w-[100px] h-[100px]" />
         <div className="text-center">
                  <h4 className="text-4xl font-extrabold ">Create an Account</h4>
                  <div className="flex justify-center items-center gap-2 mt-2 mb-6">
                    <p>Already have an account? </p>
                    <Link
                      className="text-[#F43650] font-semibold underline"
                      to={"/auth"}
                    >
                     Sign In
                    </Link>
                  </div>
                </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 bg-white  p-6 md:p-8 rounded-md"
            >
              <SignupFormField
                name="name"
                label="Name"
                placeholder="Enter your name"
                inputType="text"
                formControl={form.control}
              />
              <SignupFormField
                name="email"
                label="Email"
                placeholder="Enter your email"
                inputType="text"
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
              <SignupFormField
                name="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
                inputType="text"
                formControl={form.control}
              />
              <SignupFormField
                name="address"
                label="Address"
                placeholder="Enter your address"
                inputType="text"
                formControl={form.control}
              />
              <Button className="bg-[#002147] w-full" type="submit">
                {isLoading ? "Signing..." : "Sign Up"}
              </Button>
               <p className="text-center">By creating an account, you agree to Bike Rental <span className="text-[#F43650] font-semibold underline">Terms</span> and <span className="text-[#F43650] font-semibold underline">Privacy</span></p>
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

const SignupFormField: React.FC<SignUpFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
  required,
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
                type={showPassword && inputType === "password" ? "text" : inputType || "text"}
                {...field}
                className="w-full pr-10"
                required={required}
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

export default Register;
