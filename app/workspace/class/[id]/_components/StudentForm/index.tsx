"use client";
import studentRequest, {
  StudentParamsType,
  StudentType,
} from "@/apiRequest/students";
import ImagesModal from "@/app/workspace/class/_components/ImagesModal";
import ImageAnimate from "@/components/ImageAnimate";
import { InputWithLabel } from "@/components/InputWithLabel";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import useGetImages from "@/queryHooks/class/useGetImages";
import { ImageType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ModalChangeAvatar = ({
  avatar,
  onChange,
  images,
}: {
  avatar: ImageType;
  onChange?: any;
  images: Array<ImageType>;
}) => {
  const { isOpen, toggle } = useModal();
  const handleChangeAvatar = (image: ImageType) => {
    onChange(image);
    toggle();
  };
  return (
    <div className="flex gap-20 pr-20">
      <ImageAnimate
        size="200"
        classNames="w-[200px] h-[200px]"
        src={avatar?.url}
      />
      <Button className="rounded-full p-6 text-lg" onClick={toggle}>
        Đổi
      </Button>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ImagesModal onChangeImage={handleChangeAvatar} images={images} />
      </Modal>
    </div>
  );
};
export default function StudentForm({
  classId,
  nameClass,
  student,
  onSubmit: onSubmitForm,
  formSchema,
}: {
  classId: string;
  nameClass: string;
  student?: StudentType;
  onSubmit: (params: StudentParamsType) => Promise<any>;
  formSchema: any;
}) {
  const { data } = useGetImages();
  const images = [
    ...(data?.payload.data.boys || []),
    ...(data?.payload.data.girls || []),
  ];
  const [avatar, setAvatar] = useState<{ id: string; url: string } | undefined>(
    undefined
  );

  const convertValueUndefine = (value: any) => (value ? value : undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: student?.nickname,
      fullName: convertValueUndefine(student?.fullName),
      parentPhone: convertValueUndefine(student?.parentPhone),
      parentName: convertValueUndefine(student?.parentName),
      note: convertValueUndefine(student?.note),
      gender: student?.gender ? "1" : "0",
      birthday: student?.birthday ? new Date(student?.birthday) : undefined,
      code: student?.code ? student?.code : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { birthday, gender, note, code, ...rest } = values;
    const params: StudentParamsType = {
      ...rest,
      class: classId,
      gender: !!+gender,
    };
    if (avatar) params.avatar = { id: avatar.id };
    if (birthday) params.birthday = format(birthday!, "yyyy-MM-dd");
    if (code) params.code = code;
    if (note) params.note = note;
    onSubmitForm(params);
  }

  const { toast } = useToast();
  const router = useRouter()

  const handleRemoveStudent = async () => {
    if (!student) return;
    let text = "Bạn có chắc muốn xóa học sinh này.";
    if (confirm(text) == true) {
      try {
        const res = await studentRequest.deleteStudent(student?.id.toString());
        if (res.status === 200) {
          toast({
            title: "Xóa thành công",
          });
          router.push(`/workspace/class/${classId}`);
          router.refresh();
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Xóa thất bại. Vui lòng thử lại sau",
        });
      }
    }
  };

  useEffect(() => {
    setAvatar(student ? student.avatar : images[0]);
  }, [data]);

  return (
    <>
      <div className="flex gap-10">
        <div className="space-y-2 text-center md:text-left flex-1">
          <p className="text-secondary uppercase font-bold tracking-[0.3em]">
            THÔNG TIN HỌC SINH
          </p>
          <h2 className="text-4xl md:text-[60px] font-semibold capitalize leading-[1.2]">
            HS Mới - Lớp: {nameClass}
          </h2>
        </div>
        {avatar && (
          <ModalChangeAvatar
            avatar={avatar}
            images={images}
            onChange={setAvatar}
          />
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-10">
            <InputWithLabel
              fieldTitle={`Tên gọi ở lớp <span class="text-[#F4673D] mb-1 text-sm">* (John/Mỹ Linh/...)</span>`}
              nameInSchema="nickname"
              className="flex-1"
              placeholder="Tên gọi ở lớp"
            />
            <InputWithLabel
              fieldTitle={`Họ và Tên`}
              nameInSchema="fullName"
              className="flex-1"
              placeholder="Tên đầy đủ"
            />
          </div>
          <div className="flex gap-10">
            <div className="flex-1 space-y-2">
              <Label className="block mb-1 font-medium">
                <p>
                  Ngày sinh{" "}
                  <span className="text-[#F4673D] mb-1 text-sm">
                    (Mẫu: 19/05/2015)
                  </span>
                </p>
              </Label>
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left py-6 text-lg font-medium border-input text-muted-foreground",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>dd/mm/yyyy</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-muted-foreground" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <Label className="block mb-1 font-medium">Giới tính</Label>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-2 text-lg"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="text-lg cursor-pointer">
                            Nam
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormLabel className="text-lg cursor-pointer">
                            Nữ
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-10">
            <InputWithLabel
              fieldTitle={`Tên Bố/Mẹ`}
              nameInSchema="parentName"
              className="flex-1"
              placeholder="Tên Bố/Mẹ "
            />
            <InputWithLabel
              fieldTitle={`Điện thoại Bố/Mẹ`}
              nameInSchema="parentPhone"
              className="flex-1"
              placeholder="Điện thoại Bố/Mẹ"
              type="number"
            />
          </div>
          <div className="flex gap-10">
            <InputWithLabel
              fieldTitle={`Ghi chú`}
              nameInSchema="note"
              className="flex-1"
              placeholder="Ghi chú"
            />
            <InputWithLabel
              fieldTitle={`Mã để xem Điểm và Nhận xét <span class="text-[#F4673D] mb-1 text-sm">(Có thể đổi)</span>`}
              nameInSchema="code"
              className="flex-1"
              placeholder="Mã để xem Điểm và Nhận xét"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="rounded-full p-6 px-10">
              Lưu Thông Tin
            </Button>
            {student && (
              <Button
                type="button"
                className="rounded-full p-6 px-10 ml-auto"
                variant={"destructive"}
                onClick={handleRemoveStudent}
              >
                Xóa học sinh
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
