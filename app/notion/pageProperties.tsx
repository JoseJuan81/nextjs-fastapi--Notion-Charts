'use client'

import React from 'react'

export const PageProperties = ({ properties }) => {
	return (
		<ul>
			{properties.map((prop, index) => (
				<li key={index + Date.now()}>{prop}</li>
			))}
		</ul>
	)
}
