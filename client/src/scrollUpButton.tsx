import { useEffect, useState } from "react";
import { RxArrowUp } from "react-icons/rx";
export const ScrollUpButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      toggleVisible();
    });
  }, []);

  /**
   * When user is down enough in the page, makes the scroll to top button appear.
   */
  const toggleVisible = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  /**
   * On click, go to the top of the page.
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="scroll_up__button" onClick={scrollToTop}>
      <RxArrowUp className="scroll_up__button__icon" />
      <style>
        {`
        .scroll_up__button { display : ${visible ? "flex" : "none"} };
        `}{" "}
      </style>
    </div>
  );
};

