import { CssBaseline, ZeitProvider } from "@zeit-ui/react";

import { QueryParamProvider } from "use-query-params";
import React from "react";
import SlideDiffLoaded from "./models/slideDiffLoaded";
import SlideLoadScreen from "./screens/SlideLoadScreen";
import SlidePageScreen from "./screens/SlidePageScreen";

export default function App() {
  const [loaded, setLoaded] = React.useState<SlideDiffLoaded | null>(null);

  return (
    <ZeitProvider>
      <CssBaseline />
      <QueryParamProvider>
        {loaded === null ? (
          <SlideLoadScreen onLoaded={setLoaded} />
        ) : (
          <SlidePageScreen {...loaded} />
        )}
      </QueryParamProvider>
    </ZeitProvider>
  );
}
