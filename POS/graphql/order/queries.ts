import { gql } from "@apollo/client";

export const ORDER_CHANNEL_QUERY = gql`
query MyQuery($id: ID!) {
  orderChannel(id: $id) {
    commissionRate
    createdAt
    id
    isActive
    name
    type
    updatedAt
  }
}
`;
export const ORDER_CHANNELS_QUERY = gql`
query MyQuery($after: String, $before: String, $commissionRate: Decimal, $first: Int, $isActive: Boolean, $name: String , $offset: Int, $orderBy: String , $type: ProductOrderChannelTypeChoices) {
  orderChannels(
    after: $after
    before: $before
    commissionRate: $commissionRate
    first: $first
    isActive: $isActive
    name: $name
    offset: $offset
    orderBy: $orderBy
    type: $type
  ) {
    totalCount
    edges {
      node{
          commissionRate
          createdAt
          id
          isActive
          name
          type
          updatedAt
      }
    }
  }
}
`;