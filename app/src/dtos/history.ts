export type HistoryDto = {
  id: string
  name: string
  group: string
  hour: string
  created_at: string
}

export type HistoryByDayDto = {
  data: HistoryDto[]
  title: string
}
