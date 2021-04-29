<!--
	https://codepen.io/diomed/pen/oNvMYgj
	https://datatables.net/
 -->

<table id={id} class="stripe hover" style="width:100%; padding-top: 1em;  padding-bottom: 1em;">
</table>

<script>
import * as Debug from 'debug'
const debug = Debug('components:dataTable')
debug.log = console.log.bind(console) // don't forget to bind to console!

import jquery from 'jquery'
import dt from 'datatables.net'
import 'datatables.net-responsive/js/dataTables.responsive.js'
import 'datatables.net-dt/css/jquery.dataTables.css'



export let id = 'dataTable'
export let dataSet = []
export let options = {
	// data: [],
	columns: [
		{ title: 'id' },
	],
	'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']]
}
export let groupColumn = undefined

let table = undefined
$: if (dataSet.length > 0 && table !== undefined) {
	table.clear()
	table.rows.add(dataSet)
	table.draw()
}

import { onMount } from 'svelte'

onMount(async () => {

	// jquery(document).ready(function () {
		table = jquery('#' + id).DataTable(options).columns.adjust()
		if(options.responsive === true)
			table.responsive.recalc()
			// .responsive.recalc()
	// })

	if(groupColumn !== undefined){
		// Order by the grouping
		jquery('#' + id).on('click', 'tr.group', function () {
			let currentOrder = table.order()[0]
			if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
				table.order([ groupColumn, 'desc' ]).draw()
			} else {
				table.order([ groupColumn, 'asc' ]).draw()
			}
		})
	}

});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style global type="text/postcss">
tr.group,
tr.group:hover {
	background-color: #d2d6dc !important; /** #8da2fb **/
}

/* Overrides to match the Tailwind CSS */

.dataTables_wrapper {
	padding-top: 0.25rem;
	padding-bottom: 0.25rem
}

table.dataTable.no-footer {
	border-bottom-width: 1px;
	border-color: #d2d6dc
}

/* table.dataTable tbody td, table.dataTable tbody th {
	padding: 0.75rem 1rem;
	border-bottom-width: 1px;
	border-color: #d2d6dc
} */

div.dt-buttons {
	padding: 1rem 1rem 1rem 0;
	display: flex;
	align-items: center
}

.dataTables_filter, .dataTables_info {
	padding: 1rem
}

.dataTables_wrapper .dataTables_paginate {
	padding: 1rem
}

.dataTables_wrapper .dataTables_filter label input {
	padding: 0.5rem;
	/* border-width: 2px; */
	border-radius: 0.5rem;
	background-color: #edf2f7;
}

.dataTables_wrapper .dataTables_filter label input:focus {
	box-shadow: 0 0 0 3px rgba(118, 169, 250, 0.45);
	outline: 0;
}

table.dataTable thead tr {
	border-radius: 0.5rem
}

/* table.dataTable thead tr th:not(.text-center) {
	text-align: left
} */

table.dataTable thead tr th {
	background-color: #edf2f7;
	border-bottom-width: 2px;
	border-top-width: 1px;
	border-color: #d2d6dc
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.next:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.previous:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button:not(.disabled), button.dt-button {
	transition-duration: 150ms;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: #374151 !important;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	font-size: 0.75rem;
	font-weight: 600;
	align-items: center;
	display: inline-flex;
	border-width: 1px !important;
	border-color: #d2d6dc !important;
	border-radius: 0.375rem;
	background: #ffffff;
	overflow: visible;
	margin-bottom: 0
}

.dataTables_wrapper .dataTables_paginate .paginate_button.next:focus:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.next:hover:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.previous:focus:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button.previous:hover:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button:focus:not(.disabled), .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.disabled), button.dt-button:focus, button.dt-button:focus:not(.disabled), button.dt-button:hover, button.dt-button:hover:not(.disabled) {
	background-color: #edf2f7 !important;
	border-width: 1px !important;
	border-color: #d2d6dc !important;
	color: #374151 !important
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current:not(.disabled) {
	background: #6875f5 !important;
	color: #ffffff !important;
	border-color: #8da2fb !important
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover, .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
	background-color: #8da2fb !important;
	color: #ffffff !important;
	border-color: #8da2fb !important
}

.dataTables_wrapper .dataTables_length select {
	/* padding: .25rem; */
	/* border-radius: .25rem; */
	/* background-color: #edf2f7; */
	color: #4a5568; 			/*text-gray-700*/
	padding-left: 1rem; 		/*pl-4*/
	padding-right: 1rem; 		/*pl-4*/
	padding-top: .5rem; 		/*pl-2*/
	padding-bottom: .5rem; 		/*pl-2*/
	line-height: 1.25; 			/*leading-tight*/
	border-width: 2px; 			/*border-2*/
	border-radius: .25rem;
	border-color: #edf2f7; 		/*border-gray-200*/
	background-color: #edf2f7; 	/*bg-gray-200*/
}

.dataTables_wrapper .dataTables_length {
	padding-top: 1.25rem;
}

/* .dt-body-center {
	text-align: center;
}

.dt-head-center {
	text-align: center;
}

.dt-center {
	text-align: center;
} */
</style>
