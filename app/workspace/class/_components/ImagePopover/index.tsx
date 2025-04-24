import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageType } from "@/types";
import { convertImageUrl } from "@/utils";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export const ImagePopover = ({
  image,
  onChangeImage,
  list,
}: {
  image?: ImageType | null;
  onChangeImage: (image: ImageType) => void;
  list: ImageType[];
}) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <div className="w-[100px] h-[100px] bg-[#E7E8EB] rounded-full flex items-center justify-center mx-auto relative cursor-pointer">
          <Image
            src={convertImageUrl(image?.url)}
            alt=""
            width={60}
            height={60}
          />
          <FontAwesomeIcon
            icon={faCaretDown}
            className="absolute right-1 slide-out-to-top-1/2 text-[#5E6477]"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="rounded-[20px] p-5 w-[420px] h-[180px]">
        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-5 gap-5">
            {list.map((item: ImageType) => (
              <div
                key={item.id}
                className="w-[60px] h-[60px] hover:bg-[#E7E8EB] flex items-center justify-center rounded-lg cursor-pointer"
                onClick={() => {
                  onChangeImage(item);
                }}
              >
                <Image
                  src={convertImageUrl(item.url)}
                  alt=""
                  width={60}
                  height={60}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
