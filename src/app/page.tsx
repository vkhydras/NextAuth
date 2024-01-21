import { sendMail } from '@/lib/mail'
import Image from 'next/image'

export default async function Home() {

  await sendMail({to:"victorkimaru228@gmail.com",subject:"test",body:"Hello vic"})

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    </main>
  )
}
