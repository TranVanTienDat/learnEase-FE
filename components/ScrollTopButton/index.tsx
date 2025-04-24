"use client";
import { Button } from "@/components/ui/button";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useState } from "react";

const ScrollTopButton = () => {
  const handleScrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      className={clsx(
        "fixed text-xl right-10 w-[60px] h-[60px] border-4 rounded-full border-white bg-secondary transition-all duration-400 ease-in-out",
        showButton ? "opacity-100 bottom-10 z-10" : "opacity-0 bottom-[400px] -z-10 "
      )}
      onClick={handleScrollToTop}
    >
      <FontAwesomeIcon color="#fff" icon={faArrowUp} />
    </Button>
  );
};

export default ScrollTopButton;
