export function getCurrentDateTimeString() {
  const date = new Date();
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0') +
    ' ' +
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0') +
    ':' +
    date.getSeconds().toString().padStart(2, '0')
  );
}

export function getCurrentDateString() {
  const date = new Date();
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0')
  );
}

export function formatDate(date_val, type) {
  var mL = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(date_val);

  if (type == 'FROM') {
    return (
      mL[date.getMonth()] + ' ' + date.getDate().toString().padStart(2, '0')
    );
  } else if (type == 'TO') {
    return (
      date.getDate().toString().padStart(2, '0') + ', ' + date.getFullYear()
    );
  } else {
    return (
      mL[date.getMonth()] +
      ' ' +
      date.getDate().toString().padStart(2, '0') +
      ', ' +
      date.getFullYear()
    );
  }
}

export function trimString(str: string) {
  return str.trim();
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, stringCallBack);
}

export function stringCallBack(txt: string) {
  return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
}

export function paginateResponse(
  data: any,
  page: number,
  itemPerPage: number,
  totalRows: number,
) {
  const pageCount = Math.ceil(totalRows / itemPerPage);
  const nextPage = page + 1 > pageCount ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  const pageStop = page == pageCount ? totalRows : page * itemPerPage;
  return {
    data,
    pagination: {
      count: totalRows,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      pageCount: pageCount,
      pageStop,
    },
  };
}

// export function monthPeriodList(from: number, to: number) {
//   let list = [];
//   let mnth = [
//     {
//       id: 1,
//       name: 'January',
//     },
//     {
//       id: 2,
//       name: 'February',
//     },
//     {
//       id: 3,
//       name: 'March',
//     },
//     {
//       id: 4,
//       name: 'April',
//     },
//     {
//       id: 5,
//       name: 'May',
//     },
//     {
//       id: 6,
//       name: 'June',
//     },
//     {
//       id: 7,
//       name: 'July',
//     },
//     {
//       id: 8,
//       name: 'August',
//     },
//     {
//       id: 9,
//       name: 'September',
//     },
//     {
//       id: 10,
//       name: 'October',
//     },
//     {
//       id: 11,
//       name: 'November',
//     },
//     {
//       id: 12,
//       name: 'December',
//     },
//   ];

//   for (let i = from - 1; i < to; i++) {
//     list.push(mnth[i]);
//   }

//   return list;
// }
