export function deauthorize(): void {
  localStorage.removeItem('token');
}
