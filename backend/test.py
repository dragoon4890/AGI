import logging
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from openagi.actions.files import WriteFileAction
from openagi.actions.tools.ddg_search import DuckDuckGoNewsSearch, DuckDuckGoSearch
from openagi.actions.tools.webloader import WebBaseContextTool
from openagi.agent import Admin
from openagi.llms.openai import OpenAIConfigModel, OpenAIModel
from openagi.memory import Memory
from openagi.planner.task_decomposer import TaskPlanner
from openagi.worker import Worker
from rich.console import Console
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allowed origins list for CORS
allowed_origins = [
    "http://localhost:4173",
    "http://localhost:8000",
    "https://localhost:4173"
]

# Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ConfigModel(BaseModel):
    api_key: str
    model: str
    base_url: Optional[str] = None

class WorkerModel(BaseModel):
    role: str
    instructions: str
    actions: List[str]

class QueryModel(BaseModel):
    query: str
    description: str

class TeamConfig(BaseModel):
    workers: List[WorkerModel]

# Initialize variables to store configuration and workers
config: Optional[OpenAIConfigModel] = None
admin: Optional[Admin] = None

@app.post("/config")
async def set_config(config_data: ConfigModel):
    global config, admin
    config = OpenAIConfigModel(
        api_key=config_data.api_key,
        model=config_data.model,
        base_url=config_data.base_url,
    )
    llm = OpenAIModel(config=config)

    admin = Admin(
        planner=TaskPlanner(human_intervene=False),
        memory=Memory(),
        llm=llm,
    )
    return {"message": "Configuration set successfully"}

@app.post("/team")
async def set_team(team_config: TeamConfig):
    global admin
    if not admin:
        raise HTTPException(status_code=400, detail="Config not set")

    workers = []
    for worker_data in team_config.workers:
        worker = Worker(
            role=worker_data.role,
            instructions=worker_data.instructions,
            actions=[globals()[action] for action in worker_data.actions]
        )
        workers.append(worker)

    admin.assign_workers(workers)
    return {"message": "Team configuration set successfully"}

@app.post("/run")
async def run_query(query_data: QueryModel):
    global admin
    if not admin:
        raise HTTPException(status_code=400, detail="Config or team not set")

    try:
        logging.debug(f"Running query: {query_data.query}")
        logging.debug(f"Admin Config: {admin.llm.config}")
        logging.debug(f"Assigned Workers: {admin.workers}")

        res = admin.run(
            query=query_data.query,
            description=query_data.description,
        )

        if res is None:
            logging.error("Received None response from admin.run")
            raise HTTPException(status_code=500, detail="Internal Server Error: Received None response")

        logging.debug(f"Query run successfully, response: {res}")
        return {"response": res}
    except Exception as e:
        logging.error(f"Error running query: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Global exception handler: {exc}")
    return HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/test")
async def run_query(query_data: QueryModel):
    return {
    "response": "```markdown\n**Final Output:** Latest News about Pokemon\n\nThe latest news about Pokemon is centered around"
                " the release of the new open-world games, Pokemon Scarlet and Violet, set in the Paldea region."
                " These games offer more freedom for catching and battling Pokémon, and introduce new features such as auto-trainer battles and Teracrystals. The highly anticipated release date for these games is set for November 18, 2022.\n```"
}

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
