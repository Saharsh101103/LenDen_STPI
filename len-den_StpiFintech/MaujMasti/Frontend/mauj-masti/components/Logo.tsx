import Image from "next/image";

export default function Logo() {
    return (
        <div className="relative w-[50%]">

            <Image src={"/logo.png"} alt={""} fill/>
        </div>
    );
  }
  