"use client"
import { forgotPassword } from "@/lib/actions/authActions"
import { EnvelopeIcon } from "@heroicons/react/16/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@nextui-org/react"
import Image from "next/image"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"


const FormSchema = z.object({
    email: z.string().email("Please enter a valid email")
})

type InputType = z.infer<typeof FormSchema>

export default function ForgotPasswordPage() {

    const {register,handleSubmit,reset, formState:{errors,isSubmitting}} = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    })

    const submitRequest: SubmitHandler<InputType> =async (data) => {
        try {
            const result = await forgotPassword(data.email);
            toast.success("Reset Password link sent to your email");
            reset();
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
          }
          
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <form onSubmit={handleSubmit(submitRequest)} className="flex flex-col gap-2 p-2 border rounded-md shadow">
        <div className="text-center p-2">Enter your Email</div>
        <Input label = "Email" {...register("email")} startContent={<EnvelopeIcon className="w-4"/>} errorMessage={errors.email?.message} color="primary"/>

        <Button isLoading={isSubmitting} disabled={isSubmitting} type="submit">
            {isSubmitting? "Please wait...":"Submit"}
        </Button>

      </form>
      <Image src={"/forgotPass.png"} alt="forgot password.." width={500} height={500} className="col-span-2"/>
    </div>
  )
}
