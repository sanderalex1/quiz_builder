import { Chip } from "@mui/material";
import { QuestionType } from "../types/quiz";
import type { FC } from "react";

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.SingleText]: "Single text",
  [QuestionType.MultipleChoice]: "Multiple choice",
  [QuestionType.TrueFalse]: "True / False",
};

interface QuestionTypeChipProps {
  type: QuestionType;
}

const QuestionTypeChip: FC<QuestionTypeChipProps> = ({ type }) => (
  <Chip label={QUESTION_TYPE_LABELS[type]} color="primary" variant="outlined" />
);

export default QuestionTypeChip;
