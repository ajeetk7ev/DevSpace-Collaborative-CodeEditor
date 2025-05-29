import {  SignUp } from "@clerk/nextjs";


export default function SignUpPage(){
    return(
        <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
            <SignUp/>
        </div>
    )
}