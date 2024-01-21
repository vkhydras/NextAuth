import ResetPassForm from "@/app/components/ResetPassForm"
import { verifyJwt } from "@/lib/jwt"
// import { verify } from "jsonwebtoken"

interface Props {
    params: {
        jwt: string
    }
}

export default function page({params}:Props) {

    const payload = verifyJwt(params.jwt)

    if(!payload) return <div className="flex items-center justify-center h-screen text-red--500 text-2xl">The url is not valid</div>

  return (
    <div className="flex justify-center">
      <ResetPassForm jwtUserId={params.jwt} />
    </div>
  )
}
