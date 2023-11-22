import Link from "next/link";

export default function Logo() {
  return (
    <Link href={'/'} >
     
      <span className="flex gap-1 font-bold relative text-white text-xl ">
          Brand
        </span>
    </Link>
  );
}