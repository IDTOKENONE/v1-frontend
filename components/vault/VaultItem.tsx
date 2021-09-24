import React, { FC, useState } from "react";
import { Box, HStack, Flex, Text, Image } from "@chakra-ui/react";

import { format } from "libs/parse";
import { useVault } from "modules/vault";
import Card from "components/Card";
import SimpleStat from "components/SimpleStat";
import ChartVault from "components/vault/chart/ChartVault";
import DepositModal from "components/vault/DepositModal";
import WithdrawModal from "components/vault/WithdrawModal";
import { useUstPrice } from "hooks/useUstPrice";

type Props = {
  data: any;
};

const VaultItemLine = ({ label, value, asset = "UST" }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      py="2"
      borderBottom="1px solid"
      borderBottomColor="whiteAlpha.300"
      _last={{
        borderBottom: "none",
      }}
    >
      <Text color="#fff">{label}</Text>
      <SimpleStat
        value={value}
        asset={asset}
        fontSizeValue="lg"
        fontSizeAsset="sm"
      />
    </Flex>
  );
};

const VaultItem: FC<Props> = ({ data }) => {
  const { vault, balance, totalBalance } = useVault({
    contract: data.contract,
  });
  const balanceAmount = format(balance, "uusd");
  const totalBalanceAmount = format(totalBalance, "uusd");
  const ustPrice = useUstPrice();

  return (
    <Card
      noPadding
      whileHover={{
        scale: 1.05,
      }}
    >
      <Box bg="rgba(0,0,0,0.2)" p="8" borderBottomRadius="2xl">
        <Flex justify="space-between">
          <HStack spacing="2" mb="4">
            <Image src={data.logo} alt={data.logo} boxSize="1.875rem" />
            <Text color="#fff" fontSize="xl" fontWeight="bold">
              {data.name}
            </Text>
          </HStack>
          <Text color="brand.500" fontSize="2xl" fontWeight="bold">
            {data.name == "UST" ? `$${ustPrice}` : "--"}
          </Text>
        </Flex>
        <ChartVault value={data.name == "UST" ? ustPrice : 0} />
      </Box>
      <Box p="8">
        <Box>
          <VaultItemLine label="APY" value="--" asset="%" />
          <VaultItemLine label="Daily Yield" value="--" asset="%" />
          <VaultItemLine label="Total Deposits" value={totalBalanceAmount} />
          <VaultItemLine label="My Deposit" value={balanceAmount} />
        </Box>
        <HStack mt="6">
          <WithdrawModal vault={vault} />
          <DepositModal token="uusd" vault={vault} />
        </HStack>
      </Box>
    </Card>
  );
};

export default VaultItem;