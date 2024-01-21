import { activateUser } from "@/lib/actions/authActions"


interface Props{
    params: {
        jwt: string
    }
}

export default async function page({params}:Props) {

  const result  = await activateUser(params.jwt)  

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {result ==="userNotExist"? <p className="text-red-500 text-2xl">The User does not Exist</p>:
      result==="alreadyActivated"?<p className="text-red-500 text-2xl">User is already activated</p>:
      result==="success"?<p className="text-green-500 text-2xl">User now activated</p>:
      <p className="text-yellow-500 text-2xl">Opps something went wrong</p>}
    </div>
  )
}
