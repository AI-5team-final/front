import useToken from './useToken';

export default function useRole() {
  const { getRole } = useToken();
  return getRole();
}
