import ImageAnimate from "@/components/ImageAnimate";
import { ImageType } from "@/types";
import { convertImageUrl } from "@/utils";
import Image from "next/image";

export default function ImagesModal({
  images,
  onChangeImage,
}: {
  images: ImageType[];
  onChangeImage: (image: ImageType) => void;
}) {
  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex justify-center">
        <h3 className="text-2xl p-4 text-primary rounded-sm font-bold">
          Chọn hình đại diện
        </h3>
      </div>
      <div className="flex-1 h-[200px] overflow-auto no-scrollbar">
        <div className="grid grid-cols-6 gap-4">
          {images.map((item: ImageType) => (
            <div key={item.id} onClick={() => onChangeImage(item)}>
              <ImageAnimate size="150" classNames="w-[150px] h-[150px]" src={item.url} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
