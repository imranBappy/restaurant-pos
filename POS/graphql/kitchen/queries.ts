import { gql } from "@apollo/client";





export const KITCHEN_QUERY = gql`
query KITCHEN_QUERY($name: String , $isActive: Boolean ,  $first: Int , $offset: Int, $orderBy: String ) {
  kitchens(
    name: $name
    isActive: $isActive
    first: $first
    offset: $offset
    orderBy: $orderBy
  ) {
    totalCount
    edges {
      node {
        id
        name
        photo
        description
        createdAt
        isActive
      }
    }
  }
}

`
export const KITCHEN_ORDER_QUERY = gql`
query MyQuery($orderBy: String, $status: KitchenKitchenOrderStatusChoices, $after: String, $first: Int, $order: String) {
  kitchenOrders(
    orderBy: $orderBy
    status: $status
    after: $after
    first: $first
    order: $order
  ) {
    totalCount
    edges {
      node {
        id
        completionTime
        cookingTime
        createdAt
        kitchen {
          id
          photo
          name
        }
        status
        updatedAt
        order {
          id
          orderId
          user {
            id
            email
            name
          }
        }
        productOrders {
          totalCount
          edges {
            node {
              note
              id
              quantity
              product {
                images
                id
                name
              }
            }
          }
        }
      }
    }
  }
}
`