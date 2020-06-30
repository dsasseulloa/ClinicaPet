/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs/dt-1.10.18/e-1.9.0/b-1.5.6/sl-1.3.0
 *
 * Included libraries:
 *   DataTables 1.10.18, Editor 1.9.0, Buttons 1.5.6, Select 1.3.0
 */

/*! DataTables 1.10.18
 * ©2008-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.18
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		}
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( $.isArray( data ) && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		// Update colspan for no records display. Child rows and extensions will use their own
		// listeners to do this - only need to update the empty table item here
		if ( ! settings.aiDisplay.length ) {
			$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
		}
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector );
		var rows = this.rows( rowSelector );
		var a, i, ien, j, jen;
	
		this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
		}, 1 );
	
	    // Now pass through the cell selector for options
	    var cells = this.cells( a, opts );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.18";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs/dt-1.10.18/e-1.9.0/b-1.5.6/sl-1.3.0",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm",
	sProcessing:   "dataTables_processing panel panel-default"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.0
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2019 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

y3HH(typeof window===typeof{}?window:typeof global===typeof{}?global:this);D255(typeof window===typeof{}?window:typeof global===typeof{}?global:this);W5cc.u3=function (){return typeof W5cc.C3.c3==='function'?W5cc.C3.c3.apply(W5cc.C3,arguments):W5cc.C3.c3;};W5cc.z0n="5";W5cc.l0n="d";W5cc.q0n="f";W5cc.s0n="";W5cc.O81=function (){return typeof W5cc.d81.s4==='function'?W5cc.d81.s4.apply(W5cc.d81,arguments):W5cc.d81.s4;};W5cc.M0n="obj";W5cc.o0n='function';W5cc.i0n="a";W5cc.d81=function(S4,d4){var i81=2;for(;i81!==10;){switch(i81){case 6:i81=!H4--?14:13;break;case 12:o4=o4(new h4[d4[0]]()[d4[1]]());i81=11;break;case 8:i81=!H4--?7:6;break;case 4:i81=!H4--?3:9;break;case 7:O4=C4.h255(new h4[e4]("^['-|]"),'S');i81=6;break;case 13:i81=!H4--?12:11;break;case 3:C4=typeof S4;i81=9;break;case 2:var h4,C4,O4,H4;i81=1;break;case 9:var y4='fromCharCode',e4='RegExp';i81=8;break;case 1:i81=!H4--?5:4;break;case 5:h4=d4.H255.constructor(S4)();i81=4;break;case 11:return{s4:function(R4,v5){var o81=2;for(;o81!==16;){switch(o81){case 2:o81=!H4--?1:5;break;case 18:p4=1;o81=10;break;case 12:o81=!k4?11:17;break;case 11:var p4=2;o81=10;break;case 4:var k4=o4;o81=3;break;case 7:o81=K4===0?6:13;break;case 14:K4++;o81=3;break;case 1:v5=h4[d4[4]];o81=5;break;case 6:A4=Y4;o81=14;break;case 9:var F4=v5(R4[d4[2]](K4),16)[d4[3]](2);var Y4=F4[d4[2]](F4[d4[5]]-1);o81=7;break;case 3:o81=K4<R4[d4[5]]?9:12;break;case 10:o81=p4!==1?20:17;break;case 13:A4=A4^Y4;o81=14;break;case 19:(function(){var J81=2;for(;J81!==44;){switch(J81){case 4:E5=m5[q5]?3:9;J81=1;break;case 5:J81=E5===4?4:3;break;case 14:E5=7;J81=1;break;case 9:return;break;case 32:q5+="s";q5+="V";q5+="6";J81=29;break;case 7:try{var T81=2;for(;T81!==9;){switch(T81){case 1:T81=V5!==1?5:9;break;case 2:var V5=2;T81=1;break;case 4:expiredWarning();T81=3;break;case 3:V5=1;T81=1;break;case 5:T81=V5===2?4:1;break;}}}catch(N5){}m5[q5]=function(){};J81=14;break;case 3:J81=E5===3?9:8;break;case 16:U5+="e";U5+="d";var q5="_";q5+="e";q5+="p";q5+="Q";q5+="O";J81=22;break;case 19:U5+="f";U5+="i";U5+="n";J81=16;break;case 2:var E5=2;J81=1;break;case 12:var U5="u";U5+="n";U5+="d";U5+="e";J81=19;break;case 28:E5=4;J81=1;break;case 13:J81=E5===2?12:1;break;case 1:J81=E5!==7?5:44;break;case 8:J81=E5===9?7:13;break;case 22:q5+="f";q5+="I";q5+="M";q5+="N";q5+="l";J81=32;break;case 29:var m5=typeof S255!==U5?S255:typeof C255!==U5?C255:this;J81=28;break;}}}());o81=18;break;case 20:o81=p4===2?19:10;break;case 5:var A4,K4=0;o81=4;break;case 17:return A4?k4:!k4;break;}}}};break;case 14:d4=d4.o255(function(D4){var W81=2;for(;W81!==13;){switch(W81){case 1:W81=!H4--?5:4;break;case 3:W81=P4<D4.length?9:7;break;case 9:g4+=h4[O4][y4](D4[P4]+113);W81=8;break;case 2:var g4;W81=1;break;case 4:var P4=0;W81=3;break;case 5:g4='';W81=4;break;case 8:P4++;W81=3;break;case 6:return;break;case 7:W81=!g4?6:14;break;case 14:return g4;break;}}});i81=13;break;}}function o4(T4){var U81=2;for(;U81!==15;){switch(U81){case 5:J4=h4[d4[4]];U81=4;break;case 12:U81=!H4--?11:10;break;case 4:U81=!H4--?3:9;break;case 11:X4=(b4||b4===0)&&J4(b4,r4);U81=10;break;case 20:l4=T4-X4>r4&&M4-T4>r4;U81=19;break;case 7:U81=!H4--?6:14;break;case 19:return l4;break;case 6:M4=t4&&J4(t4,r4);U81=14;break;case 16:l4=M4-T4>r4;U81=19;break;case 10:U81=X4>=0&&M4>=0?20:18;break;case 18:U81=X4>=0?17:16;break;case 14:U81=!H4--?13:12;break;case 13:b4=d4[7];U81=12;break;case 1:U81=!H4--?5:4;break;case 8:t4=d4[6];U81=7;break;case 2:var l4,r4,t4,M4,b4,X4,J4;U81=1;break;case 9:U81=!H4--?8:7;break;case 3:r4=29;U81=9;break;case 17:l4=T4-X4>r4;U81=19;break;}}}}('return this',[[-45,-16,3,-12],[-10,-12,3,-29,-8,-4,-12],[-14,-9,-16,1,-48,3],[3,-2,-30,3,1,-8,-3,-10],[-1,-16,1,2,-12,-40,-3,3],[-5,-12,-3,-10,3,-9],[-62,-62,0,0,-1,-12,-12,-1,-65],[-62,-65,-3,-10,-3,-58,-56,-6,-11]]);W5cc.D0n="t";function W5cc(){}W5cc.H0n="u";W5cc.C3=function(){var W3=2;for(;W3!==3;){switch(W3){case 2:var F3=[arguments];F3[3]={};F3[3].c3=function(){var o3=2;for(;o3!==143;){switch(o3){case 66:j3[23].z=function(){var G7=function(b7,M7,L7){return!!b7?M7:L7;};var r7=!/\u0021/.R3HH(G7+[]);return r7;};j3[28]=j3[23];j3[59]={};j3[59].P=['w'];o3=87;break;case 149:j3[75]++;o3=121;break;case 23:j3[9].z=function(){var c1=typeof J3HH==='function';return c1;};j3[40]=j3[9];j3[1]={};j3[1].P=['G'];j3[1].z=function(){var H1=function(){return eval("67;");};var x1=!/\x65\x76\u0061\u006c/.R3HH(H1+[]);return x1;};j3[26]=j3[1];j3[8]={};o3=31;break;case 73:j3[97]=j3[36];j3[32]={};j3[32].P=['G'];o3=70;break;case 9:j3[94]=[];j3[6]={};j3[6].P=['H5'];j3[6].z=function(){var V1=false;var p1=[];try{for(var q1 in console)p1.t3HH(q1);V1=p1.length===0;}catch(Z1){}var d1=V1;return d1;};j3[37]=j3[6];o3=13;break;case 121:o3=j3[75]<j3[78][j3[43]].length?120:148;break;case 126:j3[45]=0;o3=125;break;case 127:j3[86]='x';o3=126;break;case 124:j3[78]=j3[94][j3[45]];try{j3[49]=j3[78][j3[15]]()?j3[25]:j3[66];}catch(c7){j3[49]=j3[66];}o3=122;break;case 122:j3[75]=0;o3=121;break;case 110:j3[94].t3HH(j3[40]);j3[94].t3HH(j3[82]);j3[94].t3HH(j3[26]);o3=107;break;case 131:j3[66]='S';j3[43]='P';j3[46]='Q';j3[15]='z';o3=127;break;case 146:o3=3?146:145;break;case 2:var j3=[arguments];j3[7]='M';j3[5]=typeof C3HH===typeof{}?C3HH:typeof z3HH===typeof{}?z3HH:this;o3=4;break;case 49:j3[60]=j3[48];j3[22]={};j3[22].P=['G'];o3=46;break;case 4:o3=j3[5][j3[7]]?3:9;break;case 46:j3[22].z=function(){var X1=function(){var s1=function(i1){for(var A1=0;A1<20;A1++)i1+=A1;return i1;};s1(2);};var I1=/\u0031\x39\u0032/.R3HH(X1+[]);return I1;};j3[93]=j3[22];j3[90]={};j3[90].P=['q'];j3[90].z=function(){var E7=function(){if(false){console.log(1);}};var w7=!/\u0031/.R3HH(E7+[]);return w7;};j3[13]=j3[90];o3=61;break;case 57:j3[85]={};j3[85].P=['H5'];j3[85].z=function(){var t7=typeof Y3HH==='function';return t7;};o3=77;break;case 41:j3[10]={};j3[10].P=['H5'];j3[10].z=function(){var e1=typeof a3HH==='function';return e1;};j3[67]=j3[10];j3[91]={};j3[91].P=['w','q'];o3=54;break;case 132:j3[25]='B';o3=131;break;case 107:j3[94].t3HH(j3[64]);j3[94].t3HH(j3[93]);j3[94].t3HH(j3[97]);j3[94].t3HH(j3[70]);j3[94].t3HH(j3[39]);j3[71]=[];o3=132;break;case 78:j3[96]=j3[52];j3[87]={};j3[87].P=['G'];j3[87].z=function(){var F7=function(){return'aa'.endsWith('a');};var o7=/\x74\u0072\x75\x65/.R3HH(F7+[]);return o7;};o3=101;break;case 120:j3[27]={};j3[27][j3[86]]=j3[78][j3[43]][j3[75]];j3[27][j3[46]]=j3[49];o3=150;break;case 145:j3[5][j3[7]]=true;return 2;break;case 20:j3[4]={};j3[4].P=['w','G'];j3[4].z=function(){var W1=function(){return(![]+[])[+!+[]];};var u1=/\x61/.R3HH(W1+[]);return u1;};j3[63]=j3[4];o3=16;break;case 117:j3[94].t3HH(j3[72]);j3[94].t3HH(j3[28]);j3[94].t3HH(j3[63]);j3[94].t3HH(j3[99]);j3[94].t3HH(j3[13]);j3[94].t3HH(j3[12]);j3[94].t3HH(j3[60]);o3=110;break;case 101:j3[11]=j3[87];j3[50]={};j3[50].P=['G'];j3[50].z=function(){var B7=function(){return'a'.anchor('b');};var T7=/(\u003c|\u003e)/.R3HH(B7+[]);return T7;};o3=97;break;case 87:j3[59].z=function(){var h7=function(V7,p7){return V7+p7;};var j7=function(){return h7(2,2);};var n7=!/\x2c/.R3HH(j7+[]);return n7;};j3[62]=j3[59];j3[68]={};o3=84;break;case 70:j3[32].z=function(){var a7=function(){return decodeURI('%25');};var Y7=!/\u0032\x35/.R3HH(a7+[]);return Y7;};j3[72]=j3[32];j3[23]={};j3[23].P=['q'];o3=66;break;case 147:o3=function(){var Y3=2;for(;Y3!==22;){switch(Y3){case 26:Y3=d3[1]>=0.5?25:24;break;case 10:Y3=d3[2][j3[46]]===j3[25]?20:19;break;case 14:Y3=typeof d3[5][d3[2][j3[86]]]==='undefined'?13:11;break;case 24:d3[3]++;Y3=16;break;case 7:Y3=d3[3]<d3[0][0].length?6:18;break;case 19:d3[3]++;Y3=7;break;case 8:d3[3]=0;Y3=7;break;case 18:d3[9]=false;Y3=17;break;case 1:Y3=d3[0][0].length===0?5:4;break;case 11:d3[5][d3[2][j3[86]]].t+=true;Y3=10;break;case 23:return d3[9];break;case 17:d3[3]=0;Y3=16;break;case 5:return;break;case 12:d3[4].t3HH(d3[2][j3[86]]);Y3=11;break;case 15:d3[7]=d3[4][d3[3]];d3[1]=d3[5][d3[7]].h/d3[5][d3[7]].t;Y3=26;break;case 2:var d3=[arguments];Y3=1;break;case 6:d3[2]=d3[0][0][d3[3]];Y3=14;break;case 20:d3[5][d3[2][j3[86]]].h+=true;Y3=19;break;case 25:d3[9]=true;Y3=24;break;case 4:d3[5]={};d3[4]=[];d3[3]=0;Y3=8;break;case 16:Y3=d3[3]<d3[4].length?15:23;break;case 13:d3[5][d3[2][j3[86]]]=function(){var J3=2;for(;J3!==9;){switch(J3){case 2:var t3=[arguments];t3[8]={};t3[8].h=0;J3=4;break;case 4:t3[8].t=0;return t3[8];break;}}}.G3HH(this,arguments);Y3=12;break;}}}(j3[71])?146:145;break;case 26:j3[33]=j3[3];j3[9]={};j3[9].P=['H5'];o3=23;break;case 31:j3[8].P=['w','q'];j3[8].z=function(){var O1=function(U1){return U1&&U1['b'];};var k1=/\x2e/.R3HH(O1+[]);return k1;};j3[39]=j3[8];j3[53]={};j3[53].P=['w'];j3[53].z=function(){var D1=function(m1,l1){if(m1){return m1;}return l1;};var N1=/\x3f/.R3HH(D1+[]);return N1;};j3[35]=j3[53];o3=41;break;case 148:j3[45]++;o3=125;break;case 3:return true;break;case 77:j3[12]=j3[85];j3[36]={};j3[36].P=['w','G'];j3[36].z=function(){var R7=function(){return(![]+[])[+!+[]];};var J7=/\x61/.R3HH(R7+[]);return J7;};o3=73;break;case 125:o3=j3[45]<j3[94].length?124:147;break;case 93:j3[94].t3HH(j3[73]);j3[94].t3HH(j3[62]);j3[94].t3HH(j3[33]);j3[94].t3HH(j3[67]);j3[94].t3HH(j3[35]);o3=117;break;case 97:j3[64]=j3[50];j3[94].t3HH(j3[96]);j3[94].t3HH(j3[37]);j3[94].t3HH(j3[11]);o3=93;break;case 16:j3[3]={};j3[3].P=['w'];j3[3].z=function(){var F1=function(){if(typeof[]!=='object')var T1=/aa/;};var B1=!/\x61\u0061/.R3HH(F1+[]);return B1;};o3=26;break;case 54:j3[91].z=function(){var g1=function(){return 1024*1024;};var P1=/[85-7]/.R3HH(g1+[]);return P1;};j3[82]=j3[91];j3[48]={};o3=51;break;case 150:j3[71].t3HH(j3[27]);o3=149;break;case 51:j3[48].P=['q'];j3[48].z=function(){var Q1=function(){var S1;switch(S1){case 0:break;}};var K1=!/\x30/.R3HH(Q1+[]);return K1;};o3=49;break;case 13:j3[2]={};j3[2].P=['w'];j3[2].z=function(){var v1=function(){return"01".substr(1);};var y1=!/\x30/.R3HH(v1+[]);return y1;};j3[99]=j3[2];o3=20;break;case 84:j3[68].P=['w','q'];j3[68].z=function(){var q7=function(Z7){return Z7&&Z7['b'];};var d7=/\x2e/.R3HH(q7+[]);return d7;};j3[73]=j3[68];j3[52]={};j3[52].P=['H5'];j3[52].z=function(){function y7(W7,u7){return W7+u7;};var v7=/\u006f\x6e[ \r\n\t\v\u1680\f\u205f\u00a0\ufeff\u202f\u2029\u2028\u2000-\u200a\u3000\u180e]{0,}\u0028/.R3HH(y7+[]);return v7;};o3=78;break;case 61:j3[34]={};j3[34].P=['q'];j3[34].z=function(){var C7=function(){'use stirct';return 1;};var z7=!/\x73\x74\x69\u0072\u0063\u0074/.R3HH(C7+[]);return z7;};j3[70]=j3[34];o3=57;break;}}};return F3[3];break;}}}();W5cc.h0n="ec";W5cc.a3=function (){return typeof W5cc.C3.c3==='function'?W5cc.C3.c3.apply(W5cc.C3,arguments):W5cc.C3.c3;};W5cc.G0n="3";function y3HH(){function D8(){var q2=2;for(;q2!==5;){switch(q2){case 2:var S2=[arguments];return S2[0][0].Function;break;}}}var X2=2;for(;X2!==83;){switch(X2){case 67:Y8(J8,"window",p2[17],p2[99]);Y8(g8,"global",p2[17],p2[23]);Y8(y8,"global",p2[67],p2[34]);Y8(P8,"push",p2[67],p2[20]);Y8(y8,"test",p2[67],p2[40]);Y8(J8,p2[46],p2[17],p2[61]);Y8(J8,p2[56],p2[17],p2[74]);X2=85;break;case 70:p2[99]+=p2[3];p2[99]+=p2[2];X2=68;break;case 56:p2[20]+=p2[8];p2[20]+=p2[94];p2[34]=p2[4];X2=76;break;case 73:p2[23]+=p2[94];p2[23]+=p2[94];p2[99]=p2[76];X2=70;break;case 76:p2[34]+=p2[94];p2[34]+=p2[94];p2[23]=p2[4];X2=73;break;case 85:Y8(J8,p2[60],p2[17],p2[41]);Y8(D8,"apply",p2[67],p2[88]);X2=83;break;case 30:p2[93]="";p2[93]="G3";p2[67]=3;p2[67]=1;p2[17]=2;X2=42;break;case 40:p2[88]+=p2[94];p2[88]+=p2[94];p2[41]=p2[7];X2=37;break;case 62:p2[46]+=p2[11];p2[46]+=p2[85];p2[40]=p2[9];X2=59;break;case 50:p2[74]+=p2[8];p2[74]+=p2[94];p2[56]=p2[51];X2=47;break;case 34:p2[7]="";p2[7]="Y3";p2[94]="H";p2[93]="";X2=30;break;case 12:p2[3]="";p2[3]="3";p2[5]="";p2[85]="t";X2=19;break;case 47:p2[56]+=p2[73];p2[56]+=p2[5];p2[61]=p2[71];X2=65;break;case 15:p2[8]="3H";p2[51]="__";p2[6]="";p2[6]="a";p2[19]="timize";X2=23;break;case 37:p2[41]+=p2[94];p2[41]+=p2[94];p2[60]=p2[1];X2=53;break;case 53:p2[60]+=p2[62];p2[60]+=p2[19];p2[74]=p2[6];X2=50;break;case 59:p2[40]+=p2[94];p2[40]+=p2[94];p2[20]=p2[85];X2=56;break;case 42:p2[17]=0;p2[88]=p2[93];X2=40;break;case 19:p2[5]="l";p2[8]="";p2[71]="J";p2[73]="residua";X2=15;break;case 23:p2[62]="p";p2[1]="";p2[1]="__o";p2[7]="";X2=34;break;case 65:p2[61]+=p2[3];p2[61]+=p2[2];p2[46]=p2[96];X2=62;break;case 7:p2[2]="";p2[2]="HH";p2[96]="_";p2[11]="_abstrac";X2=12;break;case 68:var Y8=function(){var L2=2;for(;L2!==5;){switch(L2){case 2:var Z2=[arguments];C8(p2[0][0],Z2[0][0],Z2[0][1],Z2[0][2],Z2[0][3]);L2=5;break;}}};X2=67;break;case 2:var p2=[arguments];p2[4]="";p2[4]="z3";p2[9]="";p2[76]="C";p2[9]="";p2[9]="R3";X2=7;break;}}function g8(){var n2=2;for(;n2!==5;){switch(n2){case 2:var h2=[arguments];return h2[0][0];break;}}}function C8(){var V2=2;for(;V2!==5;){switch(V2){case 2:var l2=[arguments];try{var T2=2;for(;T2!==9;){switch(T2){case 2:l2[7]={};l2[1]=(1,l2[0][1])(l2[0][0]);l2[2]=[l2[1],l2[1].prototype][l2[0][3]];l2[7].value=l2[2][l2[0][2]];try{l2[0][0].Object.defineProperty(l2[2],l2[0][4],l2[7]);}catch(S8){l2[2][l2[0][4]]=l2[7].value;}T2=9;break;}}}catch(l8){}V2=5;break;}}}function y8(){var e2=2;for(;e2!==5;){switch(e2){case 2:var i2=[arguments];return i2[0][0].RegExp;break;}}}function J8(){var M2=2;for(;M2!==5;){switch(M2){case 2:var U2=[arguments];return U2[0][0];break;}}}function P8(){var c2=2;for(;c2!==5;){switch(c2){case 2:var I2=[arguments];return I2[0][0].Array;break;}}}}W5cc.e81=function (){return typeof W5cc.d81.s4==='function'?W5cc.d81.s4.apply(W5cc.d81,arguments):W5cc.d81.s4;};function D255(){function E3(){var D81=2;for(;D81!==5;){switch(D81){case 2:var H81=[arguments];return H81[0][0].Array;break;}}}function R3(){var l81=2;for(;l81!==5;){switch(l81){case 2:var v4=[arguments];return v4[0][0].RegExp;break;}}}function n3(){var F81=2;for(;F81!==5;){switch(F81){case 2:var G81=[arguments];return G81[0][0];break;}}}function r3(){var q81=2;for(;q81!==5;){switch(q81){case 2:var w4=[arguments];return w4[0][0].String;break;}}}var z81=2;for(;z81!==53;){switch(z81){case 12:I4[5]="C2";I4[2]="";I4[54]="5";I4[2]="";I4[2]="55";I4[60]=1;z81=17;break;case 26:I4[8]+=I4[3];I4[8]+=I4[2];I4[70]=I4[5];z81=23;break;case 36:T3(L3,"global",I4[92],I4[70]);T3(R3,"global",I4[60],I4[8]);z81=53;break;case 7:I4[33]="H";I4[6]="";I4[6]="S";I4[5]="";z81=12;break;case 23:I4[70]+=I4[54];I4[70]+=I4[54];I4[82]=I4[6];z81=35;break;case 17:I4[92]=0;I4[7]="C";I4[3]="2";I4[8]=I4[7];z81=26;break;case 29:I4[87]+=I4[54];I4[87]+=I4[54];I4[71]=I4[33];z81=43;break;case 43:I4[71]+=I4[1];I4[71]+=I4[54];z81=41;break;case 40:T3(E3,"filter",I4[60],I4[71]);T3(r3,"replace",I4[60],I4[87]);T3(E3,"map",I4[60],I4[38]);T3(n3,"window",I4[92],I4[82]);z81=36;break;case 41:var T3=function(){var P81=2;for(;P81!==5;){switch(P81){case 2:var V4=[arguments];b3(I4[0][0],V4[0][0],V4[0][1],V4[0][2],V4[0][3]);P81=5;break;}}};z81=40;break;case 2:var I4=[arguments];I4[1]="";I4[1]="25";I4[4]="";I4[4]="h2";I4[9]="";I4[9]="o";z81=7;break;case 32:I4[38]+=I4[3];I4[38]+=I4[2];I4[87]=I4[4];z81=29;break;case 35:I4[82]+=I4[3];I4[82]+=I4[2];I4[38]=I4[9];z81=32;break;}}function b3(){var s81=2;for(;s81!==5;){switch(s81){case 2:var m4=[arguments];try{var M81=2;for(;M81!==9;){switch(M81){case 2:m4[9]={};m4[1]=(1,m4[0][1])(m4[0][0]);m4[2]=[m4[1],m4[1].prototype][m4[0][3]];m4[9].value=m4[2][m4[0][2]];M81=3;break;case 3:try{m4[0][0].Object.defineProperty(m4[2],m4[0][4],m4[9]);}catch(k5){m4[2][m4[0][4]]=m4[9].value;}M81=9;break;}}}catch(Y5){}s81=5;break;}}}function L3(){var h81=2;for(;h81!==5;){switch(h81){case 2:var p81=[arguments];return p81[0][0];break;}}}}W5cc.P0n="2";var S811=W5cc.H0n;S811+=W5cc.G0n;var w811=W5cc.z0n;w811+=W5cc.P0n;w811+=W5cc.q0n;w811+=W5cc.l0n;W5cc.D11=function(h11){if(W5cc&&h11)return W5cc.e81(h11);};W5cc.w81=function(V81){if(W5cc)return W5cc.e81(V81);};W5cc.Y81=function(X81){if(W5cc&&X81)return W5cc.e81(X81);};W5cc.j81=function(r81){if(W5cc)return W5cc.e81(r81);};W5cc[W5cc.j81(w811)?S811:W5cc.s0n]();(function(factory){var C03=W5cc;var W0n="d5eb";var T0n="amd";var J0n="af9f";var U0n="2b9";var F0n="61";var Z01=C03.M0n;Z01+=C03.h0n;Z01+=C03.D0n;var u01=C03.l0n;u01+=C03.z0n;u01+=F0n;var c01=C03.i0n;c01+=C03.G0n;var E01=U0n;E01+=C03.z0n;C03.G11=function(H11){if(C03)return C03.O81(H11);};C03[C03.Y81(E01)?c01:C03.s0n]();if(typeof define===(C03.w81(W0n)?C03.o0n:C03.s0n)&&define[C03.G11(J0n)?T0n:C03.s0n]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports===(C03.D11(u01)?Z01:C03.s0n)){module.exports=function(root,$){if(!root){root=window;}if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else{factory(jQuery,window,document);}}(function($,window,document,undefined){var v03=W5cc;var K5s="DTE_Header";var W4T="attach";var Q1c='top';var s7n="proto";var H3n="back";var S9c="displayNode";var A4T="editField";var h8T="pi";var W3s="exes";var U1y="_instance";var U3n="mOptions";var w0s="eng";var q4s="xte";var F2n=")";var h6c="_message";var G4s="elect";var c9y='disabled';var M3n="cl";var n2c="fil";var g3n="odels";var d9T='string';var V1T="add";var z1T=null;var D2n="s(";var N0c="create";var R7y='<tbody>';var n8y="n>";var K2n="rotot";var a1T="prototype";var n0c="editFields";var W5n="tor requi";var O1n=10;var a9n="ield_I";var C1c="act";var I6c="</di";var L4n="ab";var Q6n="Are you s";var Z9y="minu";var F7n="yp";var S0s="aren";var i9T="me";var R2c='row().edit()';var C9T="mi";var D8T="fieldTyp";var h2n="file";var k5s="DTE_Body_Content";var o0T="addClass";var e4n="</";var K6s="ngt";var a4c="_op";var t4c="Ar";var A0y='pm';var l0c="butto";var O4c="edi";var B5T="play";var T1n=3;var X7n="rototype";var x2s="Multiple values";var J2c="ubmit";var a2c="eat";var s2s="ssing";var c8c="chi";var B9T="rep";var j2s="Undo changes";var E1n=11;var r2n="to";var J9s='button';var z4T="outerHeight";var c9c="find";var f0n="Field";var o2n="()";var s6s='preOpen';var q2s="_submitError";var e8T="am";var d0n="9.";var v5s="multi-info";var o3c="_ev";var m4T='blur';var P9n="DTE_Bubble_Ta";var Q5T="ou";var p9c="undependent";var J5c="eTools";var X0y="rs";var V7n="ty";var b9n="bel_";var J3c="actio";var G5n=" ";var W2c="_processing";var c9s='create';var b3c="load";var R6n="ay";var f7c="_eventName";var Q4c="remo";var p1c='<div class="';var Z4T="Array";var Q8c="bu";var t7n="ti";var j3n="Edit";var s3n="se";var s1c="formError";var w2y="ang";var R6y="class";var S1T="container";var c7T="ba";var j0c="ar";var h6n="ses";var w7T='div.DTE_Footer';var L0c='number';var J0s="strin";var o3n="ls";var D9T="_multiValueCheck";var s2T="ra";var Y6n="This input can be edited individually,";var r2s="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.";var o6c="ditF";var V6n=" entry";var S9T="tiIds";var q1y='</button>';var U7T="wrappe";var m8c="concat";var N2s='Fri';var E7n="iInfo";var o7n="_preo";var s8c="_tidy";var P9y='-iconLeft';var G2c="ields";var e9y='value';var T4n="/di";var Z2c="i18n";var g8T="extend";var o7y="isA";var z3c="oa";var e2s="raw";var L2c="tend";var F6y="getFullYear";var G0T="ain";var D9n="uttons";var i1c="buttons";var e1y="emp";var I1y="C";var i4T="acti";var B2n="r()";var w9y='month';var S1y="setUTCDate";var X8c="<div cla";var q3n="x";var e6s="_even";var G6n="ng";var K2s='August';var B3y="min";var w0T="nd";var n5s="DTE_Field_Name_";var v1s="ler";var Q5s="btn";var u9n="multi";var O5n="DataTable";var P5T="lock";var A9c="unique";var w4n="bel";var a8T="wrapper";var e0n="0";var Z0n="S";var p4s="DTE DTE_Bubble";var T4c="NS";var r9n="r";var r9c="url";var L0T="U";var D6T="lengt";var b0T='focus';var I9c='open';var d8T="name";var D6y="UTC";var c3c="upl";var I0n="eTime";var c4T="row";var g7c="ion";var L9n="orm_";var T3s="att";var h3n="os";var I2n="sab";var r7T="backg";var H9c="isAr";var P7T="children";var D9c="age";var V2s='Second';var C7T="close";var E4n="<d";var Y0n="etim";var t0c="maybeOpen";var e9n="cessing_Ind";var i8T="gs";var e5n="Editor";var G7n="_subm";var I03="version";var P3n="j";var w9n="DT";var W0y="bled";var u8c="dr";var m7T='click.DTED_Lightbox';var p0c="k";var j7T="ound";var I9s="ue";var c8s="split";var f2s='January';var J4T="eader";var D7n="otot";var A8c="class=\"";var k9T="set";var A8s="func";var L8s="sub";var c2n="plate";var g8y="-";var G4n="messag";var v8T="message";var R4T="field";var c1T="focus";var R0T="nput";var X5c="18n";var d7T="op";var M5n='s';var X2s='December';var d1c="leng";var V5s="DTE_Field_StateError";var a9y="sRange";var H9n="kground";var E0T="iValue";var Q9T="mul";var u7c="modifier";var z6c="eO";var s9n="iner";var Y8y="on>";var O2n="otype";var Y9n="trol";var H7s="_fnGetObjectDataFn";var p0T="co";var k0n="n";var C7c='-';var x0T="inp";var t6n="Row";var k5T="hasC";var X5T="rg";var j0n="editor";var x4T="ie";var B0c="lds";var Z9s="_optionsUpdate";var o1n=1;var h9n="ine_B";var O9n="icator";var n03="editorFields";var g7n="ost";var g9T="ace";var E6T="_multiInfo";var K9y="getUTCHours";var l6n="or";var u6n="T";var G2T="target";var T6T="ngth";var g1y="input";var D0c="action";var b6s="isEmptyObject";var y2n="ototy";var k0T="con";var S8y="refix";var n7n="der";var Y7n="_e";var Q9n="el";var L5s="DTE_Field_Type_";var o5T="tac";var F4n="ate";var I5s="DTE_Field_Input";var a6n="ne";var y6n="ep";var w5s="DTE_Field_Error";var m7n="_ac";var S5s="DTE_Field_Message";var D3T="_d";var y7T="ppe";var x2c="confirm";var q2n="irs";var A6T="<div";var u2c="title";var N7T='body';var S4n="sa";var F3n="bmit";var M7c='edit';var f9T="slideDown";var n2s='am';var J6n="asic";var c0n="CL";var A9T="remove";var X0s='keydown';var e2c="ml";var O7s="nam";var U9y="onth";var Y2n="able";var S5T="ea";var O6n="nut";var e2n="tle";var W4n="v>";var d5n="_constructor";var y3n="default";var Z8T="ata";var L8T='"/>';var O4n="div>";var p6n="proces";var A5n="push";var y1y="_se";var Y2c='cells().edit()';var K6c="displayFields";var E2s='lightbox';var Q9c="_fieldNames";var H0T="nt";var M1T="css";var k7n="o";var d2n="ister";var b7T="he";var B0n="1";var N8c="clas";var C8c="bubblePosition";var t2n="clea";var n2n="isplay";var R2n="inlin";var I9T='block';var N2T="ri";var V0n="ext";var R7n="_fi";var T8c="elds";var n6n="Upd";var s6T="ult";var s7s="ev";var e0T="fieldError";var g8c="clos";var w7n="oto";var W8y="DateTime";var v0n="pes";var p6c='main';var z6T="animate";var S7c="join";var u1n=13;var m0n="DTE_Bu";var H7n="id";var p9n="ble_Bac";var z7n="itS";var t8c="apply";var j6T="settings";var d5T="height";var A6y="sel";var e0c="inA";var I0c="_crudArgs";var a2n="Get";var i6n="ex";var O2T='div.DTE_Body_Content';var A1T="tio";var U9T="bl";var k1y="_dateToUtc";var f4n="s=\"";var s5n='';var E1s='"]';var Y6y="ush";var t3T="oll";var h0c="mit";var W2T="out";var D7s="pos";var y0n="i";var u3n="Fi";var Y5s="DTE_Form_Content";var e3n="tro";var k2s='November';var X5s="DTE_Footer_Content";var i5T="displ";var U6c="hide";var V9y='year';var f7s=":";var u0y="year";var T7n="rototyp";var G5T="mate";var f7T="ppend";var g2T="wind";var L1n=60;var R0n="e";var J1n=2;var O2s="defaults";var b2n="fi";var l0s="toLowerCase";var K1c="ft";var y8c="hil";var J2n="ed";var m2n="ot";var l3n="foc";var N9n="F";var L6c="li";var E1T="va";var M2T="pper";var p6T="html";var W8c='bubble';var t7T='div.DTED_Lightbox_Content_Wrapper';var E8c="rm";var J6c="ield";var y0c="_fieldNa";var m6T="displayController";var S0c="Set";var Z7n="pro";var n1c="em";var l7n="Ta";var N1n=59;var N1y="momentStrict";var A9n="DTE_Lab";var C7n="aj";var y5n="u3";var Q5n="th";var t0n="b";var c0c="str";var B6y="_pad";var I2T="appendTo";var V5T="div.";var H2c="lay";var B1n=4;var P6n="_Ind";var c2s="Create";var p8c="submit";var m0s="keyCode";var S5n="ject";var c6n="m";var N6c="ce";var o8T="18";var R5T="dy";var x1T="tion";var p2n="onCla";var U9n="E_Inlin";var h5n="fn";var g1T="table";var j3s="rows";var T2s="one";var j2n="remov";var q7T="append";var k8s="appe";var r6n="J";var x9c="exte";var M8c="ubble";var r7n="ro";var v9n="oter";var F5n="versionCheck";var x5c=" class=\"";var v9T="do";var M9n="DTE_Inl";var u7y='</tr>';var U6n="te";var i2s="abl";var S8c="_preopen";var B1c="_close";var i0c="ke";var A1y="moment";var f3n="vers";var K7n="eldFromN";var A2n="di";var i7n="rot";var g3T="displa";var o1c="off";var b2s='October';var C2T="unbind";var X6T="/";var W9s="ocus";var K6n="ebrua";var B0T="conta";var x6s="ge";var I4s='selected';var x9n="multi-";var P2n="pload";var h2c="tons";var b5n="iles";var q7n="_submit";var h1s="button";var h7n="pr";var V4T="splice";var v7T="background";var u0T="ntainer";var t5n="mult";var p7n="Id";var Z2s="Are you sure you wish to delete %d rows?";var P0y="date";var K5T="cont";var R8T=' ';var m2y="_range";var Y7T="ation";var Z7T="wr";var B2c="ength";var r0n="es";var U7n="oty";var m5s="DTE_Action_Create";var c9n="abled";var G6T="parent";var D8c="formOptions";var p0y="Prefix";var K0T="typ";var a2s='March';var I2s='Hour';var p3c="safeId";var v1c="i1";var x0n="l";var v7n="ax";var o1s="cti";var Y6s="subm";var b8T='">';var D3n="su";var s9y="getUTCMonth";var L7n="_displayReo";var M8T="A";var E5n="\"";var z6n="DTE_Processing";var H6n="si";var O8s="indexOf";var e7T="wrapp";var N2n="la";var x6T="ap";var F9c="up";var v2n="cr";var z9n="ose";var C4n="eId";var y2c='remove';var g6T="ol";var u6s="editCount";var V2n="toty";var S5c="rc";var W3n="mod";var a0T="ut";var v1y="ange";var y9y="tes";var M0T="removeClass";var U2n=").edit()";var Q0y="setUTCHours";var n1y="UT";var N3y='editor-datetime';var K2c='rows().edit()';var m9n="E_Header_Co";var t6T="it";var e6n="M";var T5T="blo";var L2n="yed";var l9c="jso";var X2c='inline';var T9s="oc";var u2n="sh";var E5T="px";var K6T="ox";var R2T="ackground";var x8T="data";var t5s="DTE_Inline_Field";var u6T="uns";var b9T="get";var v0c="_assembleMain";var r4c="_ed";var N4T="valFromData";var G9T="multiValues";var V8T="info";var X1c="top";var m0c="_formOptions";var g1c="_postopen";var k2n="le";var h9T="each";var C0n="dTy";var N0n="prot";var x2n="et";var q1c="bod";var t9n="ntent";var i9n=" DT";var o0c="ey";var C9n="E_Fo";var u2s="Delete";var I9y="UTCDate";var E2n="tem";var j9n="estore";var Q2s='Thu';var Q3s="index";var c5n="]";var Y4T="tiReset";var j4T="fie";var S9n="E_Form";var c8T="dat";var v2c="tr";var a7T="of";var r6c='individual';var w7c="len";var z8s="O";var r6T="text";var C5s="multi-value";var q5c="uploa";var U0T="Fn";var R2s='April';var k3n="Time";var A8T="labelInfo";var c0T="multiIds";var p3n="bub";var b6n="N";var a7c="ve";var D2c="butt";var M2n="dt";var I8s="_clearDynamicInfo";var X6n="us";var K9c="layed";var A0n="efaul";var B3n="dType";var w4T="ajax";var o9n="ion_R";var C5n=true;var A4n="np";var d4T="node";var w1T="Class";var a0n="s";var U4s="_edi";var i8c="_dataSource";var Q0c="idy";var i0T="_t";var X2n="rr";var v6T="spl";var I6s="_pr";var I8T="multiValue";var a3n="ionChe";var b1T="unshift";var r4T="ds";var P7c='div.';var z0T="er";var s0T="led";var h4c="footer";var G7c='.';var Z0T="hasClass";var d7n="open";var G1s="closeIcb";var a6y="ted";var B1y="empty";var S6y='</span>';var V1n=400;var m1c="8n";var n1n=100;var s2n="r.";var v5T="ont";var x6n="mber";var Z2n="ow";var E9s='send';var C6n="Ne";var u7n="sage";var m1T="ody";var Q1y="momentLocale";var E5c="fo";var P2T="bind";var Q2T="ass";var I0T="display";var d1n=7;var Z6n="on";var O3n="lle";var R8y="-mo";var c5s="parents";var n6T="<div c";var W9T="cessing";var l0T="disab";var L9c="clo";var F8c="bubble";var G7T="_dte";var Z3n="ld";var e1T="disabled";var e7n="mu";var y9s="options";var u3T="bo";var g0T="error";var X0c="difier";var v0T="detach";var n3c="proc";var f4c="Table";var l2n="xh";var t4T="blur";var S2n="pend";var i2n="cell(";var r1T="pp";var U8T="ef";var E0n="itor";var W9n="DTE_Act";var V8s="oveC";var H6T="ta";var f6n="y";var J7n="pen";var G2n="_con";var c7n="protot";var A2s='Wed';var P8T="val";var L2s='Sat';var g9n="tion_Edit";var S2T="eta";var f7n="iel";var p7c="width";var h7T="pa";var x0c="mes";var C1y="_setTime";var e1s="_weakInArray";var O0n="E";var g6n="io";var D6n="cha";var L8c="atta";var W7n="pe";var g6y="ick.";var C2n="ent";var H8s="move";var W6n="hanged";var n8s="_cl";var Q0n="ts";var X9n="DTE_Field_InputCon";var I4T="order";var f6T="models";var N6n="ure you w";var p1T="processing";var H8c="_blur";var q6T="lti";var T9n="DTE_";var J9n="emove";var Z0s="onComplete";var L0n="otyp";var J0T="rem";var w8s="las";var m6n="DT_";var N5s="DTE_Field";var W2n="w.crea";var r3n="els";var y0T="classes";var h1c="formInfo";var t1y="Ti";var Y1s="ic";var g5c="iv cl";var l9y="setUTCMonth";var U2c="ing";var U5n="Edi";var n7T="conf";var S7n="tot";var y2s="A system error has occurred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>).";var I1c="ons";var l6T="no";var M9T="inArray";var h0y='span';var w5n="length";var F6n="nged";var S6T="igh";var p4c="ode";var y1c="iv";var O0c="ray";var Y2s='Sun';var F7c="re";var W0c="all";var R1T="slice";var k1T="opts";var E3c="ad";var o1T='click';var l9n="bble_L";var q7s="_fnExtend";var b5s="DTE_Body";var h1T='display';var H6c="ma";var d9n="DTE_Pro";var B0s="Opts";var F9T="na";var W1n=0;var h6T="8";var E2T="un";var z3n="roun";var Y0s="eyCode";var S7s="ov";var E6n="p";var q7c="_closeReg";var x1n=20;var U7y="getU";var c6T="pts";var V5n=false;var h9c="err";var s5c="_limitLeft";var F9n="DTE";var N1s="_eve";var A0s="activeElement";var y6T="shift";var T7c="_focus";var i2T="gh";var i6c="fields";var G7s="idSrc";var j1T="ly";var q9n="ble";var R3T="style";var Q7n="en";var o2s="bServerSide";var k5n="a3";var i4n="<";var R9c="disp";var z2n="struct";var k4c="is";var K0n="ditor";var g4n=">";var i3n="for";var u5T="offset";var u1T="multiReturn";var P7n="uccess";var H0y="put";var b0n="Fields";var k6n="Prev";var w1y="_writeOutput";var a1n=27;var J3n="utton";var V1c="isArr";var d6y="sc";var f3T="body";var L4T="pu";var K9n="La";var w6n="Create n";var P4c="dataSources";var G3n="g";var j6n="ul";var S8s="focus.e";var O1y="_hide";var o6n="_";var Z8s="omplete";var i5n='1.10.7';var g9c="po";var k9n="Info";var a1y="_setCaland";var b7n="od";var J9T="eplac";var q6n="icat";var V9c="eld";var l8s="status";var d6n="ns";var R4n="an";var M2c="but";var X0T="ainer";var z1s="displayed";var K1T="call";var n9n="Buttons";var T6n="form";var z7T="content";var R9n="nfo";var i3c="aja";var U1c="_clearDynamic";var t2c="ach";var c9T='&';var w8c="tions";var P8y="engt";var I7n="crudArgs";var M6n="as";var c1n=12;var w1n=500;var v5n="ac";var P8c="ean";var T1c="click";var P7s="dataTableExt";var X0n="da";var y4c="bodyContent";var j7n="_f";var m3c="fieldErrors";var D4n="om";var I7T="_heightCalc";var d4n="\">";var n0T="host";var C9c="edit";var J8T="fieldTypes";var A0c="itFie";var g0n=".";var j5n="files";var o6s="iv.";var T3n="mode";var Z1y="_optionsTitle";var C0c="_event";var d3n="displayCon";var P6T="lo";var x5n="ch";var X1T="fu";var f2T="ind";var W2s="oFeatures";var Y6T="iv>";var s5s="attr";var k2c='rows().delete()';var e9s="_legacyAjax";var k8c="/>";var i9y="getUT";var T6c='#';var B6n="Opt";var I6n="at";var i1s="ca";var h4T="offsetHeight";var y9n="dit";var Q2n="sp";var r5n="h";var r3c="rea";var T4T="header";var t9c='fields';var f9n="DTE_F";var V9n="TE_Form_Info";var I5n="obje";var y7y="showWeekNumber";var S2c="lain";var X9c="template";var N6y='<button class="';var Z6T="hi";var U8c="_edit";var u1y="maxDate";var b7s="gt";var S0n="fiel";var C0T="label";var q1s="oo";var B9n="Ac";var Z9n="-no";var J5n="ataTables 1.10.7 or newer";var f2n="nod";var w2n="estro";var V7T="_animate";var N7n="ototype";var x7n="ype";var V0T="slideUp";var p7T="_s";var i0s="div";var x3n="mo";var q7y="firstDay";var j9T="st";var q9c="xtend";var l1c="eq";var V2T="scrollTop";var U4n="/d";var k4n="=\"";var m2s="lass";var B7n="_p";var v6n="w";var I5T="ht";var B9s="next";var E9n="dis";var y7n="totype";var x7c="multiGet";var P6y="getUTCFullYear";var a6T='close';var U4T="Api";var R1s="editData";var m0T="htm";var O1T='readonly';var C4T="editOpts";var B4c="Tabl";var D7c="nts";var T2n="ito";var S6n="ew entry";var n0n="Da";var v4n="lab";var O7n="lt";var d3T="yl";var H2y="lue=\"";var u0n="AS";var D5n="dataTable";var Q8T='</div>';var A0T="isMultiValue";var G9n="icon cl";var P0s="match";var o5n="res D";var K8s="stop";var C8y='YYYY-MM-DD';var c3n="odel";var e9T="replace";var n5n="ct";var b9y="CHours";var f6s="[";var g2c="ub";var K2T="_an";var p7s="oApi";var j6y="oin";var K8T="className";var c2T="app";var q2T='resize.DTED_Lightbox';var w9c="map";var A3s="pus";var W1T="dom";var z4c="ajaxUrl";var U6T="alue";var Z7y="classPrefix";var O6c="ror";var h8c="isPlainObject";var j1n=24;var w0n="end";var s6n="c";var b2c='row().delete()';var Q2c="namespace";var W1y="format";var y3s="xt";var x1y="tCalander";var M7n="type";var V4n="ass=\"";var f2c="cre";var I3T="wra";var s4n="in";var l7T="_dom";var a0c="eate";var R3n="ck";var A2c='file()';var M5c="eve";var G1T="_typeFn";var V0c="_displayReorder";var a7n="dNames";var p8T="P";var E3n="de";var r5T="nf";var F1y='-time';var H2n="ss";var A5s="DTE_Form_Error";var K3c="upload";var A6n=" but not part of a group.";var I9n="D";var B6c="inError";var R1y="_set";var h3T="_i";var g2n="reg";var L6n="ish to delete 1 row?";var E4s="select";var J0c="preventDefault";var A7n="v";var H4s="DTE_Bubble_Triangle";var P0T='none';var m2c="al";var r9T="isArray";var U1n=B0n;U1n+=g0n;U1n+=d0n;U1n+=e0n;var i1n=O0n;i1n+=v03.l0n;i1n+=E0n;var F1n=c0n;F1n+=u0n;F1n+=Z0n;var D1n=v03.q0n;D1n+=y0n;D1n+=x0n;D1n+=r0n;var h1n=j0n;h1n+=f0n;h1n+=a0n;var l1n=R0n;l1n+=K0n;l1n+=b0n;var z6k=R0n;z6k+=k0n;var G6k=X0n;G6k+=v03.D0n;G6k+=Y0n;G6k+=R0n;var H6k=v03.l0n;H6k+=A0n;H6k+=Q0n;var r3v=N0n;r3v+=L0n;r3v+=R0n;var x3v=n0n;x3v+=v03.D0n;x3v+=I0n;var y3v=V0n;y3v+=w0n;var d2v=S0n;d2v+=C0n;d2v+=v0n;var g6v=m0n;g6v+=t0n;g6v+=p9n;g6v+=H9n;var B6v=G9n;B6v+=z9n;var T6v=P9n;T6v+=q9n;var J6v=m0n;J6v+=l9n;J6v+=s9n;var o6v=M9n;o6v+=h9n;o6v+=D9n;var W6v=F9n;W6v+=i9n;W6v+=U9n;W6v+=R0n;var U6v=W9n;U6v+=o9n;U6v+=J9n;var i6v=T9n;i6v+=B9n;i6v+=g9n;var F6v=d9n;F6v+=e9n;F6v+=O9n;var D6v=E9n;D6v+=c9n;var h6v=u9n;h6v+=Z9n;h6v+=O0n;h6v+=y9n;var M6v=x9n;M6v+=r9n;M6v+=j9n;var s6v=f9n;s6v+=a9n;s6v+=R9n;var l6v=T9n;l6v+=K9n;l6v+=b9n;l6v+=k9n;var q6v=X9n;q6v+=Y9n;var P6v=A9n;P6v+=Q9n;var z6v=T9n;z6v+=N9n;z6v+=L9n;z6v+=n9n;var G6v=I9n;G6v+=V9n;var H6v=w9n;H6v+=S9n;var p6v=w9n;p6v+=C9n;p6v+=v9n;var t9v=w9n;t9v+=m9n;t9v+=t9n;var m9v=p6n;m9v+=H6n;m9v+=G6n;var v9v=z6n;v9v+=P6n;v9v+=q6n;v9v+=l6n;var C9v=w9n;C9v+=O0n;var S9v=s6n;S9v+=x0n;S9v+=M6n;S9v+=h6n;var m8v=D6n;m8v+=F6n;var v8v=i6n;v8v+=U6n;v8v+=k0n;v8v+=v03.l0n;var C8v=s6n;C8v+=W6n;var S8v=o6n;S8v+=t0n;S8v+=J6n;var w8v=T6n;w8v+=B6n;w8v+=g6n;w8v+=d6n;var V8v=e6n;V8v+=y0n;V8v+=O6n;V8v+=R0n;var I8v=E6n;I8v+=c6n;var n8v=u6n;n8v+=v03.H0n;n8v+=R0n;var L8v=e6n;L8v+=Z6n;var N8v=Z0n;N8v+=y6n;N8v+=U6n;N8v+=x6n;var Q8v=r6n;Q8v+=j6n;Q8v+=f6n;var A8v=r6n;A8v+=v03.H0n;A8v+=a6n;var Y8v=e6n;Y8v+=R6n;var X8v=N9n;X8v+=K6n;X8v+=r9n;X8v+=f6n;var k8v=b6n;k8v+=i6n;k8v+=v03.D0n;var b8v=k6n;b8v+=g6n;b8v+=X6n;var K8v=Y6n;K8v+=A6n;var R8v=Q6n;R8v+=N6n;R8v+=L6n;var a8v=n6n;a8v+=I6n;a8v+=R0n;var f8v=O0n;f8v+=y9n;f8v+=V6n;var j8v=w6n;j8v+=S6n;var r8v=C6n;r8v+=v6n;var x8v=m6n;x8v+=t6n;x8v+=p7n;var o8v=o6n;o8v+=v03.D0n;o8v+=H7n;o8v+=f6n;var p4u=G7n;p4u+=z7n;p4u+=P7n;var A5u=q7n;A5u+=l7n;A5u+=q9n;var Y5u=s7n;Y5u+=M7n;var P5u=h7n;P5u+=D7n;P5u+=F7n;P5u+=R0n;var H5u=E6n;H5u+=i7n;H5u+=U7n;H5u+=W7n;var V3u=o7n;V3u+=J7n;var I3u=E6n;I3u+=T7n;I3u+=R0n;var y3u=B7n;y3u+=g7n;y3u+=d7n;var Z3u=N0n;Z3u+=U7n;Z3u+=W7n;var d3u=o6n;d3u+=e7n;d3u+=O7n;d3u+=E7n;var g3u=c7n;g3u+=F7n;g3u+=R0n;var q3u=o6n;q3u+=c6n;q3u+=r0n;q3u+=u7n;var P3u=Z7n;P3u+=y7n;var n2u=c7n;n2u+=x7n;var w7u=E6n;w7u+=r7n;w7u+=y7n;var Q7u=j7n;Q7u+=f7n;Q7u+=a7n;var X7u=R7n;X7u+=K7n;X7u+=b7n;X7u+=R0n;var k7u=h7n;k7u+=k7n;k7u+=y7n;var b7u=E6n;b7u+=X7n;var O7u=Y7n;O7u+=A7n;O7u+=Q7n;O7u+=v03.D0n;var C6u=h7n;C6u+=N7n;var a6u=L7n;a6u+=r9n;a6u+=n7n;var f6u=Z7n;f6u+=y7n;var d6u=o6n;d6u+=I7n;var g6u=s7n;g6u+=V7n;g6u+=E6n;g6u+=R0n;var T6u=E6n;T6u+=r9n;T6u+=w7n;T6u+=M7n;var H6u=h7n;H6u+=k7n;H6u+=S7n;H6u+=x7n;var z9u=o6n;z9u+=C7n;z9u+=v7n;var G9u=h7n;G9u+=N7n;var V0u=m7n;V0u+=t7n;V0u+=p2n;V0u+=H2n;var F1u=G2n;F1u+=z2n;F1u+=l6n;var D1u=Z7n;D1u+=S7n;D1u+=F7n;D1u+=R0n;var U8u=v03.H0n;U8u+=P2n;var P8u=E6n;P8u+=v03.i0n;P8u+=q2n;var H8u=R0n;H8u+=r9n;H8u+=r9n;H8u+=l6n;var w4a=l2n;w4a+=s2n;w4a+=M2n;var V4a=k7n;V4a+=k0n;var I4a=h2n;I4a+=D2n;I4a+=F2n;var N4a=i2n;N4a+=U2n;var a4a=r7n;a4a+=W2n;a4a+=U6n;a4a+=o2n;var f4a=J2n;f4a+=T2n;f4a+=B2n;var c4a=g2n;c4a+=d2n;var E4a=A7n;E4a+=v03.i0n;E4a+=x0n;var W4a=t7n;W4a+=e2n;var U4a=E6n;U4a+=r7n;U4a+=v03.D0n;U4a+=O2n;var i4a=E2n;i4a+=c2n;var p4a=u2n;p4a+=Z2n;var t5a=h7n;t5a+=y2n;t5a+=W7n;var w5a=a0n;w5a+=x2n;var V5a=Z7n;V5a+=r2n;V5a+=v03.D0n;V5a+=x7n;var y5a=j2n;y5a+=R0n;var Z5a=Z7n;Z5a+=v03.D0n;Z5a+=k7n;Z5a+=M7n;var B5a=k7n;B5a+=r9n;B5a+=n7n;var T5a=c7n;T5a+=x7n;var P5a=N0n;P5a+=O2n;var H5a=k7n;H5a+=k0n;H5a+=R0n;var w3a=f2n;w3a+=R0n;var N3a=u9n;N3a+=Z0n;N3a+=R0n;N3a+=v03.D0n;var Q3a=h7n;Q3a+=k7n;Q3a+=S7n;Q3a+=x7n;var K3a=u9n;K3a+=a2n;var R3a=h7n;R3a+=k7n;R3a+=v03.D0n;R3a+=O2n;var u3a=s7n;u3a+=v03.D0n;u3a+=F7n;u3a+=R0n;var j2a=R2n;j2a+=R0n;var c2a=y0n;c2a+=v03.l0n;c2a+=a0n;var O2a=E6n;O2a+=K2n;O2a+=F7n;O2a+=R0n;var W2a=b2n;W2a+=k2n;W2a+=a0n;var U2a=E6n;U2a+=r7n;U2a+=y7n;var i2a=v03.q0n;i2a+=y0n;i2a+=x0n;i2a+=R0n;var D2a=E6n;D2a+=r9n;D2a+=D7n;D2a+=x7n;var q2a=R0n;q2a+=X2n;q2a+=k7n;q2a+=r9n;var P2a=s7n;P2a+=M7n;var t7a=Q7n;t7a+=Y2n;var m7a=E6n;m7a+=i7n;m7a+=O2n;var n7a=h7n;n7a+=D7n;n7a+=F7n;n7a+=R0n;var N7a=Z7n;N7a+=S7n;N7a+=f6n;N7a+=W7n;var Y7a=A2n;Y7a+=Q2n;Y7a+=N2n;Y7a+=L2n;var b7a=v03.l0n;b7a+=n2n;var a7a=A2n;a7a+=I2n;a7a+=k2n;var f7a=Z7n;f7a+=V2n;f7a+=E6n;f7a+=R0n;var c7a=v03.l0n;c7a+=w2n;c7a+=f6n;var A6a=v03.l0n;A6a+=R0n;A6a+=S2n;A6a+=C2n;var b6a=s7n;b6a+=M7n;var D6a=v2n;D6a+=R0n;D6a+=I6n;D6a+=R0n;var h6a=h7n;h6a+=m2n;h6a+=k7n;h6a+=M7n;var v9a=t2n;v9a+=r9n;var C9a=Z7n;C9a+=y7n;var e9a=h7n;e9a+=w7n;e9a+=v03.D0n;e9a+=x7n;var z0a=p3n;z0a+=q9n;var G0a=c7n;G0a+=f6n;G0a+=W7n;var t1a=H3n;t1a+=G3n;t1a+=z3n;t1a+=v03.l0n;var v1a=v03.i0n;v1a+=P3n;v1a+=v03.i0n;v1a+=q3n;var C1a=s7n;C1a+=V7n;C1a+=W7n;var e31=r9n;e31+=Z2n;var d31=v03.i0n;d31+=x0n;d31+=x0n;var g31=l3n;g31+=X6n;var B31=s6n;B31+=x0n;B31+=k7n;B31+=s3n;var T31=M3n;T31+=h3n;T31+=R0n;var J31=t0n;J31+=x0n;J31+=v03.H0n;J31+=r9n;var o31=D3n;o31+=F3n;var W31=i3n;W31+=U3n;var U31=W3n;U31+=R0n;U31+=o3n;var i31=t0n;i31+=J3n;var F31=T3n;F31+=x0n;F31+=a0n;var D31=S0n;D31+=B3n;var h31=c6n;h31+=g3n;var M31=d3n;M31+=e3n;M31+=O3n;M31+=r9n;var s31=c6n;s31+=k7n;s31+=E3n;s31+=o3n;var l31=c6n;l31+=c3n;l31+=a0n;var q31=v03.l0n;q31+=k7n;q31+=c6n;var P31=c6n;P31+=c3n;P31+=a0n;var z31=u3n;z31+=R0n;z31+=Z3n;var G31=c6n;G31+=k7n;G31+=E3n;G31+=o3n;var H31=y3n;H31+=a0n;var p31=x3n;p31+=v03.l0n;p31+=r3n;var n01=j3n;n01+=l6n;var L01=v03.q0n;L01+=k0n;var Y01=f3n;Y01+=a3n;Y01+=R3n;'use strict';v03.Z11=function(u11){if(v03&&u11)return v03.e81(u11);};(function(){var X3n="tTime";var w3n="se ";var m3n='for Editor, please see https://editor.datatables.net/purchase';var p0n=1568505600;var P5n="87";var V3n=" a licen";var L3n="872f";var v1n=1000;var K3n="7";var t3n='Editor - Trial expired';var p5n=" re";var m1n=9596;var b3n="9";var C3n='Thank you for trying DataTables Editor\n\n';var H5n="mainin";var v3n="cad1";var z5n="45";var S3n="cf2";var n3n="Your ";var I3n="trial has now expired. To purchase";var N3n="3a23";var l5n='DataTables Editor trial info - ';var Y3n="723";var Q3n="ceil";var A1n=49;var A3n="3d6";var q5n="log";var a01=B0n;a01+=K3n;a01+=b3n;a01+=v03.z0n;var f01=G3n;f01+=x2n;f01+=k3n;var j01=G3n;j01+=R0n;j01+=X3n;var r01=s6n;r01+=Y3n;var x01=v03.H0n;x01+=v03.G0n;var y01=A3n;y01+=b3n;v03.O01=function(e01){if(v03&&e01)return v03.O81(e01);};v03.W01=function(U01){if(v03&&U01)return v03.e81(U01);};v03.l01=function(q01){if(v03)return v03.e81(q01);};v03.m11=function(v11){if(v03)return v03.O81(v11);};v03.L11=function(N11){if(v03&&N11)return v03.e81(N11);};v03.K11=function(R11){if(v03&&R11)return v03.e81(R11);};v03.B11=function(T11){if(v03)return v03.e81(T11);};v03[v03.B11(y01)?x01:v03.s0n]();var remaining=Math[v03.Z11(r01)?v03.s0n:Q3n]((new Date(p0n*v1n)[j01]()-new Date()[f01]())/((v03.K11(N3n)?m1n:v1n)*(v03.L11(L3n)?A1n:L1n)*(v03.m11(a01)?O1n:L1n)*j1n));if(remaining<=W1n){var K01=n3n;K01+=I3n;K01+=V3n;K01+=w3n;var R01=B0n;R01+=S3n;alert((v03.l01(R01)?v03.s0n:C3n)+(v03.W01(v3n)?v03.s0n:K01)+m3n);throw t3n;}else if(remaining<=d1n){var X01=p5n;X01+=H5n;X01+=G3n;var k01=G5n;k01+=X0n;k01+=f6n;var b01=z5n;b01+=P5n;console[v03.O01(b01)?v03.s0n:q5n](l5n+remaining+k01+(remaining===o1n?s5n:M5n)+X01);}}());var DataTable=$[h5n][D5n];if(!DataTable||!DataTable[F5n]||!DataTable[Y01](i5n)){var A01=U5n;A01+=W5n;A01+=o5n;A01+=J5n;throw A01;}var Editor=function(opts){var B5n="tor must be i";var T5n="DataTables Edi";var g5n="nitialised as a 'new' instance'";var N01=v03.i0n;N01+=v03.G0n;if(!(this instanceof Editor)){var Q01=T5n;Q01+=B5n;Q01+=g5n;alert(Q01);}v03[N01]();this[d5n](opts);};DataTable[e5n]=Editor;$[L01][O5n][n01]=Editor;var _editor_el=function(dis,ctx){var u5n="*[";var Z5n="data-dte-e=";var V01=E5n;V01+=c5n;var I01=u5n;I01+=Z5n;I01+=E5n;if(ctx===undefined){ctx=document;}v03[y5n]();return $(I01+dis+V01,ctx);};var __inlineCounter=W1n;var _pluck=function(a,prop){var w01=R0n;w01+=v03.i0n;w01+=x5n;var out=[];v03[y5n]();$[w01](a,function(idx,el){var S01=E6n;S01+=v03.H0n;S01+=a0n;S01+=r5n;v03[y5n]();out[S01](el[prop]);});return out;};var _api_file=function(name,id){var R5n="wn file";var K5n=" id ";var f5n="n table";var a5n="Unkno";var C01=v03.i0n;C01+=v03.G0n;var table=this[j5n](name);var file=table[id];v03[C01]();if(!file){var m01=G5n;m01+=y0n;m01+=f5n;m01+=G5n;var v01=a5n;v01+=R5n;v01+=K5n;throw v01+id+m01+name;}return table[id];};var _api_files=function(name){var X5n='Unknown file table name: ';if(!name){var t01=v03.q0n;t01+=b5n;return Editor[t01];}var table=Editor[j5n][name];v03[k5n]();if(!table){throw X5n+name;}return table;};var _objectKeys=function(o){var Y5n="hasOwnProperty";var out=[];for(var key in o){if(o[Y5n](key)){out[A5n](key);}}return out;};var _deepCompare=function(o1,o2){var N5n="ob";var L5n="je";var z91=k2n;z91+=G6n;z91+=v03.D0n;z91+=r5n;var G91=k2n;G91+=k0n;G91+=G3n;G91+=Q5n;var H91=N5n;H91+=L5n;H91+=n5n;var p91=I5n;p91+=s6n;p91+=v03.D0n;if(typeof o1!==p91||typeof o2!==H91){return o1==o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[G91]!==o2Props[z91]){return V5n;}for(var i=W1n,ien=o1Props[w5n];i<ien;i++){var P91=N5n;P91+=S5n;var propName=o1Props[i];if(typeof o1[propName]===P91){if(!_deepCompare(o1[propName],o2[propName])){return V5n;}}else if(o1[propName]!=o2[propName]){return V5n;}}v03[k5n]();return C5n;};Editor[f0n]=function(opts,classes,host){var Q4n="<div data-dte-e=\"input\" class";var n4n="el>";var Z4n="restor";var a4n="</s";var q4n="sg-";var P1T="repend";var x4n="<div data-dte-e=";var N4n="</l";var W8T="aults";var l8T="From";var B4n="fieldI";var X8T='" for="';var n8T='<div data-dte-e="multi-value" class="';var i1T='msg-multi';var c4n="iv dat";var H4n="msg-";var I4n="<div data-dte-e=\"msg-label\" cl";var Y8T='msg-label';var F8T="settin";var y8T="ame";var k8T='<label data-dte-e="label" class="';var X4n="inputCo";var D1T='label';var T8T="Error adding field - unknown f";var o4n="<div data-dte-e";var S8T='<div data-dte-e="msg-message" class="';var h4n="ontrol";var B8T="ield type ";var m5n="ick";var u8T="Pro";var J4n="=\"field-processing\" class=\"";var q1T="input-";var w8T='msg-error';var N8T='<div data-dte-e="input-control" class="';var E8T="dataProp";var l1T="control";var P4n="-labe";var m8T='<div data-dte-e="msg-info" class="';var Y4n="ntrol";var t8T='msg-info';var s1T="non";var t4n="fix";var G8T="iv class=\"";var O8T='DTE_Field_';var m4n="namePre";var q8T="oData";var u4n="a-dte-e=\"msg-error\" class=";var l4n="inf";var M4n="put-c";var z8T="nSetObjectDataFn";var H1T='"><span/></div>';var z4n="msg";var F1T='multi-value';var j4n="\" clas";var U1T='field-processing';var s8T="Dat";var r4n="\"msg-multi";var p4n="i-i";var b4n="\"multi-info\" class";var C8T='msg-message';var H8T="efix";var y4n="multiR";var K4n="<span data-dte-e=";var u61=R0n;u61+=v5n;u61+=r5n;var E61=s6n;E61+=x0n;E61+=m5n;var O61=k7n;O61+=k0n;var J61=c6n;J61+=v03.H0n;J61+=x0n;J61+=t7n;var o61=t5n;o61+=p4n;o61+=R9n;var W61=H4n;W61+=G4n;W61+=R0n;var U61=z4n;U61+=P4n;U61+=x0n;var i61=c6n;i61+=q4n;i61+=l4n;i61+=k7n;var F61=s4n;F61+=M4n;F61+=h4n;var D61=v03.l0n;D61+=k7n;D61+=c6n;var h61=T3n;h61+=x0n;h61+=a0n;var M61=v03.l0n;M61+=D4n;var P61=v2n;P61+=R0n;P61+=F4n;var z61=i4n;z61+=U4n;z61+=y0n;z61+=W4n;var G61=o4n;G61+=J4n;var H61=i4n;H61+=T4n;H61+=W4n;var p61=B4n;p61+=R9n;var t91=E5n;t91+=g4n;var m91=d4n;m91+=e4n;m91+=O4n;var v91=E4n;v91+=c4n;v91+=u4n;v91+=E5n;var C91=e4n;C91+=A2n;C91+=W4n;var S91=Z4n;S91+=R0n;var w91=y4n;w91+=j9n;var V91=x4n;V91+=r4n;V91+=j4n;V91+=f4n;var I91=a4n;I91+=E6n;I91+=R4n;I91+=g4n;var n91=e7n;n91+=O7n;n91+=E7n;var L91=K4n;L91+=b4n;L91+=k4n;var N91=t7n;N91+=e2n;var Q91=E5n;Q91+=g4n;var A91=X4n;A91+=Y4n;var Y91=E5n;Y91+=g4n;var X91=y0n;X91+=A4n;X91+=v03.H0n;X91+=v03.D0n;var k91=Q4n;k91+=k4n;var b91=N4n;b91+=L4n;b91+=n4n;var K91=I4n;K91+=V4n;var R91=x0n;R91+=v03.i0n;R91+=w4n;var a91=E5n;a91+=g4n;var f91=y0n;f91+=v03.l0n;var j91=S4n;j91+=v03.q0n;j91+=C4n;var r91=v4n;r91+=Q9n;var x91=m4n;x91+=t4n;var y91=M7n;y91+=p8T;y91+=r9n;y91+=H8T;var Z91=i4n;Z91+=v03.l0n;Z91+=G8T;var u91=o6n;u91+=v03.q0n;u91+=z8T;var c91=P8T;c91+=u6n;c91+=q8T;var e91=P8T;e91+=l8T;e91+=s8T;e91+=v03.i0n;var d91=k7n;d91+=M8T;d91+=h8T;var B91=v03.l0n;B91+=v03.i0n;B91+=v03.D0n;B91+=v03.i0n;var W91=y0n;W91+=v03.l0n;var U91=V7n;U91+=W7n;var i91=D8T;i91+=r0n;var F91=F8T;F91+=i8T;var h91=V7n;h91+=W7n;var M91=v03.l0n;M91+=U8T;M91+=W8T;var s91=V0n;s91+=R0n;s91+=k0n;s91+=v03.l0n;var l91=c6n;l91+=j6n;l91+=t7n;var q91=y0n;q91+=o8T;q91+=k0n;var that=this;var multiI18n=host[q91][l91];opts=$[s91](C5n,{},Editor[f0n][M91],opts);if(!Editor[J8T][opts[h91]]){var D91=T8T;D91+=B8T;throw D91+opts[M7n];}this[a0n]=$[g8T]({},Editor[f0n][F91],{type:Editor[i91][opts[U91]],name:opts[d8T],classes:classes,host:host,opts:opts,multiValue:V5n});if(!opts[W91]){var o91=k0n;o91+=e8T;o91+=R0n;opts[H7n]=O8T+opts[o91];}if(opts[E8T]){var T91=c8T;T91+=v03.i0n;T91+=u8T;T91+=E6n;var J91=v03.l0n;J91+=Z8T;opts[J91]=opts[T91];}if(opts[B91]===s5n){var g91=k0n;g91+=y8T;opts[x8T]=opts[g91];}var dtPrivateApi=DataTable[V0n][d91];this[e91]=function(d){var f8T='editor';var r8T="_fnGetObje";var j8T="ctDataFn";var E91=X0n;E91+=v03.D0n;E91+=v03.i0n;var O91=r8T;O91+=j8T;return dtPrivateApi[O91](opts[E91])(d,f8T);};this[c91]=dtPrivateApi[u91](opts[x8T]);var template=$(Z91+classes[a8T]+R8T+classes[y91]+opts[M7n]+R8T+classes[x91]+opts[d8T]+R8T+opts[K8T]+b8T+k8T+classes[r91]+X8T+Editor[j91](opts[f91])+a91+opts[R91]+K91+classes[Y8T]+b8T+opts[A8T]+Q8T+b91+k91+classes[X91]+Y91+N8T+classes[A91]+L8T+n8T+classes[I8T]+Q91+multiI18n[N91]+L91+classes[n91]+b8T+multiI18n[V8T]+I91+Q8T+V91+classes[w91]+b8T+multiI18n[S91]+C91+v91+classes[w8T]+m91+S8T+classes[C8T]+t91+opts[v8T]+Q8T+m8T+classes[t8T]+b8T+opts[p61]+Q8T+H61+G61+classes[p1T]+H1T+z61);var input=this[G1T](P61,opts);if(input!==z1T){var l61=E6n;l61+=P1T;var q61=q1T;q61+=l1T;_editor_el(q61,template)[l61](input);}else{var s61=s1T;s61+=R0n;template[M1T](h1T,s61);}this[M61]=$[g8T](C5n,{},Editor[f0n][h61][D61],{container:template,inputControl:_editor_el(F61,template),label:_editor_el(D1T,template),fieldInfo:_editor_el(i61,template),labelInfo:_editor_el(U61,template),fieldError:_editor_el(w8T,template),fieldMessage:_editor_el(W61,template),multi:_editor_el(F1T,template),multiReturn:_editor_el(i1T,template),multiInfo:_editor_el(o61,template),processing:_editor_el(U1T,template)});this[W1T][J61][Z6n](o1T,function(){var B1T="multiEdi";var d1T="opt";var J1T="ha";var T1T="sClass";var d61=J1T;d61+=T1T;var g61=B1T;g61+=g1T;var B61=d1T;B61+=a0n;var T61=v03.H0n;T61+=v03.G0n;v03[T61]();if(that[a0n][B61][g61]&&!template[d61](classes[e1T])&&opts[M7n]!==O1T){var e61=E1T;e61+=x0n;that[e61](s5n);that[c1T]();}});this[W1T][u1T][O61](E61,function(){var Z1T="ltiRestor";var c61=e7n;c61+=Z1T;c61+=R0n;that[c61]();});$[u61](this[a0n][M7n],function(name,fn){var y1T="unc";var Z61=v03.q0n;Z61+=y1T;Z61+=x1T;v03[y5n]();if(typeof fn===Z61&&that[name]===undefined){that[name]=function(){var f1T="_ty";var x61=v03.i0n;x61+=r1T;x61+=j1T;var y61=f1T;y61+=W7n;y61+=N9n;y61+=k0n;var args=Array[a1T][R1T][K1T](arguments);args[b1T](name);var ret=that[y61][x61](that,args);return ret===undefined?that:ret;};}});};Editor[f0n][a1T]={def:function(set){var L1T="def";var Q1T="au";var N1T='default';var Y1T="nc";var opts=this[a0n][k1T];if(set===undefined){var f61=X1T;f61+=Y1T;f61+=A1T;f61+=k0n;var j61=v03.l0n;j61+=U8T;var r61=v03.l0n;r61+=U8T;r61+=Q1T;r61+=O7n;var def=opts[r61]!==undefined?opts[N1T]:opts[j61];return typeof def===f61?def():def;}opts[L1T]=set;return this;},disable:function(){var I1T="sse";var n1T="cla";var b61=E9n;b61+=L4n;b61+=k2n;var K61=n1T;K61+=I1T;K61+=a0n;var R61=V1T;R61+=w1T;var a61=v03.l0n;a61+=D4n;this[a61][S1T][R61](this[a0n][K61][e1T]);v03[y5n]();this[G1T](b61);return this;},displayed:function(){var v1T="gth";var C1T="pl";var t1T="par";var N61=E9n;N61+=C1T;N61+=v03.i0n;N61+=f6n;var Q61=s6n;Q61+=a0n;Q61+=a0n;var A61=x0n;A61+=R0n;A61+=k0n;A61+=v1T;var Y61=t0n;Y61+=m1T;var X61=t1T;X61+=C2n;X61+=a0n;var k61=p0T;k61+=H0T;k61+=G0T;k61+=z0T;var container=this[W1T][k61];return container[X61](Y61)[A61]&&container[Q61](N61)!=P0T?C5n:V5n;},enable:function(){var q0T="enab";var V61=v03.i0n;V61+=v03.G0n;var I61=q0T;I61+=k2n;var n61=l0T;n61+=s0T;var L61=M3n;L61+=v03.i0n;L61+=a0n;L61+=h6n;this[W1T][S1T][M0T](this[a0n][L61][n61]);this[G1T](I61);v03[V61]();return this;},enabled:function(){var h0T="classe";var D0T="asCla";var C61=h0T;C61+=a0n;var S61=r5n;S61+=D0T;S61+=a0n;S61+=a0n;var w61=v03.l0n;w61+=k7n;w61+=c6n;return this[w61][S1T][S61](this[a0n][C61][e1T])===V5n;},error:function(msg,fn){var d0T='errorMessage';var T0T="oveClass";var F0T="_m";var W0T="asse";var P71=F0T;P71+=a0n;P71+=G3n;var z71=i0T;z71+=x7n;z71+=U0T;var v61=s6n;v61+=x0n;v61+=W0T;v61+=a0n;var classes=this[a0n][v61];if(msg){var t61=z0T;t61+=r9n;t61+=l6n;var m61=v03.l0n;m61+=k7n;m61+=c6n;this[m61][S1T][o0T](classes[t61]);}else{var G71=J0T;G71+=T0T;var H71=B0T;H71+=s4n;H71+=z0T;var p71=v03.l0n;p71+=k7n;p71+=c6n;this[p71][H71][G71](classes[g0T]);}this[z71](d0T,msg);return this[P71](this[W1T][e0T],msg,fn);},fieldInfo:function(msg){var O0T="fieldInfo";var s71=v03.l0n;s71+=D4n;var l71=o6n;l71+=c6n;l71+=a0n;l71+=G3n;var q71=v03.H0n;q71+=v03.G0n;v03[q71]();return this[l71](this[s71][O0T],msg);},isMultiValue:function(){var M71=t5n;M71+=E0T;return this[a0n][M71]&&this[a0n][c0T][w5n]!==o1n;},inError:function(){var F71=p0T;F71+=u0T;var D71=v03.l0n;D71+=D4n;var h71=v03.H0n;h71+=v03.G0n;v03[h71]();return this[D71][F71][Z0T](this[a0n][y0T][g0T]);},input:function(){var f0T="extarea";var j0T="ct, t";var r0T="ut, sele";var T71=s6n;T71+=k7n;T71+=u0T;var J71=v03.l0n;J71+=k7n;J71+=c6n;var o71=x0T;o71+=r0T;o71+=j0T;o71+=f0T;var W71=x0T;W71+=a0T;var U71=y0n;U71+=R0T;var i71=K0T;i71+=R0n;v03[k5n]();return this[a0n][i71][U71]?this[G1T](W71):$(o71,this[J71][T71]);},focus:function(){var Y0T='input, select, textarea';var g71=v03.q0n;g71+=k7n;g71+=s6n;g71+=X6n;var B71=v03.D0n;B71+=f6n;B71+=W7n;if(this[a0n][B71][g71]){this[G1T](b0T);}else{var e71=k0T;e71+=v03.D0n;e71+=X0T;var d71=v03.l0n;d71+=k7n;d71+=c6n;$(Y0T,this[d71][e71])[c1T]();}return this;},get:function(){var Q0T='get';var O71=E3n;O71+=v03.q0n;if(this[A0T]()){return undefined;}var val=this[G1T](Q0T);return val!==undefined?val:this[O71]();},hide:function(animate){var N0T="lide";var E71=a0n;E71+=N0T;E71+=L0T;E71+=E6n;var el=this[W1T][S1T];if(animate===undefined){animate=C5n;}if(this[a0n][n0T][I0T]()&&animate&&$[h5n][E71]){el[V0T]();}else{var c71=k0n;c71+=k7n;c71+=k0n;c71+=R0n;el[M1T](h1T,c71);}return this;},label:function(str){var S0T="tm";var r71=v03.i0n;r71+=r1T;r71+=R0n;r71+=w0T;var x71=r5n;x71+=S0T;x71+=x0n;var y71=v03.i0n;y71+=v03.G0n;var u71=v03.l0n;u71+=k7n;u71+=c6n;var label=this[u71][C0T];var labelInfo=this[W1T][A8T][v0T]();if(str===undefined){var Z71=m0T;Z71+=x0n;return label[Z71]();}v03[y71]();label[x71](str);label[r71](labelInfo);return this;},labelInfo:function(msg){var t0T="_ms";var j71=t0T;j71+=G3n;v03[y5n]();return this[j71](this[W1T][A8T],msg);},message:function(msg,fn){var p9T="fieldMessage";var a71=v03.l0n;a71+=k7n;a71+=c6n;var f71=o6n;f71+=c6n;f71+=a0n;f71+=G3n;v03[y5n]();return this[f71](this[a71][p9T],msg,fn);},multiGet:function(id){var H9T="ultiIds";var K71=c6n;K71+=H9T;var R71=v03.H0n;R71+=v03.G0n;var value;var multiValues=this[a0n][G9T];v03[R71]();var multiIds=this[a0n][K71];var isMultiValue=this[A0T]();if(id===undefined){var fieldVal=this[P8T]();value={};for(var i=W1n;i<multiIds[w5n];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else{value=this[P8T]();}return value;},multiRestore:function(){var q9T="ltiValu";var P9T="eCheck";var z9T="_multiValu";var k71=z9T;k71+=P9T;var b71=e7n;b71+=q9T;b71+=R0n;this[a0n][b71]=C5n;this[k71]();},multiSet:function(id,val){var s9T="nObject";var l9T="isPlai";var A71=l9T;A71+=s9T;var Y71=u9n;Y71+=p7n;Y71+=a0n;var X71=v03.i0n;X71+=v03.G0n;var multiValues=this[a0n][G9T];v03[X71]();var multiIds=this[a0n][Y71];if(val===undefined){val=id;id=undefined;}var set=function(idSrc,val){if($[M9T](multiIds)===-o1n){multiIds[A5n](idSrc);}multiValues[idSrc]=val;};if($[A71](val)&&id===undefined){var Q71=R0n;Q71+=v03.i0n;Q71+=s6n;Q71+=r5n;$[Q71](val,function(idSrc,innerVal){var N71=v03.i0n;N71+=v03.G0n;v03[N71]();set(idSrc,innerVal);});}else if(id===undefined){$[h9T](multiIds,function(i,idSrc){set(idSrc,val);});}else{set(id,val);}this[a0n][I8T]=C5n;this[D9T]();return this;},name:function(){var n71=F9T;n71+=i9T;var L71=k7n;L71+=E6n;L71+=Q0n;v03[y5n]();return this[a0n][L71][n71];},node:function(){return this[W1T][S1T][W1n];},processing:function(set){var V71=U9T;V71+=k7n;V71+=R3n;var I71=E6n;I71+=r9n;I71+=k7n;I71+=W9T;this[W1T][I71][M1T](h1T,set?V71:P0T);v03[y5n]();return this;},set:function(val,multiCheck){var o9T="_type";var x9T="entityDecode";var H21=a0n;H21+=x2n;var p21=o9T;p21+=U0T;var m71=k7n;m71+=E6n;m71+=Q0n;var v71=c6n;v71+=j6n;v71+=v03.D0n;v71+=E0T;var decodeFn=function(d){var E9T='<';var u9T='"';var O9T='>';var y9T='\n';var Z9T='\'';var T9T="repl";var C71=r9n;C71+=J9T;C71+=R0n;var S71=T9T;S71+=v03.i0n;S71+=s6n;S71+=R0n;var w71=B9T;w71+=x0n;w71+=g9T;return typeof d!==d9T?d:d[e9T](/&gt;/g,O9T)[w71](/&lt;/g,E9T)[S71](/&amp;/g,c9T)[e9T](/&quot;/g,u9T)[C71](/&#39;/g,Z9T)[e9T](/&#10;/g,y9T);};this[a0n][v71]=V5n;v03[k5n]();var decode=this[a0n][m71][x9T];if(decode===undefined||decode===C5n){if($[r9T](val)){var t71=x0n;t71+=R0n;t71+=G6n;t71+=Q5n;for(var i=W1n,ien=val[t71];i<ien;i++){val[i]=decodeFn(val[i]);}}else{val=decodeFn(val);}}this[p21](H21,val);if(multiCheck===undefined||multiCheck===C5n){this[D9T]();}return this;},show:function(animate){var K9T="ispla";var R9T="Down";var a9T="slide";var P21=v03.q0n;P21+=k0n;var z21=r5n;z21+=k7n;z21+=j9T;var G21=v03.l0n;G21+=k7n;G21+=c6n;var el=this[G21][S1T];if(animate===undefined){animate=C5n;}if(this[a0n][z21][I0T]()&&animate&&$[P21][f9T]){var q21=a9T;q21+=R9T;el[q21]();}else{var l21=v03.l0n;l21+=K9T;l21+=f6n;el[M1T](l21,s5n);}return this;},val:function(val){var s21=v03.H0n;s21+=v03.G0n;v03[s21]();return val===undefined?this[b9T]():this[k9T](val);},compare:function(value,original){var X9T="compare";var compare=this[a0n][k1T][X9T]||_deepCompare;v03[y5n]();return compare(value,original);},dataSrc:function(){return this[a0n][k1T][x8T];},destroy:function(){var Y9T="estroy";var h21=v03.H0n;h21+=v03.G0n;var M21=v03.l0n;M21+=Y9T;this[W1T][S1T][A9T]();this[G1T](M21);v03[h21]();return this;},multiEditable:function(){var L9T="ditable";var N9T="tiE";var i21=Q9T;i21+=N9T;i21+=L9T;var F21=k7n;F21+=E6n;F21+=Q0n;var D21=v03.i0n;D21+=v03.G0n;v03[D21]();return this[a0n][F21][i21];},multiIds:function(){v03[y5n]();return this[a0n][c0T];},multiInfoShown:function(show){var n9T="multiInfo";var W21=v03.l0n;W21+=k7n;W21+=c6n;var U21=v03.i0n;U21+=v03.G0n;v03[U21]();this[W21][n9T][M1T]({display:show?I9T:P0T});},multiReset:function(){var V9T="multiVal";var w9T="ues";var J21=V9T;J21+=w9T;var o21=Q9T;o21+=S9T;this[a0n][o21]=[];this[a0n][J21]={};},submittable:function(){var T21=D3n;T21+=t0n;T21+=C9T;T21+=v03.D0n;return this[a0n][k1T][T21];},valFromData:z1T,valToData:z1T,_errorNode:function(){var B21=v9T;B21+=c6n;return this[B21][e0T];},_msg:function(el,msg,fn){var t9T="ib";var m9T=":vis";var E21=v03.q0n;E21+=k0n;var O21=m9T;O21+=t9T;O21+=x0n;O21+=R0n;var e21=y0n;e21+=a0n;if(msg===undefined){return el[p6T]();}if(typeof msg===v03.o0n){var d21=H6T;d21+=q9n;var g21=M8T;g21+=h8T;var editor=this[a0n][n0T];msg=msg(editor,new DataTable[g21](editor[a0n][d21]));}if(el[G6T]()[e21](O21)&&$[E21][z6T]){var c21=r5n;c21+=v03.D0n;c21+=c6n;c21+=x0n;el[c21](msg);if(msg){el[f9T](fn);}else{el[V0T](fn);}}else{var Z21=t0n;Z21+=P6T;Z21+=R3n;var u21=s6n;u21+=a0n;u21+=a0n;el[p6T](msg||s5n)[u21](h1T,msg?Z21:P0T);if(fn){fn();}}v03[k5n]();return this;},_multiValueCheck:function(){var e6T="toggleClass";var B6T="putCont";var W6T="multiEdit";var J6T="ultiId";var M6T="iInf";var i6T="tiV";var F6T="isMul";var O6T="multiNoEdit";var d6T="inputContr";var o6T="Valu";var w21=e7n;w21+=q6T;var V21=l6T;V21+=e6n;V21+=s6T;V21+=y0n;var I21=t5n;I21+=M6T;I21+=k7n;var n21=v03.l0n;n21+=k7n;n21+=c6n;var L21=c6n;L21+=v03.H0n;L21+=O7n;L21+=y0n;var N21=y0n;N21+=B0n;N21+=h6T;N21+=k0n;var Q21=r5n;Q21+=k7n;Q21+=a0n;Q21+=v03.D0n;var A21=k0n;A21+=k7n;A21+=k0n;A21+=R0n;var Y21=D6T;Y21+=r5n;var f21=F6T;f21+=i6T;f21+=U6T;var r21=W6T;r21+=L4n;r21+=x0n;r21+=R0n;var x21=t5n;x21+=y0n;x21+=o6T;x21+=r0n;var y21=c6n;y21+=J6T;y21+=a0n;var last;var ids=this[a0n][y21];var values=this[a0n][x21];var isMultiValue=this[a0n][I8T];var isMultiEditable=this[a0n][k1T][r21];var val;var different=V5n;if(ids){var j21=k2n;j21+=T6T;for(var i=W1n;i<ids[j21];i++){val=values[ids[i]];if(i>W1n&&!_deepCompare(val,last)){different=C5n;break;}last=val;}}if(different&&isMultiValue||!isMultiEditable&&this[f21]()){var R21=k0n;R21+=k7n;R21+=k0n;R21+=R0n;var a21=s4n;a21+=B6T;a21+=r9n;a21+=g6T;this[W1T][a21][M1T]({display:R21});this[W1T][u9n][M1T]({display:I9T});}else{var k21=k0n;k21+=k7n;k21+=k0n;k21+=R0n;var b21=v03.l0n;b21+=k7n;b21+=c6n;var K21=d6T;K21+=g6T;this[W1T][K21][M1T]({display:I9T});this[b21][u9n][M1T]({display:k21});if(isMultiValue&&!different){var X21=a0n;X21+=R0n;X21+=v03.D0n;this[X21](last,V5n);}}this[W1T][u1T][M1T]({display:ids&&ids[Y21]>o1n&&different&&!isMultiValue?I9T:A21});var i18n=this[a0n][Q21][N21][L21];this[n21][I21][p6T](isMultiEditable?i18n[V8T]:i18n[V21]);this[W1T][w21][e6T](this[a0n][y0T][O6T],!isMultiEditable);this[a0n][n0T][E6T]();return C5n;},_typeFn:function(name){var v21=k7n;v21+=c6T;var C21=u6T;C21+=Z6T;C21+=v03.q0n;C21+=v03.D0n;var S21=h7n;S21+=k7n;S21+=y7n;var args=Array[S21][R1T][K1T](arguments);args[y6T]();args[C21](this[a0n][v21]);var fn=this[a0n][M7n][name];if(fn){var t21=r5n;t21+=k7n;t21+=a0n;t21+=v03.D0n;var m21=x6T;m21+=E6n;m21+=x0n;m21+=f6n;return fn[m21](this[a0n][t21],args);}}};Editor[f0n][p31]={};Editor[f0n][H31]={"className":v03.s0n,"data":v03.s0n,"def":v03.s0n,"fieldInfo":v03.s0n,"id":v03.s0n,"label":v03.s0n,"labelInfo":v03.s0n,"name":z1T,"type":r6T,"message":v03.s0n,"multiEditable":C5n,"submit":C5n};Editor[f0n][G31][j6T]={type:z1T,name:z1T,classes:z1T,opts:z1T,host:z1T};Editor[z31][P31][q31]={container:z1T,label:z1T,labelInfo:z1T,fieldInfo:z1T,fieldError:z1T,fieldMessage:z1T};Editor[l31]={};Editor[s31][M31]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[h31][D31]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[F31][j6T]={"ajaxUrl":z1T,"ajax":z1T,"dataSource":z1T,"domTable":z1T,"opts":z1T,"displayController":z1T,"fields":{},"order":[],"id":-o1n,"displayed":V5n,"processing":V5n,"modifier":z1T,"action":z1T,"idSrc":z1T,"unique":W1n};Editor[f6T][i31]={"label":z1T,"fn":z1T,"className":z1T};Editor[U31][W31]={onReturn:o31,onBlur:a6T,onBackground:J31,onComplete:T31,onEsc:B31,onFieldError:g31,submit:d31,focus:W1n,buttons:C5n,title:C5n,message:C5n,drawType:V5n,scope:e31};Editor[I0T]={};(function(){var R6T="lightb";var k6T="D_Lightbox_Background\"><div/></div>";var C6T="tbo";var D2T='div.DTED_Lightbox_Shown';var N6T="s=\"DTED_Lightbox_Conte";var b6T="iv class=\"DTE";var Q6T=" clas";var V6T="<div class=\"DTED_Lightbox_Contain";var f1n=25;var M7T="_dt";var v2T='<div class="DTED DTED_Lightbox_Wrapper">';var B7T="lTop";var L6T="nt\">";var H7T="_shown";var m2T='<div class="DTED_Lightbox_Close"></div>';var w6T="er\">";var I6T="lass=\"DTED_Lightbox_Content_Wrapper\">";var m51=k0T;m51+=v03.q0n;var v51=R6T;v51+=K6T;var C51=v03.i0n;C51+=v03.G0n;var S51=E4n;S51+=b6T;S51+=k6T;var w51=i4n;w51+=T4n;w51+=W4n;var V51=i4n;V51+=X6T;V51+=v03.l0n;V51+=Y6T;var I51=A6T;I51+=Q6T;I51+=N6T;I51+=L6T;var n51=n6T;n51+=I6T;var L51=V6T;L51+=w6T;var c31=c6n;c31+=b7n;c31+=Q9n;c31+=a0n;var E31=x0n;E31+=S6T;E31+=C6T;E31+=q3n;var O31=v03.l0n;O31+=y0n;O31+=v6T;O31+=R6n;var self;Editor[O31][E31]=$[g8T](C5n,{},Editor[c31][m6T],{"init":function(dte){var u31=o6n;u31+=y0n;u31+=k0n;u31+=t6T;self[u31]();return self;},"open":function(dte,append,callback){var r31=p7T;r31+=r5n;r31+=k7n;r31+=v6n;var x31=s6n;x31+=x0n;x31+=z9n;var y31=x6T;y31+=J7n;y31+=v03.l0n;var Z31=o6n;Z31+=v03.l0n;Z31+=k7n;Z31+=c6n;if(self[H7T]){if(callback){callback();}return;}self[G7T]=dte;var content=self[Z31][z7T];content[P7T]()[v0T]();content[q7T](append)[y31](self[l7T][x31]);self[H7T]=C5n;self[r31](callback);},"close":function(dte,callback){var s7T="hid";var f31=o6n;f31+=s7T;f31+=R0n;var j31=M7T;j31+=R0n;if(!self[H7T]){if(callback){callback();}return;}self[j31]=dte;self[f31](callback);self[H7T]=V5n;},node:function(dte){return self[l7T][a8T][W1n];},"_init":function(){var F7T="backgroun";var W7T="div.DTED_Lightbox";var i7T="opa";var o7T="_Conten";var J7T="_rea";var D7T="ci";var A31=k7n;A31+=h7T;A31+=D7T;A31+=V7n;var Y31=s6n;Y31+=a0n;Y31+=a0n;var X31=F7T;X31+=v03.l0n;var k31=i7T;k31+=D7T;k31+=V7n;var b31=U7T;b31+=r9n;var K31=W7T;K31+=o7T;K31+=v03.D0n;var R31=o6n;R31+=v03.l0n;R31+=D4n;var a31=J7T;a31+=v03.l0n;a31+=f6n;if(self[a31]){return;}var dom=self[R31];dom[z7T]=$(K31,self[l7T][b31]);dom[a8T][M1T](k31,W1n);dom[X31][Y31](A31,W1n);},"_show":function(callback){var K7T="apper";var T7T="scro";var k7T="ight";var g7T="crollT";var R7T="fsetAni";var X7T="ori";var l2T="orientation";var Q7T="x_Mobile";var O7T="click.DT";var L7T='auto';var A7T="DTED_Lightbo";var h2T='<div class="DTED_Lightbox_Shown"/>';var E7T="ED_Lightbox";var x7T="per";var u7T="ground";var i51=T7T;i51+=x0n;i51+=B7T;var F51=t0n;F51+=m1T;var D51=p7T;D51+=g7T;D51+=d7T;var s51=t0n;s51+=y0n;s51+=w0T;var l51=e7T;l51+=z0T;var q51=t0n;q51+=y0n;q51+=k0n;q51+=v03.l0n;var z51=O7T;z51+=E7T;var G51=t0n;G51+=y0n;G51+=k0n;G51+=v03.l0n;var H51=M3n;H51+=z9n;var p51=c7T;p51+=R3n;p51+=u7T;var t31=Z7T;t31+=v03.i0n;t31+=y7T;t31+=r9n;var m31=Z7T;m31+=x6T;m31+=x7T;var v31=x6T;v31+=W7n;v31+=w0T;var C31=r7T;C31+=r9n;C31+=j7T;var S31=v03.i0n;S31+=f7T;var w31=a7T;w31+=R7T;var V31=s6n;V31+=a0n;V31+=a0n;var I31=v6n;I31+=r9n;I31+=K7T;var n31=b7T;n31+=k7T;var L31=s6n;L31+=a0n;L31+=a0n;var Q31=X7T;Q31+=Q7n;Q31+=v03.D0n;Q31+=Y7T;var that=this;var dom=self[l7T];if(window[Q31]!==undefined){var N31=A7T;N31+=Q7T;$(N7T)[o0T](N31);}dom[z7T][L31](n31,L7T);dom[I31][V31]({top:-self[n7T][w31]});$(N7T)[S31](self[l7T][C31])[v31](self[l7T][m31]);self[I7T]();self[G7T][V7T](dom[t31],{opacity:o1n,top:W1n},callback);self[G7T][V7T](dom[p51],{opacity:o1n});setTimeout(function(){var S7T='text-indent';$(w7T)[M1T](S7T,-o1n);},O1n);dom[H51][G51](z51,function(e){var P51=v03.i0n;P51+=v03.G0n;v03[P51]();self[G7T][C7T]();});v03[y5n]();dom[v7T][q51](m7T,function(e){self[G7T][v7T]();});$(t7T,dom[l51])[s51](m7T,function(e){var z2T="backgrou";var p2T="DTED_Ligh";var H2T="tbox_Content_Wrapper";var M51=p2T;M51+=H2T;if($(e[G2T])[Z0T](M51)){var h51=z2T;h51+=w0T;self[G7T][h51]();}});$(window)[P2T](q2T,function(){self[I7T]();});self[D51]=$(F51)[i51]();if(window[l2T]!==undefined){var J51=x6T;J51+=W7n;J51+=k0n;J51+=v03.l0n;var o51=v6n;o51+=s2T;o51+=M2T;var W51=k0n;W51+=m2n;var U51=k0n;U51+=k7n;U51+=v03.D0n;var kids=$(N7T)[P7T]()[U51](dom[v7T])[W51](dom[o51]);$(N7T)[J51](h2T);$(D2T)[q7T](kids);}},"_heightCalc":function(){var e2T="eigh";var U2T="outerHe";var T2T="div.D";var B2T="TE_Hea";var d2T="Padding";var J2T="eight";var F2T="maxHei";var o2T="erH";var O51=F2T;O51+=i2T;O51+=v03.D0n;var e51=U2T;e51+=S6T;e51+=v03.D0n;var d51=W2T;d51+=o2T;d51+=J2T;var g51=T2T;g51+=B2T;g51+=n7n;var B51=g2T;B51+=Z2n;B51+=d2T;var T51=r5n;T51+=e2T;T51+=v03.D0n;var dom=self[l7T];var maxHeight=$(window)[T51]()-self[n7T][B51]*J1n-$(g51,dom[a8T])[d51]()-$(w7T,dom[a8T])[e51]();$(O2T,dom[a8T])[M1T](O51,maxHeight);},"_hide":function(callback){var Z2T="x_Content_Wrapper";var Y2T="htbox_Mobile";var u2T="v.DTED_Lightbo";var x2T="k.DTED_";var A2T="removeCl";var j2T="box";var L2T="entati";var n2T="emov";var X2T="DTED_Lig";var w2T="offsetAni";var r2T="Light";var y2T="clic";var a2T="nbi";var b2T="imat";var k2T="_scr";var N51=E2T;N51+=t0n;N51+=y0n;N51+=w0T;var Q51=v6n;Q51+=r9n;Q51+=c2T;Q51+=z0T;var A51=A2n;A51+=u2T;A51+=Z2T;var Y51=y2T;Y51+=x2T;Y51+=r2T;Y51+=j2T;var X51=v03.H0n;X51+=k0n;X51+=t0n;X51+=f2T;var k51=v03.H0n;k51+=a2T;k51+=w0T;var b51=M3n;b51+=h3n;b51+=R0n;var R51=t0n;R51+=R2T;var a51=K2T;a51+=b2T;a51+=R0n;var f51=M7T;f51+=R0n;var x51=k2T;x51+=g6T;x51+=B7T;var y51=X2T;y51+=Y2T;var Z51=A2T;Z51+=Q2T;var c51=k7n;c51+=N2T;c51+=L2T;c51+=Z6n;var E51=o6n;E51+=v03.l0n;E51+=k7n;E51+=c6n;var dom=self[E51];if(!callback){callback=function(){};}if(window[c51]!==undefined){var u51=r9n;u51+=n2T;u51+=R0n;var show=$(D2T);show[P7T]()[I2T](N7T);show[u51]();}$(N7T)[Z51](y51)[V2T](self[x51]);self[G7T][V7T](dom[a8T],{opacity:W1n,top:self[n7T][w2T]},function(){var j51=v03.H0n;j51+=v03.G0n;var r51=E3n;r51+=H6T;r51+=s6n;r51+=r5n;$(this)[r51]();v03[j51]();callback();});self[f51][a51](dom[R51],{opacity:W1n},function(){var K51=v03.l0n;K51+=S2T;K51+=s6n;K51+=r5n;v03[y5n]();$(this)[K51]();});dom[b51][k51](m7T);dom[v7T][X51](Y51);$(A51,dom[Q51])[N51](m7T);$(window)[C2T](q2T);},"_dte":z1T,"_ready":V5n,"_shown":V5n,"_dom":{"wrapper":$(v2T+L51+n51+I51+Q8T+V51+Q8T+w51),"background":$(S51),"close":$(m2T),"content":z1T}});v03[C51]();self=Editor[I0T][v51];self[m51]={"offsetAni":f1n,"windowPadding":f1n};}());(function(){var p5T="fa";var Q1n=50;var H3T="w\"></div>";var W3T="appendChild";var e4T='<div class="DTED_Envelope_Container"></div>';var L3T="click.";var p3T="<div class=\"DTED_Envelope_Shado";var z3T="TED_Envelop";var s3T="ontroller";var K3T="_cssBackgroundOpacity";var F3T="tent";var N5T="dte";var q3T="per\">";var C1n=600;var t2T="envelo";var O4T='<div class="DTED_Envelope_Background"><div/></div>';var E4T='<div class="DTED_Envelope_Close">&times;</div>';var M3T="envelope";var P3T="e_Wrap";var l3T="splayC";var G3T="<div class=\"DTED D";var j1a=k0T;j1a+=v03.q0n;var r1a=t2T;r1a+=E6n;r1a+=R0n;var x1a=e4n;x1a+=O4n;var y1a=p3T;y1a+=H3T;var Z1a=G3T;Z1a+=z3T;Z1a+=P3T;Z1a+=q3T;var p41=v03.l0n;p41+=y0n;p41+=l3T;p41+=s3T;var t51=V0n;t51+=w0n;var self;Editor[I0T][M3T]=$[t51](C5n,{},Editor[f6T][p41],{"init":function(dte){var H41=h3T;H41+=k0n;H41+=t6T;self[G7T]=dte;v03[k5n]();self[H41]();return self;},"open":function(dte,append,callback){var o3T="_show";var U3T="ildr";var i3T="ontent";var D41=D3T;D41+=D4n;var h41=s6n;h41+=k7n;h41+=k0n;h41+=F3T;var M41=s6n;M41+=i3T;var s41=o6n;s41+=v9T;s41+=c6n;var l41=v03.H0n;l41+=v03.G0n;var q41=E3n;q41+=v03.D0n;q41+=v03.i0n;q41+=x5n;var P41=x5n;P41+=U3T;P41+=R0n;P41+=k0n;var z41=D3T;z41+=D4n;var G41=o6n;G41+=v03.l0n;G41+=v03.D0n;G41+=R0n;self[G41]=dte;$(self[z41][z7T])[P41]()[q41]();v03[l41]();self[s41][M41][W3T](append);self[l7T][h41][W3T](self[D41][C7T]);self[o3T](callback);},"close":function(dte,callback){var J3T="_hi";var i41=J3T;i41+=E3n;var F41=o6n;F41+=v03.l0n;F41+=v03.D0n;F41+=R0n;self[F41]=dte;self[i41](callback);},node:function(dte){var U41=D3T;U41+=k7n;U41+=c6n;return self[U41][a8T][W1n];},"_init":function(){var r3T="tainer";var B3T="tyle";var E3T="ackgr";var j3T="eady";var a3T="visbility";var c3T="ckgroun";var x3T="nvelope_Con";var k3T='visible';var b3T='opacity';var e3T="groun";var O3T="den";var T3T="visbili";var Z3T="div.DTED";var y3T="_E";var K41=T3T;K41+=V7n;var R41=a0n;R41+=B3T;var a41=o6n;a41+=v03.l0n;a41+=k7n;a41+=c6n;var f41=g3T;f41+=f6n;var j41=j9T;j41+=d3T;j41+=R0n;var r41=H3n;r41+=e3T;r41+=v03.l0n;var x41=s6n;x41+=a0n;x41+=a0n;var y41=o6n;y41+=v03.l0n;y41+=k7n;y41+=c6n;var Z41=r5n;Z41+=y0n;Z41+=v03.l0n;Z41+=O3T;var u41=a0n;u41+=v03.D0n;u41+=d3T;u41+=R0n;var c41=t0n;c41+=E3T;c41+=j7T;var E41=o6n;E41+=v03.l0n;E41+=D4n;var O41=o6n;O41+=W1T;var e41=c7T;e41+=c3T;e41+=v03.l0n;var d41=D3T;d41+=k7n;d41+=c6n;var g41=u3T;g41+=v03.l0n;g41+=f6n;var B41=Z7T;B41+=c2T;B41+=z0T;var T41=o6n;T41+=v9T;T41+=c6n;var J41=Z3T;J41+=y3T;J41+=x3T;J41+=r3T;var o41=s6n;o41+=k7n;o41+=k0n;o41+=F3T;var W41=o6n;W41+=r9n;W41+=j3T;if(self[W41]){return;}self[l7T][o41]=$(J41,self[T41][B41])[W1n];document[g41][W3T](self[d41][e41]);document[f3T][W3T](self[O41][a8T]);v03[k5n]();self[E41][c41][u41][a3T]=Z41;self[y41][v7T][R3T][I0T]=I9T;self[K3T]=$(self[l7T][v7T])[x41](b3T);self[l7T][r41][j41][f41]=P0T;self[a41][v7T][R41][K41]=k3T;},"_show":function(callback){var v3T="ck.DTED_Envelope";var Y3T="DTED_E";var h5T="tyl";var J5T="hRow";var n3T="DTED_Envelope";var S3T="ox_Con";var M5T="gro";var w3T="D_Lightb";var a5T=",bo";var z5T="rou";var C3T="tent_Wrapper";var N3T="bin";var s5T="opaci";var m3T="indowScr";var W5T="At";var e5T="opacity";var x5T="adding";var j5T="offsetHei";var A3T="nv";var l5T="kgroun";var c5T="marginLeft";var V3T="div.DTE";var Q3T="elope";var O5T="offsetWidth";var b5T='click.DTED_Envelope';var F5T="rapp";var f5T="ffs";var U5T="_find";var y5T="owP";var X3T="resize.";var D5T="setHeight";var q5T="splay";var H5T="deI";var Z5T='normal';var g5T="rap";var A8a=X3T;A8a+=Y3T;A8a+=A3T;A8a+=Q3T;var Y8a=N3T;Y8a+=v03.l0n;var K8a=L3T;K8a+=n3T;var R8a=t0n;R8a+=y0n;R8a+=w0T;var a8a=I3T;a8a+=y7T;a8a+=r9n;var f8a=o6n;f8a+=v03.l0n;f8a+=k7n;f8a+=c6n;var j8a=V3T;j8a+=w3T;j8a+=S3T;j8a+=C3T;var Z8a=M3n;Z8a+=y0n;Z8a+=v3T;var u8a=t0n;u8a+=y0n;u8a+=k0n;u8a+=v03.l0n;var c8a=M3n;c8a+=k7n;c8a+=a0n;c8a+=R0n;var U8a=v6n;U8a+=m3T;U8a+=t3T;var i8a=p5T;i8a+=H5T;i8a+=k0n;var F8a=R4n;F8a+=y0n;F8a+=G5T;var D8a=r7T;D8a+=z5T;D8a+=k0n;D8a+=v03.l0n;var h8a=t0n;h8a+=P5T;var M8a=A2n;M8a+=q5T;var s8a=c7T;s8a+=s6n;s8a+=l5T;s8a+=v03.l0n;var l8a=o6n;l8a+=v03.l0n;l8a+=k7n;l8a+=c6n;var q8a=s5T;q8a+=v03.D0n;q8a+=f6n;var P8a=H3n;P8a+=M5T;P8a+=v03.H0n;P8a+=w0T;var z8a=E6n;z8a+=q3n;var G8a=v03.D0n;G8a+=k7n;G8a+=E6n;var H8a=a0n;H8a+=h5T;H8a+=R0n;var p8a=E6n;p8a+=q3n;var t41=a7T;t41+=v03.q0n;t41+=D5T;var m41=r2n;m41+=E6n;var v41=r2n;v41+=E6n;var C41=j9T;C41+=d3T;C41+=R0n;var S41=v6n;S41+=F5T;S41+=z0T;var w41=E6n;w41+=q3n;var V41=v6n;V41+=F5T;V41+=R0n;V41+=r9n;var I41=o6n;I41+=W1T;var n41=v6n;n41+=y0n;n41+=M2n;n41+=r5n;var L41=D3T;L41+=D4n;var N41=i5T;N41+=v03.i0n;N41+=f6n;var Q41=U5T;Q41+=W5T;Q41+=o5T;Q41+=J5T;var A41=T5T;A41+=R3n;var Y41=E9n;Y41+=B5T;var X41=v6n;X41+=g5T;X41+=E6n;X41+=z0T;var k41=v03.i0n;k41+=a0T;k41+=k7n;var b41=o6n;b41+=v03.l0n;b41+=D4n;var that=this;var formHeight;if(!callback){callback=function(){};}self[b41][z7T][R3T][d5T]=k41;var style=self[l7T][X41][R3T];style[e5T]=W1n;style[Y41]=A41;var targetRow=self[Q41]();var height=self[I7T]();var width=targetRow[O5T];style[N41]=P0T;style[e5T]=o1n;self[L41][a8T][R3T][n41]=width+E5T;self[I41][V41][R3T][c5T]=-(width/J1n)+w41;self[l7T][S41][C41][v41]=$(targetRow)[u5T]()[m41]+targetRow[t41]+p8a;self[l7T][z7T][H8a][G8a]=-o1n*height-x1n+z8a;self[l7T][P8a][R3T][q8a]=W1n;self[l8a][s8a][R3T][M8a]=h8a;$(self[l7T][D8a])[F8a]({'opacity':self[K3T]},Z5T);$(self[l7T][a8T])[i8a]();if(self[n7T][U8a]){var g8a=g2T;g8a+=y5T;g8a+=x5T;var B8a=p0T;B8a+=r5T;var T8a=j5T;T8a+=i2T;T8a+=v03.D0n;var J8a=v03.D0n;J8a+=k7n;J8a+=E6n;var o8a=k7n;o8a+=f5T;o8a+=R0n;o8a+=v03.D0n;var W8a=p6T;W8a+=a5T;W8a+=R5T;$(W8a)[z6T]({"scrollTop":$(targetRow)[o8a]()[J8a]+targetRow[T8a]-self[B8a][g8a]},function(){var e8a=k0T;e8a+=U6n;e8a+=H0T;var d8a=D3T;d8a+=k7n;d8a+=c6n;v03[k5n]();$(self[d8a][e8a])[z6T]({"top":W1n},C1n,callback);});}else{var E8a=K5T;E8a+=R0n;E8a+=H0T;var O8a=o6n;O8a+=v03.l0n;O8a+=D4n;$(self[O8a][E8a])[z6T]({"top":W1n},C1n,callback);}$(self[l7T][c8a])[u8a](Z8a,function(e){var x8a=M3n;x8a+=z9n;var y8a=D3T;y8a+=U6n;self[y8a][x8a]();});$(self[l7T][v7T])[P2T](b5T,function(e){var r8a=D3T;r8a+=v03.D0n;r8a+=R0n;v03[y5n]();self[r8a][v7T]();});$(j8a,self[f8a][a8a])[R8a](K8a,function(e){var A5T="gr";var Y5T='DTED_Envelope_Content_Wrapper';var k8a=k5T;k8a+=N2n;k8a+=H2n;var b8a=v03.D0n;b8a+=v03.i0n;b8a+=X5T;b8a+=x2n;v03[k5n]();if($(e[b8a])[k8a](Y5T)){var X8a=H3n;X8a+=A5T;X8a+=Q5T;X8a+=w0T;self[G7T][X8a]();}});$(window)[Y8a](A8a,function(){v03[k5n]();self[I7T]();});},"_heightCalc":function(){var w5T="DTE_H";var H4T="heightCalc";var C5T="heigh";var p4T="alc";var L5T="oute";var t5T="ghtC";var m5T="hei";var n5T="rHeig";var P4T='maxHeight';var G4T="windowPadding";var p1a=e7T;p1a+=z0T;var t8a=v03.l0n;t8a+=k7n;t8a+=c6n;var m8a=o6n;m8a+=N5T;var v8a=L5T;v8a+=n5T;v8a+=I5T;var C8a=I3T;C8a+=y7T;C8a+=r9n;var S8a=o6n;S8a+=v03.l0n;S8a+=k7n;S8a+=c6n;var w8a=D3T;w8a+=D4n;var V8a=V5T;V8a+=w5T;V8a+=S5T;V8a+=n7n;var I8a=C5T;I8a+=v03.D0n;var n8a=s6n;n8a+=v5T;n8a+=C2n;var L8a=o6n;L8a+=v03.l0n;L8a+=k7n;L8a+=c6n;var N8a=o6n;N8a+=v03.l0n;N8a+=k7n;N8a+=c6n;var Q8a=m5T;Q8a+=t5T;Q8a+=p4T;var formHeight;formHeight=self[n7T][Q8a]?self[n7T][H4T](self[N8a][a8T]):$(self[L8a][n8a])[P7T]()[I8a]();var maxHeight=$(window)[d5T]()-self[n7T][G4T]*J1n-$(V8a,self[w8a][a8T])[z4T]()-$(w7T,self[S8a][C8a])[v8a]();$(O2T,self[l7T][a8T])[M1T](P4T,maxHeight);return $(self[m8a][t8a][p1a])[z4T]();},"_hide":function(callback){var M4T="unb";var l4T="ick.DTED_Lig";var s4T="htb";var q4T="DTED_Lightbox";var W1a=E2T;W1a+=t0n;W1a+=f2T;var U1a=L3T;U1a+=q4T;var i1a=I3T;i1a+=M2T;var F1a=t0n;F1a+=R2T;var D1a=o6n;D1a+=v03.l0n;D1a+=k7n;D1a+=c6n;var h1a=v03.i0n;h1a+=v03.G0n;var M1a=M3n;M1a+=l4T;M1a+=s4T;M1a+=K6T;var s1a=M4T;s1a+=y0n;s1a+=k0n;s1a+=v03.l0n;var G1a=o6n;G1a+=v03.l0n;G1a+=k7n;G1a+=c6n;var H1a=s6n;H1a+=v5T;H1a+=C2n;if(!callback){callback=function(){};}$(self[l7T][H1a])[z6T]({"top":-(self[G1a][z7T][h4T]+Q1n)},C1n,function(){var F4T="deO";var D4T="norm";var l1a=D4T;l1a+=v03.i0n;l1a+=x0n;var q1a=p5T;q1a+=F4T;q1a+=v03.H0n;q1a+=v03.D0n;var P1a=o6n;P1a+=W1T;var z1a=I3T;z1a+=E6n;z1a+=E6n;z1a+=z0T;$([self[l7T][z1a],self[P1a][v7T]])[q1a](l1a,callback);});$(self[l7T][C7T])[s1a](M1a);v03[h1a]();$(self[D1a][F1a])[C2T](m7T);$(t7T,self[l7T][i1a])[C2T](U1a);$(window)[W1a](q2T);},"_findAttachRow":function(){var B4T="odi";var o4T='head';var g4T="ier";var e1a=v2n;e1a+=S5T;e1a+=U6n;var d1a=i4T;d1a+=k7n;d1a+=k0n;var g1a=o6n;g1a+=N5T;var J1a=s6n;J1a+=k7n;J1a+=k0n;J1a+=v03.q0n;var o1a=v03.q0n;o1a+=k0n;var dt=new $[o1a][D5n][U4T](self[G7T][a0n][g1T]);v03[y5n]();if(self[J1a][W4T]===o4T){var B1a=r5n;B1a+=J4T;var T1a=v03.D0n;T1a+=v03.i0n;T1a+=t0n;T1a+=k2n;return dt[T1a]()[B1a]();}else if(self[g1a][a0n][d1a]===e1a){var O1a=H6T;O1a+=t0n;O1a+=x0n;O1a+=R0n;return dt[O1a]()[T4T]();}else{var u1a=c6n;u1a+=B4T;u1a+=v03.q0n;u1a+=g4T;var c1a=o6n;c1a+=v03.l0n;c1a+=v03.D0n;c1a+=R0n;var E1a=r9n;E1a+=k7n;E1a+=v6n;return dt[E1a](self[c1a][a0n][u1a])[d4T]();}},"_dte":z1T,"_ready":V5n,"_cssBackgroundOpacity":o1n,"_dom":{"wrapper":$(Z1a+y1a+e4T+x1a)[W1n],"background":$(O4T)[W1n],"close":$(E4T)[W1n],"content":z1T}});self=Editor[I0T][r1a];self[j1a]={"windowPadding":Q1n,"heightCalc":z1T,"attach":c4T,"windowScroll":C5n};}());Editor[a1T][V1T]=function(cfg,after){var K4T="Error adding field. The field requires a `name` option";var u4T="isplayReorder";var n4T="ord";var y4T="reverse";var a4T="ourc";var f4T="_dataS";var X4T='initField';var k4T="'. A field already exists with this name";var b4T="Error adding field '";var S1a=o6n;S1a+=v03.l0n;S1a+=u4T;var f1a=y0n;f1a+=a0n;f1a+=Z4T;if($[f1a](cfg)){if(after!==undefined){cfg[y4T]();}for(var i=W1n;i<cfg[w5n];i++){var a1a=v03.i0n;a1a+=v03.l0n;a1a+=v03.l0n;this[a1a](cfg[i],after);}}else{var I1a=v03.q0n;I1a+=x4T;I1a+=x0n;I1a+=r4T;var Y1a=c6n;Y1a+=k7n;Y1a+=E3n;var X1a=j4T;X1a+=Z3n;var k1a=M3n;k1a+=M6n;k1a+=s3n;k1a+=a0n;var b1a=f4T;b1a+=a4T;b1a+=R0n;var K1a=R4T;K1a+=a0n;var R1a=k0n;R1a+=v03.i0n;R1a+=c6n;R1a+=R0n;var name=cfg[R1a];if(name===undefined){throw K4T;}if(this[a0n][K1a][name]){throw b4T+name+k4T;}this[b1a](X4T,cfg);var field=new Editor[f0n](cfg,this[k1a][X1a],this);if(this[a0n][Y1a]){var N1a=R0n;N1a+=v03.i0n;N1a+=s6n;N1a+=r5n;var Q1a=Q9T;Q1a+=Y4T;var A1a=A4T;A1a+=a0n;var editFields=this[a0n][A1a];field[Q1a]();$[N1a](editFields,function(idSrc,edit){var Q4T="iSet";var n1a=v03.l0n;n1a+=R0n;n1a+=v03.q0n;var L1a=t5n;L1a+=Q4T;var val;if(edit[x8T]){val=field[N4T](edit[x8T]);}field[L1a](idSrc,val!==undefined?val:field[n1a]());});}this[a0n][I1a][name]=field;if(after===undefined){var w1a=L4T;w1a+=u2n;var V1a=n4T;V1a+=R0n;V1a+=r9n;this[a0n][V1a][w1a](name);}else if(after===z1T){this[a0n][I4T][b1T](name);}else{var idx=$[M9T](after,this[a0n][I4T]);this[a0n][I4T][V4T](idx+o1n,W1n,name);}}this[S1a](this[I4T]());return this;};Editor[C1a][v1a]=function(newAjax){var m1a=v03.H0n;m1a+=v03.G0n;if(newAjax){this[a0n][w4T]=newAjax;return this;}v03[m1a]();return this[a0n][w4T];};Editor[a1T][t1a]=function(){var v4T="onBackground";var S4T="ubmi";var H0a=a0n;H0a+=S4T;H0a+=v03.D0n;var p0a=s6n;p0a+=P6T;p0a+=a0n;p0a+=R0n;var onBackground=this[a0n][C4T][v4T];if(typeof onBackground===v03.o0n){onBackground(this);}else if(onBackground===m4T){this[t4T]();}else if(onBackground===p0a){this[C7T]();}else if(onBackground===H0a){this[p8c]();}return this;};Editor[a1T][t4T]=function(){this[H8c]();return this;};Editor[G0a][z0a]=function(cells,fieldNames,show,opts){var z8c="ool";var q8c="isPlain";var l8c="Ob";var G8c="vidual";var s0a=f2T;s0a+=y0n;s0a+=G8c;var l0a=t0n;l0a+=z8c;l0a+=P8c;var q0a=q8c;q0a+=l8c;q0a+=S5n;var that=this;if(this[s8c](function(){var P0a=t0n;P0a+=M8c;that[P0a](cells,fieldNames,opts);})){return this;}if($[q0a](fieldNames)){opts=fieldNames;fieldNames=undefined;show=C5n;}else if(typeof fieldNames===l0a){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[h8c](show)){opts=show;show=C5n;}if(show===undefined){show=C5n;}opts=$[g8T]({},this[a0n][D8c][F8c],opts);var editFields=this[i8c](s0a,cells,fieldNames);this[U8c](cells,editFields,W8c,opts,function(){var f8c="ss=\"";var R8c="ssing_Indicator\"><s";var j8c="<div cl";var x8c="dre";var v8c="bubbleNodes";var J8c="deFi";var r8c="</div";var G1c='"><div/></div>';var d8c="eReg";var H1c="bg";var b8c="\" ";var B8c="blePositi";var Y8c="<div ";var o8c="inclu";var I8c="_form";var F1c="prep";var P1c='" />';var D1c="ead";var K8c="pan></div>";var M1c="prepe";var V8c="Op";var e8c="mess";var n8c="esize.";var Z8c="ldr";var O8c="ag";var z1c="pointer";var a8c="div class=\"DTE_Proce";var t0a=o8c;t0a+=J8c;t0a+=T8c;var m0a=o6n;m0a+=c1T;var v0a=p3n;v0a+=B8c;v0a+=Z6n;var C0a=M3n;C0a+=y0n;C0a+=R3n;var n0a=o6n;n0a+=g8c;n0a+=d8c;var L0a=v03.i0n;L0a+=v03.l0n;L0a+=v03.l0n;var N0a=v03.i0n;N0a+=v03.l0n;N0a+=v03.l0n;var k0a=v03.D0n;k0a+=t6T;k0a+=k2n;var R0a=e8c;R0a+=O8c;R0a+=R0n;var a0a=v03.q0n;a0a+=k7n;a0a+=E8c;var f0a=E6n;f0a+=B9T;f0a+=R0n;f0a+=w0T;var j0a=x6T;j0a+=W7n;j0a+=w0T;var r0a=c8c;r0a+=x0n;r0a+=u8c;r0a+=Q7n;var x0a=s6n;x0a+=Z6T;x0a+=Z8c;x0a+=Q7n;var y0a=s6n;y0a+=y8c;y0a+=x8c;y0a+=k0n;var c0a=r8c;c0a+=g4n;var E0a=j8c;E0a+=v03.i0n;E0a+=f8c;var O0a=i4n;O0a+=a8c;O0a+=R8c;O0a+=K8c;var e0a=b8c;e0a+=k8c;var d0a=s6n;d0a+=P6T;d0a+=s3n;var g0a=E5n;g0a+=g4n;var B0a=x0n;B0a+=s4n;B0a+=z0T;var T0a=X8c;T0a+=H2n;T0a+=k4n;var J0a=U7T;J0a+=r9n;var o0a=Y8c;o0a+=A8c;var W0a=Q8c;W0a+=t0n;W0a+=t0n;W0a+=k2n;var U0a=N8c;U0a+=a0n;U0a+=R0n;U0a+=a0n;var i0a=L8c;i0a+=x5n;var F0a=r9n;F0a+=n8c;var D0a=k7n;D0a+=k0n;var h0a=Q8c;h0a+=t0n;h0a+=t0n;h0a+=k2n;var M0a=I8c;M0a+=V8c;M0a+=w8c;var namespace=that[M0a](opts);var ret=that[S8c](h0a);if(!ret){return that;}$(window)[D0a](F0a+namespace,function(){that[C8c]();});var nodes=[];that[a0n][v8c]=nodes[m8c][t8c](nodes,_pluck(editFields,i0a));var classes=that[U0a][W0a];v03[y5n]();var background=$(p1c+classes[H1c]+G1c);var container=$(o0a+classes[J0a]+b8T+T0a+classes[B0a]+b8T+p1c+classes[g1T]+g0a+p1c+classes[d0a]+e0a+O0a+Q8T+Q8T+E0a+classes[z1c]+P1c+c0a);if(show){var Z0a=q1c;Z0a+=f6n;var u0a=u3T;u0a+=R5T;container[I2T](u0a);background[I2T](Z0a);}var liner=container[y0a]()[l1c](W1n);var table=liner[x0a]();var close=table[r0a]();liner[j0a](that[W1T][s1c]);table[f0a](that[W1T][a0a]);if(opts[R0a]){var b0a=v03.l0n;b0a+=k7n;b0a+=c6n;var K0a=M1c;K0a+=w0T;liner[K0a](that[b0a][h1c]);}if(opts[k0a]){var A0a=r5n;A0a+=D1c;A0a+=R0n;A0a+=r9n;var Y0a=v03.l0n;Y0a+=k7n;Y0a+=c6n;var X0a=F1c;X0a+=Q7n;X0a+=v03.l0n;liner[X0a](that[Y0a][A0a]);}if(opts[i1c]){var Q0a=v9T;Q0a+=c6n;table[q7T](that[Q0a][i1c]);}var pair=$()[N0a](container)[L0a](background);that[n0a](function(submitComplete){var I0a=K2T;I0a+=y0n;I0a+=G5T;that[I0a](pair,{opacity:W1n},function(){var W1c="deta";var J1c='resize.';var w0a=U1c;w0a+=k9n;var V0a=W1c;V0a+=x5n;pair[V0a]();$(window)[o1c](J1c+namespace);that[w0a]();});});background[T1c](function(){var S0a=v03.i0n;S0a+=v03.G0n;v03[S0a]();that[t4T]();});close[C0a](function(){v03[y5n]();that[B1c]();});that[v0a]();that[V7T](pair,{opacity:o1n});that[m0a](that[a0n][t0a],opts[c1T]);that[g1c](W8c);});return this;};Editor[a1T][C8c]=function(){var y1n=15;var j1c="div.DTE_";var O1c="wi";var r1c="_Liner";var E1c="bot";var e1c="sses";var Y1c="left";var x1c=".DTE_Bubble";var Z1c="eNod";var c1c="tom";var N1c='below';var L1c='left';var k1c="bottom";var b1c="right";var A1c="outerWidth";var f1c="Bubble";var u1c="lef";var d9a=v03.i0n;d9a+=v03.G0n;var T9a=v03.D0n;T9a+=k7n;T9a+=E6n;var J9a=d1c;J9a+=v03.D0n;J9a+=r5n;var o9a=s6n;o9a+=x0n;o9a+=v03.i0n;o9a+=e1c;var W9a=O1c;W9a+=v03.l0n;W9a+=Q5n;var U9a=r2n;U9a+=E6n;var i9a=E1c;i9a+=c1c;var F9a=r9n;F9a+=y0n;F9a+=G3n;F9a+=I5T;var D9a=d1c;D9a+=Q5n;var h9a=u1c;h9a+=v03.D0n;var G9a=p3n;G9a+=U9T;G9a+=Z1c;G9a+=r0n;var H9a=v03.l0n;H9a+=y1c;H9a+=x1c;H9a+=r1c;var p9a=j1c;p9a+=f1c;var wrapper=$(p9a),liner=$(H9a),nodes=this[a0n][G9a];var position={top:W1n,left:W1n,right:W1n,bottom:W1n};$[h9T](nodes,function(i,node){var R1c="tWidt";var a1c="offs";var M9a=a1c;M9a+=R0n;M9a+=R1c;M9a+=r5n;var s9a=k2n;s9a+=K1c;var l9a=x0n;l9a+=R0n;l9a+=v03.q0n;l9a+=v03.D0n;var q9a=k2n;q9a+=v03.q0n;q9a+=v03.D0n;var P9a=v03.D0n;P9a+=d7T;var z9a=r2n;z9a+=E6n;var pos=$(node)[u5T]();node=$(node)[b9T](W1n);position[z9a]+=pos[P9a];position[q9a]+=pos[l9a];position[b1c]+=pos[s9a]+node[M9a];position[k1c]+=pos[X1c]+node[h4T];});position[X1c]/=nodes[w5n];position[h9a]/=nodes[D9a];position[F9a]/=nodes[w5n];position[i9a]/=nodes[w5n];var top=position[U9a],left=(position[Y1c]+position[b1c])/J1n,width=liner[A1c](),visLeft=left-width/J1n,visRight=visLeft+width,docWidth=$(window)[W9a](),padding=y1n,classes=this[o9a][F8c];wrapper[M1T]({top:top,left:left});if(liner[J9a]&&liner[u5T]()[T9a]<W1n){wrapper[M1T](Q1c,position[k1c])[o0T](N1c);}else{wrapper[M0T](N1c);}if(visRight+padding>docWidth){var B9a=s6n;B9a+=a0n;B9a+=a0n;var diff=visRight-docWidth;liner[B9a](L1c,visLeft<padding?-(visLeft-padding):-(diff+padding));}else{var g9a=x0n;g9a+=R0n;g9a+=v03.q0n;g9a+=v03.D0n;liner[M1T](g9a,visLeft<padding?-(visLeft-padding):W1n);}v03[d9a]();return this;};Editor[e9a][i1c]=function(buttons){var S1c="sic";var w1c="_b";var x9a=n1c;x9a+=E6n;x9a+=v03.D0n;x9a+=f6n;var y9a=t0n;y9a+=a0T;y9a+=v03.D0n;y9a+=I1c;var Z9a=v03.l0n;Z9a+=D4n;var u9a=V1c;u9a+=R6n;var O9a=w1c;O9a+=v03.i0n;O9a+=S1c;var that=this;if(buttons===O9a){var c9a=C1c;c9a+=y0n;c9a+=Z6n;var E9a=v1c;E9a+=m1c;buttons=[{text:this[E9a][this[a0n][c9a]][p8c],action:function(){this[p8c]();}}];}else if(!$[u9a](buttons)){buttons=[buttons];}$(this[Z9a][y9a])[x9a]();$[h9T](buttons,function(i,btn){var s0c="<b";var H0c="ypres";var M0c="ton/>";var P0c="Index";var U0c="Code";var G0c="keyu";var q0c="sName";var F0c='tabindex';var t1c="cli";var z0c="Inde";var S9a=t1c;S9a+=R3n;var w9a=k7n;w9a+=k0n;var I9a=p0c;I9a+=R0n;I9a+=H0c;I9a+=a0n;var n9a=k7n;n9a+=k0n;var Q9a=G0c;Q9a+=E6n;var A9a=v03.D0n;A9a+=L4n;A9a+=z0c;A9a+=q3n;var Y9a=v03.D0n;Y9a+=L4n;Y9a+=P0c;var X9a=v03.i0n;X9a+=v03.D0n;X9a+=v03.D0n;X9a+=r9n;var k9a=M3n;k9a+=M6n;k9a+=q0c;var b9a=l0c;b9a+=k0n;var K9a=v03.q0n;K9a+=k7n;K9a+=r9n;K9a+=c6n;var R9a=s0c;R9a+=a0T;R9a+=M0c;var a9a=v03.i0n;a9a+=v03.G0n;var f9a=U6n;f9a+=q3n;f9a+=v03.D0n;if(typeof btn===d9T){btn={text:btn,action:function(){var j9a=a0n;j9a+=v03.H0n;j9a+=t0n;j9a+=h0c;var r9a=v03.i0n;r9a+=v03.G0n;v03[r9a]();this[j9a]();}};}var text=btn[f9a]||btn[C0T];v03[a9a]();var action=btn[D0c]||btn[h5n];$(R9a,{'class':that[y0T][K9a][b9a]+(btn[K8T]?R8T+btn[k9a]:s5n)})[p6T](typeof text===v03.o0n?text(that):text||s5n)[X9a](F0c,btn[Y9a]!==undefined?btn[A9a]:W1n)[Z6n](Q9a,function(e){var N9a=i0c;N9a+=f6n;N9a+=U0c;v03[y5n]();if(e[N9a]===u1n&&action){var L9a=s6n;L9a+=W0c;action[L9a](that);}})[n9a](I9a,function(e){var V9a=p0c;V9a+=o0c;V9a+=U0c;if(e[V9a]===u1n){e[J0c]();}})[w9a](S9a,function(e){e[J0c]();v03[y5n]();if(action){action[K1T](that);}})[I2T](that[W1T][i1c]);});return this;};Editor[C9a][v9a]=function(fieldName){var u0c="splic";var d0c="eFields";var T0c="rin";var Z0c="includeFields";var g0c="includ";var E0c="pli";var t9a=j9T;t9a+=T0c;t9a+=G3n;var m9a=v03.q0n;m9a+=y0n;m9a+=R0n;m9a+=B0c;var that=this;v03[k5n]();var fields=this[a0n][m9a];if(typeof fieldName===t9a){var q6a=g0c;q6a+=d0c;var P6a=e0c;P6a+=r9n;P6a+=O0c;var z6a=a0n;z6a+=E0c;z6a+=s6n;z6a+=R0n;var G6a=k7n;G6a+=r9n;G6a+=v03.l0n;G6a+=z0T;var H6a=E3n;H6a+=c0c;H6a+=k7n;H6a+=f6n;var p6a=v03.q0n;p6a+=y0n;p6a+=R0n;p6a+=Z3n;that[p6a](fieldName)[H6a]();delete fields[fieldName];var orderIdx=$[M9T](fieldName,this[a0n][I4T]);this[a0n][G6a][z6a](orderIdx,o1n);var includeIdx=$[P6a](fieldName,this[a0n][q6a]);if(includeIdx!==-o1n){var l6a=u0c;l6a+=R0n;this[a0n][Z0c][l6a](includeIdx,o1n);}}else{var s6a=y0c;s6a+=x0c;$[h9T](this[s6a](fieldName),function(i,name){var r0c="cle";var M6a=r0c;M6a+=j0c;that[M6a](name);});}return this;};Editor[h6a][C7T]=function(){this[B1c](V5n);return this;};Editor[a1T][D6a]=function(arg1,arg2,arg3,arg4){var b0c="ock";var k0c="styl";var K0c="_act";var R0c="eac";var Y0c="mai";var f0c="initCr";var K6a=f0c;K6a+=a0c;var y6a=R0c;y6a+=r5n;var Z6a=v03.q0n;Z6a+=f7n;Z6a+=r4T;var u6a=K0c;u6a+=y0n;u6a+=Z6n;u6a+=w1T;var c6a=U9T;c6a+=b0c;var E6a=A2n;E6a+=v6T;E6a+=R6n;var O6a=k0c;O6a+=R0n;var e6a=v03.q0n;e6a+=k7n;e6a+=r9n;e6a+=c6n;var d6a=c6n;d6a+=k7n;d6a+=X0c;var g6a=C1c;g6a+=y0n;g6a+=Z6n;var B6a=Y0c;B6a+=k0n;var T6a=x3n;T6a+=E3n;var o6a=J2n;o6a+=A0c;o6a+=Z3n;o6a+=a0n;var U6a=i0T;U6a+=Q0c;var i6a=v03.H0n;i6a+=v03.G0n;var F6a=b2n;F6a+=T8c;var that=this;var fields=this[a0n][F6a];v03[i6a]();var count=o1n;if(this[U6a](function(){var W6a=v03.H0n;W6a+=v03.G0n;v03[W6a]();that[N0c](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1===L0c){count=arg1;arg1=arg2;arg2=arg3;}this[a0n][o6a]={};for(var i=W1n;i<count;i++){var J6a=v03.q0n;J6a+=x4T;J6a+=x0n;J6a+=r4T;this[a0n][n0c][i]={fields:this[a0n][J6a]};}var argOpts=this[I0c](arg1,arg2,arg3,arg4);this[a0n][T6a]=B6a;this[a0n][g6a]=N0c;this[a0n][d6a]=z1T;this[W1T][e6a][O6a][E6a]=c6a;this[u6a]();this[V0c](this[Z6a]());$[y6a](fields,function(name,field){var w0c="Re";var R6a=v03.l0n;R6a+=U8T;var a6a=a0n;a6a+=R0n;a6a+=v03.D0n;var r6a=e7n;r6a+=q6T;r6a+=w0c;r6a+=k9T;var x6a=v03.i0n;x6a+=v03.G0n;v03[x6a]();field[r6a]();for(var i=W1n;i<count;i++){var f6a=v03.l0n;f6a+=R0n;f6a+=v03.q0n;var j6a=Q9T;j6a+=v03.D0n;j6a+=y0n;j6a+=S0c;field[j6a](i,field[f6a]());}field[a6a](field[R6a]());});this[C0c](K6a,z1T,function(){that[v0c]();that[m0c](argOpts[k1T]);argOpts[t0c]();});return this;};Editor[b6a][p9c]=function(parent){var z9c="ndent";var G9c="undepe";var Y6a=g0n;Y6a+=R0n;Y6a+=E3n;Y6a+=E6n;var k6a=H9c;k6a+=r9n;k6a+=R6n;if($[k6a](parent)){for(var i=W1n,ien=parent[w5n];i<ien;i++){var X6a=G9c;X6a+=z9c;this[X6a](parent[i]);}return this;}var field=this[R4T](parent);$(field[d4T]())[o1c](Y6a);v03[y5n]();return this;};Editor[a1T][A6a]=function(parent,url,opts){var P9c="hang";var e9c="event";var s9c="dependent";var M9c='POST';var h7a=g0n;h7a+=R0n;h7a+=E3n;h7a+=E6n;var M7a=k7n;M7a+=k0n;var s7a=k0n;s7a+=k7n;s7a+=v03.l0n;s7a+=R0n;var I6a=s6n;I6a+=P9c;I6a+=R0n;var n6a=R0n;n6a+=q9c;var L6a=l9c;L6a+=k0n;var N6a=v03.q0n;N6a+=y0n;N6a+=R0n;N6a+=Z3n;if($[r9T](parent)){var Q6a=D6T;Q6a+=r5n;for(var i=W1n,ien=parent[Q6a];i<ien;i++){this[s9c](parent[i],url,opts);}return this;}var that=this;var field=this[N6a](parent);var ajaxOpts={type:M9c,dataType:L6a};opts=$[n6a]({event:I6a,data:z1T,preUpdate:z1T,postUpdate:z1T},opts);var update=function(json){var d9c="stUpdate";var U9c="preUpd";var T9c='disable';var B9c="postUpdate";var i9c="pdate";var J9c='enable';var o9c='show';var W9c='hide';var P7a=R0n;P7a+=v5n;P7a+=r5n;var p7a=h9c;p7a+=l6n;var t6a=x0c;t6a+=a0n;t6a+=D9c;var m6a=A7n;m6a+=v03.i0n;m6a+=x0n;var v6a=F9c;v6a+=X0n;v6a+=U6n;var C6a=N2n;C6a+=w4n;var S6a=S5T;S6a+=s6n;S6a+=r5n;var V6a=h7n;V6a+=R0n;V6a+=L0T;V6a+=i9c;if(opts[V6a]){var w6a=U9c;w6a+=v03.i0n;w6a+=U6n;opts[w6a](json);}v03[k5n]();$[S6a]({labels:C6a,options:v6a,values:m6a,messages:t6a,errors:p7a},function(jsonProp,fieldFn){if(json[jsonProp]){var H7a=R0n;H7a+=v03.i0n;H7a+=x5n;$[H7a](json[jsonProp],function(field,val){var z7a=b2n;z7a+=R0n;z7a+=x0n;z7a+=v03.l0n;var G7a=v03.H0n;G7a+=v03.G0n;v03[G7a]();that[z7a](field)[fieldFn](val);});}});$[P7a]([W9c,o9c,J9c,T9c],function(i,key){var q7a=v03.i0n;q7a+=v03.G0n;v03[q7a]();if(json[key]){that[key](json[key],json[z6T]);}});if(opts[B9c]){var l7a=g9c;l7a+=d9c;opts[l7a](json);}field[p1T](V5n);};$(field[s7a]())[M7a](opts[e9c]+h7a,function(e){var O9c="lu";var E9c="ditFields";var y9c="inObject";var Z9c="isPla";var u9c='data';var B7a=X0n;B7a+=v03.D0n;B7a+=v03.i0n;var T7a=A7n;T7a+=v03.i0n;T7a+=x0n;var J7a=E1T;J7a+=O9c;J7a+=R0n;J7a+=a0n;var o7a=r9n;o7a+=Z2n;o7a+=a0n;var W7a=r9n;W7a+=k7n;W7a+=v6n;W7a+=a0n;var U7a=r9n;U7a+=Z2n;var i7a=R0n;i7a+=E9c;var F7a=r9n;F7a+=k7n;F7a+=v6n;F7a+=a0n;var D7a=D6T;D7a+=r5n;if($(field[d4T]())[c9c](e[G2T])[D7a]===W1n){return;}field[p1T](C5n);var data={};data[F7a]=that[a0n][n0c]?_pluck(that[a0n][i7a],u9c):z1T;data[U7a]=data[W7a]?data[o7a][W1n]:z1T;data[J7a]=that[T7a]();if(opts[B7a]){var ret=opts[x8T](data);if(ret){opts[x8T]=ret;}}if(typeof url===v03.o0n){var o=url(field[P8T](),data,update);if(o){var d7a=Q5n;d7a+=Q7n;var g7a=I5n;g7a+=s6n;g7a+=v03.D0n;if(typeof o===g7a&&typeof o[d7a]===v03.o0n){var e7a=v03.D0n;e7a+=r5n;e7a+=R0n;e7a+=k0n;o[e7a](function(resolved){if(resolved){update(resolved);}});}else{update(o);}}}else{var O7a=Z9c;O7a+=y9c;if($[O7a](url)){var E7a=x9c;E7a+=w0T;$[E7a](ajaxOpts,url);}else{ajaxOpts[r9c]=url;}$[w4T]($[g8T](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[a1T][c7a]=function(){var Y9c="destroy";var f9c="displayCont";var k9c="ppen";var j9c="troy";var a9c="roller";var b9c="clear";var j7a=g0n;j7a+=v03.l0n;j7a+=U6n;var r7a=E3n;r7a+=a0n;r7a+=j9c;var x7a=f9c;x7a+=a9c;var Z7a=v03.D0n;Z7a+=n1c;Z7a+=c2n;var u7a=R9c;u7a+=K9c;if(this[a0n][u7a]){this[C7T]();}this[b9c]();if(this[a0n][Z7a]){var y7a=v03.i0n;y7a+=k9c;y7a+=v03.l0n;$(N7T)[y7a](this[a0n][X9c]);}var controller=this[a0n][x7a];if(controller[r7a]){controller[Y9c](this);}$(document)[o1c](j7a+this[a0n][A9c]);this[W1T]=z1T;this[a0n]=z1T;};Editor[f7a][a7a]=function(name){var R7a=R0n;R7a+=v03.i0n;R7a+=s6n;R7a+=r5n;var that=this;v03[y5n]();$[R7a](this[Q9c](name),function(i,n){var N9c="isable";var K7a=v03.l0n;K7a+=N9c;v03[y5n]();that[R4T](n)[K7a]();});return this;};Editor[a1T][b7a]=function(show){var n9c="ye";var X7a=L9c;X7a+=s3n;if(show===undefined){var k7a=R9c;k7a+=N2n;k7a+=n9c;k7a+=v03.l0n;return this[a0n][k7a];}v03[y5n]();return this[show?I9c:X7a]();};Editor[a1T][Y7a]=function(){var A7a=v03.q0n;A7a+=y0n;A7a+=V9c;A7a+=a0n;v03[k5n]();return $[w9c](this[a0n][A7a],function(field,name){var Q7a=E9n;Q7a+=E6n;Q7a+=K9c;v03[k5n]();return field[Q7a]()?name:z1T;});};Editor[N7a][S9c]=function(){var L7a=v03.i0n;L7a+=v03.G0n;v03[L7a]();return this[a0n][m6T][d4T](this);};Editor[n7a][C9c]=function(items,arg1,arg2,arg3,arg4){var m9c="udAr";var v9c="_cr";var V7a=k7n;V7a+=c6T;var I7a=v9c;I7a+=m9c;I7a+=i8T;var that=this;if(this[s8c](function(){that[C9c](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[I7a](arg1,arg2,arg3,arg4);this[U8c](items,this[i8c](t9c,items),p6c,argOpts[V7a],function(){var G6c="yb";var P6c="_ass";var q6c="mbleMa";var v7a=H6c;v7a+=G6c;v7a+=z6c;v7a+=J7n;var C7a=d7T;C7a+=Q0n;var S7a=P6c;S7a+=R0n;S7a+=q6c;S7a+=s4n;var w7a=v03.H0n;w7a+=v03.G0n;v03[w7a]();that[S7a]();that[m0c](argOpts[C7a]);argOpts[v7a]();});return this;};Editor[m7a][t7a]=function(name){var l6c="fieldNames";var p2a=o6n;p2a+=l6c;var that=this;$[h9T](this[p2a](name),function(i,n){var z2a=Q7n;z2a+=L4n;z2a+=x0n;z2a+=R0n;var G2a=j4T;G2a+=Z3n;var H2a=v03.i0n;H2a+=v03.G0n;v03[H2a]();that[G2a](n)[z2a]();});return this;};Editor[P2a][q2a]=function(name,msg){var s6c="glob";var M6c="alErro";if(msg===undefined){var l2a=s6c;l2a+=M6c;l2a+=r9n;this[h6c](this[W1T][s1c],name);this[a0n][l2a]=name;}else{var s2a=j4T;s2a+=Z3n;this[s2a](name)[g0T](msg);}return this;};Editor[a1T][R4T]=function(name){var F6c="d name -";var D6c="Unknown fiel";var M2a=b2n;M2a+=T8c;var fields=this[a0n][M2a];if(!fields[name]){var h2a=D6c;h2a+=F6c;h2a+=G5n;throw h2a+name;}return fields[name];};Editor[D2a][i6c]=function(){var F2a=v03.q0n;F2a+=f7n;F2a+=r4T;return $[w9c](this[a0n][F2a],function(field,name){v03[y5n]();return name;});};Editor[a1T][i2a]=_api_file;Editor[U2a][W2a]=_api_files;Editor[a1T][b9T]=function(name){var e2a=G3n;e2a+=R0n;e2a+=v03.D0n;var d2a=v03.q0n;d2a+=y0n;d2a+=Q9n;d2a+=v03.l0n;var T2a=H9c;T2a+=s2T;T2a+=f6n;var o2a=v03.H0n;o2a+=v03.G0n;v03[o2a]();var that=this;if(!name){var J2a=S0n;J2a+=r4T;name=this[J2a]();}if($[T2a](name)){var B2a=S5T;B2a+=s6n;B2a+=r5n;var out={};$[B2a](name,function(i,n){var g2a=v03.H0n;g2a+=v03.G0n;v03[g2a]();out[n]=that[R4T](n)[b9T]();});return out;}return this[d2a](name)[e2a]();};Editor[O2a][U6c]=function(names,animate){var W6c="dName";var E2a=R7n;E2a+=Q9n;E2a+=W6c;E2a+=a0n;var that=this;$[h9T](this[E2a](names),function(i,n){that[R4T](n)[U6c](animate);});return this;};Editor[a1T][c2a]=function(includeHash){var Z2a=R0n;Z2a+=o6c;Z2a+=J6c;Z2a+=a0n;var u2a=c6n;u2a+=v03.i0n;u2a+=E6n;return $[u2a](this[a0n][Z2a],function(edit,idSrc){v03[y5n]();return includeHash===C5n?T6c+idSrc:idSrc;});};Editor[a1T][B6c]=function(inNames){var g6c="glo";var e6c="Er";var d6c="alErr";var x2a=g6c;x2a+=t0n;x2a+=d6c;x2a+=l6n;var y2a=v03.l0n;y2a+=k7n;y2a+=c6n;var formError=$(this[y2a][s1c]);if(this[a0n][x2a]){return C5n;}var names=this[Q9c](inNames);for(var i=W1n,ien=names[w5n];i<ien;i++){var r2a=s4n;r2a+=e6c;r2a+=O6c;if(this[R4T](names[i])[r2a]()){return C5n;}}return V5n;};Editor[a1T][j2a]=function(cell,fieldName,opts){var y6c="_da";var x6c="taSourc";var u6c="TE_F";var c6c="v.D";var Z6c="inl";var E6c="nline";var A2a=y0n;A2a+=E6c;var Y2a=o6n;Y2a+=R0n;Y2a+=v03.l0n;Y2a+=t6T;var k2a=A2n;k2a+=c6c;k2a+=u6c;k2a+=J6c;var R2a=Z6c;R2a+=y0n;R2a+=k0n;R2a+=R0n;var a2a=y6c;a2a+=x6c;a2a+=R0n;var f2a=Z6c;f2a+=y0n;f2a+=k0n;f2a+=R0n;var that=this;if($[h8c](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[g8T]({},this[a0n][D8c][f2a],opts);var editFields=this[a2a](r6c,cell,fieldName);var node,field;var countOuter=W1n,countInner;var closed=V5n;var classes=this[y0T][R2a];$[h9T](editFields,function(i,editField){var a6c="e row inl";var j6c="Cannot edit m";var f6c="ore than on";var R6c="ine at a time";var b2a=L8c;b2a+=x5n;if(countOuter>W1n){var K2a=j6c;K2a+=f6c;K2a+=a6c;K2a+=R6c;throw K2a;}node=$(editField[b2a][W1n]);countInner=W1n;$[h9T](editField[K6c],function(j,f){var b6c='Cannot edit more than one field inline at a time';if(countInner>W1n){throw b6c;}field=f;countInner++;});countOuter++;});if($(k2a,node)[w5n]){return this;}if(this[s8c](function(){var k6c="ine";var X2a=Z6c;X2a+=k6c;that[X2a](cell,fieldName,opts);})){return this;}this[Y2a](cell,editFields,A2a,opts,function(){var w6c="v clas";var A6c="rror";var X6c="nl";var m6c="liner";var z7c="eplace";var C6c="eope";var V6c="<di";var n6c="v.";var t6c='" style="width:';var Y6c="ormE";var S6c="tach";var H7c='<div class="DTE_Processing_Indicator"><span/></div>';var v6c="contents";var Q6c="repla";var e3a=y0n;e3a+=X6c;e3a+=s4n;e3a+=R0n;var d3a=l3n;d3a+=v03.H0n;d3a+=a0n;var z3a=v03.q0n;z3a+=Y6c;z3a+=A6c;var G3a=v03.i0n;G3a+=f7T;var H3a=l6T;H3a+=E3n;var p3a=v03.i0n;p3a+=E6n;p3a+=W7n;p3a+=w0T;var t2a=Q6c;t2a+=N6c;var m2a=L6c;m2a+=k0n;m2a+=R0n;m2a+=r9n;var v2a=v03.l0n;v2a+=y0n;v2a+=n6c;var C2a=I6c;C2a+=W4n;var S2a=E5n;S2a+=X6T;S2a+=g4n;var w2a=i4n;w2a+=X6T;w2a+=O4n;var V2a=E5T;V2a+=d4n;var I2a=E5n;I2a+=g4n;var n2a=V6c;n2a+=w6c;n2a+=f4n;var L2a=E3n;L2a+=S6c;var N2a=s4n;N2a+=x0n;N2a+=s4n;N2a+=R0n;var Q2a=B7n;Q2a+=r9n;Q2a+=C6c;Q2a+=k0n;var namespace=that[m0c](opts);var ret=that[Q2a](N2a);if(!ret){return that;}var children=node[v6c]()[L2a]();node[q7T]($(n2a+classes[a8T]+I2a+p1c+classes[m6c]+t6c+node[p7c]()+V2a+H7c+w2a+p1c+classes[i1c]+S2a+C2a));node[c9c](v2a+classes[m2a][t2a](/ /g,G7c))[p3a](field[H3a]())[G3a](that[W1T][z3a]);if(opts[i1c]){var l3a=t0n;l3a+=J3n;l3a+=a0n;var q3a=v03.l0n;q3a+=k7n;q3a+=c6n;var P3a=r9n;P3a+=z7c;node[c9c](P7c+classes[i1c][P3a](/ /g,G7c))[q7T](that[q3a][l3a]);}that[q7c](function(submitComplete,action){var h7c="conte";var s7c="arDynamic";var l7c="_cle";var h3a=l7c;h3a+=s7c;h3a+=k9n;var s3a=k7n;s3a+=v03.q0n;s3a+=v03.q0n;closed=C5n;$(document)[s3a](o1T+namespace);v03[k5n]();if(!submitComplete||action!==M7c){var M3a=h7c;M3a+=D7c;node[M3a]()[v0T]();node[q7T](children);}that[h3a]();});setTimeout(function(){var F3a=s6n;F3a+=x0n;F3a+=y0n;F3a+=R3n;var D3a=k7n;D3a+=k0n;if(closed){return;}$(document)[D3a](F3a+namespace,function(e){var U7c="peFn";var J7c='owns';var W7c="addBac";var i7c="rray";var o7c='andSelf';var g3a=h7T;g3a+=F7c;g3a+=D7c;var B3a=H6T;B3a+=r9n;B3a+=b9T;var T3a=s4n;T3a+=M8T;T3a+=i7c;var J3a=v03.D0n;J3a+=v03.i0n;J3a+=X5T;J3a+=x2n;var o3a=o6n;o3a+=V7n;o3a+=U7c;var W3a=W7c;W3a+=p0c;var U3a=W7c;U3a+=p0c;var i3a=v03.q0n;i3a+=k0n;var back=$[i3a][U3a]?W3a:o7c;if(!field[o3a](J7c,e[J3a])&&$[T3a](node[W1n],$(e[B3a])[g3a]()[back]())===-o1n){that[t4T]();}});},W1n);v03[k5n]();that[T7c]([field],opts[d3a]);that[g1c](e3a);});return this;};Editor[a1T][v8T]=function(name,msg){var O3a=v03.H0n;O3a+=v03.G0n;v03[O3a]();if(msg===undefined){var E3a=v9T;E3a+=c6n;this[h6c](this[E3a][h1c],name);}else{var c3a=v03.q0n;c3a+=y0n;c3a+=Q9n;c3a+=v03.l0n;this[c3a](name)[v8T](msg);}return this;};Editor[u3a][T3n]=function(mode){var E7c="ode is not su";var d7c="Not cu";var e7c="rrently in an editing mode";var c7c="pported";var O7c="Changing from create m";var B7c="ctio";var j3a=s6n;j3a+=r9n;j3a+=S5T;j3a+=U6n;var r3a=s6n;r3a+=r9n;r3a+=R0n;r3a+=F4n;var x3a=v03.i0n;x3a+=B7c;x3a+=k0n;if(!mode){var Z3a=v03.i0n;Z3a+=n5n;Z3a+=g7c;return this[a0n][Z3a];}v03[k5n]();if(!this[a0n][D0c]){var y3a=d7c;y3a+=e7c;throw new Error(y3a);}else if(this[a0n][x3a]===r3a&&mode!==j3a){var f3a=O7c;f3a+=E7c;f3a+=c7c;throw new Error(f3a);}this[a0n][D0c]=mode;return this;};Editor[a1T][u7c]=function(){var Z7c="ifier";var a3a=c6n;a3a+=b7n;a3a+=Z7c;v03[k5n]();return this[a0n][a3a];};Editor[R3a][K3a]=function(fieldNames){var y7c="G";var A3a=Q9T;A3a+=t7n;A3a+=y7c;A3a+=x2n;var k3a=v03.i0n;k3a+=v03.G0n;var that=this;if(fieldNames===undefined){var b3a=v03.q0n;b3a+=x4T;b3a+=x0n;b3a+=r4T;fieldNames=this[b3a]();}v03[k3a]();if($[r9T](fieldNames)){var X3a=R0n;X3a+=v03.i0n;X3a+=s6n;X3a+=r5n;var out={};$[X3a](fieldNames,function(i,name){var Y3a=v03.q0n;Y3a+=x4T;Y3a+=x0n;Y3a+=v03.l0n;out[name]=that[Y3a](name)[x7c]();});return out;}return this[R4T](fieldNames)[A3a]();};Editor[Q3a][N3a]=function(fieldNames,val){var j7c="ultiSet";var V3a=v03.H0n;V3a+=v03.G0n;var that=this;if($[h8c](fieldNames)&&val===undefined){$[h9T](fieldNames,function(name,value){var r7c="multiS";var n3a=r7c;n3a+=x2n;var L3a=v03.q0n;L3a+=x4T;L3a+=x0n;L3a+=v03.l0n;v03[k5n]();that[L3a](name)[n3a](value);});}else{var I3a=c6n;I3a+=j7c;this[R4T](fieldNames)[I3a](val);}v03[V3a]();return this;};Editor[a1T][w3a]=function(name){var m3a=k0n;m3a+=k7n;m3a+=v03.l0n;m3a+=R0n;var C3a=c6n;C3a+=x6T;var S3a=H9c;S3a+=O0c;v03[y5n]();var that=this;if(!name){name=this[I4T]();}return $[S3a](name)?$[C3a](name,function(n){var v3a=v03.q0n;v3a+=x4T;v3a+=Z3n;v03[y5n]();return that[v3a](n)[d4T]();}):this[R4T](name)[m3a]();};Editor[a1T][o1c]=function(name,fn){var t3a=k7n;t3a+=v03.q0n;t3a+=v03.q0n;$(this)[t3a](this[f7c](name),fn);return this;};Editor[a1T][Z6n]=function(name,fn){var R7c="ntNam";var p5a=Y7n;p5a+=a7c;p5a+=R7c;p5a+=R0n;v03[k5n]();$(this)[Z6n](this[p5a](name),fn);return this;};Editor[a1T][H5a]=function(name,fn){var K7c="_eventNam";var z5a=K7c;z5a+=R0n;var G5a=k7n;G5a+=a6n;$(this)[G5a](this[z5a](name),fn);v03[y5n]();return this;};Editor[P5a][d7n]=function(){var Y7c="R";var k7c="playCo";var A7c="eg";var X7c="ntroller";var b7c="postopen";var J5a=o6n;J5a+=b7c;var D5a=v03.l0n;D5a+=D4n;var h5a=E9n;h5a+=k7c;h5a+=X7c;var q5a=o6n;q5a+=C7T;q5a+=Y7c;q5a+=A7c;var that=this;this[V0c]();this[q5a](function(submitComplete){var N7c="troller";var Q7c="yCon";var l5a=g3T;l5a+=Q7c;l5a+=N7c;v03[k5n]();that[a0n][l5a][C7T](that,function(){var M5a=U1c;M5a+=k9n;var s5a=v03.H0n;s5a+=v03.G0n;v03[s5a]();that[M5a]();});});var ret=this[S8c](p6c);if(!ret){return this;}this[a0n][h5a][d7n](this,this[D5a][a8T],function(){var o5a=l3n;o5a+=X6n;var i5a=k7n;i5a+=r9n;i5a+=v03.l0n;i5a+=z0T;var F5a=j7n;F5a+=k7n;F5a+=s6n;F5a+=X6n;v03[k5n]();that[F5a]($[w9c](that[a0n][i5a],function(name){var W5a=S0n;W5a+=r4T;var U5a=v03.H0n;U5a+=v03.G0n;v03[U5a]();return that[a0n][W5a][name];}),that[a0n][C4T][o5a]);});this[J5a](p6c);return this;};Editor[T5a][B5a]=function(set){var V7c="ort";var m7c="All fields, and no additional fields, m";var t7c="ust be ";var n7c="splayR";var L7c="_di";var I7c="eord";var p2c="provided for ordering.";var v7c="sort";var u5a=L7c;u5a+=n7c;u5a+=I7c;u5a+=z0T;var E5a=P3n;E5a+=k7n;E5a+=y0n;E5a+=k0n;var O5a=a0n;O5a+=V7c;var g5a=w7c;g5a+=G3n;g5a+=Q5n;if(!set){return this[a0n][I4T];}if(arguments[g5a]&&!$[r9T](set)){var e5a=s6n;e5a+=v03.i0n;e5a+=x0n;e5a+=x0n;var d5a=s7n;d5a+=M7n;set=Array[d5a][R1T][e5a](arguments);}if(this[a0n][I4T][R1T]()[O5a]()[S7c](C7c)!==set[R1T]()[v7c]()[E5a](C7c)){var c5a=m7c;c5a+=t7c;c5a+=p2c;throw c5a;}$[g8T](this[a0n][I4T],set);this[u5a]();return this;};Editor[Z5a][y5a]=function(items,arg1,arg2,arg3,arg4){var z2c="_actionClass";var P2c='initRemove';var Y5a=v03.l0n;Y5a+=v03.i0n;Y5a+=H6T;var X5a=k0n;X5a+=b7n;X5a+=R0n;var k5a=R9c;k5a+=H2c;var b5a=j9T;b5a+=d3T;b5a+=R0n;var K5a=v03.q0n;K5a+=k7n;K5a+=r9n;K5a+=c6n;var R5a=v03.l0n;R5a+=k7n;R5a+=c6n;var a5a=R0n;a5a+=o6c;a5a+=G2c;var f5a=v03.i0n;f5a+=v03.G0n;var j5a=R4T;j5a+=a0n;var x5a=i0T;x5a+=Q0c;var that=this;if(this[x5a](function(){var r5a=r9n;r5a+=n1c;r5a+=k7n;r5a+=a7c;that[r5a](items,arg1,arg2,arg3,arg4);})){return this;}if(items[w5n]===undefined){items=[items];}var argOpts=this[I0c](arg1,arg2,arg3,arg4);var editFields=this[i8c](j5a,items);v03[f5a]();this[a0n][D0c]=A9T;this[a0n][u7c]=items;this[a0n][a5a]=editFields;this[R5a][K5a][b5a][k5a]=P0T;this[z2c]();this[C0c](P2c,[_pluck(editFields,X5a),_pluck(editFields,Y5a),items],function(){var q2c="initMultiRemo";var A5a=q2c;A5a+=A7n;A5a+=R0n;that[C0c](A5a,[editFields,items],function(){var l2c="ocu";var s2c="rmOpti";var N5a=v03.q0n;N5a+=l2c;N5a+=a0n;var Q5a=j7n;Q5a+=k7n;Q5a+=s2c;Q5a+=I1c;that[v0c]();that[Q5a](argOpts[k1T]);argOpts[t0c]();var opts=that[a0n][C4T];if(opts[N5a]!==z1T){var I5a=M2c;I5a+=h2c;var n5a=v03.l0n;n5a+=k7n;n5a+=c6n;var L5a=D2c;L5a+=k7n;L5a+=k0n;$(L5a,that[n5a][I5a])[l1c](opts[c1T])[c1T]();}});});return this;};Editor[V5a][w5a]=function(set,val){var m5a=v03.H0n;m5a+=v03.G0n;var S5a=R0n;S5a+=v03.i0n;S5a+=s6n;S5a+=r5n;var that=this;if(!$[h8c](set)){var o={};o[set]=val;set=o;}$[S5a](set,function(n,v){var v5a=v03.q0n;v5a+=f7n;v5a+=v03.l0n;var C5a=v03.i0n;C5a+=v03.G0n;v03[C5a]();that[v5a](n)[k9T](v);});v03[m5a]();return this;};Editor[t5a][p4a]=function(names,animate){var H4a=y0c;H4a+=i9T;H4a+=a0n;var that=this;$[h9T](this[H4a](names),function(i,n){var F2c="show";var G4a=j4T;G4a+=x0n;G4a+=v03.l0n;v03[y5n]();that[G4a](n)[F2c](animate);});return this;};Editor[a1T][p8c]=function(successCallback,errorCallback,formatdata,hide){var i2c="cess";var D4a=R0n;D4a+=v5n;D4a+=r5n;var q4a=v03.i0n;q4a+=v03.G0n;var P4a=h7n;P4a+=k7n;P4a+=i2c;P4a+=U2c;var z4a=v03.q0n;z4a+=x4T;z4a+=Z3n;z4a+=a0n;var that=this,fields=this[a0n][z4a],errorFields=[],errorReady=W1n,sent=V5n;if(this[a0n][P4a]||!this[a0n][D0c]){return this;}v03[q4a]();this[W2c](C5n);var send=function(){var T2c="vent";var o2c="initS";var M4a=o2c;M4a+=J2c;var s4a=Y7n;s4a+=T2c;var l4a=x0n;l4a+=B2c;if(errorFields[l4a]!==errorReady||sent){return;}that[s4a](M4a,[that[a0n][D0c]],function(result){var h4a=p7T;h4a+=g2c;h4a+=c6n;h4a+=t6T;if(result===V5n){that[W2c](V5n);return;}sent=C5n;that[h4a](successCallback,errorCallback,formatdata,hide);});};this[g0T]();$[D4a](fields,function(name,field){var F4a=v03.H0n;F4a+=v03.G0n;v03[F4a]();if(field[B6c]()){errorFields[A5n](name);}});$[h9T](errorFields,function(i,name){fields[name][g0T](s5n,function(){v03[k5n]();errorReady++;send();});});send();return this;};Editor[a1T][i4a]=function(set){if(set===undefined){return this[a0n][X9c];}this[a0n][X9c]=set===z1T?z1T:$(set);return this;};Editor[U4a][W4a]=function(title){var d2c="dren";var O4a=v03.i0n;O4a+=v03.G0n;var B4a=A2n;B4a+=A7n;B4a+=g0n;var T4a=c8c;T4a+=x0n;T4a+=d2c;var J4a=r5n;J4a+=R0n;J4a+=v03.i0n;J4a+=n7n;var o4a=v03.l0n;o4a+=D4n;var header=$(this[o4a][J4a])[T4a](B4a+this[y0T][T4T][z7T]);if(title===undefined){var g4a=r5n;g4a+=v03.D0n;g4a+=e2c;return header[g4a]();}if(typeof title===v03.o0n){var e4a=H6T;e4a+=t0n;e4a+=x0n;e4a+=R0n;var d4a=M8T;d4a+=E6n;d4a+=y0n;title=title(this,new DataTable[d4a](this[a0n][e4a]));}header[p6T](title);v03[O4a]();return this;};Editor[a1T][E4a]=function(field,value){if(value!==undefined||$[h8c](field)){return this[k9T](field,value);}return this[b9T](field);};var apiRegister=DataTable[U4T][c4a];function __getInst(api){var O2c="oInit";var E2c="_editor";var u4a=s6n;u4a+=k7n;u4a+=k0n;u4a+=r6T;var ctx=api[u4a][W1n];v03[k5n]();return ctx[O2c][j0n]||ctx[E2c];}function __setBasic(inst,opts,type,plural){var r2c=/%d/;var j2c='1';var c2c="basic";var r4a=c6n;r4a+=r0n;r4a+=u7n;var x4a=t7n;x4a+=v03.D0n;x4a+=k2n;var Z4a=v03.i0n;Z4a+=v03.G0n;if(!opts){opts={};}v03[Z4a]();if(opts[i1c]===undefined){var y4a=o6n;y4a+=c2c;opts[i1c]=y4a;}if(opts[x4a]===undefined){opts[u2c]=inst[Z2c][type][u2c];}if(opts[r4a]===undefined){if(type===y2c){var j4a=r9n;j4a+=J9T;j4a+=R0n;var confirm=inst[Z2c][type][x2c];opts[v8T]=plural!==o1n?confirm[o6n][j4a](r2c,plural):confirm[j2c];}else{opts[v8T]=s5n;}}return opts;}apiRegister(f4a,function(){return __getInst(this);});apiRegister(a4a,function(opts){var K4a=f2c;K4a+=v03.i0n;K4a+=U6n;var R4a=v2n;R4a+=a2c;R4a+=R0n;var inst=__getInst(this);v03[k5n]();inst[R4a](__setBasic(inst,opts,K4a));return this;});apiRegister(R2c,function(opts){var k4a=R0n;k4a+=y9n;var b4a=R0n;b4a+=v03.l0n;b4a+=t6T;var inst=__getInst(this);inst[b4a](this[W1n][W1n],__setBasic(inst,opts,k4a));v03[y5n]();return this;});apiRegister(K2c,function(opts){var A4a=R0n;A4a+=y9n;var Y4a=R0n;Y4a+=A2n;Y4a+=v03.D0n;var X4a=v03.H0n;X4a+=v03.G0n;v03[X4a]();var inst=__getInst(this);inst[Y4a](this[W1n],__setBasic(inst,opts,A4a));return this;});apiRegister(b2c,function(opts){var inst=__getInst(this);inst[A9T](this[W1n][W1n],__setBasic(inst,opts,y2c,o1n));return this;});apiRegister(k2c,function(opts){var Q4a=j2n;Q4a+=R0n;var inst=__getInst(this);v03[k5n]();inst[Q4a](this[W1n],__setBasic(inst,opts,y2c,this[W1n][w5n]));return this;});apiRegister(N4a,function(type,opts){if(!type){var L4a=s4n;L4a+=L6c;L4a+=a6n;type=L4a;}else if($[h8c](type)){opts=type;type=X2c;}__getInst(this)[type](this[W1n][W1n],opts);return this;});apiRegister(Y2c,function(opts){var n4a=t0n;n4a+=M8c;__getInst(this)[n4a](this[W1n],opts);return this;});apiRegister(A2c,_api_file);apiRegister(I4a,_api_files);$(document)[V4a](w4a,function(e,ctx,json){var N2c='dt';var S4a=h2n;S4a+=a0n;if(e[Q2c]!==N2c){return;}if(json&&json[S4a]){var C4a=v03.q0n;C4a+=y0n;C4a+=x0n;C4a+=r0n;$[h9T](json[C4a],function(name,files){var p8u=b2n;p8u+=k2n;p8u+=a0n;var t4a=R0n;t4a+=q3n;t4a+=L2c;var v4a=v03.q0n;v4a+=b5n;if(!Editor[v4a][name]){var m4a=n2c;m4a+=r0n;Editor[m4a][name]={};}$[t4a](Editor[p8u][name],files);});}});Editor[H8u]=function(msg,tn){var I2c=" For more information, please refer to ";var V2c="https://datatables.net/tn/";var z8u=I2c;z8u+=V2c;var G8u=v03.i0n;G8u+=v03.G0n;v03[G8u]();throw tn?msg+z8u+tn:msg;};Editor[P8u]=function(data,props,fn){var C2c="Objec";var w2c="isP";var l8u=A7n;l8u+=U6T;var q8u=v4n;q8u+=Q9n;var i,ien,dataPoint;props=$[g8T]({label:q8u,value:l8u},props);if($[r9T](data)){for(i=W1n,ien=data[w5n];i<ien;i++){var s8u=w2c;s8u+=S2c;s8u+=C2c;s8u+=v03.D0n;dataPoint=data[i];if($[s8u](dataPoint)){var D8u=v03.i0n;D8u+=v03.D0n;D8u+=v2c;var h8u=E1T;h8u+=x0n;h8u+=v03.H0n;h8u+=R0n;var M8u=A7n;M8u+=m2c;M8u+=v03.H0n;M8u+=R0n;fn(dataPoint[props[M8u]]===undefined?dataPoint[props[C0T]]:dataPoint[props[h8u]],dataPoint[props[C0T]],i,dataPoint[D8u]);}else{fn(dataPoint,dataPoint,i);}}}else{var F8u=R0n;F8u+=t2c;i=W1n;$[F8u](data,function(key,val){fn(val,key,i);i++;});}};Editor[p3c]=function(id){var i8u=B9T;i8u+=x0n;i8u+=g9T;return id[i8u](/\./g,C7c);};Editor[U8u]=function(editor,conf,files,progressCallback,completeCallback){var G3c="AsDataURL";var D3c="g the fil";var q3c=">Uploadi";var s3c="unct";var M3c="A server error";var F3c="fileReadText";var l3c="ng file</i>";var h3c=" occurred while uploadin";var H3c="read";var P3c="<i";var h1u=H3c;h1u+=G3c;var l1u=c6n;l1u+=v03.i0n;l1u+=E6n;var T8u=Z6n;T8u+=x0n;T8u+=z3c;T8u+=v03.l0n;var J8u=P3c;J8u+=q3c;J8u+=l3c;var W8u=v03.q0n;W8u+=s3c;W8u+=g7c;var reader=new FileReader();var counter=W1n;var ids=[];var generalError=M3c;generalError+=h3c;generalError+=D3c;generalError+=R0n;editor[g0T](conf[d8T],s5n);if(typeof conf[w4T]===W8u){conf[w4T](files,function(ids){var o8u=s6n;o8u+=v03.i0n;o8u+=x0n;o8u+=x0n;completeCallback[o8u](editor,ids);});return;}progressCallback(conf,conf[F3c]||J8u);reader[T8u]=function(e){var f3c="L";var x3c='preUpload';var W3c=".DTE_Upload";var g3c="ajaxData";var y3c="oad plug-in";var U3c="reSubmit";var a3c='post';var Z3c="ption specified for upl";var T3c='uploadField';var O3c="plo";var u3c="No Ajax o";var d3c="ajaxD";var B3c='upload';var j3c="dAsDataUR";var e3c="jax";var X8u=l9c;X8u+=k0n;var k8u=i3c;k8u+=q3n;var b8u=E6n;b8u+=U3c;b8u+=W3c;var f8u=o3c;f8u+=R0n;f8u+=k0n;f8u+=v03.D0n;var c8u=v03.i0n;c8u+=P3n;c8u+=v03.i0n;c8u+=q3n;var O8u=i3c;O8u+=q3n;var d8u=v03.i0n;d8u+=r1T;d8u+=Q7n;d8u+=v03.l0n;var g8u=F9c;g8u+=P6T;g8u+=v03.i0n;g8u+=v03.l0n;var B8u=J3c;B8u+=k0n;var data=new FormData();var ajax;data[q7T](B8u,g8u);data[q7T](T3c,conf[d8T]);data[d8u](B3c,files[counter]);if(conf[g3c]){var e8u=d3c;e8u+=v03.i0n;e8u+=H6T;conf[e8u](data);}if(conf[O8u]){var E8u=v03.i0n;E8u+=e3c;ajax=conf[E8u];}else if($[h8c](editor[a0n][c8u])){var x8u=v03.i0n;x8u+=P3n;x8u+=v03.i0n;x8u+=q3n;var y8u=v03.H0n;y8u+=O3c;y8u+=E3c;var Z8u=c3c;Z8u+=z3c;Z8u+=v03.l0n;var u8u=v03.i0n;u8u+=P3n;u8u+=v03.i0n;u8u+=q3n;ajax=editor[a0n][u8u][Z8u]?editor[a0n][w4T][y8u]:editor[a0n][x8u];}else if(typeof editor[a0n][w4T]===d9T){ajax=editor[a0n][w4T];}if(!ajax){var r8u=u3c;r8u+=Z3c;r8u+=y3c;throw r8u;}if(typeof ajax===d9T){ajax={url:ajax};}if(typeof ajax[x8T]===v03.o0n){var d={};var ret=ajax[x8T](d);if(ret!==undefined&&typeof ret!==d9T){d=ret;}$[h9T](d,function(key,value){var j8u=v03.H0n;j8u+=v03.G0n;v03[j8u]();data[q7T](key,value);});}var preRet=editor[f8u](x3c,[conf[d8T],files[counter],data]);if(preRet===V5n){var a8u=x0n;a8u+=B2c;if(counter<files[a8u]-o1n){var R8u=r3c;R8u+=j3c;R8u+=f3c;counter++;reader[R8u](files[counter]);}else{var K8u=s6n;K8u+=W0c;completeCallback[K8u](editor,ids);}return;}var submit=V5n;editor[Z6n](b8u,function(){v03[y5n]();submit=C5n;return V5n;});$[k8u]($[g8T]({},ajax,{type:a3c,data:data,dataType:X8u,contentType:V5n,processData:V5n,xhr:function(){var k3c="ogress";var R3c="Settin";var L3c="onloadend";var A8u=q3n;A8u+=r5n;A8u+=r9n;var Y8u=C7n;Y8u+=v7n;Y8u+=R3c;Y8u+=i8T;var xhr=$[Y8u][A8u]();if(xhr[K3c]){var n8u=F9c;n8u+=b3c;var Q8u=Z6n;Q8u+=h7n;Q8u+=k3c;xhr[K3c][Q8u]=function(e){var X3c="lengthComputable";var A3c="toFixed";var Y3c="loaded";var Q3c="%";var N3c=':';if(e[X3c]){var L8u=d1c;L8u+=Q5n;var N8u=S7n;N8u+=v03.i0n;N8u+=x0n;var percent=(e[Y3c]/e[N8u]*n1n)[A3c](W1n)+Q3c;progressCallback(conf,files[w5n]===o1n?percent:counter+N3c+files[L8u]+R8T+percent);}};xhr[n8u][L3c]=function(e){var V3c='Processing';var I3c="essingText";var I8u=n3c;I8u+=I3c;progressCallback(conf,conf[I8u]||V3c);};}return xhr;},success:function(json){var p5c="rrors";var S3c="preSubmit.D";var H5c="sta";var v3c='uploadXhrSuccess';var G5c="tus";var w3c="Errors";var t3c="fieldE";var P5c="aURL";var z5c="readAsDat";var C3c="TE_Uplo";var S8u=v03.q0n;S8u+=f7n;S8u+=v03.l0n;S8u+=w3c;var w8u=S3c;w8u+=C3c;w8u+=E3c;var V8u=k7n;V8u+=v03.q0n;V8u+=v03.q0n;editor[V8u](w8u);editor[C0c](v3c,[conf[d8T],json]);if(json[m3c]&&json[S8u][w5n]){var C8u=t3c;C8u+=p5c;var errors=json[C8u];for(var i=W1n,ien=errors[w5n];i<ien;i++){var v8u=H5c;v8u+=G5c;editor[g0T](errors[i][d8T],errors[i][v8u]);}}else if(json[g0T]){var t8u=z0T;t8u+=r9n;t8u+=k7n;t8u+=r9n;var m8u=R0n;m8u+=X2n;m8u+=k7n;m8u+=r9n;editor[m8u](json[t8u]);}else if(!json[K3c]||!json[K3c][H7n]){editor[g0T](conf[d8T],generalError);}else{var G1u=y0n;G1u+=v03.l0n;var H1u=v03.H0n;H1u+=P2n;var p1u=b2n;p1u+=x0n;p1u+=R0n;p1u+=a0n;if(json[p1u]){$[h9T](json[j5n],function(table,files){if(!Editor[j5n][table]){Editor[j5n][table]={};}v03[k5n]();$[g8T](Editor[j5n][table],files);});}ids[A5n](json[H1u][G1u]);if(counter<files[w5n]-o1n){var z1u=z5c;z1u+=P5c;counter++;reader[z1u](files[counter]);}else{completeCallback[K1T](editor,ids);if(submit){editor[p8c]();}}}v03[k5n]();progressCallback(conf);},error:function(xhr){var l5c="dXhrEr";var q1u=k0n;q1u+=v03.i0n;q1u+=c6n;q1u+=R0n;var P1u=q5c;P1u+=l5c;P1u+=O6c;editor[C0c](P1u,[conf[d8T],xhr]);editor[g0T](conf[q1u],generalError);progressCallback(conf);}}));};files=$[l1u](files,function(val){return val;});if(conf[s5c]!==undefined){var M1u=d1c;M1u+=v03.D0n;M1u+=r5n;var s1u=Q2n;s1u+=L6c;s1u+=N6c;files[s1u](conf[s5c],files[M1u]);}reader[h1u](files[W1n]);};Editor[D1u][F1u]=function(init){var H4c="defa";var q4c='<div data-dte-e="processing" class="';var D4c='<div data-dte-e="form_content" class="';var B5c="\"><d";var h5c="niq";var A5c="lega";var l4c="indicator";var s4c='<div data-dte-e="body_content" class="';var g4c="ools";var L5c="Opti";var o5c="form_";var U5c="sin";var t5c="ngs";var A4c='initComplete';var k5c="sett";var i5c="ocessi";var F4c='<div data-dte-e="form_error" class="';var N5c="ja";var c5c="m>";var n5c="dataS";var Q5c="cyA";var Z4c='foot';var M4c='<div data-dte-e="foot" class="';var Z5c="m d";var v5c="mTa";var y5c="ata-dte-e=\"form\"";var Y5c="asses";var R5c="\"><s";var O5c="e-e=\"head\" class=\"";var U4c='<div data-dte-e="form_buttons" class="';var W4c="mov";var G4c="lts";var W5c="ody_cont";var J4c="TO";var r5c="</d";var f5c="<div data-dte-e=\"body\" ";var V5c="dataTab";var K5c="pan/></div>";var i4c='<div data-dte-e="form_info" class="';var c4c="events";var I5c="ources";var F5c="dt.";var u4c="formContent";var T5c="\"/><";var u5c="<for";var w5c="mTable";var m5c="setti";var C5c="dbT";var o4c="BUT";var D5c="init.";var j5c="foo";var b4c="init";var a5c="class=";var K4c="ispl";var d5c="eade";var j4c='xhr.dt.dte';var e5c="<div data-dt";var b5c="iv clas";var I0u=o6n;I0u+=M5c;I0u+=H0T;var Y0u=k7n;Y0u+=k0n;var R0u=v03.H0n;R0u+=h5c;R0u+=v03.H0n;R0u+=R0n;var a0u=D5c;a0u+=F5c;a0u+=M2n;a0u+=R0n;var f0u=k7n;f0u+=k0n;var r0u=v03.q0n;r0u+=G2c;var x0u=E6n;x0u+=r9n;x0u+=i5c;x0u+=G6n;var y0u=p6n;y0u+=U5c;y0u+=G3n;var Z0u=t0n;Z0u+=W5c;Z0u+=R0n;Z0u+=H0T;var u0u=t0n;u0u+=k7n;u0u+=R5T;var c0u=v03.q0n;c0u+=k7n;c0u+=v9n;var E0u=v03.q0n;E0u+=k7n;E0u+=r9n;E0u+=c6n;var O0u=o5c;O0u+=z7T;var e0u=e7T;e0u+=z0T;var F0u=l7n;F0u+=U9T;F0u+=J5c;var D0u=E5n;D0u+=X6T;D0u+=g4n;var h0u=t0n;h0u+=a0T;h0u+=h2c;var M0u=v03.q0n;M0u+=k7n;M0u+=r9n;M0u+=c6n;var s0u=T5c;s0u+=X6T;s0u+=A2n;s0u+=W4n;var l0u=p0T;l0u+=H0T;l0u+=C2n;var q0u=B5c;q0u+=g5c;q0u+=V4n;var P0u=r5n;P0u+=d5c;P0u+=r9n;var z0u=e5c;z0u+=O5c;var G0u=E5n;G0u+=X6T;G0u+=g4n;var H0u=y0n;H0u+=r5T;H0u+=k7n;var p0u=E5n;p0u+=X6T;p0u+=g4n;var t1u=R0n;t1u+=r9n;t1u+=O6c;var m1u=E5c;m1u+=r9n;m1u+=c6n;var v1u=e4n;v1u+=v03.q0n;v1u+=l6n;v1u+=c5c;var C1u=E5n;C1u+=k8c;var S1u=p0T;S1u+=H0T;S1u+=Q7n;S1u+=v03.D0n;var w1u=v03.D0n;w1u+=v03.i0n;w1u+=G3n;var V1u=E5c;V1u+=E8c;var I1u=u5c;I1u+=Z5c;I1u+=y5c;I1u+=x5c;var n1u=i4n;n1u+=U4n;n1u+=y1c;n1u+=g4n;var L1u=r5c;L1u+=y1c;L1u+=g4n;var N1u=j5c;N1u+=v03.D0n;N1u+=z0T;var Q1u=E5n;Q1u+=g4n;var A1u=i4n;A1u+=T4n;A1u+=W4n;var Y1u=E5n;Y1u+=X6T;Y1u+=g4n;var X1u=q1c;X1u+=f6n;var k1u=E5n;k1u+=g4n;var b1u=t0n;b1u+=k7n;b1u+=v03.l0n;b1u+=f6n;var K1u=f5c;K1u+=a5c;K1u+=E5n;var R1u=R5c;R1u+=K5c;var a1u=n3c;a1u+=r0n;a1u+=a0n;a1u+=U2c;var f1u=E4n;f1u+=b5c;f1u+=f4n;var j1u=v03.l0n;j1u+=k7n;j1u+=c6n;var r1u=k5c;r1u+=U2c;r1u+=a0n;var x1u=y0n;x1u+=X5c;var y1u=s6n;y1u+=x0n;y1u+=Y5c;var Z1u=R0n;Z1u+=q3n;Z1u+=v03.D0n;Z1u+=w0n;var u1u=v03.l0n;u1u+=S2T;u1u+=s6n;u1u+=r5n;var c1u=E2n;c1u+=c2n;var E1u=A5c;E1u+=Q5c;E1u+=N5c;E1u+=q3n;var O1u=T6n;O1u+=L5c;O1u+=k7n;O1u+=d6n;var e1u=n5c;e1u+=I5c;var d1u=V5c;d1u+=k2n;var g1u=v9T;g1u+=w5c;var B1u=y0n;B1u+=v03.l0n;B1u+=Z0n;B1u+=S5c;var T1u=C7n;T1u+=v03.i0n;T1u+=q3n;var J1u=C5c;J1u+=L4n;J1u+=k2n;var o1u=v03.l0n;o1u+=k7n;o1u+=v5c;o1u+=q9n;var W1u=m5c;W1u+=t5c;var U1u=c6n;U1u+=p4c;U1u+=x0n;U1u+=a0n;var i1u=H4c;i1u+=v03.H0n;i1u+=G4c;init=$[g8T](C5n,{},Editor[i1u],init);this[a0n]=$[g8T](C5n,{},Editor[U1u][W1u],{table:init[o1u]||init[g1T],dbTable:init[J1u]||z1T,ajaxUrl:init[z4c],ajax:init[T1u],idSrc:init[B1u],dataSource:init[g1u]||init[g1T]?Editor[P4c][d1u]:Editor[e1u][p6T],formOptions:init[O1u],legacyAjax:init[E1u],template:init[c1u]?$(init[X9c])[u1u]():z1T});this[y0T]=$[Z1u](C5n,{},Editor[y1u]);this[Z2c]=init[x1u];Editor[f6T][r1u][A9c]++;var that=this;var classes=this[y0T];this[j1u]={"wrapper":$(f1u+classes[a8T]+b8T+q4c+classes[a1u][l4c]+R1u+K1u+classes[b1u][a8T]+k1u+s4c+classes[X1u][z7T]+Y1u+A1u+M4c+classes[h4c][a8T]+Q1u+p1c+classes[N1u][z7T]+L8T+L1u+n1u)[W1n],"form":$(I1u+classes[V1u][w1u]+b8T+D4c+classes[T6n][S1u]+C1u+v1u)[W1n],"formError":$(F4c+classes[m1u][t1u]+p0u)[W1n],"formInfo":$(i4c+classes[T6n][H0u]+G0u)[W1n],"header":$(z0u+classes[P0u][a8T]+q0u+classes[T4T][l0u]+s0u)[W1n],"buttons":$(U4c+classes[M0u][h0u]+D0u)[W1n]};if($[h5n][D5n][F0u]){var T0u=F7c;T0u+=W4c;T0u+=R0n;var J0u=s6n;J0u+=r9n;J0u+=a0c;var o0u=y0n;o0u+=B0n;o0u+=h6T;o0u+=k0n;var W0u=o4c;W0u+=J4c;W0u+=T4c;var U0u=B4c;U0u+=R0n;U0u+=u6n;U0u+=g4c;var i0u=v03.q0n;i0u+=k0n;var ttButtons=$[i0u][D5n][U0u][W0u];var i18n=this[o0u];$[h9T]([J0u,M7c,T0u],function(i,val){var E4c="tor_";var d4c="sButton";var e4c="Text";var d0u=D2c;d0u+=Z6n;var g0u=d4c;g0u+=e4c;var B0u=O4c;B0u+=E4c;v03[y5n]();ttButtons[B0u+val][g0u]=i18n[val][d0u];});}$[h9T](init[c4c],function(evt,fn){v03[y5n]();that[Z6n](evt,function(){var args=Array[a1T][R1T][K1T](arguments);args[y6T]();fn[t8c](that,args);});});var dom=this[W1T];var wrapper=dom[e0u];dom[u4c]=_editor_el(O0u,dom[E0u])[W1n];dom[c0u]=_editor_el(Z4c,wrapper)[W1n];dom[f3T]=_editor_el(u0u,wrapper)[W1n];dom[y4c]=_editor_el(Z0u,wrapper)[W1n];dom[y0u]=_editor_el(x0u,wrapper)[W1n];if(init[r0u]){var j0u=v03.i0n;j0u+=v03.l0n;j0u+=v03.l0n;this[j0u](init[i6c]);}$(document)[f0u](a0u+this[a0n][R0u],function(e,settings,json){var x4c="nTable";var k0u=G3n;k0u+=x2n;var b0u=v03.D0n;b0u+=v03.i0n;b0u+=U9T;b0u+=R0n;var K0u=v03.D0n;K0u+=Y2n;if(that[a0n][K0u]&&settings[x4c]===$(that[a0n][b0u])[k0u](W1n)){var X0u=r4c;X0u+=y0n;X0u+=v03.D0n;X0u+=l6n;settings[X0u]=that;}})[Y0u](j4c+this[a0n][A9c],function(e,settings,json){var R4c="nsUpd";var A0u=k0n;A0u+=f4c;v03[y5n]();if(json&&that[a0n][g1T]&&settings[A0u]===$(that[a0n][g1T])[b9T](W1n)){var Q0u=a4c;Q0u+=A1T;Q0u+=R4c;Q0u+=F4n;that[Q0u](json);}});try{var N0u=v03.l0n;N0u+=K4c;N0u+=v03.i0n;N0u+=f6n;this[a0n][m6T]=Editor[N0u][init[I0T]][b4c](this);}catch(e){var Y4c=" controller ";var X4c="Cannot find displa";var n0u=v03.l0n;n0u+=k4c;n0u+=B5T;var L0u=X4c;L0u+=f6n;L0u+=Y4c;throw L0u+init[n0u];}this[I0u](A4c,[]);};Editor[a1T][V0u]=function(){var n4c="lasse";var I4c="actions";var L4c="oveCla";var V4c="ddClass";var N4c="reat";var p9u=Q4c;p9u+=A7n;p9u+=R0n;var m0u=J2n;m0u+=y0n;m0u+=v03.D0n;var v0u=s6n;v0u+=N4c;v0u+=R0n;var C0u=J0T;C0u+=L4c;C0u+=H2n;var S0u=C1c;S0u+=y0n;S0u+=Z6n;var w0u=s6n;w0u+=n4c;w0u+=a0n;var classesActions=this[w0u][I4c];var action=this[a0n][S0u];var wrapper=$(this[W1T][a8T]);wrapper[C0u]([classesActions[v0u],classesActions[m0u],classesActions[A9T]][S7c](R8T));v03[k5n]();if(action===N0c){var t0u=f2c;t0u+=F4n;wrapper[o0T](classesActions[t0u]);}else if(action===C9c){wrapper[o0T](classesActions[C9c]);}else if(action===p9u){var H9u=v03.i0n;H9u+=V4c;wrapper[H9u](classesActions[A9T]);}};Editor[G9u][z9u]=function(data,success,error,submitParams){var C4c="EL";var E8s=/_id_/;var g8s=',';var G8s="axUrl";var S4c="teBo";var T8s='idSrc';var m4c="tri";var v4c="ETE";var r8s="ndexOf";var w4c="dele";var B8s="joi";var d8s="lac";var y8s="nsh";var u8s="complete";var x8s="deleteBody";var e8s="rl";var P8s='json';var j8s="param";var p8s="itFields";var f8s='?';var b9u=v03.i0n;b9u+=P3n;b9u+=v7n;var a9u=w4c;a9u+=S4c;a9u+=v03.l0n;a9u+=f6n;var f9u=I9n;f9u+=C4c;f9u+=v4c;var j9u=v03.D0n;j9u+=f6n;j9u+=E6n;j9u+=R0n;var x9u=v03.l0n;x9u+=v03.i0n;x9u+=v03.D0n;x9u+=v03.i0n;var y9u=v03.H0n;y9u+=r9n;y9u+=x0n;var d9u=a0n;d9u+=m4c;d9u+=k0n;d9u+=G3n;var W9u=k4c;W9u+=t4c;W9u+=s2T;W9u+=f6n;var U9u=J2n;U9u+=p8s;var i9u=r9n;i9u+=R0n;i9u+=H8s;var F9u=v03.i0n;F9u+=P3n;F9u+=G8s;var D9u=v03.i0n;D9u+=P3n;D9u+=v7n;var P9u=p8T;P9u+=z8s;P9u+=Z0n;P9u+=u6n;var that=this;var action=this[a0n][D0c];var thrown;var opts={type:P9u,dataType:P8s,data:z1T,error:[function(xhr,text,err){thrown=err;}],success:[],complete:[function(xhr,text){var o8s="responseJSON";var U8s="spons";var J8s="atus";var F8s="arse";var i8s="JSO";var M8s='null';var D8s="Te";var h8s="response";var q8s="Object";var I1n=204;var s8s="responseText";var W8s="eJSON";var M9u=k4c;M9u+=p8T;M9u+=S2c;M9u+=q8s;var json=z1T;v03[k5n]();if(xhr[l8s]===I1n||xhr[s8s]===M8s){json={};}else{try{var s9u=h8s;s9u+=D8s;s9u+=q3n;s9u+=v03.D0n;var l9u=E6n;l9u+=F8s;l9u+=i8s;l9u+=b6n;var q9u=r9n;q9u+=R0n;q9u+=U8s;q9u+=W8s;json=xhr[q9u]?xhr[o8s]:$[l9u](xhr[s9u]);}catch(e){}}if($[M9u](json)||$[r9T](json)){var h9u=j9T;h9u+=J8s;success(json,xhr[h9u]>=V1n,xhr);}else{error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[a0n][D9u]||this[a0n][F9u];var id=action===M7c||action===i9u?_pluck(this[a0n][U9u],T8s):z1T;if($[W9u](id)){var o9u=B8s;o9u+=k0n;id=id[o9u](g8s);}if($[h8c](ajaxSrc)&&ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc===v03.o0n){var uri=z1T;var method=z1T;if(this[a0n][z4c]){var g9u=B9T;g9u+=d8s;g9u+=R0n;var T9u=s6n;T9u+=r3c;T9u+=U6n;var J9u=i3c;J9u+=q3n;J9u+=L0T;J9u+=e8s;var url=this[a0n][J9u];if(url[T9u]){uri=url[action];}if(uri[O8s](R8T)!==-o1n){var B9u=a0n;B9u+=E6n;B9u+=L6c;B9u+=v03.D0n;a=uri[B9u](R8T);method=a[W1n];uri=a[o1n];}uri=uri[g9u](E8s,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc===d9u){if(ajaxSrc[O8s](R8T)!==-o1n){var e9u=V7n;e9u+=W7n;a=ajaxSrc[c8s](R8T);opts[e9u]=a[W1n];opts[r9c]=a[o1n];}else{opts[r9c]=ajaxSrc;}}else{var Z9u=R0n;Z9u+=q3n;Z9u+=L2c;var optsCopy=$[g8T]({},ajaxSrc||{});if(optsCopy[u8s]){var O9u=s6n;O9u+=Z8s;opts[u8s][b1T](optsCopy[u8s]);delete optsCopy[O9u];}if(optsCopy[g0T]){var u9u=R0n;u9u+=X2n;u9u+=k7n;u9u+=r9n;var c9u=v03.H0n;c9u+=y8s;c9u+=y0n;c9u+=K1c;var E9u=h9c;E9u+=k7n;E9u+=r9n;opts[E9u][c9u](optsCopy[u9u]);delete optsCopy[g0T];}opts=$[Z9u]({},opts,optsCopy);}opts[r9c]=opts[y9u][e9T](E8s,id);if(opts[x9u]){var r9u=v03.l0n;r9u+=I6n;r9u+=v03.i0n;var isFn=typeof opts[x8T]===v03.o0n;var newData=isFn?opts[r9u](data):opts[x8T];data=isFn&&newData?newData:$[g8T](C5n,data,newData);}opts[x8T]=data;if(opts[j9u]===f9u&&(opts[a9u]===undefined||opts[x8s]===C5n)){var K9u=y0n;K9u+=r8s;var R9u=c8T;R9u+=v03.i0n;var params=$[j8s](opts[R9u]);opts[r9c]+=opts[r9c][K9u](f8s)===-o1n?f8s+params:c9T+params;delete opts[x8T];}$[b9u](opts);};Editor[a1T][V7T]=function(target,style,time,callback){var R8s="ani";var a8s="anim";var X9u=a8s;X9u+=v03.i0n;X9u+=v03.D0n;X9u+=R0n;var k9u=v03.q0n;k9u+=k0n;if($[k9u][X9u]){var Y9u=R8s;Y9u+=c6n;Y9u+=F4n;target[K8s]()[Y9u](style,time,callback);}else{var A9u=s6n;A9u+=a0n;A9u+=a0n;target[A9u](style);if(typeof time===v03.o0n){time[K1T](target);}else if(callback){callback[K1T](target);}}};Editor[a1T][v0c]=function(){var b8s="bodyC";var X8s="formE";var Y8s="prepend";var C9u=v03.q0n;C9u+=l6n;C9u+=c6n;var S9u=c2T;S9u+=Q7n;S9u+=v03.l0n;var w9u=v03.q0n;w9u+=l6n;w9u+=c6n;w9u+=k9n;var V9u=b8s;V9u+=Z6n;V9u+=v03.D0n;V9u+=C2n;var I9u=t0n;I9u+=D9n;var n9u=k8s;n9u+=w0T;var L9u=X8s;L9u+=r9n;L9u+=O6c;var N9u=b7T;N9u+=E3c;N9u+=z0T;var Q9u=v03.l0n;Q9u+=k7n;Q9u+=c6n;var dom=this[Q9u];$(dom[a8T])[Y8s](dom[N9u]);$(dom[h4c])[q7T](dom[L9u])[n9u](dom[I9u]);$(dom[V9u])[q7T](dom[w9u])[S9u](dom[C9u]);};Editor[a1T][H8c]=function(){var N8s='preBlur';var Q8s="onBlur";var m9u=D3n;m9u+=t0n;m9u+=h0c;var v9u=A8s;v9u+=t7n;v9u+=Z6n;var opts=this[a0n][C4T];var onBlur=opts[Q8s];if(this[C0c](N8s)===V5n){return;}if(typeof onBlur===v9u){onBlur(this);}else if(onBlur===m9u){var t9u=L8s;t9u+=c6n;t9u+=y0n;t9u+=v03.D0n;this[t9u]();}else if(onBlur===a6T){var p6u=n8s;p6u+=h3n;p6u+=R0n;this[p6u]();}};Editor[H6u][I8s]=function(){var h6u=c6n;h6u+=r0n;h6u+=u7n;var l6u=J0T;l6u+=V8s;l6u+=w8s;l6u+=a0n;var q6u=v03.l0n;q6u+=k7n;q6u+=c6n;var P6u=b2n;P6u+=R0n;P6u+=Z3n;P6u+=a0n;var z6u=R0n;z6u+=r9n;z6u+=r9n;z6u+=l6n;var G6u=N8c;G6u+=a0n;G6u+=R0n;G6u+=a0n;if(!this[a0n]){return;}v03[y5n]();var errorClass=this[G6u][R4T][z6u];var fields=this[a0n][P6u];$(P7c+errorClass,this[q6u][a8T])[l6u](errorClass);$[h9T](fields,function(name,field){var M6u=G4n;M6u+=R0n;var s6u=v03.i0n;s6u+=v03.G0n;v03[s6u]();field[g0T](s5n)[M6u](s5n);});this[g0T](s5n)[h6u](s5n);};Editor[a1T][B1c]=function(submitComplete,mode){var H1s="oseIcb";var p1s="loseCb";var v8s="Icb";var m8s='preClose';var t8s="closeCb";var C8s="ditor-focus";var J6u=s6n;J6u+=x0n;J6u+=z9n;var o6u=S8s;o6u+=C8s;var W6u=k7n;W6u+=v03.q0n;W6u+=v03.q0n;var i6u=L9c;i6u+=s3n;i6u+=v8s;var F6u=v03.H0n;F6u+=v03.G0n;if(this[C0c](m8s)===V5n){return;}if(this[a0n][t8s]){var D6u=s6n;D6u+=p1s;this[a0n][D6u](submitComplete,mode);this[a0n][t8s]=z1T;}v03[F6u]();if(this[a0n][i6u]){var U6u=M3n;U6u+=H1s;this[a0n][U6u]();this[a0n][G1s]=z1T;}$(N7T)[W6u](o6u);this[a0n][z1s]=V5n;this[C0c](J6u);};Editor[T6u][q7c]=function(fn){var P1s="seCb";var B6u=s6n;B6u+=P6T;B6u+=P1s;this[a0n][B6u]=fn;};Editor[g6u][d6u]=function(arg1,arg2,arg3,arg4){var l1s="lea";var M1s="bj";var s1s="isPlainO";var c6u=H6c;c6u+=y0n;c6u+=k0n;var O6u=t0n;O6u+=q1s;O6u+=l1s;O6u+=k0n;var e6u=s1s;e6u+=M1s;e6u+=v03.h0n;e6u+=v03.D0n;var that=this;var title;var buttons;var show;var opts;v03[k5n]();if($[e6u](arg1)){opts=arg1;}else if(typeof arg1===O6u){show=arg1;opts=arg2;}else{title=arg1;buttons=arg2;show=arg3;opts=arg4;}if(show===undefined){show=C5n;}if(title){that[u2c](title);}if(buttons){var E6u=h1s;E6u+=a0n;that[E6u](buttons);}return{opts:$[g8T]({},this[a0n][D8c][c6u],opts),maybeOpen:function(){if(show){var u6u=k7n;u6u+=E6n;u6u+=R0n;u6u+=k0n;that[u6u]();}}};};Editor[a1T][i8c]=function(name){var U1s="ll";var D1s="Sourc";var W1s="ply";var F1s="shif";var r6u=X0n;r6u+=H6T;r6u+=D1s;r6u+=R0n;var x6u=F1s;x6u+=v03.D0n;var y6u=i1s;y6u+=U1s;var Z6u=h7n;Z6u+=w7n;Z6u+=M7n;var args=Array[Z6u][R1T][y6u](arguments);args[x6u]();var fn=this[a0n][r6u][name];if(fn){var j6u=x6T;j6u+=W1s;return fn[j6u](this,args);}};v03[y5n]();Editor[f6u][a6u]=function(includeFields){var T1s="Co";var J1s="templa";var B1s="clude";var d1s="includeFi";var g1s="Fiel";var Z1s='displayOrder';var S6u=v03.i0n;S6u+=o1s;S6u+=Z6n;var w6u=R9c;w6u+=K9c;var V6u=c6n;V6u+=v03.i0n;V6u+=s4n;var Y6u=c6n;Y6u+=b7n;Y6u+=R0n;var X6u=J1s;X6u+=U6n;var k6u=k7n;k6u+=r9n;k6u+=v03.l0n;k6u+=z0T;var b6u=b2n;b6u+=V9c;b6u+=a0n;var K6u=i3n;K6u+=c6n;K6u+=T1s;K6u+=t9n;var R6u=v03.l0n;R6u+=D4n;var that=this;var formContent=$(this[R6u][K6u]);var fields=this[a0n][b6u];var order=this[a0n][k6u];var template=this[a0n][X6u];var mode=this[a0n][Y6u]||p6c;if(includeFields){var A6u=s4n;A6u+=B1s;A6u+=g1s;A6u+=r4T;this[a0n][A6u]=includeFields;}else{var Q6u=d1s;Q6u+=T8c;includeFields=this[a0n][Q6u];}formContent[P7T]()[v0T]();$[h9T](order,function(i,fieldOrName){var u1s='[data-editor-template="';var c1s="after";var O1s='editor-field[name="';var L6u=F9T;L6u+=c6n;L6u+=R0n;var N6u=N9n;N6u+=y0n;N6u+=V9c;var name=fieldOrName instanceof Editor[N6u]?fieldOrName[L6u]():fieldOrName;if(that[e1s](name,includeFields)!==-o1n){var n6u=c6n;n6u+=G0T;if(template&&mode===n6u){template[c9c](O1s+name+E1s)[c1s](fields[name][d4T]());template[c9c](u1s+name+E1s)[q7T](fields[name][d4T]());}else{var I6u=k0n;I6u+=k7n;I6u+=v03.l0n;I6u+=R0n;formContent[q7T](fields[name][I6u]());}}});if(template&&mode===V6u){template[I2T](formContent);}this[C0c](Z1s,[this[a0n][w6u],this[a0n][S6u],formContent]);};Editor[C6u][U8c]=function(items,editFields,type,formOptions,setupDone){var A1s='initEdit';var r1s="sli";var f1s="modi";var a1s="tFields";var y1s="_displayRe";var x1s="rde";var X1s="oString";var j1s="_a";var Q1s='node';var g7u=c8T;g7u+=v03.i0n;var B7u=y1s;B7u+=k7n;B7u+=x1s;B7u+=r9n;var o7u=k2n;o7u+=k0n;o7u+=G3n;o7u+=Q5n;var W7u=r1s;W7u+=s6n;W7u+=R0n;var z7u=j1s;z7u+=n5n;z7u+=g7c;z7u+=w1T;var G7u=E5c;G7u+=r9n;G7u+=c6n;var H7u=v03.l0n;H7u+=k7n;H7u+=c6n;var p7u=R0n;p7u+=v03.l0n;p7u+=t6T;var t6u=f1s;t6u+=b2n;t6u+=z0T;var m6u=R0n;m6u+=A2n;m6u+=a1s;var v6u=S0n;v6u+=v03.l0n;v6u+=a0n;var that=this;var fields=this[a0n][v6u];var usedFields=[];v03[k5n]();var includeInOrder;var editData={};this[a0n][m6u]=editFields;this[a0n][R1s]=editData;this[a0n][t6u]=items;this[a0n][D0c]=p7u;this[H7u][G7u][R3T][I0T]=I9T;this[a0n][T3n]=type;this[z7u]();$[h9T](fields,function(name,field){var U7u=Q9T;U7u+=S9T;var q7u=R0n;q7u+=v03.i0n;q7u+=s6n;q7u+=r5n;var P7u=c6n;P7u+=j6n;P7u+=Y4T;field[P7u]();includeInOrder=V5n;editData[name]={};$[q7u](editFields,function(idSrc,edit){var b1s="ltiS";var k1s="ayFields";var K1s="scope";var l7u=v03.q0n;l7u+=y0n;l7u+=V9c;l7u+=a0n;if(edit[l7u][name]){var s7u=r9n;s7u+=k7n;s7u+=v6n;var val=field[N4T](edit[x8T]);editData[name][idSrc]=val===z1T?s5n:$[r9T](val)?val[R1T]():val;if(!formOptions||formOptions[K1s]===s7u){var h7u=E3n;h7u+=v03.q0n;var M7u=e7n;M7u+=b1s;M7u+=R0n;M7u+=v03.D0n;field[M7u](idSrc,val!==undefined?val:field[h7u]());if(!edit[K6c]||edit[K6c][name]){includeInOrder=C5n;}}else{var D7u=v03.l0n;D7u+=y0n;D7u+=v6T;D7u+=k1s;if(!edit[K6c]||edit[D7u][name]){var i7u=v03.l0n;i7u+=R0n;i7u+=v03.q0n;var F7u=u9n;F7u+=S0c;field[F7u](idSrc,val!==undefined?val:field[i7u]());includeInOrder=C5n;}}}});if(field[U7u]()[w5n]!==W1n&&includeInOrder){usedFields[A5n](name);}});var currOrder=this[I4T]()[W7u]();for(var i=currOrder[o7u]-o1n;i>=W1n;i--){var J7u=v03.D0n;J7u+=X1s;if($[M9T](currOrder[i][J7u](),usedFields)===-o1n){var T7u=v6T;T7u+=Y1s;T7u+=R0n;currOrder[T7u](i,o1n);}}this[B7u](currOrder);this[C0c](A1s,[_pluck(editFields,Q1s)[W1n],_pluck(editFields,g7u)[W1n],items,type],function(){var L1s='initMultiEdit';var e7u=N1s;e7u+=k0n;e7u+=v03.D0n;var d7u=v03.i0n;d7u+=v03.G0n;v03[d7u]();that[e7u](L1s,[editFields,items,type],function(){v03[y5n]();setupDone();});});};Editor[a1T][O7u]=function(trigger,args,promiseComplete){var I1s="triggerH";var m1s="Event";var z0s="the";var w1s="Ev";var C1s="triggerHand";var t1s="ect";var S1s="Cancel";var n1s="sult";var G0s="then";var p0s="res";var H0s="result";var V1s="andle";if(!args){args=[];}if($[r9T](trigger)){var E7u=D6T;E7u+=r5n;for(var i=W1n,ien=trigger[E7u];i<ien;i++){this[C0c](trigger[i],args);}}else{var K7u=r9n;K7u+=r0n;K7u+=v03.H0n;K7u+=O7n;var y7u=F7c;y7u+=n1s;var Z7u=E6n;Z7u+=F7c;var u7u=I1s;u7u+=V1s;u7u+=r9n;var c7u=w1s;c7u+=R0n;c7u+=H0T;var e=$[c7u](trigger);$(this)[u7u](e,args);if(trigger[O8s](Z7u)===W1n&&e[y7u]===V5n){var r7u=S1s;r7u+=s0T;var x7u=C1s;x7u+=v1s;$(this)[x7u]($[m1s](trigger+r7u),args);}if(promiseComplete){var a7u=F7c;a7u+=a0n;a7u+=s6T;var f7u=v03.M0n;f7u+=t1s;var j7u=p0s;j7u+=v03.H0n;j7u+=O7n;if(e[j7u]&&typeof e[H0s]===f7u&&e[a7u][G0s]){var R7u=z0s;R7u+=k0n;e[H0s][R7u](promiseComplete);}else{promiseComplete();}}return e[K7u];}};Editor[b7u][f7c]=function(input){var s0s="substring";var q0s=/^on([A-Z])/;var name;var names=input[c8s](R8T);for(var i=W1n,ien=names[w5n];i<ien;i++){name=names[i];var onStyle=name[P0s](q0s);if(onStyle){name=onStyle[o1n][l0s]()+name[s0s](T1n);}names[i]=name;}return names[S7c](R8T);};Editor[k7u][X7u]=function(node){var Y7u=S5T;Y7u+=s6n;Y7u+=r5n;var foundField=z1T;$[Y7u](this[a0n][i6c],function(name,field){var A7u=k0n;A7u+=k7n;A7u+=v03.l0n;A7u+=R0n;v03[k5n]();if($(field[A7u]())[c9c](node)[w5n]){foundField=field;}});v03[k5n]();return foundField;};Editor[a1T][Q7u]=function(fieldNames){var M0s="sArra";var N7u=y0n;N7u+=M0s;N7u+=f6n;if(fieldNames===undefined){return this[i6c]();}else if(!$[N7u](fieldNames)){return[fieldNames];}return fieldNames;};Editor[a1T][T7c]=function(fieldsIn,focus){var U0s=".DTE ";var F0s="lace";var W0s=/^jq:/;var h0s="etFocus";var D0s='jq:';var V7u=a0n;V7u+=h0s;var that=this;var field;var fields=$[w9c](fieldsIn,function(fieldOrName){return typeof fieldOrName===d9T?that[a0n][i6c][fieldOrName]:fieldOrName;});if(typeof focus===L0c){field=fields[focus];}else if(focus){if(focus[O8s](D0s)===W1n){var n7u=r9n;n7u+=y6n;n7u+=F0s;var L7u=i0s;L7u+=U0s;field=$(L7u+focus[n7u](W0s,s5n));}else{var I7u=j4T;I7u+=B0c;field=this[a0n][I7u][focus];}}this[a0n][V7u]=field;if(field){field[c1T]();}};Editor[w7u][m0c]=function(opts){var r0s='submit';var c0s="dteInli";var y0s="submitOnBlur";var R0s="onB";var o0s="messa";var f0s="onRetur";var e0s="turn";var O0s="On";var T0s="editCoun";var a0s="blurOnBackgroun";var j0s="ubmitOnRetur";var k0s="tit";var d0s="mitOnRe";var K0s="ack";var g0s="urOnBackgr";var b0s="grou";var u0s="oseOnComplete";var E0s="Complete";var x0s="Blu";var O2u=p0c;O2u+=R0n;O2u+=f6n;O2u+=F9c;var e2u=k7n;e2u+=k0n;var W2u=k7n;W2u+=k0n;var U2u=t0n;U2u+=q1s;U2u+=x0n;U2u+=P8c;var F2u=o0s;F2u+=G3n;F2u+=R0n;var D2u=J0s;D2u+=G3n;var M2u=T0s;M2u+=v03.D0n;var s2u=C9c;s2u+=B0s;var P2u=t0n;P2u+=x0n;P2u+=g0s;P2u+=j7T;var p2u=L8s;p2u+=d0s;p2u+=e0s;var C7u=g8c;C7u+=R0n;C7u+=O0s;C7u+=E0s;var S7u=g0n;S7u+=c0s;S7u+=a6n;var that=this;var inlineCount=__inlineCounter++;var namespace=S7u+inlineCount;if(opts[C7u]!==undefined){var v7u=M3n;v7u+=u0s;opts[Z0s]=opts[v7u]?a6T:P0T;}if(opts[y0s]!==undefined){var t7u=s6n;t7u+=P6T;t7u+=a0n;t7u+=R0n;var m7u=k7n;m7u+=k0n;m7u+=x0s;m7u+=r9n;opts[m7u]=opts[y0s]?r0s:t7u;}if(opts[p2u]!==undefined){var z2u=k0n;z2u+=Z6n;z2u+=R0n;var G2u=a0n;G2u+=j0s;G2u+=k0n;var H2u=f0s;H2u+=k0n;opts[H2u]=opts[G2u]?r0s:z2u;}if(opts[P2u]!==undefined){var l2u=a0s;l2u+=v03.l0n;var q2u=R0s;q2u+=K0s;q2u+=b0s;q2u+=w0T;opts[q2u]=opts[l2u]?m4T:P0T;}this[a0n][s2u]=opts;this[a0n][M2u]=inlineCount;if(typeof opts[u2c]===d9T||typeof opts[u2c]===v03.o0n){var h2u=k0s;h2u+=x0n;h2u+=R0n;this[h2u](opts[u2c]);opts[u2c]=C5n;}if(typeof opts[v8T]===D2u||typeof opts[F2u]===v03.o0n){var i2u=x0c;i2u+=u7n;this[v8T](opts[i2u]);opts[v8T]=C5n;}if(typeof opts[i1c]!==U2u){this[i1c](opts[i1c]);opts[i1c]=C5n;}$(document)[W2u](X0s+namespace,function(e){var V0s="ntDefault";var N0s="_fieldFrom";var n0s="canReturnSubmit";var I0s="preve";var L0s="Node";var Q0s="unction";var T2u=I0T;T2u+=R0n;T2u+=v03.l0n;var J2u=p0c;J2u+=Y0s;var o2u=v03.H0n;o2u+=v03.G0n;v03[o2u]();if(e[J2u]===u1n&&that[a0n][T2u]){var el=$(document[A0s]);if(el){var g2u=v03.q0n;g2u+=Q0s;var B2u=N0s;B2u+=L0s;var field=that[B2u](el);if(field&&typeof field[n0s]===g2u&&field[n0s](el)){var d2u=I0s;d2u+=V0s;e[d2u]();}}}});$(document)[e2u](O2u+namespace,function(e){var U9s='.DTE_Form_Buttons';var F9s="nE";var M9s="rn";var v0s="iveElement";var h9s="preventDefau";var G9s="rnSubmit";var s9s="onRetu";var o9s="prev";var p9s="eturnS";var X1n=37;var q9s="onRe";var P9s="nReturn";var t0s="nR";var D9s="Es";var Y1n=39;var C0s="Cod";var H9s="canRetu";var i9s="onEsc";var l9s="bmi";var z9s="ldFromNode";var X2u=x0n;X2u+=w0s;X2u+=Q5n;var k2u=E6n;k2u+=S0s;k2u+=v03.D0n;k2u+=a0n;var a2u=p0c;a2u+=o0c;a2u+=C0s;a2u+=R0n;var E2u=C1c;E2u+=v0s;var el=$(document[E2u]);if(e[m0s]===u1n&&that[a0n][z1s]){var Z2u=i1s;Z2u+=t0s;Z2u+=p9s;Z2u+=J2c;var u2u=H9s;u2u+=G9s;var c2u=j7n;c2u+=x4T;c2u+=z9s;var field=that[c2u](el);if(field&&typeof field[u2u]===v03.o0n&&field[Z2u](el)){var r2u=k7n;r2u+=P9s;var y2u=q9s;y2u+=e0s;if(opts[y2u]===r0s){var x2u=a0n;x2u+=v03.H0n;x2u+=l9s;x2u+=v03.D0n;e[J0c]();that[x2u]();}else if(typeof opts[r2u]===v03.o0n){var f2u=s9s;f2u+=M9s;var j2u=h9s;j2u+=x0n;j2u+=v03.D0n;e[j2u]();opts[f2u](that,e);}}}else if(e[a2u]===a1n){var b2u=s6n;b2u+=x0n;b2u+=h3n;b2u+=R0n;var R2u=Z6n;R2u+=D9s;R2u+=s6n;e[J0c]();if(typeof opts[R2u]===v03.o0n){var K2u=k7n;K2u+=F9s;K2u+=a0n;K2u+=s6n;opts[K2u](that,e);}else if(opts[i9s]===m4T){that[t4T]();}else if(opts[i9s]===b2u){that[C7T]();}else if(opts[i9s]===r0s){that[p8c]();}}else if(el[k2u](U9s)[X2u]){if(e[m0s]===X1n){var Y2u=v03.q0n;Y2u+=W9s;el[o9s](J9s)[Y2u]();}else if(e[m0s]===Y1n){var Q2u=v03.q0n;Q2u+=T9s;Q2u+=v03.H0n;Q2u+=a0n;var A2u=t0n;A2u+=a0T;A2u+=v03.D0n;A2u+=Z6n;el[B9s](A2u)[Q2u]();}}});this[a0n][G1s]=function(){var g9s="down";var d9s='keyup';var L2u=k7n;L2u+=v03.q0n;L2u+=v03.q0n;var N2u=p0c;N2u+=R0n;N2u+=f6n;N2u+=g9s;$(document)[o1c](N2u+namespace);$(document)[L2u](d9s+namespace);};return namespace;};Editor[n2u][e9s]=function(direction,action,data){var O9s="legacy";var I2u=O9s;I2u+=M8T;I2u+=P3n;I2u+=v7n;if(!this[a0n][I2u]||!data){return;}if(direction===E9s){var V2u=R0n;V2u+=v03.l0n;V2u+=y0n;V2u+=v03.D0n;if(action===c9s||action===V2u){var w2u=R0n;w2u+=v03.l0n;w2u+=y0n;w2u+=v03.D0n;var id;$[h9T](data[x8T],function(rowId,values){var u9s='Editor: Multi-row editing is not supported by the legacy Ajax data format';if(id!==undefined){throw u9s;}id=rowId;});data[x8T]=data[x8T][id];if(action===w2u){data[H7n]=id;}}else{var C2u=c8T;C2u+=v03.i0n;var S2u=c6n;S2u+=v03.i0n;S2u+=E6n;data[H7n]=$[S2u](data[C2u],function(values,id){return id;});delete data[x8T];}}else{var v2u=v03.l0n;v2u+=Z8T;if(!data[v2u]&&data[c4T]){var m2u=r9n;m2u+=Z2n;data[x8T]=[data[m2u]];}else if(!data[x8T]){var t2u=X0n;t2u+=H6T;data[t2u]=[];}}};Editor[a1T][Z9s]=function(json){var p3u=v03.i0n;p3u+=v03.G0n;v03[p3u]();var that=this;if(json[y9s]){var H3u=j4T;H3u+=x0n;H3u+=r4T;$[h9T](this[a0n][H3u],function(name,field){var x9s="ptions";var j9s="upd";var r9s="update";var G3u=k7n;G3u+=x9s;v03[k5n]();if(json[G3u][name]!==undefined){var fieldInst=that[R4T](name);if(fieldInst&&fieldInst[r9s]){var z3u=j9s;z3u+=v03.i0n;z3u+=v03.D0n;z3u+=R0n;fieldInst[z3u](json[y9s][name]);}}});}};Editor[P3u][q3u]=function(el,msg){var f9s="nction";var b9s="fade";var R9s="splayed";var a9s="tab";var X9s="cs";var k9s="In";var K9s="fadeOut";var l3u=X1T;l3u+=f9s;var canAnimate=$[h5n][z6T]?C5n:V5n;v03[y5n]();if(typeof msg===l3u){var M3u=a9s;M3u+=x0n;M3u+=R0n;var s3u=M8T;s3u+=h8T;msg=msg(this,new DataTable[s3u](this[a0n][M3u]));}el=$(el);if(canAnimate){el[K8s]();}if(!msg){var h3u=A2n;h3u+=R9s;if(this[a0n][h3u]&&canAnimate){el[K9s](function(){var D3u=r5n;D3u+=v03.D0n;D3u+=e2c;v03[k5n]();el[D3u](s5n);});}else{var U3u=R9c;U3u+=H2c;var i3u=s6n;i3u+=a0n;i3u+=a0n;var F3u=I5T;F3u+=c6n;F3u+=x0n;el[F3u](s5n)[i3u](U3u,P0T);}}else{var W3u=g3T;W3u+=L2n;if(this[a0n][W3u]&&canAnimate){var J3u=b9s;J3u+=k9s;var o3u=r5n;o3u+=v03.D0n;o3u+=e2c;el[o3u](msg)[J3u]();}else{var B3u=X9s;B3u+=a0n;var T3u=r5n;T3u+=v03.D0n;T3u+=c6n;T3u+=x0n;el[T3u](msg)[B3u](h1T,I9T);}}};Editor[g3u][d3u]=function(){var N9s="own";var V9s="multiEditable";var Q9s="Sh";var n9s="ultiVal";var Y9s="cludeF";var A9s="tiInfo";var L9s="isM";var O3u=y0n;O3u+=k0n;O3u+=Y9s;O3u+=G2c;var e3u=R4T;e3u+=a0n;var fields=this[a0n][e3u];var include=this[a0n][O3u];var show=C5n;var state;if(!include){return;}for(var i=W1n,ien=include[w5n];i<ien;i++){var u3u=Q9T;u3u+=A9s;u3u+=Q9s;u3u+=N9s;var c3u=L9s;c3u+=s6T;c3u+=E0T;var E3u=L9s;E3u+=n9s;E3u+=I9s;var field=fields[include[i]];var multiEditable=field[V9s]();if(field[E3u]()&&multiEditable&&show){state=C5n;show=V5n;}else if(field[c3u]()&&!multiEditable){state=C5n;}else{state=V5n;}fields[include[i]][u3u](state);}};Editor[Z3u][y3u]=function(type){var C9s="ternal";var t9s="yController";var H6s="tor-focus";var S9s="or-in";var v9s="bm";var m9s="it.editor-in";var p6s="captureFocus";var w9s="submit.edi";var n3u=C1c;n3u+=g7c;var L3u=k7n;L3u+=J7n;var R3u=w9s;R3u+=v03.D0n;R3u+=S9s;R3u+=C9s;var a3u=D3n;a3u+=v9s;a3u+=m9s;a3u+=C9s;var f3u=k7n;f3u+=v03.q0n;f3u+=v03.q0n;var j3u=E5c;j3u+=E8c;var r3u=v9T;r3u+=c6n;var x3u=g3T;x3u+=t9s;var that=this;var focusCapture=this[a0n][x3u][p6s];if(focusCapture===undefined){focusCapture=C5n;}$(this[r3u][j3u])[f3u](a3u)[Z6n](R3u,function(e){e[J0c]();});if(focusCapture&&(type===p6c||type===W8c)){var b3u=S8s;b3u+=A2n;b3u+=H6s;var K3u=u3T;K3u+=R5T;$(K3u)[Z6n](b3u,function(){var P6s='.DTED';var q6s="etFocu";var G6s="arents";var z6s="rents";var l6s="tFocus";var A3u=E6n;A3u+=G6s;var Y3u=x0n;Y3u+=R0n;Y3u+=G6n;Y3u+=Q5n;var X3u=g0n;X3u+=I9n;X3u+=u6n;X3u+=O0n;var k3u=h7T;k3u+=z6s;v03[k5n]();if($(document[A0s])[k3u](X3u)[Y3u]===W1n&&$(document[A0s])[A3u](P6s)[w5n]===W1n){var Q3u=a0n;Q3u+=q6s;Q3u+=a0n;if(that[a0n][Q3u]){var N3u=s3n;N3u+=l6s;that[a0n][N3u][c1T]();}}});}this[E6T]();this[C0c](L3u,[type,this[a0n][n3u]]);return C5n;};Editor[I3u][V3u]=function(type){var i6s="eIc";var M6s="can";var D6s="clearDyna";var F6s="micInfo";var h6s="celOpen";if(this[C0c](s6s,[type,this[a0n][D0c]])===V5n){var t3u=Q8c;t3u+=t0n;t3u+=q9n;var m3u=c6n;m3u+=k7n;m3u+=v03.l0n;m3u+=R0n;var v3u=c6n;v3u+=k7n;v3u+=v03.l0n;v3u+=R0n;var C3u=v03.i0n;C3u+=o1s;C3u+=k7n;C3u+=k0n;var S3u=M6s;S3u+=h6s;var w3u=o6n;w3u+=D6s;w3u+=F6s;this[w3u]();this[C0c](S3u,[type,this[a0n][C3u]]);if((this[a0n][v3u]===X2c||this[a0n][m3u]===t3u)&&this[a0n][G1s]){var p5u=g8c;p5u+=i6s;p5u+=t0n;this[a0n][p5u]();}this[a0n][G1s]=z1T;return V5n;}this[a0n][z1s]=type;return C5n;};Editor[H5u][W2c]=function(processing){var W6s="Cla";var T6s='processing';var U6s="oggle";var J6s="active";var z5u=v03.D0n;z5u+=U6s;z5u+=W6s;z5u+=H2n;var G5u=v03.l0n;G5u+=o6s;G5u+=w9n;G5u+=O0n;var procClass=this[y0T][p1T][J6s];$([G5u,this[W1T][a8T]])[z5u](procClass,processing);this[a0n][p1T]=processing;this[C0c](T6s,[processing]);};Editor[P5u][q7n]=function(successCallback,errorCallback,formatdata,hide){var Q6s="ven";var L6s="nComplete";var c6s="_fnSetObjectDataFn";var V6s="ocessing";var Z6s="dbTable";var w6s="_submitTable";var O6s="ataSo";var A6s="itComplete";var y6s="han";var B6s="_aj";var E6s="urce";var d6s="preSu";var X6s='allIfChanged';var N6s="functi";var k6s='all';var g6s="Url";var n6s="onCompl";var R5u=s6n;R5u+=v03.i0n;R5u+=x0n;R5u+=x0n;var a5u=B6s;a5u+=v03.i0n;a5u+=q3n;var f5u=w4T;f5u+=g6s;var j5u=v03.i0n;j5u+=P3n;j5u+=v03.i0n;j5u+=q3n;var x5u=d6s;x5u+=t0n;x5u+=c6n;x5u+=t6T;var y5u=e6s;y5u+=v03.D0n;var i5u=R0n;i5u+=v03.l0n;i5u+=y0n;i5u+=v03.D0n;var F5u=f2c;F5u+=F4n;var D5u=v03.l0n;D5u+=t0n;D5u+=f4c;var h5u=C1c;h5u+=g7c;var M5u=v03.i0n;M5u+=v03.G0n;var s5u=v03.l0n;s5u+=O6s;s5u+=E6s;var l5u=k7n;l5u+=U4T;var q5u=R0n;q5u+=q3n;q5u+=v03.D0n;var that=this;var i,iLen,eventRet,errorNodes;var changed=V5n,allData={},changedData={};var setBuilder=DataTable[q5u][l5u][c6s];var dataSource=this[a0n][s5u];var fields=this[a0n][i6c];v03[M5u]();var editCount=this[a0n][u6s];var modifier=this[a0n][u7c];var editFields=this[a0n][n0c];var editData=this[a0n][R1s];var opts=this[a0n][C4T];var changedSubmit=opts[p8c];var submitParamsLocal;var action=this[a0n][h5u];var submitParams={"action":action,"data":{}};if(this[a0n][D5u]){submitParams[g1T]=this[a0n][Z6s];}if(action===F5u||action===i5u){var T5u=s6n;T5u+=y6s;T5u+=x6s;T5u+=v03.l0n;$[h9T](editFields,function(idSrc,edit){var allRowData={};var changedRowData={};$[h9T](fields,function(name,field){var R6s='-many-count';var r6s="submittable";var j6s="compa";var a6s=/\[.*$/;v03[k5n]();if(edit[i6c][name]&&field[r6s]()){var o5u=j6s;o5u+=r9n;o5u+=R0n;var W5u=f6s;W5u+=c5n;var multiGet=field[x7c]();var builder=setBuilder(name);if(multiGet[idSrc]===undefined){var U5u=v03.l0n;U5u+=v03.i0n;U5u+=v03.D0n;U5u+=v03.i0n;var originalVal=field[N4T](edit[U5u]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=$[r9T](value)&&name[O8s](W5u)!==-o1n?setBuilder(name[e9T](a6s,s5n)+R6s):z1T;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[w5n]);}if(action===M7c&&(!editData[name]||!field[o5u](value,editData[name][idSrc]))){builder(changedRowData,value);changed=C5n;if(manyBuilder){var J5u=k2n;J5u+=K6s;J5u+=r5n;manyBuilder(changedRowData,value[J5u]);}}}});if(!$[b6s](allRowData)){allData[idSrc]=allRowData;}if(!$[b6s](changedRowData)){changedData[idSrc]=changedRowData;}});if(action===c9s||changedSubmit===k6s||changedSubmit===X6s&&changed){submitParams[x8T]=allData;}else if(changedSubmit===T5u&&changed){submitParams[x8T]=changedData;}else{var u5u=Y6s;u5u+=A6s;var c5u=Y7n;c5u+=Q6s;c5u+=v03.D0n;var E5u=B7n;E5u+=r9n;E5u+=k7n;E5u+=W9T;var e5u=N6s;e5u+=k7n;e5u+=k0n;var g5u=k7n;g5u+=L6s;var B5u=J3c;B5u+=k0n;this[a0n][B5u]=z1T;if(opts[g5u]===a6T&&(hide===undefined||hide)){var d5u=n8s;d5u+=h3n;d5u+=R0n;this[d5u](V5n);}else if(typeof opts[Z0s]===e5u){var O5u=n6s;O5u+=x2n;O5u+=R0n;opts[O5u](this);}if(successCallback){successCallback[K1T](this);}this[E5u](V5n);this[c5u](u5u);return;}}else if(action===A9T){$[h9T](editFields,function(idSrc,edit){var Z5u=X0n;Z5u+=H6T;submitParams[Z5u][idSrc]=edit[x8T];});}this[e9s](E9s,action,submitParams);submitParamsLocal=$[g8T](C5n,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[y5u](x5u,[submitParams,action])===V5n){var r5u=I6s;r5u+=V6s;this[r5u](V5n);return;}var submitWire=this[a0n][j5u]||this[a0n][f5u]?this[a5u]:this[w6s];submitWire[R5u](this,submitParams,function(json,notGood,xhr){var S6s="_submitSuccess";var b5u=J3c;b5u+=k0n;var K5u=v03.H0n;K5u+=v03.G0n;v03[K5u]();that[S6s](json,notGood,submitParams,submitParamsLocal,that[a0n][b5u],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var C6s="_su";var v6s="bmitError";var X5u=C1c;X5u+=g6n;X5u+=k0n;var k5u=C6s;k5u+=v6s;v03[y5n]();that[k5u](xhr,err,thrown,errorCallback,submitParams,that[a0n][X5u]);},submitParams);};Editor[Y5u][A5u]=function(data,success,error,submitParams){var t6s="bjectD";var m6s="_fnSetO";var z7s="ataSource";var L5u=m6s;L5u+=t6s;L5u+=Z8T;L5u+=U0T;var N5u=k7n;N5u+=M8T;N5u+=E6n;N5u+=y0n;var Q5u=R0n;Q5u+=q3n;Q5u+=v03.D0n;var that=this;var action=data[D0c];var out={data:[]};var idGet=DataTable[Q5u][p7s][H7s](this[a0n][G7s]);var idSet=DataTable[V0n][N5u][L5u](this[a0n][G7s]);if(action!==y2c){var S5u=X0n;S5u+=v03.D0n;S5u+=v03.i0n;var w5u=S5T;w5u+=s6n;w5u+=r5n;var V5u=x3n;V5u+=X0c;var I5u=D3T;I5u+=z7s;var n5u=c6n;n5u+=v03.i0n;n5u+=y0n;n5u+=k0n;var originalData=this[a0n][T3n]===n5u?this[I5u](t9c,this[u7c]()):this[i8c](r6c,this[V5u]());$[w5u](data[S5u],function(key,vals){var t5u=v03.l0n;t5u+=v03.i0n;t5u+=v03.D0n;t5u+=v03.i0n;var m5u=s6n;m5u+=r9n;m5u+=a2c;m5u+=R0n;var C5u=R0n;C5u+=y9n;var toSave;var extender=$[h5n][P7s][p7s][q7s];if(action===C5u){var v5u=v03.l0n;v5u+=I6n;v5u+=v03.i0n;var rowData=originalData[key][v5u];toSave=extender({},rowData,C5n);toSave=extender(toSave,vals,C5n);}else{toSave=extender({},vals,C5n);}v03[k5n]();var overrideId=idGet(toSave);if(action===m5u&&overrideId===undefined){idSet(toSave,+new Date()+s5n+key);}else{idSet(toSave,overrideId);}out[t5u][A5n](toSave);});}v03[k5n]();success(out);};Editor[a1T][p4u]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var H2s="onComp";var i7s="ubm";var N7s="eCre";var F7s="tS";var o7s="yAjax";var W7s="gac";var n7s="post";var A7s="dataSource";var U7s="_le";var T7s="dErrors";var w7s="Rem";var l7s="itC";var J7s='receive';var B7s="itUnsucces";var g7s="sful";var z2s="_c";var G2s="ete";var K7s="crea";var k7s="_data";var Q7s='id';var m7s='preRemove';var I7s="preEdi";var Y7s='prep';var L7s='postCreate';var P2s="lose";var d7s="br>";var M7s="dError";var h7s="dErro";var t7s="nC";var X7s="Source";var R7s="tSuccess";var V7s='commit';var C7s="_dataSourc";var p2s="omplet";var v7s="pre";var q8v=Y6s;q8v+=l7s;q8v+=Z8s;var P8v=o6n;P8v+=s7s;P8v+=R0n;P8v+=H0T;var s4u=x0n;s4u+=R0n;s4u+=G6n;s4u+=Q5n;var l4u=S0n;l4u+=M7s;l4u+=a0n;var P4u=S0n;P4u+=h7s;P4u+=r9n;P4u+=a0n;var z4u=D7s;z4u+=F7s;z4u+=i7s;z4u+=t6T;var G4u=U7s;G4u+=W7s;G4u+=o7s;var H4u=c6n;H4u+=k7n;H4u+=X0c;var that=this;var setData;var fields=this[a0n][i6c];var opts=this[a0n][C4T];var modifier=this[a0n][H4u];this[G4u](J7s,action,json);this[C0c](z4u,[json,submitParams,action,xhr]);if(!json[g0T]){json[g0T]=v03.s0n;}if(!json[P4u]){var q4u=b2n;q4u+=R0n;q4u+=x0n;q4u+=T7s;json[q4u]=[];}if(notGood||json[g0T]||json[l4u][s4u]){var c4u=Y6s;c4u+=B7s;c4u+=g7s;var E4u=Y7n;E4u+=A7n;E4u+=R0n;E4u+=H0T;var O4u=i4n;O4u+=d7s;var e4u=P3n;e4u+=k7n;e4u+=s4n;var d4u=z0T;d4u+=r9n;d4u+=l6n;var h4u=S5T;h4u+=s6n;h4u+=r5n;var globalError=[];if(json[g0T]){var M4u=E6n;M4u+=v03.H0n;M4u+=u2n;globalError[M4u](json[g0T]);}$[h4u](json[m3c],function(i,err){var y7s="Err";var j7s="sitio";var Z7s="d: ";var u7s="wn fiel";var x7s="erro";var a7s="Error";var E7s="Un";var r7s="onFieldError";var c7s="kno";var e7s="ayed";var U4u=E9n;U4u+=E6n;U4u+=x0n;U4u+=e7s;var D4u=v03.i0n;D4u+=v03.G0n;var field=fields[err[d8T]];v03[D4u]();if(!field){var i4u=O7s;i4u+=R0n;var F4u=E7s;F4u+=c7s;F4u+=u7s;F4u+=Z7s;throw new Error(F4u+err[i4u]);}else if(field[U4u]()){var o4u=y7s;o4u+=l6n;var W4u=x7s;W4u+=r9n;field[W4u](err[l8s]||o4u);if(i===W1n){if(opts[r7s]===b0T){var T4u=g9c;T4u+=j7s;T4u+=k0n;var J4u=I3T;J4u+=r1T;J4u+=z0T;that[V7T]($(that[W1T][y4c],that[a0n][J4u]),{scrollTop:$(field[d4T]())[T4u]()[X1c]},w1n);field[c1T]();}else if(typeof opts[r7s]===v03.o0n){opts[r7s](that,err);}}}else{var g4u=f7s;g4u+=G5n;var B4u=E6n;B4u+=v03.H0n;B4u+=a0n;B4u+=r5n;globalError[B4u](field[d8T]()+g4u+(err[l8s]||a7s));}});this[d4u](globalError[e4u](O4u));this[E4u](c4u,[json]);if(errorCallback){var u4u=s6n;u4u+=W0c;errorCallback[u4u](that,json);}}else{var z8v=L8s;z8v+=C9T;z8v+=R7s;var x4u=J2n;x4u+=y0n;x4u+=v03.D0n;var y4u=K7s;y4u+=v03.D0n;y4u+=R0n;var Z4u=v03.l0n;Z4u+=v03.i0n;Z4u+=v03.D0n;Z4u+=v03.i0n;var store={};if(json[Z4u]&&(action===y4u||action===x4u)){var f4u=k2n;f4u+=k0n;f4u+=b7s;f4u+=r5n;var j4u=v03.l0n;j4u+=v03.i0n;j4u+=v03.D0n;j4u+=v03.i0n;var r4u=k7s;r4u+=X7s;this[r4u](Y7s,action,modifier,submitParamsLocal,json,store);for(var i=W1n;i<json[j4u][f4u];i++){var Y4u=O4c;Y4u+=v03.D0n;var K4u=f2c;K4u+=v03.i0n;K4u+=U6n;var R4u=s3n;R4u+=v03.D0n;R4u+=n0n;R4u+=H6T;var a4u=o6n;a4u+=A7s;setData=json[x8T][i];var id=this[a4u](Q7s,setData);this[C0c](R4u,[json,setData,action]);if(action===K4u){var X4u=v2n;X4u+=S5T;X4u+=U6n;var k4u=v2n;k4u+=a0c;var b4u=h7n;b4u+=N7s;b4u+=F4n;this[C0c](b4u,[json,setData,id]);this[i8c](k4u,fields,setData,store);this[C0c]([X4u,L7s],[json,setData,id]);}else if(action===Y4u){var N4u=n7s;N4u+=j3n;var Q4u=I7s;Q4u+=v03.D0n;var A4u=N1s;A4u+=H0T;this[A4u](Q4u,[json,setData,id]);this[i8c](M7c,modifier,fields,setData,store);this[C0c]([M7c,N4u],[json,setData,id]);}}this[i8c](V7s,action,modifier,json[x8T],store);}else if(action===A9T){var S4u=p0T;S4u+=c6n;S4u+=C9T;S4u+=v03.D0n;var w4u=y0n;w4u+=v03.l0n;w4u+=a0n;var V4u=n7s;V4u+=w7s;V4u+=S7s;V4u+=R0n;var I4u=C7s;I4u+=R0n;var n4u=H7n;n4u+=a0n;var L4u=v7s;L4u+=E6n;this[i8c](L4u,action,modifier,submitParamsLocal,json,store);this[C0c](m7s,[json,this[n4u]()]);this[I4u](y2c,modifier,fields,store);this[C0c]([y2c,V4u],[json,this[w4u]()]);this[i8c](S4u,action,modifier,json[x8T],store);}if(editCount===this[a0n][u6s]){var G8v=A8s;G8v+=v03.D0n;G8v+=g6n;G8v+=k0n;var H8v=k7n;H8v+=t7s;H8v+=p2s;H8v+=R0n;var t4u=s6n;t4u+=x0n;t4u+=k7n;t4u+=s3n;var m4u=H2s;m4u+=x0n;m4u+=G2s;var v4u=v03.i0n;v4u+=o1s;v4u+=Z6n;var C4u=i4T;C4u+=Z6n;var action=this[a0n][C4u];this[a0n][v4u]=z1T;if(opts[m4u]===t4u&&(hide===undefined||hide)){var p8v=z2s;p8v+=P2s;this[p8v](json[x8T]?C5n:V5n,action);}else if(typeof opts[H8v]===G8v){opts[Z0s](this);}}if(successCallback){successCallback[K1T](that,json);}this[C0c](z8v,[json,setData,action]);}this[W2c](V5n);this[P8v](q8v,[json,setData,action]);};Editor[a1T][q2s]=function(xhr,err,thrown,errorCallback,submitParams,action){var D2s='submitError';var M2s="tSubmit";var h2s="system";var l2s="ubmitComplete";var W8v=a0n;W8v+=l2s;var U8v=e6s;U8v+=v03.D0n;var F8v=I6s;F8v+=T9s;F8v+=R0n;F8v+=s2s;var D8v=v03.i0n;D8v+=v03.G0n;var h8v=h9c;h8v+=k7n;h8v+=r9n;var M8v=y0n;M8v+=B0n;M8v+=h6T;M8v+=k0n;var s8v=D7s;s8v+=M2s;var l8v=e6s;l8v+=v03.D0n;this[l8v](s8v,[z1T,submitParams,action,xhr]);this[g0T](this[M8v][h8v][h2s]);v03[D8v]();this[F8v](V5n);if(errorCallback){var i8v=s6n;i8v+=W0c;errorCallback[i8v](this,xhr,err,thrown);}this[U8v]([D2s,W8v],[xhr,err,thrown,submitParams]);};Editor[a1T][o8v]=function(fn){var F2s="line";var U2s="ttin";var J2s='submitComplete';var E8v=s4n;E8v+=F2s;var O8v=E9n;O8v+=B5T;var B8v=v03.D0n;B8v+=i2s;B8v+=R0n;var T8v=M8T;T8v+=E6n;T8v+=y0n;var J8v=v03.D0n;J8v+=Y2n;var that=this;var dt=this[a0n][J8v]?new $[h5n][D5n][T8v](this[a0n][B8v]):z1T;var ssp=V5n;if(dt){var g8v=s3n;g8v+=U2s;g8v+=i8T;ssp=dt[g8v]()[W1n][W2s][o2s];}v03[k5n]();if(this[a0n][p1T]){var d8v=k7n;d8v+=k0n;d8v+=R0n;this[d8v](J2s,function(){var B2s='draw';var e8v=v03.H0n;e8v+=v03.G0n;v03[e8v]();if(ssp){dt[T2s](B2s,fn);}else{setTimeout(function(){v03[k5n]();fn();},O1n);}});return C5n;}else if(this[O8v]()===E8v||this[I0T]()===W8c){this[T2s](a6T,function(){var d2s="mplet";var g2s="ubmitCo";var c8v=v03.i0n;c8v+=v03.G0n;v03[c8v]();if(!that[a0n][p1T]){setTimeout(function(){if(that[a0n]){fn();}},O1n);}else{var u8v=a0n;u8v+=g2s;u8v+=d2s;u8v+=R0n;that[T2s](u8v,function(e,json){v03[y5n]();if(ssp&&json){var Z8v=v03.l0n;Z8v+=e2s;dt[T2s](Z8v,fn);}else{setTimeout(function(){var y8v=v03.H0n;y8v+=v03.G0n;v03[y8v]();if(that[a0n]){fn();}},O1n);}});}})[t4T]();return C5n;}return V5n;};Editor[a1T][e1s]=function(name,arr){v03[y5n]();for(var i=W1n,ien=arr[w5n];i<ien;i++){if(name==arr[i]){return i;}}return-o1n;};Editor[O2s]={"table":z1T,"ajaxUrl":z1T,"fields":[],"display":E2s,"ajax":z1T,"idSrc":x8v,"events":{},"i18n":{"create":{"button":r8v,"title":j8v,"submit":c2s},"edit":{"button":j3n,"title":f8v,"submit":a8v},"remove":{"button":u2s,"title":u2s,"submit":u2s,"confirm":{"_":Z2s,"1":R8v}},"error":{"system":y2s},multi:{title:x2s,info:r2s,restore:j2s,noMulti:K8v},datetime:{previous:b8v,next:k8v,months:[f2s,X8v,a2s,R2s,Y8v,A8v,Q8v,K2s,N8v,b2s,k2s,X2s],weekdays:[Y2s,L8v,n8v,A2s,Q2s,N2s,L2s],amPm:[n2s,I8v],hours:I2s,minutes:V8v,seconds:V2s,unknown:C7c}},formOptions:{bubble:$[g8T]({},Editor[f6T][w8v],{title:V5n,message:V5n,buttons:S8v,submit:C8v}),inline:$[v8v]({},Editor[f6T][D8c],{buttons:V5n,submit:m8v}),main:$[g8T]({},Editor[f6T][D8c])},legacyAjax:V5n};(function(){var K3s="taTable";var y5s="ess";var t3s="[dat";var i5s="dataSrc";var R3s="drawType";var s3s='row';var k3s="rowIds";var e3s="cells";var o9v=r5n;o9v+=v03.D0n;o9v+=c6n;o9v+=x0n;var __dataSources=Editor[P4c]={};var __dtIsSsp=function(dt,editor){var C2s="itOpt";var w2s="dra";var S2s="Type";var p1v=w2s;p1v+=v6n;p1v+=S2s;var t8v=R0n;t8v+=v03.l0n;t8v+=C2s;t8v+=a0n;return dt[j6T]()[W1n][W2s][o2s]&&editor[a0n][t8v][p1v]!==P0T;};var __dtApi=function(table){v03[y5n]();return $(table)[O5n]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var v2s="dC";var t2s='highlight';var G1v=E3c;G1v+=v2s;G1v+=m2s;var H1v=v03.i0n;H1v+=v03.G0n;v03[H1v]();node[G1v](t2s);setTimeout(function(){var S1n=550;var G3s="ighlight";var H3s="noH";var p3s="removeCla";var P1v=p3s;P1v+=a0n;P1v+=a0n;var z1v=H3s;z1v+=G3s;node[o0T](z1v)[P1v](t2s);setTimeout(function(){var z3s="oHighl";var q1v=k0n;q1v+=z3s;q1v+=S6T;q1v+=v03.D0n;node[M0T](q1v);},S1n);},w1n);},x1n);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var q3s="ws";var P3s="inde";var s1v=P3s;s1v+=q3n;s1v+=r0n;var l1v=r9n;l1v+=k7n;l1v+=q3s;v03[k5n]();dt[l1v](identifier)[s1v]()[h9T](function(idx){var Z1n=14;var l3s='Unable to find row identifier';var F1v=k0n;F1v+=k7n;F1v+=v03.l0n;F1v+=R0n;var h1v=r9n;h1v+=k7n;h1v+=v6n;var M1v=v03.H0n;M1v+=v03.G0n;v03[M1v]();var row=dt[h1v](idx);var data=row[x8T]();var idSrc=idFn(data);if(idSrc===undefined){var D1v=R0n;D1v+=X2n;D1v+=k7n;D1v+=r9n;Editor[D1v](l3s,Z1n);}out[idSrc]={idSrc:idSrc,data:data,node:row[F1v](),fields:fields,type:s3s};});};var __dtFieldsFromIdx=function(dt,fields,idx){var i3s="mData";var U3s='Unable to automatically determine field from source. Please specify the field name.';var M3s="isEmptyO";var F3s="ett";var h3s="ao";var D3s="Columns";var g1v=M3s;g1v+=t0n;g1v+=S5n;var T1v=S5T;T1v+=x5n;var W1v=J2n;W1v+=A0c;W1v+=x0n;W1v+=v03.l0n;var U1v=h3s;U1v+=D3s;var i1v=a0n;i1v+=F3s;i1v+=s4n;i1v+=i8T;var field;var col=dt[i1v]()[W1n][U1v][idx];var dataSrc=col[A4T]!==undefined?col[W1v]:col[i3s];var resolvedFields={};var run=function(field,dataSrc){var o1v=v03.i0n;o1v+=v03.G0n;v03[o1v]();if(field[d8T]()===dataSrc){var J1v=k0n;J1v+=e8T;J1v+=R0n;resolvedFields[field[J1v]()]=field;}};$[T1v](fields,function(name,fieldInst){var B1v=H9c;B1v+=r9n;B1v+=v03.i0n;B1v+=f6n;v03[y5n]();if($[B1v](dataSrc)){for(var i=W1n;i<dataSrc[w5n];i++){run(fieldInst,dataSrc[i]);}}else{run(fieldInst,dataSrc);}});if($[g1v](resolvedFields)){Editor[g0T](U3s,E1n);}v03[k5n]();return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var o3s="cell";var O1v=y0n;O1v+=w0T;O1v+=W3s;var e1v=o3s;e1v+=a0n;var d1v=v03.i0n;d1v+=v03.G0n;v03[d1v]();dt[e1v](identifier)[O1v]()[h9T](function(idx){var J3s="playFields";var B3s="colum";var g3s='object';var b1v=E9n;b1v+=J3s;var K1v=x9c;K1v+=w0T;var R1v=l6T;R1v+=v03.l0n;R1v+=R0n;var a1v=G3n;a1v+=R0n;a1v+=v03.D0n;var f1v=E6n;f1v+=v03.H0n;f1v+=a0n;f1v+=r5n;var j1v=T3s;j1v+=v5n;j1v+=r5n;var r1v=L8c;r1v+=x5n;var y1v=d4T;y1v+=b6n;y1v+=v03.i0n;y1v+=i9T;var Z1v=B3s;Z1v+=k0n;var u1v=v03.l0n;u1v+=v03.i0n;u1v+=v03.D0n;u1v+=v03.i0n;var c1v=r9n;c1v+=k7n;c1v+=v6n;var E1v=r9n;E1v+=k7n;E1v+=v6n;var cell=dt[o3s](idx);var row=dt[E1v](idx[c1v]);var data=row[u1v]();var idSrc=idFn(data);var fields=forceFields||__dtFieldsFromIdx(dt,allFields,idx[Z1v]);var isNode=typeof identifier===g3s&&identifier[y1v]||identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var x1v=v03.i0n;x1v+=v03.D0n;x1v+=o5T;x1v+=r5n;prevAttach=out[idSrc][x1v];prevDisplayFields=out[idSrc][K6c];}__dtRowSelector(out,dt,idx[c4T],allFields,idFn);out[idSrc][r1v]=prevAttach||[];v03[k5n]();out[idSrc][j1v][f1v](isNode?$(identifier)[a1v](W1n):cell[R1v]());out[idSrc][K6c]=prevDisplayFields||{};$[K1v](out[idSrc][b1v],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var d3s="ndexes";var Y1v=R0n;Y1v+=t2c;var X1v=y0n;X1v+=d3s;var k1v=v03.H0n;k1v+=v03.G0n;v03[k1v]();dt[e3s](z1T,identifier)[X1v]()[Y1v](function(idx){var A1v=v03.i0n;A1v+=v03.G0n;v03[A1v]();__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var O3s="\\";var E3s="$";var Q1v=O3s;Q1v+=E3s;Q1v+=B0n;return typeof id===d9T?T6c+id[e9T](/(:|\.|\[|\]|,)/g,Q1v):T6c+id;};__dataSources[D5n]={id:function(data){var N1v=v03.i0n;N1v+=v03.G0n;var idFn=DataTable[V0n][p7s][H7s](this[a0n][G7s]);v03[N1v]();return idFn(data);},individual:function(identifier,fieldNames){var c3s="oAp";var V1v=v03.H0n;V1v+=v03.G0n;var I1v=b2n;I1v+=T8c;var n1v=v03.D0n;n1v+=i2s;n1v+=R0n;var L1v=c3s;L1v+=y0n;var idFn=DataTable[V0n][L1v][H7s](this[a0n][G7s]);var dt=__dtApi(this[a0n][n1v]);var fields=this[a0n][I1v];var out={};var forceFields;v03[V1v]();var responsiveNode;if(fieldNames){var w1v=V1c;w1v+=v03.i0n;w1v+=f6n;if(!$[w1v](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[h9T](fieldNames,function(i,name){v03[y5n]();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var u3s="_fnGetObj";var f3s="col";var r3s="lumn";var Z3s="ectDataFn";var a3s="mns";var x3s="columns";var t1v=r9n;t1v+=Z2n;t1v+=a0n;var m1v=b2n;m1v+=Q9n;m1v+=r4T;var v1v=y0n;v1v+=v03.l0n;v1v+=Z0n;v1v+=S5c;var C1v=u3s;C1v+=Z3s;var S1v=R0n;S1v+=y3s;var idFn=DataTable[S1v][p7s][C1v](this[a0n][v1v]);var dt=__dtApi(this[a0n][g1T]);var fields=this[a0n][m1v];var out={};if($[h8c](identifier)&&(identifier[t1v]!==undefined||identifier[x3s]!==undefined||identifier[e3s]!==undefined)){var z0v=s6n;z0v+=R0n;z0v+=x0n;z0v+=o3n;var H0v=p0T;H0v+=r3s;H0v+=a0n;var p0v=r9n;p0v+=Z2n;p0v+=a0n;if(identifier[p0v]!==undefined){__dtRowSelector(out,dt,identifier[j3s],fields,idFn);}if(identifier[H0v]!==undefined){var G0v=f3s;G0v+=v03.H0n;G0v+=a3s;__dtColumnSelector(out,dt,identifier[G0v],fields,idFn);}if(identifier[z0v]!==undefined){var P0v=s6n;P0v+=R0n;P0v+=x0n;P0v+=o3n;__dtCellSelector(out,dt,identifier[P0v],fields,idFn);}}else{__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var q0v=v03.i0n;q0v+=v03.G0n;v03[q0v]();var dt=__dtApi(this[a0n][g1T]);if(!__dtIsSsp(dt,this)){var s0v=v03.i0n;s0v+=v03.l0n;s0v+=v03.l0n;var l0v=r7n;l0v+=v6n;var row=dt[l0v][s0v](data);__dtHighlight(row[d4T]());}},edit:function(identifier,fields,data,store){var b3s="oA";var M0v=v03.D0n;M0v+=v03.i0n;M0v+=t0n;M0v+=k2n;var that=this;var dt=__dtApi(this[a0n][M0v]);if(!__dtIsSsp(dt,this)||this[a0n][C4T][R3s]===P0T){var B0v=l6T;B0v+=E3n;var U0v=v03.i0n;U0v+=k0n;U0v+=f6n;var D0v=v03.i0n;D0v+=k0n;D0v+=f6n;var h0v=X0n;h0v+=K3s;var rowId=__dataSources[h0v][H7n][K1T](this,data);var row;try{row=dt[c4T](__dtjqId(rowId));}catch(e){row=dt;}if(!row[D0v]()){var F0v=r9n;F0v+=k7n;F0v+=v6n;row=dt[F0v](function(rowIdx,rowData,rowNode){var i0v=i1s;i0v+=x0n;i0v+=x0n;v03[k5n]();return rowId==__dataSources[D5n][H7n][i0v](that,rowData);});}if(row[U0v]()){var T0v=Q2n;T0v+=x0n;T0v+=y0n;T0v+=N6c;var J0v=X0n;J0v+=v03.D0n;J0v+=v03.i0n;var o0v=b3s;o0v+=h8T;var W0v=v03.q0n;W0v+=k0n;var extender=$[W0v][P7s][o0v][q7s];var toSave=extender({},row[J0v](),C5n);toSave=extender(toSave,data,C5n);row[x8T](toSave);var idx=$[M9T](rowId,store[k3s]);store[k3s][T0v](idx,o1n);}else{row=dt[c4T][V1T](data);}__dtHighlight(row[B0v]());}},remove:function(identifier,fields,store){var X3s="cancel";var d0v=d1c;d0v+=Q5n;var g0v=X3s;g0v+=s0T;var that=this;var dt=__dtApi(this[a0n][g1T]);var cancelled=store[g0v];if(cancelled[d0v]===W1n){var e0v=c4T;e0v+=a0n;dt[e0v](identifier)[A9T]();}else{var x0v=r9n;x0v+=R0n;x0v+=x3n;x0v+=a7c;var O0v=s7s;O0v+=z0T;O0v+=f6n;var indexes=[];dt[j3s](identifier)[O0v](function(){var Y3s="nAr";var Z0v=y0n;Z0v+=Y3s;Z0v+=O0c;var u0v=v03.l0n;u0v+=I6n;u0v+=v03.i0n;var c0v=y0n;c0v+=v03.l0n;var E0v=X0n;E0v+=K3s;var id=__dataSources[E0v][c0v][K1T](that,this[u0v]());if($[Z0v](id,cancelled)===-o1n){var y0v=A3s;y0v+=r5n;indexes[y0v](this[Q3s]());}});dt[j3s](indexes)[x0v]();}},prep:function(action,identifier,submit,json,store){var N3s="cancelle";var L3s="cancelled";var K0v=r9n;K0v+=J9n;var r0v=R0n;r0v+=A2n;r0v+=v03.D0n;if(action===r0v){var a0v=v03.l0n;a0v+=Z8T;var f0v=c6n;f0v+=v03.i0n;f0v+=E6n;var j0v=N3s;j0v+=v03.l0n;var cancelled=json[j0v]||[];store[k3s]=$[f0v](submit[a0v],function(val,key){var R0v=v03.H0n;R0v+=v03.G0n;v03[R0v]();return!$[b6s](submit[x8T][key])&&$[M9T](key,cancelled)===-o1n?key:undefined;});}else if(action===K0v){store[L3s]=json[L3s]||[];}},commit:function(action,identifier,data,store){var I3s="ServerS";var C3s="etti";var V3s="ide";var w3s="oFeat";var n3s="wId";var v3s="any";var S3s="ures";var S0v=k0n;S0v+=T2s;var w0v=C9c;w0v+=B0s;var k0v=x0n;k0v+=R0n;k0v+=K6s;k0v+=r5n;var b0v=v03.D0n;b0v+=Y2n;var that=this;var dt=__dtApi(this[a0n][b0v]);if(!__dtIsSsp(dt,this)&&action===M7c&&store[k3s][k0v]){var N0v=x0n;N0v+=Q7n;N0v+=G3n;N0v+=Q5n;var X0v=r7n;X0v+=n3s;X0v+=a0n;var ids=store[X0v];var row;var compare=function(id){var Y0v=v03.i0n;Y0v+=v03.G0n;v03[Y0v]();return function(rowIdx,rowData,rowNode){var Q0v=s6n;Q0v+=v03.i0n;Q0v+=x0n;Q0v+=x0n;var A0v=X0n;A0v+=K3s;return id==__dataSources[A0v][H7n][Q0v](that,rowData);};};for(var i=W1n,ien=ids[N0v];i<ien;i++){var V0v=t0n;V0v+=I3s;V0v+=V3s;var I0v=w3s;I0v+=S3s;var n0v=a0n;n0v+=C3s;n0v+=G6n;n0v+=a0n;try{row=dt[c4T](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[v3s]()){var L0v=r9n;L0v+=k7n;L0v+=v6n;row=dt[L0v](compare(ids[i]));}if(row[v3s]()&&!dt[n0v]()[W1n][I0v][V0v]){row[A9T]();}}}var drawType=this[a0n][w0v][R3s];if(drawType!==S0v){var C0v=v03.l0n;C0v+=e2s;dt[C0v](drawType);}}};function __html_id(identifier){var G5s='Could not find an element with `data-editor-id` or `id` of: ';var H5s="tor-id=\"";var p5s="a-edi";var m3s="les";var H9v=v03.i0n;H9v+=v03.G0n;var v0v=i0c;v0v+=f6n;v0v+=m3s;v0v+=a0n;var context=document;if(identifier!==v0v){var t0v=E5n;t0v+=c5n;var m0v=t3s;m0v+=p5s;m0v+=H5s;context=$(m0v+identifier+t0v);if(context[w5n]===W1n){var p9v=J0s;p9v+=G3n;context=typeof identifier===p9v?$(__dtjqId(identifier)):$(identifier);}if(context[w5n]===W1n){throw G5s+identifier;}}v03[H9v]();return context;}function __html_el(identifier,name){var P5s="d=\"";var z5s="a-editor-fi";var z9v=t3s;z9v+=z5s;z9v+=Q9n;z9v+=P5s;var G9v=v03.H0n;G9v+=v03.G0n;v03[G9v]();var context=__html_id(identifier);return $(z9v+name+E1s,context);}function __html_els(identifier,names){v03[y5n]();var out=$();for(var i=W1n,ien=names[w5n];i<ien;i++){var P9v=E3c;P9v+=v03.l0n;out=out[P9v](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var q5s="a-editor-value";var l5s='[data-editor-value]';var s9v=m0T;s9v+=x0n;var l9v=c8T;l9v+=q5s;var q9v=n2c;q9v+=U6n;q9v+=r9n;var el=__html_el(identifier,dataSrc);return el[q9v](l5s)[w5n]?el[s5s](l9v):el[s9v]();}function __html_set(identifier,fields,data){var M9v=R0n;M9v+=v03.i0n;M9v+=s6n;M9v+=r5n;v03[y5n]();$[M9v](fields,function(name,field){var M5s="FromDat";var F5s="lter";var D5s="-value]";var h5s="[data-editor";var U5s='data-editor-value';var h9v=P8T;h9v+=M5s;h9v+=v03.i0n;var val=field[h9v](data);v03[k5n]();if(val!==undefined){var F9v=h5s;F9v+=D5s;var D9v=v03.q0n;D9v+=y0n;D9v+=F5s;var el=__html_el(identifier,field[i5s]());if(el[D9v](F9v)[w5n]){var i9v=T3s;i9v+=r9n;el[i9v](U5s,val);}else{el[h9T](function(){var J5s="Child";var o5s="Nodes";var W5s="child";var T5s="firstChild";var U9v=W5s;U9v+=o5s;while(this[U9v][w5n]){var W9v=Q4c;W9v+=A7n;W9v+=R0n;W9v+=J5s;this[W9v](this[T5s]);}})[p6T](val);}}});}__dataSources[o9v]={id:function(data){var T9v=H7n;T9v+=Z0n;T9v+=S5c;var J9v=R0n;J9v+=q3n;J9v+=v03.D0n;var idFn=DataTable[J9v][p7s][H7s](this[a0n][T9v]);return idFn(data);},initField:function(cfg){var B5s='[data-editor-label="';var g9v=E5n;g9v+=c5n;var B9v=X0n;B9v+=v03.D0n;B9v+=v03.i0n;var label=$(B5s+(cfg[B9v]||cfg[d8T])+g9v);if(!cfg[C0T]&&label[w5n]){cfg[C0T]=label[p6T]();}},individual:function(identifier,fieldNames){var g5s="nodeN";var u5s='[data-editor-id]';var d5s="andSel";var e5s="Back";var E5s='data-editor-field';var x5s='Cannot automatically determine field name from data source';var O5s="ddBac";var Z5s='editor-id';var r9v=R0n;r9v+=v03.i0n;r9v+=x5n;var x9v=v03.i0n;x9v+=v03.G0n;var y9v=b2n;y9v+=R0n;y9v+=B0c;var Z9v=k2n;Z9v+=k0n;Z9v+=b7s;Z9v+=r5n;var d9v=g5s;d9v+=v03.i0n;d9v+=i9T;var attachEl;if(identifier instanceof $||identifier[d9v]){var c9v=v03.l0n;c9v+=v03.i0n;c9v+=v03.D0n;c9v+=v03.i0n;var E9v=d5s;E9v+=v03.q0n;var O9v=E3c;O9v+=v03.l0n;O9v+=e5s;var e9v=v03.i0n;e9v+=O5s;e9v+=p0c;attachEl=identifier;if(!fieldNames){fieldNames=[$(identifier)[s5s](E5s)];}var back=$[h5n][e9v]?O9v:E9v;identifier=$(identifier)[c5s](u5s)[back]()[c9v](Z5s);}if(!identifier){var u9v=i0c;u9v+=d3T;u9v+=y5s;identifier=u9v;}if(fieldNames&&!$[r9T](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames||fieldNames[Z9v]===W1n){throw x5s;}var out=__dataSources[p6T][i6c][K1T](this,identifier);var fields=this[a0n][y9v];v03[x9v]();var forceFields={};$[r9v](fieldNames,function(i,name){forceFields[name]=fields[name];});$[h9T](out,function(id,set){var r5s="toArra";var j5s='cell';var f9v=r5s;f9v+=f6n;var j9v=v03.D0n;j9v+=f6n;j9v+=E6n;j9v+=R0n;set[j9v]=j5s;set[W4T]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[f9v]();set[i6c]=fields;set[K6c]=forceFields;});return out;},fields:function(identifier){var f5s="cal";var X9v=R0n;X9v+=v03.i0n;X9v+=s6n;X9v+=r5n;var b9v=v03.q0n;b9v+=f7n;b9v+=r4T;var a9v=k4c;a9v+=t4c;a9v+=O0c;var out={};var self=__dataSources[p6T];if($[a9v](identifier)){for(var i=W1n,ien=identifier[w5n];i<ien;i++){var K9v=f5s;K9v+=x0n;var R9v=b2n;R9v+=T8c;var res=self[R9v][K9v](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[a0n][b9v];if(!identifier){var k9v=i0c;k9v+=d3T;k9v+=y5s;identifier=k9v;}$[X9v](fields,function(name,field){var a5s="lToDat";var Y9v=E1T;Y9v+=a5s;Y9v+=v03.i0n;var val=__html_get(identifier,field[i5s]());field[Y9v](data,val===z1T?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:s3s};return out;},create:function(fields,data){var A9v=v03.H0n;A9v+=v03.G0n;v03[A9v]();if(data){var N9v=y0n;N9v+=v03.l0n;var Q9v=r5n;Q9v+=v03.D0n;Q9v+=c6n;Q9v+=x0n;var id=__dataSources[Q9v][N9v][K1T](this,data);try{var L9v=w7c;L9v+=G3n;L9v+=Q5n;if(__html_id(id)[L9v]){__html_set(id,fields,data);}}catch(e){}}},edit:function(identifier,fields,data){var R5s="eyless";var w9v=p0c;w9v+=R5s;var V9v=y0n;V9v+=v03.l0n;var I9v=r5n;I9v+=v03.D0n;I9v+=c6n;I9v+=x0n;var n9v=v03.H0n;n9v+=v03.G0n;v03[n9v]();var id=__dataSources[I9v][V9v][K1T](this,data)||w9v;__html_set(id,fields,data);},remove:function(identifier,fields){__html_id(identifier)[A9T]();}};}());Editor[S9v]={"wrapper":C9v,"processing":{"indicator":v9v,"active":m9v},"header":{"wrapper":K5s,"content":t9v},"body":{"wrapper":b5s,"content":k5s},"footer":{"wrapper":p6v,"content":X5s},"form":{"wrapper":H6v,"content":Y5s,"tag":v03.s0n,"info":G6v,"error":A5s,"buttons":z6v,"button":Q5s,"buttonInternal":Q5s},"field":{"wrapper":N5s,"typePrefix":L5s,"namePrefix":n5s,"label":P6v,"input":I5s,"inputControl":q6v,"error":V5s,"msg-label":l6v,"msg-error":w5s,"msg-message":S5s,"msg-info":s6v,"multiValue":C5s,"multiInfo":v5s,"multiRestore":M6v,"multiNoEdit":h6v,"disabled":D6v,"processing":F6v},"actions":{"create":m5s,"edit":i6v,"remove":U6v},"inline":{"wrapper":W6v,"liner":t5s,"buttons":o6v},"bubble":{"wrapper":p4s,"liner":J6v,"table":T6v,"close":B6v,"pointer":H4s,"bg":g6v}};(function(){var z4s="edSingl";var F4s="elect_s";var U8y="removeSingle";var D4s="editor_r";var G8y='buttons-remove';var i4s="tor";var o4s="B";var n4s="formButtons";var A4s="itle";var h4s="TableTools";var l4s="ditSingle";var W4s="editor_";var J4s="UTT";var P4s="Single";var p8y='rows';var M4s="buttons-creat";var w4s='buttons-edit';var i8y='selectedSingle';var s4s="cted";var g2v=a0n;g2v+=G4s;g2v+=z4s;g2v+=R0n;var B2v=V0n;B2v+=R0n;B2v+=w0T;var T2v=C9c;T2v+=P4s;var J2v=J2n;J2v+=t6T;var o2v=R0n;o2v+=q4s;o2v+=w0T;var W2v=R0n;W2v+=l4s;var I7v=s3n;I7v+=k2n;I7v+=s4s;var U7v=M4s;U7v+=R0n;var h7v=i6n;h7v+=L2c;var M7v=M2c;M7v+=h2c;var s7v=i6n;s7v+=v03.D0n;if(DataTable[h4s]){var L6v=x9c;L6v+=w0T;var N6v=D4s;N6v+=R0n;N6v+=H8s;var R6v=a0n;R6v+=F4s;R6v+=U2c;R6v+=k2n;var a6v=i6n;a6v+=L2c;var f6v=O4c;f6v+=i4s;f6v+=U4s;f6v+=v03.D0n;var O6v=v03.D0n;O6v+=V0n;var e6v=W4s;e6v+=N0c;var d6v=o4s;d6v+=J4s;d6v+=z8s;d6v+=T4c;var ttButtons=DataTable[h4s][d6v];var ttButtonBase={sButtonText:z1T,editor:z1T,formTitle:z1T};ttButtons[e6v]=$[g8T](C5n,ttButtons[O6v],ttButtonBase,{formButtons:[{label:z1T,fn:function(e){this[p8c]();}}],fnClick:function(button,config){var T4s="formB";var B4s="ttons";var g4s="be";var j6v=v03.D0n;j6v+=y0n;j6v+=e2n;var r6v=s6n;r6v+=r3c;r6v+=U6n;var Z6v=x0n;Z6v+=L4n;Z6v+=R0n;Z6v+=x0n;var u6v=T4s;u6v+=v03.H0n;u6v+=B4s;var c6v=v2n;c6v+=a2c;c6v+=R0n;var E6v=C9c;E6v+=l6n;var editor=config[E6v];var i18nCreate=editor[Z2c][c6v];var buttons=config[u6v];if(!buttons[W1n][Z6v]){var x6v=a0n;x6v+=v03.H0n;x6v+=t0n;x6v+=h0c;var y6v=x0n;y6v+=v03.i0n;y6v+=g4s;y6v+=x0n;buttons[W1n][y6v]=i18nCreate[x6v];}editor[r6v]({title:i18nCreate[j6v],buttons:buttons});}});ttButtons[f6v]=$[a6v](C5n,ttButtons[R6v],ttButtonBase,{formButtons:[{label:z1T,fn:function(e){this[p8c]();}}],fnClick:function(button,config){var O4s="ctedIndex";var d4s="formButt";var e4s="fnGetSel";var Y6v=d4s;Y6v+=k7n;Y6v+=k0n;Y6v+=a0n;var X6v=y0n;X6v+=B0n;X6v+=m1c;var k6v=w7c;k6v+=G3n;k6v+=v03.D0n;k6v+=r5n;var b6v=v03.i0n;b6v+=v03.G0n;var K6v=e4s;K6v+=R0n;K6v+=O4s;K6v+=r0n;var selected=this[K6v]();v03[b6v]();if(selected[k6v]!==o1n){return;}var editor=config[j0n];var i18nEdit=editor[X6v][C9c];var buttons=config[Y6v];if(!buttons[W1n][C0T]){var Q6v=Y6s;Q6v+=t6T;var A6v=v4n;A6v+=R0n;A6v+=x0n;buttons[W1n][A6v]=i18nEdit[Q6v];}editor[C9c](selected[W1n],{title:i18nEdit[u2c],buttons:buttons});}});ttButtons[N6v]=$[L6v](C5n,ttButtons[E4s],ttButtonBase,{question:z1T,formButtons:[{label:z1T,fn:function(e){var c4s="submi";var I6v=c4s;I6v+=v03.D0n;var n6v=v03.H0n;n6v+=v03.G0n;v03[n6v]();var that=this;this[I6v](function(json){var y4s="nce";var Z4s="tInsta";var u4s="fnGe";var x4s="fnSelectNone";var C6v=v03.D0n;C6v+=L4n;C6v+=k2n;var S6v=u4s;S6v+=Z4s;S6v+=y4s;var w6v=B4c;w6v+=J5c;var V6v=v03.q0n;V6v+=k0n;var tt=$[V6v][D5n][w6v][S6v]($(that[a0n][C6v])[O5n]()[g1T]()[d4T]());v03[k5n]();tt[x4s]();});}}],fnClick:function(button,config){var j4s="onfir";var f4s="nfirm";var K4s="electedIndexes";var a4s="mB";var r4s="labe";var R4s="fnGetS";var l7v=t7n;l7v+=e2n;var P7v=r4s;P7v+=x0n;var z7v=s6n;z7v+=j4s;z7v+=c6n;var G7v=w7c;G7v+=G3n;G7v+=v03.D0n;G7v+=r5n;var H7v=a0n;H7v+=v03.D0n;H7v+=N2T;H7v+=G6n;var p7v=p0T;p7v+=f4s;var t6v=E5c;t6v+=r9n;t6v+=a4s;t6v+=D9n;var m6v=r9n;m6v+=n1c;m6v+=S7s;m6v+=R0n;var v6v=R4s;v6v+=K4s;var rows=this[v6v]();if(rows[w5n]===W1n){return;}var editor=config[j0n];var i18nRemove=editor[Z2c][m6v];var buttons=config[t6v];var question=typeof i18nRemove[p7v]===H7v?i18nRemove[x2c]:i18nRemove[x2c][rows[G7v]]?i18nRemove[x2c][rows[w5n]]:i18nRemove[z7v][o6n];if(!buttons[W1n][P7v]){var q7v=v4n;q7v+=R0n;q7v+=x0n;buttons[W1n][q7v]=i18nRemove[p8c];}editor[A9T](rows,{message:question[e9T](/%d/g,rows[w5n]),title:i18nRemove[l7v],buttons:buttons});}});}var _buttons=DataTable[s7v][M7v];$[h7v](_buttons,{create:{text:function(dt,node,config){var k4s="edito";var X4s='buttons.create';var b4s="i18";var i7v=D2c;i7v+=k7n;i7v+=k0n;var F7v=b4s;F7v+=k0n;var D7v=k4s;D7v+=r9n;return dt[Z2c](X4s,config[D7v][F7v][N0c][i7v]);},className:U7v,editor:z1T,formButtons:{text:function(editor){var o7v=D3n;o7v+=t0n;o7v+=c6n;o7v+=t6T;var W7v=v03.i0n;W7v+=v03.G0n;v03[W7v]();return editor[Z2c][N0c][o7v];},action:function(e){var T7v=a0n;T7v+=v03.H0n;T7v+=F3n;var J7v=v03.H0n;J7v+=v03.G0n;v03[J7v]();this[T7v]();}},formMessage:z1T,formTitle:z1T,action:function(e,dt,node,config){var L4s="utt";var N4s="rmB";var Q4s="Mess";var Y4s="rmT";var Z7v=v03.D0n;Z7v+=t6T;Z7v+=k2n;var u7v=v2n;u7v+=S5T;u7v+=U6n;var c7v=v1c;c7v+=h6T;c7v+=k0n;var E7v=E5c;E7v+=Y4s;E7v+=A4s;var O7v=T6n;O7v+=Q4s;O7v+=D9c;var e7v=E5c;e7v+=N4s;e7v+=L4s;e7v+=I1c;var g7v=h7n;g7v+=z6c;g7v+=W7n;g7v+=k0n;var B7v=J2n;B7v+=E0n;var that=this;var editor=config[B7v];var buttons=config[n4s];this[p1T](C5n);editor[T2s](g7v,function(){var d7v=v03.i0n;d7v+=v03.G0n;v03[d7v]();that[p1T](V5n);})[N0c]({buttons:config[e7v],message:config[O7v],title:config[E7v]||editor[c7v][u7v][Z7v]});}},edit:{extend:I4s,text:function(dt,node,config){var V4s="ns.ed";var x7v=l0c;x7v+=V4s;x7v+=t6T;var y7v=y0n;y7v+=B0n;y7v+=m1c;v03[y5n]();return dt[y7v](x7v,config[j0n][Z2c][C9c][h1s]);},className:w4s,editor:z1T,formButtons:{text:function(editor){var r7v=R0n;r7v+=v03.l0n;r7v+=y0n;r7v+=v03.D0n;return editor[Z2c][r7v][p8c];},action:function(e){var f7v=a0n;f7v+=g2c;f7v+=h0c;var j7v=v03.i0n;j7v+=v03.G0n;v03[j7v]();this[f7v]();}},formMessage:z1T,formTitle:z1T,action:function(e,dt,node,config){var t4s="formTitle";var C4s="indexe";var m4s="indexes";var v4s="lum";var S4s="mMe";var n7v=v03.D0n;n7v+=t6T;n7v+=k2n;var L7v=R0n;L7v+=v03.l0n;L7v+=y0n;L7v+=v03.D0n;var N7v=y0n;N7v+=B0n;N7v+=h6T;N7v+=k0n;var Q7v=i3n;Q7v+=S4s;Q7v+=H2n;Q7v+=D9c;var Y7v=k7n;Y7v+=k0n;Y7v+=R0n;var X7v=s6n;X7v+=Q9n;X7v+=x0n;X7v+=a0n;var k7v=C4s;k7v+=a0n;var b7v=p0T;b7v+=v4s;b7v+=k0n;b7v+=a0n;var K7v=v03.i0n;K7v+=v03.G0n;var R7v=r9n;R7v+=k7n;R7v+=v6n;R7v+=a0n;var a7v=R0n;a7v+=A2n;a7v+=r2n;a7v+=r9n;var that=this;var editor=config[a7v];var rows=dt[R7v]({selected:C5n})[m4s]();v03[K7v]();var columns=dt[b7v]({selected:C5n})[k7v]();var cells=dt[X7v]({selected:C5n})[m4s]();var items=columns[w5n]||cells[w5n]?{rows:rows,columns:columns,cells:cells}:rows;this[p1T](C5n);editor[Y7v](s6s,function(){var A7v=v03.H0n;A7v+=v03.G0n;v03[A7v]();that[p1T](V5n);})[C9c](items,{message:config[Q7v],buttons:config[n4s],title:config[t4s]||editor[N7v][L7v][n7v]});}},remove:{extend:I7v,limitTo:[p8y],text:function(dt,node,config){var H8y="ttons.remove";var S7v=D2c;S7v+=Z6n;var w7v=Q8c;w7v+=H8y;var V7v=y0n;V7v+=X5c;return dt[V7v](w7v,config[j0n][Z2c][A9T][S7v]);},className:G8y,editor:z1T,formButtons:{text:function(editor){var C7v=v1c;C7v+=h6T;C7v+=k0n;v03[y5n]();return editor[C7v][A9T][p8c];},action:function(e){var v7v=a0n;v7v+=v03.H0n;v7v+=F3n;v03[y5n]();this[v7v]();}},formMessage:function(editor,dt){var z8y="nfir";var q8y="firm";var l8y="emo";var s2v=p0T;s2v+=z8y;s2v+=c6n;var l2v=x0n;l2v+=P8y;l2v+=r5n;var q2v=k2n;q2v+=k0n;q2v+=G3n;q2v+=Q5n;var P2v=s6n;P2v+=Z6n;P2v+=q8y;var z2v=c0c;z2v+=s4n;z2v+=G3n;var G2v=k0T;G2v+=q8y;var H2v=r9n;H2v+=l8y;H2v+=a7c;var p2v=y0n;p2v+=X5c;var t7v=v03.H0n;t7v+=v03.G0n;var m7v=Q3s;m7v+=R0n;m7v+=a0n;var rows=dt[j3s]({selected:C5n})[m7v]();v03[t7v]();var i18n=editor[p2v][H2v];var question=typeof i18n[G2v]===z2v?i18n[P2v]:i18n[x2c][rows[q2v]]?i18n[x2c][rows[l2v]]:i18n[s2v][o6n];return question[e9T](/%d/g,rows[w5n]);},formTitle:z1T,action:function(e,dt,node,config){var s8y="titl";var h8y="preOp";var F8y="formMessage";var M8y="mT";var U2v=s8y;U2v+=R0n;var i2v=E5c;i2v+=r9n;i2v+=M8y;i2v+=A4s;var F2v=f2T;F2v+=W3s;var h2v=h8y;h2v+=R0n;h2v+=k0n;var M2v=h7n;M2v+=k7n;M2v+=N6c;M2v+=s2s;var that=this;var editor=config[j0n];this[M2v](C5n);editor[T2s](h2v,function(){var D8y="oce";var D2v=E6n;D2v+=r9n;D2v+=D8y;D2v+=s2s;that[D2v](V5n);})[A9T](dt[j3s]({selected:C5n})[F2v](),{buttons:config[n4s],message:config[F8y],title:config[i2v]||editor[Z2c][A9T][U2v]});}}});_buttons[W2v]=$[o2v]({},_buttons[J2v]);_buttons[T2v][B2v]=i8y;_buttons[U8y]=$[g8T]({},_buttons[A9T]);_buttons[U8y][g8T]=g2v;}());Editor[d2v]={};Editor[W8y]=function(input,opts){var J1y=/[Hhm]|LT|LTS/;var c8y="hour";var z1y="previous";var V8y="rma";var a8y="an/>";var P1y='-iconRight">';var L8y="<but";var i1y='editor-dateime-';var T8y="orm";var v8y="Editor datetime: Without momentjs only the format 'YYYY-MM-DD' can be used";var y8y="-cal";var k8y="<sp";var B8y="atch";var w8y="classP";var r8y="/div>";var D1y='-date';var d8y="calend";var e8y="-titl";var l1y='-label">';var b8y="lect class=";var K8y="h\"/>";var f8y="\"/>";var Z8y="-time";var o1y=/[YMD]|L(?!T)|l/;var J8y="ime";var j8y="-y";var s1y='<select class="';var u8y="s\"/>";var h1y='-error"/>';var Q8y="</b";var x8y="endar\"/>";var G1y='-iconLeft">';var N8y="ton>";var A8y="v class=\"";var X8y="lass=\"";var M1y='-seconds"/>';var E8y="nutes\"/>";var H1y='-title">';var o8y="alend";var I8y="e\"";var O8y="-mi";var T1y=/[haA]/;var Z3v=s6n;Z3v+=o8y;Z3v+=v03.i0n;Z3v+=r9n;var u3v=v03.l0n;u3v+=k7n;u3v+=c6n;var c3v=v03.i0n;c3v+=r1T;c3v+=w0n;var E3v=v03.l0n;E3v+=D4n;var O3v=v03.i0n;O3v+=y7T;O3v+=w0T;var e3v=X0n;e3v+=v03.D0n;e3v+=R0n;var d3v=h9c;d3v+=k7n;d3v+=r9n;var g3v=v03.l0n;g3v+=k7n;g3v+=c6n;var B3v=v03.D0n;B3v+=J8y;var T3v=v03.l0n;T3v+=F4n;var J3v=x6T;J3v+=E6n;J3v+=w0n;var o3v=p0T;o3v+=u0T;var W3v=c6n;W3v+=v03.i0n;W3v+=v03.D0n;W3v+=x5n;var U3v=H6c;U3v+=v03.D0n;U3v+=x5n;var i3v=v03.q0n;i3v+=T8y;i3v+=I6n;var F3v=c6n;F3v+=B8y;var D3v=g8y;D3v+=g0T;var h3v=b2n;h3v+=k0n;h3v+=v03.l0n;var M3v=v03.q0n;M3v+=y0n;M3v+=w0T;var s3v=g8y;s3v+=d8y;s3v+=j0c;var l3v=v03.q0n;l3v+=y0n;l3v+=w0T;var q3v=e8y;q3v+=R0n;var P3v=v03.q0n;P3v+=f2T;var z3v=v03.l0n;z3v+=D4n;var G3v=i4n;G3v+=X6T;G3v+=v03.l0n;G3v+=Y6T;var H3v=O8y;H3v+=E8y;var p3v=E4n;p3v+=y1c;p3v+=G5n;p3v+=A8c;var t2v=g8y;t2v+=c8y;t2v+=u8y;var m2v=Z8y;m2v+=d4n;var v2v=y8y;v2v+=x8y;var C2v=X8c;C2v+=a0n;C2v+=a0n;C2v+=k4n;var S2v=i4n;S2v+=r8y;var w2v=j8y;w2v+=R0n;w2v+=j0c;w2v+=f8y;var V2v=i4n;V2v+=Q2n;V2v+=a8y;var I2v=E4n;I2v+=g5c;I2v+=V4n;var n2v=i4n;n2v+=r8y;var L2v=R8y;L2v+=H0T;L2v+=K8y;var N2v=i4n;N2v+=s3n;N2v+=b8y;N2v+=E5n;var Q2v=k8y;Q2v+=R4n;Q2v+=X6T;Q2v+=g4n;var A2v=n6T;A2v+=X8y;var Y2v=e4n;Y2v+=i0s;Y2v+=g4n;var X2v=i4n;X2v+=M2c;X2v+=v03.D0n;X2v+=Y8y;var k2v=i4n;k2v+=A2n;k2v+=A8y;var b2v=Q8y;b2v+=a0T;b2v+=N8y;var K2v=L8y;K2v+=v03.D0n;K2v+=k7n;K2v+=n8y;var R2v=g8y;R2v+=c8T;R2v+=I8y;R2v+=g4n;var a2v=A6T;a2v+=x5c;var f2v=E5n;f2v+=g4n;var j2v=A6T;j2v+=x5c;var u2v=E5c;u2v+=V8y;u2v+=v03.D0n;var c2v=x3n;c2v+=i9T;c2v+=H0T;var E2v=w8y;E2v+=S8y;var O2v=I9n;O2v+=v03.i0n;O2v+=U6n;O2v+=k3n;var e2v=R0n;e2v+=q9c;this[s6n]=$[e2v](C5n,{},Editor[O2v][O2s],opts);var classPrefix=this[s6n][E2v];var i18n=this[s6n][Z2c];if(!window[c2v]&&this[s6n][u2v]!==C8y){throw v8y;}var timeBlock=function(type){var m8y="block";var y2v=i4n;y2v+=T4n;y2v+=W4n;var Z2v=Z8y;Z2v+=m8y;Z2v+=d4n;v03[k5n]();return p1c+classPrefix+Z2v+y2v;};var gap=function(){var p1y="/span>";var t8y="<span>:<";var r2v=t8y;r2v+=p1y;var x2v=v03.H0n;x2v+=v03.G0n;v03[x2v]();return r2v;};var structure=$(j2v+classPrefix+f2v+a2v+classPrefix+R2v+p1c+classPrefix+H1y+p1c+classPrefix+G1y+K2v+i18n[z1y]+b2v+Q8T+k2v+classPrefix+P1y+X2v+i18n[B9s]+q1y+Y2v+A2v+classPrefix+l1y+Q2v+N2v+classPrefix+L2v+n2v+I2v+classPrefix+l1y+V2v+s1y+classPrefix+w2v+S2v+Q8T+C2v+classPrefix+v2v+Q8T+p1c+classPrefix+m2v+p1c+classPrefix+t2v+p3v+classPrefix+H3v+p1c+classPrefix+M1y+Q8T+p1c+classPrefix+h1y+G3v);this[z3v]={container:structure,date:structure[c9c](G7c+classPrefix+D1y),title:structure[P3v](G7c+classPrefix+q3v),calendar:structure[l3v](G7c+classPrefix+s3v),time:structure[M3v](G7c+classPrefix+F1y),error:structure[h3v](G7c+classPrefix+D3v),input:$(input)};this[a0n]={d:z1T,display:z1T,minutesRange:z1T,secondsRange:z1T,namespace:i1y+Editor[W8y][U1y]++,parts:{date:this[s6n][W1y][F3v](o1y)!==z1T,time:this[s6n][i3v][U3v](J1y)!==z1T,seconds:this[s6n][W1y][O8s](M5n)!==-o1n,hours12:this[s6n][W1y][W3v](T1y)!==z1T}};this[W1T][o3v][J3v](this[W1T][T3v])[q7T](this[W1T][B3v])[q7T](this[g3v][d3v]);this[W1T][e3v][O3v](this[E3v][u2c])[c3v](this[u3v][Z3v]);this[d5n]();};$[y3v](Editor[x3v][r3v],{destroy:function(){var d1y='.editor-datetime';var a3v=v03.l0n;a3v+=k7n;a3v+=c6n;var f3v=k7n;f3v+=v03.q0n;f3v+=v03.q0n;var j3v=o6n;j3v+=Z6T;j3v+=v03.l0n;j3v+=R0n;this[j3v]();this[W1T][S1T][f3v]()[B1y]();v03[k5n]();this[a3v][g1y][o1c](d1y);},errorMsg:function(msg){var K3v=v03.i0n;K3v+=v03.G0n;var R3v=v03.l0n;R3v+=k7n;R3v+=c6n;var error=this[R3v][g0T];v03[K3v]();if(msg){error[p6T](msg);}else{var b3v=e1y;b3v+=V7n;error[b3v]();}},hide:function(){this[O1y]();},max:function(date){var c1y="and";var E1y="setCal";var X3v=o6n;X3v+=E1y;X3v+=c1y;X3v+=z0T;var k3v=v03.H0n;k3v+=v03.G0n;this[s6n][u1y]=date;v03[k3v]();this[Z1y]();this[X3v]();},min:function(date){var r1y="minD";var A3v=y1y;A3v+=x1y;var Y3v=r1y;Y3v+=v03.i0n;Y3v+=U6n;v03[y5n]();this[s6n][Y3v]=date;this[Z1y]();this[A3v]();},owns:function(node){var j1y="contai";var f1y="ter";var n3v=x0n;n3v+=B2c;var L3v=j1y;L3v+=k0n;L3v+=z0T;var N3v=n2c;N3v+=f1y;var Q3v=h7T;Q3v+=F7c;Q3v+=k0n;Q3v+=Q0n;return $(node)[Q3v]()[N3v](this[W1T][L3v])[n3v]>W1n;},val:function(set,write){var K1y="Title";var X1y="ome";var b1y="St";var V1y=/(\d{4})\-(\d{2})\-(\d{2})/;var L1y="isValid";var Y1y="toDa";var z5v=a1y;z5v+=z0T;var G5v=R1y;G5v+=K1y;var H5v=A2n;H5v+=a0n;H5v+=E6n;H5v+=H2c;var p5v=r2n;p5v+=b1y;p5v+=N2T;p5v+=G6n;var t3v=A2n;t3v+=Q2n;t3v+=H2c;var I3v=c0c;I3v+=U2c;if(set===undefined){return this[a0n][v03.l0n];}v03[k5n]();if(set instanceof Date){this[a0n][v03.l0n]=this[k1y](set);}else if(set===z1T||set===s5n){this[a0n][v03.l0n]=z1T;}else if(typeof set===I3v){var V3v=c6n;V3v+=X1y;V3v+=k0n;V3v+=v03.D0n;if(window[V3v]){var C3v=Y1y;C3v+=v03.D0n;C3v+=R0n;var S3v=v03.q0n;S3v+=k7n;S3v+=E8c;S3v+=I6n;var w3v=v03.H0n;w3v+=v03.D0n;w3v+=s6n;var m=window[A1y][w3v](set,this[s6n][S3v],this[s6n][Q1y],this[s6n][N1y]);this[a0n][v03.l0n]=m[L1y]()?m[C3v]():z1T;}else{var v3v=n1y;v3v+=I1y;var match=set[P0s](V1y);this[a0n][v03.l0n]=match?new Date(Date[v3v](match[o1n],match[J1n]-o1n,match[T1n])):z1T;}}if(write||write===undefined){if(this[a0n][v03.l0n]){this[w1y]();}else{var m3v=v9T;m3v+=c6n;this[m3v][g1y][P8T](set);}}if(!this[a0n][v03.l0n]){this[a0n][v03.l0n]=this[k1y](new Date());}this[a0n][t3v]=new Date(this[a0n][v03.l0n][p5v]());this[a0n][H5v][S1y](o1n);this[G5v]();this[z5v]();this[C1y]();},_constructor:function(){var g0y='select';var R0y="_wri";var D0y='autocomplete';var Z0y="hasCl";var m1y="contain";var f0y="setUTCFullYear";var i0y="ho";var q0y="time";var l0y="seconds";var s0y="q";var z0y="parts";var F0y='focus.editor-datetime click.editor-datetime';var M0y='-seconds';var T0y='keyup.editor-datetime';var W4v=k7n;W4v+=k0n;var k5v=s6n;k5v+=r5n;k5v+=v1y;var b5v=m1y;b5v+=z0T;var r5v=k7n;r5v+=k0n;var T5v=k7n;T5v+=k0n;var J5v=k7n;J5v+=v03.q0n;J5v+=v03.q0n;var o5v=v03.i0n;o5v+=v03.D0n;o5v+=v03.D0n;o5v+=r9n;var W5v=a4c;W5v+=w8c;W5v+=t1y;W5v+=e2n;var D5v=v03.D0n;D5v+=y0n;D5v+=c6n;D5v+=R0n;var h5v=v03.l0n;h5v+=v03.i0n;h5v+=v03.D0n;h5v+=R0n;var P5v=M3n;P5v+=Q2T;P5v+=p0y;var that=this;var classPrefix=this[s6n][P5v];var onChange=function(){var G0y="nCh";var M5v=x0T;M5v+=a0T;var s5v=A7n;s5v+=m2c;var l5v=y0n;l5v+=k0n;l5v+=H0y;var q5v=k7n;q5v+=G0y;q5v+=v1y;v03[y5n]();that[s6n][q5v][K1T](that,that[W1T][l5v][s5v](),that[a0n][v03.l0n],that[W1T][M5v]);};if(!this[a0n][z0y][h5v]){this[W1T][P0y][M1T](h1T,P0T);}if(!this[a0n][z0y][D5v]){var F5v=g3T;F5v+=f6n;this[W1T][q0y][M1T](F5v,P0T);}if(!this[a0n][z0y][l0y]){var U5v=R0n;U5v+=s0y;var i5v=s6n;i5v+=y8c;i5v+=u8c;i5v+=Q7n;this[W1T][q0y][i5v](P7c+classPrefix+M0y)[A9T]();this[W1T][q0y][P7T](h0y)[U5v](o1n)[A9T]();}this[W5v]();this[W1T][g1y][o5v](D0y,J5v)[T5v](F0y,function(){var o0y=":v";var U0y="disa";var J0y="sib";var x5v=o6n;x5v+=a0n;x5v+=i0y;x5v+=v6n;var y5v=A7n;y5v+=v03.i0n;y5v+=x0n;var Z5v=s4n;Z5v+=H0y;var u5v=A7n;u5v+=m2c;var c5v=f7s;c5v+=U0y;c5v+=W0y;var E5v=y0n;E5v+=a0n;var O5v=y0n;O5v+=A4n;O5v+=v03.H0n;O5v+=v03.D0n;var e5v=v9T;e5v+=c6n;var d5v=o0y;d5v+=y0n;d5v+=J0y;d5v+=k2n;var g5v=y0n;g5v+=a0n;var B5v=m1y;B5v+=z0T;if(that[W1T][B5v][g5v](d5v)||that[e5v][O5v][E5v](c5v)){return;}v03[k5n]();that[u5v](that[W1T][Z5v][y5v](),V5n);that[x5v]();})[r5v](T0y,function(){var B0y="visible";var f5v=f7s;f5v+=B0y;var j5v=K5T;j5v+=X0T;if(that[W1T][j5v][k4c](f5v)){var K5v=A7n;K5v+=v03.i0n;K5v+=x0n;var R5v=v03.l0n;R5v+=D4n;var a5v=A7n;a5v+=v03.i0n;a5v+=x0n;that[a5v](that[R5v][g1y][K5v](),V5n);}});this[W1T][b5v][Z6n](k5v,g0y,function(){var K0y="teOutput";var Y0y="-a";var c0y="asClass";var b0y="rs12";var e0y="inutes";var a0y='-hours';var E0y="pm";var x0y="corre";var O0y="-am";var I0y="CMi";var y0y="tTitle";var j0y="_setTi";var r0y="ctMonth";var d0y="posi";var n0y="setUT";var k0y="UTCHo";var L0y="tput";var V0y="tSecond";var N0y="_writeOu";var U4v=o6n;U4v+=d0y;U4v+=x1T;var i4v=v03.q0n;i4v+=W9s;var F4v=v03.l0n;F4v+=k7n;F4v+=c6n;var l4v=g8y;l4v+=c6n;l4v+=e0y;var q4v=k5T;q4v+=m2s;var S5v=O0y;S5v+=E0y;var w5v=r5n;w5v+=c0y;var n5v=g8y;n5v+=u0y;var A5v=R8y;A5v+=k0n;A5v+=v03.D0n;A5v+=r5n;var Y5v=Z0y;Y5v+=v03.i0n;Y5v+=a0n;Y5v+=a0n;var X5v=A7n;X5v+=v03.i0n;X5v+=x0n;var select=$(this);var val=select[X5v]();v03[k5n]();if(select[Y5v](classPrefix+A5v)){var L5v=a1y;L5v+=z0T;var N5v=o6n;N5v+=s3n;N5v+=y0y;var Q5v=o6n;Q5v+=x0y;Q5v+=r0y;that[Q5v](that[a0n][I0T],val);that[N5v]();that[L5v]();}else if(select[Z0T](classPrefix+n5v)){var V5v=y1y;V5v+=x1y;var I5v=j0y;I5v+=e2n;that[a0n][I0T][f0y](val);that[I5v]();that[V5v]();}else if(select[w5v](classPrefix+a0y)||select[Z0T](classPrefix+S5v)){var P4v=R0y;P4v+=K0y;var z4v=R1y;z4v+=t1y;z4v+=c6n;z4v+=R0n;var C5v=i0y;C5v+=v03.H0n;C5v+=b0y;if(that[a0n][z0y][C5v]){var G4v=k9T;G4v+=k0y;G4v+=v03.H0n;G4v+=X0y;var H4v=A7n;H4v+=m2c;var p4v=Y0y;p4v+=c6n;p4v+=E6n;p4v+=c6n;var t5v=m1y;t5v+=z0T;var m5v=E1T;m5v+=x0n;var v5v=v03.q0n;v5v+=f2T;var hours=$(that[W1T][S1T])[v5v](G7c+classPrefix+a0y)[m5v]()*o1n;var pm=$(that[W1T][t5v])[c9c](G7c+classPrefix+p4v)[H4v]()===A0y;that[a0n][v03.l0n][G4v](hours===c1n&&!pm?W1n:pm&&hours!==c1n?hours+c1n:hours);}else{that[a0n][v03.l0n][Q0y](val);}that[z4v]();that[P4v](C5n);onChange();}else if(select[q4v](classPrefix+l4v)){var M4v=N0y;M4v+=L0y;var s4v=n0y;s4v+=I0y;s4v+=O6n;s4v+=r0n;that[a0n][v03.l0n][s4v](val);that[C1y]();that[M4v](C5n);onChange();}else if(select[Z0T](classPrefix+M0y)){var D4v=R1y;D4v+=t1y;D4v+=i9T;var h4v=a0n;h4v+=R0n;h4v+=V0y;h4v+=a0n;that[a0n][v03.l0n][h4v](val);that[D4v]();that[w1y](C5n);onChange();}that[F4v][g1y][i4v]();that[U4v]();})[W4v](o1T,function(e){var E9y='minutes';var O9y='unit';var D9y="focu";var j9y="has";var J9y="Output";var d9y="econds";var S0y="ropag";var h9y="_setCalander";var H9y="asC";var u9y='range';var S9y='day';var m0y="nodeName";var k9y="etU";var t0y="-i";var B9y="setSe";var Q9y='setUTCMinutes';var q9y="cu";var R9y="seco";var g9y="inu";var M9y="_setTitle";var Y9y='hours';var N9y="_write";var v0y="targ";var r9y="minutesRange";var w0y="stopP";var W9y="_correct";var X9y="TCHour";var C0y="tN";var z9y="hasClas";var G9y="sabled";var x9y="Range";var A9y='setUTCHours';var n9y="CMonth";var p9y="onRig";var F9y="etTitl";var f9y="secon";var T9y="etTi";var L9y="etUT";var o9y="Mont";var B4v=w0y;B4v+=S0y;B4v+=Y7T;var T4v=E6n;T4v+=S0s;T4v+=C0y;T4v+=p4c;var J4v=v0y;J4v+=x2n;var o4v=v03.D0n;o4v+=v03.i0n;o4v+=X5T;o4v+=x2n;var d=that[a0n][v03.l0n];var nodeName=e[o4v][m0y][l0s]();var target=nodeName===h0y?e[J4v][T4v]:e[G2T];nodeName=target[m0y][l0s]();if(nodeName===g0y){return;}e[B4v]();if(nodeName===J9s){var K4v=x0n;K4v+=P8y;K4v+=r5n;var u4v=t0y;u4v+=s6n;u4v+=p9y;u4v+=I5T;var c4v=Z0y;c4v+=M6n;c4v+=a0n;var O4v=r9n;O4v+=v03.i0n;O4v+=k0n;O4v+=x6s;var e4v=r5n;e4v+=H9y;e4v+=w8s;e4v+=a0n;var d4v=A2n;d4v+=G9y;var g4v=z9y;g4v+=a0n;var button=$(target);var parent=button[G6T]();if(parent[g4v](d4v)&&!parent[e4v](O4v)){button[t4T]();return;}if(parent[Z0T](classPrefix+P9y)){var E4v=v03.q0n;E4v+=k7n;E4v+=q9y;E4v+=a0n;that[a0n][I0T][l9y](that[a0n][I0T][s9y]()-o1n);that[M9y]();that[h9y]();that[W1T][g1y][E4v]();}else if(parent[c4v](classPrefix+u4v)){var R4v=D9y;R4v+=a0n;var a4v=s4n;a4v+=E6n;a4v+=v03.H0n;a4v+=v03.D0n;var f4v=v9T;f4v+=c6n;var j4v=y1y;j4v+=x1y;var r4v=p7T;r4v+=F9y;r4v+=R0n;var x4v=i9y;x4v+=I1y;x4v+=e6n;x4v+=U9y;var y4v=i5T;y4v+=R6n;var Z4v=W9y;Z4v+=o9y;Z4v+=r5n;that[Z4v](that[a0n][I0T],that[a0n][y4v][x4v]()+o1n);that[r4v]();that[j4v]();that[f4v][a4v][R4v]();}else if(button[c5s](G7c+classPrefix+F1y)[K4v]){var m4v=R0y;m4v+=U6n;m4v+=J9y;var v4v=p7T;v4v+=T9y;v4v+=i9T;var C4v=B9y;C4v+=k0T;C4v+=r4T;var S4v=c6n;S4v+=g9y;S4v+=v03.D0n;S4v+=r0n;var Y4v=a0n;Y4v+=d9y;var b4v=X0n;b4v+=v03.D0n;b4v+=v03.i0n;var val=button[x8T](e9y);var unit=button[b4v](O9y);if(unit===E9y){if(parent[Z0T](c9y)&&parent[Z0T](u9y)){var X4v=R1y;X4v+=k3n;var k4v=Z9y;k4v+=y9y;k4v+=x9y;that[a0n][k4v]=val;that[X4v]();return;}else{that[a0n][r9y]=z1T;}}if(unit===Y4v){var N4v=Z0y;N4v+=Q2T;var Q4v=l0T;Q4v+=s0T;var A4v=j9y;A4v+=I1y;A4v+=w8s;A4v+=a0n;if(parent[A4v](Q4v)&&parent[N4v](u9y)){var n4v=p7T;n4v+=x2n;n4v+=k3n;var L4v=f9y;L4v+=v03.l0n;L4v+=a9y;that[a0n][L4v]=val;that[n4v]();return;}else{var I4v=R9y;I4v+=w0T;I4v+=a9y;that[a0n][I4v]=z1T;}}if(val===n2s){if(d[K9y]()>=c1n){val=d[K9y]()-c1n;}else{return;}}else if(val===A0y){var V4v=G3n;V4v+=x2n;V4v+=n1y;V4v+=b9y;if(d[V4v]()<c1n){var w4v=G3n;w4v+=k9y;w4v+=X9y;w4v+=a0n;val=d[w4v]()+c1n;}else{return;}}var set=unit===Y9y?A9y:unit===S4v?Q9y:C4v;d[set](val);that[v4v]();that[m4v](C5n);onChange();}else{var z8k=N9y;z8k+=J9y;var G8k=X0n;G8k+=v03.D0n;G8k+=v03.i0n;var H8k=a0n;H8k+=L9y;H8k+=n9y;var p8k=c8T;p8k+=v03.i0n;var t4v=a0n;t4v+=x2n;t4v+=I9y;if(!d){d=that[k1y](new Date());}d[t4v](o1n);d[f0y](button[p8k](V9y));d[H8k](button[G8k](w9y));d[S1y](button[x8T](S9y));that[z8k](C5n);if(!that[a0n][z0y][q0y]){setTimeout(function(){var P8k=o6n;P8k+=r5n;P8k+=H7n;P8k+=R0n;v03[y5n]();that[P8k]();},O1n);}else{that[h9y]();}onChange();}}else{var l8k=y0n;l8k+=k0n;l8k+=L4T;l8k+=v03.D0n;var q8k=v03.l0n;q8k+=k7n;q8k+=c6n;that[q8k][l8k][c1T]();}});},_compareDates:function(a,b){var m9y="Stri";var v9y="tc";var t9y="_dateToUtcString";var C9y="_dateToU";var s8k=C9y;s8k+=v9y;s8k+=m9y;s8k+=G6n;return this[s8k](a)===this[t9y](b);},_correctMonth:function(date,month){var z6y="nth";var H6y="_daysI";var G6y="nMo";var p6y="UTCMon";var q6y="getUTCDate";var l6y="etUTCDate";var D8k=s3n;D8k+=v03.D0n;D8k+=p6y;D8k+=Q5n;var h8k=H6y;h8k+=G6y;h8k+=z6y;var M8k=v03.i0n;M8k+=v03.G0n;v03[M8k]();var days=this[h8k](date[P6y](),month);var correctDays=date[q6y]()>days;date[D8k](month);if(correctDays){var F8k=a0n;F8k+=l6y;date[F8k](days);date[l9y](month);}},_daysInMonth:function(year,month){var R1n=28;var k1n=31;var K1n=29;var b1n=30;var isLeap=year%B1n===W1n&&(year%n1n!==W1n||year%V1n===W1n);var months=[k1n,isLeap?K1n:R1n,k1n,b1n,k1n,b1n,k1n,k1n,b1n,k1n,b1n,k1n];return months[month];},_dateToUtc:function(s){var U6y="getHours";var M6y="econ";var W6y="getMinutes";var s6y="getS";var i6y="getDate";var h6y="getM";var W8k=s6y;W8k+=M6y;W8k+=r4T;var U8k=h6y;U8k+=v5T;U8k+=r5n;var i8k=v03.H0n;i8k+=v03.G0n;v03[i8k]();return new Date(Date[D6y](s[F6y](),s[U8k](),s[i6y](),s[U6y](),s[W6y](),s[W8k]()));},_dateToUtcString:function(d){var J6y="Fu";var o6y="tUTCDate";var T6y="llYear";var T8k=x6s;T8k+=o6y;var J8k=B7n;J8k+=v03.i0n;J8k+=v03.l0n;var o8k=i9y;o8k+=I1y;o8k+=J6y;o8k+=T6y;v03[y5n]();return d[o8k]()+C7c+this[B6y](d[s9y]()+o1n)+C7c+this[J8k](d[T8k]());},_hide:function(){var c6y="ames";var O6y="key";var E6y="down.";var e6y="roll.";var Z8k=M3n;Z8k+=g6y;var u8k=k7n;u8k+=v03.q0n;u8k+=v03.q0n;var c8k=t0n;c8k+=k7n;c8k+=v03.l0n;c8k+=f6n;var E8k=d6y;E8k+=e6y;var O8k=k7n;O8k+=v03.q0n;O8k+=v03.q0n;var e8k=O6y;e8k+=E6y;var d8k=k7n;d8k+=v03.q0n;d8k+=v03.q0n;var g8k=B0T;g8k+=s9n;var B8k=k0n;B8k+=c6y;B8k+=h7T;B8k+=N6c;var namespace=this[a0n][B8k];this[W1T][g8k][v0T]();$(window)[d8k](G7c+namespace);$(document)[o1c](e8k+namespace);$(O2T)[O8k](E8k+namespace);$(c8k)[u8k](Z8k+namespace);},_hours24To12:function(val){return val===W1n?c1n:val>c1n?val-c1n:val;},_htmlDay:function(day){var Z6y="</bu";var f6y="\" cla";var r6y="-day\" type=\"button\"";var Q6y='<td data-day="';var b6y="mpt";var n6y='data-year="';var V6y='" data-day="';var X6y="today";var u6y="/td>";var K6y="lecta";var y6y="tton";var k6y='<td class="empty"></td>';var w6y="day";var I6y='" data-month="';var x6y="<s";var L6y='-button ';var V8k=i4n;V8k+=u6y;var I8k=Z6y;I8k+=y6y;I8k+=g4n;var n8k=x6y;n8k+=E6n;n8k+=v03.i0n;n8k+=n8y;var L8k=E5n;L8k+=g4n;var N8k=c6n;N8k+=Z6n;N8k+=v03.D0n;N8k+=r5n;var Q8k=r6y;Q8k+=G5n;var A8k=P3n;A8k+=j6y;var Y8k=f6y;Y8k+=a0n;Y8k+=f4n;var X8k=v03.l0n;X8k+=v03.i0n;X8k+=f6n;var K8k=a0n;K8k+=Q9n;K8k+=v03.h0n;K8k+=a6y;var f8k=v03.l0n;f8k+=k4c;f8k+=L4n;f8k+=s0T;var j8k=R6y;j8k+=p8T;j8k+=S8y;var r8k=s3n;r8k+=K6y;r8k+=t0n;r8k+=k2n;var x8k=v03.i0n;x8k+=v03.G0n;var y8k=R0n;y8k+=b6y;y8k+=f6n;if(day[y8k]){return k6y;}v03[x8k]();var classes=[r8k];var classPrefix=this[s6n][j8k];if(day[f8k]){classes[A5n](c9y);}if(day[X6y]){var R8k=k0n;R8k+=k7n;R8k+=v6n;var a8k=E6n;a8k+=Y6y;classes[a8k](R8k);}if(day[K8k]){var k8k=A6y;k8k+=v03.h0n;k8k+=U6n;k8k+=v03.l0n;var b8k=E6n;b8k+=Y6y;classes[b8k](k8k);}return Q6y+day[X8k]+Y8k+classes[A8k](R8T)+b8T+N6y+classPrefix+L6y+classPrefix+Q8k+n6y+day[u0y]+I6y+day[N8k]+V6y+day[w6y]+L8k+n8k+day[w6y]+S6y+I8k+V8k;},_htmlMonth:function(year,month){var F7y="cond";var W7y="TCDay";var z7y="_daysInMonth";var h7y="onds";var d7y="_compareDa";var s7y="stDa";var e7y="showWeekNu";var l7y="fir";var G7y="maxDa";var m6y="_h";var M7y="etSe";var a7y='</thead>';var D7y="setUTCMinutes";var c7y="_htmlWeekOfYear";var f7y='<thead>';var p7y="hHe";var H7y="-t";var g7y="pareDates";var t6y="tmlMont";var T7y="ys";var i7y="tUTCMinu";var r1n=23;var O7y="unsh";var K7y='</tbody>';var B7y="_com";var v6y="able>";var j7y='<table class="';var E7y="ift";var C6y="</t";var P7y="getUTCDay";var J7y="disableDa";var x7y=' weekNumber';var r7y="iconRight";var j1k=C6y;j1k+=v6y;var r1k=P3n;r1k+=j6y;var x1k=m6y;x1k+=t6y;x1k+=p7y;x1k+=E3c;var y1k=E5n;y1k+=g4n;var W1k=H7y;W1k+=L4n;W1k+=x0n;W1k+=R0n;var v8k=G7y;v8k+=U6n;var C8k=C9T;C8k+=k0n;C8k+=n0n;C8k+=U6n;var w8k=n1y;w8k+=I1y;var now=this[k1y](new Date()),days=this[z7y](year,month),before=new Date(Date[w8k](year,month,o1n))[P7y](),data=[],row=[];if(this[s6n][q7y]>W1n){var S8k=l7y;S8k+=s7y;S8k+=f6n;before-=this[s6n][S8k];if(before<W1n){before+=d1n;}}var cells=days+before,after=cells;while(after>d1n){after-=d1n;}cells+=d1n-after;var minDate=this[s6n][C8k];var maxDate=this[s6n][v8k];if(minDate){var m8k=a0n;m8k+=M7y;m8k+=s6n;m8k+=h7y;minDate[Q0y](W1n);minDate[D7y](W1n);minDate[m8k](W1n);}if(maxDate){var H1k=a0n;H1k+=M7y;H1k+=F7y;H1k+=a0n;var p1k=a0n;p1k+=R0n;p1k+=i7y;p1k+=y9y;var t8k=k9T;t8k+=L0T;t8k+=u6n;t8k+=b9y;maxDate[t8k](r1n);maxDate[p1k](N1n);maxDate[H1k](N1n);}for(var i=W1n,r=W1n;i<cells;i++){var M1k=o6n;M1k+=p6T;M1k+=I9n;M1k+=R6n;var s1k=U7y;s1k+=W7y;var l1k=e0c;l1k+=r9n;l1k+=s2T;l1k+=f6n;var q1k=o7y;q1k+=r9n;q1k+=O0c;var P1k=J7y;P1k+=T7y;var z1k=B7y;z1k+=g7y;var G1k=d7y;G1k+=y9y;var day=new Date(Date[D6y](year,month,o1n+(i-before))),selected=this[a0n][v03.l0n]?this[G1k](day,this[a0n][v03.l0n]):V5n,today=this[z1k](day,now),empty=i<before||i>=days+before,disabled=minDate&&day<minDate||maxDate&&day>maxDate;var disableDays=this[s6n][P1k];if($[q1k](disableDays)&&$[l1k](day[s1k](),disableDays)!==-o1n){disabled=C5n;}else if(typeof disableDays===v03.o0n&&disableDays(day)===C5n){disabled=C5n;}var dayConfig={day:o1n+(i-before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[A5n](this[M1k](dayConfig));if(++r===d1n){var U1k=P3n;U1k+=j6y;var i1k=i4n;i1k+=v03.D0n;i1k+=r9n;i1k+=g4n;var F1k=E6n;F1k+=v03.H0n;F1k+=a0n;F1k+=r5n;var h1k=e7y;h1k+=c6n;h1k+=t0n;h1k+=z0T;if(this[s6n][h1k]){var D1k=O7y;D1k+=E7y;row[D1k](this[c7y](i-before,month,year));}data[F1k](i1k+row[U1k](s5n)+u7y);row=[];r=W1n;}}var classPrefix=this[s6n][Z7y];var className=classPrefix+W1k;if(this[s6n][y7y]){className+=x7y;}if(minDate){var g1k=t0n;g1k+=P5T;var B1k=A2n;B1k+=v6T;B1k+=R6n;var T1k=s6n;T1k+=H2n;var J1k=v03.q0n;J1k+=y0n;J1k+=w0T;var o1k=v9T;o1k+=c6n;var underMin=minDate>=new Date(Date[D6y](year,month,o1n,W1n,W1n,W1n));this[o1k][u2c][J1k](P7c+classPrefix+P9y)[T1k](B1k,underMin?P0T:g1k);}if(maxDate){var Z1k=T5T;Z1k+=s6n;Z1k+=p0c;var u1k=k0n;u1k+=k7n;u1k+=a6n;var c1k=g8y;c1k+=r7y;var E1k=v03.l0n;E1k+=y0n;E1k+=A7n;E1k+=g0n;var O1k=b2n;O1k+=w0T;var e1k=v03.D0n;e1k+=y0n;e1k+=e2n;var d1k=v03.l0n;d1k+=D4n;var overMax=maxDate<new Date(Date[D6y](year,month+o1n,o1n,W1n,W1n,W1n));this[d1k][e1k][O1k](E1k+classPrefix+c1k)[M1T](h1T,overMax?u1k:Z1k);}return j7y+className+y1k+f7y+this[x1k]()+a7y+R7y+data[r1k](s5n)+K7y+j1k;},_htmlMonthHead:function(){var Y7y='<th>';var X7y="th>";var k7y="<th></";var a=[];var firstDay=this[s6n][q7y];var i18n=this[s6n][Z2c];var dayName=function(day){var b7y="weekd";var f1k=b7y;f1k+=R6n;f1k+=a0n;day+=firstDay;while(day>=d1n){day-=d1n;}return i18n[f1k][day];};if(this[s6n][y7y]){var R1k=k7y;R1k+=X7y;var a1k=E6n;a1k+=Y6y;a[a1k](R1k);}for(var i=W1n;i<d1n;i++){var K1k=e4n;K1k+=v03.D0n;K1k+=r5n;K1k+=g4n;a[A5n](Y7y+dayName(i)+K1k);}return a[S7c](s5n);},_htmlWeekOfYear:function(d,m,y){var L7y="k\"";var w7y="etDate";var S7y="setDate";var N7y="ee";var t1n=86400000;var A7y="td>";var V7y="etDa";var Q7y="-w";var I7y="td class";var n7y="refi";var N1k=e4n;N1k+=A7y;var Q1k=Q7y;Q1k+=N7y;Q1k+=L7y;Q1k+=g4n;var A1k=R6y;A1k+=p8T;A1k+=n7y;A1k+=q3n;var Y1k=i4n;Y1k+=I7y;Y1k+=k4n;var X1k=s6n;X1k+=R0n;X1k+=y0n;X1k+=x0n;var k1k=G3n;k1k+=V7y;k1k+=f6n;var b1k=G3n;b1k+=w7y;var date=new Date(y,m,d,W1n,W1n,W1n,W1n);date[S7y](date[b1k]()+B1n-(date[k1k]()||d1n));var oneJan=new Date(y,W1n,o1n);var weekNum=Math[X1k](((date-oneJan)/t1n+o1n)/d1n);v03[k5n]();return Y1k+this[s6n][A1k]+Q1k+weekNum+N1k;},_options:function(selector,values,labels){var v7y='select.';var t7y="<opt";var m7y="opti";var p2y="ion va";var C7y="sPrefix";var I1k=x0n;I1k+=w0s;I1k+=Q5n;var n1k=s6n;n1k+=w8s;n1k+=C7y;var L1k=v03.q0n;L1k+=s4n;L1k+=v03.l0n;v03[y5n]();if(!labels){labels=values;}var select=this[W1T][S1T][L1k](v7y+this[s6n][n1k]+C7c+selector);select[B1y]();for(var i=W1n,ien=values[I1k];i<ien;i++){var C1k=i4n;C1k+=X6T;C1k+=m7y;C1k+=Y8y;var S1k=E5n;S1k+=g4n;var w1k=t7y;w1k+=p2y;w1k+=H2y;var V1k=c2T;V1k+=w0n;select[V1k](w1k+values[i]+S1k+labels[i]+C1k);}},_optionSet:function(selector,val){var q2y="unknown";var P2y='option:selected';var G2y="Pref";var z2y="ix";var G0k=y0n;G0k+=o8T;G0k+=k0n;var H0k=v03.D0n;H0k+=i6n;H0k+=v03.D0n;var p0k=r5n;p0k+=v03.D0n;p0k+=c6n;p0k+=x0n;var t1k=R6y;t1k+=G2y;t1k+=z2y;var m1k=a0n;m1k+=G4s;m1k+=g0n;var v1k=b2n;v1k+=k0n;v1k+=v03.l0n;var select=this[W1T][S1T][v1k](m1k+this[s6n][t1k]+C7c+selector);var span=select[G6T]()[P7T](h0y);select[P8T](val);var selected=select[c9c](P2y);span[p0k](selected[w5n]!==W1n?selected[H0k]():this[s6n][G0k][q2y]);},_optionsTime:function(unit,count,val,allowed,range){var i2y="an=\"";var R2y="/tr>";var L2y='</table>';var K2y="amP";var A2y='</tbody></thead><table class="';var D2y="<thead>";var M2y="thea";var X2y="mP";var b2y="<t";var Q2y='-nospace"><tbody>';var Y2y='<tr>';var h2y="d>";var W2y="le class=";var k2y="r>";var s2y="</th></tr></";var F2y="<tr><th colsp";var U2y="<ta";var l2y="tbody>";var o2y="-ta";var g1n=6;var N2y="floor";var J2y="onta";var K0k=e4n;K0k+=l2y;var R0k=s2y;R0k+=M2y;R0k+=h2y;var a0k=D2y;a0k+=F2y;a0k+=i2y;var f0k=U2y;f0k+=t0n;f0k+=W2y;f0k+=E5n;var j0k=x6T;j0k+=J7n;j0k+=v03.l0n;var r0k=R0n;r0k+=c6n;r0k+=E6n;r0k+=V7n;var s0k=o2y;s0k+=q9n;var l0k=v03.l0n;l0k+=y0n;l0k+=A7n;l0k+=g0n;var q0k=v03.q0n;q0k+=s4n;q0k+=v03.l0n;var P0k=s6n;P0k+=J2y;P0k+=s9n;var z0k=s6n;z0k+=m2s;z0k+=p0y;var classPrefix=this[s6n][z0k];var container=this[W1T][P0k][q0k](l0k+classPrefix+C7c+unit);var i,j;var render=count===c1n?function(i){v03[y5n]();return i;}:this[B6y];var classPrefix=this[s6n][Z7y];var className=classPrefix+s0k;var i18n=this[s6n][Z2c];if(!container[w5n]){return;}var a=s5n;var span=O1n;var button=function(value,label,className){var d2y="=\"butto";var T2y="\" data-v";var r2y="um";var E2y="ton ";var c2y="<bu";var j2y=" dis";var B2y="alue=\"";var y2y="lec";var g2y="-day\" type";var u2y="tton class";var e2y="n\" data-unit=\"";var O2y="-bu";var f2y='<span>';var Z2y="<td class=\"se";var x2y="table ";var a2y='</td>';var g0k=E5n;g0k+=g4n;var B0k=T2y;B0k+=B2y;var T0k=g2y;T0k+=d2y;T0k+=e2y;var J0k=O2y;J0k+=v03.D0n;J0k+=E2y;var o0k=c2y;o0k+=u2y;o0k+=k4n;var W0k=E5n;W0k+=g4n;var U0k=Z2y;U0k+=y2y;U0k+=x2y;var i0k=v03.i0n;i0k+=v03.G0n;var D0k=e0c;D0k+=r9n;D0k+=s2T;D0k+=f6n;var h0k=E6n;h0k+=c6n;var M0k=k0n;M0k+=r2y;M0k+=t0n;M0k+=z0T;if(count===c1n&&val>=c1n&&typeof value===M0k){value+=c1n;}var selected=val===value||value===n2s&&val<c1n||value===h0k&&val>=c1n?I4s:s5n;if(allowed&&$[D0k](value,allowed)===-o1n){var F0k=j2y;F0k+=c9n;selected+=F0k;}if(className){selected+=R8T+className;}v03[i0k]();return U0k+selected+W0k+o0k+classPrefix+J0k+classPrefix+T0k+unit+B0k+value+g0k+f2y+label+S6y+q1y+a2y;};if(count===c1n){var u0k=i4n;u0k+=R2y;var c0k=K2y;c0k+=c6n;var E0k=b2y;E0k+=k2y;var O0k=v03.i0n;O0k+=X2y;O0k+=c6n;var e0k=v03.i0n;e0k+=c6n;var d0k=i4n;d0k+=v2c;d0k+=g4n;a+=d0k;for(i=o1n;i<=g1n;i++){a+=button(i,render(i));}a+=button(e0k,i18n[O0k][W1n]);a+=u7y;a+=E0k;for(i=d1n;i<=c1n;i++){a+=button(i,render(i));}a+=button(A0y,i18n[c0k][o1n]);a+=u0k;span=d1n;}else if(count===j1n){var c=W1n;for(j=W1n;j<B1n;j++){a+=Y2y;for(i=W1n;i<g1n;i++){a+=button(c,render(c));c++;}a+=u7y;}span=g1n;}else{var x0k=i4n;x0k+=v2c;x0k+=g4n;var y0k=e4n;y0k+=v03.D0n;y0k+=r9n;y0k+=g4n;a+=Y2y;for(j=W1n;j<L1n;j+=O1n){var Z0k=s2T;Z0k+=G6n;Z0k+=R0n;a+=button(j,render(j),Z0k);}a+=y0k;a+=A2y+className+R8T+className+Q2y;var start=range!==z1T?range:Math[N2y](val/O1n)*O1n;a+=x0k;for(j=start+o1n;j<start+O1n;j++){a+=button(j,render(j));}a+=u7y;span=g1n;}container[r0k]()[j0k](f0k+className+b8T+a0k+span+b8T+i18n[unit]+R0k+R7y+a+K0k+L2y);},_optionsTitle:function(){var C2y="yearRange";var v2y="_options";var V2y="rR";var I2y="yea";var S2y="minDate";var n2y="_r";var Y0k=n2y;Y0k+=v03.i0n;Y0k+=G6n;Y0k+=R0n;var X0k=a4c;X0k+=x1T;X0k+=a0n;var k0k=x3n;k0k+=H0T;k0k+=r5n;k0k+=a0n;var b0k=I2y;b0k+=V2y;b0k+=w2y;b0k+=R0n;var i18n=this[s6n][Z2c];var min=this[s6n][S2y];var max=this[s6n][u1y];var minYear=min?min[F6y]():z1T;var maxYear=max?max[F6y]():z1T;var i=minYear!==z1T?minYear:new Date()[F6y]()-this[s6n][C2y];var j=maxYear!==z1T?maxYear:new Date()[F6y]()+this[s6n][b0k];this[v2y](w9y,this[m2y](W1n,E1n),i18n[k0k]);v03[k5n]();this[X0k](V9y,this[Y0k](i,j));},_pad:function(i){var t2y='0';return i<O1n?t2y+i:i;},_position:function(){var l3y="eft";var q3y="fse";var s3y="widt";var p3y="Width";var P3y="ontainer";var z3y="ght";var H3y="ppendT";var G3y="erHei";var H9k=x0n;H9k+=R0n;H9k+=v03.q0n;H9k+=v03.D0n;var t0k=v03.D0n;t0k+=k7n;t0k+=E6n;var m0k=Q5T;m0k+=v03.D0n;m0k+=z0T;m0k+=p3y;var v0k=t0n;v0k+=k7n;v0k+=v03.l0n;v0k+=f6n;var C0k=v03.i0n;C0k+=H3y;C0k+=k7n;var S0k=k2n;S0k+=v03.q0n;S0k+=v03.D0n;var w0k=v03.D0n;w0k+=d7T;var V0k=s6n;V0k+=a0n;V0k+=a0n;var I0k=W2T;I0k+=G3y;I0k+=z3y;var n0k=s4n;n0k+=E6n;n0k+=v03.H0n;n0k+=v03.D0n;var L0k=v03.l0n;L0k+=k7n;L0k+=c6n;var N0k=s6n;N0k+=P3y;var Q0k=a7T;Q0k+=q3y;Q0k+=v03.D0n;var A0k=v03.l0n;A0k+=k7n;A0k+=c6n;var offset=this[A0k][g1y][Q0k]();var container=this[W1T][N0k];var inputHeight=this[L0k][n0k][I0k]();container[V0k]({top:offset[w0k]+inputHeight,left:offset[S0k]})[C0k](v0k);var calHeight=container[z4T]();var calWidth=container[m0k]();var scrollTop=$(window)[V2T]();if(offset[t0k]+inputHeight+calHeight-scrollTop>$(window)[d5T]()){var p9k=v03.D0n;p9k+=k7n;p9k+=E6n;var newTop=offset[p9k]-calHeight;container[M1T](Q1c,newTop<W1n?W1n:newTop);}if(calWidth+offset[H9k]>$(window)[p7c]()){var z9k=x0n;z9k+=l3y;var G9k=s3y;G9k+=r5n;var newLeft=$(window)[G9k]()-calWidth;container[M1T](z9k,newLeft<W1n?W1n:newLeft);}},_range:function(start,end,inc){var a=[];if(!inc){inc=o1n;}for(var i=start;i<=end;i+=inc){var P9k=A3s;P9k+=r5n;a[P9k](i);}return a;},_setCalander:function(){var M3y="TCMonth";var D3y="lendar";var h3y="tmlM";var q9k=v03.H0n;q9k+=v03.G0n;v03[q9k]();if(this[a0n][I0T]){var F9k=U7y;F9k+=M3y;var D9k=g3T;D9k+=f6n;var h9k=o6n;h9k+=r5n;h9k+=h3y;h9k+=U9y;var M9k=x6T;M9k+=S2n;var s9k=n1c;s9k+=E6n;s9k+=v03.D0n;s9k+=f6n;var l9k=i1s;l9k+=D3y;this[W1T][l9k][s9k]()[M9k](this[h9k](this[a0n][I0T][P6y](),this[a0n][D9k][F9k]()));}},_setTitle:function(){var i3y="_optio";var U3y="_optionSet";var F3y="tUTCFullYear";var J9k=x6s;J9k+=F3y;var o9k=f6n;o9k+=S5T;o9k+=r9n;var W9k=i3y;W9k+=k0n;W9k+=S0c;var U9k=i5T;U9k+=R6n;var i9k=c6n;i9k+=k7n;i9k+=H0T;i9k+=r5n;this[U3y](i9k,this[a0n][U9k][s9y]());v03[k5n]();this[W9k](o9k,this[a0n][I0T][J9k]());},_setTime:function(){var Z3y="hours12";var o3y="getSeco";var g3y="hours";var e3y="part";var T3y="utes";var J3y="etUTCMin";var d3y="Available";var O3y="hou";var W3y="second";var y3y="_optionsTime";var x3y='seconds';var x9k=W3y;x9k+=a9y;var y9k=o3y;y9k+=w0T;y9k+=a0n;var Z9k=Z9y;Z9k+=U6n;Z9k+=a9y;var u9k=c6n;u9k+=y0n;u9k+=O6n;u9k+=r0n;var c9k=G3n;c9k+=J3y;c9k+=T3y;var E9k=B3y;E9k+=a0T;E9k+=r0n;var O9k=g3y;O9k+=d3y;var e9k=e3y;e9k+=a0n;var d9k=O3y;d9k+=r9n;d9k+=a0n;var g9k=o6n;g9k+=y9s;g9k+=t1y;g9k+=i9T;var that=this;v03[k5n]();var d=this[a0n][v03.l0n];var hours=d?d[K9y]():W1n;var allowed=function(prop){var c3y="ilable";var E3y="Increm";var u3y='Available';var B9k=E3y;B9k+=R0n;B9k+=H0T;var T9k=M8T;T9k+=E1T;T9k+=c3y;v03[k5n]();return that[s6n][prop+u3y]?that[s6n][prop+T9k]:that[m2y](W1n,N1n,that[s6n][prop+B9k]);};this[g9k](d9k,this[a0n][e9k][Z3y]?c1n:j1n,hours,this[s6n][O9k]);this[y3y](E9k,L1n,d?d[c9k]():W1n,allowed(u9k),this[a0n][Z9k]);this[y3y](x3y,L1n,d?d[y9k]():W1n,allowed(x3y),this[a0n][x9k]);},_show:function(){var R3y="sit";var f3y="scrol";var a3y="l.";var j3y="own.";var r3y="keyd";var K3y=' resize.';var b9k=r3y;b9k+=j3y;var K9k=k7n;K9k+=k0n;var R9k=f3y;R9k+=a3y;var j9k=d6y;j9k+=r9n;j9k+=t3T;j9k+=g0n;var r9k=o6n;r9k+=g9c;r9k+=R3y;r9k+=g7c;var that=this;var namespace=this[a0n][Q2c];this[r9k]();$(window)[Z6n](j9k+namespace+K3y+namespace,function(){var b3y="_positi";var a9k=b3y;a9k+=Z6n;var f9k=v03.H0n;f9k+=v03.G0n;v03[f9k]();that[a9k]();});$(O2T)[Z6n](R9k+namespace,function(){var k3y="_position";v03[y5n]();that[k3y]();});$(document)[K9k](b9k+namespace,function(e){var e1n=9;var X9k=p0c;X9k+=Y0s;var k9k=v03.i0n;k9k+=v03.G0n;v03[k9k]();if(e[X9k]===e1n||e[m0s]===a1n||e[m0s]===u1n){that[O1y]();}});setTimeout(function(){var N9k=M3n;N9k+=g6y;var Q9k=k7n;Q9k+=k0n;var A9k=t0n;A9k+=k7n;A9k+=R5T;var Y9k=v03.H0n;Y9k+=v03.G0n;v03[Y9k]();$(A9k)[Q9k](N9k+namespace,function(e){var Y3y="rget";var X3y="filt";var I9k=y0n;I9k+=A4n;I9k+=a0T;var n9k=X3y;n9k+=z0T;var L9k=v03.D0n;L9k+=v03.i0n;L9k+=Y3y;var parents=$(e[L9k])[c5s]();if(!parents[n9k](that[W1T][S1T])[w5n]&&e[G2T]!==that[W1T][I9k][W1n]){that[O1y]();}});},O1n);},_writeOutput:function(focus){var A3y="UTCM";var Q3y="etUTCFullYe";var t9k=G3n;t9k+=R0n;t9k+=v03.D0n;t9k+=I9y;var m9k=B7n;m9k+=v03.i0n;m9k+=v03.l0n;var v9k=b9T;v9k+=A3y;v9k+=U9y;var C9k=G3n;C9k+=Q3y;C9k+=j0c;var S9k=a0T;S9k+=s6n;var w9k=x3n;w9k+=c6n;w9k+=C2n;var V9k=v03.H0n;V9k+=v03.G0n;var date=this[a0n][v03.l0n];v03[V9k]();var out=window[A1y]?window[w9k][S9k](date,undefined,this[s6n][Q1y],this[s6n][N1y])[W1y](this[s6n][W1y]):date[C9k]()+C7c+this[B6y](date[v9k]()+o1n)+C7c+this[m9k](date[t9k]());this[W1T][g1y][P8T](out);if(focus){var p6k=v03.q0n;p6k+=W9s;this[W1T][g1y][p6k]();}}});Editor[W8y][U1y]=W1n;Editor[W8y][H6k]={classPrefix:N3y,disableDays:z1T,firstDay:o1n,format:C8y,hoursAvailable:z1T,i18n:Editor[O2s][Z2c][G6k],maxDate:z1T,minDate:z1T,minutesAvailable:z1T,minutesIncrement:o1n,momentStrict:C5n,momentLocale:z6k,onChange:function(){},secondsAvailable:z1T,secondsIncrement:o1n,showWeekNumber:V5n,yearRange:O1n};(function(){var q03="_en";var r4y="_editor_val";var t4y="arator";var Q4y="_addOptions";var G4y='div.clearValue button';var h4y="alu";var I3y="texta";var M4y="hidden";var P83="checkbox";var F4y="inpu";var r83='input';var s4y="_input";var g4y="_inp";var n3y="exten";var L3y="dMany";var Y4y="multiple";var e83='input:checked';var i83='_';var X13="_picker";var a13="datetime";var i13="datepicker";var y5y="rop";var a83="radio";var j83="prop";var M5y=" />";var l4y="fieldType";var c83="separator";var B83='<div />';var j4y="pairs";var I13="_v";var S3y="don";var T4y="_in";var o4y='text';var E13="npu";var w3y="rd";var V3y="passwo";var o03="oad";var D4y="_val";var H8n=R0n;H8n+=q9c;var p8n=q5c;p8n+=L3y;var f4k=R0n;f4k+=q4s;f4k+=w0T;var j4k=c3c;j4k+=z3c;j4k+=v03.l0n;var d5k=v03.l0n;d5k+=v03.i0n;d5k+=v03.D0n;d5k+=R0n;var u3k=i6n;u3k+=v03.D0n;u3k+=w0n;var S7k=n3y;S7k+=v03.l0n;var n7k=I3y;n7k+=F7c;n7k+=v03.i0n;var b7k=R0n;b7k+=y3s;b7k+=w0n;var K7k=V3y;K7k+=w3y;var r7k=i6n;r7k+=v03.D0n;r7k+=Q7n;r7k+=v03.l0n;var x7k=v03.D0n;x7k+=R0n;x7k+=q3n;x7k+=v03.D0n;var O7k=r9n;O7k+=S5T;O7k+=S3y;O7k+=j1T;var P6k=D8T;P6k+=r0n;var fieldTypes=Editor[P6k];function _buttonText(conf,text){var C3y="Choose";var t3y='div.upload button';var m3y="uploadText";var v3y=" file...";var M6k=v03.q0n;M6k+=y0n;M6k+=k0n;M6k+=v03.l0n;var s6k=h3T;s6k+=R0T;var l6k=v03.H0n;l6k+=v03.G0n;if(text===z1T||text===undefined){var q6k=C3y;q6k+=v3y;text=conf[m3y]||q6k;}v03[l6k]();conf[s6k][M6k](t3y)[p6T](text);}function _commonUpload(editor,conf,dropCallback,multiple){var B5y="load\">";var d5y="terna";var W5y="\"cell";var z5y="<div class=";var h5y="<butt";var T5y="ass=\"editor_up";var L5y='dragover';var p5y="nput[type=file]";var r5y="Drag and d";var k5y='drop';var u5y='<div class="drop"><span/></div>';var H5y="agDrop";var F5y="ltiple";var H4y="dClas";var R5y="div.drop";var s5y="cond\">";var c5y='<div class="cell limitHide">';var b5y="pan";var J5y=" class=\"eu_table\">";var g5y="tonIn";var G5y="ileR";var i5y="<div clas";var p4y="oDr";var m5y="nde";var q5y=" class=\"cell\">";var f5y="dragD";var e5y='<div class="row">';var x5y="fin";var K5y=" s";var O5y='<input type="file" ';var a5y="ropTe";var U5y="s=";var E5y='<div class="cell clearValue">';var D5y="n class";var j5y="rop a file here to u";var P5y="\"rendered\"/>";var o5y=" upload limitHide\">";var l5y="<div class=\"row se";var t5y="red";var Z5y="agleave dragexit";var q7k=s6n;q7k+=r5n;q7k+=w2y;q7k+=R0n;var P7k=y0n;P7k+=p5y;var G7k=k7n;G7k+=k0n;var H7k=v03.q0n;H7k+=s4n;H7k+=v03.l0n;var p7k=v03.i0n;p7k+=v03.G0n;var x6k=u8c;x6k+=H5y;var y6k=N9n;y6k+=G5y;y6k+=J4T;var Z6k=Y7n;Z6k+=k0n;Z6k+=v03.i0n;Z6k+=W0y;var u6k=o6n;u6k+=x0T;u6k+=v03.H0n;u6k+=v03.D0n;var c6k=e4n;c6k+=v03.l0n;c6k+=y0n;c6k+=W4n;var E6k=I6c;E6k+=W4n;var O6k=z5y;O6k+=P5y;var e6k=A6T;e6k+=q5y;var d6k=l5y;d6k+=s5y;var g6k=E5n;g6k+=M5y;var B6k=h5y;B6k+=k7n;B6k+=D5y;B6k+=k4n;var T6k=X6T;T6k+=g4n;var J6k=c6n;J6k+=v03.H0n;J6k+=F5y;var o6k=E5n;o6k+=M5y;var W6k=i5y;W6k+=U5y;W6k+=W5y;W6k+=o5y;var U6k=A6T;U6k+=J5y;var i6k=E4n;i6k+=g5c;i6k+=T5y;i6k+=B5y;var F6k=M2c;F6k+=g5y;F6k+=d5y;F6k+=x0n;var D6k=v03.q0n;D6k+=k7n;D6k+=r9n;D6k+=c6n;var h6k=N8c;h6k+=a0n;h6k+=R0n;h6k+=a0n;var btnClass=editor[h6k][D6k][F6k];var container=$(i6k+U6k+e5y+W6k+N6y+btnClass+o6k+O5y+(multiple?J6k:s5n)+T6k+Q8T+E5y+B6k+btnClass+g6k+Q8T+Q8T+d6k+c5y+u5y+Q8T+e6k+O6k+Q8T+E6k+c6k+Q8T);conf[u6k]=container;conf[Z6k]=C5n;_buttonText(conf);if(window[y6k]&&conf[x6k]!==V5n){var V6k=k7n;V6k+=k0n;var L6k=k7n;L6k+=k0n;var Y6k=u8c;Y6k+=Z5y;var X6k=k7n;X6k+=k0n;var R6k=v03.l0n;R6k+=o6s;R6k+=v03.l0n;R6k+=y5y;var a6k=x5y;a6k+=v03.l0n;var f6k=r5y;f6k+=j5y;f6k+=E6n;f6k+=b3c;var j6k=f5y;j6k+=a5y;j6k+=y3s;var r6k=R5y;r6k+=K5y;r6k+=b5y;container[c9c](r6k)[r6T](conf[j6k]||f6k);var dragDrop=container[a6k](R6k);dragDrop[Z6n](k5y,function(e){var Y5y="moveCla";var Q5y="dataTransfer";var X5y="_enable";var A5y="originalEvent";var K6k=X5y;K6k+=v03.l0n;if(conf[K6k]){var k6k=k7n;k6k+=A7n;k6k+=R0n;k6k+=r9n;var b6k=r9n;b6k+=R0n;b6k+=Y5y;b6k+=H2n;Editor[K3c](editor,conf,e[A5y][Q5y][j5n],_buttonText,dropCallback);dragDrop[b6k](k6k);}v03[y5n]();return V5n;})[X6k](Y6k,function(e){var N5y="_enab";var A6k=N5y;A6k+=k2n;A6k+=v03.l0n;if(conf[A6k]){var N6k=S7s;N6k+=R0n;N6k+=r9n;var Q6k=J0T;Q6k+=V8s;Q6k+=m2s;dragDrop[Q6k](N6k);}return V5n;})[L6k](L5y,function(e){var I5y='over';var n5y="_enabl";var n6k=n5y;n6k+=J2n;if(conf[n6k]){dragDrop[o0T](I5y);}v03[k5n]();return V5n;});editor[Z6n](I9c,function(){var V5y='dragover.DTE_Upload drop.DTE_Upload';var I6k=k7n;I6k+=k0n;v03[y5n]();$(N7T)[I6k](V5y,function(e){return V5n;});})[V6k](a6T,function(){var S5y="loa";var v5y="op.DTE_Upload";var w5y="dragover.DTE_Up";var C5y="d dr";var S6k=w5y;S6k+=S5y;S6k+=C5y;S6k+=v5y;var w6k=t0n;w6k+=k7n;w6k+=v03.l0n;w6k+=f6n;v03[k5n]();$(w6k)[o1c](S6k);});}else{var t6k=V5T;t6k+=F7c;t6k+=m5y;t6k+=t5y;var m6k=c2T;m6k+=w0n;var v6k=k0n;v6k+=p4y;v6k+=k7n;v6k+=E6n;var C6k=v03.i0n;C6k+=v03.l0n;C6k+=H4y;C6k+=a0n;container[C6k](v6k);container[m6k](container[c9c](t6k));}v03[p7k]();container[H7k](G4y)[G7k](o1T,function(){var z7k=s3n;z7k+=v03.D0n;Editor[J8T][K3c][z7k][K1T](editor,conf,s5n);});container[c9c](P7k)[Z6n](q7k,function(){var l7k=c3c;l7k+=k7n;l7k+=E3c;Editor[l7k](editor,conf,this[j5n],_buttonText,function(ids){var z4y="ut[type=file]";var h7k=x0T;h7k+=z4y;var M7k=x5y;M7k+=v03.l0n;var s7k=s6n;s7k+=v03.i0n;s7k+=x0n;s7k+=x0n;dropCallback[s7k](editor,ids);container[M7k](h7k)[P8T](s5n);});});return container;}function _triggerChange(input){var D7k=v03.H0n;D7k+=v03.G0n;v03[D7k]();setTimeout(function(){var P4y="trig";var q4y="ger";var U7k=x5n;U7k+=v1y;var i7k=P4y;i7k+=q4y;var F7k=v03.i0n;F7k+=v03.G0n;v03[F7k]();input[i7k](U7k,{editor:C5n,editorSet:C5n});},W1n);}var baseFieldType=$[g8T](C5n,{},Editor[f6T][l4y],{get:function(conf){var o7k=A7n;o7k+=v03.i0n;o7k+=x0n;var W7k=v03.H0n;W7k+=v03.G0n;v03[W7k]();return conf[s4y][o7k]();},set:function(conf,val){var J7k=o6n;J7k+=g1y;conf[J7k][P8T](val);_triggerChange(conf[s4y]);},enable:function(conf){var T7k=Z7n;T7k+=E6n;v03[y5n]();conf[s4y][T7k](c9y,V5n);},disable:function(conf){var g7k=h7n;g7k+=k7n;g7k+=E6n;var B7k=o6n;B7k+=g1y;conf[B7k][g7k](c9y,C5n);},canReturnSubmit:function(conf,node){v03[y5n]();return C5n;}});fieldTypes[M4y]={create:function(conf){var d7k=A7n;d7k+=h4y;d7k+=R0n;conf[D4y]=conf[d7k];return z1T;},get:function(conf){var e7k=o6n;e7k+=A7n;e7k+=v03.i0n;e7k+=x0n;return conf[e7k];},set:function(conf,val){v03[y5n]();conf[D4y]=val;}};fieldTypes[O7k]=$[g8T](C5n,{},baseFieldType,{create:function(conf){var U4y="put/";var i4y="<in";var y7k=o6n;y7k+=F4y;y7k+=v03.D0n;var Z7k=U6n;Z7k+=q3n;Z7k+=v03.D0n;var u7k=S4n;u7k+=v03.q0n;u7k+=C4n;var c7k=R0n;c7k+=q3n;c7k+=L2c;var E7k=i4y;E7k+=U4y;E7k+=g4n;conf[s4y]=$(E7k)[s5s]($[c7k]({id:Editor[u7k](conf[H7n]),type:Z7k,readonly:O1T},conf[s5s]||{}));return conf[y7k][W1n];}});v03[y5n]();fieldTypes[x7k]=$[r7k](C5n,{},baseFieldType,{create:function(conf){var W4y='<input/>';var R7k=R0n;R7k+=q3n;R7k+=v03.D0n;R7k+=w0n;var a7k=I6n;a7k+=v03.D0n;a7k+=r9n;var f7k=h3T;f7k+=A4n;f7k+=a0T;var j7k=v03.H0n;j7k+=v03.G0n;v03[j7k]();conf[f7k]=$(W4y)[a7k]($[R7k]({id:Editor[p3c](conf[H7n]),type:o4y},conf[s5s]||{}));return conf[s4y][W1n];}});fieldTypes[K7k]=$[b7k](C5n,{},baseFieldType,{create:function(conf){var B4y='password';var J4y="ut/>";var L7k=o6n;L7k+=y0n;L7k+=k0n;L7k+=H0y;var N7k=T3s;N7k+=r9n;var Q7k=y0n;Q7k+=v03.l0n;var A7k=a0n;A7k+=v03.i0n;A7k+=v03.q0n;A7k+=C4n;var Y7k=I6n;Y7k+=v2c;var X7k=i4n;X7k+=y0n;X7k+=A4n;X7k+=J4y;var k7k=T4y;k7k+=E6n;k7k+=v03.H0n;k7k+=v03.D0n;conf[k7k]=$(X7k)[Y7k]($[g8T]({id:Editor[A7k](conf[Q7k]),type:B4y},conf[N7k]||{}));v03[k5n]();return conf[L7k][W1n];}});fieldTypes[n7k]=$[g8T](C5n,{},baseFieldType,{create:function(conf){var d4y='<textarea/>';var w7k=g4y;w7k+=a0T;var V7k=v03.i0n;V7k+=v03.D0n;V7k+=v03.D0n;V7k+=r9n;var I7k=y0n;I7k+=v03.l0n;conf[s4y]=$(d4y)[s5s]($[g8T]({id:Editor[p3c](conf[I7k])},conf[V7k]||{}));return conf[w7k][W1n];},canReturnSubmit:function(conf,node){v03[k5n]();return V5n;}});fieldTypes[E4s]=$[S7k](C5n,{},baseFieldType,{_addOptions:function(conf,opts,append){var y4y="placeholderValue";var u4y="pla";var x4y="placeholderDisabled";var f4y="optionsPair";var O4y="lde";var c4y="idden";var e4y="laceho";var Z4y="ceholder";var E4y="sabl";var elOpts=conf[s4y][W1n][y9s];var countOffset=W1n;if(!append){var v7k=E6n;v7k+=e4y;v7k+=O4y;v7k+=r9n;var C7k=w7c;C7k+=b7s;C7k+=r5n;elOpts[C7k]=W1n;if(conf[v7k]!==undefined){var p2k=A2n;p2k+=E4y;p2k+=J2n;var t7k=r5n;t7k+=c4y;var m7k=u4y;m7k+=Z4y;var placeholderValue=conf[y4y]!==undefined?conf[y4y]:s5n;countOffset+=o1n;elOpts[W1n]=new Option(conf[m7k],placeholderValue);var disabled=conf[x4y]!==undefined?conf[x4y]:C5n;elOpts[W1n][t7k]=disabled;elOpts[W1n][p2k]=disabled;elOpts[W1n][r4y]=placeholderValue;}}else{var H2k=w7c;H2k+=G3n;H2k+=v03.D0n;H2k+=r5n;countOffset=elOpts[H2k];}if(opts){Editor[j4y](opts,conf[f4y],function(val,label,i,attr){var a4y="_va";var G2k=Y7n;G2k+=K0n;G2k+=a4y;G2k+=x0n;var option=new Option(label,val);option[G2k]=val;if(attr){var z2k=T3s;z2k+=r9n;$(option)[z2k](attr);}elOpts[i+countOffset]=option;});}},create:function(conf){var b4y="ge.dte";var k4y="ten";var R4y="ions";var K4y="chan";var X4y="<select/";var W2k=g4y;W2k+=a0T;var U2k=y0n;U2k+=E6n;U2k+=B6n;U2k+=a0n;var i2k=d7T;i2k+=v03.D0n;i2k+=R4y;var D2k=K4y;D2k+=b4y;var h2k=v03.i0n;h2k+=v03.D0n;h2k+=v2c;var M2k=y0n;M2k+=v03.l0n;var s2k=R0n;s2k+=q3n;s2k+=k4y;s2k+=v03.l0n;var l2k=v03.i0n;l2k+=v03.D0n;l2k+=v03.D0n;l2k+=r9n;var q2k=X4y;q2k+=g4n;var P2k=o6n;P2k+=F4y;P2k+=v03.D0n;conf[P2k]=$(q2k)[l2k]($[s2k]({id:Editor[p3c](conf[M2k]),multiple:conf[Y4y]===C5n},conf[h2k]||{}))[Z6n](D2k,function(e,d){var A4y="_lastSet";if(!d||!d[j0n]){var F2k=G3n;F2k+=x2n;conf[A4y]=fieldTypes[E4s][F2k](conf);}});fieldTypes[E4s][Q4y](conf,conf[i2k]||conf[U2k]);v03[y5n]();return conf[W2k][W1n];},update:function(conf,options,append){var N4y="_last";var T2k=o6n;T2k+=y0n;T2k+=A4n;T2k+=a0T;var J2k=N4y;J2k+=Z0n;J2k+=x2n;var o2k=a0n;o2k+=R0n;o2k+=k2n;o2k+=n5n;v03[k5n]();fieldTypes[o2k][Q4y](conf,options,append);var lastSet=conf[J2k];if(lastSet!==undefined){fieldTypes[E4s][k9T](conf,lastSet,C5n);}_triggerChange(conf[T2k]);},get:function(conf){var I4y="sepa";var L4y="option:selec";var V4y="rator";var y2k=w7c;y2k+=G3n;y2k+=v03.D0n;y2k+=r5n;var E2k=r2n;E2k+=Z4T;var e2k=c6n;e2k+=v03.i0n;e2k+=E6n;var d2k=L4y;d2k+=a6y;var g2k=v03.q0n;g2k+=f2T;var B2k=o6n;B2k+=F4y;B2k+=v03.D0n;var val=conf[B2k][g2k](d2k)[e2k](function(){var n4y="itor_v";var O2k=r4c;O2k+=n4y;O2k+=m2c;return this[O2k];})[E2k]();if(conf[Y4y]){var Z2k=I4y;Z2k+=V4y;var u2k=P3n;u2k+=k7n;u2k+=y0n;u2k+=k0n;var c2k=s3n;c2k+=h7T;c2k+=V4y;return conf[c2k]?val[u2k](conf[Z2k]):val;}return val[y2k]?val[W1n]:z1T;},set:function(conf,val,localUpdate){var C4y="separa";var v4y="_l";var S4y="sAr";var m4y="astSet";var p83='option';var G83="ecte";var w4y="placehold";var k2k=w4y;k2k+=z0T;var K2k=k7n;K2k+=E6n;K2k+=A1T;K2k+=k0n;var R2k=g4y;R2k+=a0T;var a2k=x0n;a2k+=P8y;a2k+=r5n;var f2k=y0n;f2k+=S4y;f2k+=O0c;var r2k=C4y;r2k+=r2n;r2k+=r9n;if(!localUpdate){var x2k=v4y;x2k+=m4y;conf[x2k]=val;}if(conf[Y4y]&&conf[r2k]&&!$[r9T](val)){var j2k=a0n;j2k+=y6n;j2k+=t4y;val=typeof val===d9T?val[c8s](conf[j2k]):[];}else if(!$[f2k](val)){val=[val];}var i,len=val[a2k],found,allFound=V5n;var options=conf[s4y][c9c](p83);conf[R2k][c9c](K2k)[h9T](function(){var H83="selected";found=V5n;for(i=W1n;i<len;i++){var b2k=o6n;b2k+=R0n;b2k+=K0n;b2k+=D4y;if(this[b2k]==val[i]){found=C5n;allFound=C5n;break;}}this[H83]=found;});if(conf[k2k]&&!allFound&&!conf[Y4y]&&options[w5n]){var X2k=A6y;X2k+=G83;X2k+=v03.l0n;options[W1n][X2k]=C5n;}if(!localUpdate){var Y2k=o6n;Y2k+=x0T;Y2k+=v03.H0n;Y2k+=v03.D0n;_triggerChange(conf[Y2k]);}return allFound;},destroy:function(conf){var z83='change.dte';var A2k=h3T;A2k+=R0T;v03[k5n]();conf[A2k][o1c](z83);}});fieldTypes[P83]=$[g8T](C5n,{},baseFieldType,{_addOptions:function(conf,opts,append){var q83="optio";var l83="nsPai";v03[y5n]();var val,label;var jqInput=conf[s4y];var offset=W1n;if(!append){jqInput[B1y]();}else{var N2k=D6T;N2k+=r5n;var Q2k=x0T;Q2k+=a0T;offset=$(Q2k,jqInput)[N2k];}if(opts){var L2k=q83;L2k+=l83;L2k+=r9n;Editor[j4y](opts,conf[L2k],function(val,label,i,attr){var W83='</label>';var h83="<label for=";var o83='input:last';var F83='<div>';var D83="<input id=";var U83='" type="checkbox" />';var s83="_edito";var M83="ut:las";var t2k=s83;t2k+=r9n;t2k+=D4y;var m2k=A7n;m2k+=h4y;m2k+=R0n;var v2k=I6n;v2k+=v2c;var C2k=x0T;C2k+=M83;C2k+=v03.D0n;var S2k=e4n;S2k+=O4n;var w2k=y0n;w2k+=v03.l0n;var V2k=h83;V2k+=E5n;var I2k=D83;I2k+=E5n;var n2k=v03.i0n;n2k+=E6n;n2k+=S2n;jqInput[n2k](F83+I2k+Editor[p3c](conf[H7n])+i83+(i+offset)+U83+V2k+Editor[p3c](conf[w2k])+i83+(i+offset)+b8T+label+W83+S2k);$(C2k,jqInput)[v2k](m2k,val)[W1n][t2k]=val;if(attr){var p3k=v03.i0n;p3k+=v03.D0n;p3k+=v2c;$(o83,jqInput)[p3k](attr);}});}},create:function(conf){var T83="ipO";var J83="_inpu";var G3k=J83;G3k+=v03.D0n;var H3k=T83;H3k+=E6n;H3k+=Q0n;conf[s4y]=$(B83);fieldTypes[P83][Q4y](conf,conf[y9s]||conf[H3k]);return conf[G3k][W1n];},get:function(conf){var d83="lue";var g83="electedVa";var E83="unselectedVal";var h3k=a0n;h3k+=y6n;h3k+=t4y;var M3k=P3n;M3k+=j6y;var l3k=u6T;l3k+=g83;l3k+=d83;var z3k=o6n;z3k+=y0n;z3k+=R0T;v03[k5n]();var out=[];var selected=conf[z3k][c9c](e83);if(selected[w5n]){var P3k=R0n;P3k+=t2c;selected[P3k](function(){var O83="_editor_";var q3k=O83;q3k+=P8T;v03[y5n]();out[A5n](this[q3k]);});}else if(conf[l3k]!==undefined){var s3k=E83;s3k+=I9s;out[A5n](conf[s3k]);}return conf[c83]===undefined||conf[c83]===z1T?out:out[M3k](conf[h3k]);},set:function(conf,val){var u83='|';var o3k=R0n;o3k+=v03.i0n;o3k+=x5n;var W3k=k2n;W3k+=T6T;var i3k=J0s;i3k+=G3n;var F3k=s4n;F3k+=E6n;F3k+=a0T;var D3k=v03.q0n;D3k+=f2T;var jqInputs=conf[s4y][D3k](F3k);if(!$[r9T](val)&&typeof val===i3k){var U3k=a0n;U3k+=E6n;U3k+=x0n;U3k+=t6T;val=val[U3k](conf[c83]||u83);}else if(!$[r9T](val)){val=[val];}var i,len=val[W3k],found;jqInputs[o3k](function(){var Z83="ecked";var y83="editor_val";var T3k=x5n;T3k+=Z83;found=V5n;for(i=W1n;i<len;i++){var J3k=o6n;J3k+=y83;if(this[J3k]==val[i]){found=C5n;break;}}v03[k5n]();this[T3k]=found;});_triggerChange(jqInputs);},enable:function(conf){var x83="disable";var g3k=x83;g3k+=v03.l0n;var B3k=v03.q0n;B3k+=y0n;B3k+=w0T;v03[k5n]();conf[s4y][B3k](r83)[j83](g3k,V5n);},disable:function(conf){var E3k=E9n;E3k+=L4n;E3k+=x0n;E3k+=J2n;var O3k=h7n;O3k+=k7n;O3k+=E6n;var e3k=y0n;e3k+=A4n;e3k+=a0T;var d3k=v03.q0n;d3k+=y0n;d3k+=k0n;d3k+=v03.l0n;conf[s4y][d3k](e3k)[O3k](E3k,C5n);},update:function(conf,options,append){var f83="eckbox";var c3k=x5n;c3k+=f83;var checkbox=fieldTypes[c3k];var currVal=checkbox[b9T](conf);v03[k5n]();checkbox[Q4y](conf,options,append);checkbox[k9T](conf,currVal);}});fieldTypes[a83]=$[u3k](C5n,{},baseFieldType,{_addOptions:function(conf,opts,append){var R83="mpty";var K83="Pair";var Z3k=o6n;Z3k+=y0n;Z3k+=R0T;var val,label;var jqInput=conf[Z3k];var offset=W1n;if(!append){var y3k=R0n;y3k+=R83;jqInput[y3k]();}else{var x3k=k2n;x3k+=T6T;offset=$(r83,jqInput)[x3k];}v03[k5n]();if(opts){var j3k=d7T;j3k+=t7n;j3k+=I1c;j3k+=K83;var r3k=E6n;r3k+=v03.i0n;r3k+=y0n;r3k+=X0y;Editor[r3k](opts,conf[j3k],function(val,label,i,attr){var X83="</label";var b83="nput:";var Q83='" type="radio" name="';var N83='<label for="';var Y83="afeId";var k83="ast";var L83=":l";var A83='<input id="';var A3k=v03.i0n;A3k+=v03.D0n;A3k+=v03.D0n;A3k+=r9n;var Y3k=y0n;Y3k+=b83;Y3k+=x0n;Y3k+=k83;var X3k=X83;X3k+=g4n;var k3k=E5n;k3k+=M5y;var b3k=k0n;b3k+=v03.i0n;b3k+=c6n;b3k+=R0n;var K3k=y0n;K3k+=v03.l0n;var R3k=a0n;R3k+=Y83;var a3k=E4n;a3k+=y0n;a3k+=W4n;var f3k=k8s;f3k+=k0n;f3k+=v03.l0n;jqInput[f3k](a3k+A83+Editor[R3k](conf[K3k])+i83+(i+offset)+Q83+conf[b3k]+k3k+N83+Editor[p3c](conf[H7n])+i83+(i+offset)+b8T+label+X3k+Q8T);$(Y3k,jqInput)[A3k](e9y,val)[W1n][r4y]=val;v03[k5n]();if(attr){var Q3k=s4n;Q3k+=H0y;Q3k+=L83;Q3k+=k83;$(Q3k,jqInput)[s5s](attr);}});}},create:function(conf){var n83="ipOpts";var n3k=d7T;n3k+=Q7n;var L3k=k7n;L3k+=k0n;var N3k=r9n;N3k+=E3c;N3k+=y0n;N3k+=k7n;conf[s4y]=$(B83);fieldTypes[N3k][Q4y](conf,conf[y9s]||conf[n83]);this[L3k](n3k,function(){var V3k=y0n;V3k+=R0T;var I3k=h3T;I3k+=k0n;I3k+=L4T;I3k+=v03.D0n;v03[y5n]();conf[I3k][c9c](V3k)[h9T](function(){var V83="hecked";var I83="_preChecked";v03[y5n]();if(this[I83]){var w3k=s6n;w3k+=V83;this[w3k]=C5n;}});});v03[y5n]();return conf[s4y][W1n];},get:function(conf){var w83="put:check";var v3k=y0n;v3k+=k0n;v3k+=w83;v3k+=J2n;var C3k=v03.q0n;C3k+=y0n;C3k+=k0n;C3k+=v03.l0n;var S3k=T4y;S3k+=H0y;var el=conf[S3k][C3k](v3k);return el[w5n]?el[W1n][r4y]:undefined;},set:function(conf,val){var t3k=s4n;t3k+=H0y;var m3k=o6n;m3k+=s4n;m3k+=L4T;m3k+=v03.D0n;var that=this;conf[m3k][c9c](t3k)[h9T](function(){var p13="_preCheck";var H13="cked";var C83="reChe";var v83="cke";var t83="checked";var m83="_preChecke";var S83="tor_v";var H5k=U4s;H5k+=S83;H5k+=m2c;var p5k=B7n;p5k+=C83;p5k+=v83;p5k+=v03.l0n;this[p5k]=V5n;if(this[H5k]==val){var G5k=m83;G5k+=v03.l0n;this[t83]=C5n;this[G5k]=C5n;}else{var P5k=p13;P5k+=J2n;var z5k=x5n;z5k+=R0n;z5k+=H13;this[z5k]=V5n;this[P5k]=V5n;}});_triggerChange(conf[s4y][c9c](e83));},enable:function(conf){var M5k=E6n;M5k+=r9n;M5k+=d7T;var s5k=s4n;s5k+=H0y;var l5k=h3T;l5k+=k0n;l5k+=H0y;var q5k=v03.H0n;q5k+=v03.G0n;v03[q5k]();conf[l5k][c9c](s5k)[M5k](c9y,V5n);},disable:function(conf){var i5k=E6n;i5k+=r9n;i5k+=d7T;var F5k=x0T;F5k+=v03.H0n;F5k+=v03.D0n;var D5k=v03.q0n;D5k+=y0n;D5k+=w0T;var h5k=h3T;h5k+=A4n;h5k+=a0T;conf[h5k][D5k](F5k)[i5k](c9y,C5n);},update:function(conf,options,append){var z13="filter";var G13="addOpti";var g5k=A7n;g5k+=v03.i0n;g5k+=x0n;g5k+=I9s;var B5k=I6n;B5k+=v2c;var T5k=E5n;T5k+=c5n;var J5k=f6s;J5k+=A7n;J5k+=v03.i0n;J5k+=H2y;var o5k=s4n;o5k+=E6n;o5k+=v03.H0n;o5k+=v03.D0n;var W5k=o6n;W5k+=G13;W5k+=k7n;W5k+=d6n;var U5k=r9n;U5k+=E3c;U5k+=g6n;var radio=fieldTypes[U5k];var currVal=radio[b9T](conf);radio[W5k](conf,options,append);var inputs=conf[s4y][c9c](o5k);v03[k5n]();radio[k9T](conf,inputs[z13](J5k+currVal+T5k)[w5n]?currVal:inputs[l1c](W1n)[B5k](g5k));}});fieldTypes[d5k]=$[g8T](C5n,{},baseFieldType,{create:function(conf){var F13="mat";var h13="ddClas";var P13="datepick";var M13="eryui";var s13="jqu";var l13="ttr";var D13="dateFormat";var q13="safe";var B13='date';var U13="RFC_2822";var N5k=o6n;N5k+=y0n;N5k+=k0n;N5k+=H0y;var Q5k=v03.i0n;Q5k+=v03.G0n;var y5k=P13;y5k+=R0n;y5k+=r9n;var Z5k=v03.D0n;Z5k+=R0n;Z5k+=y3s;var u5k=y0n;u5k+=v03.l0n;var c5k=q13;c5k+=p7n;var E5k=V0n;E5k+=R0n;E5k+=w0T;var O5k=v03.i0n;O5k+=l13;var e5k=i4n;e5k+=g1y;e5k+=M5y;conf[s4y]=$(e5k)[O5k]($[E5k]({id:Editor[c5k](conf[u5k]),type:Z5k},conf[s5s]));if($[y5k]){var j5k=s13;j5k+=M13;var r5k=v03.i0n;r5k+=h13;r5k+=a0n;var x5k=o6n;x5k+=y0n;x5k+=k0n;x5k+=H0y;conf[x5k][r5k](j5k);if(!conf[D13]){var f5k=P0y;f5k+=N9n;f5k+=l6n;f5k+=F13;conf[f5k]=$[i13][U13];}setTimeout(function(){var o13="atepi";var T13="teI";var W13="#ui-d";var J13="cker-div";var X5k=k0n;X5k+=k7n;X5k+=a6n;var k5k=W13;k5k+=o13;k5k+=J13;var R5k=X0n;R5k+=T13;R5k+=H6c;R5k+=x6s;var a5k=v03.i0n;a5k+=v03.G0n;v03[a5k]();$(conf[s4y])[i13]($[g8T]({dateFormat:conf[D13],buttonImage:conf[R5k],buttonImageOnly:C5n,onSelect:function(){var b5k=E5c;b5k+=s6n;b5k+=v03.H0n;b5k+=a0n;var K5k=o6n;K5k+=g1y;v03[k5n]();conf[K5k][b5k]()[T1c]();}},conf[k1T]));$(k5k)[M1T](h1T,X5k);},O1n);}else{var A5k=K0T;A5k+=R0n;var Y5k=v03.i0n;Y5k+=v03.D0n;Y5k+=v03.D0n;Y5k+=r9n;conf[s4y][Y5k](A5k,B13);}v03[Q5k]();return conf[N5k][W1n];},set:function(conf,val){var g13='hasDatepicker';var d13="chang";var e13="tDat";v03[y5n]();if($[i13]&&conf[s4y][Z0T](g13)){var I5k=d13;I5k+=R0n;var n5k=s3n;n5k+=e13;n5k+=R0n;var L5k=h3T;L5k+=k0n;L5k+=L4T;L5k+=v03.D0n;conf[L5k][i13](n5k,val)[I5k]();}else{var V5k=T4y;V5k+=H0y;$(conf[V5k])[P8T](val);}},enable:function(conf){var O13="enable";var w5k=v03.H0n;w5k+=v03.G0n;v03[w5k]();if($[i13]){conf[s4y][i13](O13);}else{var S5k=h3T;S5k+=E13;S5k+=v03.D0n;$(conf[S5k])[j83](c9y,V5n);}},disable:function(conf){var c13="isab";var u13="tepicker";if($[i13]){var v5k=v03.l0n;v5k+=c13;v5k+=k2n;var C5k=X0n;C5k+=u13;conf[s4y][C5k](v5k);}else{var p4k=E9n;p4k+=c9n;var t5k=E6n;t5k+=y5y;var m5k=o6n;m5k+=x0T;m5k+=a0T;$(conf[m5k])[t5k](p4k,C5n);}},owns:function(conf,node){var x13="r-header";var r13="div.ui-da";var y13="atepicke";var f13="icker";var Z13="div.ui-d";var j13="tep";var P4k=Z13;P4k+=y13;P4k+=x13;var z4k=r13;z4k+=j13;z4k+=f13;var G4k=h7T;G4k+=r9n;G4k+=R0n;G4k+=D7c;var H4k=v03.i0n;H4k+=v03.G0n;v03[H4k]();return $(node)[G4k](z4k)[w5n]||$(node)[c5s](P4k)[w5n]?C5n:V5n;}});fieldTypes[a13]=$[g8T](C5n,{},baseFieldType,{create:function(conf){var R13="eyIn";var k13='<input />';var b13="ateTi";var K13="etime";var Y13="_closeFn";var g4k=h3T;g4k+=R0T;var B4k=s6n;B4k+=x0n;B4k+=k7n;B4k+=s3n;var o4k=p0c;o4k+=R13;o4k+=H0y;var F4k=v03.l0n;F4k+=I6n;F4k+=K13;var D4k=o6n;D4k+=s4n;D4k+=L4T;D4k+=v03.D0n;var h4k=I9n;h4k+=b13;h4k+=c6n;h4k+=R0n;var M4k=I6n;M4k+=v03.D0n;M4k+=r9n;var s4k=y0n;s4k+=v03.l0n;var l4k=v03.i0n;l4k+=v03.D0n;l4k+=v2c;var q4k=o6n;q4k+=x0T;q4k+=v03.H0n;q4k+=v03.D0n;conf[q4k]=$(k13)[l4k]($[g8T](C5n,{id:Editor[p3c](conf[s4k]),type:o4y},conf[M4k]));conf[X13]=new Editor[h4k](conf[D4k],$[g8T]({format:conf[W1y],i18n:this[Z2c][F4k],onChange:function(){var U4k=T4y;U4k+=H0y;var i4k=v03.H0n;i4k+=v03.G0n;v03[i4k]();_triggerChange(conf[U4k]);}},conf[k1T]));conf[Y13]=function(){var W4k=r5n;W4k+=H7n;W4k+=R0n;conf[X13][W4k]();};if(conf[o4k]===V5n){var T4k=k7n;T4k+=k0n;var J4k=h3T;J4k+=A4n;J4k+=v03.H0n;J4k+=v03.D0n;conf[J4k][T4k](X0s,function(e){e[J0c]();});}this[Z6n](B4k,conf[Y13]);v03[y5n]();return conf[g4k][W1n];},set:function(conf,val){var A13="_pic";var d4k=A13;d4k+=i0c;d4k+=r9n;conf[d4k][P8T](val);v03[y5n]();_triggerChange(conf[s4y]);},owns:function(conf,node){var O4k=Z2n;O4k+=k0n;O4k+=a0n;var e4k=v03.i0n;e4k+=v03.G0n;v03[e4k]();return conf[X13][O4k](node);},errorMessage:function(conf,msg){var Q13="errorMsg";conf[X13][Q13](msg);},destroy:function(conf){var N13="_closeF";var y4k=E3n;y4k+=j9T;y4k+=r7n;y4k+=f6n;var Z4k=g4y;Z4k+=a0T;var u4k=N13;u4k+=k0n;var c4k=s6n;c4k+=P6T;c4k+=s3n;var E4k=k7n;E4k+=v03.q0n;E4k+=v03.q0n;this[E4k](c4k,conf[u4k]);conf[Z4k][o1c](X0s);conf[X13][y4k]();},minDate:function(conf,min){var x4k=B7n;x4k+=Y1s;x4k+=p0c;x4k+=z0T;conf[x4k][B3y](min);},maxDate:function(conf,max){var r4k=c6n;r4k+=v03.i0n;r4k+=q3n;conf[X13][r4k](max);}});fieldTypes[j4k]=$[f4k](C5n,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var L13="tUpl";var n13="eldType";var b4k=D7s;b4k+=L13;b4k+=z3c;b4k+=v03.l0n;var K4k=o6n;K4k+=M5c;K4k+=H0T;var R4k=s6n;R4k+=W0c;var a4k=v03.q0n;a4k+=y0n;a4k+=n13;a4k+=a0n;Editor[a4k][K3c][k9T][R4k](editor,conf,val[W1n]);editor[K4k](b4k,[conf[d8T],val[W1n]]);});return container;},get:function(conf){var k4k=I13;k4k+=m2c;v03[k5n]();return conf[k4k];},set:function(conf,val){var w13='div.rendered';var z03="addC";var v13="noFileText";var p03='noClear';var C13="<span";var G03="lear";var m13='No file';var t13="clearText";var V13="upload.";var H03="noC";var P03="triggerHandler";var S13="/sp";var S4k=o6n;S4k+=A7n;S4k+=v03.i0n;S4k+=x0n;var w4k=V13;w4k+=R0n;w4k+=K0n;var V4k=T4y;V4k+=E6n;V4k+=v03.H0n;V4k+=v03.D0n;var L4k=v03.q0n;L4k+=f2T;var X4k=h3T;X4k+=E13;X4k+=v03.D0n;conf[D4y]=val;var container=conf[X4k];if(conf[I0T]){var rendered=container[c9c](w13);if(conf[D4y]){var Y4k=o6n;Y4k+=A7n;Y4k+=v03.i0n;Y4k+=x0n;rendered[p6T](conf[I0T](conf[Y4k]));}else{var N4k=i4n;N4k+=S13;N4k+=R4n;N4k+=g4n;var Q4k=C13;Q4k+=g4n;var A4k=e1y;A4k+=v03.D0n;A4k+=f6n;rendered[A4k]()[q7T](Q4k+(conf[v13]||m13)+N4k);}}var button=container[L4k](G4y);if(val&&conf[t13]){button[p6T](conf[t13]);container[M0T](p03);}else{var I4k=H03;I4k+=G03;var n4k=z03;n4k+=m2s;container[n4k](I4k);}conf[V4k][c9c](r83)[P03](w4k,[conf[S4k]]);},enable:function(conf){var v4k=q03;v4k+=i2s;v4k+=J2n;var C4k=l0T;C4k+=s0T;conf[s4y][c9c](r83)[j83](C4k,V5n);conf[v4k]=C5n;},disable:function(conf){var l03="nab";var t4k=Y7n;t4k+=l03;t4k+=x0n;t4k+=J2n;var m4k=v03.l0n;m4k+=y0n;m4k+=I2n;m4k+=s0T;conf[s4y][c9c](r83)[j83](m4k,C5n);conf[t4k]=V5n;},canReturnSubmit:function(conf,node){v03[k5n]();return V5n;}});fieldTypes[p8n]=$[H8n](C5n,{},baseFieldType,{_showHide:function(conf){var h03="Hi";var F03="ntaine";var s03="limi";var D03="_co";var M03="div.limit";var h8n=x0n;h8n+=y0n;h8n+=C9T;h8n+=v03.D0n;var M8n=k0n;M8n+=Z6n;M8n+=R0n;var s8n=s03;s8n+=v03.D0n;var l8n=w7c;l8n+=G3n;l8n+=Q5n;var q8n=s6n;q8n+=a0n;q8n+=a0n;var P8n=M03;P8n+=h03;P8n+=E3n;var z8n=D03;z8n+=F03;z8n+=r9n;var G8n=L6c;G8n+=c6n;G8n+=t6T;if(!conf[G8n]){return;}conf[z8n][c9c](P8n)[q8n](h1T,conf[D4y][l8n]>=conf[s8n]?M8n:I9T);conf[s5c]=conf[h8n]-conf[D4y][w5n];},create:function(conf){var d03="_container";var i03="ton.r";var U03="lic";var T8n=Q8c;T8n+=v03.D0n;T8n+=i03;T8n+=J9n;var J8n=s6n;J8n+=U03;J8n+=p0c;var o8n=c6n;o8n+=j6n;o8n+=t7n;var editor=this;var container=_commonUpload(editor,conf,function(val){var W03="postUpl";var J03="uploadMany";var W8n=o6n;W8n+=A7n;W8n+=v03.i0n;W8n+=x0n;var U8n=O7s;U8n+=R0n;var i8n=W03;i8n+=o03;var F8n=o3c;F8n+=C2n;var D8n=o6n;D8n+=A7n;D8n+=v03.i0n;D8n+=x0n;conf[D4y]=conf[D8n][m8c](val);Editor[J8T][J03][k9T][K1T](editor,conf,conf[D4y]);editor[F8n](i8n,[conf[U8n],conf[W8n]]);},C5n);container[o0T](o8n)[Z6n](J8n,T8n,function(e){var B03="stopPro";var T03="oadMany";var g03="pagat";var c8n=a0n;c8n+=x2n;var E8n=c3c;E8n+=T03;var O8n=v03.H0n;O8n+=v03.G0n;var e8n=o6n;e8n+=A7n;e8n+=v03.i0n;e8n+=x0n;var d8n=y0n;d8n+=v03.l0n;d8n+=q3n;var g8n=X0n;g8n+=v03.D0n;g8n+=v03.i0n;var B8n=B03;B8n+=g03;B8n+=g7c;e[B8n]();var idx=$(this)[g8n](d8n);conf[e8n][V4T](idx,o1n);v03[O8n]();Editor[J8T][E8n][c8n][K1T](editor,conf,conf[D4y]);});conf[d03]=container;return container;},get:function(conf){var u8n=o6n;u8n+=A7n;u8n+=m2c;v03[k5n]();return conf[u8n];},set:function(conf,val){var Q03="_showHide";var u03="pload collections must h";var y03=" an array as a value";var O03="ggerHand";var e03=".editor";var E03="loadMa";var A03='No files';var k03="noFile";var Z03="ave";var c03="ny";var j03='<ul/>';var X03="Tex";var x03="ren";var Y03="an>";var r03="ered";var S8n=I13;S8n+=m2c;var w8n=c3c;w8n+=o03;w8n+=e03;var V8n=v2c;V8n+=y0n;V8n+=O03;V8n+=v1s;var I8n=v03.q0n;I8n+=f2T;var n8n=v03.H0n;n8n+=E6n;n8n+=E03;n8n+=c03;var L8n=D8T;L8n+=r0n;var j8n=g4y;j8n+=v03.H0n;j8n+=v03.D0n;var r8n=o6n;r8n+=A7n;r8n+=v03.i0n;r8n+=x0n;var x8n=v03.H0n;x8n+=v03.G0n;var Z8n=o7y;Z8n+=r9n;Z8n+=r9n;Z8n+=R6n;if(!val){val=[];}if(!$[Z8n](val)){var y8n=L0T;y8n+=u03;y8n+=Z03;y8n+=y03;throw y8n;}v03[x8n]();conf[r8n]=val;var that=this;var container=conf[j8n];if(conf[I0T]){var R8n=x0n;R8n+=w0s;R8n+=v03.D0n;R8n+=r5n;var a8n=V5T;a8n+=x03;a8n+=v03.l0n;a8n+=r03;var f8n=v03.q0n;f8n+=f2T;var rendered=container[f8n](a8n)[B1y]();if(val[R8n]){var K8n=R0n;K8n+=v5n;K8n+=r5n;var list=$(j03)[I2T](rendered);$[K8n](val,function(i,file){var b03='</li>';var K03=' <button class="';var f03="\">&times";var R03="remove\" data-idx=\"";var a03=";</button>";var A8n=f03;A8n+=a03;var Y8n=G5n;Y8n+=R03;var X8n=M3n;X8n+=v03.i0n;X8n+=H2n;X8n+=r0n;var k8n=i4n;k8n+=x0n;k8n+=y0n;k8n+=g4n;var b8n=v03.i0n;b8n+=v03.G0n;v03[b8n]();list[q7T](k8n+conf[I0T](file,i)+K03+that[X8n][T6n][h1s]+Y8n+i+A8n+b03);});}else{var N8n=k03;N8n+=X03;N8n+=v03.D0n;var Q8n=i4n;Q8n+=Q2n;Q8n+=Y03;rendered[q7T](Q8n+(conf[N8n]||A03)+S6y);}}Editor[L8n][n8n][Q03](conf);conf[s4y][I8n](r83)[V8n](w8n,[conf[S8n]]);},enable:function(conf){var N03="nabled";var L03="sable";var t8n=Y7n;t8n+=N03;var m8n=A2n;m8n+=L03;m8n+=v03.l0n;var v8n=y0n;v8n+=A4n;v8n+=a0T;var C8n=v03.q0n;C8n+=y0n;C8n+=k0n;C8n+=v03.l0n;conf[s4y][C8n](v8n)[j83](m8n,V5n);conf[t8n]=C5n;},disable:function(conf){var P1n=q03;P1n+=i2s;P1n+=J2n;var z1n=E6n;z1n+=r7n;z1n+=E6n;var G1n=x0T;G1n+=v03.H0n;G1n+=v03.D0n;var H1n=v03.q0n;H1n+=y0n;H1n+=w0T;var p1n=v03.H0n;p1n+=v03.G0n;v03[p1n]();conf[s4y][H1n](G1n)[z1n](c9y,C5n);conf[P1n]=V5n;},canReturnSubmit:function(conf,node){var q1n=v03.H0n;q1n+=v03.G0n;v03[q1n]();return V5n;}});}());if(DataTable[V0n][l1n]){var M1n=R0n;M1n+=q3n;M1n+=v03.D0n;var s1n=R0n;s1n+=y3s;s1n+=Q7n;s1n+=v03.l0n;$[s1n](Editor[J8T],DataTable[M1n][n03]);}DataTable[V0n][h1n]=Editor[J8T];Editor[D1n]={};Editor[a1T][F1n]=i1n;Editor[I03]=U1n;return Editor;}));

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = "<h3>"+i18nDefaults.create.title+"</h3>";
i18nDefaults.edit.title = "<h3>"+i18nDefaults.edit.title+"</h3>";
i18nDefaults.remove.title = "<h3>"+i18nDefaults.remove.title+"</h3>";

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn btn-default",
		"buttonInternal": "btn btn-default"
	},
	"field": {
		"wrapper": "DTE_Field",
		"label":   "col-lg-4 control-label",
		"input":   "col-lg-8 controls",
		"error":   "error has-error",
		"msg-labelInfo": "help-block",
		"msg-info":      "help-block",
		"msg-message":   "help-block",
		"msg-error":     "help-block",
		"multiValue":    "well well-sm multi-value",
		"multiInfo":     "small",
		"multiRestore":  "well well-sm multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

var self;

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		// init can be called multiple times (one for each Editor instance), but
		// we only support a single construct here (shared between all Editor
		// instances)
		if ( ! self._dom.content ) {
			self._dom.content = $(
				'<div class="modal fade DTED">'+
					'<div class="modal-dialog">'+
						'<div class="modal-content"/>'+
					'</div>'+
				'</div>'
			);

			self._dom.close = $('<button class="close">&times;</div>');
			self._dom.modalContent = self._dom.content.find('div.modal-content');

			self._dom.close.click( function () {
				self._dte.close('icon');
			} );

			$(document).on('click', 'div.modal', function (e) {
				if ( $(e.target).hasClass('modal') && self._shown ) {
					self._dte.background();
				}
			} );
		}

		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );
			} );
		} );

		return self;
	},

	"open": function ( dte, append, callback ) {
		if ( self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		self._shown = true;

		var content = self._dom.modalContent;
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).prepend( self._dom.close );

		$(self._dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( self._dte.s.setFocus ) {
					self._dte.s.setFocus.focus();
				}

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				self._shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );
	},

	"close": function ( dte, callback ) {
		if ( !self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		$(self._dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		self._dte = dte;
		self._shown = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return self._dom.content[0];
	},


	/*
	 * Private properties
	 */
	 "_shown": false,
	"_dte": null,
	"_dom": {}
} );

self = DataTable.Editor.display.bootstrap;


return DataTable.Editor;
}));


/*! Buttons for DataTables 1.5.6
 * ©2016-2019 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className )
					.attr( 'role', 'menu' ) ;
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var tag = config.tag || buttonDom.tag;
		var clickBlurs = config.clickBlurs === undefined ? true : config.clickBlurs
		var button = $('<'+tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}
				if( clickBlurs ) {
					button.blur();
				}
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		// Button tags should have `type=button` so they don't have any default behaviour
		if ( tag.toLowerCase() === 'button' ) {
			button.attr( 'type', 'button' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if( this.c.buttonCreated ) {
			inserter = this.c.buttonCreated( config, inserter );
		}

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.insertAfter( insertPoint )
			.stop()
			.fadeIn( fade );
	}
	else {
		$('div.'+className)
			.stop()
			.fadeOut( fade, function () {
				$(this)
					.removeClass( className )
					.remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			// Flash buttons will not work with `<button>` in IE - it has to be `<a>`
			tag: 'ActiveXObject' in window ?
				'a' :
				'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.5.6';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			var close = function () {
				dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes().each( function() {
					var collection = $(this).siblings('.dt-button-collection');

					if ( collection.length ) {
						collection.stop().fadeOut( config.fade, function () {
							collection.detach();
						} );
					}

					$(this).attr( 'aria-expanded', 'false' );
				});

				$('div.dt-button-background').off( 'click.dtb-collection' );
				Buttons.background( false, config.backgroundClassName, config.fade, insertPoint );

				$('body').off( '.dtb-collection' );
				dt.off( 'buttons-action.b-internal' );
			};

			var wasExpanded = button.attr( 'aria-expanded' ) === 'true';

			close();

			if (!wasExpanded) {
				var host = button;
				var collectionParent = $(button).parents('div.dt-button-collection');
				var hostPosition = host.position();
				var tableContainer = $( dt.table().container() );
				var multiLevel = false;
				var insertPoint = host;

				button.attr( 'aria-expanded', 'true' );

				// Remove any old collection
				if ( collectionParent.length ) {
					multiLevel = $('.dt-button-collection').position();
					insertPoint = collectionParent;
					$('body').trigger( 'click.dtb-collection' );
				}

				if ( insertPoint.parents('body')[0] !== document.body ) {
					insertPoint = document.body.lastChild;
				}

				config._collection.find('.dt-button-collection-title').remove();
				config._collection.prepend('<div class="dt-button-collection-title">'+config.collectionTitle+'</div>');

				config._collection
					.addClass( config.collectionLayout )
					.css( 'display', 'none' )
					.insertAfter( insertPoint )
					.stop()
					.fadeIn( config.fade );

				var position = config._collection.css( 'position' );

				if ( multiLevel && position === 'absolute' ) {
					config._collection.css( {
						top: multiLevel.top,
						left: multiLevel.left
					} );
				}
				else if ( position === 'absolute' ) {
					config._collection.css( {
						top: hostPosition.top + host.outerHeight(),
						left: hostPosition.left
					} );

					// calculate overflow when positioned beneath
					var tableBottom = tableContainer.offset().top + tableContainer.height();
					var listBottom = hostPosition.top + host.outerHeight() + config._collection.outerHeight();
					var bottomOverflow = listBottom - tableBottom;

					// calculate overflow when positioned above
					var listTop = hostPosition.top - config._collection.outerHeight();
					var tableTop = tableContainer.offset().top;
					var topOverflow = tableTop - listTop;

					// if bottom overflow is larger, move to the top because it fits better, or if dropup is requested
					if (bottomOverflow > topOverflow || config.dropup) {
						config._collection.css( 'top', hostPosition.top - config._collection.outerHeight() - 5);
					}

					// Right alignment is enabled on a class, e.g. bootstrap:
					// $.fn.dataTable.Buttons.defaults.dom.collection.className += " dropdown-menu-right"; 
					if ( config._collection.hasClass( config.rightAlignClassName ) ) {
						config._collection.css( 'left', hostPosition.left + host.outerWidth() - config._collection.outerWidth() );
					}

					// Right alignment in table container
					var listRight = hostPosition.left + config._collection.outerWidth();
					var tableRight = tableContainer.offset().left + tableContainer.width();
					if ( listRight > tableRight ) {
						config._collection.css( 'left', hostPosition.left - ( listRight - tableRight ) );
					}

					// Right alignment to window
					var listOffsetRight = host.offset().left + config._collection.outerWidth();
					if ( listOffsetRight > $(window).width() ) {
						config._collection.css( 'left', hostPosition.left - (listOffsetRight-$(window).width()) );
					}
				}
				else {
					// Fix position - centre on screen
					var top = config._collection.height() / 2;
					if ( top > $(window).height() / 2 ) {
						top = $(window).height() / 2;
					}

					config._collection.css( 'marginTop', top*-1 );
				}

				if ( config.background ) {
					Buttons.background( true, config.backgroundClassName, config.fade, insertPoint );
				}

				// Need to break the 'thread' for the collection button being
				// activated by a click - it would also trigger this event
				setTimeout( function () {
					// This is bonkers, but if we don't have a click listener on the
					// background element, iOS Safari will ignore the body click
					// listener below. An empty function here is all that is
					// required to make it work...
					$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

					$('body')
						.on( 'click.dtb-collection', function (e) {
							// andSelf is deprecated in jQ1.8, but we want 1.7 compat
							var back = $.fn.addBack ? 'addBack' : 'andSelf';

							if ( ! $(e.target).parents()[back]().filter( config._collection ).length ) {
								close();
							}
						} )
						.on( 'keyup.dtb-collection', function (e) {
							if ( e.keyCode === 27 ) {
								close();
							}
						} );

					if ( config.autoClose ) {
						dt.on( 'buttons-action.b-internal', function () {
							close();
						} );
					}
				}, 10 );
			}
		},
		background: true,
		collectionLayout: '',
		collectionTitle: '',
		backgroundClassName: 'dt-button-background',
		rightAlignClassName: 'dt-button-right',
		autoClose: false,
		fade: 400,
		attr: {
			'aria-haspopup': true
		}
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = $.trim( filename.replace( '*', $('head > title').text() ) );
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		},
		customizeData: null
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		// Always remove comments
		str = str.replace( /<!\-\-.*?\-\->/g, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		footer: footer,
		body:   body
	};

	if ( config.customizeData ) {
		config.customizeData( data );
	}

	return data;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

function _init ( settings ) {
	var api = new DataTable.Api( settings );
	var opts = api.init().buttons || DataTable.defaults.buttons;

	return new Buttons( api, opts ).container();
}

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: _init,
	cFeature: "B"
} );

// DataTables 2 layout feature
if ( DataTable.ext.features ) {
	DataTable.ext.features.register( 'buttons', _init );
}


return Buttons;
}));


/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group'
		},
		button: {
			className: 'btn btn-default'
		},
		collection: {
			tag: 'ul',
			className: 'dt-button-collection dropdown-menu',
			button: {
				tag: 'li',
				className: 'dt-button',
				active: 'active',
				disabled: 'disabled'
			},
			buttonLiner: {
				tag: 'a',
				className: ''
			}
		}
	}
} );

DataTable.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="caret"/>');
};


return DataTable.Buttons;
}));


/*! Select for DataTables 1.3.0
 * 2015-2018 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.3.0
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.3.0';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}
		else {
			style = 'os';
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + dt.table().node().id );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;
	var matchSelection;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}

			if ( window.getSelection ) {
				matchSelection = window.getSelection();
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( matchSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( selection !== matchSelection ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];
			var wrapperClass = $.trim(dt.settings()[0].oClasses.sWrapper).replace(/ +/g, '.');

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.'+wrapperClass)[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + dt.table().node().id, function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


