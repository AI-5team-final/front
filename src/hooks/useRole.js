import { jwtDecode } from 'jwt-decode';

export default function useRole() {
  const token = localStorage.getItem('accessToken');
  const role = token ? jwtDecode(token).roles[0] : 'GUEST';
  return role;
}
