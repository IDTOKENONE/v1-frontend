import React, { FC } from "react";
import { Box, Heading, HStack, Text, chakra } from "@chakra-ui/react";
import Link from "next/link";
import dayjs from "dayjs";

import { truncate } from "libs/text";
import { Poll } from "types/poll";
import { usePoll } from "modules/govern";

import Card from "components/Card";
import PollBadge from "components/gov/PollBadge";
import PollProgress from "components/gov/PollProgress";
import CalendarIcon from "components/icons/CalendarIcon";

type Props = {
  poll: Poll;
};

const PollItem: FC<Props> = ({ poll }) => {
  const { id, title, creator, end_time, status } = poll;
  const details = usePoll(id);
  const formattedEndTime = dayjs.unix(end_time).format("LLL z");

  return (
    <Link href={`/gov/poll/${id}`} passHref>
      <chakra.a
        transition="0.2s all"
        display="block"
        borderRadius="2xl"
        overflow="hidden"
        border="2px solid transparent"
        borderColor="whiteAlpha.200"
        _hover={{ borderColor: "brand.500" }}
      >
        <Card>
          <Box>
            <Text mb="4">#{id}</Text>
            <Text color="brand.500" textTransform="capitalize" mb="1">
              {status.replace("_", " ")}
            </Text>
            <Heading size="md" isTruncated>
              {title}
            </Heading>
          </Box>
          <Box my="4">
            <PollProgress
              vote={details?.vote}
              baseline={details?.baseline}
              status={status}
            />
          </Box>
          <HStack spacing="2">
            <Text variant="light" lineHeight="1">
              End time:{" "}
              <Text as="span" color="brand.500" fontWeight="bold">
                {formattedEndTime}
              </Text>
            </Text>
          </HStack>
        </Card>
      </chakra.a>
    </Link>
  );
};

export default PollItem;