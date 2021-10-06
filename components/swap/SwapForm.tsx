import React, { FC, useEffect, useCallback } from "react";
import { Box, Flex, chakra, Button, IconButton } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useSwap } from "@arthuryeti/terraswap";
import numeral from "numeral";

import { DEFAULT_SLIPPAGE } from "constants/constants";
import { toAmount } from "libs/parse";
import useDebounceValue from "hooks/useDebounceValue";

import DoubleArrowsIcon from "components/icons/DoubleArrowsIcon";
import LoadingForm from "components/LoadingForm";
import AmountWithSelectInput from "components/AmountWithSelectInput";
// import SwapFormInfos from "components/swap/SwapFormInfos";

type Inputs = {
  token1: {
    asset: string;
    amount: string;
  };
  token2: {
    asset: string;
    amount: string;
  };
};

const SwapForm: FC = () => {
  const { control, handleSubmit, watch, setValue, formState } = useForm<Inputs>(
    {
      defaultValues: {
        token1: {
          amount: undefined,
          asset: "uluna",
        },
        token2: {
          amount: undefined,
          asset: "uusd",
        },
      },
    }
  );
  const token1 = watch("token1");
  const token2 = watch("token2");

  const debouncedAmount1 = useDebounceValue(token1.amount, 500);

  const reverse = () => {
    setValue("token1", token2);
    setValue("token2", token1);
  };

  const handleSuccess = useCallback(() => {
    // console.log("ouii");
  }, []);

  const handleError = useCallback(() => {
    // console.log("ouii");
  }, []);

  const swapState = useSwap({
    token1: token1.asset,
    token2: token2.asset,
    amount: toAmount(debouncedAmount1),
    slippage: String(DEFAULT_SLIPPAGE),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  useEffect(() => {
    // @ts-expect-error
    if (formState.name == "token1" && token1.amount != null) {
      const newAmount = numeral(token1.amount)
        .divide(swapState.simulated?.price)
        .value()
        .toFixed(6);

      setValue("token2.amount", newAmount);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token1.amount]);

  useEffect(() => {
    // @ts-expect-error
    if (formState.name == "token2" && token2.amount != null) {
      const newAmount = numeral(token2.amount)
        .multiply(swapState.simulated?.price)
        .value()
        .toFixed(6);

      setValue("token1.amount", newAmount);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token2.amount]);

  const submit = async () => {
    swapState.swap();
  };

  if (swapState.isBroadcasting) {
    return <LoadingForm />;
  }

  return (
    <chakra.form onSubmit={handleSubmit(submit)}>
      <Flex flexDir="column" align="center" gridGap="6">
        <Box w="full">
          <Controller
            name="token1"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <AmountWithSelectInput {...field} />}
          />
        </Box>

        <IconButton
          aria-label="Reverse"
          color="brand.500"
          icon={<DoubleArrowsIcon />}
          onClick={reverse}
          _focus={{
            boxShadow: "none",
          }}
          _hover={{
            color: "white",
          }}
          variant="unstyled"
        />

        <Box w="full">
          <Controller
            name="token2"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <AmountWithSelectInput {...field} />}
          />
        </Box>
      </Flex>

      <Box>
        {/* {swapState.error && (
            <Box
              mb="6"
              color="red.500"
              borderColor="red.500"
              borderWidth="1px"
              px="4"
              py="2"
              borderRadius="2xl"
            >
              <Text>{swapState.error}</Text>
            </Box>
          )} */}

        <Flex justify="center" mt="8">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={swapState.isEstimating}
            disabled={!swapState.isReady}
            minW="64"
          >
            Swap
          </Button>
        </Flex>
      </Box>
    </chakra.form>
  );
};

export default SwapForm;