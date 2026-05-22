import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { quizApi } from "../../services/endpoints/quiz";

export type AlertSeverity = "success" | "error";

export interface AlertState {
  id: string;
  message: string;
  severity: AlertSeverity;
}

const alertSlice = createSlice({
  name: "alert",
  initialState: [] as AlertState[],
  reducers: {
    removeAlert: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((notification) => notification.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(quizApi.endpoints.createQuiz.matchFulfilled, (state) => {
        state.push({
          id: crypto.randomUUID(),
          message: "Quiz created successfully",
          severity: "success",
        });
      })
      .addMatcher(quizApi.endpoints.createQuiz.matchRejected, (state) => {
        state.push({
          id: crypto.randomUUID(),
          message: "Failed to create quiz",
          severity: "error",
        });
      })
      .addMatcher(quizApi.endpoints.deleteQuiz.matchFulfilled, (state) => {
        state.push({
          id: crypto.randomUUID(),
          message: "Quiz deleted successfully",
          severity: "success",
        });
      })
      .addMatcher(quizApi.endpoints.deleteQuiz.matchRejected, (state) => {
        state.push({
          id: crypto.randomUUID(),
          message: "Failed to delete quiz",
          severity: "error",
        });
      });
  },
});

export const { removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
