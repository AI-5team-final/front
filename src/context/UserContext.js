import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    const updateCredit = (newCredit) => {
        setUserInfo((prev) => ({
            ...prev,
            credit: newCredit
        }));
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, updateCredit }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
