"use client";
import { House, BriefcaseBusiness, MapPin, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function Footer() {

  let router: any = useRouter(); 

  const isHome = ["/", "/prompt", "/pre-chat", "/chat"].includes(usePathname());
  const isJob = usePathname() === "/jobs";
  const isMap = usePathname() === "/map";
  const isProfile = usePathname() === "/profile";

  return (
    <div className="bg-card h-[60px] fixed w-[100%] bottom-0 rounded-t-[25px] border-t border-[#AFC4BF66] flex justify-around items-center">
      <div className="bg-background p-[10px] rounded-full" onClick={()=> router.push("/")}>
        <House
          size={25}
          strokeWidth={1}
          className={`${isHome ? "text-[#27A830]" : "text-text"}`}
        />
      </div>
      <div className="bg-background p-[10px] rounded-full" onClick={()=> router.push("/jobs")}>
        <BriefcaseBusiness
          size={25}
          strokeWidth={1}
          className={`${isJob ? "text-[#27A830]" : "text-text"}`}
        />
      </div>
      <div className="bg-background p-[10px] rounded-full" onClick={()=> router.push("/map")}>
        <MapPin
          size={25}
          strokeWidth={1}
          className={`${isMap ? "text-[#27A830]" : "text-text"}`}
        />
      </div>
      <div className="bg-background p-[10px] rounded-full" onClick={()=> router.push("/profile")}>
        <UserRound
          size={25}
          strokeWidth={1}
          className={`${isProfile ? "text-[#27A830]" : "text-text"}`}
        />
      </div>
    </div>
  );
}

export default Footer;
