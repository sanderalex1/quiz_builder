import { useEffect, type FC } from "react";
import { Alert } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { removeAlert } from "../store/slices/alert";

const AUTO_CLOSE_TIME = 3000;

const Notification: FC = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alert);

  useEffect(() => {
    alerts.forEach((alert) =>
      toast(
        <Alert
          severity={alert.severity}
          variant="outlined"
          sx={{ width: "100%", alignItems: "center" }}
          onClose={() => {
            toast.dismiss(alert.id);
            dispatch(removeAlert({ id: alert.id }));
          }}
        >
          {alert.message}
        </Alert>,
        {
          toastId: alert.id,
          autoClose: AUTO_CLOSE_TIME,
          style: {
            backgroundColor: "white",
            color: "black",
          },
          closeOnClick: false,
          onClose: () => {
            dispatch(removeAlert({ id: alert.id }));
          },
        },
      ),
    );
  }, [alerts, dispatch]);

  return (
    <ToastContainer
      closeButton={false}
      position="top-right"
      autoClose={AUTO_CLOSE_TIME}
      newestOnTop
      hideProgressBar
      theme="dark"
      limit={5}
    />
  );
};

export default Notification;
