import React from 'react';

const Button = ({ text, handleClick, somebody }) => (
  <button style={{ color: 'green' }} onClick={ somebody }>
    { text }
  </button>
);

export default Button;

// import React from 'react';
// import Checkbox from 'components/Checkbox/Checkbox.js';
// import ActionButtons from 'components/ActionButtons/ActionButtons.js';

// const TableRow = ({ rowData, actions, className }) => (
//   <tr
//     className={ `summary-row ${ className }` }
//     onClick={ (e) => {
//       // Only trigger when clicking a <td> tag
//       if (e.target.tagName === 'TD') {
//         actions.onRowClick();
//       }
//     }}
//   >
//     <td>
//       <Checkbox
//         selected={ !!rowData.selected }
//         onChange={ actions.onCheckboxClick }
//       />
//     </td>
//     <td>{ rowData.sid }</td>
//     <td>{ rowData.name }</td>
//     <td>{ rowData.classtype }</td>
//     <td>
//       <ActionButtons
//         onReject={ actions.reject }
//         onFastApprove={ actions.fastApprove }
//       />
//     </td>
//   </tr>
// );

// TableRow.propTypes = {
//   /*
//    * Data used to render the row
//    */
//   rowData: React.PropTypes.object.isRequired,

//   /*
//    * Actions that are automatically bound with this rows ID
//    */
//   actions: React.PropTypes.object,

//   /*
//    * A string to add as the className on the row
//    */
//   className: React.PropTypes.string,
// };

// export default TableRow;

