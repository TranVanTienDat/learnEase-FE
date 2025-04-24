"use client";
import { InputWithLabel } from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ImagePopover } from "@/app/workspace/class/_components/ImagePopover";
import useModal from "@/hooks/useModal";
import useGetLibraryImage from "@/queryHooks/class/useGetLibraryImage";
import { FeatureType, IEditEvaluation, IFeature, ImageType } from "@/types";
import { convertImageUrl } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { title } from "process";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Vui lòng nhập tên tiêu chí" }),
    point: z.coerce
      .number({
        message: "Vui nhập điểm lớn hơn 0",
      })
      .int({ message: "Vui lòng nhập số nguyên" })
      .gt(0, { message: "Vui nhập điểm lớn hơn 0" }),
  })
  .required({
    point: true,
  });

function EvaluationModal({
  type,
  onChange,
  initValue,
  isOpen,
  toggle,
  title,
  onRemove,
}: {
  type: FeatureType;
  onChange: (params: { type: FeatureType; value: IFeature }) => void;
  initValue?: IFeature;
  isOpen: boolean;
  toggle: () => void;
  title?: string;
  onRemove?: () => void;
}) {
  const t = useTranslations("evaluation");
  const tCommon = useTranslations("common");
  const { data } = useGetLibraryImage();
  const [imageSelected, setImageSelected] = useState<ImageType | null>(
    initValue?.image || data?.extraPointImages?.payload?.[0] || null
  );

  const formSchema = z
    .object({
      name: z.string().min(1, { message: t("enterCriteriaName") }),
      point: z.coerce
        .number({
          message: t("enterPoints"),
        })
        .int({ message: t("enterInteger") })
        .gt(0, { message: t("enterPoints") }),
    })
    .required({
      point: true,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initValue?.name || "",
      point: initValue?.point ? +initValue?.point : undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    onChange({
      type,
      value: {
        type: type,
        point: values.point.toString(),
        name: values.name,
        image: imageSelected,
      },
    });
    form.reset();
    toggle();
  }

  useEffect(() => {
    let selectedImage = null;

    if (type === FeatureType.EXTRA) {
      selectedImage = data?.extraPointImages?.payload?.[0];
    } else if (type === FeatureType.MINUS) {
      selectedImage = data?.minusPointImages?.payload?.[0];
    }

    setImageSelected(initValue?.image || selectedImage || null);
  }, [initValue, data, type]);

  const images =
    type === FeatureType.EXTRA
      ? data?.extraPointImages?.payload
      : data?.minusPointImages?.payload;

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <div className="relative flex justify-center items-center flex-col h-[140px] border border-[#E7E8EB] group p-4 bg-[#FBFBFB] hover:bg-[#E8F4E6] rounded-xl overflow-hidden border-primary font-bold text-sm gap-2 cursor-pointer">
          <img src="/images/add.svg" alt="icon-add" />
          <p className="text-primary text-center">Thêm phiếu điểm</p>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[852px] !rounded-[20px] p-6 "
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto no-scrollbar">
          <ImagePopover
            image={imageSelected}
            onChangeImage={setImageSelected}
            list={images || []}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <InputWithLabel
                  fieldTitle="Mô tả"
                  nameInSchema="name"
                  className="flex-1"
                  placeholder={t("enterCriteria")}
                />
                <InputWithLabel
                  fieldTitle="Số điểm"
                  nameInSchema="point"
                  className="flex-1"
                  placeholder={t("enterPoints")}
                  type="number"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="flex justify-between mt-10">
                {!!onRemove && (
                  <Button
                    className="rounded-full bg-quaternary px-10 min-w-[180px] border border-[#E7E8EB] font-semibold"
                    type="button"
                    onClick={onRemove}
                  >
                    {t("deleteCriteria")}
                  </Button>
                )}
                <div className="space-x-6 ml-auto">
                  <Button
                    className="rounded-full min-w-[180px] border border-[#E7E8EB] font-semibold"
                    variant="ghost"
                    type="button"
                    onClick={toggle}
                  >
                    {tCommon("back")}
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full min-w-[180px] font-semibold"
                  >
                    {tCommon("save")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EvaluationItem({
  onEdit = () => {},
  ...props
}: { onEdit: () => void } & IFeature) {
  const t = useTranslations(`evaluation`);
  const { name, image, point, type } = props;
  return (
    <div
      className="relative h-[140px] text-sm border border-[#E7E8EB] group p-4 bg-[#FBFBFB] rounded-xl overflow-hidden hover:border-primary font-bold"
      onClick={onEdit}
    >
      <div className="flex items-center flex-col">
        <div className="w-[60px] h-[60px] flex items-center justify-center">
          <Image
            src={convertImageUrl(image?.url)}
            width={60}
            height={60}
            alt="icon"
            className="mx-auto"
          />
        </div>
        <p className="font-bold line-clamp-2  mt-2 text-center ">{name}</p>
        <p
          className={clsx(
            "absolute right-[10px] top-[10px] rounded-full text-white w-[28px] h-[28px] flex items-center justify-center",
            type === FeatureType.EXTRA ? "bg-primary" : "bg-quaternary"
          )}
        >
          {point}
        </p>
      </div>
      <div className="absolute transition-all invisible group-hover:visible top-0 group-hover:opacity-100 cursor-pointer right-0 w-full h-full flex items-center justify-center text-primary flex-col gap-2 bg-[#E8F4E6] m-0 opacity-0 duration-200">
        <img src="/images/edit.svg" alt="icon-edit" />
        <p className="font-bold">{t("edit")}</p>
      </div>
    </div>
  );
}

export default function Evaluations({
  list,
  type = FeatureType.EXTRA,
  onAdd,
  onEdit,
  onRemove,
}: {
  list: IFeature[];
  type?: FeatureType;
  onAdd: (params: { type: FeatureType; value: IFeature }) => void;
  onEdit: (params: IEditEvaluation) => void;
  onRemove: ({ type, index }: { type: FeatureType; index: string }) => void;
}) {
  const t = useTranslations("evaluation");

  const [editingItem, setEditingItem] = useState<
    IFeature & { index: string }
  >();
  const { isOpen: isOpenAdd, toggle: toggleAdd } = useModal();
  const { isOpen: isOpenEdit, toggle: toggleEdit } = useModal();
  const handleEdit = (item: IFeature & { index: string }) => {
    setEditingItem(item);
    toggleEdit();
  };
  const handleSaveEditing = ({
    type,
    value,
  }: {
    type: FeatureType;
    value: IFeature;
  }) => {
    if (editingItem) {
      onEdit({
        type,
        index: editingItem.index,
        value,
      });
    }
  };
  const handleRemove = () => {
    if (editingItem?.index) {
      onRemove({ type, index: editingItem.index });
      toggleEdit();
    }
  };
  return (
    <div className="grid grid-cols-6 gap-8">
      {list?.length > 0 &&
        list.map((item, index) => (
          <EvaluationItem
            key={item.id}
            {...item}
            onEdit={() => handleEdit({ index: index.toString(), ...item })}
          />
        ))}
      <EvaluationModal
        isOpen={isOpenAdd}
        toggle={toggleAdd}
        type={type}
        onChange={onAdd}
        title={`${
          type === FeatureType.EXTRA ? "Phiếu điểm cộng" : "Phiếu điểm trừ"
        }`}
      />
      {editingItem && isOpenEdit && (
        <EvaluationModal
          isOpen={isOpenEdit}
          toggle={toggleEdit}
          type={type}
          onRemove={handleRemove}
          onChange={handleSaveEditing}
          initValue={editingItem}
          title={t("editCriteria")}
        />
      )}
    </div>
  );
}
