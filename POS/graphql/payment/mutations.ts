import { gql } from "@apollo/client";

export const PAYMENT_METHOD_MUTATION = gql`
mutation MyMutation($type: String!, $name: String! $serviceChargeRate: Decimal!, $id: String) {
  upsertPaymentMethod(
    input: {name: $name, type: $type, serviceChargeRate: $serviceChargeRate, id: $id}
  ) {
    message
    success
  }
}
`;
