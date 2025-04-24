import { fabric } from "fabric";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import PdfReader from "../PdfReader";
import getCursor from "./cursors";
import DeleteIcon from "./images/delete.svg";
import EllipseIcon from "./images/ellipse.svg";
import EraserIcon from "./images/eraser.svg";
import LineIcon from "./images/line.svg";
import PencilIcon from "./images/pencil.svg";
import RectangleIcon from "./images/rectangle.svg";
import SelectIcon from "./images/select.svg";
import TextIcon from "./images/text.svg";
import TriangleIcon from "./images/triangle.svg";

import { handleFullscreen } from "@/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./eraserBrush";

const CreateFormula = dynamic(
  () => {
    return import("../CreateFormula");
  },
  { ssr: false }
);

import { useLocale, useTranslations } from "next-intl";
import { LoadingSnipper } from "@/components/LoadingSnipper";

export type TEventCallback<T = any> = (options: T) => any;

let drawInstance: any = null;
let origX: number;
let origY: number;
let mouseDown = false;

const options = {
  currentMode: "",
  currentColor: "#000000",
  currentWidth: 5,
  fill: false,
  group: {},
};

const modes = {
  RECTANGLE: "RECTANGLE",
  TRIANGLE: "TRIANGLE",
  ELLIPSE: "ELLIPSE",
  LINE: "LINE",
  PENCIL: "PENCIL",
  ERASER: "ERASER",
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  PDF: "PDF",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initCanvas = (
  canvasEl: string | HTMLCanvasElement | null,
  width: number,
  height: number
) => {
  const canvas = new fabric.Canvas(canvasEl, { height, width });
  canvas.setBackgroundColor("white", canvas.renderAll.bind(canvas));
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerStyle = "circle";
  fabric.Object.prototype.borderColor = "#4447A9";
  fabric.Object.prototype.cornerColor = "#4447A9";
  fabric.Object.prototype.cornerSize = 6;
  fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.borderDashArray = [5, 5];

  let scrollPosition = { top: 0, left: 0 };

  const saveScrollPosition = () => {
    scrollPosition = {
      top: window.scrollY,
      left: window.scrollX,
    };
  };

  const restoreScrollPosition = () => {
    window.scrollTo(scrollPosition.left, scrollPosition.top);
  };

  canvas.on("object:added", (e) => {
    e.target?.on("mousedown", (event) => {
      saveScrollPosition();
      removeObject(canvas)(event);
    });
    e.target?.on("mouseup", () => {
      if (options.currentMode === modes.ERASER) {
        restoreScrollPosition();
      }
    });
  });

  canvas.on("path:created", (e) => {
    e.target?.on("mousedown", (event) => {
      saveScrollPosition();
      removeObject(canvas)(event);
    });
  });

  return canvas;
};

function removeObject(canvas: fabric.Canvas) {
  return (e: fabric.IEvent) => {
    if (options.currentMode === modes.ERASER) {
      if ((e.target as fabric.IText)?.isEditing) {
        // alert("Không thể xóa văn bản khi đang chỉnh sửa");
        return;
      }
      canvas.remove(e.target as fabric.Object);
    }
  };
}

function stopDrawing() {
  mouseDown = false;
}

function removeCanvasListener(canvas: fabric.Canvas) {
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
}

/*  ==== line  ==== */
function createLine(canvas: fabric.Canvas) {
  if (options.currentMode !== modes.LINE) {
    options.currentMode = modes.LINE;

    removeCanvasListener(canvas);
    canvas.on("mouse:down", startAddLine(canvas));
    canvas.on("mouse:move", startDrawingLine(canvas));
    canvas.on("mouse:up", stopDrawing);

    canvas.selection = false;
    canvas.hoverCursor = "auto";
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function startAddLine(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    mouseDown = true;

    let pointer = canvas.getPointer(e);
    drawInstance = new fabric.Line(
      [pointer.x, pointer.y, pointer.x, pointer.y],
      {
        strokeWidth: options.currentWidth,
        stroke: options.currentColor,
        selectable: false,
      }
    );

    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      drawInstance.setCoords();
      canvas.requestRenderAll();
    }
  };
}

/* ==== rectangle ==== */
function createRect(canvas: fabric.Canvas) {
  if (options.currentMode !== modes.RECTANGLE) {
    options.currentMode = modes.RECTANGLE;

    removeCanvasListener(canvas);

    canvas.on("mouse:down", startAddRect(canvas));
    canvas.on("mouse:move", startDrawingRect(canvas));
    canvas.on("mouse:up", stopDrawing);

    canvas.selection = false;
    canvas.hoverCursor = "auto";
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function startAddRect(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;

    drawInstance = new fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : "transparent",
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    canvas.add(drawInstance);

    drawInstance.on("mousedown", (e: fabric.IEvent) => {
      if (options.currentMode === modes.ERASER) {
        canvas.remove(e.target as fabric.Object);
      }
    });
  };
}

function startDrawingRect(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set("left", pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set("top", pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

/* ==== Ellipse ==== */
function createEllipse(canvas: fabric.Canvas) {
  if (options.currentMode !== modes.ELLIPSE) {
    options.currentMode = modes.ELLIPSE;

    removeCanvasListener(canvas);

    canvas.on("mouse:down", startAddEllipse(canvas));
    canvas.on("mouse:move", startDrawingEllipse(canvas));
    canvas.on("mouse:up", stopDrawing);

    canvas.selection = false;
    canvas.hoverCursor = "auto";
    canvas.isDrawingMode = false;
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function startAddEllipse(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Ellipse({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : "transparent",
      left: origX,
      top: origY,
      cornerSize: 7,
      objectCaching: false,
      selectable: false,
    });

    canvas.add(drawInstance);
  };
}

function startDrawingEllipse(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      if (pointer.x < origX) {
        drawInstance.set("left", pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set("top", pointer.y);
      }
      drawInstance.set({
        rx: Math.abs(pointer.x - origX) / 2,
        ry: Math.abs(pointer.y - origY) / 2,
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

/* === triangle === */
function createTriangle(canvas: fabric.Canvas) {
  removeCanvasListener(canvas);

  canvas.on("mouse:down", startAddTriangle(canvas));
  canvas.on("mouse:move", startDrawingTriangle(canvas));
  canvas.on("mouse:up", stopDrawing);

  canvas.selection = false;
  canvas.hoverCursor = "auto";
  canvas.isDrawingMode = false;
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function startAddTriangle(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Triangle({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : "transparent",
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    canvas.add(drawInstance);
  };
}

function startDrawingTriangle(canvas: fabric.Canvas) {
  return ({ e }: { e: Event }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      if (pointer.x < origX) {
        drawInstance.set("left", pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set("top", pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
      });

      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

function createText(canvas: fabric.Canvas) {
  if (options.currentMode !== modes.TEXT) {
    options.currentMode = modes.TEXT;
  }
  removeCanvasListener(canvas);

  canvas.isDrawingMode = false;

  const text = new fabric.Textbox("text", {
    left: 100,
    top: 100,
    fill: options.currentColor,
    editable: true,
  });

  canvas.add(text);
  canvas.renderAll();
}

function createFormula(canvas: fabric.Canvas, linkImg: string) {
  if (options.currentMode !== modes.TEXT) {
    options.currentMode = modes.TEXT;
  }
  removeCanvasListener(canvas);

  canvas.isDrawingMode = false;

  fabric.Image.fromURL(linkImg, function (oImg) {
    canvas.add(oImg);
  });

  canvas.renderAll();
}

function changeToErasingMode(canvas: fabric.Canvas) {
  if (options.currentMode !== modes.ERASER) {
    removeCanvasListener(canvas);

    canvas.isDrawingMode = false;

    options.currentMode = modes.ERASER;
    canvas.hoverCursor = `url(${getCursor({ type: "eraser" })}), default`;
  }
}

function onSelectMode(canvas: fabric.Canvas) {
  options.currentMode = "";
  canvas.isDrawingMode = false;

  removeCanvasListener(canvas);

  canvas.getObjects().map((item) => item.set({ selectable: true }));
  canvas.hoverCursor = "all-scroll";
  canvas.renderAll();
}

// function canvasToJson(canvas: fabric.Canvas) {
//   alert(JSON.stringify(canvas.toJSON()));
// }

function draw(canvas: fabric.Canvas) {
  if (options.currentMode !== modes.PENCIL) {
    removeCanvasListener(canvas);

    options.currentMode = modes.PENCIL;
    // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = options.currentWidth || 1;
    }
    canvas.isDrawingMode = true;
  }
}

function handleResize(callback: ResizeObserverCallback) {
  const resize_ob = new ResizeObserver(callback);

  return resize_ob;
}

function resizeCanvas(canvas: fabric.Canvas, whiteboard: { clientWidth: any }) {
  return () => {
    const ratio = canvas.getWidth() / canvas.getHeight();
    const whiteboardWidth = whiteboard.clientWidth;

    const scale = whiteboardWidth / canvas.getWidth();
    const zoom = canvas.getZoom() * scale;
    canvas.setDimensions({
      width: whiteboardWidth,
      height: whiteboardWidth / ratio,
    });
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

const Whiteboard = ({ aspectRatio = 4 / 3 }) => {
  const locale = useLocale();
  const t = useTranslations("whiteboard");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brushWidth, setBrushWidth] = useState(5);
  const [isFill, setIsFill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileReaderInfo, setFileReaderInfo] = useState<{
    file: File | null;
    totalPages: number | null;
    currentPageNumber: number;
    currentPage: string;
  }>({
    file: null,
    totalPages: null,
    currentPageNumber: 1,
    currentPage: "",
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const uploadPdfRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!canvas && canvasRef.current && whiteboardRef.current) {
      const canvas = initCanvas(
        canvasRef.current,
        whiteboardRef.current.clientWidth,
        whiteboardRef.current.clientWidth / aspectRatio
      );
      setCanvas(canvas);
      handleResize(resizeCanvas(canvas, whiteboardRef.current)).observe(
        whiteboardRef.current
      );
    }
  }, [aspectRatio, canvas]);

  useEffect(() => {
    if (options.currentMode !== modes.PDF) {
      options.currentMode = modes.PDF;
    }

    if (canvas) {
      if (options.currentMode === modes.PDF) {
        const center = canvas.getCenter();
        if (fileReaderInfo.currentPage !== "") {
          fabric.Image.fromURL(fileReaderInfo.currentPage, (img) => {
            if (canvas.height) {
              img.scaleToHeight(canvas.height);
              img.setPositionByOrigin(
                new fabric.Point(center.left, center.top),
                "center",
                "center"
              );
            }

            canvas.add(img);
            setLoading(false);
            options.currentMode = "";
            canvas.isDrawingMode = false;
            removeCanvasListener(canvas);
            setFileReaderInfo({
              ...fileReaderInfo,
              currentPage: "",
            });
            if (uploadPdfRef.current) {
              uploadPdfRef.current.value = "";
            }
          });
        }
      }
    }
  }, [fileReaderInfo.currentPage]);

  function clearCanvas(canvas: fabric.Canvas) {
    canvas.getObjects().forEach((item) => {
      if (item !== canvas.backgroundImage) {
        canvas.remove(item);

        if (uploadImageRef.current) {
          uploadImageRef.current.value = "";
          options.currentMode = "";
        }

        if (uploadPdfRef.current) {
          uploadPdfRef.current.value = "";
          options.currentMode = "";
        }
        if (fileReaderInfo.file?.size) {
          setFileReaderInfo({
            file: [] as any,
            totalPages: null,
            currentPageNumber: 1,
            currentPage: "",
          });
        }
      }
    });
  }

  function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    if (options.currentMode !== modes.IMAGE) {
      options.currentMode = modes.IMAGE;

      const reader = new FileReader();
      const file = e?.target?.files?.[0];

      reader.addEventListener("load", () => {
        return fabric.Image.fromURL(reader.result as string, (img) => {
          img.scaleToHeight(canvas?.height ?? 0);
          canvas?.add(img);
          canvas && removeCanvasListener(canvas);

          if (uploadImageRef.current) {
            uploadImageRef.current.value = "";
          }
        });
      });

      file && reader.readAsDataURL(file);
    }
  }

  function changeCurrentWidth(e: ChangeEvent<HTMLInputElement>) {
    const intValue = parseInt(e.target.value);
    options.currentWidth = intValue;
    if (canvas) canvas.freeDrawingBrush.width = intValue;
    setBrushWidth(() => intValue);
  }

  function changeCurrentColor(e: ChangeEvent<HTMLInputElement>) {
    options.currentColor = e.target.value;
    if (canvas) canvas.freeDrawingBrush.color = e.target.value;
  }

  function changeFill(e: ChangeEvent<HTMLInputElement>) {
    options.fill = e.target.checked;
    setIsFill(() => e.target.checked);
  }

  function onSaveCanvasAsImage() {
    canvasRef.current?.toBlob((blob: Blob | null) => {
      if (blob) saveAs(blob, "image.png");
    });
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert(t("maxFile"));
        return;
      }
      updateFileReaderInfo({
        file,
        currentPageNumber: 1,
      });
    }
  };

  function updateFileReaderInfo(data: SetStateAction<any>) {
    setLoading(true);
    setFileReaderInfo({ ...fileReaderInfo, ...data });
  }

  return (
    <div ref={whiteboardRef} className={"whiteboard bg-white"}>
      <div className="flex w-full justify-start items-center mb-3">
        <p className="text-[#FFA000] text-3xl text-center uppercase font-bold tracking-[0.3em]">
          OlymClass
        </p>
        <div className={"toolbar"}>
          <button type="button" onClick={() => canvas && createLine(canvas)}>
            <Image src={LineIcon} alt="line" />
          </button>
          <button type="button" onClick={() => canvas && createRect(canvas)}>
            <Image src={RectangleIcon} alt="Rectangle" />
          </button>
          <button type="button" onClick={() => canvas && createEllipse(canvas)}>
            <Image src={EllipseIcon} alt="Ellipse" />
          </button>
          <button
            type="button"
            onClick={() => canvas && createTriangle(canvas)}
          >
            <Image src={TriangleIcon} alt="Triangle" />
          </button>
          <button type="button" onClick={() => canvas && draw(canvas)}>
            <Image src={PencilIcon} alt="Pencil" />
          </button>
          <button type="button" onClick={() => canvas && createText(canvas)}>
            <Image src={TextIcon} alt="Text" />
          </button>
          <button type="button" onClick={() => canvas && onSelectMode(canvas)}>
            <Image src={SelectIcon} alt="Selection mode" />
          </button>

          <CreateFormula canvas={canvas} createFormula={createFormula} />
          <button
            type="button"
            onClick={() => canvas && changeToErasingMode(canvas)}
          >
            <Image src={EraserIcon} alt="Eraser" />
          </button>
          <button type="button" onClick={() => canvas && clearCanvas(canvas)}>
            <Image src={DeleteIcon} alt="Delete" />
          </button>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="fill"
              id="fill"
              checked={isFill}
              onChange={changeFill}
              // className="size-4"
            />
            <label htmlFor="fill">{t("fill")}</label>
          </div>
          <div>
            <input
              type="color"
              name="color"
              id="color"
              onChange={changeCurrentColor}
            />
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={brushWidth}
            onChange={changeCurrentWidth}
          />
          <div className={"uploadDropdown"}>
            <input
              ref={uploadImageRef}
              accept="image/*"
              type="file"
              onChange={uploadImage}
            />
            <input
              ref={uploadPdfRef}
              accept=".pdf"
              type="file"
              onChange={onFileChange}
            />
            <button className={"dropdownButton flex items-center"}>
              {loading ? (
                <LoadingSnipper />
              ) : (
                <>
                  +<span className="first-letter:uppercase">{t("upload")}</span>
                </>
              )}
            </button>
            {!loading && (
              <div className={"dropdownContent"}>
                <span onClick={() => uploadImageRef.current?.click()}>
                  {t("image")}
                </span>
                <span onClick={() => uploadPdfRef.current?.click()}>PDF</span>
              </div>
            )}
          </div>
          <button className="flex items-center" onClick={onSaveCanvasAsImage}>
            {t("saveImage")}
          </button>
          <button
            className="flex items-center"
            onClick={() =>
              handleFullscreen(
                whiteboardRef.current?.parentElement as HTMLElement
              )
            }
          >
            {t("fullscreen")}
          </button>
        </div>
      </div>
      <canvas className="w-full" ref={canvasRef} id="canvas" />
      <PdfReader
        fileReaderInfo={fileReaderInfo}
        updateFileReaderInfo={updateFileReaderInfo}
      />
    </div>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
};

export default Whiteboard;
