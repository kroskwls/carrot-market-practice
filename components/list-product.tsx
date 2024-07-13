import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  photo: string;
  created_at: Date;
}

export default function ListProduct({ id, title, price, photo, created_at }: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5 items-center">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image className="object-cover" fill src={photo} alt={title} />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-neutral-500">{formatToTimeAgo(created_at.toString())}</span>
        <span className="text-lg text-white">{title}</span>
        <span className="text-lg text-white font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}