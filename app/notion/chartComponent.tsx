'use client'

import React from 'react'
import * as d3 from 'd3';

// obtener las propiedades a usar en el pie de la url
export const ChartComponent = ({ pages }) => {
	const width = 400;
	const height = 400;

	const groupPagesBy = getGroupBy("Estado", pages)
	const pie = d3.pie().value((d:groupedType) => d.quantity)
	const arcs = pie(groupPagesBy);
	const arc = d3.arc().innerRadius(width/5).outerRadius(Math.min(width, height)/2);
	const color = d3.scaleOrdinal()
      .domain([0, d3.max(groupPagesBy, (d:groupedType) => d.quantity)])
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.98 + 0.1), groupPagesBy.length).reverse());

	return (
		<svg width={width} height={height}>
			<g transform={`translate(${width/2}, ${height/2})`}>
				{arcs.map((d, i) => (
					<path key={i} d={arc(d)} fill={d3.schemeCategory10[i]}/>
				))}
			</g>
		</svg>
	)
}

type groupedType = { prop: string, quantity: number }
type getGroupByPropsFn = (prop:string, pages:[any]) => [groupedType]
const getGroupBy: getGroupByPropsFn = (prop, pages) => {
	const result = pages.reduce((acc, page) => {
		const propValue = getPropertysValue("properties.Estado.select.name", page) as string
		const ele = acc.find((el:groupedType) => el.prop === propValue) as groupedType
		if (ele) {
			ele.quantity += 1
		} else {
			acc.push({ prop: propValue, quantity: 1} as groupedType)
		}

		return acc;
	}, [{ prop: '', quantity: 0 }] as [groupedType])

	const [first, ...rest] = result
	return rest

}

const getPropertysValue = function (nestedProp, obj) {
	var propFlow = nestedProp.split('.');
  
	var newItem = { ...obj };
  
	propFlow.forEach(function (el) {
		const regArray = /[[]+[\d]+[\]]/g
		const regWordObj = /\['([^']+)']/g
		
		const isArrayItem = el.match(regArray)
		const isObj = el.match(regWordObj)

		if (isArrayItem) {
			const [base, rest] = el.split("[")
			const index = Number(rest.at(0))
			const arr = (newItem || {})[base]
			newItem = arr[index]
		} else if (isObj) {
			const [base] = el.split("[")
    		const [prop] = isObj.map((match:string) => match.slice(2, -2))
			newItem = (newItem || {})[base]
			newItem = (newItem || {})[prop]
		} else {

			newItem = (newItem || {})[el];
		}
	});
	return newItem;
};
