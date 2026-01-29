from openai import OpenAI
from fastapi import APIRouter, HTTPException
import os
from models import BotCreateRequest, ChatRequest
from route_helpers import get_drunk_level, get_temperature, build_system_prompt, drink

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post('/chat')
async def chat(chatRequest: ChatRequest):
    print("reached here!")
    try:
        drunk_level = get_drunk_level(chatRequest.current_bac) #-> DrunkLevels
        temperature = get_temperature(chatRequest.current_bac) #-> float

        system_prompt = build_system_prompt(chatRequest.name, chatRequest.personality, chatRequest.current_bac, drunk_level) 

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": chatRequest.message}
            ],
            temperature=temperature,
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.post('/drink')
async def drink(current_bac: float):
    new_bac_level = min(drink(current_bac), 0.3)
    return{
        "new_bac": new_bac_level
    }

@router.post('/bot/create')
async def create_bot(botRequest: BotCreateRequest):
    return {
        "name": botRequest.name,
        "personality": botRequest.personality,
        "current_bac": 0,
        "drinks_count": 0
    }
