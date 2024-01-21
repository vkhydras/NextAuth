"use server"

import {User} from '@prisma/client'
import prisma from '../prisma'
import * as bcrypt from "bcrypt"
import { compileActivationTemplate, sendMail,compileResetPassTemplate } from '../mail'
import { signJwt, verifyJwt } from '../jwt'
// import { sign } from 'crypto'

export async function registerUser(user: Omit<User,"id" | "emailVerified" | "image">){
    const result = await prisma.user.create({
        data:{
            ...user,
            password: await bcrypt.hash(user.password,10)
        }
    })

    const jwtUserId = signJwt({
        id: result.id
    })

    const activatioUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`

    const body = compileActivationTemplate(user.firtName,activatioUrl)

    await sendMail({to:user.email,subject:"Active Your Account",body})

    return result
}

type ActivateUserFunc = (jwtUserId: string)=>Promise<"userNotExist" | "alreadyActivated" | "success">

export const activateUser: ActivateUserFunc = async (jwtUserId) => {

    const payload =  verifyJwt(jwtUserId)

    const userId = payload?.id
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user) return "userNotExist"
    if(user.emailVerified) return "alreadyActivated"
    const result = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            emailVerified:new Date()
        }
    })
    return "success"
}

export async function forgotPassword(email:string){
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    if(!user) throw new Error("user does not exist")

    const jwtUserId = signJwt({
        id: user.id
    })
    const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/resetPass/${jwtUserId}`
    const body = compileResetPassTemplate(user.firtName,resetPassUrl)
    const sendResult = await sendMail({
        to:user.email,
        subject:"Reset Password",
        body: body
    })
    return sendResult

}

type ResetPassFunc  = (jwtUserId: string, password: string ) =>Promise<"userNotExist" | "succes">

export const resetPass: ResetPassFunc = async (jwtUserId,password) =>{
    const payload  =verifyJwt(jwtUserId)
    if(!payload) return "userNotExist"
    const userId = payload.id 

    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if (!user) return "userNotExist"

    const result = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            password:await bcrypt.hash(password,10)
        }
    })
    if(result) return "succes"
    else throw new Error("Something went wrong")
}