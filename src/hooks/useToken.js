// import { jwtDecode } from 'jwt-decode';
// import { useState, useEffect } from 'react';

// const decodeToken = (token) => {
//   if (!token) return null;
//   try {
//     const decoded = jwtDecode(token);
//     return {
//       role: decoded?.role || null,
//       sub: decoded?.sub || null,
//       exp: decoded?.exp || null,
//       iat: decoded?.iat || null
//     };
//   } catch (e) {
//     console.error("JWT 디코딩 오류:", e);
//     return null;
//   }
// };

// export default function useToken() {
//   const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
//   const [decodedInfo, setDecodedInfo] = useState(() => {
//     const storedToken = localStorage.getItem('accessToken');
//     return decodeToken(storedToken);
//   });

//   useEffect(() => {
//     if (token) {
//       const info = decodeToken(token);
//       setDecodedInfo(info);
//     } else {
//       setDecodedInfo(null);
//     }
//   }, [token]);

//   const setTokenValue = (newToken) => {
//     localStorage.setItem('accessToken', newToken);
//     setToken(newToken);
//   };

//   const removeToken = () => {
//     localStorage.removeItem('accessToken');
//     setToken(null);
//     setDecodedInfo(null);
//     console.log("removeToken 실행")
//   };

//   return { 
//     token, 
//     role: decodedInfo?.role,
//     setToken: setTokenValue, 
//     removeToken 
//   };
// }

