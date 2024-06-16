from openagi.actions.files import WriteFileAction
from openagi.actions.tools.ddg_search import DuckDuckGoNewsSearch, DuckDuckGoSearch
from openagi.actions.tools.webloader import WebBaseContextTool
from openagi.agent import Admin
from openagi.llms.openai import OpenAIConfigModel,OpenAIModel
from openagi.memory import Memory
from openagi.planner.task_decomposer import TaskPlanner
from openagi.worker import Worker
from rich.console import Console
from rich.markdown import Markdown

from langchain_google_genai import ChatGoogleGenerativeAI

if __name__ == "__main__":
    # config = OpenAIConfigModel(
    #     api_key='lm-studio',
    #     model="",
    #     base_url=""
    # )
    config = OpenAIConfigModel(
        api_key='',
        model="",
        base_url=""
    )
    llm = OpenAIModel(config=config)

    # Team Members
    researcher = Worker(
        role="Research Analyst",
        instructions="Uncover cutting-edge developments in AI and data science. You work at a leading tech think tank. Your expertise lies in identifying emerging trends. You have a knack for dissecting complex data and presenting actionable insights.",
        actions=[
            DuckDuckGoNewsSearch,
            WebBaseContextTool,
        ],
    )
    writer = Worker(
        role="Tech Content Strategist",
        instructions="Craft compelling content on tech advancements. You are a renowned Content Strategist, known for your insightful and engaging articles.You transform complex concepts into compelling narratives. Finally return the entire article as output.",
        actions=[
            DuckDuckGoNewsSearch,
            WebBaseContextTool,
        ],
    )
    reviewer = Worker(
        role="Review and Editing Specialist",
        instructions="Review the content for clarity, engagement, grammatical accuracy, and alignment with company values and refine it to ensure perfection. A meticulous editor with an eye for detail, ensuring every piece of content is clear, engaging, and grammatically perfect. Finally write the blog post to a file and return the same as output.",
        actions=[
            DuckDuckGoNewsSearch,
            WebBaseContextTool,
            WriteFileAction,
        ],
    )

    # Team Manager/Admin
    admin = Admin(
        # actions=[DuckDuckGoSearch],
        planner=TaskPlanner(human_intervene=False),
        memory=Memory(),
        llm=llm,
    )
    admin.assign_workers([researcher, writer, reviewer])

    res = admin.run(
        query="Potential use of AI in catching pokemons",
        description="Conduct a comprehensive analysis of the latest advancements in AI in 2024. Identify key trends, breakthrough technologies, and potential industry impacts. Using the insights provided, develop an engaging blog post that highlights the most significant AI advancements. Your post should be informative yet accessible, catering to a tech-savvy audience. Make it sound cool, avoid complex words so it doesn't sound like AI.",
    )

    # Print the results from the OpenAGI
    print("-" * 100)  # Separator
    Console().print(res)