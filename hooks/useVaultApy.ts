import { useMemo } from "react";
import { request, gql } from "graphql-request";
import { useQuery } from "react-query";

import { GRAPHQL_URL } from "constants/constants";

const query = gql`
  query {
    vault{
      apy
    }
  }
`;

export const useVaultApy = () => {
  const { data } = useQuery("vaultApr", () => {
    return request(GRAPHQL_URL, query);
  });

  const {apy, apr} =  useMemo(() => {
    if (data == null || data.vault == null) {
      return "0";
    }

    return data.vault
  }, [data]);

  return [apy, apr]
};

export default useVaultApy;
