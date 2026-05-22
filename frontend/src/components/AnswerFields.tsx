import { useFieldArray, useFormContext, useWatch, Controller } from "react-hook-form";
import {
  Stack,
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { QuestionType, type CreateQuizInput } from "../types/quiz";
import type { FC } from "react";

interface AnswerFieldsProps {
  questionIndex: number;
}

const AnswerFields: FC<AnswerFieldsProps> = ({ questionIndex }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateQuizInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  const questionType = useWatch({ control, name: `questions.${questionIndex}.type` });
  const answers = useWatch({ control, name: `questions.${questionIndex}.answers` });
  const isTrueFalse = questionType === QuestionType.TrueFalse;
  const isSingleText = questionType === QuestionType.SingleText;
  const canAddAnswer = !isTrueFalse && (!isSingleText || fields.length === 0);

  const answerErrors = errors.questions?.[questionIndex]?.answers;

  if (isTrueFalse) {
    const correctIndex = answers?.findIndex((a) => a.isCorrect);
    const correctValue = correctIndex === 0 ? "True" : correctIndex === 1 ? "False" : "";

    return (
      <FormControl>
        <FormLabel>Correct answer</FormLabel>
        <RadioGroup
          value={correctValue}
          onChange={(e) => {
            const isTrue = e.target.value === "True";
            setValue(`questions.${questionIndex}.answers`, [
              { text: "True", isCorrect: isTrue },
              { text: "False", isCorrect: !isTrue },
            ]);
          }}
        >
          <FormControlLabel value="True" control={<Radio />} label="True" />
          <FormControlLabel value="False" control={<Radio />} label="False" />
        </RadioGroup>
      </FormControl>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {isSingleText ? "Answer" : "Answers"}
      </Typography>
      {fields.map((field, aIndex) => (
        <Stack key={field.id} direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <TextField
            required
            label={`Answer ${aIndex + 1}`}
            sx={{ flex: 1 }}
            error={!!answerErrors?.[aIndex]?.text}
            helperText={answerErrors?.[aIndex]?.text?.message}
            {...register(`questions.${questionIndex}.answers.${aIndex}.text`, {
              required: "Answer text is required",
            })}
          />
          {!isSingleText && (
            <Controller
              name={`questions.${questionIndex}.answers.${aIndex}.isCorrect`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="Correct"
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                />
              )}
            />
          )}
          {!isSingleText && (
            <IconButton
              color="error"
              onClick={() => remove(aIndex)}
              aria-label="Remove answer"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      ))}

      {canAddAnswer && (
        <Button
          startIcon={<AddIcon />}
          onClick={() => append({ text: "", isCorrect: false })}
          sx={{ alignSelf: "flex-start" }}
        >
          Add answer
        </Button>
      )}
    </Stack>
  );
};

export default AnswerFields;
