"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  fileReaderInfo: {
    file: File | null;
    currentPage: string;
    currentPageNumber: number;
    totalPages: number | null;
  };
  updateFileReaderInfo: (
    fileReaderInfo: Partial<Props["fileReaderInfo"]>
  ) => void;
};

const PDFReader = ({ fileReaderInfo, updateFileReaderInfo }: Props) => {
  const t = useTranslations("whiteboard");
  function onRenderSuccess() {
    const importPDFCanvas = document.querySelector(
      ".import-pdf-page canvas"
    ) as HTMLCanvasElement;
    const pdfAsImageSrc = importPDFCanvas?.toDataURL();

    updateFileReaderInfo({ currentPage: pdfAsImageSrc });
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    updateFileReaderInfo({ totalPages: numPages });
  }

  function changePage(offset: number) {
    updateFileReaderInfo({
      currentPageNumber: fileReaderInfo.currentPageNumber + offset,
    });
  }

  const nextPage = () => changePage(1);
  const previousPage = () => changePage(-1);

  return (
    <div className="pdfReader">
      <div className="fileContainer">
        <Document
          className="document"
          file={fileReaderInfo.file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) =>
            console.log("Loading a document: " + (loaded / total) * 100 + "%")
          }
        >
          <Page
            className="import-pdf-page"
            onRenderSuccess={onRenderSuccess}
            pageNumber={fileReaderInfo.currentPageNumber}
          />
        </Document>
      </div>
      <div className="pageInfo">
        <span>
          {t("page")} {fileReaderInfo.currentPageNumber} {t("of")}{" "}
          {fileReaderInfo.totalPages || "--"}
        </span>
        <button
          type="button"
          disabled={fileReaderInfo.currentPageNumber <= 1}
          onClick={previousPage}
        >
          {t("previous")}
        </button>
        <button
          type="button"
          disabled={
            !!fileReaderInfo.totalPages
              ? fileReaderInfo.currentPageNumber >= fileReaderInfo.totalPages
              : true
          }
          onClick={nextPage}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default PDFReader;
