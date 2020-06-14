import { NumberParam, useQueryParam } from "use-query-params";

import React from "react";
import clampWith from "../utils/clampWith";

export default function usePage({
  initPage = 0,
  countOfPages,
}: {
  initPage?: number;
  countOfPages: number;
}) {
  const [pageParam, setPageParam] = useQueryParam("page", NumberParam);
  const [page, setPage] = React.useState<number>(pageParam ?? initPage);

  const clampPage = clampWith(countOfPages);
  const currentPage = clampPage(page);

  React.useEffect(() => setPageParam(currentPage), [currentPage, setPageParam]);

  React.useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          setPage((prevPage) => clampPage(prevPage - 1));
          break;
        case " ":
        case "ArrowRight":
        case "ArrowDown":
          setPage((prevPage) => clampPage(prevPage + 1));
          break;
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [clampPage, setPage]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const divRect = (event.target as HTMLDivElement).getBoundingClientRect();
      const x = event.clientX - divRect.left;
      if (x < divRect.width * 0.45) {
        setPage((prevPage) => clampPage(prevPage - 1));
      } else if (x >= divRect.width * 0.55) {
        setPage((prevPage) => clampPage(prevPage + 1));
      }
    },
    [clampPage, setPage]
  );
  return { page: currentPage, setPage, onMouseDown };
}
