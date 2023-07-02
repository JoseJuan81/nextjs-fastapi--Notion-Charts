from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import requests
from requests.structures import CaseInsensitiveDict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

notion_database_id = "aff752bb81c34eb3a71e85f3ae9d124e"
notion_api_key = "secret_guypOW1Pk7tZr9FJxZL5Bz2IR9HEtT9GsgCuRH28hWG"

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