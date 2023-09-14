import Header from "./Components/Navbar/Header";
import { ThemeProvider, useTheme } from "@mui/material";
import AppRoutes from "./Components/General/Routes";
import ContextProvider from "./Components/General/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "./Components/SpecialButtons/Loading";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Loading />}>
            <Header />
            <AppRoutes />
            {/* <ReactQueryDevtools initialIsOpen/> */}
          </Suspense>
        </QueryClientProvider>
      </ContextProvider>
    </ThemeProvider>
  );
}
export default App;
