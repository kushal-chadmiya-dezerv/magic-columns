import { extendTheme } from "@chakra-ui/react";
export const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "500",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
      },
    },
  },
});
