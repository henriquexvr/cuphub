export function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso))
}
