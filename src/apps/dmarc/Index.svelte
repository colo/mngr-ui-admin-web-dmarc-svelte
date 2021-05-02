<div class="container mx-auto py-6 px-4">
<!-- https://tailwindcomponents.com/component/pure-css-dropdown-using-focus-within-with-animation -->
<!-- <section class="text-gray-600 body-font"> -->
<div class="container  mx-auto flex items-center md:flex-row flex-col">
  <!-- <div class="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
    <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
    <h1 class="md:text-3xl text-2xl font-medium title-font text-gray-900">Master Cleanse Reliac Heirloom</h1>
  </div> -->
	<!-- {@debug yes} -->
	<!-- {Object.keys(filters.host)}
	{Object.values(filters.host)} -->
	<!-- {@debug filters}
	<ul>
	  {#each filters.host as host}
	    <li>{host}</li>
	  {/each}
	</ul>
	{Object.keys(filters)}
	{Object.values(filters)}
	{filters.host}
	Hosts: { (filters.host.length === 0 ) ? 'All' : filters.host.join(',')}
	Domains: { (filters.domain.length === 0 ) ? 'All' : filters.domain.join(',')} -->
	<!-- Min: { datePickerMinDate } -->
  <div class="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">

		<div class="z-50 relative inline-block text-left dropdown">
			<span class="rounded-md shadow-sm">
			<button class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
				<span>Domains</span>
				<svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
			</button>
			</span>

			<div class="invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
				<div class="bg-white bg-opacity-100 absolute right-0 w-56 mt-2 origin-top-right border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
					<div class="px-4 py-3">
						<!-- <p class="text-sm leading-5">Signed in as</p>
						<p class="text-sm font-medium leading-5 text-gray-900 truncate">tom@example.com</p> -->
						<!-- <div class="form-control"> -->
						{#each domains as domain}
							<label class="cursor-pointer label">
								<span class="label-text">{domain}</span>
								<div>
									<input class="checkbox checkbox-primary" type=checkbox bind:checked={filters.domain[domain]}>
									<span class="checkbox-mark"></span>
								</div>
							</label>
						{/each}
						<!-- </div> -->
					</div>
					<!-- <div class="py-1">
						<a href="javascript:void(0)" tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
						<a href="javascript:void(0)" tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Support</a>
						<span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed" aria-disabled="true">New feature (soon)</span>
						<a href="javascript:void(0)" tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >License</a>
					</div>
					<div class="py-1">
						<a href="javascript:void(0)" tabindex="3" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Sign out</a>
					</div> -->
				</div>
			</div>
		</div>

		<div class="z-50 relative inline-block text-left dropdown">
			<span class="rounded-md shadow-sm">
			<button class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
				<span>Hosts</span>
				<svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
			</button>
			</span>
			<div class="invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
				<div class="bg-white bg-opacity-100 absolute right-0 w-56 mt-2 origin-top-right border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
					<div class="px-4 py-3">
						<!-- <p class="text-sm leading-5">Signed in as</p>
						<p class="text-sm font-medium leading-5 text-gray-900 truncate">tom@example.com</p> -->
						<!-- <div class="form-control"> -->
						{#each hosts as host}
							<label class="cursor-pointer label">
								<span class="label-text">{host}</span>
								<div>
									<input class="checkbox checkbox-primary" type=checkbox bind:checked={filters.host[host]}>
									<span class="checkbox-mark"></span>
								</div>
							</label>
						{/each}
						<!-- </div> -->
					</div>
					<!-- <div class="py-1">
						<a href="javascript:void(0)" tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
						<a href="javascript:void(0)" tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Support</a>
						<span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed" aria-disabled="true">New feature (soon)</span>
						<a href="javascript:void(0)" tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >License</a>
					</div>
					<div class="py-1">
						<a href="javascript:void(0)" tabindex="3" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Sign out</a>
					</div> -->
				</div>
			</div>
		</div>
		<div class="z-50 relative inline-block text-left dropdown">
			<span class="rounded-md shadow-sm">
			<label>
				<input
					id="flatpickr"
					class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117"
				>
			</label>
				<!-- <Flatpickr
					name="date"
					bind:value={date}
					bind:formattedValue={formattedValue}
					options="{{
						minDate: datePickerMinDate,
						maxDate: 'today',
						mode: 'range',
						defaultDate: [roundHours(Date.now()- DAY), roundHours(Date.now())]
					}}"
					on:change="{setDates}"
					class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
				</Flatpickr> -->
			</span>
		</div>
    <!-- <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
        <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
      </svg>
      <span class="ml-4 flex items-start flex-col leading-none">
        <span class="text-xs text-gray-600 mb-1">GET IT ON</span>
        <span class="title-font font-medium">Google Play</span>
      </span>
    </button>
    <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
        <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
        <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
      </svg>
      <span class="ml-4 flex items-start flex-col leading-none">
        <span class="text-xs text-gray-600 mb-1">Download on the</span>
        <span class="title-font font-medium">App Store</span>
      </span>
    </button> -->
  </div>
</div>
<!-- </section> -->
{#if ds && ds.report_id === undefined}
	<div class="grid grid-cols-3 gap-4">
		<div class="card shadow-lg">
			<!-- <figure>
			</figure> -->
			<div class="card-body">
				<Chart
					type="tabular"
					id="domainsPieFrappe"
					wrapper="{domainsPieWrapper}"
					config="{Object.clone(frappePieConfig)}"
					dataset="{{
						/* length: 1, */
						numeric: false,
						data: domainsPieDatasetsTabular,
					}}"
					buffer="{false}"

				>
				</Chart>
				<h2 class="card-title">Domains
					<div class="badge mx-2 badge-primary">{ formatMinStats(total_domains_count) }</div>
				</h2>
			</div>
		</div>

		<div class="card shadow-lg">
			<!-- <figure>
			</figure> -->
			<div class="card-body">
				<Chart
					id="hostsPieFrappe"
					wrapper="{hostsPieWrapper}"
					config="{Object.clone(frappePieConfig)}"
					dataset="{{
						length: 1,
						numeric: false,
						data: hostsPieDatasets,
					}}"
					buffer="{false}"
				>
				</Chart>
				<h2 class="card-title">Hosts
					<div class="badge mx-2 badge-primary">{ formatMinStats(total_hosts_count) }</div>
				</h2>
			</div>
		</div>

		<div class="card shadow-lg">
			<!-- <figure>
			</figure> -->
			<div class="card-body">
				<Chart
					id="dispositionPieFrappe"
					wrapper="{dispositionPieWrapper}"
					config="{Object.clone(frappePieConfig)}"
					dataset="{{
						length: 1,
						numeric: false,
						data: dispositionDatasets,
					}}"
					buffer="{false}"
				>
				</Chart>
				<h2 class="card-title">Total dispositions
				<div class="badge mx-2 badge-primary">{ formatMinStats(total_diposition_count) }</div>
				</h2>
			</div>
		</div>
	</div>
		<div class="card">
			<div class="card-body">
				<div class="flex flex-wrap -m-4 text-center">
					<div class="p-3 sm:w-1/3 w-1/2">
						<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">{dmarc_data.length}</h2>
						<p class="leading-relaxed">Reports</p>
					</div>
					<div class="p-3 sm:w-1/3 w-1/2">
						<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">{ formatMinStats(total_records_count) }</h2>
						<p class="leading-relaxed">Records count</p>
					</div>
					<div class="p-3 sm:w-1/3 w-1/2">
						<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">{ formatMinStats(total_ips_count) }</h2>
						<p class="leading-relaxed">IPs count</p>
					</div>
					<!-- <div class="p-4 sm:w-1/4 w-1/2">
						<h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">4</h2>
						<p class="leading-relaxed">Products</p>
					</div> -->
				</div>
			</div>
		</div>
{:else}
	<div class="card shadow-lg">
		<div class="card-body">
			<div class="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">
			<button class="btn btn-ghost btn-circle" on:click="{setReportID}">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
				<!-- <button class="btn btn-circle btn-xs" on:click="{setReportID}">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button> -->
			</div>
			<div class="md:p-8 p-6 bg-white flex justify-between dark:bg-gray-800 md:items-center md:flex-row flex-col gap-12">
				<div>
					<span class="text-bold text-gray-700 dark:text-gray-400 block">
						{report_email}
					</span>
					<span class="text-yellow-500 text-4xl md:text-4xl mt-2 font-black block">
						{report_org}
					</span>
				</div>
				<div class="self-end">
					<div class="md:text-right text-left md:block">
						<p class="text-info text-xl md:mb-2 mb-0 dark:text-gray-100 flex items-center increase">
							<!-- <svg width="20" height="20" fill="currentColor" class="h-6 w-6 text-red-500 mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
							<path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
							</path>
							</svg> -->
							{report_domain}
						</p>
					</div>
					<p class="text-lg text-gray-600 md:text-right text-left dark:text-gray-400 md:block inline-block md:mb-0">
						{ report_policy }
					</p>
				</div>
			</div>

			<DataTable id="reportTable" options={reportTableOptions} dataSet={reportTableData} />
			<div id="JsonViewer">
			</div>
		</div>
	</div>
{/if}
	<div class="card shadow-lg">
		<div class="card-body">
			<DataTable id="rangeReportsTable" options={tableOptions} dataSet={tableData} groupColumn={0}/>
		</div>
	</div>

	<!-- <frappe-charts-wrapper
		:options="{
			title: 'My Awesome Chart',
			data: {
				labels: domainsPieLabels,
				datasets: []
			},
			type: 'percentage', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
			height: 250,
		}"
		:datasets="domainsPieDatasets"
	/> -->

	<!-- {{dmarc}} -->
	<!-- <button class="btn btn-primary">DaisyUI Button</button>
	<ul>
		<li v-for="(report, index) in dmarc_data" :key="index">
			{{index + 1}}: {{report.metadata.domain}} : {{report.metadata.host}}
		</li>
	</ul> -->
</div>
<!-- <button class="btn btn-primary">DaisyUI Button</button>

<ul >
	{#each dmarc_data as { data, metadata }, i}
		<li>
			{i + 1}: {metadata.domain} : {metadata.host}
		</li>
	{/each}
</ul> -->


<script>
// import Flatpickr from '@components/Flatpickr';
// let datePicker
import JsonViewer from 'json-viewer-js'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
// import { Flatpickr } from 'svelte-flatpickr'
// import { flatpickr } from 'svelte-flatpickr'

// let datePicker = flatpickr(document.getElementById('flatpickr'))

// let date = undefined
// let formattedValue = undefined
// let datePickerMinDate = 0

// import { tick } from 'svelte'
// const Moo = require('mootools')

import * as Debug from 'debug'
const debug = Debug('App')
debug.log = console.log.bind(console) // don't forget to bind to console!

import dashboard from '@mixins/dashboard.js'
// import dataSource from '@mixins/dataSources.js'
import JSPipeline from '../../../modules/js-pipeline'
// import Pipeline from '@apps/dmarc/pipelines/periodical'
import Pipeline from '@libs/pipelines'
import InputIO from '@libs/pipelines/input/io'
// import InputIO from '@libs/pipelines/input/graphql.io'
import IO from '@libs/pipelines/default.io'
// import IO from '@libs/pipelines/default.graphql.io'
import DocIDFilter from '@libs/pipelines/filters/doc_id'
import OutputEventbus from '@libs/pipelines/output/eventbus'

import { global as EventBus } from '@libs/eventbus'

import { requests, store } from './sources/index'
import {SECOND, MINUTE, HOUR, DAY, WEEK} from '@libs/time/const'
import {roundMilliseconds, roundSeconds, roundMinutes, roundHours} from '@libs/time/round'

// let dmarc = []
let dmarc_data = []
let dmarc_info = []

import {router} from '@spaceavocado/svelte-router'

let setReportID = function (id) {
	id = (id === undefined || id.target) ? '' : id
	debug('setReportID', id)

	$router.replace({ query: { ...$router.currentRoute.query, report_id: id}}) //.catch(err => { debug('setDates', err) })

	if (ds !== undefined) { ds.report_id = (id === '') ? undefined : id }

	if (id !== undefined && ds !== undefined) {
		ds.pipelines[ds.id].fireEvent('onOnce')
	}
}

let setHosts = function () {
	debug('setHosts', $router.currentRoute.query.host)
  let query_host = ($router.currentRoute.query.host) ? JSON.parse(JSON.stringify($router.currentRoute.query.host)) : ''
  // let filter_host = JSON.parse(JSON.stringify(filters.host))
	let filter_host = Object.keys(Object.filter(filters.host, function(value, key){
    return value === true;
	}))

	debug('filters.host setHosts',
    filter_host,
    query_host,
    (!Array.isArray(query_host)),
    (Array.isArray(query_host) && (query_host.every(function (item) { return filter_host.contains(item) }) !== true || filter_host.every(function (item) { return query_host.contains(item) }) !== true))
  )
  if (
    !query_host ||
		(!Array.isArray(query_host) && (filter_host.length > 1 || !filter_host.contains(query_host))) === true ||
		(Array.isArray(query_host) &&
		(query_host.every(function (item) { return filter_host.contains(item) }) !== true || filter_host.every(function (item) { return query_host.contains(item) }) !== true))
  ) {
    $router.replace({ query: { ...$router.currentRoute.query, host: filter_host}}) //.catch(err => { debug('setHosts', err) })
    ds.pipelines[ds.id].fireEvent('onOnce')
    // ds.destroy_pipelines()
    // ds.create_pipelines()
  }

  // this.filters_debounce.host.ts = Date.now()
  if (filters_debounce.host !== undefined) {
    clearTimeout(filters_debounce.host)
    filters_debounce.host = undefined
    // this.filters_debounce.host.ts = 0
  }
}
let setDomains = function () {
	debug('setDomains', $router.currentRoute.query.domain)
  let query_domain = ($router.currentRoute.query.domain) ? JSON.parse(JSON.stringify($router.currentRoute.query.domain)) : ''
  // let filter_domain = JSON.parse(JSON.stringify(filters.domain))
	let filter_domain = Object.keys(Object.filter(filters.domain, function(value, key){
    return value === true;
	}))

	debug('filters.domain setDomains',
    filter_domain,
    query_domain,
    (!Array.isArray(query_domain)),
    (Array.isArray(query_domain) && (query_domain.every(function (item) { return filter_domain.contains(item) }) !== true || filter_domain.every(function (item) { return query_domain.contains(item) }) !== true))
  )
  if (
    !query_domain ||
		(!Array.isArray(query_domain) && (filter_domain.length > 1 || !filter_domain.contains(query_domain))) === true ||
		(Array.isArray(query_domain) &&
		(query_domain.every(function (item) { return filter_domain.contains(item) }) !== true || filter_domain.every(function (item) { return query_domain.contains(item) }) !== true))
  ) {
    $router.replace({ query: { ...$router.currentRoute.query, domain: filter_domain}}) //.catch(err => { debug('setDomains', err) })
    ds.pipelines[ds.id].fireEvent('onOnce')
    // ds.destroy_pipelines()
    // ds.create_pipelines()
  }

  // this.filters_debounce.domain.ts = Date.now()
  if (filters_debounce.domain !== undefined) {
    clearTimeout(filters_debounce.domain)
    filters_debounce.domain = undefined
    // this.filters_debounce.domain.ts = 0
  }
}

let formatMinStats = function (val) {
  if (val > 1000) {
    val = '+' + Math.round(val / 1000) + 'K'
  } else if (val > 1000000) {
    val = '+' + Math.round(val / 1000000) + 'M'
  }
  return val
}

import Chart from '@components/chart'
import frappeChartsWrapper from '@components/wrappers/frappeCharts'
import frappeChartsConfig from '../../../modules/mngr-ui-admin-charts/defaults/frappeCharts'

let frappePieConfig = Object.merge(Object.clone(frappeChartsConfig), {
  interval: 1,
  watch: {
    skip: 0
  },

  options: {
    /* title: 'My Awesome Chart', */
    data: {
    },
    type: 'percentage', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
    maxSlices: 6,
    /* height: 400, */
    /* colors: ['#7cd6fd', '#743ee2'] */
  }

})

import DataTable from '@components/dataTable'
import jquery from 'jquery'

let filters_debounce = {
	domain: undefined,
	host: undefined,
}
let filters = {
	domain: {},
	host: {}
}

let old_filters = {
	domain: {},
	host: {}
}

// let report_id = undefined
// let report = undefined

let hosts = []
let domains = []
let total_domains_count = 0
let total_hosts_count = 0
let total_diposition_count = 0
let total_records_count = 0
let total_ips = []
let total_ips_count = 0
let domainsPieDatasetsTabular = []
let domainsPieLabels = []

let hostsPieDatasets = undefined
let dispositionDatasets = undefined
let tableData = []
let domainsPieWrapper = {
	type: frappeChartsWrapper,
	props: {}
}

let hostsPieWrapper = {
	type: frappeChartsWrapper,
	props: { }
}

let dispositionPieWrapper = {
	type: frappeChartsWrapper,
	props: {}
}
// let frappePieConfig = Object.merge(Object.clone(frappeChartsConfig), {
//   interval: 1,
//   watch: {
//     skip: 0
//   },
//
//   options: {
//     /* title: 'My Awesome Chart', */
//     data: {
//     },
//     type: 'donut', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
//     maxSlices: 6,
//     /* height: 400, */
//     /* colors: ['#7cd6fd', '#743ee2'] */
//   }
//
// }),

$: if(filters.host && JSON.stringify(filters.host) !== JSON.stringify(old_filters.host)) {// && old_filters.host
	// let _hosts = [...filters.host]
	debug('filters.host', filters.host,  JSON.stringify(filters.host), JSON.stringify(old_filters.host))
	if (filters_debounce.host !== undefined) clearTimeout(filters_debounce.host)
	filters_debounce.host = setTimeout(setHosts, 500)

	old_filters.host = JSON.parse(JSON.stringify(filters.host))
}

$: if(filters.domain && JSON.stringify(filters.domain) !== JSON.stringify(old_filters.domain)) {// && old_filters.domain
	// let _domains = [...filters.domain]
	debug('filters.domain', filters.domain,  JSON.stringify(filters.domain), JSON.stringify(old_filters.domain))
	if (filters_debounce.domain !== undefined) clearTimeout(filters_debounce.domain)
	filters_debounce.domain = setTimeout(setDomains, 500)

	old_filters.domain = JSON.parse(JSON.stringify(filters.domain))
}

$: if(dmarc_info.length > 0 ) {
	debug('dmarc_info', dmarc_info)
	hosts = []
	domains = []
  let count_domains = {}
  let count_hosts = {}
  let count_disposition = {none: 0, quarantine: 0, reject: 0}
  // this.total_records_count = 0
  // this.total_ips = []

  Array.each(dmarc_info, function (row) {
    let domain = row.metadata.domain
    let host = row.metadata.host

    // count_disposition.none += (row.data.records && row.data.records.none) ? row.data.records.none.length : 0
    // count_disposition.quarantine += (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0
    // count_disposition.reject += (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0
    //
    // Object.each(row.data.records, function (disposition) {
    //   Array.each(disposition, function (record) {
    //     this.total_records_count += record.count
    //     this.total_ips.combine([ record.ip])
    //   }.bind(this))
    // }.bind(this))

    if (!count_domains[domain]) count_domains[domain] = 0
    count_domains[domain]++
    // this.domainsPieLabels.combine([domain])

    if (host && host !== undefined && host !== null) {
      if (!count_hosts[host]) count_hosts[host] = 0
      count_hosts[host]++
      // this.hostsPieLabels.combine([host])
    }
  })

  // this.total_diposition_count += count_disposition.none + count_disposition.quarantine + count_disposition.reject

  hosts = Object.keys(count_hosts)

  domains = Object.keys(count_domains)
}

$: if(dmarc_data.length > 0 ) {
	let data = []
	let count_domains = {}
  let count_hosts = {}
  let count_disposition = {none: 0, quarantine: 0, reject: 0}
	total_records_count = 0
	total_ips = []
	domainsPieLabels =[]

  Array.each(dmarc_data, function (row, index) {
		let domain = row.metadata.domain
    let host = row.metadata.host

		count_disposition.none += (row.data.records && row.data.records.none) ? row.data.records.none.length : 0
    count_disposition.quarantine += (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0
    count_disposition.reject += (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0

    Object.each(row.data.records, function (disposition) {
      Array.each(disposition, function (record) {
        total_records_count += record.count
        total_ips.combine([ record.ip])
      })
    })

		if (!count_domains[domain]) count_domains[domain] = 0

		count_domains[domain]++
    domainsPieLabels.combine([domain])

    if (host && host !== undefined && host !== null) {
      if (!count_hosts[host]) count_hosts[host] = 0
      count_hosts[host]++
      // hostsPieLabels.combine([host])
    }
		//table data
    let _data = Object.merge(row.metadata, {
      none: (row.data.records && row.data.records.none) ? row.data.records.none.length : 0,
      quarantine: (row.data.records && row.data.records.quarantine) ? row.data.records.quarantine.length : 0,
      reject: (row.data.records && row.data.records.reject) ? row.data.records.reject.length : 0
    })

    data.push(_data)
  })

	total_ips_count = total_ips.length
	total_diposition_count += count_disposition.none + count_disposition.quarantine + count_disposition.reject
  total_hosts_count = Object.keys(count_hosts).length
  total_domains_count = Object.keys(count_domains).length

  domainsPieLabels.sort()
  // hostsPieLabels.sort()

  let domains_dataset = []
  Array.each(domainsPieLabels, function (domain) {
    domains_dataset.push(count_domains[domain])
  })
  // domainsPieDatasets = [{values: domains_dataset}]
  domainsPieDatasetsTabular = domains_dataset // [{values: domains_dataset}]

  // let hosts_dataset = []
  // Array.each(hostsPieLabels, function (host) {
  //   // hostsPieDatasets
  //   hosts_dataset.push(count_hosts[host])
  // })

  hostsPieDatasets = [count_hosts]
  dispositionDatasets = [count_disposition]
  // hostsPieDatasets = [{values: hosts_dataset}]
  // hostsPieDatasetsTabular = hosts_dataset // [{values: hosts_dataset}]

  debug('dmarc_data domains', domainsPieLabels, count_domains, domains_dataset, total_ips)
  debug('computed tableData', dmarc_data, data)

	domainsPieWrapper = {
		type: frappeChartsWrapper,
		props: Object.merge({ options: Object.clone(frappePieConfig.options) }, {options: { data: { labels: domainsPieLabels } }})
	}

	hostsPieWrapper = {
		type: frappeChartsWrapper,
		props: { options: Object.clone(frappePieConfig.options) }
	}

	dispositionPieWrapper = {
		type: frappeChartsWrapper,
		props: { options: Object.merge(Object.clone(frappePieConfig.options), { colors: ['#31C4DD', '#FCB10E', '#FE7289'] }) }
	}
  tableData = data
}



import { format } from 'date-fns'
import { es } from 'date-fns/locale'

let report_policy =  ''
let report_domain =  ''
let report_email =  ''
let report_org =  ''
let reportTableData =  []
let reportTableOptions =  {
  deferRender: true,
  // stateSave: true,
  responsive: true,
  data: [],

  columns: [
    {
      data: 'disposition',
      title: 'Disposition',
      'width': '10%',
      render: function (data, type) {
        if (type === 'display') {
          let badge = (data === 'none') ? 'badge-success' : (data === 'quarantine') ? 'badge-warning' : 'badge-error'
          return `<div class="badge ${badge}">${data}</div> `
        } else {
          return data
        }
      }
    },
    {
      data: 'ip',
      title: 'IP',
      render: function (data, type) {
        if (type === 'display') {
          if (data.ip && data.host) {
            return `<div class="badge badge-info">${data.host}</div> ${data.ip}`
          } else {
            return `<a class="link link-primary underline" href="https://mxtoolbox.com/SuperTool.aspx?action=ptr:${data.ip}&run=toolpage" target="_blank">${data.ip}</a>`
          }
        } else {
          return data.ip
        }
      }
    },
    { data: 'count', title: 'Count' },
    { data: 'identifiers', title: 'Identifiers' },
    { data: 'dkim_domain', title: 'DKIM Domain' },
    { data: 'dkim_selector', title: 'DKIM Selector' },
    {
      data: 'dkim_result',
      title: 'DKIM Result',
      'width': '10%',
      render: function (data, type) {
        if (type === 'display') {
          let badge = (data === 'pass') ? 'badge-success' : 'badge-error'
          return `<div class="badge ${badge}">${data}</div> `
        } else {
          return data
        }
      }
    },
    { data: 'spf_domain', title: 'SPF Domain' },
    {
      data: 'spf_result',
      title: 'SPF Result',
      'width': '10%',
      render: function (data, type) {
        if (type === 'display') {
          let badge = (data === 'pass') ? 'badge-success' : 'badge-error'
          return `<div class="badge ${badge}">${data}</div> `
        } else {
          return data
        }
      }
    },

  ],

  'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
  'columnDefs': [
    {
      targets: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      className: 'dt-center'
    },
  ],
  'order': [[ 2, 'desc' ]],
  'displayLength': 10,
}

const tableOptions = {
	deferRender: true,
	responsive: true,
	// stateSave: true,

  data: [],

	columns: [
    { data: 'domain' },
    // {
    //   title: 'Domain',
    //   data: 'domain',
    //   render: function (data, type) {
    //     // return format(data, 'E dd/MM/yyyy H:mm O')
    //     return `<a class="link link-primary">${data}</a>`
    //   }
    // },
    {
      // title: 'Host',
      data: 'id',
      render: function (data, type, row, meta) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        if (type === 'display') {
          // return `<a class="link link-primary open-item" href="javascript:void(0);" data-item-id=${row.id}>${data}</a>`
          return `<button class="btn btn-ghost  open-item" data-item-id=${data}>
						<!-- Download SVG icon from http://tabler-icons.io/i/eye -->
						<svg xmlns="http://www.w3.org/2000/svg" class="icon" data-item-id=${data} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="2" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>
					</button>`
        } else {
          return data
        }
      }
    },
    {
      title: 'Host',
      data: 'host',
    },
    {
      title: 'Time',
      data: 'timestamp',
      render: function (data, type, row, meta) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        if (type === 'display') {
          // debug('table timestamp', row, meta)
          return format(data, 'PPPP p', {locale: es})
        } else {
          return data
        }
      }
    },
    {
      title: 'None',
      data: 'none',
      'width': '10%',
      render: function (data, type) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        return `<div class="badge badge-success">${data}</div> `
      }
    },
    {
      title: 'Quarantine',
      data: 'quarantine',
      'width': '10%',
      render: function (data, type) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        return `<div class="badge badge-warning">${data}</div> `
      }
    },
    {
      title: 'Reject',
      data: 'reject',
      'width': '10%',
      render: function (data, type) {
        // return format(data, 'E dd/MM/yyyy H:mm O')
        return `<div class="badge badge-error">${data}</div> `
      }
    },
  ],
  'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
	'columnDefs': [
    // {
    //   targets: [1, 2],
    //   className: 'dt-center'
    // },
    {
      targets: [1, 2, 3],
      className: 'dt-center'
    },
    // {
    //   targets: [3, 4, 5],
    //   className: 'dt-body-center'
    // },
    // {
    //   // targets: -1,// not working
    //   targets: [3, 4, 5],
    //   className: 'dt-head-center'
    // },
    { 'visible': false, 'targets': 0 },
    {
      'targets': [4, 5, 6],
      'searchable': false,
      className: 'dt-body-center'
    }
    // { 'visible': false, 'targets': -1 }
  ],
  'order': [[ 2, 'desc' ], [ 0, 'asc' ]],
  'displayLength': 10,
  'drawCallback': function (settings) {
		let els = document.getElementsByClassName('open-item')
    debug('ELS', els)
    Array.each(els, function (el) {
      el.addEventListener('click', function (e) {
        debug('open-item', e.target.dataset.itemId)
        setReportID(e.target.dataset.itemId)
      })
    })

    let api = this.api()
    let rows = api.rows({page: 'current'}).nodes()
    let last = null

    api.column(0, {page: 'current'}).data().each(function (group, i) {
      if (last !== group) {
        jquery(rows).eq(i).before(
          '<tr class="group"><td colspan="6">' + group + '</td></tr>'
        )

        last = group
      }
    })
  }
}

const DS = new Class({
  Extends: dashboard,

  // store: true,
  pipeline_id: ['input.dmarc.periodical'],

	id: 'input.dmarc.periodical',
  path: 'all',
  // refresh: SECOND,
	refresh: MINUTE,
  period: 'daily',

  dmarc: [],

	flatpickr: undefined,

	report_id: undefined,
	report: undefined,
	servers: [],

	components: {
    'all': [
      {
        // some_data: {
        //   dmarc: true
        // },
        source: {
          requests: requests,
          store: store
        }
      }

    ]
  },

	initialize: function(options){
		this.parent(options)

		let allow_filters = /(host|domain)/
    Object.each($router.currentRoute.query, function (data, prop) {
      if (allow_filters.test(prop)) {
        // let selected = data
        debug('created selected_hosts', prop, data)
        if (data) {
          // if (!Array.isArray(data)) data = [data]
					data = data.split(',')
					Array.each(data, function(value){
						filters[prop][value] = true
					})

        } else {
          filters[prop] = {}
        }
      }
    }.bind(this))

		debug('initialize DS', $router.currentRoute.query)
		if ($router.currentRoute.query.report_id && $router.currentRoute.query.report_id !== 'undefined') { this.report_id = decodeURIComponent($router.currentRoute.query.report_id) }

		if ($router.currentRoute.query.start_time && $router.currentRoute.query.start_time !== 'undefined') { this.start_time = $router.currentRoute.query.start_time * 1 }

    if ($router.currentRoute.query.current_time && $router.currentRoute.query.current_time !== 'undefined') {
      this.current_time = $router.currentRoute.query.current_time * 1 - HOUR
    } else {
      this.current_time = Date.now()
    }

		debug('document.getElementById(flatpickr)',document.getElementById('flatpickr'),this.start_time, this.current_time, this.start(), this.end())

		this.flatpickr = flatpickr(document.getElementById('flatpickr'), {
			position: "auto right",
			maxDate: 'today',
			mode: 'range',
			defaultDate: [roundHours(this.start()), roundHours(this.end())],
			onChange: this.setDates.bind(this)
		})
	},
	create_pipelines: function (create_id, next) {
    debug('create_pipelines %o', JSON.parse(JSON.stringify(this.pipelines)), create_id, this.components)

    if (!create_id || create_id === undefined || create_id === this.id) {
      // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[this.id], this.id)
      let components_requests = {}

      if (this.pipelines[this.id]) {
        components_requests = this.__merge_requests(this.id, this.__components_sources_to_requests(this.components, this.id))

        this.destroy_pipelines(this.id)
      } else {
        components_requests = this.__components_sources_to_requests(this.components, this.id)
      }

      let keys = this.components_to_keys(this.components)

      debug('create_pipelines REQUESTS %o', components_requests, keys)

			Array.each(keys, function (key) {
        if (
          EventBus &&
          (
            !EventBus.events['sent:' + this.id + '[' + key + ']'] ||
            (EventBus.events['sent:' + this.id + '[' + key + ']'] && EventBus.events['sent:' + this.id + '[' + key + ']'].length === 0)
            // (EventBus.events[pipeline_id + '.' + this.path] && !EventBus.events[pipeline_id + '.' + this.path].contains(this.__process_input_data))
          )
        ) {
          EventBus.on('sent:' + this.id + '[' + key + ']', function (emit_query) {
            debug('start loader for', emit_query.params.id, emit_query)
          })
          EventBus.on('received:' + this.id + '[' + key + ']', function (payload) {
            debug('stop loader for', payload)
          })
        }
      }.bind(this))

      let clients = []
      Array.each(IO(), function (io, index) {
        clients.push(
          new InputIO({
            requests: components_requests,
            // id: 'input.default' + index,
            id: this.id + index,
            index: index
          })
        )
      }.bind(this))

      let template = Pipeline({
        input: {
          // id: 'input.dmarc',
          id: this.id,

          clients: clients,
          // clients: new InputIO({
          //   requests: components_requests,
          //   id: this.id + 0,
          //   index: 0
          // }),

          // type: 'minute', // second || minute || hour || day || once
          requests: {
            periodical: this.refresh,
            // periodical: function (dispatch) {
            //   // return cron.schedule('14,29,44,59 * * * * *', dispatch);//every 15 secs
            //   return cron.schedule('*/10 * * * * *', dispatch)// every 20 secs
            // },
          },
          suspended: false,
        },

        filters: [DocIDFilter],

        output: [OutputEventbus],

      })
      // debug('TEMPLATE', template)
      //
      // Array.each(template.input[0].clients, function (conn, index) {
      //   template.input[0].clients[index].requests = components_requests
      // })

      debug('TEMPLATE REQs', template)
      let pipe = new JSPipeline(template)

      this.__pipelines_cfg[this.id] = {
        ids: [],
        connected: [],
        suspended: pipe.inputs.every(function (input) {
          debug('input', input)
          return input.options.suspended
        }, this)
      }

      this.pipelines[this.id] = pipe
    }
    debug('create_pipelines %o', this.pipelines)

    if (next) { next() }
  },
  setDmarcData: function(h){
		debug('setDmarcData %o', h)
		if(h && h.length > 0)
			dmarc_data = h
  },
	setDmarcInfo: function(h){
		debug('setDmarcInfo %o', h)
		if(h && h.length > 0)
			dmarc_info = h
  },
	getFilters: function(){
		let _filters = {}
		Object.each(filters, function(val, prop){
			_filters[prop] = Object.keys(Object.filter(filters[prop], function(value, key){
				return value === true;
			}))
		})

		debug('getFilters %o', _filters)
		return _filters
	},
	setDatePickerMinDate: function(ts){
		debug('setDatePickerMinDate', ts)
		// datePickerMinDate = ts
		this.flatpickr.set('minDate', ts)
	},
	setDates: function (dates) {
		// debug('setDates', selectedDates, dateStr, instance)
		// let dates = event.detail[0]
		debug('setDates', dates)
		if (dates.length > 1 && dates[0].getTime() !== dates[1].getTime()) {
			debug('setDates both', dates)
			this.start_time = dates[0].getTime()
			this.current_time = dates[1].getTime() + DAY - MINUTE// + DAY to include full day on selected day
		} else {
			debug('setDates current', dates)
			this.current_time = dates[0].getTime() + DAY - MINUTE// + DAY to include full day on selected day
			this.start_time = undefined
		}

		if ($router.currentRoute.query.start_time !== this.start_time || $router.currentRoute.query.current_time !== this.current_time) {
			$router.replace({ query: { ...$router.currentRoute.query, start_time: this.start_time, current_time: this.current_time}}) //.catch(err => { debug('setDates', err) })
		}

		this.pipelines[this.id].fireEvent('onOnce')
	},
	getReportID: function(){
		return this.report_id
	},
	setReportDoc: function(doc){
		this.report = doc
		let container = document.getElementById('JsonViewer')
    debug('watch report', container, doc)
		reportTableData = []
    report_domain = doc.data.policy.domain
    report_policy = `adkim: ${doc.data.policy.adkim} | aspf: ${doc.data.policy.aspf} | p: ${doc.data.policy.p} | pct: ${doc.data.policy.pct} | sp: ${doc.data.policy.sp}`
    report_email = doc.data.report.email
    report_org = doc.data.report.org

		Object.each(doc.data.records, function (data, disposition) {
      Array.each(data, function (row) {
        let ip = row.ip
        let ip_record = {ip: ip, host: undefined}
        if (this.servers.length > 0) {
          Array.each(this.servers, function (server) {
            let server_ips = []
            Object.each(server.data.networkInterfaces, function (iface) {
              if (Array.isArray(iface)) {
                Array.each(iface, function (_if) {
                  server_ips.push(_if.address)
                })
              } else {
                Array.each(iface.if, function (_if) {
                  server_ips.push(_if.address)
                })
              }
            })

            if (server_ips.contains(ip)) {
              ip_record.host = server.metadata.host
            }
          })
        }

        let reg = {
          disposition: disposition,
          count: row.count,
          ip: ip_record,
          identifiers: JSON.stringify(row.identifiers),
          'dkim_domain': (row.results.dkim && row.results.dkim.domain) ? row.results.dkim.domain : '-',
          'dkim_selector': (row.results.dkim && row.results.dkim.selector) ? row.results.dkim.selector : '-',
          'dkim_result': (row.results.dkim && row.results.dkim.result) ? row.results.dkim.result : '-',
          'spf_domain': (row.results.spf && row.results.spf.domain) ? row.results.spf.domain : '-',
          'spf_result': (row.results.spf && row.results.spf.result) ? row.results.spf.result : '-',
        }

        reportTableData.push(reg)
      }.bind(this))
    }.bind(this))

    if (container !== null && container !== undefined) {
			while (container.lastElementChild) {
				container.removeChild(container.lastElementChild);
			}
      let viewer = new JsonViewer({
        container: container,
        data: JSON.stringify(this.report.data),
        theme: 'light',
        expand: false
      })
    }
	},
	setServers: function(servers){
		this.servers = servers
	}
})

import { onMount } from 'svelte'
let ds

onMount(async () => {
	ds = new DS()
})
</script>

<style>
.dropdown:focus-within .dropdown-menu {
	transform: translate(0) scale(1);
	visibility: visible;
}
</style>
