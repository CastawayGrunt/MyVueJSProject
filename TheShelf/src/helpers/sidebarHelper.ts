export const toggleSidebar = () => {
  const sidebar = document.getElementById('accordionSidebar')
  if (!sidebar) return

  sidebar.classList.toggle('toggled')
}

export const openSidebar = () => {
  const sidebar = document.getElementById('accordionSidebar')
  if (!sidebar) return

  sidebar.classList.remove('toggled')
}

export const closeSidebar = () => {
  const sidebar = document.getElementById('accordionSidebar')
  if (!sidebar) return

  sidebar.classList.add('toggled')
}

export const setActiveLink = (link: string) => {
  const activeLink = document.getElementById(link)
  if (!activeLink) return

  activeLink.classList.add('active')
}

export const removeActiveLink = (link: string) => {
  const activeLink = document.getElementById(link)
  if (!activeLink) return

  activeLink.classList.remove('active')
}
