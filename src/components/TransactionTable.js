import TableData from "module/TableData";
import React from "react";

const TransactionTable = ({
  columns,
  isList,
  txHistorys,
  historyLimit,
  lastElementRef,
  txReceipt,
}) => {
  return (
    <>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isList && txHistorys.length > 0 ? (
          txHistorys.map((tx, idx) => {
            if (idx === historyLimit) {
              return (
                <TableData
                  txReceipt={tx}
                  key={idx}
                  idx={idx}
                  lastElementRef={lastElementRef}
                />
              );
            } else {
              return <TableData txReceipt={tx} key={idx} idx={idx} />;
            }
          })
        ) : (
          <TableData txReceipt={txReceipt} />
        )}
      </tbody>
    </>
  );
};
export default TransactionTable;
