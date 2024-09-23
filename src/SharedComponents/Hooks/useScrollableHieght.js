/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const useScrollableHeight = (
  containerRef,
  spaceHeight,
  dependencyArray = []
) => {
  const [scrollableHeight, setScrollableHeight] = useState("");

  useEffect(() => {
    const mainContainer = containerRef.current;

    if (mainContainer) {
      const mainContainerClientTop = mainContainer?.getClientRects()[0]?.top;
      const h = `calc(100vh - ${mainContainerClientTop + spaceHeight}px)`;
      setScrollableHeight(h);
    }
  }, dependencyArray);

  return scrollableHeight;
};

export default useScrollableHeight;
