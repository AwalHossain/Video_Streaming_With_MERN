import React, { useEffect, useState } from "react";

import {
  Alert,
  Snackbar,
  Stack
} from "@mui/material";

// routes
import Router from "./routes";

// theme
import ThemeProvider from "./theme";

// components
import { StyledChart } from "./components/chart";
import ScrollToTop from "./components/scroll-to-top";

import { Socket } from 'socket.io-client';
import { useSocket } from "./contexts/SocketContext";

export default function App(): JSX.Element {
  const socket: Socket = useSocket();
  const [wsResponse, setWsResponse] = useState<string | null>(null);

  useEffect(() => {
    console.log("socket connect tolen d", socket.id);
    socket.on("hello", (msg: { title: string; originalname: string }) => {
      console.log("hello", msg);
      setWsResponse(
        `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
      );
    });
  }, [socket]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router />
      <Stack>
        <Snackbar
          open={!!wsResponse}
          autoHideDuration={5000}
          onClose={() => {
            setWsResponse(null);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setWsResponse(null);
            }}
            severity={"success"}
          >
            {wsResponse}
          </Alert>
        </Snackbar>
      </Stack>
    </ThemeProvider>
  );
}
