import React from 'react'

const getDataBaseItems = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/tasks", {
		cache: "no-store"
	})
    return res.json()
}

export default async function Notion() {
	const { data } = await getDataBaseItems();
	
	return (
		<div>
			Pagina para mostrar datos de Notion y un grafico ++++++++++++

			{ JSON.stringify(data) }
		</div>
  	)
}
