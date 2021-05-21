import React, { Component } from "react";

const sourceData = [
  {
    tid: 1,
    date: "2020-03-10T10:47:02-05:00",
    credit: 100,
    description: "initial deposit",
  },
  {
    tid: 2,
    check_no: 1,
    date: "2020-03-10T16:50:59Z",
    debit: 3.14,
    description: "gum",
    canceled: true,
  },
  {
    tid: 3,
    check_no: 2,
    date: "2020-03-10T16:49:21-05:00",
    debit: 3.14,
    description: "gum",
  },
  {
    tid: 4,
    date: "2020-03-10T13:00:30-05:00",
    credit: 1.99,
    description: "pocket change",
  },
  {
    tid: 5,
    date: "2020-03-16T09:02:30-05:00",
    credit: 420.15,
    description: "paycheck",
  },
  {
    tid: 6,
    check_no: 3,
    date: "2020-03-16T09:02:30-05:00",
    debit: 19.15,
    description: "ConEd - March",
  },
  {
    tid: 7,
    check_no: 4,
    date: "2020-03-17T11:57:30-05:00",
    debit: 81.45,
    description: "AT&T",
  },
  {
    tid: 8,
    check_no: 5,
    date: "2020-03-17T16:02:30-05:00",
    debit: 29.03,
    description: "Ikea",
  },
  {
    tid: 9,
    date: "2020-03-23T09:02:30-05:00",
    credit: 420.13,
    description: "paycheck",
  },
  {
    tid: 10,
    check_no: 6,
    date: "2020-03-23T10:11:00-05:00",
    debit: 13.57,
    description: "More checks",
  },
  {
    tid: 11,
    check_no: 225,
    date: "2020-03-24T14:20:33-05:00",
    debit: 97.76,
    description: "Strand",
  },
  {
    tid: 12,
    check_no: 226,
    date: "2020-03-24T14:20:33-05:00",
    debit: 513.01,
    description: "Fraud",
    canceled: true,
  },
  {
    tid: 13,
    check_no: 227,
    date: "2020-03-26T19:00:00-05:00",
    debit: 31.01,
    description: "IHOP",
  },
];

const CheckContext = React.createContext({
  entries: [],
  getEntries: async () => {},
  toggleList: (order) => {},
  setCancel: (tid, value) => {},
});

const [DIR_NONE, DIR_ASC, DIR_DESC] = [0, 1, 2];
const sortDirClass = { 1: "sort_asc", 2: "sort_desc", 0: null };
const sorters = {
  ASC: (a, b) => a.date - b.date,
  DESC: (a, b) => b.date - a.date,
};

function CheckProvider(props) {
  const defaultEntries = sourceData.map((item, rid) => ({
    ...item,
    rid,
    date: new Date(Date.parse(item.date)),
    canceled: !!item.canceled,
    balance: 100,
  }));
  const [entries, setEntries] = React.useState(defaultEntries);
  const contextValue = React.useMemo(() => {
    const setCancel = (index, value) => {
      const data = [...entries];
      const item = data[index];
      item.canceled = value;
    };
    const getEntries = (index, value) => {
      let bal = 100;
      for (let i = 1; i < entries.length; i++) {
        if (entries[i].canceled) {
          continue;
        }
        console.log(entries[i].canceled);
        if (entries[i].credit) {
          bal = bal + entries[i].credit;
        }
        if (entries[i].debit) {
          bal = bal - entries[i].debit;
        }
        entries[i].balance = bal.toFixed(2);
      }
      return entries;
    };

    const toggleList = (order) => {
      if (order === "DEFAULT") {
        setEntries(defaultEntries);
        return;
      }
      const newEntries = entries.slice().sort(sorters[order]);
      setEntries(newEntries);
    };

    return {
      entries: getEntries(),
      setCancel,
      toggleList,
      getEntries,
    };
  }, [entries]);
  return (
    <CheckContext.Provider value={contextValue}>
      {props.children}
    </CheckContext.Provider>
  );
}

const formatDefault = (x) => x.toString();

const cmpNoop = () => 0;

const columns = [
  {
    key: "date",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: [],
    label: "Date",
  },
  {
    key: "check_no",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: [],
    label: "No.",
  },
  {
    key: "debit",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: ["currency"],
    label: "Debit",
  },
  {
    key: "credit",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: ["currency"],
    label: "Credit",
  },
  {
    key: "balance",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: ["currency", "balance"],
    label: "Balance",
  },
  {
    key: "description",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: [],
    label: "Description",
  },
  {
    key: "canceled",
    cmp: cmpNoop,
    format: formatDefault,
    classNames: ["canceledColumn"],
    label: "Canceled?",
  },
];

const getBalance = (col) => {
  return col.balance;
};

function HeaderRow() {
  const { toggleList, getEntries } = React.useContext(CheckContext);

  return (
    <tr>
      {columns.map((col) => (
        <th key={col.key} className={col.key}>
          <div className={"middleAlign"}>
            {col.label}
            <i className="material-icons" style={{ visibility: "hidden" }}>
              arrow_drop_down
            </i>
          </div>
        </th>
      ))}
      <th>
        <select
          onChange={(e) => {
            toggleList(e.target.value);
            getEntries();
          }}
        >
          <option value="DEFAULT">DEFAULT</option>
          <option value="ASC">ASCENDING</option>
          <option value="DESC">DESCENDING</option>
        </select>
      </th>
    </tr>
  );
}

function DataRow() {
  const { entries, setCancel } = React.useContext(CheckContext);

  return (
    <>
      {entries.map((col, index) => (
        <tr key={col.tid} className={col.canceled ? "canceled" : null}>
          <td>
            <div>{col.date.toUTCString()}</div>
          </td>
          <td>
            <div>{col.check_no}</div>
          </td>
          <td className="debit">
            <div>{col.debit}</div>
          </td>
          <td className={"credit"}>
            <div>{col.credit}</div>
          </td>
          <td>
            <div>{getBalance(col)}</div>
          </td>
          <td>
            <div>{col.description}</div>
          </td>
          <td>
            <div>
              <td className="canceled canceledColumn">
                <div className="checkboxWrapper">
                  <div className="md-checkbox">
                    <input
                      id={`cancelCheckbox${col.tid}`}
                      type="checkbox"
                      checked={col.canceled}
                      onChange={() => setCancel(index, !col.canceled)}
                    />
                    <label htmlFor={`cancelCheckbox${col.tid}`}></label>
                  </div>
                </div>
              </td>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function CheckBook() {
  const [sortedField, setSortedField] = React.useState({});
  return (
    <CheckProvider>
      <div className={"tableWrapper"}>
        <table>
          <thead>
            <HeaderRow sortedField={sortedField} />
          </thead>
          <tbody>
            <DataRow />
          </tbody>
        </table>
      </div>
    </CheckProvider>
  );
}

export default CheckBook;
