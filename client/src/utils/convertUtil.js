import { Color, ProjectCost, ProjectStatus, ProjectType } from "@/enums/enum";

export const convertProjectStatusEnumToText = (status) => {

  switch (status) {
    case ProjectStatus.DOING:
      return "Đang làm"
    case ProjectStatus.END_PENDING_UPDATE:
      return "Đã end - Chờ update"
    case ProjectStatus.END_AIRDROP:
      return "Đã trả Airdrop"
    default: return status
  }

}

export const convertProjectStatusTextToEnum = (statusText) => {

  switch (statusText) {
    case "Đang làm":
      return ProjectStatus.DOING
    case "Đã end - Chờ update":
      return ProjectStatus.END_PENDING_UPDATE
    case "Đã trả Airdrop":
      return ProjectStatus.END_AIRDROP
    default: return statusText
  }

}

export const convertProjectStatusEnumToColorHex = (status) => {

  switch (status) {
    case ProjectStatus.DOING:
      return Color.SUCCESS
    case ProjectStatus.END_PENDING_UPDATE:
      return Color.WARNING
    case ProjectStatus.TGE:
      return Color.PRIMARY
    case ProjectStatus.SNAPSHOT:
      return Color.SECONDARY
    case ProjectStatus.END_AIRDROP:
      return Color.ORANGE
    default: return null
  }

}

export const convertProjectTypeEnumToColorHex = (type) => {

  switch (type) {
    case ProjectType.WEB:
      return Color.ORANGE
    case ProjectType.GALXE:
      return Color.SECONDARY
    case ProjectType.TESTNET:
      return Color.SUCCESS
    case ProjectType.GAME:
      return Color.PRIMARY
    case ProjectType.DEPIN:
      return Color.WARNING
    case ProjectType.RETROACTIVE:
      return Color.BROWN1
    default: return null
  }

}

export const convertProjectCostTypeEnumToColorHex = (costType) => {

  switch (costType) {
    case ProjectCost.FREE:
      return Color.INFO
    case ProjectCost.FEE:
      return Color.ORANGE1
    case ProjectCost.HOLD:
      return Color.BROWN
    default: return null
  }

}

export const convertProjectFilterOtherToColorHex = (other) => {

  switch (other) {
    case 'Cheating':
      return Color.SECONDARY
    case 'Tasks Hàng Ngày':
      return Color.SUCCESS
    default: return null
  }

}
