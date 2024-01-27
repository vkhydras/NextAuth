"use client"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@nextui-org/react"
import { passwordStrength } from "check-password-strength"
// import { watch } from "fs"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import PassStrength from "./PassStrength"
import { resetPass } from "@/lib/actions/authActions"
import { toast } from "react-toastify"


interface Props {
    jwtUserId: string
}

const FormSchema = z.object({
    password: z.string()
        .min(6,"password must be greater that 6 characters")
        .max(52,"Pasword must be less than 52 characters"),
    confirmPassword: z.string()
}).refine(data=>data.password===data.confirmPassword,{
    message:"Password doesn't match"
})

type InputType = z.infer<typeof FormSchema>

export default function ResetPassForm ({jwtUserId}:Props) {

    const[visible,setVisible] = useState(false)
    const[passStr, setPassStr] = useState(0)

    
    const {register,handleSubmit,reset, formState:{errors,isSubmitting},watch} = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    })

    const pass = watch().password
    
    useEffect(()=>{
        setPassStr(passwordStrength(watch().password).id)
    },[pass,watch])

    const resetPassword: SubmitHandler<InputType> = async(data)=>{
        try {
            const result = await resetPass(jwtUserId,data.password)
            if(result ==="succes") toast.success("Your Password has been reset succefully")

        } catch (error) {
            toast.error("Something went wrong")
        }
    }

  return (
    <form onSubmit={handleSubmit(resetPassword)} className="flex flex-col gap-2 p-2 border rounded-md shadow">
        <div className="text-center p-2">Reset Your Password</div>
      <Input label="Password" {...register("password")} errorMessage={errors.password?.message} type={visible? "text":"password"}
        endContent={
            <button type="button" onClick={() => setVisible((prev) => !prev)}>
              {visible ? <EyeSlashIcon className="w-4" /> : <EyeIcon className="w-4" />}
            </button>}
            />

        <PassStrength passStrength={passStr}/>

      <Input label="confirm Password" {...register("password")} errorMessage={errors.confirmPassword?.message} type={visible? "text":"password"}/>

      <div className="flex justify-center">
      <Button color="primary" type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
      </div>
    </form>
  )
}
