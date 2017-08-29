import React from "react";
import { KaTeXInput } from "./utilities";

const TestSolveForm = () => {
  return (
    <div>
      <KaTeXInput type="textarea" label="Solution" includeSubmit={true} />
    </div>
  );
};

export default TestSolveForm;
