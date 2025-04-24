import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { symbols } from "@/constants/symbol";
import useModal from "@/hooks/useModal";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import html2canvas from "html2canvas-pro";
import Image from "next/image";
import { MutableRefObject, useMemo, useRef, useState } from "react";
import { addStyles, EditableMathField, MathField } from "react-mathquill";
import Formula from "../WhiteBoard/images/formula.svg";
import { Quicksand } from "next/font/google";
const inter = Quicksand({ subsets: ["vietnamese"] });
addStyles();

type ListSymbolPropsType = {
  mathFieldRef: MutableRefObject<MathField | null>;
  symbols: {
    label: string;
    value: string;
  }[];
};

const ListSymbol = ({ mathFieldRef, symbols }: ListSymbolPropsType) => {
  const handleInsertSymbol = (symbolValue: string) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.write(symbolValue);
      mathFieldRef.current.focus();
    }
  };
  return (
    <div className="shadow-inner bg-white p-[4px] rounded-[6px] overflow-hidden">
      <div className="grid grid-cols-11 gap-2 h-[100px] overflow-y-auto table-wrapper p-[10px]">
        {symbols.map((symbol) => {
          return (
            <MathJax
              key={symbol.label}
              className="cursor-pointer  w-[40px] h-[40px] border bg-primary rounded-[4px] flex justify-center  items-center text-white"
              style={{ display: "flex" }}
              onClick={() => handleInsertSymbol(symbol.value)}
            >
              {symbol.label}
            </MathJax>
          );
        })}
      </div>
    </div>
  );
};

type TabSymbolPropsType = {
  mathFieldRef: MutableRefObject<MathField | null>;
};

const TabSymbol = ({ mathFieldRef }: TabSymbolPropsType) => {
  const tabsContent = useMemo(() => {
    return (
      <>
        <TabsContent value="math">
          <ListSymbol
            mathFieldRef={mathFieldRef}
            symbols={symbols.LIST_SYMBOL_MATH}
          />
        </TabsContent>
        <TabsContent value="chemistry">
          <ListSymbol
            mathFieldRef={mathFieldRef}
            symbols={symbols.LIST_SYMBOL_CHEMISTRY}
          />
        </TabsContent>
        <TabsContent value="Physics">
          <ListSymbol
            mathFieldRef={mathFieldRef}
            symbols={symbols.LIST_SYMBOL_PHYSICS}
          />
        </TabsContent>
      </>
    );
  }, [mathFieldRef]);

  return (
    <div className="mt-[16px]">
      <Tabs defaultValue="math" className="">
        <TabsList>
          <TabsTrigger value="math">Toán học</TabsTrigger>
          <TabsTrigger value="chemistry">Hóa học</TabsTrigger>
          <TabsTrigger value="Physics">Vật lý</TabsTrigger>
        </TabsList>
        {tabsContent}
      </Tabs>
    </div>
  );
};

export default function CreateFormula({
  canvas,
  createFormula,
}: {
  canvas: fabric.Canvas | null;
  createFormula: (canvas: fabric.Canvas, textContent: string) => void;
}) {
  const mathFieldRef = useRef<MathField | null>(null);
  const { isOpen, toggle } = useModal();
  const [latex, setLatex] = useState("");
  const [isLoadingImg, setIsLoadingImg] = useState(false);

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
    },
  };

  const handleRender = (linkImg: string) => {
    if (!linkImg.length) return;

    setIsLoadingImg(true);
    setTimeout(() => {
      const element = document.getElementById("inputImage");
      html2canvas(element as HTMLElement).then((c) => {
        const imgData = c.toDataURL("image/png");
        canvas && createFormula(canvas, imgData);
        setIsLoadingImg(false);
        toggle();
        setLatex("");
      });
    }, 0);
  };

  return (
    <MathJaxContext version={3} config={config}>
      <div>
        <Popover open={isOpen} onOpenChange={toggle}>
          <PopoverTrigger asChild>
            <Button variant={"outline"}>
              <Image
                src={Formula}
                alt="formula"
                className="text-[20px] text-white"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] p-[10px] bg-[#F5F5F5]">
            <div className="text-center">
              <h3 className="font-semibold text-[20px] text-primary">
                Công cụ phương trình
              </h3>

              <div className="mt-3">
                <div className="flex justify-center items-center gap-3">
                  <EditableMathField
                    latex={latex}
                    mathquillDidMount={(mathField) => {
                      mathFieldRef.current = mathField;
                    }}
                    onChange={(mathField) => {
                      setLatex(mathField.latex());
                      mathFieldRef.current = mathField;
                    }}
                    className="w-[100%]  p-[8px] rounded-sm bg-white"
                    style={{
                      boxShadow: "none",
                      outline: "none",
                      border: "none",
                      borderRadius: "6px",
                    }}
                    id="inputImage"
                  />
                  <div>
                    {isLoadingImg ? (
                      <>Loading...</>
                    ) : (
                      <Button onClick={() => handleRender(latex)}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <TabSymbol mathFieldRef={mathFieldRef} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </MathJaxContext>
  );
}
