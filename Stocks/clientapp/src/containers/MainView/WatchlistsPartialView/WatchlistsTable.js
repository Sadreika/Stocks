import { useMemo, useState } from "react";
import { useTable, usePagination, useFilters } from "react-table";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import RemoveStockFromWatchlistModal from "./RemoveStockFromWatchlistModal/RemoveStockFromWatchlistModal";
import { GoDiffRemoved } from "react-icons/go";

function WatchlistsTable(props) {
  const [selectedStock, setSelectedStock] = useState();

  const [
    showRemoveStockFromWatchlistModal,
    setShowRemoveStockFromWatchlistModal,
  ] = useState(false);
  const handleShowRemoveStockFromWatchlistModalClose = () =>
    setShowRemoveStockFromWatchlistModal(false);
  const handleShowRemoveStockFromWatchlistModalOpen = () =>
    setShowRemoveStockFromWatchlistModal(true);

  const data = useMemo(
    () => [...props.watchListStocks],
    [props.watchListStocks]
  );

  const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
    return (
      <MDBInput
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        type="text"
      />
    );
  };

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Price", accessor: "price" },
    ],
    []
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "remove",
        Cell: ({ row }) => (
          <MDBBtn
            className="btn btn-light"
            onClick={() => {
              handleShowRemoveStockFromWatchlistModalOpen();
              setSelectedStock({ id: row.values.id, name: row.values.name });
            }}
          >
            <GoDiffRemoved />
          </MDBBtn>
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["id"],
      },
      defaultColumn: defaultColumn,
    },
    tableHooks,
    useFilters,
    usePagination
  );

  const { getTableProps, getTableBodyProps, prepareRow, page } = tableInstance;

  return (
    <>
      <RemoveStockFromWatchlistModal
        show={showRemoveStockFromWatchlistModal}
        handleClose={handleShowRemoveStockFromWatchlistModalClose}
        selectedStock={selectedStock}
        selectedWatchlist={props.selectedWatchlist}
        getWatchListStocks={props.getWatchListStocks}
      />
      <MDBContainer className="p-1 pt-3">
        <table {...getTableProps()} className="table">
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td className="p-2" {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </MDBContainer>
    </>
  );
}

export default WatchlistsTable;
