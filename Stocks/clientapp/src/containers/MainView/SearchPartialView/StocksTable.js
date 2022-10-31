import { useMemo, useState } from "react";
import { useTable, usePagination, useFilters } from "react-table";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { MdAddchart } from "react-icons/md";
import AddStockToWatchlistModal from "./AddStockToWatchlistModal/AddStockToWatchlistModal";

function StocksTable(props) {
  const data = useMemo(() => [...props.stocks], [props.stocks]);

  const [showAddStockToWatchlistModal, setAddStockToWatchlistModal] =
    useState(false);
  const handleShowAddStockToWatchlistModalClose = () =>
    setAddStockToWatchlistModal(false);
  const handleShowAddStockToWatchlistModalOpen = () =>
    setAddStockToWatchlistModal(true);

  const [selectedStock, setSelectedStock] = useState();

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
      { Header: "Currency", accessor: "currency" },
      { Header: "Symbol", accessor: "symbol" },
      { Header: "Yield", accessor: "yield" },
      { Header: "MarketCap", accessor: "marketCap" },
    ],
    []
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "add",
        Cell: ({ row }) => (
          <MDBBtn
            className="btn btn-light"
            onClick={() => {
              handleShowAddStockToWatchlistModalOpen();
              setSelectedStock({ id: row.values.id, name: row.values.name });
            }}
          >
            <MdAddchart size={30} />
          </MDBBtn>
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
      initialState: { pageIndex: 0, hiddenColumns: ["id"] },
      defaultColumn: defaultColumn,
    },
    tableHooks,
    useFilters,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <>
      <AddStockToWatchlistModal
        show={showAddStockToWatchlistModal}
        handleClose={handleShowAddStockToWatchlistModalClose}
        selectedStock={selectedStock}
        watchlists={props.watchlists}
      />
      <MDBContainer>
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    <div className="d-flex justify-content-center">
                      {column.render("Header")}
                    </div>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <MDBContainer className="d-flex flex-row justify-content-between align-items-center pe-0 ps-0">
          {" "}
          <select
            className="form-select w-25 m-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((pageSizeSelection) => (
              <option key={pageSizeSelection} value={pageSizeSelection}>
                Show {pageSizeSelection}
              </option>
            ))}
          </select>
          <MDBContainer className="w-50 m-1 pe-0 ps-0 d-flex justify-content-end">
            <MDBBtn
              className="btn btn-light ms-1 me-1"
              onClick={() => goToPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </MDBBtn>
            <MDBBtn
              className="btn btn-light ms-1 me-1"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {"<"}
            </MDBBtn>
            <MDBBtn
              className="btn btn-light ms-1 me-1"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {">"}
            </MDBBtn>
            <MDBBtn
              className="btn btn-light ms-1 me-1"
              onClick={() => goToPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </MDBBtn>
            <span className="ms-1 me-1">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    </>
  );
}

export default StocksTable;
