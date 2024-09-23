/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const useScrollHeight = (containerRef, spaceHeight, dependencyArray = []) => {
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const mainContaienrRects = container?.getClientRects()[0]?.height;
      setScrollHeight(mainContaienrRects);
    }
  }, [...dependencyArray]);
  return scrollHeight;
};

export default useScrollHeight;
