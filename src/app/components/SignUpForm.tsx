"use client";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, PhoneIcon, UserIcon } from "@heroicons/react/16/solid"
import { Button, Checkbox, Input } from "@nextui-org/react"
import Link from "next/link";
import { useState } from "react"

const SignupForm = () => {

    const [visible,setVisible] = useState(false)
    const toggleVisible = () => setVisible(prev=>!prev)

    return <form className="grid grid-cols-2 gap-3 p-2 shadow border rounded-md place-self-stretch"  action="">
        <Input label="first Name" startContent={<UserIcon className="w-4"/>}></Input>

        <Input label="Last Name" startContent={<UserIcon className="w-4"/>}></Input>

        <Input className="col-span-2" label="Email" startContent={<EnvelopeIcon className="w-4"/>}></Input>

        <Input className="col-span-2" label="Phone" startContent={<PhoneIcon className="w-4"/>}></Input>

        <Input className="col-span-2" label="Password" type={visible? "text":"password"} startContent={<KeyIcon className="w-4"/>} endContent={
        visible? <EyeSlashIcon className="w-4 cursor-pointer" onClick={toggleVisible}/>
            :
         <EyeIcon className="w-4 cursor-pointer" onClick={toggleVisible}/>
        }></Input>

        <Input className="col-span-2" label="Comfirm Password" type={visible? "text":"password"} startContent={<KeyIcon className="w-4"/>}></Input>

        <Checkbox className="col-span-2">I accept The <Link href="/Terms">Terms</Link></Checkbox>

        <div className="flex justify-center col-span-2">
            <Button type="submit" color="primary" className="w-48">Submit</Button>
        </div>

    </form>
} 

export default SignupForm