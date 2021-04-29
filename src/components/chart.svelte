
{#if _chart !== undefined && _chart.chart_initialized === true}
<Inview
  let:inView
  wrapper={ref}
	rootMargin="40px"
	on:enter={(event) => {
		debug('on:enter visibilityChanged', event)
    _chart.visibilityChanged(true, event)
  }}
  on:leave={(event) => {
		debug('on:leave visibilityChanged', event)
    _chart.visibilityChanged(false, event)
  }}>
  <div bind:this={ref}>
		<svelte:component
			this={wrapper.type}
			id="{id}"
			EventBus="{EventBus}"
			{...Object.merge(
				Object.clone(wrapper.props),
				{
					config,
					'length': (config.interval) ? dataset.length * config.interval : undefined
				}
			)}
		/>
	</div>


</Inview>


	<!-- {...chart.bindProps()} -->
{/if}


<script>
import * as Debug from 'debug'
const debug = Debug('components:chart')
debug.log = console.log.bind(console) // don't forget to bind to console!

import Inview from 'svelte-inview'
let ref


import chartTabular from '@mixins/chart.tabular'
import chart from '@mixins/chart'

export let type = 'dataset'

let ChartConstructor = (type === 'tabular') ? chartTabular : chart
export let id = undefined
export let EventBus = undefined
export let config = {
	interval: 1
}
export let reactive = false
export let wrapper = {
	// type: 'dygraph',
	type: undefined,
	props: {}
}
export let always_update = false
export let buffer = true
export let dataset = {} // value to "watch"

let old_dataset = {}
let old_wrapper = {}

$: if (dataset !== old_dataset) {
	debug('changed dataset', dataset)
	if(_chart && typeof _chart.update_dataset_data === 'function')
		_chart.update_dataset_data(dataset.data)

  old_dataset = dataset
}

$: if (JSON.stringify(wrapper) !== JSON.stringify(old_wrapper)) {
	debug('changed wrapper %s / %s', JSON.stringify(wrapper), JSON.stringify(old_wrapper))
	if(_chart !== undefined){
		_chart.destroy()
		_chart = new ChartConstructor({
			id,
			EventBus,
			config,
			reactive,
			wrapper,
			always_update,
			buffer
		})
	}
	old_wrapper = wrapper
}

let _chart = undefined
// let chart_initialized = false
import { onMount } from 'svelte'
import { onDestroy } from 'svelte'


onMount(() => {
	debug('onMount', _chart)
	// if(_chart === undefined)
		_chart = new ChartConstructor({
			id,
			EventBus,
			config,
			reactive,
			wrapper,
			always_update,
			buffer
		})
});

onDestroy(() => {
	_chart.destroy()
});
</script>
