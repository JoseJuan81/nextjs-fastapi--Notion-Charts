'use client';

import React from 'react'
import { ChartComponent } from './chartComponent';
import { PageProperties } from './pageProperties';

const getDataBaseItems = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/tasks", {
		cache: "no-store"
	})
    return response.json()
}

export default async function Notion() {
	const { data: { results: pages } } = await getDataBaseItems();
	const  pageProperties = getPropertiesFromNotionPage(pages)
	return (
		<div className='
			flex gap-4
		'>
			<PageProperties properties={pageProperties} />
			<ChartComponent pages={ pages } />

		{/* <ul>
			{ pages && pages.map((page:any, ind:number) => {
				//const pageTitle = getPropertysValue("Name.title[0].text.content", page) as string
				const pageTitle = getPropertysValue("properties.Name.title[0].text.content", page) as string
				const pageStatus = getPropertysValue("properties.Estado.select.name", page)
				const pageDuration = getPropertysValue("properties['Duración (min)'].number", page)
					return <li key={`${ind}-${Date.now()}`}>
						<span>{pageTitle}</span>
						<span>====</span>
						<span>{pageStatus}</span>
						<span>====</span>
						<span>{pageDuration}</span>
					</li>
			})}
		</ul> */}
		</div>
  	)
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

const getPropertiesFromNotionPage = (pages) => {
	const [page] = pages;
	const props = Object.keys(page.properties)
	return props;
}
