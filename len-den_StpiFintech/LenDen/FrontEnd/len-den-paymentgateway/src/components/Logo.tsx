import Image from "next/image"

export function Logo() {
  return <div className="inline-flex gap-4 items-center">
    {/* <Image src="/logonew.png" height={50} width={50} alt="" /> */}
    <h2 className="text-primary-foregroundxl font-bold">Len-Den PG</h2>
  </div>
}