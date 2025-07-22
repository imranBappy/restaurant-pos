import { gql } from "@apollo/client";

export const ORDER_CHANNEL_MUTATION = gql`
mutation Upsert($commissionRate: Decimal!, $id: String,  $name: String!, $type: String!) {
  upsertOrderChannel(
    input: {name: $name, type: $type, commissionRate: $commissionRate, id: $id}
  ) {
    message
    success
  }
}
`;
