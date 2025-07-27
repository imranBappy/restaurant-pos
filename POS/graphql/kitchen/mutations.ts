import { gql } from "@apollo/client";

export const KOT_STATUS_UPDATE = gql`
mutation MyMutation($kotId: ID!, $status: String!) {
    updateKotStatus(kotId: $kotId, status: $status) {
        message
        success
    }
}
`
