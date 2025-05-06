'use client'

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton({back} : any) {
  let router = useRouter();

  return (

    <div style={{ position: "absolute", top: "25px", left: "10px" }}>
      <ArrowLeft
        style={{ height: "30px", width: "30px" }}
        onClick={() => router.push(back)}
      />
    </div>
    
    
  );
}

export default BackButton;
