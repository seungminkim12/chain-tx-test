import React from "react";
import "./TokensTable.css";

const TokensTable = ({ columns, tokenList }) => {
  return (
    <>
      <thead>
        <tr className="token-table-head-row">
          {columns.map((column) => (
            <th className="token-table-head" key={column}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tokenList.map((token) => {
          return (
            <tr className="token-table-row">
              <td className="token-table-data">
                <img className="token-icon-image" src={token.image} alt="" />
              </td>
              <td className="token-table-data">{token.name}</td>
              <td className="token-table-data">{token.unit}</td>
              <td className="token-table-data">{token.contract_address}</td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
};

export default TokensTable;
