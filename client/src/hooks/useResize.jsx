import React from "react";

const contentWrapStyle = {
  overflow: "hidden",
  position: "relative",
  height: "100%",
  width: "100%",
  maxWidth: "calc(100vh * (16 / 9))",
  margin: "0 auto",
};

const useResize = (ref) => {
  const [contentResizeStyle, setContentResizeStyle] = React.useState({
    overflow: "visible",
    width: "100%",
    maxWidth: "calc(100vh * (16 / 9))",
    height: "100%",
    position: "relative",
    top: "0",
    left: "0",
    transform: "scale(1)",
    transformOrigin: "0% 0% 0",
  });

  const resize = () => {
    const { clientWidth: elWidth, clientHeight: elHeight } = ref.current;
    // console.log(" ref.current :: ", ref.current);
    // console.log(" elWidth :: ", elWidth);
    // console.log(" elHeight :: ", elHeight);
    // console.log("windowinnerWidth", window.innerWidth);
    // console.log("windowInnerHeight", window.innerHeight);
    const imgWidth = 1920;
    const imgHeight = 1080;
    const widthRatio = elWidth / imgWidth;
    const heightRatio = elHeight / imgHeight;
    const ratio = widthRatio < heightRatio ? widthRatio : heightRatio;
    const left = Math.max(0, (elWidth - 1920 * ratio) / 2);
    const top = Math.max(0, (elHeight - 1080 * ratio) / 2);
    setContentResizeStyle((prev) => {
      return {
        ...prev,
        transform: ratio ? `scale(${ratio})` : "scale(1)",
        top: top || 0,
        left: left || 0,
      };
    });
  };

  React.useLayoutEffect(() => {
    if (ref.current) {
      window.addEventListener("resize", resize);
      resize();
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [ref]);

  return { contentWrapStyle, contentResizeStyle };
};

export default useResize;
