import SignIn from "@/app/(auth)/_components/SignIn";
import { getSessionToken } from "@/app/actions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

const Banner = async () => {
  const sessionToken = await getSessionToken();
  const t = await getTranslations("homepage");
  return (
    <section className="bg-tertiary pt-[50px]  md:min-h-screen relative pb-[50px]">
      <div className="container">
        <div className="flex items-center text-white justify-around pt-7 md:pt-0">
          <div className="basis-[44%] flex-1 flex flex-col">
            <h1 className="text-4xl md:text-[40px] md:leading-none font-semibold capitalize">
              LeanEase - Học dễ dàng, thành công vững bền
            </h1>
            <p className="mt-4 md:text-xl hidden md:block">
              Khơi nguồn tri thức, mở rộng tương lai <br />
              Chúng tôi không chỉ dạy, chúng tôi nuôi dưỡng tương lai.
            </p>
            {!sessionToken && (
              <SignIn
                variant="link"
                className="mt-10 max-w-[220px] md:max-w-auto p-0"
              >
                <Image
                  src="/images/web_light_rd_SI@4x.png"
                  width={263}
                  height={52}
                  alt="google"
                />
              </SignIn>
            )}
          </div>
          <div className="basis-[46%] md:basic-0">
            <Image
              width={600}
              height={642}
              src="/images/header-pic.svg"
              alt="banner"
              className="animate-rotate-around"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Class = () => {
  const t = useTranslations("homepage");
  const tCommon = useTranslations("common");
  return (
    <section className="pb-[70px] md:pb-[90px] mt-[40px]">
      <div className="container">
        <div className="text-center ">
          <h2
            className="
         text-[#2F327D] text-4xl md:text-[60px] font-semibold capitalize leading-[1.2]
          "
          >
            <span className="text-[#F48C06]">LearnEase</span> là gì
          </h2>
          <p className="text-lg mt-4 text-[#696984]">
            LearnEase là một nền tảng học tập trực tiếp sáng tạo, được thiết kế
            để mang lại trải nghiệm giáo dục dễ tiếp cận, thú vị và linh hoạt
            với lối sống của bạn. Nền tảng cung cấp một loạt các khóa học đa
            dạng, được giảng dạy trực tiếp bởi các chuyên gia trong nhiều lĩnh
            vực khác nhau. Với LearnEase, bạn có thể học trực tiếp, giao lưu với
            các bạn học, và tích lũy những kỹ năng quý giá thông qua các bài
            giảng thực tế và tương tác.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-[40px] mt-[68px] md:justify-center ">
          <div className="w-[500px] h-[300px] relative ">
            <Image
              src="/images/teach.png"
              alt="cloud"
              className="opacity-60"
              width={600}
              height={400}
            />

            <span
              className="absolute top-[50%] right-[50%] z-20
            transform translate-x-[50%] translate-y-[-50%] text-2xl font-extrabold text-black
            "
            >
              Nhiệt huyết - Đổi mới
            </span>
          </div>
          <div className="w-[500px] h-[300px] relative">
            <Image
              src="/images/students.png"
              className="opacity-60"
              alt="cloud"
              width={600}
              height={400}
            />
            <span
              className="absolute top-[50%] right-[50%] z-20
            transform translate-x-[50%] translate-y-[-50%] text-2xl font-extrabold text-black
            "
            >
              Sáng tạo - Tư duy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureIem = ({
  title,
  image,
  list,
}: {
  title: string;
  image: string;
  list: string[];
}) => {
  const t = useTranslations("homepage");
  const tCommon = useTranslations("common");
  return (
    <div className="basis-1/2 flex items-center gap-4 flex-col md:flex-row">
      <div className="relative p-[5px] rounded-full before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:border-2 before:rounded-full before:border-primary before:border-dashed before:animate-dash-rotate w-[120px] h-[120px]">
        <Image
          width={120}
          height={120}
          src={image}
          alt={title}
          className="rounded-full h-full object-cover"
        />
      </div>
      <div className="space-y-3 flex-1">
        <h3 className="text-[30px] font-semibold text-[#2F327D]">
          {tCommon(title)}
        </h3>
        <ul className="space-y-2">
          {list.map((list) => (
            <li
              key={list}
              className="before:w-[10px] before:h-[10px] before:bg-secondary before:rounded-full before:inline-block before:mr-[10px]"
            >
              {t(list)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BubbleHead = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="space-y-4 text-center">
      <div className="w-9 h-9 relative mx-auto">
        <span className="absolute w-5 h-5 -ml-[10px] left-1/2 top-0 z-10 rounded-full bg-primary" />
        <span className="absolute w-5 h-5 rounded-full bg-secondary right-0 bottom-0" />
        <span className="absolute w-5 h-5 rounded-full bg-quaternary left-0 bottom-0 z-20" />
      </div>
      <h2 className="text-4xl md:text-[60px] font-semibold capitalize leading-[1.2] text-[#F48C06]">
        {title}
      </h2>
      <p className="text-lg text-[#2F327D]">{content}</p>
    </div>
  );
};

const features01 = [
  {
    title: "attendance",
    image: "/images/feature-thumb01.jpg",
    list: ["desKeyFeature12", "desKeyFeature11", "desKeyFeature13"],
  },
  {
    title: "accumulatePoints",
    image: "/images/feature-thumb02.jpg",
    list: ["desKeyFeature21", "desKeyFeature22", "desKeyFeature23"],
  },
];
const features02 = [
  {
    title: "statistical",
    image: "/images/feature-thumb03.jpg",
    list: ["desKeyFeature31", "desKeyFeature32", "desKeyFeature33"],
  },
  {
    title: "feedback",
    image: "/images/feature-thumb04.jpg",
    list: ["desKeyFeature41", "desKeyFeature42", "desKeyFeature43"],
  },
];

const Features = () => {
  const t = useTranslations("homepage");
  return (
    <section className="py-[30px] md:py-[90px]">
      <div className="container">
        <div className="space-y-10">
          <BubbleHead title={t("keyFeatures")} content={t("desKeyFeatures")} />
          <div className="flex gap-8 md:gap-x-0 lg:gap-x-8 items-center flex-wrap lg:flex-nowrap">
            <div className="space-y-12 lg:flex-1 basis-full md:basis-1/2 lg:basis-auto text-center md:text-left">
              {features01.map((item) => (
                <FeatureIem key={item.title} {...item} />
              ))}
            </div>
            <div className="basis-full lg:basis-auto -order-1 lg:-order-none">
              <Image
                src="/images/feature-thumb05.png"
                width={382}
                height={442}
                alt="fe-1-5"
                className="w-full lg:w-[380px]"
              />
            </div>
            <div className="space-y-12 lg:flex-1 basis-full md:basis-1/2 lg:basis-auto text-center md:text-left">
              {features02.map((item) => (
                <FeatureIem key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ForWhoItem = ({
  title,
  image,
  content,
}: {
  title: string;
  image: string;
  content: string[];
}) => {
  const t = useTranslations("homepage");
  return (
    <div className="space-y-3 text-center px-8 relative md:basis-1/2 lg:basis-1/4 ">
      <div className="flex items-center justify-center h-[220px] mx-auto ">
        <span
          className="absolute w-[calc(100%_+_10px)] h-[460px] border-[36px] top-[60px] rounded-full border-[#2e3899]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 40%)" }}
        />
        <Image
          className="relative z-10 h-full w-auto object-contain"
          src={image}
          width={200}
          height={200}
          alt="icon"
        />
      </div>
      <h3 className="text-2xl font-semibold  ">{t(title)}</h3>
      <ul className="list-disc">
        {content.map((item) => (
          <li key={item} className="leading-7 text-start ">
            {t(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const forwhos = [
  {
    title: "forTeacher",
    image: "/images/choose-1-01.png",
    content: ["desForTeacher1", "desForTeacher2", "desForTeacher3"],
  },
  {
    title: "forEnglishClass",
    image: "/images/choose-1-02.png",
    content: ["desForEnglishClass1"],
  },
  {
    title: "forExtracurricularClass",
    image: "/images/choose-1-03.png",
    content: ["desForExtracurricularClass1", "desForExtracurricularClass2"],
  },
  {
    title: "forChildrenGroup",
    image: "/images/choose-1-04.png",
    content: ["desForChildrenGroup1", "desForChildrenGroup2"],
  },
];

const ForWho = () => {
  const t = useTranslations("homepage");

  return (
    <section>
      <div className="bg-white pb-[50px]">
        <div className="container">
          <div className="md:flex space-y-4 md:space-y-0 text-center md:text-left items-start">
            <div className="space-y-2 basis-5/12">
              <h2 className="text-4xl md:text-[40px] font-semibold capitalize leading-[1.2] text-[#F48C06]">
                {t("olymclassForWho")}
              </h2>
            </div>
            <div className="flex-1">
              <p className="md:text-lg text-[#2F327D]">{t("des1OlymClas")}</p>
            </div>
          </div>
          <div className="flex mt-16 flex-col md:flex-row gap-y-8 lg:gap-y-0 md:flex-wrap">
            {forwhos.map((item) => (
              <ForWhoItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Response = () => {
  return (
    <section>
      <div className="bg-white pb-[50px] ">
        <div className="container ">
          <div className="flex  items-center md:justify-between flex-col md:flex-row">
            <div className="flex-1">
              <h2 className=" text-2xl md:text-[40px] font-semibold capitalize leading-[1.2] text-[#2F327D]">
                Mọi hoạt động trong lớp học,
                <span className="text-[#F48C06]">
                  bạn đều có thể trải nghiệm tại LearnEase
                </span>
              </h2>
              <p className="mt-4 md:text-lg">
                Với LearnEase, lớp học trực tiếp được nâng tầm, mang đến những
                tương tác sống động như trong lớp học thực tế. Bạn sẽ giao tiếp
                trực tiếp với các giảng viên chuyên gia, tham gia thảo luận cùng
                bạn học, thực hiện các dự án thực tế và có lộ trình học tập được
                cá nhân hóa.
              </p>
            </div>

            <div className="flex-1 lg:w-[380px] relative">
              <img
                src="/images/confident.png"
                alt="fe-1-5"
                className="w-full h-auto relative z-10"
              />

              <span className="w-[100px] h-[100px] bg-[#F48C06] right-[50px] bottom-[50px] absolute rounded-lg"></span>
              <span className="w-[100px] h-[100px] bg-[#2F327D] left-[50px] top-[50px] absolute rounded-lg"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <main>
        <Header />
        <Banner />
        <Class />
        <ForWho />
        <Response />
        <Footer />
      </main>
    </>
  );
}
