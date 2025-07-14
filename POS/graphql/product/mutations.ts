import { gql } from "@apollo/client";

export const PRODUCT_MUTATION = gql`
 mutation MyMutation($category: ID,$clientMutationId: String, $cookingTime: String, $description: String, $id: String, $images: String, $isActive: Boolean, $kitchen: ID, $name: String!, $price: Decimal!, $sku: String!, $subcategory: ID, $tag: String, $video: String, $vat: Float!) {
  productCud(
    input: {price: $price, vat: $vat, category: $category, clientMutationId: $clientMutationId, cookingTime: $cookingTime, description: $description, id: $id, images: $images, isActive: $isActive, kitchen: $kitchen, name: $name, sku: $sku, subcategory: $subcategory, tag: $tag, video: $video}
  ) {
    message
    product {
      id
      kitchen {
        id
        name
      }
      category {
        id
        name
      }
      images
      isActive
      cookingTime
      createdAt
      description
      name
      price
      sku
      subcategory {
        id
        name
      }
      tag
      vat
      video
    }
  }
}
`;


export const CATEGORY_MUTATION = gql`
mutation MyMutation($name: String! , $isActive: Boolean , $image: String , $id: String, $description: String , $parent: ID ) {
  categoryCud(
    input: {name: $name, isActive: $isActive, image: $image, id: $id, description: $description, parent: $parent}
  ) {
    success
    message
    category {
      name
      id
    }
  }
}
`



export const ORDER_CANCEL = gql`
    mutation MyMutation($orderId: ID!) {
        orderCancel(orderId: $orderId) {
            message
            success
        }
    }
`;

export const ORDER_MUTATION_V2 = gql`
    mutation MyMutation2($input: OrderInputType!) {
        orderCuv2(input: $input) {
            message
            success
            order {
                id
                orderId
                finalAmount
                amount
                duePaymentDate
                due
                status
                type
            }
        }
    }
`;
export const ORDER_PRODUCT_MUTATION = gql`
mutation MyMutation($price: Decimal!, $product: ID, $quantity: Int!, $order: ID!, $id: String, $discount: Decimal = 0, $vat: Decimal!) {
  orderProductCud(
    input: {quantity: $quantity, price: $price, product: $product, order: $order, id: $id, discount: $discount, vat: $vat}
  ) {
    success
  }
}
`

export const FLOOR_MUTATION = gql`mutation MyMutation($id: String, $isActive: Boolean = false, $name: String! ) {
  floorCud(input: {id: $id, isActive: $isActive, name: $name}) {
    success
  }
}`

export const FLOOR_TABLE_MUTATION = gql`
  mutation MyMutation($floor: ID!, $id: String, $name: String!, $isActive: Boolean = true) {
  floorTableCud(input: {name: $name, floor: $floor, id: $id, isActive: $isActive}) {
    success
  }
}
`

export const PAYMENT_MUTATION = gql`
mutation MyMutation($amount: Decimal!, $id: String, $order: ID!, $paymentMethod: String!, $remarks: String, $status: String!, $trxId: String!) {
  paymentCud(
    input: {order: $order, amount: $amount, paymentMethod: $paymentMethod, status: $status, id: $id, remarks: $remarks, trxId: $trxId}
  ) {
    success
    message
    payment {
      amount
      createdAt
      id
      paymentMethod
      remarks
      status
      trxId
      order {
        amount
        createdAt
        discountApplied
        due
        finalAmount
        id
        isCart
        orderId
        status
        type
        user {
          id
          email
          name
        }
        outlet {
          id
          email
          name
        }
      }
    }
  }
}
`

export const DELETE_PRODUCT_MUTATION = gql`
mutation MyMutation($id: ID!) {
  deleteProduct(id: $id) {
    message
    success
  }
}
`

export const DELETE_ORDER_PRODUCT = gql`
mutation MyMutation($id: ID!) {
  deleteOrderProduct(id: $id) {
    message
    success
  }
}
`

export const ORDER_TYPE_UPDATE = gql`
mutation MyMutation($id: ID !, $orderType: String!) {
  orderTypeUpdate(id: $id, orderType: $orderType) {
    message
    success
  }
}
`

export const CHECK_INGREDIENT_AVAILABLE = gql`
mutation MyMutation($orderProducts: [OrderProductInput!]!) {
  checkIngredientAvailable(orderProducts: $orderProducts) {
    success
    message
  }
}
`
export const INGREDIENT_MUTATION = gql`
mutation MyMutation($id: String, $item: ID! , $product: ID!, $quantity: Decimal!) {
  ingredientCud(
    input: {product: $product, quantity: $quantity, id: $id, item: $item}
  ) {
    message
    success
  }
}
`;
export const DELETE_INGREDIENT = gql`
mutation MyMutation($id: ID!) {
  deleteIngredient(id: $id) {
    message
    success
  }
}
`