export const toggleSidebar = () => {
  const sidebar = document.getElementById('accordionSidebar')
  if (!sidebar) return

  sidebar.classList.toggle('toggled')
}
