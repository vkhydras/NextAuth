"use client";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, PhoneIcon, UserIcon } from "@heroicons/react/16/solid"
import { Button, Checkbox, Input } from "@nextui-org/react"
import Link from "next/link";
import { useState } from "react"
import { z } from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";


const FormSchema = z.object({
    firstName: z.string()
        .min(2,"First Name ust be atleats two characters")
        .max(45,"Fist name must be less than 45 characters")
        .regex(new RegExp("[a-zA-A]+$"),"No special characters allow"),
    lastName: z.string()
        .min(2,"First Name ust be atleats two characters")
        .max(45,"Fist name must be less than 45 characters")
        .regex(new RegExp("[a-zA-A]+$"),"No special characters allow"),
    email: z.string()
        .email("Please enter a valid email"),
    phone: z.string()
        .refine(validator.isMobilePhone,"Please enter a valid phone numbe"),
    password: z.string()
        .min(6,"Password must be atleast 6 characters")
        .max(50,"Password must be less than 50 characters"),
    confirmPassword: z.string()
        .min(6,"Password must be atleast 6 characters")
        .max(50,"Password must be less than 50 characters"),
    accepted: z.literal(true,{
        errorMap: ()=>({
            message: "Please accept all terms"
        })
    })

}).refine(data=> data.password===data.confirmPassword,{
    message:"Password and comfirm password do not match",
    path:["password","confirmPassword"],
})

type InputType = z.infer<typeof FormSchema>

const SignupForm = () => {

    const {register,handleSubmit,reset,control} = useForm<InputType>()

    const [visible,setVisible] = useState(false)
    const toggleVisible = () => setVisible(prev=>!prev)

    const saveUser: SubmitHandler<InputType> = async(data) =>{
        console.log(data)
    }

    return <form onSubmit={handleSubmit(saveUser)} className="grid grid-cols-2 gap-3 p-2 shadow border rounded-md place-self-stretch"  action="">
        <Input {...register("firstName")}label="first Name" startContent={<UserIcon className="w-4"/>}></Input>

        <Input {...register("lastName")} label="Last Name" startContent={<UserIcon className="w-4"/>}></Input>

        <Input {...register("email")} className="col-span-2" label="Email" startContent={<EnvelopeIcon className="w-4"/>}></Input>

        <Input {...register("phone")} className="col-span-2" label="Phone" startContent={<PhoneIcon className="w-4"/>}></Input>

        <Input {...register("password")} className="col-span-2" label="Password" type={visible? "text":"password"} startContent={<KeyIcon className="w-4"/>} endContent={
        visible? <EyeSlashIcon className="w-4 cursor-pointer" onClick={toggleVisible}/>
            :
         <EyeIcon className="w-4 cursor-pointer" onClick={toggleVisible}/>
        }></Input>

        <Input {...register("confirmPassword")} className="col-span-2" label="Comfirm Password" type={visible? "text":"password"} startContent={<KeyIcon className="w-4"/>}></Input>

        <Controller control={control} name="accepted" render={({field})=>(
            <Checkbox onChange={field.onChange} onBlur={field.onBlur} className="col-span-2">
                I accept The <Link href="/Terms">Terms</Link>
            </Checkbox>
        )} />


        <div className="flex justify-center col-span-2">
            <Button type="submit" color="primary" className="w-48">Submit</Button>
        </div>

    </form>
} 

export default SignupForm