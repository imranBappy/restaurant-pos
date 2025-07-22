import { gql } from "@apollo/client";

export const PAYMENT_METHODS_QUERY = gql`
query MyQuery($type: ProductPaymentMethodTypeChoices, $orderBy: String, $offset: Int, $name: String, $serviceChargeRate: Decimal, $before: String, $after: String, $first: Int) {
  paymentMethods(
    type: $type
    orderBy: $orderBy
    offset: $offset
    name: $name
    serviceChargeRate: $serviceChargeRate
    before: $before
    after: $after
    first: $first
  ) {
    totalCount
    edges {
      node {
        createdAt
        id
        isActive
        name
        serviceChargeRate
        type
      }
    }
  }
}
`;
export const PAYMENT_METHOD_QUERY = gql`
query MyQuery($id: ID!) {
  paymentMethod(id: $id) {
    createdAt
    id
    isActive
    name
    serviceChargeRate
    type
    updatedAt
  }
}
`
