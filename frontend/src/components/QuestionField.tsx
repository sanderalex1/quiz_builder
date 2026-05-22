import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Typography,
  FormHelperText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { QuestionType, type CreateQuizInput } from "../types/quiz";
import type { FC } from "react";
import AnswerFields from "./AnswerFields";

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: QuestionType.SingleText, label: "Single text" },
  { value: QuestionType.MultipleChoice, label: "Multiple choice" },
  { value: QuestionType.TrueFalse, label: "True / False" },
];

const TRUE_FALSE_ANSWERS = [
  { text: "True", isCorrect: false },
  { text: "False", isCorrect: false },
];

interface QuestionFieldProps {
  index: number;
  onRemove: () => void;
}

const QuestionField: FC<QuestionFieldProps> = ({ index, onRemove }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateQuizInput>();

  const questionErrors = errors.questions?.[index];

  const handleTypeChange = (
    newType: QuestionType,
    onChange: (v: QuestionType) => void,
  ) => {
    onChange(newType);
    if (newType === QuestionType.TrueFalse) {
      setValue(`questions.${index}.answers`, TRUE_FALSE_ANSWERS);
    } else {
      setValue(`questions.${index}.answers`, [
        { text: "", isCorrect: newType === QuestionType.SingleText },
      ]);
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Question {index + 1}
        </Typography>
        <IconButton color="error" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </Stack>
      <TextField
        required
        label="Question text"
        fullWidth
        error={!!questionErrors?.text}
        helperText={questionErrors?.text?.message}
        {...register(`questions.${index}.text`, {
          required: "Question text is required",
        })}
      />
      <Controller
        name={`questions.${index}.type`}
        control={control}
        rules={{ required: "Question type is required" }}
        render={({ field, fieldState }) => (
          <FormControl required error={!!fieldState.error} sx={{ width: 220 }}>
            <InputLabel>Type</InputLabel>
            <Select
              required
              label="Type"
              {...field}
              onChange={(e) =>
                handleTypeChange(e.target.value as QuestionType, field.onChange)
              }
            >
              {QUESTION_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
      <AnswerFields questionIndex={index} />
      <Divider />
    </Stack>
  );
};

export default QuestionField;
