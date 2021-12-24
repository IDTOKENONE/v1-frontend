import { getColor } from "@chakra-ui/theme-tools";

const styles = {
  variants: {
    brand: (props: Record<string, any>) => {
      const { theme } = props;

      return {
        border: "1px solid",
        borderColor: "brand.100",
        bg: "inherit",
        color: "brand.500",
        fontWeight: "700",
        _hover: {
          borderColor: "brand.500",
        },
        _invalid: {
          borderColor: "red.500",
          boxShadow: `0 0 0 1px ${getColor(theme, "red.500")}`,
        },
        _focus: {
          zIndex: 1,
          borderColor: "brand.500",
          boxShadow: `0 0 0 1px ${getColor(theme, "brand.500")}`,
        },
      };
    },
  },
};

export default styles;
