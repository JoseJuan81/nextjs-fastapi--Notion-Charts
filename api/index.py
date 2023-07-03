import os
import requests

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from requests.structures import CaseInsensitiveDict
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

notion_database_id = os.getenv("NOTION_DATABASE_ID")
notion_api_key = os.getenv("NOTION_API_KEY")

@app.get("/api/tasks")
def tasks_items_from_notion_database():
	urlTasks = f"https://api.notion.com/v1/databases/{notion_database_id}/query"
	Headers = {
		'Authorization': f'Bearer {notion_api_key}',
		'Notion-Version': '2022-06-28',
		'Content-Type': 'application/json',
  }
	Headers_final = CaseInsensitiveDict(Headers)

	data = {
        "filter": {
			"or": [
				{
					"property": "Este Mes",
					"type": "formula",
					"formula": {
						"type": "string",
						"string": {
							"equals": "Si"
						}
					}
				},
			]
		}
	}

	response = requests.post(urlTasks, headers=Headers_final, json=data)

	jsoned = response.json()
	res = jsonable_encoder(jsoned)

	return { "data": res }