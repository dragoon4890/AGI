from fastapi import FastAPI, HTTPException
import json
from openagi.init_agent import kickOffAgents
from openagi.tools.integrations import DuckDuckGoSearchTool, GithubSearchTool, GmailSearchTool
from openagi.llms.azure import AzureChatConfigModel, AzureChatOpenAIModel
from openagi.llms.openai import OpenAIConfigModel, OpenAIModel

app = FastAPI()

# Function to load configuration from JSON
def load_config_from_json(json_input):
    config = json.loads(json_input)
    return config



# Initialize LLM based on configuration
def initialize_llm(config):
    llm_config = config.get("llm_config", {})
    if llm_config.get("type") == "openai":
        llm = OpenAIModel(config=OpenAIConfigModel(**llm_config))
    elif llm_config.get("type") == "azure":
        llm = AzureChatOpenAIModel(config=AzureChatConfigModel(**llm_config))
    else:
        raise ValueError("Unsupported LLM type")
    return llm

class Agent:
    def __init__(self, agent_data):
        self.agentName = agent_data["agentName"]
        self.role = agent_data["role"]
        self.goal = agent_data["goal"]
        self.backstory = agent_data["backstory"]
        self.capability = agent_data["capability"]
        self.task = agent_data["task"]
        self.output_consumer_agent = agent_data["output_consumer_agent"]
        self.tools_list = [globals()[tool] for tool in agent_data.get("tools_list", [])]

# Define FastAPI endpoints
@app.post("/initialize_agents/")
async def initialize_agents(json_input: dict):
    config = load_config_from_json(json_input)
    llm = initialize_llm(config)
    agent_list = [Agent(agent_data) for agent_data in config.get("agents", [])]
    kickOffAgents(agent_list, [agent_list[0]], llm=llm)
    return {"message": "Agents initialized successfully."}
