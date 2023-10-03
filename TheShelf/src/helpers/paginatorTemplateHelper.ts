const paginatorTemplates = {
  '425px': 'PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown',
  '768px':
    'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
  default:
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
}

export const setPaginatorTemplate = (width: number) => {
  if (width <= 425) {
    return paginatorTemplates['425px']
  } else if (width <= 768) {
    return paginatorTemplates['768px']
  } else {
    return paginatorTemplates.default
  }
}
