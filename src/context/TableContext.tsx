import { createContext, useContext, useState, useEffect } from "react";

const TableContext = createContext(null);

export const TableProvider = ({ children }) => {
  const [magicColumns, setMagicColumns] = useState([]);

  // Load columns from localStorage on initial mount
  useEffect(() => {
    const savedColumns = localStorage.getItem("magicColumns");
    if (savedColumns) {
      setMagicColumns(JSON.parse(savedColumns));
    }
  }, []);

  // Save columns to localStorage when they change
  useEffect(() => {
    localStorage.setItem("magicColumns", JSON.stringify(magicColumns));
  }, [magicColumns]);

  return (
    <TableContext.Provider value={{ magicColumns, setMagicColumns }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => useContext(TableContext);
