import random


def play():
    user = input("Choos one: rock, paper or siccors.\n").lower()
    pc = random.choice(["rock", "paper", "siccors"])

    if user == pc:
        return "¡Draw!"
    
    if user_win(user, pc):
        return "¡You Win!"
    
    return "¡You Lose!"


def user_win(P1,CPU):
    if ((P1 == "rock" and CPU == "siccors")
        or (P1 == "siccors" and CPU == "paper")
        or (P1 == "paper" and CPU == "rock")):
        return True
    else:
        return False


print(play())

