import { Footer, Navbar } from "@/components/Index";
import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "./globals.css";
import { theme } from "../theme";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Direct Transport Solution",
  description: "Direct Transport Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/logo.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Navbar />
          <section style={{ minHeight: "70vh" }}>{children}</section>
          <Footer />
          <ToastContainer />
          <NextTopLoader color="#fff" />
        </MantineProvider>
      </body>
    </html>
  );
}