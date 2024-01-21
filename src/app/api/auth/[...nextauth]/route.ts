import { signIn } from 'next-auth/react';
import {AuthOptions} from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcrypt"
import NextAuth from "next-auth/next"
import { User } from "@prisma/client"

export const authOptions : AuthOptions = {

    pages:{
        signIn: "/auth/signin"
    },

    providers : [
        
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                username:{
                    label:"User Name",
                    type:"text",
                    placeholder:"Your User Name"
                },
                password: {
                    label:"Password",
                    type:"password"
                }
            },
            async authorize(credentials){
                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials?.username

                    }
                })
                if(!user) throw new Error("User name or password is not correct")
                // const isPasswordCorrect = credentials?.password === user.password
                if(!credentials?.password) throw new Error("Please Provide Your Password")

                const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                
                if(isPasswordCorrect) throw new Error ("User name or password is not correct")

                if(!user.emailVerified) throw new Error("Please verify your email First")

                const {password,...userWithoutPass} = user
                return userWithoutPass
            }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user) token.user = user as User
            return token
        },
        async session({token, session}){
            session.user = token.user
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}