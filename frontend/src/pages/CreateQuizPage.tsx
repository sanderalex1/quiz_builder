import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router";
import { Box, Grid, Typography, TextField, Button, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateQuizMutation } from "../services/endpoints";
import QuestionField from "../components/QuestionField";
import { QuestionType, type CreateQuizInput } from "../types/quiz";

const defaultQuestion = () => ({
  text: "",
  type: QuestionType.SingleText,
  answers: [{ text: "", isCorrect: true }],
});

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [createQuiz, { isLoading, error }] = useCreateQuizMutation();

  const methods = useForm<CreateQuizInput>({
    defaultValues: {
      title: "",
      description: "",
      questions: [defaultQuestion()],
    },
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  const onSubmit = async (data: CreateQuizInput) => {
    const payload = {
      ...data,
      description: data.description?.trim() || undefined,
    };
    const quiz = await createQuiz(payload).unwrap();
    console.log(quiz);
    navigate(`/quizzes/${quiz.id}`, { replace: true });
  };

  return (
    <FormProvider {...methods}>
      <Grid
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ py: 4, display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Typography variant="h3">Create Quiz</Typography>
        {error && (
          <Alert severity="error">
            {"data" in error
              ? ((error.data as { error?: string })?.error ?? "Something went wrong")
              : "Something went wrong"}
          </Alert>
        )}
        <TextField
          required
          label="Title"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />
        <TextField
          required
          label="Description"
          fullWidth
          multiline
          minRows={2}
          {...register("description")}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6">Questions</Typography>
          {questionFields.map((field, index) => (
            <QuestionField
              key={field.id}
              index={index}
              onRemove={() => removeQuestion(index)}
            />
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => appendQuestion(defaultQuestion())}
            sx={{ alignSelf: "flex-start" }}
          >
            Add question
          </Button>
        </Box>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading || !isValid}
          sx={{ alignSelf: "flex-start" }}
        >
          {isLoading ? "Creating…" : "Create Quiz"}
        </Button>
      </Grid>
    </FormProvider>
  );
};

export default CreateQuizPage;
