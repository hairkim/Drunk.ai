from pydantic import BaseModel
from enum import Enum
from datetime import datetime, date
from uuid import UUID

#############################
#BOT DATA TABLES
#############################

class PersonalityType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    DUMB = "dumb"
    STUPID = "stupid"
    NONCHALANT = "nonchalant"

class DrunkLevels(str, Enum):
    SOBER = "sober" #regular chatbot
    TIPSY = "tipsy" #little more outgoing and talkative
    INTOXICATED = "intoxicated" #max confidence, very talkative, maybe bring up some random stuff, forgetful
    HAMMERED = "hammered" #judgement is messed up, maybe become very philosophical but like in a dumb way, maybe down to take more shots automatically
    STUPIFIED = "stupified" #words start to slur, down for anything kind of vibe
    WASTED = "wasted" #down for anything, slurred words are a given, hallucinating
    BLACKED_OUT = "blacked_out" #dont remember (dont save to database)

class BotCreateRequest(BaseModel):
    name: str
    personality: PersonalityType

##################################
#Other data tables
##################################

class ChatHistoryMessage(BaseModel):
    message: str
    isUser: bool

class ChatRequest(BaseModel):
    message: str
    name: str
    personality: PersonalityType
    current_bac: float = 0 #bac levels: 0(sober), 0.05(tipsy), 0.1(intoxicated), 0.15(hammered), 0.2(stupified), 0.25(wasted), 0.3(blacked out)
    drinks_count: int = 0