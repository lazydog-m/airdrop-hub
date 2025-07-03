import { Color, DailyTaskRefresh, ProjectCost, ProjectStatus, ProjectType, TaskStatus, WalletStatus } from "@/enums/enum";

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
    case 'Chưa Làm Hôm Nay':
      return Color.ORANGE
    case 'Cheat':
      return Color.SECONDARY
    case 'Làm Hằng Ngày':
      return Color.SUCCESS
    case 'Làm Mới 7 Giờ Sáng':
      return Color.INFO
    default: return null
  }

}

export const convertWalletStatusEnumToText = (status) => {

  switch (status) {
    case WalletStatus.IN_ACTIVE:
      return 'Đang hoạt động'
    case WalletStatus.UN_ACTIVE:
      return 'Ngừng hoạt động'
    default: return null
  }

}

export const convertWalletStatusEnumToReverse = (status) => {

  switch (status) {
    case WalletStatus.IN_ACTIVE:
      return WalletStatus.UN_ACTIVE
    case WalletStatus.UN_ACTIVE:
      return WalletStatus.IN_ACTIVE
    default: return null
  }

}

export const convertWalletStatusEnumToTextReverse = (status) => {

  switch (status) {
    case WalletStatus.IN_ACTIVE:
      return 'Ngừng hoạt động'
    case WalletStatus.UN_ACTIVE:
      return 'Đang hoạt động'
    default: return null
  }

}

export const convertWalletStatusEnumToColorHex = (status) => {

  switch (status) {
    case WalletStatus.IN_ACTIVE:
      return Color.PRIMARY
    case WalletStatus.UN_ACTIVE:
      return Color.ORANGE
    default: return null
  }

}

export const convertDailyTaskRefreshEnumToText = (type) => {

  switch (type) {
    case DailyTaskRefresh.UNKNOWN:
      return 'Chưa rõ'
    case DailyTaskRefresh.UTC0:
      return 'Vào lúc 7 giờ sáng (00:00 UTC)'
    case DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP:
      return 'Khi hết 24 giờ đếm ngược'
    case DailyTaskRefresh.NEW_TASK:
      return 'Khi có nhiệm vụ mới'
    default: return null
  }

}

export const convertEmailToEmailUsername = (email) => {
  const username = email?.split('@')[0] || null;
  return username;
}

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const convertBitToBoolean = (bit) => {

  switch (bit) {
    case 1:
      return true
    case 0:
      return false
    default: return null
  }

}


export const convertTaskStatusEnumToText = (status) => {

  switch (status) {
    case TaskStatus.TO_DO:
      return "Cần làm"
    case TaskStatus.IN_PROGRESS:
      return "Đang làm"
    case TaskStatus.TO_REVIEW:
      return "Cần xem lại"
    case TaskStatus.COMPLETED:
      return "Đã hoàn thành"
    default: return status
  }

}

export const convertTaskStatusEnumToColorHex = (status) => {

  switch (status) {
    case TaskStatus.TO_DO:
      return Color.WARNING
    case TaskStatus.IN_PROGRESS:
      return Color.PRIMARY
    case TaskStatus.TO_REVIEW:
      return Color.SECONDARY
    case TaskStatus.COMPLETED:
      return Color.SUCCESS
    default: return null
  }

}

export const getMasked = (data) => {
  const masked = "*".repeat(data.length);
  return masked;
}
